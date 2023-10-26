"use client";

import React, { FC, useState } from "react";
import { Avatar, Flex, Table } from "@radix-ui/themes";
import NextLink from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { IssueStatusBadge, Link } from "@/app/components";
import { Issue, Status } from "@prisma/client";
import { columns } from "@/app/issues/list/IssueColumns";
import { useSession } from "next-auth/react";

export type IssueQuery = {
  status: Status;
  orderBy: keyof Issue;
  sortBy: "asc" | "desc";
  page: string;
};
export type Column = {
  label: string;
  value: keyof Issue;
  className?: string;
};

type IssueTableProps = {
  searchParams: IssueQuery;
  issues: Issue[];
};

const IssueTable: FC<IssueTableProps> = async ({ searchParams, issues }) => {
  const [sort, setSort] = useState("asc");
  const { data: session } = useSession();

  const handleOnSort = () => setSort(sort === "asc" ? "desc" : "asc");

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.className}
            >
              <NextLink
                onClick={handleOnSort}
                href={{
                  query: {
                    ...searchParams,
                    sortBy: sort,
                    orderBy: column.value,
                  },
                }}
              >
                {column.label}
              </NextLink>
              {column.value === searchParams.orderBy &&
                searchParams.sortBy === "asc" && (
                  <ArrowUpIcon className="inline" />
                )}
              {column.value === searchParams.orderBy &&
                searchParams.sortBy === "desc" && (
                  <ArrowDownIcon className="inline" />
                )}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {issues.map((issue) => (
          <Table.Row
            key={issue.id}
            className="h-16 hover:bg-gray-800 text-pink-100 transition-colors"
          >
            <Table.Cell>
              <Flex align="center" justify="between">
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
              </Flex>
            </Table.Cell>
            <Table.Cell>
              <IssueStatusBadge status={issue.status} />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              {issue.createdAt.toDateString()}
            </Table.Cell>
            <Table.Cell>
              {issue.assignedToUserId && (
                <Avatar
                  src={session?.user?.image!}
                  fallback="?"
                  size="2"
                  radius="full"
                  referrerPolicy="no-referrer"
                />
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default IssueTable;
