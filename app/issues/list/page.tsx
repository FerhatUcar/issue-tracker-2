import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import { Pagination } from "@/app/components";
import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import IssueTable, {
  IssueQuery,
} from "@/app/workspaces/[workspaceId]/issues/list/IssueTable";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/app/auth/authOptions";
import { GiBoxTrap } from "react-icons/gi";
import { WorkspaceSelect } from "@/app/issues/_components";

type Props = {
  searchParams: IssueQuery;
};

const AllIssuesPage = async ({ searchParams }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const statuses: Status[] = Object.values(Status);
  const status: Status | undefined = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const [issues, issueCount, memberships] = await Promise.all([
    prisma.issue.findMany({
      where: {
        assignedToUserId: session.user.id,
        status,
      },
      include: {
        assignedToUser: true,
        Workspace: true,
        Comment: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),

    prisma.issue.count({
      where: {
        assignedToUserId: session.user.id,
        status,
      },
    }),

    prisma.membership.findMany({
      where: { userId: session.user.id },
      include: { workspace: true },
    }),
  ]);

  const workspaces = memberships
    .map((m) => m.workspace)
    .filter((w) => w !== null);

  const workspaceOptions = workspaces.map(({ id, name }) => ({
    id,
    name,
  }));

  return (
    <Box className="space-y-6">
      <Box className="flex items-center justify-between">
        <Box>
          <Heading size="4" className="mb-1">
            My Issues List
          </Heading>
          <Text size="2" className="text-gray-500">
            {issueCount} {issueCount === 1 ? "issue" : "issues"} assigned to you
            across all workspaces
          </Text>
        </Box>
      </Box>

      {issues.length === 0 ? (
        <Card>
          <Flex direction="column" align="center" gap="2" my="4">
            <GiBoxTrap className="w-20 h-20 mb-4" />
            <Text size="3" className="text-gray-500">
              No issues assigned to you
            </Text>
          </Flex>

          {workspaces.length > 0 && (
            <Flex direction="column" gap="2" align="center" my="4">
              {workspaces.length > 0 && (
                <Flex direction="column" align="center">
                  <WorkspaceSelect workspaces={workspaceOptions} />
                </Flex>
              )}
            </Flex>
          )}
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <IssueTable
              searchParams={searchParams}
              issuesWithAssigning={issues}
              workspaceName=""
              workspaceId=""
              showWorkspacePerIssue
            />
          </Card>

          {issueCount > pageSize && (
            <Flex justify="center" className="pt-4">
              <Pagination
                itemCount={issueCount}
                pageSize={pageSize}
                currentPage={page}
              />
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default AllIssuesPage;
