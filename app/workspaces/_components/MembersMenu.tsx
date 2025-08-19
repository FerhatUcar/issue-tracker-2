"use client";

import { DropdownMenu, IconButton, Text } from "@radix-ui/themes";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { DeleteMember } from "@/app/workspaces/_components";
import { promoteToAdmin } from "@/app/workspaces/actions";
import { PiCrownDuotone } from "react-icons/pi";

type Props = {
  /**
   * Workspace ID
   * */
  workspaceId: string;

  /**
   * User ID
   * */
  userId: string;

  /**
   * Name of the user
   * */
  userName: string;

  /**
   * Callback function to be called when the user clicks the "Promote to admin" button.
   */
  onPromote?: () => void;
};

export const MembersMenu = ({
  workspaceId,
  userId,
  userName,
  onPromote,
}: Props) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <IconButton variant="ghost" color="gray" size="3" aria-label="Actions">
        <DotsVerticalIcon />
      </IconButton>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content
      align="end"
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
        <form
          action={promoteToAdmin}
          onSubmit={() => {
            onPromote?.();
          }}
        >
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <button
            type="submit"
            className="flex w-full items-center gap-2 text-left"
          >
            <PiCrownDuotone size={18} />
            <Text>Promote to admin</Text>
          </button>
        </form>
      </DropdownMenu.Item>

      <DeleteMember
        userId={userId}
        userName={userName}
        workspaceId={workspaceId}
      />
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);
