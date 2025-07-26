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
import { IssueStatusBadge, NoIssuesPlaceholder } from "./components";
import Link from "next/link";
import { AiFillPlusCircle } from "react-icons/ai";
import { IoTicketOutline } from "react-icons/io5";

const LatestIssues = async () => {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      assignedToUser: true,
    },
  });

  const hasIssues = issues.length > 0;

  return (
    <Card>
      <Flex width="100%" align="center" gap="3">
        <IoTicketOutline size="20" />
        <Heading size="3" weight="bold">
          Latest issues
        </Heading>
      </Flex>

      <Separator mt="2" size="4" />

      {hasIssues ? (
        <Table.Root className="h-[calc(100%-84px)]">
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
      ) : (
        <NoIssuesPlaceholder />
      )}

      <Link href="/issues/new">
        <Button
          className="w-full justify-start mt-3"
          variant="soft"
          size="3"
          mt="3"
        >
          <AiFillPlusCircle />
          Create new issue
        </Button>
      </Link>
    </Card>
  );
};

export default LatestIssues;
