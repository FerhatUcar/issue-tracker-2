import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type WorkspacePayload = {
  name: string;
};

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: (data: WorkspacePayload) =>
      axios.post("/api/workspaces", data).then((res) => res.data),
  });
};
