import Image from "next/image";
import { Text } from "@radix-ui/themes";
import { Box } from "@/app/components";

export const NoIssuesPlaceholder = () => (
  <Box className="flex flex-col items-center justify-center mb-8">
    <Image
      src="/placeholder.png"
      alt="No issues placeholder"
      width={300}
      height={300}
      priority
    />
    <Text size="2">There are currently no issues!</Text>
  </Box>
);
