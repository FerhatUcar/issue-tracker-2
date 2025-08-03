// app/invite/accept/page.tsx

import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const invite = await prisma.invite.findUnique({
    where: { token: searchParams.token },
  });

  if (!invite || invite.accepted) {
    return <p>Deze uitnodiging is ongeldig of al geaccepteerd.</p>;
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect(
      "/api/auth/signin?callbackUrl=/invite/accept?token=" + searchParams.token,
    );
  }

  // check of user al lid is
  const existing = await prisma.membership.findFirst({
    where: {
      user: { email: session.user.email },
      workspaceId: invite.workspaceId,
    },
  });

  if (!existing) {
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

  redirect(`/workspaces/${invite.workspaceId}`);
}
