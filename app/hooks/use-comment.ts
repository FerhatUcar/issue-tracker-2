import { type Comment } from "@prisma/client";
import { useDataQuery } from "./use-data-query";

export const useComments = (issueId: number) =>
  useDataQuery<Comment>("comments", issueId);
