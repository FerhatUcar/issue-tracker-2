"use client";

import { ConfirmationDialog } from "@/app/components/ConfirmationDialog";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDeleteMember } from "@/app/hooks";

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

  return (
    <ConfirmationDialog
      title={`Delete ${userName}?`}
      description="Are you sure you want to delete this member?"
      onConfirm={handleKick}
    />
  );
};
