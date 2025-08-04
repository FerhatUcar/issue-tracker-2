import { Box } from "@radix-ui/themes";

type Props = {
  count: number;
};

export const IssueStatus = ({ count }: Props) => {
  if (count === 0) {
    return null;
  }

  return (
    <Box className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-md" />
  );
};
