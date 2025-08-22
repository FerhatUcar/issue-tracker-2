import { Prisma } from "@prisma/client";
import prisma from "@/prisma/client";

type Params = {
  where?: Prisma.IssueWhereInput;
  orderBy?: Prisma.IssueOrderByWithRelationInput;
  page?: number;
  pageSize?: number;
};

const defaultPage = 1;
const defaultPageSize = 10;

export const getPaginatedIssuesWithAssignedUser = async ({
  where,
  orderBy,
  page = defaultPage,
  pageSize = defaultPageSize,
}: Params): Promise<
  Prisma.IssueGetPayload<{ include: { assignedToUser: true } }>[]
> =>
  await prisma.issue.findMany({
    where,
    orderBy,
    skip: page,
    take: pageSize,
    include: {
      assignedToUser: true,
      workspace: true,
      Comment: true,
    },
  });
