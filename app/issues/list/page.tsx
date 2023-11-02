import React from "react";
import prisma from "@/prisma/client";
import IssueActions from "@/app/issues/list/IssueActions";
import { Issue, Status } from "@prisma/client";
import Pagination from "@/app/components/Pagination";
import IssueTable, { IssueQuery } from "@/app/issues/list/IssueTable";
import { Flex } from "@radix-ui/themes";
import { columns } from "@/app/issues/list/IssueColumns";

type IssuePageProps = {
  searchParams: IssueQuery;
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
  const orderBy = columnNames.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: searchParams.sortBy }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const issues: Issue[] = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });
  const getUserId = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssueTable
        searchParams={searchParams}
        issues={issues}
        userList={getUserId}
      />
      <Pagination
        itemCount={issueCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </Flex>
  );
};

export default IssuesPage;
