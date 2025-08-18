"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Box, Button, DialogContent, Flex, IconButton, Text } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";
import { AiFillPlusCircle } from "react-icons/ai";
import { IssueForm } from "./IssueForm";

type Props = {
  hasSpace?: boolean;
};

export const CreateIssue = ({ hasSpace = false }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Box className={hasSpace ? "my-4" : "mt-4"}>
      <Button
        onClick={() => setOpen(true)}
        className="w-full justify-start mt-3"
        variant="soft"
        size="3"
      >
        <AiFillPlusCircle />
        Create new issue
      </Button>

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
