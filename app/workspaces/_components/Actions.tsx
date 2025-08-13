"use client";

import { Button, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { RiMore2Line } from "react-icons/ri";
import Link from "next/link";
import { IoTicketOutline } from "react-icons/io5";
import { FaTrash, FaUserGroup } from "react-icons/fa6";
import { useState } from "react";
import { useDeleteWorkspace } from "@/app/hooks";
import { useRouter } from "next/navigation";
import { ConfirmationInputDialog } from "@/app/components";
import { InviteMember } from "@/app/invite/_components";
import { MdPersonAddAlt1 } from "react-icons/md";

type Props = {
  workspaceId: string;
  workspaceName: string;
  isAdmin: boolean;
};

export const Actions = ({ workspaceId, workspaceName, isAdmin }: Props) => {
  const router = useRouter();
  const { mutate, isLoading } = useDeleteWorkspace();
  const [showDialog, setShowDialog] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const handleOnDeleteWorkspace = (e: Event) => {
    e.preventDefault();
    setShowDialog(true);
  };

  const handleOnInviteMember = (e: Event) => {
    e.preventDefault();
    setInviteOpen(true);
  };

  const handleDeleteConfirm = () => {
    mutate(workspaceId, {
      onSuccess: () => {
        router.push("/workspaces");
      },
    });
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft" size="3">
            <RiMore2Line />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          side="left"
          align="start"
          className="min-w-[200px]"
        >
          <Link href={`/workspaces/${workspaceId}/members`}>
            <DropdownMenu.Item>
              <Flex direction="row" align="center" gap="2">
                <FaUserGroup />
                <Text>Members</Text>
              </Flex>
            </DropdownMenu.Item>
          </Link>

          {isAdmin && (
            <DropdownMenu.Item onSelect={handleOnInviteMember}>
              <Flex align="center" gap="2">
                <MdPersonAddAlt1 />
                <Text>Invite member</Text>
              </Flex>
            </DropdownMenu.Item>
          )}

          <Link href={`/workspaces/${workspaceId}/issues/list`}>
            <DropdownMenu.Item>
              <Flex direction="row" align="center" gap="2">
                <IoTicketOutline />
                <Text>Issues</Text>
              </Flex>
            </DropdownMenu.Item>
          </Link>

          {isAdmin && (
            <>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onSelect={handleOnDeleteWorkspace}>
                <Flex direction="row" align="center" gap="2">
                  <FaTrash />
                  <Text>Delete workspace</Text>
                </Flex>
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {showDialog && (
        <ConfirmationInputDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          confirmLabel="Delete"
          confirmInputValue="DELETE"
          title={`Delete ${workspaceName}`}
          description="This will permanently delete the workspace. Type"
          loading={isLoading}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <InviteMember
        workspaceId={workspaceId}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </>
  );
};
