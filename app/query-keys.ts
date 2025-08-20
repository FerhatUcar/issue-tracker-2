export const commentsKey = (issueId: number, userId?: string) =>
  ["comments", { issueId, userId }] as const;

export const commentKey = (commentId: number) =>
  ["comment", commentId] as const;
