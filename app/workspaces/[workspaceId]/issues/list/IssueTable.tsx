"use client";

import React, { FC, useEffect, useState } from "react";
import { Avatar, Flex, Table } from "@radix-ui/themes";
import NextLink from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Link, StatusBadge } from "@/app/components";
import { Issue, Status } from "@prisma/client";
import { columns } from "@/app/workspaces/[workspaceId]/issues/list/IssueColumns";
import { useSession } from "next-auth/react";
import { type IssuesWithAssigning } from "@/app/types/types";
import { useRecoilValue } from "recoil";
import { searchValueState } from "@/app/state";

export type OrderableIssueField = keyof Issue | "workspaceName";

export type IssueQuery = {
  status: Status;
  assignedToUserId: string;
  orderBy: OrderableIssueField;
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
  issuesWithAssigning: IssuesWithAssigning[];

  /**
   * A unique identifier representing a specific workspace.
   * This ID is typically used to differentiate between various workspaces
   * within a system or application.
   */
  workspaceId: string;

  /**
   * Specifies the name of the workspace.
   * This variable holds a string representing the unique name assigned to the workspace.
   * Typically used to identify or label a specific workspace in applications or systems.
   * When empty, the individual workspace name from each issue will be used.
   */
  workspaceName: string;

  /**
   * Optional prop to show workspace names from individual issues
   * instead of using the single workspaceName prop
   */
  showWorkspacePerIssue?: boolean;
};

const IssueTable: FC<IssueTableProps> = ({
  searchParams,
  issuesWithAssigning,
  workspaceId,
  workspaceName,
  showWorkspacePerIssue = false,
}) => {
  const { status } = useSession();
  const [sort, setSort] = useState("asc");
  const searchValue = useRecoilValue(searchValueState);
  const [filteredList, setFilteredList] =
    useState<IssuesWithAssigning[]>(issuesWithAssigning);

  const updatedList = [...issuesWithAssigning];

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

  const isCrossWorkspace = showWorkspacePerIssue || workspaceId === "";

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
                <Link
                  href={
                    isCrossWorkspace
                      ? `/workspaces/${issue.workspaceId}/issues/${issue.id}`
                      : `/workspaces/${workspaceId}/issues/${issue.id}`
                  }
                >
                  {issue.title}
                </Link>
              </Flex>
            </Table.Cell>
            <Table.Cell>
              <StatusBadge status={issue.status} />
            </Table.Cell>
            <Table.Cell>
              {isCrossWorkspace ? issue.Workspace?.name : workspaceName}
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              {issue.createdAt.toDateString()}
            </Table.Cell>
            {status === "authenticated" && (
              <Table.Cell>
                {issue.assignedToUserId ? (
                  <Avatar
                    src={issue.assignedToUser?.image ?? ""}
                    fallback="?"
                    size="2"
                    radius="large"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  "Unassigned"
                )}
              </Table.Cell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default IssueTable;
