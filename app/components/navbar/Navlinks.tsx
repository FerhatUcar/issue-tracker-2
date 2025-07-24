"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Flex, Separator } from "@radix-ui/themes";
import Link from "next/link";
import classnames from "classnames";
import { HomeIcon } from "@radix-ui/react-icons";

export const NavLinks = () => {
  const currentPath = usePathname();

  const links = [
    { label: <HomeIcon />, href: "/" },
    { label: "Issues", href: "/issues/list" },
  ];

  return (
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
          <Separator orientation="vertical" />
        </Flex>
      ))}
    </ul>
  );
};
