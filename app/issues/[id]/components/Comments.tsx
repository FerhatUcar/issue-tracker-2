import Image from "next/image";
import { notFound } from "next/navigation";
import { CommentForm } from "@/app/components";
import { getComments } from "@/app/helpers";
import { Box, Card, Heading } from "@radix-ui/themes";

type Props = {
  issueId: number;
};

export const Comments = async ({ issueId }: Props) => {
  const comments = await getComments(issueId);

  if (!comments) {
    notFound();
  }

  return (
    <Card mt="6">
      <Heading mb="4">💬 Comments</Heading>

      {comments.length === 0 ? (
        <Box className="text-sm text-gray-500">No comments yet.</Box>
      ) : (
        <Box className="space-y-3">
          {comments.map((comment) => (
            <Box
              key={comment.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm"
            >
              <Box className="flex items-center gap-3 mb-2">
                {comment.author?.image && (
                  <Image
                    src={comment.author.image}
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <Box className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {comment.authorId ?? "Anonymous"}
                </Box>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </Box>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            </Box>
          ))}
        </Box>
      )}

      <CommentForm issueId={issueId} />
    </Card>
  );
};
