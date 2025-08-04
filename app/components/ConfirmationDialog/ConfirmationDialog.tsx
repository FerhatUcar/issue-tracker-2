"use client";

import React, { MouseEventHandler } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Box,
  Button,
  DialogContent,
  DialogDescription,
  DialogTitle,
  IconButton,
} from "@radix-ui/themes";
import { FaTrash } from "react-icons/fa";

type Props = {
  /**
   * Represents the title or heading of a content or resource.
   * Typically used to provide a descriptive label or summary.
   */
  title: string;

  /**
   * A string variable that provides a textual description.
   */
  description: string;

  /**
   * Event handler triggered when a confirmation action occurs, typically
   * associated with a button click event.
   *
   * This property represents a function that handles mouse events on a button
   * element. It is invoked when the user confirms their intent through a user
   * interface element, such as a button.
   *
   * Type: MouseEventHandler<HTMLButtonElement> | undefined
   */
  onConfirm: MouseEventHandler<HTMLButtonElement> | undefined;
};

export const ConfirmationDialog = ({
  title = "Are you sure?",
  description = "You can't revert this action.",
  onConfirm,
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
          <FaTrash />
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
            <Button variant="soft">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button color="red" onClick={onConfirm}>
              Delete
            </Button>
          </Dialog.Close>
        </Box>
      </DialogContent>
    </Dialog.Root>
  );
};
