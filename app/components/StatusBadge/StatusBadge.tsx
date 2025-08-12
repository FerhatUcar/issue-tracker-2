import React from "react";
import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";

type Colors = "red" | "yellow" | "green";
type StatusMap = Record<Status, { label: string; color: Colors }>;

const statusMap: StatusMap = {
  OPEN: { label: "Open", color: "red" },
  IN_PROGRESS: { label: "In Progress", color: "yellow" },
  CLOSED: { label: "Closed", color: "green" },
};

export const StatusBadge = ({ status }: { status: Status }) => (
  <Badge
    className="min-w-[60px] justify-center"
    color={statusMap[status].color}
  >
    {statusMap[status].label}
  </Badge>
);
