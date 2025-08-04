"use client";

import { PropsWithChildren, useState } from "react";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useDataQuery, useInviteMember } from "@/app/hooks";

const schema = z.object({
  email: z.string().email("Voer een geldig e-mailadres in"),
});

type FormData = z.infer<typeof schema>;

type Member = {
  email: string;
  accepted: boolean;
};

type ApiErrorResponse = {
  error: string;
};

type Props = PropsWithChildren<{
  workspaceId: string;
}>;

export const InviteMember = ({ workspaceId, children }: Props) => {
  const { mutateAsync } = useInviteMember();
  const { data: members = [] } = useDataQuery<Member>(
    "workspace-members",
    workspaceId,
  );
  const [open, setOpen] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setApiError("");

    const existing = members.find(({ email }) => email === data.email);

    if (existing?.accepted) {
      setApiError("This user is already a member of this workspace.");
      return;
    }

    if (existing && !existing.accepted) {
      setApiError(
        "This user has already been invited but has not yet accepted the invitation.",
      );
      return;
    }

    try {
      await mutateAsync(
        { workspaceId, email: data.email },
        {
          onSuccess: () => {
            toast.success("Invitation sent!");
            setOpen(false);
            reset();
          },
        },
      );
    } catch (err: unknown) {
      // backup check when backend wants also to verify a user is added
      if (err instanceof AxiosError && err.response?.data) {
        const errorData = err.response.data as ApiErrorResponse;

        if (errorData.error) {
          setApiError(errorData.error);
        } else {
          toast.error("Error sending invitation");
        }
      } else {
        toast.error("Error sending invitation");
      }
    }
  });

  const handleCancel = () => {
    setOpen(false);
    reset();
    setApiError("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 400 }}>
        <Dialog.Title>Lid uitnodigen</Dialog.Title>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="3">
            <TextField.Root>
              <TextField.Input
                placeholder="E-mailadres van gebruiker"
                {...register("email")}
              />
            </TextField.Root>

            {errors.email && (
              <Text color="red" size="1">
                {errors.email.message}
              </Text>
            )}

            {apiError && (
              <Text color="red" size="1">
                {apiError}
              </Text>
            )}

            <Flex gap="4" mt="4" justify="end" align="center">
              <Dialog.Close onClick={handleCancel}>
                <Button type="button" variant="ghost">
                  Annuleer
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isSubmitting}>
                Uitnodigen
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
