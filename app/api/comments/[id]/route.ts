import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { Params, PatchBodyComment } from "@/app/validations";

export async function DELETE(
  _req: NextRequest,
  ctx: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Params.parse(ctx.params).id;

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

  await prisma.comment.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // validate
  const id = Params.parse(ctx.params).id;
  const body = PatchBodyComment.parse(await req.json());

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

  const updated = await prisma.comment.update({
    where: { id },
    data: { content: body.content },
    include: { author: true },
  });

  return NextResponse.json(updated);
}
