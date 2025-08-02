"use client";

import { CommentForm } from "@/app/components";
import { Avatar, Box, Card, Flex } from "@radix-ui/themes";
import { Comment } from "./Comment";
import { useComments } from "@/app/hooks";
import { Spinner } from "@/app/components";
import { useSession } from "next-auth/react";

type Props = {
  issueId: number;
};

export const Comments = ({ issueId }: Props) => {
  const { data: comments = [], isLoading } = useComments(issueId);
  const { data: session } = useSession();

  if (isLoading) {
    return (
      <Box className="h-20 flex items-center justify-center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Card mt="5">
      <h4 className="mb-4">
        <Flex direction="row" gap="2" align="center" content="center">
          <span>💬</span> <span>Comments</span>
        </Flex>
      </h4>

      {comments.length === 0 ? (
        <Box className="text-sm text-gray-500">No comments yet.</Box>
      ) : (
        <Flex direction="row" gap="2" content="center" align="start">
          <Box className="space-y-4 w-full">
            {comments.map((comment) => (
              <Flex direction="row" gap="2" key={comment.id}>
                {session ? (
                  <Avatar
                    src={session.user?.image ?? ''}
                    fallback="?"
                    size="2"
                    radius="full"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <Comment comment={comment} issueId={issueId} />
              </Flex>
            ))}
          </Box>
        </Flex>
      )}

      <CommentForm issueId={issueId} />
    </Card>
  );
};
