import prisma from "@/prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import IssueChart from "./IssueChart";
import { Flex, Grid, Heading } from "@radix-ui/themes";
import { Metadata } from "next";
import { Status } from "@prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import React from "react";

const getIssueStatus = (status: Status) =>
  prisma.issue.count({
    where: { status },
  });

export default async function Home() {
  const open = await getIssueStatus("OPEN");
  const inProgress = await getIssueStatus("IN_PROGRESS");
  const closed = await getIssueStatus("CLOSED");
  const session = await getServerSession(authOptions);

  const issueProps = {
    open,
    inProgress,
    closed,
  };

  if (!session) {
    return (
      <div>
        <Heading size="7">Please login</Heading>
      </div>
    );
  }

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Flex direction="column" gap="5">
        <IssueSummary {...issueProps} />
        <IssueChart {...issueProps} />
      </Flex>
      <LatestIssues />
    </Grid>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issue Tracker - Dashboard",
  description: "View a summary of project issues",
};
