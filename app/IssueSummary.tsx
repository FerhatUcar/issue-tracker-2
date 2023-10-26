import { Status } from "@prisma/client";
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React, { FC } from "react";

interface IssueSummaryProps {
  open: number;
  inProgress: number;
  closed: number;
}

const IssueSummary: FC<IssueSummaryProps> = ({ open, inProgress, closed }) => {
  const containers: {
    label: string;
    value: number;
    status: Status;
  }[] = [
    { label: "Open Issues", value: open, status: "OPEN" },
    {
      label: "In-progress Issues",
      value: inProgress,
      status: "IN_PROGRESS",
    },
    { label: "Closed Issues", value: closed, status: "CLOSED" },
  ];

  return (
    <Flex gap="4">
      {containers.map((container) => (
        <Card
          key={container.label}
          className="hover:bg-neutral-800 transition-colors"
        >
          <Flex direction="column" gap="1">
            <Link
              className="text-sm font-medium"
              href={`/issues/list?status=${container.status}`}
            >
              {container.label}
            </Link>
            <Text size="5" className="font-bold">
              {container.value}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default IssueSummary;
