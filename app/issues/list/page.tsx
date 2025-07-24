import React, { Suspense } from "react";
import prisma from "@/prisma/client";
import IssueActions from "@/app/issues/list/IssueActions";
import { Issue, Status } from "@prisma/client";
import Pagination from "@/app/components/Pagination";
import IssueTable, { IssueQuery } from "@/app/issues/list/IssueTable";
import { Card, Flex } from "@radix-ui/themes";
import { columns } from "@/app/issues/list/IssueColumns";

type IssuePageProps = {
  searchParams: IssueQuery;
};

export type IssuesWithAssigning = (Issue & AssignedToUser)[];
export type AssignedToUser = {
  assignedToUser: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    emailVerified: Date | null;
  } | null;
};

const IssuesPage = async ({ searchParams }: IssuePageProps) => {
  const statuses: Status[] = Object.values(Status);
  const status: Status | undefined = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;
  const assignedToUserId =
    searchParams.assignedToUserId === "All"
      ? undefined
      : searchParams.assignedToUserId;
  const where = { status, assignedToUserId };
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
  const pageSize = 10;

  const issuesWithAssigning: IssuesWithAssigning = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      assignedToUser: true,
    },
  });

  const issueCount = await prisma.issue.count({ where });

  return (
    <Card>
      <Flex direction="column" gap="3">
        <IssueActions />
        <IssueTable
          searchParams={searchParams}
          issuesWithAssigning={issuesWithAssigning}
        />
        <Suspense>
          <Pagination
            itemCount={issueCount}
            pageSize={pageSize}
            currentPage={page}
          />
        </Suspense>
      </Flex>
    </Card>
  );
};

export default IssuesPage;
