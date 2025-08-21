import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Box, Card, Flex, Grid, Text } from "@radix-ui/themes";
import IssueDetails from "@/app/workspaces/[workspaceId]/issues/[issueId]/IssueDetails";
import {
  Comments,
  DeleteIssue,
  EditIssue,
  Reporter,
  Status,
} from "@/app/workspaces/[workspaceId]/issues/[issueId]/components";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import AssigneeSelect from "@/app/workspaces/[workspaceId]/issues/[issueId]/AssigneeSelect";
import IssueStatus from "@/app/workspaces/[workspaceId]/issues/_components/IssueStatus";
import { fetchIssue } from "@/app/workspaces/[workspaceId]/issues/[issueId]/actions";

type Props = {
  params: { issueId: string; workspaceId: string };
};

export async function generateMetadata({ params: { issueId } }: Props) {
  const issue = await fetchIssue(parseInt(issueId));

  return {
    title: issue?.title,
    description: "Details of issue " + issue?.id,
  };
}

const IssueDetailPage = async ({ params: { issueId, workspaceId } }: Props) => {
  const session = await getServerSession(authOptions);
  const issue = await fetchIssue(parseInt(issueId));

  if (!issue) {
    notFound();
  }

  if (issue.workspaceId !== workspaceId) {
    notFound();
  }

  const isMember = await prisma.membership.findFirst({
    where: {
      workspaceId,
      userId: session?.user?.id,
    },
    select: { id: true },
  });

  if (!isMember) {
    notFound();
  }

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="4">
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} workspaceId={workspaceId} />
        <Comments issueId={issue.id} />
      </Box>

      {session && (
        <Card>
          <Flex direction="column" gap="3">
            <Reporter issue={issue} />
            <Status status={issue.status} />
            <Flex
              align="start"
              direction="column"
              gap="3"
              className="text-xs text-gray-400 rounded-md p-2 bg-neutral-100 dark:bg-neutral-900"
            >
              <Text weight="bold">Update assignee</Text>
              <AssigneeSelect issue={issue} />
            </Flex>

            <Flex
              align="start"
              direction="column"
              gap="3"
              className="text-xs text-gray-400 rounded-md p-2 bg-neutral-100 dark:bg-neutral-900"
            >
              <Text weight="bold"> Update status</Text>
              <IssueStatus issue={issue} />
            </Flex>

            <EditIssue
              workspaceId={workspaceId}
              issue={{
                id: issue.id,
                title: issue.title,
                description: issue.description,
                assignedToUserId: issue.assignedToUserId,
              }}
            />
            <DeleteIssue issueId={issue.id} workspaceId={workspaceId} />
          </Flex>
        </Card>
      )}
    </Grid>
  );
};

export default IssueDetailPage;
