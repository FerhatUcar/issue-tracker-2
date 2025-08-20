import { StatusBadge } from "@/app/components";
import { Avatar, Box, Card, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import React from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IssuesWithAssigning } from "@/app/types/types";
import { formatDate } from "@/app/helpers";

type Props = {
  /**
   * The issue object containing details about the
   */
  issue: IssuesWithAssigning;

  /**
   * A unique identifier for a workspace.
   */
  workspaceId: string;
};

const IssueDetails = ({
  issue: { title, description, status, createdAt, assignedToUser },
  workspaceId,
}: Props) => (
  <Card>
    <Flex direction="row" gap="2" align="center">
      <Link href={`/workspaces/${workspaceId}`}>
        <IconButton size="4" variant="soft" color="gray" title="Back">
          <IoMdArrowRoundBack />
        </IconButton>
      </Link>

      <Box className="w-full px-2 rounded-lg">
        <Flex justify="between" align="center" py="2">
          <Flex direction="column" align="start" gap="1">
            <StatusBadge status={status} />
            <Text className="text-xs text-gray-500">
              {formatDate(createdAt, false)}
            </Text>
          </Flex>

          {assignedToUser && (
            <Avatar
              src={assignedToUser.image ?? ""}
              fallback={assignedToUser.name?.[0] ?? "?"}
              size="2"
              radius="large"
              title={assignedToUser.name ?? "Assigned user"}
              referrerPolicy="no-referrer"
            />
          )}
        </Flex>
      </Box>
    </Flex>

    <Box className="p-2 py-4">
      <Heading mb="2">{title}</Heading>
      <ReactMarkdown>{description}</ReactMarkdown>
    </Box>
  </Card>
);

export default IssueDetails;
