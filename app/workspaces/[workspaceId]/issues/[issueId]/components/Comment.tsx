"use client";

import React, { ChangeEvent, useState } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { useCommentMutation } from "@/app/hooks/use-comment-mutation";
import { ConfirmationDialog } from "@/app/components";
import toast from "react-hot-toast";
import { CommentWithAuthor } from "@/app/types/types";

type Props = {
  /**
   * The comment object containing details like id, content, authorId, and timestamps.
   */
  comment: CommentWithAuthor;

  /**
   * The ID of the issue to which this comment belongs.
   */
  issueId: number;
};

export const Comment = ({ comment, issueId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { deleteComment, updateComment } = useCommentMutation();

  const handleDelete = () =>
    deleteComment.mutate({ commentId: comment.id, issueId });

  const handleUpdate = () => {
    try {
      updateComment.mutate(
        { id: comment.id, content: editedContent, issueId },
        {
          onSuccess: () => setIsEditing(false),
        },
      );
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong while updating the comment");
      }
    }
  };

  const handleEdit = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setEditedContent(e.target.value);

  return (
    <Box className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm w-full">
      <Flex justify="between" align="start">
        <Box className="flex-1 space-y-1">
          <Flex direction="column" mb="4">
            <Text className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {comment.author?.name ?? "Anonymous"}
            </Text>
            <Text className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString("nl-NL", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Text>
          </Flex>

          {isEditing ? (
            <>
              <TextArea value={editedContent} onChange={handleEdit} />
              <Flex justify="end" mt="2">
                <Button
                  variant="soft"
                  onClick={handleUpdate}
                  disabled={!editedContent.trim() || updateComment.isLoading}
                >
                  {updateComment.isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <FaCheck /> Save
                    </>
                  )}
                </Button>
              </Flex>
            </>
          ) : (
            <Text className="text-sm text-gray-700 dark:text-gray-300">
              {comment.content}
            </Text>
          )}
        </Box>

        <Box className="flex flex-col items-center shadow-sm space-y-2 ml-4">
          {isEditing ? (
            <IconButton
              size="1"
              onClick={() => setIsEditing(false)}
              title="Cancel"
              variant="ghost"
              color="gray"
            >
              <FaTimes />
            </IconButton>
          ) : (
            <IconButton
              size="1"
              onClick={() => setIsEditing(true)}
              title="Edit"
              variant="ghost"
              color="gray"
            >
              <FaEdit />
            </IconButton>
          )}
          <ConfirmationDialog
            title="Delete comment?"
            description="Are you sure you want to delete this comment? This action cannot be undone."
            onConfirm={handleDelete}
          />
        </Box>
      </Flex>
    </Box>
  );
};
