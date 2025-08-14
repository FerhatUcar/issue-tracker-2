"use client";

import { DropdownMenu, Flex, IconButton, Text } from "@radix-ui/themes";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { DeleteMember } from "@/app/workspaces/_components";
import { promoteToAdmin } from "@/app/workspaces/actions";
import { PiCrownDuotone } from "react-icons/pi";

type Props = {
  workspaceId: string;
  userId: string;
  userName: string;
};

export const MemberActionsMenu = ({ workspaceId, userId, userName }: Props) => (
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
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form action={promoteToAdmin}>
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="workspaceId" value={workspaceId} />
        <DropdownMenu.Item asChild>
          <button type="submit">
            <Flex align="center" gap="2">
              <PiCrownDuotone size={18} />
              <Text>Promote to admin</Text>
            </Flex>
          </button>
        </DropdownMenu.Item>
      </form>

      <DeleteMember
        userId={userId}
        userName={userName}
        workspaceId={workspaceId}
      />
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);
