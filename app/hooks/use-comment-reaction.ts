import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { commentsKey } from "@/app/query-keys";
import { CommentWithReactions } from "@/app/types/types";
import { extractAxiosError } from "@/app/helpers";
import { Action, Delta, Reaction } from "@/app/types/reactions";

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
  issueId: number;
};

const TRANSITIONS: Record<Reaction, Record<Action, Delta>> = {
  NONE: {
    LIKE: { likes: +1, dislikes: 0, next: "LIKE" },
    DISLIKE: { likes: 0, dislikes: +1, next: "DISLIKE" },
  },
  LIKE: {
    LIKE: { likes: -1, dislikes: 0, next: "NONE" },
    DISLIKE: { likes: -1, dislikes: +1, next: "DISLIKE" },
  },
  DISLIKE: {
    LIKE: { likes: +1, dislikes: -1, next: "LIKE" },
    DISLIKE: { likes: 0, dislikes: -1, next: "NONE" },
  },
} as const;

const toCacheReaction = (
  reaction: Reaction,
): CommentWithReactions["myReaction"] => {
  if (reaction === "NONE") {
    return undefined;
  }
  return reaction;
};

export const useCommentReaction = () => {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

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

    onMutate: async (vars: Input) => {
      const key = commentsKey(vars.issueId, userId);
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<CommentWithReactions[]>(key);

      qc.setQueryData<CommentWithReactions[]>(key, (old) => {
        if (!old) {
          return old;
        }

        return old.map((c) => {
          if (c.id !== vars.commentId) {
            return c;
          }

          const current = (c.myReaction ?? "NONE") as Reaction;
          const d = TRANSITIONS[current][vars.type];

          const nextLikes = Math.max(0, (c.likesCount ?? 0) + d.likes);
          const nextDislikes = Math.max(0, (c.dislikesCount ?? 0) + d.dislikes);
          const nextMyReaction = toCacheReaction(d.next);

          return {
            ...c,
            likesCount: nextLikes,
            dislikesCount: nextDislikes,
            myReaction: nextMyReaction,
          } as CommentWithReactions;
        });
      });

      return { prev, key } as {
        prev: CommentWithReactions[] | undefined;
        key: ReturnType<typeof commentsKey>;
      };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx && ctx.prev && ctx.key) {
        qc.setQueryData(ctx.key, ctx.prev);
      }
    },

    onSettled: async (_data, _err, vars) => {
      await qc.invalidateQueries({
        queryKey: commentsKey(vars.issueId, userId),
      });
    },
  });
};
