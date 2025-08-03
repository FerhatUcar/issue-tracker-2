import React, { Suspense } from "react";
import prisma from "@/prisma/client";
import IssueActions from "@/app/workspaces/[workspaceId]/issues/list/IssueActions";
import { Status } from "@prisma/client";
import { Pagination } from "@/app/components";
import IssueTable, {
  IssueQuery,
} from "@/app/workspaces/[workspaceId]/issues/list/IssueTable";
import { Card, Flex, Heading, Text, Box, Badge } from "@radix-ui/themes";
import { columns } from "@/app/workspaces/[workspaceId]/issues/list/IssueColumns";
import { getPaginatedIssuesWithAssignedUser } from "@/app/helpers";
import { IssuesWithAssigning } from "@/app/types/types";
import { EmptyState } from "@/app/workspaces/[workspaceId]/issues/_components";

type Props = {
  searchParams: IssueQuery;
  params: { workspaceId: string };
};

const IssuesPage = async ({ searchParams, params }: Props) => {
  const statuses: Status[] = Object.values(Status);
  const status: Status | undefined = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;
  const assignedToUserId =
    searchParams.assignedToUserId === "All"
      ? undefined
      : searchParams.assignedToUserId;

  const validOrderFields = columns.map((column) => column.value);
  const sortBy = searchParams.sortBy === "asc" ? "asc" : "desc";

  let orderBy: {} = { createdAt: "desc" };

  if (validOrderFields.includes(searchParams.orderBy)) {
    if (searchParams.orderBy === "workspaceName") {
      orderBy = { Workspace: { name: sortBy } };
    } else {
      orderBy = { [searchParams.orderBy]: sortBy };
    }
  }

  const page = parseInt(searchParams.page) || 1;

  const issues = (await getPaginatedIssuesWithAssignedUser({
    where: {
      status,
      assignedToUserId,
      workspaceId: params.workspaceId,
    },
    orderBy,
    page: (page - 1) * 10,
    pageSize: 10,
  })) as IssuesWithAssigning;

  const issueCount = await prisma.issue.count({
    where: {
      status,
      assignedToUserId,
      workspaceId: params.workspaceId,
    },
  });

  const workspace = await prisma.workspace.findUnique({
    where: { id: params.workspaceId },
    include: {
      issues: true,
      memberships: true,
    },
  });

  if (issues.length === 0 && page === 1) {
    return (
      <Box className="space-y-6">
        <Box className="flex items-center justify-between">
          <Box>
            <Heading size="6" className="mb-1">
              Issues
            </Heading>
            <Text size="3" className="text-gray-500">
              Beheer en volg alle issues in
              <Badge className="mx-2">{workspace?.name || "this workspace"}</Badge>
            </Text>
          </Box>
        </Box>

        <Card className="p-4">
          <IssueActions workspaceId={params.workspaceId} />
        </Card>

        <EmptyState workspaceId={params.workspaceId} status={status} />
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      <Box className="flex items-center justify-between">
        <Box>
          <Heading size="6" className="mb-1">
            Issues
          </Heading>
          <Text size="3" className="text-gray-500">
            {issueCount} {issueCount === 1 ? "issue" : "issues"} in
            <Badge className="mx-2">{workspace?.name || "this workspace"}</Badge>
          </Text>
        </Box>
      </Box>

      <Card className="p-4">
        <IssueActions workspaceId={params.workspaceId} />
      </Card>

      <Card className="overflow-hidden">
        <IssueTable
          searchParams={searchParams}
          issuesWithAssigning={issues}
          workspaceName={workspace?.name ?? ""}
          workspaceId={params.workspaceId}
        />
      </Card>

      {issueCount > 10 && (
        <Flex justify="center" className="pt-4">
          <Suspense
            fallback={
              <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            }
          >
            <Pagination
              itemCount={issueCount}
              pageSize={10}
              currentPage={page}
            />
          </Suspense>
        </Flex>
      )}
    </Box>
  );
};

export default IssuesPage;
