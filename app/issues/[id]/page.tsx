import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Heading, Text, Flex, Card } from "@radix-ui/themes";
import IssueStatusBadge from "@/app/components/IssuesStatusBadge";

type Props = {
  params: { id: string };
};
const IssueDetailPage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue) {
    notFound();
  }

  return (
    <div>
      <p>
        <Heading>{issue.title}</Heading>
        <Flex gap="5">
          <IssueStatusBadge status={issue.status} />
          <Text>{issue.createdAt.toDateString()}</Text>
        </Flex>
        <Card>
          <p>{issue.description}</p>
        </Card>
      </p>
    </div>
  );
};

export default IssueDetailPage;
