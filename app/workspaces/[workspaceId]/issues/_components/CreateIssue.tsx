"use client";

import { type ComponentProps, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Box,
  Button,
  DialogContent,
  Flex,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";
import { AiFillPlusCircle } from "react-icons/ai";
import { IssueForm } from "./IssueForm";
import { IoTicketOutline } from "react-icons/io5";

const preloadMDE = () => import("react-simplemde-editor");

type ButtonProps = ComponentProps<typeof Button>;
type CommonBtn = Pick<ButtonProps, "onClick" | "variant" | "size">;

type Props = {
  /**
   * Whether to add space between the button and the form.
   * @default false
   */
  hasSpace?: boolean;

  /**
   * Whether to show the button with text.
   * @default true
   */
  hasText?: boolean;
};

export const CreateIssue = ({ hasSpace = false, hasText = true }: Props) => {
  const [open, setOpen] = useState(false);

  const baseButtonProps: CommonBtn = {
    onClick: () => {
      void preloadMDE();
      setOpen(true);
    },
    variant: "soft",
    size: "3",
  };

  return (
    <Box className={hasSpace ? "my-4" : ""}>
      {hasText ? (
        <Button className="w-full justify-start mt-3" {...baseButtonProps}>
          <AiFillPlusCircle />
          Create new issue
        </Button>
      ) : (
        <IconButton {...baseButtonProps}>
          <AiFillPlusCircle />
        </IconButton>
      )}

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined} className="relative mx-4">
          <Flex justify="between" align="center" mb="4">
            <Dialog.DialogTitle>
              <Flex align="center" gap="2">
                <IoTicketOutline size="20" />
                <Text>Create issue</Text>
              </Flex>
            </Dialog.DialogTitle>

            <Dialog.Close asChild>
              <IconButton
                aria-label="Close dialog"
                variant="ghost"
                size="1"
                color="gray"
              >
                <Cross2Icon />
              </IconButton>
            </Dialog.Close>
          </Flex>
          <IssueForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog.Root>
    </Box>
  );
};
