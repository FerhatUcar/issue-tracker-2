"use client";

import React, { useState } from "react";
import {
  Box,
  Text,
  TextArea,
  Button,
  Flex,
  IconButton,
} from "@radix-ui/themes";
import { type Comment as CommentType } from "@prisma/client";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useCommentMutation } from "@/app/hooks/use-comment-mutation";
import toast from "react-hot-toast";

type Props = {
  /**
   * The comment object containing details like id, content, authorId, and createdAt.
   */
  comment: CommentType;

  /**
   * The ID of the issue to which this comment belongs.
   */
  issueId: number;
};

export const Comment = ({ comment, issueId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { deleteComment, updateComment } = useCommentMutation();

  const handleDelete = () => {
    deleteComment.mutate({ commentId: comment.id, issueId });
  };

  const handleUpdate = async () => {
    try {
      updateComment.mutate(
        { id: comment.id, content: editedContent, issueId },
        {
          onSuccess: () => setIsEditing(false),
        },
      );
    } catch (error) {
      console.error(error);
      toast.error('Failed to update comment');
    }
  };

  return (
    <Box className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm space-y-2">
      <Flex justify="between" align="center">
        <Flex direction="column" align="start">
          <Text className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {comment.authorId ?? "Anonymous"}
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
        <Flex gap="2">
          {isEditing ? (
            <IconButton
              size="1"
              onClick={() => setIsEditing(false)}
              title="Cancel"
            >
              <FaTimes />
            </IconButton>
          ) : (
            <IconButton
              size="1"
              onClick={() => setIsEditing(true)}
              title="Edit"
              variant="soft"
            >
              <FaEdit />
            </IconButton>
          )}
          <IconButton
            size="1"
            color="red"
            onClick={handleDelete}
            title="Delete"
          >
            <FaTrash />
          </IconButton>
        </Flex>
      </Flex>

      {isEditing ? (
        <Box>
          <TextArea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full mt-2"
          />
          <Flex justify="end" mt="2">
            <Button
              size="1"
              variant="soft"
              onClick={handleUpdate}
              disabled={!editedContent.trim()}
            >
              <FaCheck />
              Save
            </Button>
          </Flex>
        </Box>
      ) : (
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {comment.content}
        </p>
      )}
    </Box>
  );
};
