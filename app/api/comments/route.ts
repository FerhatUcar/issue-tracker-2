import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { PostCommentBody, QueryIssueId } from "@/app/validations";
import { CommentDTO, Reaction } from "@/app/types/reactions";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // validate body
  const parsed = PostCommentBody.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { content, issueId } = parsed.data;

  // check if the user is a member of the workspace
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    select: { id: true },
  });

  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      issueId,
      authorId: userId,
      likesCount: 0,
      dislikesCount: 0,
    },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  const response: CommentDTO = {
    id: comment.id,
    content: comment.content,
    issueId: comment.issueId,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    likesCount: comment.likesCount,
    dislikesCount: comment.dislikesCount,
    author: comment.author,
    myReaction: "NONE",
  };

  return NextResponse.json(response, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get("id") ?? "";

  const parseQuery = QueryIssueId.safeParse({ id: idParam });

  if (!parseQuery.success) {
    return NextResponse.json(
      { errors: parseQuery.error.flatten() },
      { status: 400 },
    );
  }

  const issueId = parseQuery.data.id;

  const comments = await prisma.comment.findMany({
    where: { issueId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      issueId: true,
      createdAt: true,
      updatedAt: true,
      likesCount: true,
      dislikesCount: true,
      author: { select: { id: true, name: true, email: true, image: true } },
      reactions: userId
        ? { where: { userId }, select: { type: true }, take: 1 }
        : false,
    },
  });

  const shaped: CommentDTO[] = comments.map((c) => {
    const t = Array.isArray(c.reactions) ? c.reactions[0]?.type : undefined;
    const myReaction: Reaction = t === "LIKE" || t === "DISLIKE" ? t : "NONE";
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
