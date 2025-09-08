"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Button,
  DialogContent,
  Flex,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { Cross2Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { IssueForm } from "@/app/workspaces/[workspaceId]/issues/_components/IssueForm";
import { type Issue } from "@prisma/client";

type Props = {
  issue: Partial<Issue>;
};

export const EditIssue = ({ issue }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="w-full" variant="soft" onClick={() => setOpen(true)}>
        <Pencil2Icon />
        Edit
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <DialogContent className="relative mx-4">
          <Flex justify="between" align="center" mb="4">
            <Text>Edit issue</Text>

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

          <IssueForm issue={issue} action={() => setOpen(false)} />
        </DialogContent>
      </Dialog.Root>
    </>
  );
};
