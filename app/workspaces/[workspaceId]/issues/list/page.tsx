import React, { Suspense } from "react";
import prisma from "@/prisma/client";
import IssueActions from "@/app/workspaces/[workspaceId]/issues/list/IssueActions";
import { Status } from "@prisma/client";
import { Pagination } from "@/app/components";
import IssueTable, {
  IssueQuery,
} from "@/app/workspaces/[workspaceId]/issues/list/IssueTable";
import { Card, Flex } from "@radix-ui/themes";
import { columns } from "@/app/workspaces/[workspaceId]/issues/list/IssueColumns";
import { getPaginatedIssuesWithAssignedUser } from "@/app/helpers";
import { IssuesWithAssigning } from "@/app/types/types";

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

  let orderBy: any = { createdAt: "desc" }; // default fallback

  if (validOrderFields.includes(searchParams.orderBy)) {
    if (searchParams.orderBy === "workspaceName") {
      orderBy = { Workspace: { name: sortBy } };
    } else {
      orderBy = { [searchParams.orderBy]: sortBy };
    }
  }

  const page = parseInt(searchParams.page) || 1;

  const issues = (await getPaginatedIssuesWithAssignedUser({
    where: { status, assignedToUserId },
    orderBy,
    page: (page - 1) * 10,
    pageSize: 10,
  })) as IssuesWithAssigning;

  const issueCount = await prisma.issue.count({
    where: { status, assignedToUserId },
  });

  const workspace = await prisma.workspace.findUnique({
    where: { id: params.workspaceId },
    include: {
      issues: true,
      memberships: true,
    },
  });

  return (
    <Card>
      <Flex direction="column" gap="3">
        <IssueActions workspaceId={params.workspaceId} />
        <IssueTable
          searchParams={searchParams}
          issuesWithAssigning={issues}
          workspaceName={workspace?.name ?? ""}
          workspaceId={params.workspaceId}
        />
        <Suspense>
          <Pagination itemCount={issueCount} pageSize={10} currentPage={page} />
        </Suspense>
      </Flex>
    </Card>
  );
};

export default IssuesPage;
