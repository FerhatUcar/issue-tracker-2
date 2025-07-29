import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Box, Card, Grid, Flex } from "@radix-ui/themes";
import IssueDetails from "@/app/issues/[id]/IssueDetails";
import { DeleteIssueButton, EditIssueButton, Comments } from "@/app/issues/[id]/components";
import { Issue } from "@prisma/client";
import React, { cache } from "react";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import AssigneeSelect from "@/app/issues/[id]/AssigneeSelect";
import IssueStatus from "@/app/issues/_components/IssueStatus";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const issue = await fetchUser(parseInt(params.id));

  return {
    title: issue?.title,
    description: "Details of issue " + issue?.id,
  };
}

const fetchUser = cache((issueId: number) =>
  prisma.issue.findUnique({ where: { id: issueId } }),
);

const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const issue: Issue | null = await fetchUser(parseInt(params.id));

  if (!issue) {
    notFound();
  }

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} />
        <Comments issueId={issue.id} />
      </Box>

      {session && (
        <Card>
          <Flex direction="column" gap="3">
            <AssigneeSelect issue={issue} />
            <IssueStatus issue={issue} />
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Card>
      )}
    </Grid>
  );
};

export default IssueDetailPage;
