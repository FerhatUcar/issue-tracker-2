"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import { Avatar, Flex, Table, Text } from "@radix-ui/themes";
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
   * Must include `workspace` via Prisma include.
   */
  issuesWithAssigning: IssuesWithAssigning[];

  /**
   * Force showing workspace per issue (even if all belong to the same workspace).
   */
  showWorkspacePerIssue?: boolean;
};

const IssueTable: FC<IssueTableProps> = ({
  searchParams,
  issuesWithAssigning,
  showWorkspacePerIssue = false,
}) => {
  const { status } = useSession();
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const searchValue = useRecoilValue(searchValueState);
  const [filteredList, setFilteredList] =
    useState<IssuesWithAssigning[]>(issuesWithAssigning);

  // Determine if issues span multiple workspaces
  const isCrossWorkspace = useMemo(() => {
    if (showWorkspacePerIssue) {
      return true;
    }

    const ids = new Set(
      issuesWithAssigning.map((i) => i.workspace?.id ?? "__no_ws__"),
    );

    return ids.size > 1;
  }, [issuesWithAssigning, showWorkspacePerIssue]);

  useEffect(() => {
    const q = searchValue.toLowerCase();
    setFilteredList(
      issuesWithAssigning.filter(({ title }) =>
        title.toLowerCase().includes(q),
      ),
    );
  }, [searchValue, issuesWithAssigning]);

  const handleOnSort = () =>
    setSort((prev) => (prev === "asc" ? "desc" : "asc"));

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
        {filteredList.map((issue) => {
          const wsId = issue.workspace?.id;
          const wsName = issue.workspace?.name ?? "Unknown workspace";
          const created = issue.createdAt;

          return (
            <Table.Row
              key={issue.id}
              className="hover:bg-sky-800/10 transition-colors text-xs"
            >
              <Table.Cell>
                <Flex align="center" justify="between">
                  {wsId ? (
                    <Link href={`/workspaces/${wsId}/issues/${issue.id}`}>
                      {issue.title}
                    </Link>
                  ) : (
                    <Text>{issue.title}</Text>
                  )}
                </Flex>
              </Table.Cell>

              <Table.Cell>
                <StatusBadge status={issue.status} />
              </Table.Cell>

              <Table.Cell>{isCrossWorkspace ? wsName : wsName}</Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {created ? created.toDateString() : ""}
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
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};

export default IssueTable;
