"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { TextField, Button, Flex, Text } from "@radix-ui/themes";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Geef een geldig e-mailadres op"),
});

type FormData = z.infer<typeof schema>;

type Props = {
  workspaceId: string;
};

export const InviteForm = ({ workspaceId }: Props) => {
  const [isSending, setIsSending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSending(true);
      await axios.post(`/api/workspaces/${workspaceId}/invite`, data);
      toast.success("Uitnodiging verstuurd!");
    } catch (error) {
      toast.error("Fout bij versturen uitnodiging.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="3" mt="4">
        <TextField.Input placeholder="E-mailadres" {...register("email")} />
        {errors.email && <Text color="red">{errors.email.message}</Text>}

        <Button type="submit" disabled={isSending}>
          Verstuur uitnodiging
        </Button>
      </Flex>
    </form>
  );
};
