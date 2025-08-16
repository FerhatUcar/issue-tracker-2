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
import { FaCheck, FaPencilAlt, FaTimes, FaTrash } from "react-icons/fa";
import { useCommentMutation } from "@/app/hooks/use-comment-mutation";
import {
  ConfirmationDialog,
  DislikeButton,
  LikeButton,
} from "@/app/components";
import toast from "react-hot-toast";
import { CommentWithReactions, MyReaction } from "@/app/types/types";
import { useSession } from "next-auth/react";
import { useCommentReaction } from "@/app/hooks";
import { clampNonNegative, formatDate } from "@/app/helpers";

type Reaction = "NONE" | "LIKE" | "DISLIKE";
type Action = "LIKE" | "DISLIKE";

type Delta = {
  likes: -1 | 0 | 1;
  dislikes: -1 | 0 | 1;
  next: Reaction;
};

const TRANSITIONS: Record<Reaction, Record<Action, Delta>> = {
  NONE: {
    LIKE: { likes: +1, dislikes: 0, next: "LIKE" },
    DISLIKE: { likes: 0, dislikes: +1, next: "DISLIKE" },
  },
  LIKE: {
    LIKE: { likes: -1, dislikes: 0, next: "NONE" },
    DISLIKE: { likes: -1, dislikes: +1, next: "DISLIKE" },
  },
  DISLIKE: {
    LIKE: { likes: +1, dislikes: -1, next: "LIKE" },
    DISLIKE: { likes: 0, dislikes: -1, next: "NONE" },
  },
} as const;

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
  const { reactToComment } = useCommentReaction();

  const currentUserId = session?.user?.id;
  const canModify = currentUserId === comment.authorId;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { deleteComment, updateComment } = useCommentMutation();
  const [open, setOpen] = useState(false);
  const [likes, setLikes] = useState(comment.likesCount ?? 0);
  const [dislikes, setDislikes] = useState(comment.dislikesCount ?? 0);
  const [myReaction, setMyReaction] = useState<MyReaction>(
    comment.myReaction ?? "NONE",
  );

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

  const handleEdit = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setEditedContent(e.target.value);

  const applyOptimistic = (action: Action) => {
    const delta = TRANSITIONS[myReaction][action];

    if (delta.likes !== 0) {
      setLikes((v) => clampNonNegative(v + delta.likes));
    }

    if (delta.dislikes !== 0) {
      setDislikes((v) => clampNonNegative(v + delta.dislikes));
    }

    setMyReaction(delta.next);
  };

  const onReact = (type: Action) => {
    if (reactToComment.isLoading) {
      return;
    }

    applyOptimistic(type);

    reactToComment.mutate(
      { commentId: comment.id, issueId, type },
      {
        onSuccess: ({ likesCount, dislikesCount, myReaction }) => {
          setLikes(likesCount);
          setDislikes(dislikesCount);
          setMyReaction(myReaction);
        },
      },
    );
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
              {formatDate(comment.createdAt)}
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
                  disabled={!editedContent.trim() || updateComment.isLoading}
                >
                  {updateComment.isLoading ? (
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
              count={likes}
              active={myReaction === "LIKE"}
              disabled={reactToComment.isLoading}
              onClick={() => onReact("LIKE")}
            />
            <DislikeButton
              count={dislikes}
              active={myReaction === "DISLIKE"}
              disabled={reactToComment.isLoading}
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
                onOpenChange={setOpen}
              />
            </Flex>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};
