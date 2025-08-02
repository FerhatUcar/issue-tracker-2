import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { IssueChart, LatestIssues, Summary } from "@/app/components";
import { getIssueStatusCounts } from "@/app/helpers";

type Props = {
  params: { workspaceId: string };
};

export default async function WorkspacePage({ params }: Props) {
  const session = await getServerSession(authOptions);

  const workspace = await prisma.workspace.findUnique({
    where: { id: params.workspaceId },
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

  const issueCounts = await getIssueStatusCounts(params.workspaceId);

  return (
    <Box>
      <h1 className="text-xl font-bold mb-6">Workspace name: {workspace.name}</h1>

      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <Summary {...issueCounts} workspaceId={params.workspaceId} />
          <IssueChart {...issueCounts} />
        </Flex>
        <LatestIssues params={params} />
      </Grid>
    </Box>
  );
}
