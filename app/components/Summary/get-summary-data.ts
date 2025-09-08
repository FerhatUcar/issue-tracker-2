import { Status } from "@prisma/client";
import { Appearance } from "@/app/providers/ThemeProvider";

export type Item = {
  label: string;
  value: number;
  status: Status;
  color: string;
};

export const getSummaryData = (
  open: number,
  inProgress: number,
  review: number,
  closed: number,
  appearance: Appearance,
): Item[] => [
  {
    label: "Open",
    value: open,
    status: "OPEN",
    color:
      appearance === "dark"
        ? "bg-red-900/20 text-red-300"
        : "bg-red-100 text-red-800",
  },
  {
    label: "In-progress",
    value: inProgress,
    status: "IN_PROGRESS",
    color:
      appearance === "dark"
        ? "bg-yellow-900/20 text-yellow-300"
        : "bg-yellow-100 text-yellow-800",
  },
  {
    label: "Review",
    value: review,
    status: "REVIEW",
    color:
      appearance === "dark"
        ? "bg-orange-900/20 text-orange-300"
        : "bg-orange-100 text-orange-800",
  },
  {
    label: "Closed",
    value: closed,
    status: "CLOSED",
    color:
      appearance === "dark"
        ? "bg-green-900/20 text-green-300"
        : "bg-green-100 text-green-800",
  },
];
