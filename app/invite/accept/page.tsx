import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Accepted, LimitReached, NoInvite } from "@/app/invite/_components";
import { FREE_WORKSPACE_MEMBER_LIMIT } from "@/app/constants/billing";
import { isSubscriptionActive } from "@/app/helpers";

type Props = {
  searchParams: Promise<{ token: string }>;
};

export default async function AcceptInvitePage({ searchParams }: Props) {
  const { token } = await searchParams;
  const session = await getServerSession(authOptions);
  const invite = await prisma.invite.findUnique({
    where: { token },
    include: {
      workspace: {
        select: {
          name: true,
          id: true,
        },
      },
      invitedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!session?.user?.email) {
    redirect("/api/auth/signin?callbackUrl=/invite/accept?token=" + token);
  }

  if (!invite) {
    return <NoInvite />;
  }

  if (invite.accepted) {
    return <Accepted invite={invite} />;
  }

  const existing = await prisma.membership.findFirst({
    where: {
      user: { email: session.user.email },
      workspaceId: invite.workspaceId,
    },
  });

  if (!existing) {
    const workspace = await prisma.workspace.findUnique({
      where: { id: invite.workspaceId },
      select: { ownerId: true },
    });

    if (!workspace) {
      return <NoInvite />;
    }

    const ownerSubscription = await prisma.subscription.findUnique({
      where: { userId: workspace.ownerId },
      select: { status: true },
    });

    const hasActiveSubscription = isSubscriptionActive(
      ownerSubscription?.status,
    );

    if (!hasActiveSubscription) {
      const memberCount = await prisma.membership.count({
        where: { workspaceId: invite.workspaceId },
      });

      if (memberCount >= FREE_WORKSPACE_MEMBER_LIMIT) {
        return <LimitReached />;
      }
    }

    await prisma.membership.create({
      data: {
        user: { connect: { email: session.user.email } },
        workspace: { connect: { id: invite.workspaceId } },
      },
    });
  }

  await prisma.invite.update({
    where: { id: invite.id },
    data: { accepted: true },
  });

  return (
    <Box className="flex items-center justify-center mt-4">
      <Card className="max-w-md w-full mx-4">
        <Flex direction="column" align="center" gap="4" className="p-6">
          <CheckCircledIcon className="w-16 h-16 text-green-500" />
          <Heading size="6" className="text-center">
            Welkom bij {invite.workspace.name}!
          </Heading>
          <Box className="text-center">
            <Text
              size="3"
              className="text-gray-600 dark:text-gray-400 block mb-2"
            >
              You have been successfully added by{" "}
              <strong>{invite.invitedBy.name || invite.invitedBy.email}</strong>
              .
            </Text>
            <Text size="2" className="text-gray-500">
              You can now start collaborating in this workspace.
            </Text>
          </Box>
          <Flex gap="2" className="w-full">
            <Button asChild className="flex-1">
              <Link href={`/workspaces/${invite.workspaceId}`}>
                Go to Workspace
              </Link>
            </Button>
            <Button variant="soft" asChild className="flex-1">
              <Link href="/">Dashboard</Link>
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
