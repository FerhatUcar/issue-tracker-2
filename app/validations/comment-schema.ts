import { z } from "zod";

export const CommentArray = z.array(
  z.object({
    id: z.number(),
    content: z.string(),
    likesCount: z.number(),
    dislikesCount: z.number(),
    myReaction: z.enum(["NONE", "LIKE", "DISLIKE"]).optional(),
    authorId: z.string().nullable().optional(),
    author: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        image: z.string().nullable().optional(),
      })
      .nullable(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    issueId: z.number().optional(),
  }),
);
