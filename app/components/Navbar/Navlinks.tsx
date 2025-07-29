"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Flex, Separator } from "@radix-ui/themes";
import Link from "next/link";
import classnames from "classnames";
import { RiDashboard2Line } from "react-icons/ri";
import { IoTicketOutline } from "react-icons/io5";

export const NavLinks = () => {
  const currentPath = usePathname();

  const links = [
    {
      label: (
        <Flex direction="row" gap="2" align="center">
          <RiDashboard2Line /> Home
        </Flex>
      ),
      href: "/",
    },
    {
      label: (
        <Flex direction="row" gap="2" align="center">
          <IoTicketOutline /> Issues
        </Flex>
      ),
      href: "/issues/list",
    },
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
          {i < links.length - 1 && <Separator orientation="vertical" />}
        </Flex>
      ))}
    </ul>
  );
};
