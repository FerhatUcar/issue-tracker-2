import { Issue } from "@prisma/client";

type ColumnValue =
  | keyof Issue
  | "workspaceName";

type Column = {
  label: string;
  value: ColumnValue;
  className?: string;
};

export const columns: Column[] = [
  { label: "Issue", value: "title" },
  { label: "Status", value: "status" },
  { label: "Workspace", value: "workspaceName" },
  { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  { label: "User", value: "assignedToUserId" },
];
