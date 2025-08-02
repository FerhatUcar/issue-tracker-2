import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import WorkspacesPage from "@/app/workspaces/page";
import { PublicHome } from "@/app/components";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <PublicHome />
    );
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      memberships: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (workspaces.length === 1) {
    return redirect(`/workspaces/${workspaces[0].id}`);
  }

  return <WorkspacesPage />;
}
