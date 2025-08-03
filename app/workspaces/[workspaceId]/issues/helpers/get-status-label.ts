import { Status } from "@prisma/client";

export const getStatusLabel = (status: Status): string => {
  switch (status) {
    case "OPEN":
      return "Open";
    case "IN_PROGRESS":
      return "In progress";
    case "CLOSED":
      return "Closed";
    default:
      return status;
  }
};