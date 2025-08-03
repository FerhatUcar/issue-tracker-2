import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type InviteMemberData = {
  /**
   * A unique identifier representing a specific workspace.
   * This ID is typically used to differentiate between various workspaces
   * within a system or application.
   */
  workspaceId: string;

  /**
   * Represents an email address.
   * The value should follow the standard email format (e.g., user@example.com).
   * Useful for storing or validating user contact information.
   */
  email: string;
};

export const useInviteMember = () => {
  return useMutation({
    mutationFn: async ({ workspaceId, email }: InviteMemberData) => {
      await axios.post(`/api/workspaces/${workspaceId}/invite`, { email });
    },
  });
};