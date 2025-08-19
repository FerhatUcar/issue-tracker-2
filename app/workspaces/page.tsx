import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import { Box, Card, Flex, Grid, Text } from "@radix-ui/themes";
import { HiOutlinePlus } from "react-icons/hi2";
import { CreateWorkspace } from "@/app/workspaces/_components/CreateWorkspace";
import { WorkspaceCard } from "@/app/workspaces/_components";
import { WorkspaceCardData, workspaceCardSelect } from "@/app/types/workspace";
import { PageTitle } from "@/app/components";

const WorkspacesPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  const workspaces: WorkspaceCardData[] = await prisma.workspace.findMany({
    where: { memberships: { some: { user: { email: session.user.email } } } },
    orderBy: { updatedAt: "desc" },
    select: workspaceCardSelect,
  });

  return (
    <>
      <PageTitle title="Workspaces" description="Manage your workspaces." />

      {workspaces.length === 0 ? (
        <Card>
          <Box p="4" className="flex items-center justify-between">
            <Text size="3">You do not have any workspaces.</Text>
            <CreateWorkspace>
              <Card className="cursor-pointer">
                <Box className="flex justify-center items-center h-full p-2">
                  <Flex align="center" gap="2">
                    <HiOutlinePlus className="w-5 h-5" />
                    <Text>New workspace</Text>
                  </Flex>
                </Box>
              </Card>
            </CreateWorkspace>
          </Box>
        </Card>
      ) : (
        <Grid
          columns={{ initial: "1", sm: "3", md: "3", lg: "4" }}
          gap="4"
          width="auto"
        >
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws.id} workspace={ws} />
          ))}

          <CreateWorkspace>
            <Card className="cursor-pointer transition-transform duration-300 hover:scale-105">
              <Box className="flex justify-center items-center h-full">
                <HiOutlinePlus className="w-10 h-10" />
              </Box>
            </Card>
          </CreateWorkspace>
        </Grid>
      )}
    </>
  );
};

export default WorkspacesPage;
