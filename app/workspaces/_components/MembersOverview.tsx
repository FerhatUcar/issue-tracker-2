import { Avatar, Badge, Box, Button, Card, Flex, Text } from "@radix-ui/themes";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { notFound } from "next/navigation";
import { PiCrownDuotone } from "react-icons/pi";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MemberActionsMenu } from "@/app/workspaces/_components";

type Props = { workspaceId: string };

export const MembersOverview = async ({ workspaceId }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: { memberships: { include: { user: true } } },
  });

  if (!workspace) {
    notFound();
  }

  const currentMembership = workspace.memberships.find(
    ({ user }) => user.email === session.user.email!,
  );

  if (!currentMembership) {
    notFound();
  }

  return (
    <>
      <Flex align="center" gap="2">
        <Link href={`/workspaces/${workspaceId}`}>
          <Button variant="soft" size="2" mb="4">
            <Flex align="center" gap="2">
              <IoMdArrowRoundBack size={18} />
            </Flex>
          </Button>
        </Link>

        <Badge size="2" className="mb-4">
          {workspace.name}
        </Badge>
      </Flex>

      <Flex direction="column" gap="3">
        {workspace.memberships.map(({ user, role }) => {
          const isCurrentUser = user.email === session.user.email!;
          const isAdmin = role === "ADMIN";
          const iAmAdmin = currentMembership.role === "ADMIN";
          const showMenu = iAmAdmin && !isAdmin && !isCurrentUser;

          return (
            <Card key={user.id} variant="surface">
              <Flex align="center" gap="3" justify="between">
                <Flex align="center" gap="3">
                  <Avatar
                    fallback={user.name?.[0] ?? "?"}
                    radius="large"
                    src={user.image ?? ""}
                    size="3"
                  />
                  <Flex direction="column">
                    <Text weight="bold">{user.name}</Text>
                    <Text size="1" color="gray">
                      {user.email}
                    </Text>
                  </Flex>
                </Flex>

                <Flex align="center" gap="2">
                  {isAdmin && (
                    <PiCrownDuotone className="mr-2" size={18} color="gold" />
                  )}

                  {showMenu && (
                    <Box className="mr-2 flex items-center">
                      <MemberActionsMenu
                        workspaceId={workspaceId}
                        userId={user.id}
                        userName={user.name ?? "Member"}
                      />
                    </Box>
                  )}
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </>
  );
};
