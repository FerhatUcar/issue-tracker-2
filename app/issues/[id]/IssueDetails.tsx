import { IssueStatusBadge } from "@/app/components";
import { Issue } from "@prisma/client";
import { Avatar, Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import React from "react";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";

type IssueDetailsProps = {
  /**
   * The issue object containing details about the issue.
   */
  issue: Issue;
};

const IssueDetails = async ({ issue }: IssueDetailsProps) => {
  const session = await getServerSession();

  const currentUser = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    : null;

  const isAssignedToCurrentUser = issue.assignedToUserId === currentUser?.id;

  return (
    <Card>
      <Flex justify="between" align="center" py="2">
        <Flex align="center" gap="3">
          <IssueStatusBadge status={issue.status} />
          <Text size="2" color="gray">
            {issue.createdAt.toDateString()}
          </Text>
        </Flex>

        {isAssignedToCurrentUser && session?.user?.image && (
          <Avatar
            src={session.user.image}
            fallback="?"
            size="2"
            radius="full"
            referrerPolicy="no-referrer"
          />
        )}
      </Flex>
      <Heading>{issue.title}</Heading>
      <ReactMarkdown>{issue.description}</ReactMarkdown>
    </Card>
  );
};

export default IssueDetails;
