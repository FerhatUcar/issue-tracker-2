"use client";

import { useSession } from "next-auth/react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";
import {
  AvatarIcon,
  ExitIcon,
  GearIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import Skeleton from "react-loading-skeleton";
import { IoTicketOutline } from "react-icons/io5";
import { useParams } from "next/navigation";
import { Login, Logout } from "@/app/components";
import { useState } from "react";
import Link from "next/link";
import { useIsPro } from "@/app/hooks";

type Props = { userId: string; count: number };

export const AuthStatus = ({ userId, count }: Props) => {
  const { status, data: session } = useSession();
  const { workspaceId } = useParams();
  const [openIn, setOpenIn] = useState(false);
  const [openOut, setOpenOut] = useState(false);
  const { data, isLoading } = useIsPro();

  const workspaceIdString = Array.isArray(workspaceId)
    ? workspaceId[0]
    : workspaceId;

  if (status === "loading") {
    return <Skeleton width="3rem" />;
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Button variant="soft" onClick={() => setOpenIn(true)}>
          <PersonIcon />
          Log in
        </Button>

        <Login open={openIn} action={setOpenIn} />
      </>
    );
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Box className="relative inline-block">
            <Avatar
              src={session!.user.image!}
              fallback="?"
              size="2"
              radius="large"
              className={`${
                data?.isPro && !isLoading
                  ? "ring-1 ring-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                  : ""
              } cursor-pointer transition-transform duration-200 hover:scale-105`}
              referrerPolicy="no-referrer"
            />
            {count > 0 && (
              <Box className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-600 rounded-full z-10" />
            )}
          </Box>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          side="left"
          align="start"
          className="min-w-[200px]"
        >
          <DropdownMenu.Label>
            <Flex direction="row" align="center" gap="2">
              <AvatarIcon />
              <Text size="2">{session!.user.name}</Text>
            </Flex>
          </DropdownMenu.Label>

          <Link href={`/issues/list?assignedToUserId=${userId}`}>
            <DropdownMenu.Item>
              <Flex
                justify={count >= 1 ? "between" : "start"}
                width="100%"
                align="center"
                gap="2"
              >
                <Flex align="center" gap="2">
                  <IoTicketOutline />
                  <Text>My list</Text>
                </Flex>
                {count >= 1 && (
                  <Badge
                    variant="solid"
                    radius="full"
                    color="red"
                    className="h-4 w-5! justify-center"
                  >
                    {count}
                  </Badge>
                )}
              </Flex>
            </DropdownMenu.Item>
          </Link>

          {workspaceIdString && (
            <Link
              href={`/workspaces/${workspaceIdString}/issues/list?assignedToUserId=${userId}`}
            >
              <DropdownMenu.Item>
                <Flex width="100%" align="center" gap="2">
                  <IoTicketOutline />
                  <Text>Workspace list</Text>
                </Flex>
              </DropdownMenu.Item>
            </Link>
          )}

          <Link href="/settings">
            <DropdownMenu.Item>
              <Flex direction="row" align="center" gap="2">
                <GearIcon />
                <Text>Settings</Text>
              </Flex>
            </DropdownMenu.Item>
          </Link>

          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={() => setOpenOut(true)}>
            <Flex align="center" gap="2">
              <ExitIcon />
              Logout
            </Flex>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <Logout open={openOut} action={setOpenOut} />
    </>
  );
};
