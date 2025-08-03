import { StatusBadge } from "@/app/components";
import { Issue } from "@prisma/client";
import { Avatar, Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import React from "react";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import authOptions from "@/app/auth/authOptions";

type IssueDetailsProps = {
  /**
   * The issue object containing details about the issue.
   */
  issue: Issue;

  /**
   * A unique identifier for a workspace.
   */
  workspaceId: string;
};

const IssueDetails = async ({ issue, workspaceId }: IssueDetailsProps) => {
  const session = await getServerSession(authOptions);

  const currentUser = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    : null;

  const isAssignedToCurrentUser = issue.assignedToUserId === currentUser?.id;

  return (
    <Card>
      <Flex direction="row" gap="2" align="center">
        <Box className="w-12 h-12 bg-gray-100 dark:bg-black/20 px-4 rounded-lg flex items-center justify-center">
          <Link href={`/workspaces/${workspaceId}`}>
            <IoMdArrowRoundBack />
          </Link>
        </Box>
        <Box className="w-full bg-gray-100 dark:bg-black/20 px-4 rounded-lg">
          <Flex justify="between" align="center" py="2">
            <Flex align="center" gap="3">
              <StatusBadge status={issue.status} />
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
        </Box>
      </Flex>

      <Box className="p-2 py-4">
        <Heading mb="2">{issue.title}</Heading>
        <ReactMarkdown>{issue.description}</ReactMarkdown>
      </Box>
    </Card>
  );
};

export default IssueDetails;
