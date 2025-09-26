import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Flex, Grid, Heading } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { Box, IssueChart, LatestIssues, Summary } from "@/app/components";
import { getIssueStatusCounts } from "@/app/helpers";
import { Actions } from "@/app/workspaces/_components";

type Props = {
  params: Promise<{ workspaceId: string }>;
};

const WorkspacePage = async ({ params }: Props) => {
  const { workspaceId } = await params;
  const session = await getServerSession(authOptions);

  const [workspace, issueCounts] = await Promise.all([
    prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        issues: true,
        memberships: {
          include: {
            user: true,
          },
        },
      },
    }),
    getIssueStatusCounts(workspaceId),
  ]);

  const currentUserId = session?.user?.id;
  const isMember = workspace?.memberships.some(
    (member) => member.userId === currentUserId,
  );

  const isAdmin = workspace?.memberships.some(
    (member) => member.userId === currentUserId && member.role === "ADMIN",
  );

  if (!workspace || !isMember) {
    notFound();
  }

  return (
    <>
      <Flex justify="between" align="center" mb="4" width="full">
        <Box className="w-4/12">
          <Heading size="4" className="truncate">
            {workspace.name?.charAt(0).toUpperCase() + workspace.name?.slice(1)}
          </Heading>
        </Box>

        <Box className="w-1/12 flex justify-end">
          <Actions
            workspaceId={workspaceId}
            workspaceName={workspace.name}
            isAdmin={isAdmin ?? false}
          />
        </Box>
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
};

export default WorkspacePage;
