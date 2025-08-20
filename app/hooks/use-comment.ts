"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { commentsKey } from "@/app/query-keys";
import { CommentWithAuthor } from "@/app/types/types";
import { CommentArray } from "@/app/validations";

export const useComments = (issueId: number) =>
  useQuery({
    queryKey: commentsKey(issueId),
    queryFn: async (): Promise<CommentWithAuthor[]> => {
      const res = await axios.get(`/api/comments?id=${issueId}`);
      const parsed = CommentArray.parse(res.data);

      return parsed as CommentWithAuthor[];
    },
    staleTime: 30_000,
    retry: 3,
  });
