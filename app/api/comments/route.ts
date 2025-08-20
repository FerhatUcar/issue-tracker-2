import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { content, issueId } = (await request.json()) as {
    content: string;
    issueId: number;
  };

  const comment = await prisma.comment.create({
    data: {
      content,
      issueId,
      authorId: session.user.id,
      likesCount: 0,
      dislikesCount: 0,
    },
    include: { author: true },
  });

  return NextResponse.json(
    {
      id: comment.id,
      content: comment.content,
      issueId: comment.issueId,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      author: comment.author,
      myReaction: "NONE" as const,
    },
    { status: 201 },
  );
}

type MyReaction = "NONE" | "LIKE" | "DISLIKE";

type CommentDTO = {
  id: number;
  content: string;
  issueId: number;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  dislikesCount: number;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  myReaction: MyReaction;
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  const { searchParams } = new URL(req.url);
  const issueId = searchParams.get("id");
  if (!issueId)
    return NextResponse.json({ error: "Missing issueId" }, { status: 400 });

  const comments = await prisma.comment.findMany({
    where: { issueId: parseInt(issueId, 10) },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      issueId: true,
      createdAt: true,
      updatedAt: true,
      likesCount: true,
      dislikesCount: true,
      author: {
        select: { id: true, name: true, email: true, image: true },
      },
      reactions: userId
        ? { where: { userId }, select: { type: true }, take: 1 }
        : false,
    },
  });

  const shaped: CommentDTO[] = comments.map((c) => {
    const t = Array.isArray(c.reactions) ? c.reactions[0]?.type : undefined;
    const myReaction: MyReaction = t === "LIKE" || t === "DISLIKE" ? t : "NONE";

    return {
      id: c.id,
      content: c.content,
      issueId: c.issueId,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      likesCount: c.likesCount,
      dislikesCount: c.dislikesCount,
      author: c.author,
      myReaction,
    };
  });

  return NextResponse.json(shaped);
}
