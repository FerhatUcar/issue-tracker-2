import prisma from "@/prisma/client";
import { Navbar } from "@/app/components/Navbar/Navbar";

export default async function NavbarWrapper() {
  const users = await prisma.user.findMany({ select: { id: true } });
  const userId = users?.[0]?.id ?? "";
  const count = await prisma.issue.count({
    where: {
      assignedToUserId: userId,
      NOT: { status: "CLOSED" },
    },
  });

  return <Navbar data={{ userId, count }} />;
}
