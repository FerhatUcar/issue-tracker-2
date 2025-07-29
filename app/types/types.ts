import { Issue, Comment } from "@prisma/client";
import { User } from "next-auth";

export type IssuesWithAssigning = (Issue & AssignedToUser)[];

export type AssignedToUser = {
  assignedToUser: User | null;
  Comment: Comment[];
};