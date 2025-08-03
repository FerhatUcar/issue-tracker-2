import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import { Card, Flex, Heading, Button } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { CreateWorkspace } from "@/app/workspaces/_components/CreateWorkspace";
import { WorkspaceCard } from "@/app/workspaces/_components";
import { Workspace } from "@prisma/client";

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
    <main className="p-6">
      <Flex justify="between" align="center" mb="4">
        <Heading as="h1" size="6">
          Jouw Workspaces
        </Heading>
        <CreateWorkspace>
          <Button variant="soft">
            <PlusIcon /> New workspace
          </Button>
        </CreateWorkspace>
      </Flex>

      <Flex gap="4" wrap="wrap">
        {workspaces.length === 0 ? (
          <Card className="w-[250px] h-[150px] flex items-center justify-center border-dashed border-2 border-gray-400 text-gray-500">
            <CreateWorkspace>
              <Button variant="ghost" size="4">
                <PlusIcon /> New Workspace
              </Button>
            </CreateWorkspace>
          </Card>
        ) : (
          workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))
        )}
      </Flex>
    </main>
  );
};

export default WorkspacesPage;
