import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

type Colors = "red" | "violet" | "green";
type StatusMap = Record<Status, { label: string; color: Colors }>;

const statusMap: StatusMap = {
  OPEN: { label: "Open", color: "red" },
  IN_PROGRESS: { label: "In Progress", color: "violet" },
  CLOSED: { label: "Closed", color: "green" },
};

const IssueStatusBadge = ({ status }: { status: Status }) => (
  <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
);

export default IssueStatusBadge;
