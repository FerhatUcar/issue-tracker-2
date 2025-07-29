import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  const deleted = await prisma.comment.delete({ where: { id } });

  return NextResponse.json(deleted);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { content } = await req.json();

  const updated = await prisma.comment.update({
    where: { id: parseInt(params.id) },
    data: { content },
    include: { author: true },
  });

  return NextResponse.json(updated);
}


