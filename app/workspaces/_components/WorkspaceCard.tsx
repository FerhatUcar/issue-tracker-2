import React from "react";
import Link from "next/link";
import { Card, Heading, Text, Avatar, Flex, Box } from "@radix-ui/themes";
import { Workspace } from "@prisma/client";

type Props = {
  workspace: Workspace & {
    _count: { issues: number };
    memberships: {
      user: {
        id: string;
        name: string | null;
        image: string | null;
      };
    }[];
  };
};

export const WorkspaceCard = ({ workspace }: Props) => {
  const displayName =
    workspace.name.charAt(0).toUpperCase() + workspace.name.slice(1);

  return (
    <Link href={`/workspaces/${workspace.id}`}>
      <Card className="w-[250px] h-[150px] hover:shadow-md transition-shadow p-4 relative">
        <Flex direction="column" justify="between" className="h-full">
          <Box>
            <Heading size="4">{displayName}</Heading>
            <Text size="2" color="gray">
              {workspace._count.issues} open issue(s)
            </Text>
          </Box>

          <Flex gap="1" justify="end" align="center">
            {workspace.memberships.map((m) => (
              <Avatar
                key={m.user.id}
                size="1"
                src={m.user.image || undefined}
                fallback={(m.user.name ?? "?")[0]}
                radius="full"
                title={m.user.name ?? ""}
              />
            ))}
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
};
