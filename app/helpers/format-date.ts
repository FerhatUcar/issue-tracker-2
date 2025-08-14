export const formatDate = (
  date: Date | string | number,
  includeTime: boolean = true,
): string => {
  const d = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  };

  return d.toLocaleString("nl-NL", options);
};
