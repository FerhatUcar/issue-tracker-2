import React from "react";
import Link from "next/link";
import { Card, Heading, Text, Avatar, Flex, Box } from "@radix-ui/themes";
import { Workspace } from "@prisma/client";

type Props = {
  workspace: Workspace & {
    _count?: { issues?: number };
    memberships?: {
      user: {
        name: string | null;
        image: string | null;
      };
    }[];
  };
};

export const WorkspaceCard = ({ workspace }: Props) => (
  <Link href={`/workspaces/${workspace.id}`}>
    <Card className="w-full">
      <Flex direction="column" justify="between" className="h-full">
        <Box>
          <Heading size="4">{workspace.name?.charAt(0).toUpperCase() + workspace.name?.slice(1)}</Heading>
          <Text size="2" color="gray">
            {workspace._count?.issues ?? 0} issue(s)
          </Text>
        </Box>

        <Flex justify="end" gap="1" mt="auto">
          {workspace.memberships?.map((m, i) => (
            <Avatar
              key={i}
              size="1"
              fallback="?"
              radius="full"
              src={m.user.image ?? ""}
              title={m.user.name ?? ""}
            />
          ))}
        </Flex>
      </Flex>
    </Card>
  </Link>
);
