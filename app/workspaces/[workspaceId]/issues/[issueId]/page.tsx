import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Box, Card, Flex, Grid, Separator } from "@radix-ui/themes";
import IssueDetails from "@/app/workspaces/[workspaceId]/issues/[issueId]/IssueDetails";
import {
  Comments,
  DeleteIssue,
  EditIssue,
} from "@/app/workspaces/[workspaceId]/issues/[issueId]/components";
import React, { cache } from "react";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import AssigneeSelect from "@/app/workspaces/[workspaceId]/issues/[issueId]/AssigneeSelect";
import IssueStatus from "@/app/workspaces/[workspaceId]/issues/_components/IssueStatus";

type Props = {
  params: { issueId: string; workspaceId: string };
};

const fetchIssue = cache((issueId: number) =>
  prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      assignedToUser: true,
      Workspace: {
        include: {
          memberships: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  }),
);

export async function generateMetadata({ params }: Props) {
  const issue = await fetchIssue(parseInt(params.issueId));

  return {
    title: issue?.title,
    description: "Details of issue " + issue?.id,
  };
}

const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const issue = await fetchIssue(parseInt(params.issueId));

  if (!issue) {
    notFound();
  }

  const isMember = issue.Workspace?.memberships.some(
    (membership) => membership.user.email === session?.user?.email,
  );

  if (!isMember) {
    notFound();
  }

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="4">
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} workspaceId={params.workspaceId} />
        <Comments issueId={issue.id} />
      </Box>

      {session && (
        <Card>
          <Flex direction="column" gap="3">
            Update Assignee
            <AssigneeSelect issue={issue} />
            Update status
            <IssueStatus issue={issue} />
            <Separator className="w-full my-2" />
            <EditIssue
              issue={{
                id: issue.id,
                title: issue.title,
                description: issue.description,
                assignedToUserId: issue.assignedToUserId,
              }}
            />
            {issue.workspaceId && (
              <DeleteIssue
                issueId={issue.id}
                workspaceId={issue?.workspaceId}
              />
            )}
          </Flex>
        </Card>
      )}
    </Grid>
  );
};

export default IssueDetailPage;
