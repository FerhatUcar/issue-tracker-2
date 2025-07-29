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
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useCommentMutation } from "@/app/hooks/use-comment-mutation";
import toast from "react-hot-toast";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

type Props = {
  comment: CommentType;
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
      await updateComment.mutateAsync(
        { id: comment.id, content: editedContent, issueId },
        {
          onSuccess: () => setIsEditing(false),
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update comment");
    }
  };

  return (
    <Box className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm space-y-3">
      <Flex justify="between" align="start">
        <Box className="flex-1 space-y-1">
          <Flex direction="column" mb="2">
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

          {isEditing ? (
            <Box mt="2">
              <TextArea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full"
              />
              <Flex justify="end" mt="2">
                <Button
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

        <Box className="ml-4 p-2 space-y-2 w-10 flex flex-col items-center shadow-sm">
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
          <DeleteConfirmationDialog
            onConfirm={handleDelete}
            title="Comment verwijderen?"
            description="Weet je zeker dat je deze comment wilt verwijderen? Deze actie is permanent."
          />
        </Box>
      </Flex>
    </Box>
  );
};
