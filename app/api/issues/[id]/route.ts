import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { Params, PatchBody, PatchIssueData } from "@/app/validations";

export async function PATCH(
  request: NextRequest,
  ctx: { params: { id: string } },
) {
  // AuthN
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Params
  const parseParams = Params.safeParse(ctx.params);

  if (!parseParams.success) {
    return NextResponse.json(
      { errors: parseParams.error.flatten() },
      { status: 400 },
    );
  }

  const issueId = parseParams.data.id;

  // Read raw body first so we can block disallowed keys explicitly
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
  ctx: { params: { id: string } },
) {
  // AuthN
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Params
  const parseParams = Params.safeParse(ctx.params);

  if (!parseParams.success) {
    return NextResponse.json(
      { errors: parseParams.error.flatten() },
      { status: 400 },
    );
  }

  const issueId = parseParams.data.id;

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
