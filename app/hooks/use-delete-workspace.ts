import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteWorkspace = () => {
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      await axios.delete(`/api/workspaces/${workspaceId}`);
    },
  });
};
