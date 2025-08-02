import prisma from "@/prisma/client";

export const getLatestIssues = async (workspaceId: string) =>
  await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    where: { workspaceId },
    include: {
      assignedToUser: true,
      Comment: true,
    },
  });
