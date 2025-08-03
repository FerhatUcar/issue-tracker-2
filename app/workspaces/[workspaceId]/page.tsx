import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Box, Button, Flex, Grid, Heading } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { IssueChart, LatestIssues, Summary } from "@/app/components";
import { getIssueStatusCounts } from "@/app/helpers";
import { InviteMember } from "@/app/invite/_components";
import { PlusIcon } from "@radix-ui/react-icons";

type Props = {
  params: { workspaceId: string };
};

export default async function WorkspacePage({ params: {workspaceId} }: Props) {
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
    <Box>
      <Flex justify="between" align="center" mb="4">
        <Heading size="4">{workspace.name}</Heading>
        <InviteMember workspaceId={workspaceId}>
          <Button variant="soft" size="3">
            <PlusIcon /> Invite Member
          </Button>
        </InviteMember>
      </Flex>

      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <Summary {...issueCounts} workspaceId={workspaceId} />
          <IssueChart {...issueCounts} />
        </Flex>
        <LatestIssues workspaceId={workspaceId} />
      </Grid>
    </Box>
  );
}
