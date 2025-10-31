import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { ParamsIssue, PatchBody, PatchIssueData } from "@/app/validations";

async function getAuthorizedIssueId(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = ParamsIssue.safeParse({ id });
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  return parsed.data.id;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const issueIdOrResponse = await getAuthorizedIssueId(context);
  if (issueIdOrResponse instanceof NextResponse) return issueIdOrResponse;
  const issueId = issueIdOrResponse;

  const raw: unknown = await request.json();

  // Hard block: workspaceId must not be patchable
  if (Object.prototype.hasOwnProperty.call(raw, "workspaceId")) {
    return NextResponse.json(
      { error: "workspaceId cannot be updated via PATCH" },
      { status: 400 },
    );
  }

  // Validate allowed fields only
  const parseBody = PatchBody.safeParse(raw);

  if (!parseBody.success) {
    return NextResponse.json(
      { errors: parseBody.error.flatten() },
      { status: 400 },
    );
  }

  const body: PatchIssueData = parseBody.data;

  // Ensure the issue exists (authorization/membership checks can go here)
  const existing = await prisma.issue.findUnique({
    where: { id: issueId },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  // If assignedToUserId is provided (and not null), ensure the user exists
  if (
    Object.prototype.hasOwnProperty.call(body, "assignedToUserId") &&
    body.assignedToUserId
  ) {
    const user = await prisma.user.findUnique({
      where: { id: body.assignedToUserId },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "Invalid assignee" }, { status: 400 });
    }
  }

  // Build update payload; Prisma ignores undefined, null unassigns
  const updated = await prisma.issue.update({
    where: { id: issueId },
    data: {
      title: body.title,
      description: body.description,
      status: body.status,
      assignedToUserId: body.assignedToUserId ?? undefined,
    },
  });

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const issueIdOrResponse = await getAuthorizedIssueId(context);
  if (issueIdOrResponse instanceof NextResponse) return issueIdOrResponse;
  const issueId = issueIdOrResponse;

  // Ensure the issue exists
  const existing = await prisma.issue.findUnique({
    where: { id: issueId },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  await prisma.issue.delete({ where: { id: issueId } });

  return new NextResponse(null, { status: 204 });
}
