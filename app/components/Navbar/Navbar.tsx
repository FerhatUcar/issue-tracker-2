"use client";

import React from "react";
import Link from "next/link";
import { Container, Flex } from "@radix-ui/themes";
import Image from "next/image";
import { AuthStatus } from "@/app/components";
import { NavLinks } from "./Navlinks";

type Props = {
  data: {
    userId: string;
    count: number;
  };
};

export const Navbar = ({ data: { userId, count } }: Props) => (
  <nav className="px-5 py-3">
    <Container>
      <Flex justify="between" align="center">
        <Flex align="center" gap="3">
          <Link href="/" className="relative inline-block">
            <Image src="/logo.png" alt="Logo" width={60} height={60} priority style={{
              objectFit: "contain",
              width: "auto",
              height: "auto",
            }} />
          </Link>
          <NavLinks />
        </Flex>
        <AuthStatus userId={userId} count={count} />
      </Flex>
    </Container>
  </nav>
);
