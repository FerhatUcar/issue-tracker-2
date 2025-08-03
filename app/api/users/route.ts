import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("id");

  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace ID ontbreekt" }, { status: 400 });
  }

  const users = await prisma.user.findMany({
    where: {
      Membership: {
        some: {
          workspaceId,
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(users);
}
