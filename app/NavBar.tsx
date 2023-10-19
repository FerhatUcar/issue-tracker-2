"use client";
import React from "react";
import Link from "next/link";
import { AiFillBug } from "react-icons/ai";
import { usePathname } from "next/navigation";
import classNames from "classnames";

type LinkType = {
  label: string;
  href: string;
};
const NavBar = () => {
  const currentPath = usePathname();

  const links: LinkType[] = [
    { label: "Dashboard", href: "/" },
    { label: "issues", href: "/issues/list" },
  ];

  return (
    <nav className="flex space-x-6 border-b mb-5 p-5 h-14 items-center">
      <Link href="/">
        <AiFillBug />
      </Link>
      <ul className="flex space-x-3">
        {links.map((link) => (
          <Link
            className={classNames({
              "text.zinc-900": link.href === currentPath,
              "text-zinc-500": link.href !== currentPath,
              "hover:text-zinc-800 transition-colors": true,
            })}
            key={link.href}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
