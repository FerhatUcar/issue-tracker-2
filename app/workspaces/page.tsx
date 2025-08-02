import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, Flex, Heading, Text, Button } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { CreateWorkspace } from "@/app/workspaces/_components/CreateWorkspace";

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
    include: { workspace: true },
  });

  const workspaces = memberships.map((m) => m.workspace);

  return (
    <main className="p-6">
      <Flex justify="between" align="center" mb="4">
        <Heading as="h1" size="6">Jouw Workspaces</Heading>
        <CreateWorkspace>
          <Button variant="soft">
            <PlusIcon /> Nieuwe Workspace
          </Button>
        </CreateWorkspace>
      </Flex>

      <Flex gap="4" wrap="wrap">
        {workspaces.length === 0 ? (
          <Card className="w-[250px] h-[150px] flex items-center justify-center border-dashed border-2 border-gray-400 text-gray-500">
            <CreateWorkspace>
              <Button variant="ghost" size="4">
                <PlusIcon /> Nieuwe Workspace
              </Button>
            </CreateWorkspace>
          </Card>
        ) : (
          workspaces.map((workspace) => (
            <Link key={workspace.id} href={`/workspaces/${workspace.id}`}>
              <Card className="w-[250px] h-[150px] hover:shadow-md transition-shadow p-4">
                <Heading size="4">{workspace.name}</Heading>
                <Text size="2" color="gray">
                  ID: {workspace.name}
                </Text>
              </Card>
            </Link>
          ))
        )}
      </Flex>
    </main>
  );
};

export default WorkspacesPage;
