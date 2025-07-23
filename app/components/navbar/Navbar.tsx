"use client";

import React from "react";
import { NavLinks } from "./Navlinks";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Container, Flex } from "@radix-ui/themes";
import Image from "next/image";
import { IssueStatus, AuthStatus } from "@/app/components";

type Props = {
  data: {
    userId: string;
    count: number;
  };
};

export const Navbar = ({ data: { userId, count } }: Props) => {
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
            {!hideHoverCard && <IssueStatus count={count} />}

            <AuthStatus userId={userId} count={count} />
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};
