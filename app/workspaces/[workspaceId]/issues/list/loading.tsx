import React from "react";
import { Box, Table } from "@radix-ui/themes";
import prisma from "@/prisma/client";
import { Skeleton } from "@/app/components";

const LoadingIssuesPage = async () => {
  const issues = await prisma.issue.findMany();

  return (
    <Box>
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
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default LoadingIssuesPage;
