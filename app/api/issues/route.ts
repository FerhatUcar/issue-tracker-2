import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { issueSchema } from "@/app/validations";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { z } from "zod";

export async function GET() {
  const uniqueUserIssues = await prisma.issue.findMany({
    select: { assignedToUserId: true },
  });

  return NextResponse.json(uniqueUserIssues);
}

type NewIssueInput = z.infer<typeof issueSchema>;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as NewIssueInput;
  const parsed = issueSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error.errors, { status: 400 });
  }

  const { assignedToUserId, workspaceId, title, description } = parsed.data;

  // Check if the user is a member of the workspace
  const isMember = await prisma.membership.findFirst({
    where: { workspaceId, userId },
    select: { id: true },
  });

  if (!isMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const newIssue = await prisma.issue.create({
    data: {
      title,
      description,
      author: { connect: { id: userId } },
      assignedToUser: assignedToUserId
        ? { connect: { id: assignedToUserId } }
        : undefined,
      workspace: { connect: { id: workspaceId } },
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
