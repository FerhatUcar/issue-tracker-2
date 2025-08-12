import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { Comment } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { content, issueId } = (await request.json()) as Comment;

  const comment = await prisma.comment.create({
    data: {
      content,
      issueId,
      authorId: session.user?.id,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const issueId = searchParams.get("id");

  if (!issueId) {
    return NextResponse.json({ error: "Missing issueId" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { issueId: parseInt(issueId) },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments);
}
