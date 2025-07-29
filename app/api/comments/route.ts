import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { content, issueId } = await request.json();

  const comment = await prisma.comment.create({
    data: {
      content,
      issueId,
      authorId: session.user?.name
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
