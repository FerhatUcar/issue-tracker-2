import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { LimitReached } from "@/app/invite/_components";
import { FREE_WORKSPACE_MEMBER_LIMIT } from "@/app/constants/billing";
import { isSubscriptionActive } from "@/app/helpers";

type Props = {
  params: Promise<{ inviteId: string }>;
};

const AcceptInvitePage = async ({ params }: Props) => {
  const { inviteId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    // Force login if user not authenticated
    redirect("/api/auth/signin?callbackUrl=/join/" + inviteId);
  }

  const invite = await prisma.invite.findUnique({
    where: {
      id: inviteId,
    },
    include: {
      workspace: true,
    },
  });

  if (!invite || invite.accepted) {
    notFound();
  }

  if (invite.email !== session.user.email) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    notFound();
  }

  // Check if already a member
  const existingMembership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      workspaceId: invite.workspaceId,
    },
  });

  if (!existingMembership) {
    const workspace = await prisma.workspace.findUnique({
      where: { id: invite.workspaceId },
      select: { ownerId: true },
    });

    if (!workspace) {
      notFound();
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
        userId: user.id,
        workspaceId: invite.workspaceId,
      },
    });
  }

  // Mark invite as accepted
  await prisma.invite.update({
    where: {
      id: invite.id,
    },
    data: {
      accepted: true,
    },
  });

  redirect(`/workspaces/${invite.workspaceId}`);
};

export default AcceptInvitePage;
