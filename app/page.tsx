import prisma from "@/prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import IssueChart from "./IssueChart";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import { Status } from "@prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import React from "react";
import Image from "next/image";

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
      <Box className="flex items-center">
        <Box className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between">
          <Box className="text-left flex-1">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Create <span className="text-cyan-500">rocket</span> fast issues..
            </h1>
            <p className="text-lg md:text-xl ">
              And manage your tickets like a pro with our sleek, modern
              interface.
            </p>
          </Box>

          <Box className="flex-1 flex justify-center">
            <Image
              src="/homepage.png"
              alt="Rocket illustration"
              width={400}
              height={400}
              className="md:w-[400px] h-auto drop-shadow-xl"
              priority
            />
          </Box>
        </Box>
      </Box>
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
