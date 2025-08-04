import { NextResponse } from "next/server";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";
import slugify from "slugify";
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

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = (await req.json()) as Workspace;

  if (!name) {
    return NextResponse.json({ error: "Name is mandatory" }, { status: 400 });
  }

  const existingWorkspace = await prisma.workspace.findFirst({
    where: { name },
  });

  if (existingWorkspace) {
    return NextResponse.json(
      { error: "Workspace already exists" },
      { status: 400 },
    );
  }

  const slug = slugify(name, { lower: true, strict: true });

  try {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        memberships: {
          create: {
            user: {
              connect: { email: session.user.email },
            },
            role: "ADMIN",
          },
        },
      },
    });

    return NextResponse.json(workspace);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
