import { notFound } from "next/navigation";
import { CommentForm } from "@/app/components";
import { getComments } from "@/app/helpers";
import { Avatar, Box, Card, Flex } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { type Comment as CommentType } from "@prisma/client";
import { Comment } from "./Comment";

type Props = {
  issueId: number;
};

export const Comments = async ({ issueId }: Props) => {
  const comments: CommentType[] = await getComments(issueId);
  const session = await getServerSession(authOptions);

  if (!comments) {
    notFound();
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
            {comments.map((comment: CommentType) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </Box>
        </Flex>
      )}

      <CommentForm issueId={issueId} />
    </Card>
  );
};
