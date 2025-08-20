"use client";

import { Box } from "@radix-ui/themes";
import { Status } from "@/app/types/status";

const STATUS_COLOR: Record<Status, string> = {
  OPEN: "bg-red-500",
  IN_PROGRESS: "bg-amber-500",
  REVIEW: "bg-orange-500",
  CLOSED: "bg-emerald-500",
};

const STATUS_LABEL: Record<Status, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  CLOSED: "Closed",
};

type Props = {
  status: Status;
  size?: "xs" | "sm" | "md";
  className?: string;
};

const SIZE_CLS: Record<NonNullable<Props["size"]>, string> = {
  xs: "w-2 h-2",
  sm: "w-2.5 h-2.5",
  md: "w-3 h-3",
};

export const StatusDot = ({ status, size = "sm", className = "" }: Props) => {
  const color = STATUS_COLOR[status] ?? "bg-gray-300";
  const label = STATUS_LABEL[status] ?? status;

  return (
    <Box
      className={[
        "inline-block shrink-0 rounded-full",
        SIZE_CLS[size],
        color,
        "ring-1 ring-black/5 dark:ring-white/10",
        className,
      ].join(" ")}
      role="img"
      aria-label={label}
      title={label}
    />
  );
};
