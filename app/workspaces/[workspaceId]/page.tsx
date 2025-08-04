import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Button, Flex, Grid, Heading } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { IssueChart, LatestIssues, Summary } from "@/app/components";
import { getIssueStatusCounts } from "@/app/helpers";
import { InviteMember } from "@/app/invite/_components";
import { PlusIcon } from "@radix-ui/react-icons";
import { IoTicketOutline } from "react-icons/io5";
import { RiGroup2Fill } from "react-icons/ri";
import Link from "next/link";
import { DeleteWorkspaceButton } from "@/app/workspaces/_components";

type Props = {
  params: { workspaceId: string };
};

export default async function WorkspacePage({
  params: { workspaceId },
}: Props) {
  const session = await getServerSession(authOptions);

  const [workspace, issueCounts] = await Promise.all([
    prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        issues: true,
        memberships: {
          include: {
            user: true,
          },
        },
      },
    }),
    getIssueStatusCounts(workspaceId),
  ]);

  const currentUserId = session?.user?.id;
  const isMember = workspace?.memberships.some(
    (member) => member.userId === currentUserId,
  );

  const isAdmin = workspace?.memberships.some(
    (member) => member.userId === currentUserId && member.role === "ADMIN",
  );

  if (!workspace || !isMember) {
    notFound();
  }

  return (
    <>
      <Flex justify="between" align="center" mb="4">
        <Heading size="4">
          {workspace.name?.charAt(0).toUpperCase() + workspace.name?.slice(1)}
        </Heading>

        <Flex direction="row" gap="2" align="center">
          <Link href={`/workspaces/${workspaceId}/members`}>
            <Button variant="soft" size="3">
              <RiGroup2Fill /> View Members
            </Button>
          </Link>
          <Link
            href={`/workspaces/${workspaceId}/issues/list`}
            prefetch={false}
          >
            <Button variant="soft" size="3">
              <IoTicketOutline /> Issues
            </Button>
          </Link>
          <InviteMember workspaceId={workspaceId}>
            <Button variant="soft" size="3">
              <PlusIcon /> Invite member
            </Button>
          </InviteMember>

          {isAdmin && (
            <DeleteWorkspaceButton
              workspaceId={workspace.id}
              workspaceName={workspace.name}
              isAdmin={true}
            />
          )}
        </Flex>
      </Flex>

      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <Summary {...issueCounts} workspaceId={workspaceId} />
          <IssueChart {...issueCounts} />
        </Flex>
        <LatestIssues workspaceId={workspaceId} />
      </Grid>
    </>
  );
}
