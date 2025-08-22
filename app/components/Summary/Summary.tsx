"use client";

import React from "react";
import { Box, Card, Grid, Text } from "@radix-ui/themes";
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
   * Number of issues in review
   */
  review: number;

  /**
   * Number of closed issues
   */
  closed: number;

  /**
   * A unique identifier representing a specific workspace.
   * This ID is typically used to differentiate between various workspaces
   * within a system or application.
   */
  workspaceId: string;
};

export const Summary = ({
  open,
  inProgress,
  review,
  closed,
  workspaceId,
}: Props) => {
  const items: Item[] = getSummaryData(open, inProgress, review, closed);

  return (
    <Card>
      <Grid columns={{ initial: "2", sm: "2", md: "4" }} gap="2">
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
      </Grid>
    </Card>
  );
};
