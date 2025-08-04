import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Button, Flex, Grid, Heading } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { IssueChart, LatestIssues, Summary } from "@/app/components";
import { getIssueStatusCounts } from "@/app/helpers";
import { InviteMember } from "@/app/invite/_components";
import { PlusIcon } from "@radix-ui/react-icons";
import { IoTicketOutline } from "react-icons/io5";
import Link from "next/link";

type Props = {
  params: { workspaceId: string };
};

export default async function WorkspacePage({
  params: { workspaceId },
}: Props) {
  const session = await getServerSession(authOptions);

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      issues: true,
      memberships: true,
    },
  });

  const isMember = workspace?.memberships.some(
    (member) => member.userId === session?.user?.id,
  );

  if (!workspace || !isMember) {
    notFound();
  }

  const issueCounts = await getIssueStatusCounts(workspaceId);

  return (
    <>
      <Flex justify="between" align="center" mb="4">
        <Heading size="4">
          {workspace.name?.charAt(0).toUpperCase() + workspace.name?.slice(1)}
        </Heading>
        <Flex direction="row" gap="2" align="center">
          <Link href={`/workspaces/${workspaceId}/issues/list`}>
            <Button variant="soft" size="3">
              <IoTicketOutline /> Issues
            </Button>
          </Link>
          <InviteMember workspaceId={workspaceId}>
            <Button variant="soft" size="3">
              <PlusIcon /> Invite member
            </Button>
          </InviteMember>
        </Flex>
      </Flex>

      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <Summary {...issueCounts} workspaceId={workspaceId} />
          <IssueChart {...issueCounts} />
        </Flex>
        <LatestIssues workspaceId={workspaceId} />
      </Grid>
    </>
  );
}
