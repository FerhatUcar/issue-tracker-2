"use client";

import { Dispatch, SetStateAction, useState } from "react";
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

type Props = {
  workspaceId: string;
  open: boolean;
  action: Dispatch<SetStateAction<boolean>>;
};

export const InviteMember = ({ workspaceId, open, action }: Props) => {
  const { mutateAsync, isPending, isError } = useInviteMember();
  const [apiError, setApiError] = useState("");
  const { data: members = [] } = useDataQuery<Member>(
    "workspace-members",
    workspaceId,
  );

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
            action(false);
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
    action(false);
    reset();
    setApiError("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={action}>
      <Dialog.Content className="mx-4">
        <Dialog.Title>Invite member</Dialog.Title>

        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="3">
            <TextField.Root
              placeholder="User's email address"
              {...register("email")}
            />

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
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>

              <Button type="submit" disabled={isPending}>
                {isPending ? "Sending..." : "Invite"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
