"use client";

import Link from "next/link";
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
  MoonIcon,
  PersonIcon,
  SunIcon,
  ExitIcon,
  AvatarIcon,
} from "@radix-ui/react-icons";
import Skeleton from "react-loading-skeleton";
import { useThemeToggle } from "@/app/providers";
import { IoTicketOutline } from "react-icons/io5";
import { useParams } from "next/navigation";

type Props = {
  /**
   * The ID of the user to filter issues by
   */
  userId: string;

  /**
   * The count of issues assigned to the user
   */
  count: number;
};

export const AuthStatus = ({ userId, count }: Props) => {
  const { status, data: session } = useSession();
  const params = useParams();
  const { appearance, toggleAppearance } = useThemeToggle();

  if (status === "loading") {
    return <Skeleton width="3rem" />;
  }

  if (status === "unauthenticated")
    return (
      <Link className="hover:cursor-pointer nav-link" href="/api/auth/signin">
        <Button className="hover:cursor-pointer" variant="soft">
          <PersonIcon />
          Log in
        </Button>
      </Link>
    );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Box className="relative inline-block">
          <Avatar
            src={session!.user!.image!}
            fallback="?"
            size="2"
            radius="full"
            className="cursor-pointer hover:border-2 border-gray-300 transition-all"
            referrerPolicy="no-referrer"
          />
          {count > 0 && (
            <Box className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full shadow-md z-10" />
          )}
        </Box>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>
          <Flex direction="row" align="center" gap="2">
            <AvatarIcon />
            <Text size="2">{session!.user!.name}</Text>
          </Flex>
        </DropdownMenu.Label>

        <DropdownMenu.Item onClick={toggleAppearance}>
          <Flex direction="row" align="center" gap="2">
            {appearance === "dark" ? <SunIcon /> : <MoonIcon />}
            <Text>{appearance === "dark" ? "Light" : "Dark"} mode</Text>
          </Flex>
        </DropdownMenu.Item>

        <Link href={`/workspaces/${params.workspaceId}/issues/list?assignedToUserId=${userId}`}>
          <DropdownMenu.Item>
            <Flex justify="between" width="100%">
              <Flex direction="row" align="center" gap="2">
                <IoTicketOutline />
                <Text>My issues</Text>
                {count >= 1 && (
                  <Badge
                    variant="solid"
                    radius="full"
                    color="red"
                    className="h-4 w-3 justify-center"
                  >
                    {count}
                  </Badge>
                )}
              </Flex>
            </Flex>
          </DropdownMenu.Item>
        </Link>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <Flex direction="row" align="center" gap="2">
            <ExitIcon />
            <Link href="/api/auth/signout">Log out</Link>
          </Flex>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
