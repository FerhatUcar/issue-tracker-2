import { Issue } from "@prisma/client";

export type IssuesWithAssigning = (Issue & AssignedToUser)[];

export type AssignedToUser = {
  assignedToUser: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    emailVerified: Date | null;
  } | null;
};