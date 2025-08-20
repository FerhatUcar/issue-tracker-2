import { z } from "zod";

export const ReactionResponse = z.object({
  likesCount: z.number(),
  dislikesCount: z.number(),
  myReaction: z.union([
    z.literal("NONE"),
    z.literal("LIKE"),
    z.literal("DISLIKE"),
  ]),
});
