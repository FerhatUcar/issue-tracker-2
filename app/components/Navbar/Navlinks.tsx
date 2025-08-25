"use client";

import { usePathname } from "next/navigation";
import { Flex, Separator } from "@radix-ui/themes";
import Link from "next/link";
import classnames from "classnames";
import { MdOutlineWorkspaces } from "react-icons/md";
import { useSession } from "next-auth/react";

export const NavLinks = () => {
  const currentPath = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (!isAuthenticated) {
    return null;
  }

  const links = [
    {
      label: (
        <Flex direction="row" gap="2" align="center">
          <MdOutlineWorkspaces />
        </Flex>
      ),
      href: "/workspaces",
    },
  ];

  return (
    <Flex gap="3">
      {links.map(({ href, label }, i) => (
        <Flex align="center" gap="3" key={i}>
          <Link
            href={href}
            className={`transition-transform duration-200 hover:scale-125 ${classnames(
              {
                "!text-sky-400": href === currentPath,
                "font-bold": href === currentPath,
                "nav-link": true,
              },
            )}`}
          >
            {label}
          </Link>

          {i < links.length - 1 && <Separator orientation="vertical" />}
        </Flex>
      ))}
    </Flex>
  );
};
