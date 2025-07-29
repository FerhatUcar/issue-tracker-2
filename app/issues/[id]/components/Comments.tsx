"use client";

import { CommentForm } from "@/app/components";
import { Avatar, Box, Card, Flex } from "@radix-ui/themes";
import { Comment } from "./Comment";
import { useComments } from "@/app//hooks";
import { Spinner } from "@/app//components";
import { useSession } from "next-auth/react";

type Props = {
  issueId: number;
};

export const Comments = async ({ issueId }: Props) => {
  const { data: comments = [], isLoading } = useComments(issueId);
  const { data: session } = useSession();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Card mt="6">
      <h4 className="mb-4">
        <Flex direction="row" gap="2" align="center" content="center">
          <span>💬</span> <span>Comments</span>
        </Flex>
      </h4>

      {comments.length === 0 ? (
        <Box className="text-sm text-gray-500">No comments yet.</Box>
      ) : (
        <Flex direction="row" gap="2" content="center" align="start">
          <Avatar
            src={session!.user!.image!}
            fallback="?"
            size="2"
            radius="full"
            className="cursor-pointer hover:border-2 border-gray-300 transition-all"
            referrerPolicy="no-referrer"
          />
          <Box className="space-y-3 w-full">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} issueId={issueId} />
            ))}
          </Box>
        </Flex>
      )}

      <CommentForm issueId={issueId} />
    </Card>
  );
};
