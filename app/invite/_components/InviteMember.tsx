"use client";

import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useDataQuery, useInviteMember } from "@/app/hooks";

const schema = z.object({
  email: z.string().email("Enter valid email address"),
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
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}>;

export const InviteMember = ({
  workspaceId,
  open,
  onOpenChange,
  children,
}: Props) => {
  const { mutateAsync, isLoading, isError } = useInviteMember();
  const { data: members = [] } = useDataQuery<Member>(
    "workspace-members",
    workspaceId,
  );
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
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
            onOpenChange(false);
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
    onOpenChange(false);
    reset();
    setApiError("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content className="mx-4">
        <Dialog.Title>Invite member</Dialog.Title>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="3">
            <TextField.Root>
              <TextField.Input
                placeholder="User's email address"
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

            {isError && !apiError && (
              <Text color="red" size="1">
                Something went wrong while sending the invitation.
              </Text>
            )}

            <Flex gap="4" mt="4" justify="end" align="center">
              <Dialog.Close onClick={handleCancel}>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Dialog.Close>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Invite"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
