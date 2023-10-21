import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { User } from "next-auth";

export async function GET(request: NextRequest) {
  const users: User[] = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(users);
}
