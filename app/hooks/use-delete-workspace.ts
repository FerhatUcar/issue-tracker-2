import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      await axios.delete(`/api/workspaces/${workspaceId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
