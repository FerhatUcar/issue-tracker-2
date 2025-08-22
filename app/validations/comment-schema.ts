import { z } from "zod";

const PAGE_SIZE_MAX = 100;
const PAGE_SIZE_DEFAULT = 30 as const;

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

export const Params = z.object({
  id: z.string().regex(/^\d+$/, "id must be a number type").transform(Number),
});

export const PatchBody = z
  .object({
    content: z.string().trim().min(1, "Content is mandatory").max(5000),
  })
  .strict();

export const QueryIssueId = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "issueId must be a number type")
    .transform(Number),
});

export const PostCommentBody = z
  .object({
    content: z.string().trim().min(1, "Content is mandatory").max(5000),
    issueId: z
      .union([
        z.number().int().nonnegative(),
        z.string().regex(/^\d+$/).transform(Number),
      ])
      .transform(Number),
  })
  .strict();

export const QuerySchema = z
  .object({
    id: z
      .string()
      .regex(/^\d+$/, "issueId must be a number type")
      .transform(Number),
    limit: z
      .string()
      .optional()
      .transform((v) => (v ? Number(v) : PAGE_SIZE_DEFAULT))
      .pipe(z.number().int().positive().max(PAGE_SIZE_MAX)),
    cursor: z
      .string()
      .optional()
      .transform((v) => (v === undefined ? undefined : Number(v)))
      .refine(
        (v) => v === undefined || Number.isInteger(v),
        "cursor moet int zijn",
      ),
    since: z.string().datetime().optional(),
  })
  .strict();
