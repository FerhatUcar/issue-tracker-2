import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import { Box, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { HiOutlinePlus } from "react-icons/hi2";
import { CreateWorkspace } from "@/app/workspaces/_components/CreateWorkspace";
import { WorkspaceCard } from "@/app/workspaces/_components";
import { MdOutlineWorkspaces } from "react-icons/md";
import { WorkspaceCardData, workspaceCardSelect } from "@/app/types/workspace";

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
      <Heading as="h1" size="6" mb="4">
        <Flex direction="row" gap="2" align="center">
          <MdOutlineWorkspaces /> Workspaces
        </Flex>
      </Heading>

      {workspaces.length === 0 ? (
        <Card>
          <Box p="4" className="flex items-center justify-between">
            <Text size="3">Je hebt nog geen workspaces.</Text>
            <CreateWorkspace>
              <Card className="cursor-pointer">
                <Box className="flex justify-center items-center h-full p-2">
                  <Flex align="center" gap="2">
                    <HiOutlinePlus className="w-5 h-5" />
                    <Text>Nieuwe workspace</Text>
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
            <Card className="cursor-pointer">
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
