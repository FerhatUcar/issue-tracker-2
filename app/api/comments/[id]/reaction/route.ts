import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { z } from "zod";

const Body = z.object({
  type: z.enum(["LIKE", "DISLIKE"]),
});

const extractCommentId = (req: Request, params?: { id?: string }) => {
  if (params?.id && /^\d+$/.test(params.id)) {
    return Number(params.id);
  }

  const match = new URL(req.url).pathname.match(
    /\/api\/comments\/(\d+)\/reaction$/,
  );

  if (match) {
    return Number(match[1]);
  }

  return undefined;
};

export async function PATCH(req: Request, ctx: { params?: { id?: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const commentId = extractCommentId(req, ctx.params) ?? 0;

  if (!Number.isInteger(commentId)) {
    console.error(
      "Invalid or missing commentId. URL =",
      new URL(req.url).pathname,
      "params =",
      ctx.params,
    );

    return NextResponse.json({ error: "Invalid commentId" }, { status: 400 });
  }

  const parsedBody = Body.safeParse(await req.json().catch(() => ({})));

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const userId = session.user.id;
  const type = parsedBody.data.type;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, likesCount: true, dislikesCount: true },
  });

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  try {
    const existing = await prisma.commentReaction.findUnique({
      where: { commentId_userId: { commentId, userId } },
    });

    const result = await prisma.$transaction(async (tx) => {
      let likes = comment.likesCount;
      let dislikes = comment.dislikesCount;
      let current: "NONE" | "LIKE" | "DISLIKE";

      if (!existing) {
        await tx.commentReaction.create({
          data: { commentId, userId, type },
        });

        if (type === "LIKE") {
          likes += 1;
        } else {
          dislikes += 1;
        }

        await tx.comment.update({
          where: { id: commentId },
          data: { likesCount: likes, dislikesCount: dislikes },
        });

        current = type;
      } else if (existing.type === type) {
        await tx.commentReaction.delete({
          where: { commentId_userId: { commentId, userId } },
        });

        if (type === "LIKE") likes = Math.max(0, likes - 1);
        else dislikes = Math.max(0, dislikes - 1);

        await tx.comment.update({
          where: { id: commentId },
          data: { likesCount: likes, dislikesCount: dislikes },
        });

        current = "NONE";
      } else {
        await tx.commentReaction.update({
          where: { commentId_userId: { commentId, userId } },
          data: { type },
        });

        if (type === "LIKE") {
          likes += 1;
          dislikes = Math.max(0, dislikes - 1);
        } else {
          dislikes += 1;
          likes = Math.max(0, likes - 1);
        }

        await tx.comment.update({
          where: { id: commentId },
          data: { likesCount: likes, dislikesCount: dislikes },
        });

        current = type;
      }

      return { likes, dislikes, current };
    });

    return NextResponse.json({
      likesCount: result.likes,
      dislikesCount: result.dislikes,
      myReaction: result.current,
    });
  } catch (e) {
    console.error("PATCH /api/comments/[commentId]/reaction failed:", e);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
