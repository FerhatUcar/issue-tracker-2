import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { issueSchema } from "@/app/validations";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function GET() {
  const uniqueUserIssues = await prisma.issue.findMany({
    select: { assignedToUserId: true },
  });

  return NextResponse.json(uniqueUserIssues);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Auth check
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate body
  const parsed = issueSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { title, description, workspaceId, assignedToUserId } = parsed.data;

  // Optional: assert that session.user.id itself is a UUID if your DB expects @db.Uuid
  // If your User.id is @db.Uuid, uncomment:
  // if (!/^[0-9a-fA-F-]{36}$/.test(userId)) {
  //   return NextResponse.json({ error: "Session user id is not a UUID" }, { status: 400 });
  // }

  // Ensure the current user is a member of the workspace
  const membership = await prisma.membership.findFirst({
    where: { workspaceId, userId },
    select: { id: true },
  });

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // If assignedToUserId provided (and not null), ensure that user exists and is a member too (optional but smart)
  if (assignedToUserId) {
    const assignee = await prisma.user.findUnique({
      where: { id: assignedToUserId },
      select: { id: true },
    });

    if (!assignee) {
      return NextResponse.json(
        { error: "Assignee not found" },
        { status: 400 },
      );
    }

    // Optional: require assignee to be member of the same workspace
    const assigneeMember = await prisma.membership.findFirst({
      where: { workspaceId, userId: assignedToUserId },
      select: { id: true },
    });

    if (!assigneeMember) {
      return NextResponse.json(
        { error: "Assignee not in workspace" },
        { status: 400 },
      );
    }
  }

  // Create the issue
  const newIssue = await prisma.issue.create({
    data: {
      title,
      description,
      workspace: { connect: { id: workspaceId } },
      author: { connect: { id: userId } },
      ...(assignedToUserId
        ? { assignedToUser: { connect: { id: assignedToUserId } } }
        : {}),
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      workspaceId: true,
      assignedToUserId: true,
      authorId: true,
      author: { select: { id: true, name: true, image: true } },
      assignedToUser: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(newIssue, { status: 201 });
}
