import React from "react";
import { Box, Text } from "@radix-ui/themes";
import { type Comment as CommentType } from "@prisma/client";

type Props = {
  /**
   * The comment object containing details about the comment.
   */
  comment: CommentType;
};

export const Comment = ({ comment }: Props) => (
  <Box className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm">
    <Box className="flex items-center justify-between gap-3 mb-2">
      <Box className="text-sm font-medium text-gray-800 dark:text-gray-100">
        {comment.authorId ?? "Anonymous"}
      </Box>
      <Text className="text-xs text-gray-500 ml-auto">
        {new Date(comment.createdAt).toLocaleString("nl-NL", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </Text>
    </Box>
    <p className="text-sm text-gray-700 dark:text-gray-300">
      {comment.content}
    </p>
  </Box>
);
