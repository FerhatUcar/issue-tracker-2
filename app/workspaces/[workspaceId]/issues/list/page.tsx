import prisma from "@/prisma/client";
import IssueActions from "@/app/workspaces/[workspaceId]/issues/list/IssueActions";
import { Status } from "@prisma/client";
import { Pagination } from "@/app/components";
import IssueTable, {
  IssueQuery,
} from "@/app/workspaces/[workspaceId]/issues/list/IssueTable";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { columns } from "@/app/workspaces/[workspaceId]/issues/list/IssueColumns";
import { getPaginatedIssuesWithAssignedUser } from "@/app/helpers";
import { IssuesWithAssigning } from "@/app/types/types";
import { EmptyState } from "@/app/workspaces/[workspaceId]/issues/_components";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

type Props = {
  searchParams: IssueQuery;
  params: Promise<{ workspaceId: string }>;
};

const IssuesPage = async ({ searchParams, params }: Props) => {
  const { workspaceId } = await params;
  const statuses: Status[] = Object.values(Status);
  const status: Status | undefined = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const assignedToUserId =
    searchParams.assignedToUserId === "All"
      ? undefined
      : searchParams.assignedToUserId;

  const validOrderFields = columns.map((column) => column.value);
  const sortBy = searchParams.sortBy === "asc" ? "asc" : "desc";

  let orderBy: NonNullable<unknown> = { createdAt: "desc" };

  if (validOrderFields.includes(searchParams.orderBy)) {
    if (searchParams.orderBy === "workspaceName") {
      orderBy = { Workspace: { name: sortBy } };
    } else {
      orderBy = { [searchParams.orderBy]: sortBy };
    }
  }

  const page = parseInt(searchParams.page) || 1;

  const [issues, issueCount, workspace] = await Promise.all([
    getPaginatedIssuesWithAssignedUser({
      where: {
        status,
        assignedToUserId,
        workspaceId,
      },
      orderBy,
      page: (page - 1) * 10,
      pageSize: 10,
    }) as Promise<IssuesWithAssigning[]>,

    prisma.issue.count({
      where: {
        status,
        assignedToUserId,
        workspaceId,
      },
    }),

    prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { name: true },
    }),
  ]);

  if (issues.length === 0 && page === 1) {
    return (
      <Box className="space-y-6">
        <Flex direction="column" align="start">
          <Heading size="6" mb="2">
            Issues
          </Heading>
          <Text size="3" className="text-gray-500">
            <Link
              href={`/workspaces/${workspaceId}`}
              className="cursor-pointer"
            >
              <Button mr="2" variant="soft" size="1">
                <IoMdArrowRoundBack /> {workspace?.name || "this workspace"}
              </Button>
            </Link>
            Manage and track all issues
          </Text>
        </Flex>

        <Card className="p-4">
          <IssueActions workspaceId={workspaceId} />
        </Card>

        <EmptyState status={status} />
      </Box>
    );
  }

  return (
    <Box className="space-y-4">
      <Flex direction="column" align="start">
        <Box>
          <Heading size="6" mb="2">
            Issues: {workspace?.name}
          </Heading>

          <Flex align="center" gap="2">
            <Link
              href={`/workspaces/${workspaceId}`}
              className="cursor-pointer"
            >
              <Button variant="soft" size="1">
                <IoMdArrowRoundBack /> Back
              </Button>
            </Link>

            <Text size="2" className="text-gray-500">
              Total: {issueCount}
            </Text>
          </Flex>
        </Box>
      </Flex>

      <Card className="p-4">
        <IssueActions workspaceId={workspaceId} />
      </Card>

      <Card className="overflow-hidden shadow">
        <IssueTable searchParams={searchParams} issuesWithAssigning={issues} />
      </Card>

      {issueCount > 10 && (
        <Flex justify="center" className="pt-4">
          <Pagination itemCount={issueCount} pageSize={10} currentPage={page} />
        </Flex>
      )}
    </Box>
  );
};

export default IssuesPage;
