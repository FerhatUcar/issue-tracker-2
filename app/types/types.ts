import { Comment, Issue, Prisma, Workspace } from "@prisma/client";
import { User } from "next-auth";

export type IssuesWithAssigning = Issue & AssignedToUser;

export type AssignedToUser = {
  assignedToUser: User | null;
  Workspace?: Workspace | null;
  Comment?: Comment[];
};

export type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: { author: true };
}>;
