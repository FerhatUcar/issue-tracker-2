"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@radix-ui/themes";
import { RiMore2Line } from "react-icons/ri";
import Link from "next/link";
import { DeleteWorkspaceButton } from "@/app/workspaces/_components";

type Props = {
  workspaceId: string;
  workspaceName: string;
  isAdmin: boolean;
};

export const WorkspaceActionsDropdown = ({
  workspaceId,
  workspaceName,
  isAdmin,
}: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="soft" size="3">
          <RiMore2Line /> Actions
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item asChild>
          <Link href={`/workspaces/${workspaceId}/members`}>
            <Button variant="soft" size="3">
              👥 View Members
            </Button>
          </Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Link href={`/workspaces/${workspaceId}/issues/list`}>
            <Button variant="soft" size="3">
              🎫 Issues
            </Button>
          </Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Button
            variant="soft"
            size="3"
            onClick={() => {
              // placeholder of modal trigger
              alert("Invite modal open (to implement)");
            }}
          >
            ➕ Invite Member
          </Button>
        </DropdownMenu.Item>

        {isAdmin && (
          <>
            <DropdownMenu.Separator />
            <DropdownMenu.Item asChild>
              <DeleteWorkspaceButton
                workspaceId={workspaceId}
                workspaceName={workspaceName}
                isAdmin={true}
              />
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
