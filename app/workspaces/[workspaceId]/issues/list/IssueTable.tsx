"use client";

import React, { FC, useEffect, useState } from "react";
import { Avatar, Flex, Table } from "@radix-ui/themes";
import NextLink from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { StatusBadge, Link } from "@/app/components";
import { Issue, Status } from "@prisma/client";
import { columns } from "@/app/workspaces/[workspaceId]/issues/list/IssueColumns";
import { useSession } from "next-auth/react";
import { type IssuesWithAssigning } from "@/app/types/types";
import { useRecoilValue } from "recoil";
import { searchValueState } from "@/app/state";

export type IssueQuery = {
  status: Status;
  assignedToUserId: string;
  orderBy: keyof Issue;
  sortBy: "asc" | "desc";
  page: string;
};

type IssueTableProps = {
  /**
   * The search parameters used to filter and sort the issues.
   */
  searchParams: IssueQuery;

  /**
   * The list of issues with their assigned user information.
   */
  issuesWithAssigning: IssuesWithAssigning;
  workspaceId: string;
};

const IssueTable: FC<IssueTableProps> = ({
  searchParams,
  issuesWithAssigning,
  workspaceId
}) => {
  const { status } = useSession();
  const [sort, setSort] = useState("asc");
  const searchValue = useRecoilValue(searchValueState);
  const [filteredList, setFilteredList] = useState(issuesWithAssigning);

  let updatedList: IssuesWithAssigning = [...issuesWithAssigning];

  useEffect(
    () =>
      setFilteredList(
        updatedList.filter(
          ({ title }) =>
            title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1,
        ),
      ),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchValue, issuesWithAssigning],
  );

  const handleOnSort = () => setSort(sort === "asc" ? "desc" : "asc");

  const hideLastColumnOnSignOff =
    status === "unauthenticated" || status === "loading" ? -1 : undefined;

  return (
    <Table.Root variant="surface">
    <Table.Header>
        <Table.Row>
          {columns.slice(0, hideLastColumnOnSignOff).map((column) => (
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
        {filteredList.map((issue) => (
          <Table.Row
            key={issue.id}
            className="hover:bg-sky-800/10 transition-colors"
          >
            <Table.Cell>
              <Flex align="center" justify="between">
                <Link href={`/workspaces/${workspaceId}/issues/${issue.id}`}>{issue.title}</Link>
              </Flex>
            </Table.Cell>
            <Table.Cell>
              <StatusBadge status={issue.status} />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              {issue.createdAt.toDateString()}
            </Table.Cell>
            {status === "authenticated" && (
              <Table.Cell>
                {issue.assignedToUserId ? (
                  <Avatar
                    src={issue.assignedToUser?.image!}
                    fallback="?"
                    size="2"
                    radius="full"
                    referrerPolicy="no-referrer"
                  />
                ) : "Unassigned"}
              </Table.Cell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default IssueTable;
