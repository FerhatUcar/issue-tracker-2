"use client";

import Link from "next/link";
import { Container, Flex, Separator } from "@radix-ui/themes";
import { AuthStatus } from "@/app/components";
import { NavLinks } from "./Navlinks";
import { useSession } from "next-auth/react";
import { MdOutlineRocketLaunch } from "react-icons/md";

type Props = {
  data: {
    userId: string;
    count: number;
  };
};

export const Navbar = ({ data: { userId, count } }: Props) => {
  const session = useSession();
  const isLoggedIn = session.status === "authenticated";

  return (
    <nav className="px-5 py-3">
      <Container>
        <Flex justify="between" align="center">
          <Flex align="center" gap="3">
            <Link href="/" className="relative inline-block">
              <MdOutlineRocketLaunch className="transition-transform duration-200 hover:scale-125" />

              {/*<Image*/}
              {/*  src="/logo.png"*/}
              {/*  alt="Logo"*/}
              {/*  width={30}*/}
              {/*  height={30}*/}
              {/*  priority*/}
              {/*  style={{*/}
              {/*    objectFit: "contain",*/}
              {/*    width: "auto",*/}
              {/*    height: "auto",*/}
              {/*  }}*/}
              {/*/>*/}
            </Link>
            {isLoggedIn && <Separator orientation="vertical" />}
            <NavLinks />
          </Flex>
          <AuthStatus userId={userId} count={count} />
        </Flex>
      </Container>
    </nav>
  );
};
