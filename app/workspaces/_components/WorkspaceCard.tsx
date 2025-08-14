import React from "react";
import Link from "next/link";
import { Avatar, Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
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
  <Link href={`/workspaces/${workspace.id}`} prefetch={false}>
    <Card className="w-full">
      <Flex direction="column" justify="between" className="h-full">
        <Box>
          <Heading size="4">
            {workspace.name?.charAt(0).toUpperCase() + workspace.name?.slice(1)}
          </Heading>
          <Text size="2" color="gray">
            {workspace._count?.issues ?? 0} issue(s)
          </Text>
        </Box>

        <Flex
          justify="end"
          mt="auto"
          style={{ position: "relative", height: "24px" }}
        >
          {workspace.memberships?.slice(0, 4).map(({ user }, i) => (
            <Avatar
              key={i}
              size="1"
              fallback="?"
              radius="large"
              src={user.image ?? ""}
              title={user.name ?? ""}
              style={{
                position: "absolute",
                right: `${i * 16}px`,
                zIndex: 10 - i,
                border: "1px solid grey",
              }}
            />
          ))}

          {workspace.memberships && workspace.memberships.length > 4 && (
            <Flex
              align="center"
              justify="center"
              style={{
                position: "absolute",
                right: `${4 * 16}px`,
                zIndex: 0,
                width: "24px",
                height: "24px",
                fontSize: "12px",
                backgroundColor: "#ccc",
                borderRadius: "9999px",
                border: "2px solid white",
              }}
            >
              +{workspace.memberships.length - 4}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  </Link>
);
