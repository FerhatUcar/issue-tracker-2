import prisma from "@/prisma/client";

export const getLatestIssues = async () =>
  await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      assignedToUser: true,
      Comment: true,
    },
  });
