import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const ErrorResponse = z.object({ error: z.string() });
const ReactionResponse = z.object({
  likesCount: z.number(),
  dislikesCount: z.number(),
  myReaction: z.union([
    z.literal("NONE"),
    z.literal("LIKE"),
    z.literal("DISLIKE"),
  ]),
});
type ReactionResponse = z.infer<typeof ReactionResponse>;

type Input = {
  commentId: number;
  type: "LIKE" | "DISLIKE";

  /**
   * Optional: Only for cache invalidation of this issue's comment list
   */
  issueId?: number;
};

const extractAxiosError = (err: unknown): string => {
  const ax = err as AxiosError;
  const data = ax.response?.data;

  if (typeof data === "string") {
    return data;
  }

  const parsed = ErrorResponse.safeParse(data);

  if (parsed.success) {
    return parsed.data.error;
  }

  return ax.response?.statusText || ax.message || "Failed to react";
};

export const useCommentReaction = () => {
  const qc = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({
      commentId,
      type,
    }: Input): Promise<ReactionResponse> => {
      try {
        const res = await axios.patch(`/api/comments/${commentId}/reaction`, {
          type,
        });
        const parsed = ReactionResponse.safeParse(res.data);

        if (!parsed.success) {
          throw new Error("Invalid server response");
        }

        return parsed.data;
      } catch (err) {
        throw new Error(extractAxiosError(err));
      }
    },

    onSuccess: async (_data, variables) => {
      await qc.invalidateQueries({
        queryKey: ["comment", variables.commentId],
      });

      if (typeof variables.issueId === "number") {
        await qc.invalidateQueries({
          queryKey: ["comments", variables.issueId],
        });
      }

      await qc.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  return { reactToComment: mutate };
};
