import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import { Box, Card, Flex, Grid, Heading } from "@radix-ui/themes";
import { HiOutlinePlus } from "react-icons/hi2";
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
    select: { id: true },
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
          _count: {
            select: {
              issues: true,
            },
          },
        },
      },
    },
  });

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
        {memberships
          .map(({ workspace }) => workspace)
          .map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}

        <CreateWorkspace>
          <Card className="cursor-pointer">
            <Box className="flex justify-center items-center h-full">
              <HiOutlinePlus className="w-10 h-10" />
            </Box>
          </Card>
        </CreateWorkspace>
      </Grid>
    </>
  );
};

export default WorkspacesPage;
