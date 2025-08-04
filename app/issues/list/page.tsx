import React from "react";
import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import { Pagination } from "@/app/components";
import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import IssueTable, {
  IssueQuery,
} from "@/app/workspaces/[workspaceId]/issues/list/IssueTable";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/app/auth/authOptions";

type Props = {
  searchParams: IssueQuery;
};

const AllIssuesPage = async ({ searchParams }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const statuses: Status[] = Object.values(Status);
  const status: Status | undefined = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const [issues, issueCount] = await Promise.all([
    prisma.issue.findMany({
      where: {
        assignedToUserId: session.user.id,
        status,
      },
      include: {
        assignedToUser: true,
        Workspace: true,
        Comment: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),

    prisma.issue.count({
      where: {
        assignedToUserId: session.user.id,
        status,
      },
    }),
  ]);

  return (
    <Box className="space-y-6">
      <Box className="flex items-center justify-between">
        <Box>
          <Heading size="6" className="mb-1">
            My Issues
          </Heading>
          <Text size="3" className="text-gray-500">
            {issueCount} {issueCount === 1 ? "issue" : "issues"} assigned to you
            across all workspaces
          </Text>
        </Box>
      </Box>

      {issues.length === 0 ? (
        <Card className="p-8 text-center">
          <Text size="3" className="text-gray-500">
            No issues assigned to you
          </Text>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <IssueTable
              searchParams={searchParams}
              issuesWithAssigning={issues}
              workspaceName=""
              workspaceId=""
              showWorkspacePerIssue
            />
          </Card>

          {issueCount > pageSize && (
            <Flex justify="center" className="pt-4">
              <Pagination
                itemCount={issueCount}
                pageSize={pageSize}
                currentPage={page}
              />
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default AllIssuesPage;
