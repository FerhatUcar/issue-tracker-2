import { Avatar, Badge, Button, Card, Flex, Text } from "@radix-ui/themes";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { notFound } from "next/navigation";
import { PiCrownDuotone } from "react-icons/pi";
import { DeleteMember } from "@/app/workspaces/_components/DeleteMember";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

type Props = {
  workspaceId: string;
};

export const MembersOverview = async ({ workspaceId }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!workspace) {
    notFound();
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

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
        {workspace.memberships.map(({ user, role }, i) => (
          <Card key={i} variant="surface">
            <Flex align="center" gap="3" justify="between">
              <Flex align="center" gap="3">
                <Avatar
                  fallback={user.name?.[0] ?? "?"}
                  radius="full"
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
                {role === "ADMIN" && (
                  <Badge color="orange" size="2" variant="solid">
                    <Flex align="center" gap="1">
                      <PiCrownDuotone size="20" /> Admin
                    </Flex>
                  </Badge>
                )}

                {user.id !== currentUser?.id && (
                  <DeleteMember
                    userId={user.id}
                    userName={user.name ?? "Member"}
                    workspaceId={workspaceId}
                  />
                )}
              </Flex>
            </Flex>
          </Card>
        ))}
      </Flex>
    </>
  );
};
