import prisma from "@/prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import IssueChart from "./IssueChart";
import { Box, Button, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { Metadata } from "next";
import { Status } from "@prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import React from "react";
import Image from "next/image";
import Link from "next/link";

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
      <Box width="100%" className="flex items-center justify-center">
        <Card className="p-8">
          <Flex direction="column" gap="3" align="center">
            <Heading size="7">Please login</Heading>
            <Link className="hover:cursor-pointer" href="/api/auth/signin">
              <Button
                size="4"
                className="p-8 hover:cursor-pointer"
                color="gray"
              >
                <Flex justify="between" align="center">
                  <Text size="4">Login with</Text>
                  <Image
                    src="/google.png"
                    alt="Google Logo"
                    width={40}
                    height={40}
                  />
                </Flex>
              </Button>
            </Link>
          </Flex>
        </Card>
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
