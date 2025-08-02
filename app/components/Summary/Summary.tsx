"use client";

import React from "react";
import { Card, Flex, Text, Box } from "@radix-ui/themes";
import Link from "next/link";
import classnames from "classnames";
import { getSummaryData, Item } from "./get-summary-data";

type Props = {
  /**
   * Number of open issues
   */
  open: number;

  /**
   * Number of in-progress issues
   */
  inProgress: number;

  /**
   * Number of closed issues
   */
  closed: number;

  /**
   * Workspace ID (nodig voor linkopbouw)
   */
  workspaceId: string;
};

export const Summary = ({ open, inProgress, closed, workspaceId }: Props) => {
  const items: Item[] = getSummaryData(open, inProgress, closed);

  return (
    <Card>
      <Flex gap="3">
        {items.map(({ label, value, status, color }) => (
          <Box
            key={label}
            className={classnames(
              "flex-1 transition-all hover:shadow-lg cursor-pointer rounded-lg",
              color,
            )}
          >
            <Link
              href={`/workspaces/${workspaceId}/issues/list?status=${status}`}
            >
              <Box className="p-2 md:p-4">
                <Text size="2" weight="medium" className="block mb-1">
                  {label}
                </Text>
                <Text size="6" weight="bold">
                  {value}
                </Text>
              </Box>
            </Link>
          </Box>
        ))}
      </Flex>
    </Card>
  );
};
