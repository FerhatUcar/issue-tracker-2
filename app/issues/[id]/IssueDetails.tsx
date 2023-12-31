import { IssueStatusBadge } from "@/app/components";
import { Issue } from "@prisma/client";
import { Avatar, Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import React from "react";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";

const IssueDetails = async ({ issue }: { issue: Issue }) => {
  let userId;
  const session = await getServerSession();
  const getUserId = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  getUserId.forEach(({ id }) => (userId = id));

  return (
    <>
      <Heading className="uppercase pb-3">{issue.title}</Heading>
      <Card>
        <Flex justify="between" align="center">
          <Flex justify="between" className="space-x-3" my="2">
            <IssueStatusBadge status={issue.status} />
            <Text>{issue.createdAt.toDateString()}</Text>
          </Flex>
          {issue.assignedToUserId === userId && (
            <Avatar
              src={session!.user!.image!}
              fallback="?"
              size="2"
              radius="full"
              referrerPolicy="no-referrer"
            />
          )}
        </Flex>
      </Card>
      <Card className="prose max-w-full text-white" mt="4">
        <ReactMarkdown>{issue.description}</ReactMarkdown>
      </Card>
    </>
  );
};

export default IssueDetails;
