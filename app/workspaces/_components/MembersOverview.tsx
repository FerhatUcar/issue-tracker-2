import { Badge, Button, Flex } from "@radix-ui/themes";
import prisma from "@/prisma/client";
import Link from "next/link";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MembersList } from "@/app/workspaces/_components";
import { PageTitle } from "@/app/components";

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

  const members = workspace.memberships.map(({ user, role }) => {
    const isCurrentUser = user.email === session.user.email!;
    const isAdmin = role === "ADMIN";
    const iAmAdmin = currentMembership.role === "ADMIN";
    const showMenu = iAmAdmin && !isAdmin && !isCurrentUser;

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      role,
      isCurrentUser,
      showMenu,
    };
  });

  return (
    <>
      <PageTitle title="Members" description="All members of the workspace." />

      <Flex align="center" gap="2" mb="4">
        <Button asChild variant="soft" size="2" className="mb-4">
          <Link href={`/workspaces/${workspaceId}`}>
            <IoMdArrowRoundBack size={18} />
          </Link>
        </Button>

        <Badge size="2">{workspace.name}</Badge>
      </Flex>

      <Flex direction="column" gap="3">
        <MembersList workspaceId={workspaceId} members={members} />
      </Flex>
    </>
  );
};
