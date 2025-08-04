"use client";

import { PropsWithChildren, useState } from "react";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateWorkspace } from "@/app/hooks/use-create-workspace";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
});

type FormData = z.infer<typeof schema>;

export const CreateWorkspace = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutateAsync } = useCreateWorkspace();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync(data, {
        onSuccess: (res) => {
          setOpen(false);
          router.push(`/workspaces/${res.id}`);
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error: string }>;

        if (axiosError.response?.data?.error) {
          setError("name", {
            type: "manual",
            message: "A workspace with this name already exists.",
          });
        } else {
          toast.error("Unexpected error while creating workspace.");
        }
      } else {
        toast.error("Unexpected error while creating workspace.");
      }
    }
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 400 }}>
        <Dialog.Title>Create new workspace</Dialog.Title>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="3">
            <TextField.Root>
              <TextField.Input
                placeholder="Workspace name"
                {...register("name")}
              />
            </TextField.Root>

            {errors.name && (
              <Text color="red" size="1">
                {errors.name.message}
              </Text>
            )}

            <Flex gap="4" mt="4" justify="end" align="center">
              <Dialog.Close>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isSubmitting}>
                Create
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
