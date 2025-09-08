"use client";

import { useState } from "react";
import { ConfirmationDialog } from "@/app/components/ConfirmationDialog";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDeleteMember } from "@/app/hooks";
import { DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { FaTrash } from "react-icons/fa";

type Props = {
  /**
   * User ID
   */
  userId: string;

  /**
   * Name of the user
   */
  userName: string;

  /**
   * A unique identifier for a workspace.
   */
  workspaceId: string;
};

export const DeleteMember = ({ userId, userName, workspaceId }: Props) => {
  const router = useRouter();
  const { mutate } = useDeleteMember();
  const [open, setOpen] = useState(false);

  const handleKick = () => {
    mutate(
      { userId, workspaceId },
      {
        onSuccess: () => {
          toast.success(`${userName} deleted successfully.`);
          router.refresh();
        },
      },
    );
  };

  const handleOnSelect = (e: Event) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <DropdownMenu.Item onSelect={handleOnSelect}>
        <Flex align="center" gap="2" className="ml-0.5">
          <FaTrash aria-hidden />
          <Text>Delete member</Text>
        </Flex>
      </DropdownMenu.Item>

      <ConfirmationDialog
        title={`Delete ${userName}?`}
        description="Are you sure you want to delete this member?"
        onConfirm={handleKick}
        open={open}
        action={setOpen}
      />
    </>
  );
};
