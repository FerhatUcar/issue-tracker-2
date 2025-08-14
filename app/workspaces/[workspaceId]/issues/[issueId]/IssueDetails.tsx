import { StatusBadge } from "@/app/components";
import { Avatar, Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import React from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IssuesWithAssigning } from "@/app/types/types";
import { formatDate } from "@/app/helpers";

type Props = {
  /**
   * The issue object containing details about the issue.
   */
  issue: IssuesWithAssigning;

  /**
   * A unique identifier for a workspace.
   */
  workspaceId: string;
};

const IssueDetails = ({ issue, workspaceId }: Props) => (
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
            <Text className="text-xs text-gray-500">
              {formatDate(issue.createdAt, false)}
            </Text>
          </Flex>
          {issue.assignedToUser && (
            <Avatar
              src={issue.assignedToUser.image ?? ""}
              fallback={issue.assignedToUser.name?.[0] ?? "?"}
              size="2"
              radius="large"
              title={issue.assignedToUser.name ?? "Assigned user"}
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

export default IssueDetails;
