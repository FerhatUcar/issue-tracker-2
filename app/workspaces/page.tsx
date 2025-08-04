import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import { Box, Card, Flex, Grid, Heading } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { CreateWorkspace } from "@/app/workspaces/_components/CreateWorkspace";
import { WorkspaceCard } from "@/app/workspaces/_components";
import { MdOutlineWorkspaces } from "react-icons/md";

const WorkspacesPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/");
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: {
      workspace: {
        include: {
          memberships: {
            take: 3,
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          _count: { select: { issues: true } },
        },
      },
    },
  });

  const workspaces = memberships.map((m) => m.workspace);

  return (
    <>
      <Heading as="h1" size="6" mb="4">
        <Flex direction="row" gap="2" align="center">
          <MdOutlineWorkspaces /> Workspaces
        </Flex>
      </Heading>

      <Grid
        columns={{ initial: "1", sm: "3", md: "3", lg: "4" }}
        gap="4"
        width="auto"
      >
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}

        <CreateWorkspace>
          <Card className="cursor-pointer">
            <Box className="flex justify-center items-center h-full">
              <PlusIcon className="w-14 h-14" />
            </Box>
          </Card>
        </CreateWorkspace>
      </Grid>
    </>
  );
};

export default WorkspacesPage;
