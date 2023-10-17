import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

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
        {issue.title}
        {issue.description} {issue.status} {issue.createdAt.toDateString()}
      </p>
    </div>
  );
};

export default IssueDetailPage;
