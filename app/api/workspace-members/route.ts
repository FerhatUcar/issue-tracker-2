import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("id");

  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace ID ontbreekt" }, { status: 400 });
  }

  const members = await prisma.membership.findMany({
    where: { workspaceId },
    select: {
      user: { select: { email: true } },
    },
  });

  const invites = await prisma.invite.findMany({
    where: { workspaceId },
    select: {
      email: true,
      accepted: true,
    },
  });

  const result = [
    ...members.map((m) => ({ email: m.user.email!, accepted: true })),
    ...invites.map((i) => ({ email: i.email, accepted: i.accepted })),
  ];

  return NextResponse.json(result);
}
