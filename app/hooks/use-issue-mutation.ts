import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Issue } from "@prisma/client";

type Payload = Partial<Issue> & { id?: number };

export const useIssueMutation = () => {
  const queryClient = useQueryClient();

  const upsertMutation = useMutation({
    mutationFn: async (data: Payload) => {
      const { id, ...rest } = data;

      if (id) {
        // Update issue
        return axios
          .patch(`/api/issues/${id}`, { ...rest })
          .then((res) => res.data);
      } else {
        // Create issue
        return axios
          .post(`/api/issues`, { ...rest })
          .then((res) => res.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return axios.delete(`/api/issues/${id}`).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  return {
    upsertIssue: upsertMutation,
    deleteIssue: deleteMutation,
  };
};
