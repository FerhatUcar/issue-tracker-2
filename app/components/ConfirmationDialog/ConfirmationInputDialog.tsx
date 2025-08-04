"use client";

import { ReactNode, useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Button,
  Code,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = {
  confirmation: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | ReactNode;
  confirmLabel: string;
  confirmInputValue: string;
  onConfirm: () => void;
  loading?: boolean;
};

export const ConfirmationInputDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmInputValue,
  onConfirm,
  loading = false,
}: Props) => {
  const schema = useMemo(
    () =>
      z.object({
        confirmation: z.string().refine((val) => val === confirmInputValue, {
          message: `You must type "${confirmInputValue}" to confirm`,
        }),
      }),
    [confirmInputValue],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = handleSubmit(() => {
    onConfirm();
    handleClose();
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {description} <Code>{confirmInputValue}</Code> to confirm.
        </DialogDescription>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="3" mt="4">
            <TextField.Root>
              <TextField.Input
                placeholder={`Type "${confirmInputValue}"`}
                {...register("confirmation")}
                disabled={loading || isSubmitting}
              />
            </TextField.Root>

            {errors.confirmation && (
              <Text color="red" size="1">
                {errors.confirmation.message}
              </Text>
            )}

            <Flex justify="end" gap="3" mt="2">
              <Dialog.Close asChild>
                <Button type="button" variant="soft">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                variant="solid"
                color="red"
                disabled={loading || isSubmitting || !isValid}
              >
                {loading ? "Deleting..." : confirmLabel}
              </Button>
            </Flex>
          </Flex>
        </form>
      </DialogContent>
    </Dialog.Root>
  );
};
