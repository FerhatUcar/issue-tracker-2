import dynamic from "next/dynamic";
import {
  Avatar,
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import { NoIssuesPlaceholder, StatusDot } from "@/app/components";
import Link from "next/link";
import { IoTicketOutline } from "react-icons/io5";
import { getLatestIssues } from "@/app/helpers";
import { BsChatDots } from "react-icons/bs";

const CreateIssueDialog = dynamic(() =>
  import("@/app/workspaces/[workspaceId]/issues/_components/CreateIssue").then(
    (m) => m.CreateIssue,
  ),
);

type Props = {
  workspaceId: string;
};

export const LatestIssues = async ({ workspaceId }: Props) => {
  const issues = await getLatestIssues(workspaceId);
  const hasIssues = issues.length > 0;

  return (
    <Card>
      <Flex width="100%" align="center" gap="3" mb="3">
        <IoTicketOutline size="20" />
        <Heading size="3" weight="bold">
          Latest issues
        </Heading>
      </Flex>

      {hasIssues ? (
        <Box className="h-[calc(100%-75px)]">
          {issues.map((issue) => (
            <Link
              href={`/workspaces/${workspaceId}/issues/${issue.id}`}
              key={issue.id}
            >
              <Box
                mb="3"
                className="rt-TableRow transition rounded-lg pl-3 pr-2 py-2 min-h-[48px] content-center"
              >
                <Flex justify="between" align="center">
                  <Flex direction="row" align="center" height="5" gap="2">
                    <StatusDot status={issue.status} />

                    <Text className="overflow-hidden truncate max-[430px]:w-36">
                      {issue.title}
                    </Text>
                  </Flex>

                  <Flex gap="2" align="center">
                    {issue.Comment.length > 0 && (
                      <Badge variant="soft" color="gray">
                        <BsChatDots /> {issue.Comment.length}
                      </Badge>
                    )}

                    {issue.assignedToUser && (
                      <Avatar
                        src={issue.assignedToUser.image!}
                        fallback="?"
                        size="2"
                        radius="large"
                      />
                    )}
                  </Flex>
                </Flex>
              </Box>
            </Link>
          ))}
        </Box>
      ) : (
        <NoIssuesPlaceholder />
      )}

      <CreateIssueDialog />
    </Card>
  );
};
