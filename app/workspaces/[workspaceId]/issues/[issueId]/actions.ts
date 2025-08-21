import { cache } from "react";
import prisma from "@/prisma/client";

export const fetchIssue = cache((issueId: number) =>
  prisma.issue.findUnique({
    where: { id: issueId },
    select: {
      id: true,
      title: true,
      description: true,
      authorId: true,
      author: { select: { id: true, name: true, image: true } },
      status: true,
      createdAt: true,
      updatedAt: true,
      assignedToUserId: true,
      workspaceId: true,
      assignedToUser: { select: { id: true, name: true, image: true } },
    },
  }),
);
