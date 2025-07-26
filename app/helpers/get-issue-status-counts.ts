import prisma from "@/prisma/client";

/**
 * Fetches the count of issues grouped by their status.
 * @returns {Promise<{ open: number, inProgress: number, closed: number }>} An object containing counts of issues by status.
 */
export const getIssueStatusCounts = async (): Promise<{
  open: number;
  inProgress: number;
  closed: number;
}> => {
  const [open, inProgress, closed] = await Promise.all([
    prisma.issue.count({ where: { status: "OPEN" } }),
    prisma.issue.count({ where: { status: "IN_PROGRESS" } }),
    prisma.issue.count({ where: { status: "CLOSED" } }),
  ]);

  return { open, inProgress, closed };
};
