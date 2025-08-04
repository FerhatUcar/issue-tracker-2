import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Issue } from "@prisma/client";

type Payload = Partial<Issue> & { id?: number };

export const useIssueMutation = () => {
  const queryClient = useQueryClient();

  const upsertMutation = useMutation<Issue, Error, Payload>({
    mutationFn: async (data: Payload) => {
      const { id, ...rest } = data;

      if (id) {
        // Update issue
        return axios
          .patch<Issue>(`/api/issues/${id}`, { ...rest })
          .then((res) => res.data);
      } else {
        // Create issue
        return axios
          .post<Issue>(`/api/issues`, { ...rest })
          .then((res) => res.data);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return axios.delete<void>(`/api/issues/${id}`).then((res) => res.data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  return {
    upsertIssue: upsertMutation,
    deleteIssue: deleteMutation,
  };
};
