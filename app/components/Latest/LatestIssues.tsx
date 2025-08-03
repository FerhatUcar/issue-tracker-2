import {
  Avatar,
  Card,
  Flex,
  Heading,
  Button,
  Box,
  Text,
  Badge,
} from "@radix-ui/themes";
import React from "react";
import { StatusBadge, NoIssuesPlaceholder } from "@/app/components";
import Link from "next/link";
import { AiFillPlusCircle } from "react-icons/ai";
import { IoTicketOutline } from "react-icons/io5";
import { getLatestIssues } from "@/app/helpers";
import { type IssuesWithAssigning } from "@/app/types/types";

type Props = {
  workspaceId: string;
};

export const LatestIssues = async ({ workspaceId }: Props) => {
  const issues: IssuesWithAssigning = await getLatestIssues(workspaceId);
  const hasIssues = issues.length > 0;

  return (
    <Card>
      <Flex width="100%" align="center" gap="3" mb="3">
        <IoTicketOutline size="20" />
        <Heading size="3" weight="bold">
          Latest issues
        </Heading>
      </Flex>

      {hasIssues ? (
        <Box className="h-[calc(100%-90px)]">
          {issues.map((issue) => (
            <Link
              href={`/workspaces/${workspaceId}/issues/${issue.id}`}
              key={issue.id}
            >
              <Box
                mb="3"
                className="bg-neutral-200/40 hover:bg-neutral-200 dark:bg-neutral-900/50 dark:hover:bg-neutral-900 transition rounded-lg px-4 py-2 min-h-[48px] content-center"
              >
                <Flex justify="between" align="center">
                  <Flex direction="row" align="center" height="5" gap="2">
                    <Box className="w-16">
                      <StatusBadge status={issue.status} />
                    </Box>

                    <Box className="truncate max-w-[180px]">
                      <Text className="truncate">{issue.title}</Text>
                    </Box>
                  </Flex>

                  <Flex gap="2">
                    {issue.Comment.length > 0 && (
                      <Badge variant="soft" color="gray">
                        💬 {issue.Comment.length}
                      </Badge>
                    )}
                    {issue.assignedToUser && (
                      <Avatar
                        src={issue.assignedToUser.image!}
                        fallback="?"
                        size="2"
                        radius="full"
                      />
                    )}
                  </Flex>
                </Flex>
              </Box>
            </Link>
          ))}
        </Box>
      ) : (
        <Box className="h-[calc(100%-95px)]">
          <NoIssuesPlaceholder />
        </Box>
      )}

      <Link href={`/workspaces/${workspaceId}/issues/new`}>
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
