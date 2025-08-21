import { Avatar, Box, Card, Flex, Heading, IconButton } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IssuesWithAssigning } from "@/app/types/types";

type Props = {
  /**
   * The issue object containing details like title, description, status, and timestamps.
   */
  issue: IssuesWithAssigning;

  /**
   * A unique identifier for a workspace.
   */
  workspaceId: string;
};

const IssueDetails = ({
  issue: { title, description, assignedToUser },
  workspaceId,
}: Props) => (
  <Card>
    <Flex
      direction="row"
      gap="2"
      align="center"
      className="bg-neutral-100 dark:bg-neutral-900 pl-2 rounded-lg"
    >
      <Box className="w-full rounded-lg">
        <Flex justify="between" align="center" py="2">
          <Link href={`/workspaces/${workspaceId}`}>
            <IconButton size="1" variant="soft" title="Back">
              <IoMdArrowRoundBack />
            </IconButton>
          </Link>

          {assignedToUser && (
            <Avatar
              src={assignedToUser.image ?? ""}
              fallback={assignedToUser.name?.[0] ?? "?"}
              size="1"
              radius="large"
              className="mr-2"
              title={assignedToUser.name ?? "Assigned user"}
              referrerPolicy="no-referrer"
            />
          )}
        </Flex>
      </Box>
    </Flex>

    <Box className="p-2 py-4">
      <Heading mb="2">{title}</Heading>
      <ReactMarkdown>{description}</ReactMarkdown>
    </Box>
  </Card>
);

export default IssueDetails;
