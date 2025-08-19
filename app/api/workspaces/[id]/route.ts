import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: { memberships: true },
  });

  const isAdmin = workspace?.memberships.some(
    (member) => member.userId === session.user.id && member.role === "ADMIN",
  );

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.invite.deleteMany({ where: { workspaceId: params.id } });
    await prisma.issue.deleteMany({ where: { workspaceId: params.id } });
    await prisma.membership.deleteMany({ where: { workspaceId: params.id } });
    await prisma.workspace.delete({ where: { id: params.id } });

    revalidatePath("/workspaces");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete workspace" },
      { status: 500 },
    );
  }
}
