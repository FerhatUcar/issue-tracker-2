import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Grid, Box, Flex } from "@radix-ui/themes";
import EditIssueButton from "@/app/issues/[id]/EditIssueButton";
import IssueDetails from "@/app/issues/[id]/IssueDetails";
import DeleteIssueButton from "@/app/issues/[id]/DeleteIssueButton";
import { Issue } from "@prisma/client";
import { cache } from "react";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

type Props = {
  params: { id: string };
};

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
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export default IssueDetailPage;
