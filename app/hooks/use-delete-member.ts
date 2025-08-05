"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type DeleteMemberInput = {
  userId: string;
  workspaceId: string;
};

type DeleteMemberResponse = {
  success: boolean;
};

type ErrorResponse = {
  message: string;
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteMemberResponse,
    AxiosError<ErrorResponse>,
    DeleteMemberInput
  >({
    mutationFn: async ({ userId, workspaceId }) => {
      try {
        const res = await axios.delete<DeleteMemberResponse>(
          "/api/membership/delete",
          {
            data: { userId, workspaceId },
          },
        );

        return res.data;
      } catch (error) {
        if (axios.isAxiosError<ErrorResponse>(error)) {
          throw new Error(error.response?.data?.message || "Deletion failed");
        }
        throw new Error("Unknown error during deletion");
      }
    },
    onSuccess: async (_, { workspaceId }) => {
      await queryClient.invalidateQueries({
        queryKey: ["workspace", workspaceId, "members"],
      });
    },
  });
};
