import { Status } from "@prisma/client";

export type Item = {
  label: string;
  value: number;
  status: Status;
  color: string;
};

export const getSummaryData = (
  open: number,
  inProgress: number,
  closed: number,
): Item[] => [
  {
    label: "Open",
    value: open,
    status: "OPEN",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  },
  {
    label: "In-progress",
    value: inProgress,
    status: "IN_PROGRESS",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
  },
  {
    label: "Closed",
    value: closed,
    status: "CLOSED",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  },
];