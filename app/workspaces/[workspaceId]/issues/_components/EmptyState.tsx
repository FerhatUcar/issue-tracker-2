import React from "react";
import Link from "next/link";
import { Status } from "@prisma/client";
import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { getStatusLabel } from "@/app/workspaces/[workspaceId]/issues/helpers";
import { AiFillPlusCircle } from "react-icons/ai";
import { GiBoxTrap } from "react-icons/gi";

type Props = {
  workspaceId: string;
  status?: Status;
};

export const EmptyState = ({ workspaceId, status }: Props) => (
  <Card>
    <Flex direction="column" align="center" justify="center" p="4">
      <GiBoxTrap className="w-16 h-16 text-gray-400 mb-4" />
      <Heading size="5" className="mb-2 text-center">
        {status
          ? `Geen ${getStatusLabel(status)} issues`
          : "Geen issues gevonden"}
      </Heading>
      <Text size="3" className="text-gray-500 text-center" mb="6">
        {status
          ? `Er zijn momenteel geen issues met de status "${getStatusLabel(status)}".`
          : "Begin met het maken van je eerste issue om aan de slag te gaan."}
      </Text>
      <Link href={`/workspaces/${workspaceId}/issues/new`}>
        <Button variant="soft">
          <AiFillPlusCircle /> Nieuwe Issue Maken
        </Button>
      </Link>
    </Flex>
  </Card>
);
