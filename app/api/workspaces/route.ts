import { NextResponse } from "next/server";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";
import { Workspace } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Workspace ID ontbreekt" },
      { status: 400 },
    );
  }

  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: {
        issues: true,
        memberships: true,
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(workspace);
  } catch (error) {
    console.error("Error retrieving workspaces:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Workspace;
  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json({ error: "Name is mandatory" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.workspace.findFirst({
    where: { name, ownerId: user.id },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Workspace already exists" },
      { status: 400 },
    );
  }

  try {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        ownerId: user.id,
        memberships: {
          create: {
            userId: user.id,
            role: "ADMIN",
          },
        },
      },
    });

    return NextResponse.json(workspace);
  } catch (err) {
    console.error("Workspace creation failed:", err);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
