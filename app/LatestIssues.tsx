import prisma from "@/prisma/client";
import {
  Avatar,
  Card,
  Flex,
  Heading,
  IconButton,
  Separator,
  Table,
} from "@radix-ui/themes";
import React from "react";
import { IssueStatusBadge } from "./components";
import Link from "next/link";
import { AiFillFileAdd, AiOutlineNotification } from "react-icons/ai";

const LatestIssues = async () => {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  return (
    <Card>
      <Flex width="100%" justify="between" align="center">
        <Flex align="center" gap="3">
          <AiOutlineNotification size="25" />
          <Flex gap="1" className="uppercase">
            <Heading size="6" weight="bold">
              Latest
            </Heading>
            <Heading size="6" weight="light">
              Issues
            </Heading>
          </Flex>
        </Flex>
        <Link href="/issues/new">
          <IconButton>
            <AiFillFileAdd />
          </IconButton>
        </Link>
      </Flex>
      <Separator mt="2" size="4" />
      <Table.Root>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Flex justify="between" align="center">
                  <Flex direction="row" align="center" height="8" gap="2">
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
    </Card>
  );
};

export default LatestIssues;
