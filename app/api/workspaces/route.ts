import { NextResponse } from "next/server";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { CreateWorkspaceBody, GetWorkspaceQuery } from "@/app/validations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const parsed = GetWorkspaceQuery.safeParse({
    id: searchParams.get("id") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id } = parsed.data;

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

    return NextResponse.json(workspace, { status: 200 });
  } catch (error) {
    console.error("Error retrieving workspace:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const requesterEmail = session?.user?.email;

  if (!requesterEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = CreateWorkspaceBody.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email: requesterEmail },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Enforce a unique workspace name per owner
  const existing = await prisma.workspace.findFirst({
    where: { name, ownerId: user.id },
    select: { id: true },
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

    revalidatePath("/workspaces");

    return NextResponse.json(workspace, { status: 201 });
  } catch (err) {
    console.error("Workspace creation failed:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
