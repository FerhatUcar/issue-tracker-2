import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Payload = {
  content: string;
  issueId: number;
};

export const useCommentMutation = () => {
  const queryClient = useQueryClient();

  const createComment = useMutation({
    mutationFn: async (data: Payload) => {
      const response = await axios.post("/api/comments", data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.issueId],
      });
    },
  });

  return {
    createComment,
  };
};
