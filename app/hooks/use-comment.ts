import { type Comment } from "@prisma/client";
import { useDataQuery } from "./use-data-query";

export const getComments = async (issueId: number) => {
  const res = await fetch(`/api/comments/${issueId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return res.json();
};

export const useComments = (issueId: number) =>
  useDataQuery<Comment>("comments", issueId);
