import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const LimitReached = () => (
  <Box className="flex items-center justify-center mt-4">
    <Card className="max-w-md w-full mx-4">
      <Flex direction="column" align="center" gap="4" className="p-6">
        <ExclamationTriangleIcon className="w-16 h-16 text-amber-500" />
        <Heading size="6" className="text-center">
          Workspace member limit reached
        </Heading>
        <Text size="3" className="text-center text-gray-600 dark:text-gray-400">
          This workspace is on the free plan and has hit its member limit. Ask
          an admin to upgrade to add more members.
        </Text>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </Flex>
    </Card>
  </Box>
);
