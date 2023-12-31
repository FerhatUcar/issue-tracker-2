import React from "react";
import { Table } from "@radix-ui/themes";
import IssueActions from "@/app/issues/list/IssueActions";
import prisma from "@/prisma/client";
import { Skeleton } from "@/app/components";

const LoadingIssuesPage = async () => {
  const issues = await prisma.issue.findMany();

  return (
    <div>
      <IssueActions />
      <Table.Root variant="surface" className="mt-5">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Skeleton />
                <div className="block md:hidden">
                  <Skeleton />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default LoadingIssuesPage;
