"use client";

import React from "react";
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

  const links = [
    {
      label: (
        <Flex direction="row" gap="2" align="center">
          <MdOutlineWorkspaces /> Workspaces
        </Flex>
      ),
      href: "/workspaces",
    },
  ];

  return isAuthenticated ? (
    <ul className="flex space-x-3">
      {links.map((link, i) => (
        <Flex align="center" gap="3" key={i}>
          <li key={link.href}>
            <Link
              className={classnames({
                "!text-sky-400": link.href === currentPath,
                "font-bold": link.href === currentPath,
              })}
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
          {i < links.length - 1 && <Separator orientation="vertical" />}
        </Flex>
      ))}
    </ul>
  ) : null;
};
