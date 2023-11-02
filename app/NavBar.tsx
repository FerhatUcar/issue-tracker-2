"use client";

import { Skeleton } from "@/app/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC } from "react";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  DropdownMenu,
  Flex,
  HoverCard,
  Separator,
  Text,
} from "@radix-ui/themes";
import { PersonIcon } from "@radix-ui/react-icons";
import Image from "next/image";

type NavBarProps = {
  count: number;
  userId: string;
};

const NavBar: FC<NavBarProps> = ({ count, userId }) => {
  const { status } = useSession();
  const hideHoverCard =
    count === 0 || status === "unauthenticated" || status === "loading";

  return (
    <nav className="px-5 py-3 bg-neutral-800">
      <Container>
        <Flex justify="between">
          <Flex align="center" gap="3">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={60} height={60} />
            </Link>
            <NavLinks />
          </Flex>
          <Flex align="center" justify="between" gap="4">
            {hideHoverCard ? null : (
              <HoverCard.Root>
                <HoverCard.Trigger>
                  <Badge variant="solid" radius="full" color="red">
                    {count}
                  </Badge>
                </HoverCard.Trigger>
                <HoverCard.Content>
                  Open issue(s) on your name: {count}
                </HoverCard.Content>
              </HoverCard.Root>
            )}

            <AuthStatus userId={userId} count={count} />
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

const NavLinks = () => {
  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues/list" },
  ];

  return (
    <ul className="flex space-x-3">
      {links.map((link) => (
        <Flex align="center" gap="3">
          <li key={link.href}>
            <Link
              className={classnames({
                "nav-link": true,
                "!text-pink-400": link.href === currentPath,
                "font-bold": link.href === currentPath,
              })}
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
          <Separator orientation="vertical" />
        </Flex>
      ))}
    </ul>
  );
};

type AuthStatus = {
  userId: string;
  count: number;
};
const AuthStatus: FC<AuthStatus> = ({ userId, count }) => {
  const { status, data: session } = useSession();

  if (status === "loading") return <Skeleton width="3rem" />;

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
};

export default NavBar;
