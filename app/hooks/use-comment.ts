import { useDataQuery } from "./use-data-query";
import { CommentWithAuthor } from "@/app/types/types";

export const useComments = (issueId: number) =>
  useDataQuery<CommentWithAuthor>("comments", issueId);
