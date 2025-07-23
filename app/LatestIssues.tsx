import prisma from "@/prisma/client";
import {
  Avatar,
  Card,
  Flex,
  Heading,
  Button,
  Separator,
  Table,
} from "@radix-ui/themes";
import React from "react";
import { IssueStatusBadge } from "./components";
import Link from "next/link";
import { AiFillFileAdd, AiFillNotification } from "react-icons/ai";

const LatestIssues = async () => {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      assignedToUser: true,
    },
  });

  return (
    <Card>
      <Flex width="100%" align="center" gap="3">
        <AiFillNotification size="20" />
        <Heading size="3" weight="bold">
          Latest issues
        </Heading>
      </Flex>
      <Separator mt="2" size="4" />
      <Table.Root>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Flex justify="between" align="center">
                  <Flex direction="row" align="center" height="5" gap="2">
                    <IssueStatusBadge status={issue.status} />
                    <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                  </Flex>
                  {issue.assignedToUser && (
                    <Avatar
                      src={issue.assignedToUser.image!}
                      fallback="?"
                      size="2"
                      radius="full"
                    />
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex justify="end">
        <Link href="/issues/new" className="mt-3">
          <Button>
            <AiFillFileAdd />
            Create new issue
          </Button>
        </Link>
      </Flex>
    </Card>
  );
};

export default LatestIssues;
