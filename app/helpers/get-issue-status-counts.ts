import prisma from "@/prisma/client";

/**
 * Fetches the count of issues grouped by their status.
 * @returns {Promise<{ open: number, inProgress: number, review: number, closed: number }>} An object containing counts of issues by status.
 */
export const getIssueStatusCounts = async (
  workspaceId: string,
): Promise<{
  open: number;
  inProgress: number;
  review: number;
  closed: number;
}> => {
  const [open, inProgress, review, closed] = await Promise.all([
    prisma.issue.count({
      where: {
        status: "OPEN",
        workspaceId,
      },
    }),
    prisma.issue.count({
      where: {
        status: "IN_PROGRESS",
        workspaceId,
      },
    }),
    prisma.issue.count({
      where: {
        status: "REVIEW",
        workspaceId,
      },
    }),
    prisma.issue.count({
      where: {
        status: "CLOSED",
        workspaceId,
      },
    }),
  ]);

  return { open, inProgress, review, closed };
};
