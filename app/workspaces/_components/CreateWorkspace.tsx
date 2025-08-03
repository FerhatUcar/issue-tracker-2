"use client";

import { useState, PropsWithChildren } from "react";
import { Button, Dialog, Flex, TextField, Text } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateWorkspace } from "@/app/hooks/use-create-workspace";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(3, "Naam moet minstens 3 tekens bevatten"),
});

type FormData = z.infer<typeof schema>;

export const CreateWorkspace = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutateAsync } = useCreateWorkspace();

  const {
    register,
    handleSubmit,
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
    } catch (err) {
      console.error("Fout bij aanmaken van workspace:", err);
    }
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 400 }}>
        <Dialog.Title>Create new workspace</Dialog.Title>

        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="3">
            <TextField.Root>
              <TextField.Input
                placeholder="Name of the workspace"
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
