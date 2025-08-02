import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Box, Card, Grid, Flex } from "@radix-ui/themes";
import IssueDetails from "@/app/workspaces/[workspaceId]/issues/[issueId]/IssueDetails";
import {
  DeleteIssueButton,
  EditIssueButton,
  Comments,
} from "@/app/workspaces/[workspaceId]/issues/[issueId]/components";
import { Issue } from "@prisma/client";
import React, { cache } from "react";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import AssigneeSelect from "@/app/workspaces/[workspaceId]/issues/[issueId]/AssigneeSelect";
import IssueStatus from "@/app/workspaces/[workspaceId]/issues/_components/IssueStatus";
import { LuFlipVertical } from "react-icons/lu";

type Props = {
  params: { issueId: string; workspaceId: string };
};

const fetchIssue = cache((issueId: number) =>
  prisma.issue.findUnique({ where: { id: issueId } }),
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
  const issue: Issue | null = await fetchIssue(parseInt(params.issueId));

  if (!issue) {
    notFound();
  }

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="4">
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} />
        <Comments issueId={issue.id} />
      </Box>

      {session && (
        <Card>
          <Flex direction="column" gap="3">
            <Flex direction="row" gap="1" align="center">
              <LuFlipVertical /> Actions
            </Flex>
            <AssigneeSelect issue={issue} />
            <IssueStatus issue={issue} />
            <EditIssueButton
              issueId={issue.id}
              workspaceId={params.workspaceId}
            />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Card>
      )}
    </Grid>
  );
};

export default IssueDetailPage;
