import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ ok: true });
  }

  await prisma.$transaction(async (tx) => {
    // delete all workspaces
    const ownedWorkspaces = await tx.workspace.findMany({
      where: { ownerId: user.id },
      select: { id: true },
    });

    const ownedWorkspaceIds = ownedWorkspaces.map((w) => w.id);

    if (ownedWorkspaceIds.length > 0) {
      // Reactions on comments within the workspaces
      await tx.commentReaction.deleteMany({
        where: {
          comment: {
            issue: { workspaceId: { in: ownedWorkspaceIds } },
          },
        },
      });

      // Comments within the workspaces
      await tx.comment.deleteMany({
        where: {
          issue: { workspaceId: { in: ownedWorkspaceIds } },
        },
      });

      // Issues within the workspaces
      await tx.issue.deleteMany({
        where: { workspaceId: { in: ownedWorkspaceIds } },
      });

      // Memberships within the workspaces
      await tx.membership.deleteMany({
        where: { workspaceId: { in: ownedWorkspaceIds } },
      });

      // Workspaces itself
      await tx.workspace.deleteMany({
        where: { id: { in: ownedWorkspaceIds } },
      });
    }

    const userIssues = await tx.issue.findMany({
      where: { authorId: user.id },
      select: { id: true },
    });

    const userIssueIds = userIssues.map((i) => i.id);

    if (userIssueIds.length > 0) {
      await tx.commentReaction.deleteMany({
        where: { comment: { issueId: { in: userIssueIds } } },
      });

      await tx.comment.deleteMany({
        where: { issueId: { in: userIssueIds } },
      });

      await tx.issue.deleteMany({
        where: { id: { in: userIssueIds } },
      });
    }

    // reactions and comments on issues
    await tx.commentReaction.deleteMany({ where: { userId: user.id } });
    await tx.comment.deleteMany({ where: { authorId: user.id } });
    await tx.membership.deleteMany({ where: { userId: user.id } });

    // NextAuth artifacts
    await tx.account.deleteMany({ where: { userId: user.id } });
    await tx.session.deleteMany({ where: { userId: user.id } });

    // the user itself
    await tx.user.delete({ where: { id: user.id } });
  });

  return NextResponse.json({ ok: true });
}
