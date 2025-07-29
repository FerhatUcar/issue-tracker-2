import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Payload = {
  content: string;
  issueId: number;
};

export const useCommentMutation = () => {
  const queryClient = useQueryClient();

  const createComment = useMutation({
    mutationFn: async (data: Payload) =>
      axios.post("/api/comments", data).then((res) => res.data),

    onSuccess: (_data, { issueId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
    },
  });

  const deleteComment = useMutation<
    void,
    Error,
    { commentId: number; issueId: number }
  >({
    mutationFn: async ({ commentId }) =>
      axios.delete(`/api/comments/${commentId}`).then((res) => res.data),

    onSuccess: (_data, { issueId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
    },
  });

  const updateComment = useMutation<
    string,
    Error,
    { id: number; content: string; issueId: number }
  >({
    mutationFn: async ({ id, content }) =>
      axios.patch(`/api/comments/${id}`, { content }).then((res) => res.data),

    onSuccess: (_data, { issueId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
    },
  });

  return {
    createComment,
    deleteComment,
    updateComment,
  };
};