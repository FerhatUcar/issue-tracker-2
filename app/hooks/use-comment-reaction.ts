import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { commentsKey } from "@/app/query-keys";
import { CommentWithReactions, MyReaction } from "@/app/types/types";
import { extractAxiosError } from "@/app/helpers";
import { Reaction } from "@/app/types/reactions";

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

function applyReaction(
  list: CommentWithReactions[],
  commentId: number,
  next: Exclude<MyReaction, "NONE">,
) {
  return list.map((c) => {
    if (c.id !== commentId) {
      return c;
    }

    const was: Reaction = c.myReaction ?? "NONE";

    let likes = c.likesCount ?? 0;
    let dislikes = c.dislikesCount ?? 0;

    if (was === next) {
      // toggle off
      if (next === "LIKE") {
        likes = Math.max(0, likes - 1);
      } else {
        dislikes = Math.max(0, dislikes - 1);
      }

      return {
        ...c,
        myReaction: "NONE" as const,
        likesCount: likes,
        dislikesCount: dislikes,
      };
    } else {
      // switch
      if (next === "LIKE") {
        likes += 1;
        if (was === "DISLIKE") dislikes = Math.max(0, dislikes - 1);
      } else {
        dislikes += 1;
        if (was === "LIKE") likes = Math.max(0, likes - 1);
      }
      return {
        ...c,
        myReaction: next,
        likesCount: likes,
        dislikesCount: dislikes,
      };
    }
  });
}
