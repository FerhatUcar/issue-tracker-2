import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { Params, PatchBodyComment } from "@/app/validations";

async function getAuthorizedCommentId(context: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const parsed = Params.safeParse({ id });
  if (!parsed.success) {
    return {
      error: NextResponse.json(
        { errors: parsed.error.flatten() },
        { status: 400 },
      ),
    };
  }

  return { id: parsed.data.id, userId };
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthorizedCommentId(context);

  if ("error" in auth) {
    return auth.error;
  }

  const { id, userId } = auth;

  const bodyResult = PatchBodyComment.safeParse(await request.json());
  if (!bodyResult.success) {
    return NextResponse.json(
      { errors: bodyResult.error.flatten() },
      { status: 400 },
    );
  }

  const { content } = bodyResult.data;

  // ownership
  const existing = await prisma.comment.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.comment.update({
    where: { id },
    data: { content },
    include: { author: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthorizedCommentId(context);

  if ("error" in auth) {
    return auth.error;
  }

  const { id, userId } = auth;

  // ownership (of admin‑check, whatever your rules are)
  const existing = await prisma.comment.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.comment.delete({ where: { id } });

  return NextResponse.json({ success: true });
}