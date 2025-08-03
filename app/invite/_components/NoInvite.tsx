import React from "react";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const NoInvite = () => (
  <Box className="flex items-center justify-center mt-4">
    <Card className="max-w-md w-full mx-4">
      <Flex direction="column" align="center" gap="4" className="p-6">
        <CrossCircledIcon className="w-16 h-16 text-red-500" />
        <Heading size="6" className="text-center">
          Ongeldige Uitnodiging
        </Heading>
        <Text size="3" className="text-center text-gray-600 dark:text-gray-400">
          Deze uitnodiging bestaat niet of is verlopen.
        </Text>
        <Button asChild>
          <Link href="/">Terug naar Home</Link>
        </Button>
      </Flex>
    </Card>
  </Box>
);
