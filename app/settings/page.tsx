import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { notFound } from "next/navigation";
import { SettingsTabs } from "./components";
import { Status } from "@prisma/client";
import { FREE_WORKSPACE_LIMIT } from "@/app/constants/billing";

type RecentIssue = {
  id: number;
  title: string;
  status: Status;
  createdAt: Date;
  workspace: { id: string; name: string };
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    notFound();
  }

  const [
    memberships,
    subscription,
    ownedWorkspaceCount,
  ] = await Promise.all([
    prisma.membership.findMany({
      where: { userId: user.id },
      include: { workspace: true },
    }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
    prisma.workspace.count({ where: { ownerId: user.id } }),
  ]);

  const workspaces = memberships.map((m) => ({
    id: m.workspace.id,
    name: m.workspace.name,
    createdAt: m.workspace.createdAt.toISOString(),
  }));

  const workspaceIds = workspaces.map((w) => w.id);

  if (workspaceIds.length === 0) {
    return (
      <SettingsTabs
        user={{ name: user.name ?? "", email: user.email ?? "" }}
        workspace={[]}
        stats={{ open: 0, inProgress: 0, review: 0, closed: 0 }}
        recentIssues={[]}
        subscription={{
          status: subscription?.status ?? null,
          currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString() ?? null,
        }}
        workspaceLimit={FREE_WORKSPACE_LIMIT}
        ownedWorkspaceCount={ownedWorkspaceCount}
      />
    );
  }

  const [openCount, inProgressCount, reviewCount, closedCount] =
    await Promise.all([
      prisma.issue.count({
        where: { workspaceId: { in: workspaceIds }, status: "OPEN" },
      }),
      prisma.issue.count({
        where: { workspaceId: { in: workspaceIds }, status: "IN_PROGRESS" },
      }),
      prisma.issue.count({
        where: { workspaceId: { in: workspaceIds }, status: "REVIEW" },
      }),
      prisma.issue.count({
        where: { workspaceId: { in: workspaceIds }, status: "CLOSED" },
      }),
    ]);

  const recentIssues = (await prisma.issue.findMany({
    where: { workspaceId: { in: workspaceIds } },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      workspace: { select: { id: true, name: true } },
    },
  })) as RecentIssue[];

  const recentIssuesDTO: RecentIssue[] = recentIssues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    status: issue.status,
    createdAt: issue.createdAt,
    workspace: {
      id: issue.workspace.id,
      name: issue.workspace.name,
    },
  }));

  return (
    <SettingsTabs
      user={{ name: user.name ?? "", email: user.email ?? "" }}
      workspace={workspaces}
      recentIssues={recentIssuesDTO}
      stats={{
        open: openCount,
        inProgress: inProgressCount,
        review: reviewCount,
        closed: closedCount,
      }}
      subscription={{
        status: subscription?.status ?? null,
        currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString() ?? null,
      }}
      workspaceLimit={FREE_WORKSPACE_LIMIT}
      ownedWorkspaceCount={ownedWorkspaceCount}
    />
  );
}
