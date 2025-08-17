"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Box, Button, DialogContent, DialogTitle } from "@radix-ui/themes";
import { AiFillPlusCircle } from "react-icons/ai";
import { IssueForm } from "./IssueForm";

export const CreateIssueDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box className="m-4">
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
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogTitle>Create issue</DialogTitle>
          <IssueForm />
        </DialogContent>
      </Dialog.Root>
    </Box>
  );
};
