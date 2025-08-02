"use client";

import { useState } from "react";
import { Button, Dialog, Flex, TextField, Text } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(3, "Naam moet minstens 3 tekens bevatten"),
});

type FormData = z.infer<typeof schema>;

type Props = {
  children: React.ReactNode;
};

export const CreateWorkspace = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: (data: FormData) => axios.post("/api/workspaces", data),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await mutateAsync(data);
      const newWorkspaceId = res.data.id;

      router.push(`/workspaces/${newWorkspaceId}`);
      setOpen(false);
    } catch (err) {
      console.error("Fout bij aanmaken van workspaces:", err);
    }
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        {children}
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 400 }}>
        <Dialog.Title>Nieuwe Workspace</Dialog.Title>

        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="3">
            <TextField.Root>
              <TextField.Input placeholder="Naam van workspace" {...register("name")} />
            </TextField.Root>
            {errors.name && (
              <Text color="red" size="1">
                {errors.name.message}
              </Text>
            )}

            <Flex gap="4" mt="4" justify="end" align="center">
              <Dialog.Close>
                <Button type="button" variant="ghost">
                  Annuleer
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isSubmitting}>
                Aanmaken
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};