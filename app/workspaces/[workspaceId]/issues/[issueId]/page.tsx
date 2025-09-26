import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Card, Flex, Grid } from "@radix-ui/themes";
import IssueDetails from "@/app/workspaces/[workspaceId]/issues/[issueId]/IssueDetails";
import {
  Comments,
  DeleteIssue,
  EditIssue,
  Reporter,
  SideSection,
  Status,
} from "@/app/workspaces/[workspaceId]/issues/[issueId]/components";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import AssigneeSelect from "@/app/workspaces/[workspaceId]/issues/[issueId]/AssigneeSelect";
import IssueStatus from "@/app/workspaces/[workspaceId]/issues/_components/IssueStatus";
import { fetchIssue } from "@/app/workspaces/[workspaceId]/issues/[issueId]/actions";
import { Metadata } from "next";
import { Box } from "@/app/components";

type Props = {
  params: Promise<{ issueId: string; workspaceId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { issueId } = await params;
  const id = Number(issueId);

  if (!Number.isFinite(id)) {
    return {};
  }

  const issue = await fetchIssue(id);

  return {
    title: issue?.title ?? "Issue",
    description: issue ? `Details of issue ${issue.id}` : "Issue not found",
  };
}

export default async function IssueDetailPage({ params }: Props) {
  const { workspaceId, issueId } = await params;
  const id = Number(issueId);

  if (!Number.isFinite(id)) {
    notFound();
  }

  const [session, issue] = await Promise.all([
    getServerSession(authOptions),
    fetchIssue(id),
  ]);

  if (!issue) {
    notFound();
  }

  if (issue.workspaceId !== workspaceId) {
    notFound();
  }

  const isMember = await prisma.membership.findFirst({
    where: { workspaceId, userId: session?.user?.id },
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

            <SideSection title="Update assignee">
              <AssigneeSelect issue={issue} />
            </SideSection>

            <SideSection title="Update status">
              <IssueStatus issue={issue} />
            </SideSection>

            <SideSection title="Actions">
              <Box className="flex gap-2 w-full md:flex-col">
                <Box className="w-[50%] md:w-full">
                  <EditIssue
                    issue={{
                      id: issue.id,
                      title: issue.title,
                      description: issue.description,
                      assignedToUserId: issue.assignedToUserId,
                    }}
                  />
                </Box>
                <Box className="w-[50%] md:w-full">
                  <DeleteIssue issueId={issue.id} workspaceId={workspaceId} />
                </Box>
              </Box>
            </SideSection>
          </Flex>
        </Card>
      )}
    </Grid>
  );
}
