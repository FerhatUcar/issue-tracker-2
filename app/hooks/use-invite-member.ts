import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type InviteMemberData = {
  workspaceId: string;
  email: string;
};

export const useInviteMember = () => {
  return useMutation({
    mutationFn: async ({ workspaceId, email }: InviteMemberData) => {
      await axios.post(`/api/workspaces/${workspaceId}/invite`, { email });
    },
  });
};