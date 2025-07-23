import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Issue } from "@prisma/client";

type Payload = Partial<Issue> & { id?: number };

export const useIssueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Payload) => {
      if (data.id) {
        return axios.patch(`/api/issues/${data.id}`, data).then((res) => res.data);
      } else {
        return axios.post("/api/issues", data).then((res) => res.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
};
