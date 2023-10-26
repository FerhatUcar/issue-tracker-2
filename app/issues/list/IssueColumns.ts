import { Column } from "@/app/issues/list/IssueTable";

export const columns: Column[] = [
  { label: "Issue", value: "title" },
  { label: "Status", value: "status" },
  { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  { label: "User", value: "assignedToUserId" },
];
