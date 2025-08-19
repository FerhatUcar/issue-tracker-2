import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { notFound } from "next/navigation";
import SettingsTabs from "./components/SettingsTabs";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) notFound();

  // Haal de DB-user op (hier zit een echte id op)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) notFound();

  // Workspaces via memberships van de user
  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: { workspace: true },
  });

  const workspaces = memberships.map((m) => ({
    id: m.workspace.id,
    name: m.workspace.name,
    createdAt: m.workspace.createdAt.toISOString(), // serialize voor client
  }));

  const workspaceIds = workspaces.map((w) => w.id);

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
          Workspace: { select: { id: true, name: true } }, // ⬅️ niet "Workspace"
        },
      }),
    ]);

  const recentIssuesDTO = recentIssues.map((i) => ({
    id: i.id,
    title: i.title,
    status: i.status as "OPEN" | "IN_PROGRESS" | "CLOSED",
    createdAt: i.createdAt.toISOString(),
    Workspaces: { id: i.Workspace?.id ?? "", name: i.Workspace?.name ?? "" },
  }));

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
