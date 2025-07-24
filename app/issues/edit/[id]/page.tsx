import React from "react";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import IssueFormSkeleton from "@/app/issues/_components/IssueFormSkeleton";
import dynamic from "next/dynamic";
import { Box, Grid } from "@radix-ui/themes";

const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
  loading: () => <IssueFormSkeleton />,
});

interface Props {
  params: { id: string };
}

const EditIssuePage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <IssueForm issue={issue} />
      </Box>
    </Grid>
  );
};

export default EditIssuePage;
