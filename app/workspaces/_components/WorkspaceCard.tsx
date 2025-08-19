import React from "react";
import Link from "next/link";
import { Avatar, Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import type { WorkspaceCardData } from "@/app/types/workspace";

type Props = { workspace: WorkspaceCardData };

export const WorkspaceCard = ({
  workspace: { id, name, _count, memberships },
}: Props) => (
  <Link href={`/workspaces/${id}`}>
    <Card className="w-full transition-transform duration-300 hover:scale-105">
      <Flex direction="column" justify="between" className="h-full">
        <Box>
          <Heading size="4">
            {name?.charAt(0).toUpperCase() + name?.slice(1)}
          </Heading>
          <Text size="2" color="gray">
            {_count?.issues ?? 0} issue(s)
          </Text>
        </Box>

        <Flex
          justify="end"
          mt="auto"
          style={{ position: "relative", height: "24px" }}
        >
          {memberships?.slice(0, 4).map(({ user }, i) => (
            <Avatar
              key={i}
              size="1"
              fallback="?"
              radius="full"
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

          {memberships && memberships.length > 4 && (
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
              +{memberships.length - 4}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  </Link>
);
