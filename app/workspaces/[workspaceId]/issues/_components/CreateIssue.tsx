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

type ButtonProps = ComponentProps<typeof Button>;
type CommonBtn = Pick<ButtonProps, "onClick" | "variant" | "size">;

type Props = {
  hasSpace?: boolean;
  hasText?: boolean;
};

export const CreateIssue = ({ hasSpace = false, hasText = true }: Props) => {
  const [open, setOpen] = useState(false);

  const baseButtonProps: CommonBtn = {
    onClick: () => setOpen(true),
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
        <DialogContent className="relative mx-4">
          <Flex justify="between" align="center" mb="4">
            <Text>Create issue</Text>
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
