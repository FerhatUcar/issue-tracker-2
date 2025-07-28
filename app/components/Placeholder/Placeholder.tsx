import Image from "next/image";
import { Box, Text } from "@radix-ui/themes";

export const NoIssuesPlaceholder = () => (
  <Box className="flex flex-col items-center justify-center mb-2">
    <Image
      src="/placeholder.png"
      alt="Geen issues gevonden"
      width={300}
      height={300}
      priority
    />
    <Text size="2">Er zijn momenteel geen issues 🎉</Text>
  </Box>
);
