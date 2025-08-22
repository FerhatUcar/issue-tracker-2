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

  // Body
  const parseBody = PatchBody.safeParse(await request.json());
  if (!parseBody.success) {
    return NextResponse.json(
      { errors: parseBody.error.flatten() },
      { status: 400 },
    );
  }
  const body: PatchIssueData = parseBody.data;

  // Ensure the issue exists (and optionally check workspace membership/authorization here)
  const existing = await prisma.issue.findUnique({
    where: { id: issueId },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  // If assignedToUserId provided (and not null), it must exist
  if (
    Object.prototype.hasOwnProperty.call(body, "assignedToUserId") &&
    body.assignedToUserId
  ) {
    const user = await prisma.user.findUnique({
      where: { id: body.assignedToUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid assignee" }, { status: 400 });
    }
  }

  // Build update payload; Prisma ignores undefined and applies null to unassign
  const updated = await prisma.issue.update({
    where: { id: issueId },
    data: {
      title: body.title,
      description: body.description,
      status: body.status,
      assignedToUserId: body.assignedToUserId ?? undefined, // allow null to unassign, undefined = don't touch
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

  // Ensure the issue exists (and optionally check workspace membership/authorization here)
  const existing = await prisma.issue.findUnique({
    where: { id: issueId },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  // Delete it; rely on DB constraints/cascade for related rows if configured
  await prisma.issue.delete({ where: { id: issueId } });

  // 204 = No Content is the correct semantic response for a successful delete
  return new NextResponse(null, { status: 204 });
}
