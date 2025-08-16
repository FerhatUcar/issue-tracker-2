import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";

type Props = {
  params: {
    inviteId: string;
  };
};

const AcceptInvitePage = async ({ params: { inviteId } }: Props) => {
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
