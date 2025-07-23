import { Issue } from "@prisma/client";

type Column = {
  label: string;
  value: keyof Issue;
  className?: string;
};

export const columns: Column[] = [
  { label: "Issue", value: "title" },
  { label: "Status", value: "status" },
  { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  { label: "User", value: "assignedToUserId" },
];
