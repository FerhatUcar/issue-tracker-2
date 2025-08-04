import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { Membership } from ".prisma/client";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Membership;

  const { userId, workspaceId } = body;

  if (!userId || !workspaceId) {
    return NextResponse.json(
      { message: "Missing parameters" },
      { status: 400 },
    );
  }

  const membership = await prisma.membership.findFirst({
    where: {
      user: { email: session.user.email },
      workspaceId,
      role: "ADMIN",
    },
  });

  if (!membership) {
    return NextResponse.json({ message: "No admin rights" }, { status: 403 });
  }

  await prisma.membership.delete({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });

  // Making sure the user is also deleted from the invite table
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!targetUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (!targetUser?.email) {
    return NextResponse.json({ message: "User has no email" }, { status: 400 });
  }

  await prisma.invite.deleteMany({
    where: {
      email: targetUser.email,
      workspaceId,
    },
  });

  return NextResponse.json({ success: true });
}
