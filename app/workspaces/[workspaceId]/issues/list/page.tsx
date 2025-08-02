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
  const columnNames = columns.map((column) => column.value);
  const sortOrder: "asc" | "desc" =
    searchParams.sortBy === "asc" ? "asc" : "desc";

  const orderBy: {
    [key: string]: "asc" | "desc";
  } =
    columnNames.includes(searchParams.orderBy) && searchParams.sortBy
      ? { [searchParams.orderBy]: sortOrder }
      : { createdAt: "desc" };

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

  return (
    <Card>
      <Flex direction="column" gap="3">
        <IssueActions workspaceId={params.workspaceId} />
        <IssueTable searchParams={searchParams} issuesWithAssigning={issues} workspaceId={params.workspaceId} />
        <Suspense>
          <Pagination itemCount={issueCount} pageSize={10} currentPage={page} />
        </Suspense>
      </Flex>
    </Card>
  );
};

export default IssuesPage;
