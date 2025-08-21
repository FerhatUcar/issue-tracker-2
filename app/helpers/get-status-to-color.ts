export const getStatusToColor = (
  status: "OPEN" | "IN_PROGRESS" | "REVIEW" | "CLOSED",
): "red" | "yellow" | "orange" | "green" | "gray" => {
  switch (status) {
    case "OPEN":
      return "red";
    case "IN_PROGRESS":
      return "yellow";
    case "REVIEW":
      return "orange";
    case "CLOSED":
      return "green";
    default:
      return "gray";
  }
};
