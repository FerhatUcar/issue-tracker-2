import { Comment, Issue, Workspace } from "@prisma/client";
import { User } from "next-auth";

export type IssuesWithAssigning = Issue & AssignedToUser;

export type AssignedToUser = {
  assignedToUser: User | null;
  Workspace?: Workspace | null;
  Comment?: Comment[];
};

type AuthorLight = {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
};

export type CommentWithAuthor = {
  id: number;
  content: string;
  likesCount: number;
  dislikesCount: number;
  myReaction?: "NONE" | "LIKE" | "DISLIKE";
  authorId: string | null;
  author: AuthorLight | null;
  createdAt?: string;
  updatedAt?: string;
  issueId?: number;
};

export type ROLE = "ADMIN" | "MEMBER";
export type ReactionType = "LIKE" | "DISLIKE";
export type MyReaction = ReactionType | "NONE";

export type CommentWithReactions = CommentWithAuthor & {
  likesCount: number;
  dislikesCount: number;
  myReaction?: MyReaction;
};
