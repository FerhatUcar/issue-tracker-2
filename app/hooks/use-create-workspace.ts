import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Workspace } from "@prisma/client";

type WorkspacePayload = {
  name: string;
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkspacePayload) =>
      axios.post<Workspace>("/api/workspaces", data).then((res) => res.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
