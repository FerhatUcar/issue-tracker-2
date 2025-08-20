"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { commentsKey } from "@/app/query-keys";
import { CommentWithAuthor } from "@/app/types/types";

const CommentArray = z.array(
  z
    .object({
      id: z.number(),
      content: z.string(),
      likesCount: z.number().nullable().optional(),
      dislikesCount: z.number().nullable().optional(),
      myReaction: z.union([z.literal("LIKE"), z.literal("DISLIKE")]).optional(),
      authorId: z.string().nullable().optional(),
    })
    .passthrough(),
);

export const useComments = (issueId: number) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: commentsKey(issueId, userId),
    queryFn: async (): Promise<CommentWithAuthor[]> => {
      const res = await axios.get(`/api/comments?id=${issueId}`);
      const parsed = CommentArray.safeParse(res.data);

      if (!parsed.success) {
        throw new Error("Invalid comments response");
      }

      return parsed.data as CommentWithAuthor[];
    },
    staleTime: 30_000,
    retry: 3,
  });
};
