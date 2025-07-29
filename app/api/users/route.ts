import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { User } from "next-auth";

export async function GET() {
  const users: User[] = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(users);
}
