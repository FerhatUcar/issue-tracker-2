import Link from "next/link";
import { Box, Container, Flex, Separator, Text } from "@radix-ui/themes";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { NavLinks } from "./Navlinks";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { AuthStatusClient } from "@/app/components";

type Props = {
  userId: string;
  count: number;
};

export const Navbar = async ({ userId, count }: Props) => {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  return (
    <Box className="h-[50px] sticky top-0 z-50">
      <nav className="px-5 py-3">
        <Container>
          <Flex justify="between" align="center">
            <Flex align="center" gap="3">
              <Link href="/" className="relative inline-block">
                {isLoggedIn ? (
                  <MdOutlineRocketLaunch className="transition-transform duration-200 hover:scale-125" />
                ) : (
                  <Flex
                    align="center"
                    gap="2"
                    className="transition-transform duration-200 hover:scale-105"
                  >
                    <MdOutlineRocketLaunch />
                    <Text weight="bold">
                      <span className="text-cyan-500">Rocket</span> Issues
                    </Text>
                  </Flex>
                )}
              </Link>
              {isLoggedIn && <Separator orientation="vertical" />}
              <NavLinks />
            </Flex>
            <AuthStatusClient userId={userId} count={count} />
          </Flex>
        </Container>
      </nav>
    </Box>
  );
};
