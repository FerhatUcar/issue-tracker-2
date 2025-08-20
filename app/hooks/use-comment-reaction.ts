import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { commentsKey } from "@/app/query-keys";
import { CommentWithReactions } from "@/app/types/types";
import { extractAxiosError } from "@/app/helpers";
import { ReactionResponse } from "@/app/validations";
import { applyReaction } from "@/app/helpers/apply-reactions";

type ReactionResponse = z.infer<typeof ReactionResponse>;

export type Input = {
  commentId: number;
  type: "LIKE" | "DISLIKE";
  issueId: number;
};

export const useCommentReaction = () => {
  const qc = useQueryClient();

  return useMutation({
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
          throw new Error("Invalid response format");
        }

        return parsed.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(extractAxiosError(err));
        }

        throw new Error("Unknown error");
      }
    },

    onMutate: async ({ issueId, commentId, type }) => {
      const key = commentsKey(issueId);
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<CommentWithReactions[]>(key);

      qc.setQueryData<CommentWithReactions[]>(key, (list) =>
        list ? applyReaction(list, commentId, type) : list,
      );

      return { prev, key };
    },

    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(ctx.key, ctx.prev);
      }
    },

    onSuccess: ({ likesCount, dislikesCount, myReaction }, vars) => {
      const key = commentsKey(vars.issueId);

      qc.setQueryData<CommentWithReactions[]>(
        key,
        (list) =>
          list?.map((c) =>
            c.id === vars.commentId
              ? {
                  ...c,
                  likesCount,
                  dislikesCount,
                  myReaction,
                }
              : c,
          ) ?? list,
      );
    },

    onSettled: async (_data, _err, vars) => {
      await qc.invalidateQueries({
        queryKey: commentsKey(vars.issueId),
      });
    },
  });
};
