"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { commentsKey } from "@/app/query-keys";
import { CommentWithAuthor } from "@/app/types/types";

const CommentArray = z.array(
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

export const useComments = (issueId: number) => {
  // const { data: session } = useSession();
  // const userId = session?.user?.id;

  return useQuery({
    queryKey: commentsKey(issueId),
    queryFn: async (): Promise<CommentWithAuthor[]> => {
      const res = await axios.get(`/api/comments?id=${issueId}`);
      const parsed = CommentArray.parse(res.data);

      return parsed as CommentWithAuthor[];
    },
    staleTime: 30_000,
    retry: 3,
  });
};
