import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { notFound } from "next/navigation";
import { SettingsTabs } from "./components";

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

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: { workspace: true },
  });

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
        Workspaces={[]}
        stats={{ open: 0, inProgress: 0, closed: 0 }}
        recentIssues={[]}
      />
    );
  }

  const [openCount, inProgressCount, closedCount, recentIssues] =
    await Promise.all([
      prisma.issue.count({
        where: { workspaceId: { in: workspaceIds }, status: "OPEN" },
      }),
      prisma.issue.count({
        where: { workspaceId: { in: workspaceIds }, status: "IN_PROGRESS" },
      }),
      prisma.issue.count({
        where: { workspaceId: { in: workspaceIds }, status: "CLOSED" },
      }),
      prisma.issue.findMany({
        where: { workspaceId: { in: workspaceIds } },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          Workspace: { select: { id: true, name: true } },
        },
      }),
    ]);

  const recentIssuesDTO = recentIssues.map(
    ({ id, status, title, createdAt, Workspace }) => ({
      id,
      title,
      status: status as "OPEN" | "IN_PROGRESS" | "CLOSED",
      createdAt: createdAt.toISOString(),
      Workspaces: { id: Workspace?.id ?? "", name: Workspace?.name ?? "" },
    }),
  );

  return (
    <SettingsTabs
      user={{ name: user.name ?? "", email: user.email ?? "" }}
      Workspaces={workspaces}
      stats={{
        open: openCount,
        inProgress: inProgressCount,
        closed: closedCount,
      }}
      recentIssues={recentIssuesDTO}
    />
  );
}
