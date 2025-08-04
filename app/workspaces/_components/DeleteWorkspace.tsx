"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteWorkspace } from "@/app/hooks";
import { Button } from "@radix-ui/themes";
import { ConfirmationInputDialog } from "@/app/components";
import { FaTrash } from "react-icons/fa";

type Props = {
  workspaceId: string;
  workspaceName: string;
  isAdmin: boolean;
};

export const DeleteWorkspaceButton = ({
  workspaceId,
  workspaceName,
  isAdmin,
}: Props) => {
  const [open, setOpen] = useState(false);
  const { mutate, isLoading } = useDeleteWorkspace();
  const router = useRouter();

  if (!isAdmin) {
    return null;
  }

  const handleConfirm = () => {
    mutate(workspaceId, {
      onSuccess: () => {
        router.push("/workspaces");
      },
    });
  };

  return (
    <>
      <Button size="3" variant="soft" color="red" onClick={() => setOpen(true)}>
        <FaTrash />
      </Button>
      <ConfirmationInputDialog
        open={open}
        onOpenChange={setOpen}
        confirmLabel="Delete"
        confirmInputValue="DELETE"
        title={`Delete ${workspaceName}`}
        description="This will permanently delete the workspace. Type"
        loading={isLoading}
        onConfirm={handleConfirm}
      />
    </>
  );
};
