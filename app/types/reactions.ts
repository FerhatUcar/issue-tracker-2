export type Reaction = "NONE" | "LIKE" | "DISLIKE";

export type CommentDTO = {
  id: number;
  content: string;
  issueId: number;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  dislikesCount: number;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  myReaction: Reaction;
};
