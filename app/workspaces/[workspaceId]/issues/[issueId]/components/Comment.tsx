"use client";

import { ChangeEvent, useState } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { FaCheck, FaPencilAlt, FaTimes, FaTrash } from "react-icons/fa";
import { useCommentMutation } from "@/app/hooks/use-comment-mutation";
import {
  ConfirmationDialog,
  DislikeButton,
  LikeButton,
} from "@/app/components";
import toast from "react-hot-toast";
import { CommentWithReactions } from "@/app/types/types";
import { useSession } from "next-auth/react";
import { useCommentReaction } from "@/app/hooks";
import { formatDate } from "@/app/helpers";

type Props = {
  /**
   * The comment object containing details like id, content, authorId, and timestamps.
   */
  comment: CommentWithReactions;

  /**
   * The ID of the issue to which this comment belongs.
   */
  issueId: number;
};

export const Comment = ({ comment, issueId }: Props) => {
  const { data: session } = useSession();
  const { deleteComment, updateComment } = useCommentMutation();
  const { mutate, isPending } = useCommentReaction();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [open, setOpen] = useState(false);

  const currentUserId = session?.user?.id;
  const canModify = currentUserId === comment.author?.id;

  const handleDelete = () => {
    deleteComment.mutate({ commentId: comment.id, issueId });
  };

  const handleUpdate = () => {
    try {
      updateComment.mutate(
        { id: comment.id, content: editedContent, issueId },
        { onSuccess: () => setIsEditing(false) },
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

  const handleEdit = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => setEditedContent(value);

  const onReact = (type: "LIKE" | "DISLIKE") => {
    if (isPending) {
      return;
    }

    mutate({ commentId: comment.id, issueId, type });
  };

  return (
    <Flex direction="column" width="100%">
      <Box className="bg-neutral-100 dark:bg-neutral-900 rounded-t-md p-4 shadow-sm">
        <Box className="flex-1 space-y-1">
          <Flex direction="column" mb="4">
            <Text className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {comment.author?.name ?? "Anonymous"}
            </Text>
            <Text className="text-xs text-gray-500">
              {formatDate(comment.createdAt ?? "")}
            </Text>
          </Flex>

          {isEditing ? (
            <>
              <TextArea value={editedContent} onChange={handleEdit} />
              <Flex justify="end">
                <Button
                  variant="soft"
                  mt="2"
                  onClick={handleUpdate}
                  disabled={!editedContent.trim() || updateComment.isPending}
                >
                  {updateComment.isPending ? (
                    "Saving..."
                  ) : (
                    <Flex align="center" gap="2">
                      <FaCheck /> <Text>Save</Text>
                    </Flex>
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
      </Box>

      <Box className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 rounded-b-md p-4 shadow-sm">
        <Flex justify="between" align="center">
          <Flex align="center" gap="4">
            <LikeButton
              count={comment.likesCount ?? 0}
              active={comment.myReaction === "LIKE"}
              onClick={() => onReact("LIKE")}
            />
            <DislikeButton
              count={comment.dislikesCount ?? 0}
              active={comment.myReaction === "DISLIKE"}
              onClick={() => onReact("DISLIKE")}
            />
          </Flex>
          {canModify && (
            <Flex align="center" gap="4">
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
                  <FaPencilAlt />
                </IconButton>
              )}

              <IconButton
                variant="ghost"
                color="gray"
                size="1"
                onClick={() => setOpen(true)}
                title="Delete"
              >
                <FaTrash aria-hidden />
              </IconButton>

              <ConfirmationDialog
                title="Delete comment?"
                description="Are you sure you want to delete this comment? This action cannot be undone."
                onConfirm={handleDelete}
                open={open}
                action={setOpen}
              />
            </Flex>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};
