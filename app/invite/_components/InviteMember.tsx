"use client";

import { useState, PropsWithChildren } from "react";
import {
  Dialog,
  Button,
  Flex,
  TextField,
  Text,
} from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Voer een geldig e-mailadres in"),
});

type FormData = z.infer<typeof schema>;

type Props = PropsWithChildren<{
  workspaceId: string;
}>;

export const InviteMember = ({ workspaceId, children }: Props) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post(`/api/workspaces/${workspaceId}/invite`, data);
      toast.success("Uitnodiging verstuurd!");
      setOpen(false);
      reset();
    } catch (err) {
      toast.error("Fout bij versturen van uitnodiging");
      console.error(err);
    }
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 400 }}>
        <Dialog.Title>Lid uitnodigen</Dialog.Title>

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

            <Flex gap="4" mt="4" justify="end" align="center">
              <Dialog.Close>
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
