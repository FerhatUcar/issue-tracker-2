import { Issue, Comment } from "@prisma/client";
import { User } from "next-auth";

export type IssuesWithAssigning = (Issue & AssignedToUser & {
  workspaceName: string;
})[];

export type AssignedToUser = {
  assignedToUser: User | null;
  Comment: Comment[];
};