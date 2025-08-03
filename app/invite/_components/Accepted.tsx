import React from "react";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

type Props = {
  invite: {
    workspace: {
      name: string;
    };
    workspaceId: string;
  };
};

export const Accepted = ({ invite }: Props) => (
  <Box className="flex items-center justify-center mt-4">
    <Card className="max-w-md w-full mx-4">
      <Flex direction="column" align="center" gap="4" className="p-6">
        <CheckCircledIcon className="w-16 h-16 text-green-500" />
        <Heading size="6" className="text-center">
          Uitnodiging Al Geaccepteerd
        </Heading>
        <Text size="3" className="text-center text-gray-600 dark:text-gray-400">
          Je bent al lid van <strong>{invite.workspace.name}</strong>.
        </Text>
        <Button asChild>
          <Link href={`/workspaces/${invite.workspaceId}`}>
            Ga naar Workspace
          </Link>
        </Button>
      </Flex>
    </Card>
  </Box>
);
