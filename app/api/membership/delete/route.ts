import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { DeleteMembershipBody } from "@/app/validations";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const requesterId = session?.user?.id;

  if (!requesterId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = DeleteMembershipBody.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { userId, workspaceId } = parsed.data;

  // Check requester is ADMIN in the workspace
  const requesterMembership = await prisma.membership.findFirst({
    where: { workspaceId, userId: requesterId, role: "ADMIN" },
    select: { id: true },
  });

  if (!requesterMembership) {
    return NextResponse.json({ message: "No admin rights" }, { status: 403 });
  }

  // Target membership must exist
  const targetMembership = await prisma.membership.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
    select: { role: true },
  });

  if (!targetMembership) {
    return NextResponse.json(
      { message: "Membership not found" },
      { status: 404 },
    );
  }

  // Prevent removing the last ADMIN in the workspace
  if (targetMembership.role === "ADMIN") {
    const adminCount = await prisma.membership.count({
      where: { workspaceId, role: "ADMIN" },
    });

    if (adminCount <= 1) {
      return NextResponse.json(
        { message: "Cannot remove the last admin of the workspace" },
        { status: 400 },
      );
    }
  }

  // Delete the membership
  await prisma.membership.delete({
    where: { userId_workspaceId: { userId, workspaceId } },
  });

  // Optionally clean up invites for the user in this workspace
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (targetUser?.email) {
    await prisma.invite.deleteMany({
      where: { email: targetUser.email, workspaceId },
    });
  }

  // 204 = No Content is correct for successful DELETE
  return new NextResponse(null, { status: 204 });
}
