import prisma from "@/prisma/client";

export const getComments = async (issueId: number) =>
  await prisma.comment.findMany({
    where: { issueId },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  });
