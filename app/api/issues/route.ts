import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { issueSchema } from "@/app/validationSchema";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { Issue } from "@prisma/client";

export async function GET() {
  const uniqueUserIssues = await prisma.issue.findMany({
    select: { assignedToUserId: true },
  });

  return NextResponse.json(uniqueUserIssues);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  const body = (await request.json()) as Issue;
  const validation = issueSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { assignedToUserId, workspaceId, title, description } = body;

  const newIssue = await prisma.issue.create({
    data: {
      title,
      description,
      assignedToUser: assignedToUserId
        ? { connect: { id: assignedToUserId } }
        : undefined,
      Workspace: {
        connect: { id: workspaceId ?? "" },
      },
    },
  });

  return NextResponse.json(newIssue, { status: 201 });
}
