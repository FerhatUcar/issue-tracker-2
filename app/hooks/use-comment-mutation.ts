import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Comment } from "@prisma/client";

type Payload = {
  content: string;
  issueId: number;
};

export const useCommentMutation = () => {
  const queryClient = useQueryClient();

  const createComment = useMutation<Comment, Error, Payload>({
    mutationFn: async (data: Payload) =>
      axios.post<Comment>("/api/comments", data).then((res) => res.data),

    onSuccess: async (_data, { issueId }) => {
      await queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
    },
  });

  const deleteComment = useMutation<
    void,
    Error,
    { commentId: number; issueId: number }
  >({
    mutationFn: async ({ commentId }) =>
      axios.delete<void>(`/api/comments/${commentId}`).then((res) => res.data),

    onSuccess: async (_data, { issueId }) => {
      await queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
    },
  });

  const updateComment = useMutation<
    Comment,
    Error,
    { id: number; content: string; issueId: number }
  >({
    mutationFn: async ({ id, content }) =>
      axios
        .patch<Comment>(`/api/comments/${id}`, { content })
        .then((res) => res.data),

    onSuccess: async (_data, { issueId }) => {
      await queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
    },
  });

  return {
    createComment,
    deleteComment,
    updateComment,
  };
};
