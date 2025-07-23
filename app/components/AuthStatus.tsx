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
import { PersonIcon } from "@radix-ui/react-icons";
import Skeleton from "react-loading-skeleton";

type Props = {
  userId: string
  count: number
}

export const  AuthStatus = ({ userId, count }: Props) => {
  const { status, data: session } = useSession();

  if (status === "loading") {
    return <Skeleton width="3rem" />;
  }

  if (status === "unauthenticated")
    return (
      <Link className="hover:cursor-pointer nav-link" href="/api/auth/signin">
        <Button className="hover:cursor-pointer">
          <PersonIcon />
          Log in
        </Button>
      </Link>
    );

  return (
    <Box>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Avatar
            src={session!.user!.image!}
            fallback="?"
            size="2"
            radius="full"
            className="cursor-pointer hover:border-2 border-gray-300 transition-all"
            referrerPolicy="no-referrer"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>
            <Text size="2">{session!.user!.email}</Text>
          </DropdownMenu.Label>
          <Link href={`/issues/list?assignedToUserId=${userId}`}>
            <DropdownMenu.Item>
              <Flex justify="between" width="100%">
                <Text>My issues</Text>
                {count >= 1 && (
                  <Badge variant="solid" radius="full" color="red">
                    {count}
                  </Badge>
                )}
              </Flex>
            </DropdownMenu.Item>
          </Link>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <Link href="/api/auth/signout">Log out</Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
}
