import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";
import { Navbar } from "@/app/components/Navbar/Navbar";
import authOptions from "@/app/auth/authOptions";

export default async function NavbarWrapper() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <Navbar data={{ userId: "", count: 0 }} />;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return <Navbar data={{ userId: "", count: 0 }} />;
  }

  const count = await prisma.issue.count({
    where: {
      assignedToUserId: user.id,
      status: "OPEN",
    },
  });

  return <Navbar data={{ userId: user.id, count }} />;
}
