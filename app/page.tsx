import React from "react";
import { Metadata } from "next";

import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import IssueSummary from "./IssueSummary";
import IssueChart from "./IssueChart";
import LatestIssues from "./LatestIssues";
import { Flex, Grid } from "@radix-ui/themes";
import { PublicHome } from "./components";
import { getIssueStatusCounts } from "@/app/helpers";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Issue Tracker - Dashboard",
  description: "View a summary of project issues",
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <PublicHome />;
  }

  const issueCounts = await getIssueStatusCounts();

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5" className="mt-6">
      <Flex direction="column" gap="5">
        <IssueSummary {...issueCounts} />
        <IssueChart {...issueCounts} />
      </Flex>
      <LatestIssues />
    </Grid>
  );
}
