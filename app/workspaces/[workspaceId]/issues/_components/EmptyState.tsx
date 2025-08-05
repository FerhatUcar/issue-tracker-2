import React from "react";
import Link from "next/link";
import { Status } from "@prisma/client";
import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { getStatusLabel } from "@/app/workspaces/[workspaceId]/issues/helpers";
import { AiFillPlusCircle } from "react-icons/ai";
import { GiBoxTrap } from "react-icons/gi";

type Props = {
  /**
   * Identifier for a specific workspace.
   * This unique string is used to reference and interact with the workspace in various operations.
   */
  workspaceId: string;

  /**
   * Represents the current status of a process, operation, or entity.
   * The `status` can be optional, and its presence or absence may indicate varying states.
   * It is typically used to track or manage the current state in a workflow or application.
   */
  status?: Status;
};

export const EmptyState = ({ workspaceId, status }: Props) => (
  <Card>
    <Flex direction="column" align="center" justify="center" p="4">
      <GiBoxTrap className="w-20 h-20 mb-4" />
      <Heading size="5" className="mb-2 text-center">
        {status ? `No ${getStatusLabel(status)} issues` : "No issues found"}
      </Heading>
      <Text size="3" className="text-gray-500 text-center" mb="6">
        {status
          ? `There are currently no issues with the status "${getStatusLabel(status)}".`
          : "Start by creating your first issue to get started."}
      </Text>
      <Link href={`/workspaces/${workspaceId}/issues/new`}>
        <Button variant="soft">
          <AiFillPlusCircle /> Create New Issue
        </Button>
      </Link>
    </Flex>
  </Card>
);
