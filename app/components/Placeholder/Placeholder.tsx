import Image from "next/image";
import { Box, Text } from "@radix-ui/themes";

export const NoIssuesPlaceholder = () => (
  <Box className="flex flex-col items-center justify-center" mb="4">
    <Image
      src="/placeholder.png"
      alt="No issues placeholder"
      width={320}
      height={320}
      priority
    />
    <Text size="2">There are currently no issues!</Text>
  </Box>
);
