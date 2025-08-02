"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  Button,
  IconButton, Box
} from "@radix-ui/themes";
import { FaTrash } from "react-icons/fa";

type Props = {
  onConfirm: () => void;
  triggerLabel?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  title?: string;
  description?: string;
};

export const DeleteConfirmationDialog = ({
  onConfirm,
  triggerLabel = <FaTrash />,
  confirmText = "Verwijderen",
  cancelText = "Annuleren",
  title = "Weet je het zeker?",
  description = "Deze actie kan niet ongedaan worden gemaakt.",
}: Props) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <IconButton
          size="1"
          color="gray"
          variant="ghost"
          className="text-gray-800 dark:text-white hover:bg-transparent"
          title="Delete"
        >
          {triggerLabel}
        </IconButton>
      </Dialog.Trigger>

      <DialogContent
        className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg z-50"
        style={{ maxWidth: 400 }}
      >
        <DialogTitle className="text-lg font-semibold mb-2">
          {title}
        </DialogTitle>
        <DialogDescription className="text-sm mb-4">
          {description}
        </DialogDescription>

        <Box className="flex justify-end gap-3 mt-4">
          <Dialog.Close asChild>
            <Button variant="soft">{cancelText}</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button color="red" onClick={onConfirm}>
              {confirmText}
            </Button>
          </Dialog.Close>
        </Box>
      </DialogContent>
    </Dialog.Root>
  );
};
