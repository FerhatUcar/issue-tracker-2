import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import { StatusBadge } from "@/app/components";
import { Status as IssueStatus } from "@prisma/client";

type Props = {
  status: IssueStatus;
};

export const Status = ({ status }: Props) => {
  return (
    <Flex
      align="center"
      justify="between"
      className="text-xs text-gray-400 rounded-md p-2 bg-neutral-100 dark:bg-neutral-900"
    >
      <Text weight="bold">Status</Text>
      <StatusBadge status={status} />
    </Flex>
  );
};
