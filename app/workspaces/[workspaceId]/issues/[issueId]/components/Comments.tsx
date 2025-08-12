"use client";

import { CommentForm } from "@/app/components";
import { Avatar, Box, Card, Flex, Text } from "@radix-ui/themes";
import { Comment } from "./Comment";
import { useComments } from "@/app/hooks";
import { BsWechat } from "react-icons/bs";
import Skeleton from "react-loading-skeleton";

type Props = {
  issueId: number;
};

export const Comments = ({ issueId }: Props) => {
  const { data: comments = [], isLoading } = useComments(issueId);

  return (
    <Card mt="4">
      <Box mb="4">
        <Text size="3" weight="bold">
          <Flex direction="row" gap="2" align="center" content="center">
            <BsWechat /> Comments
          </Flex>
        </Text>
      </Box>

      {comments.length === 0 ? (
        <Box className="text-sm text-gray-500">No comments yet.</Box>
      ) : (
        <Flex direction="row" gap="2" content="center" align="start">
          {isLoading ? (
            <Skeleton />
          ) : (
            <Box className="space-y-4 w-full">
              {comments.map((comment) => {
                const { author } = comment;
                const fallback = (
                  author?.name?.[0] ??
                  author?.email?.[0] ??
                  "?"
                ).toUpperCase();

                return (
                  <Flex direction="row" gap="2" key={comment.id}>
                    <Avatar
                      src={author?.image ?? ""}
                      fallback={fallback}
                      size="2"
                      radius="full"
                      referrerPolicy="no-referrer"
                    />
                    <Comment comment={comment} issueId={issueId} />
                  </Flex>
                );
              })}
            </Box>
          )}
        </Flex>
      )}

      <CommentForm issueId={issueId} />
    </Card>
  );
};
