export const getStatusToColor = (
  status: "OPEN" | "IN_PROGRESS" | "CLOSED",
): "red" | "yellow" | "green" | "gray" => {
  switch (status) {
    case "OPEN":
      return "red";
    case "IN_PROGRESS":
      return "yellow";
    case "CLOSED":
      return "green";
    default:
      return "gray";
  }
};
