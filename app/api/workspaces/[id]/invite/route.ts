import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { Resend } from "resend";
import { nanoid } from "nanoid";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  const body = await request.json();
  const workspaceId = params.id;

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!body.email) {
    return NextResponse.json({ error: "Email is verplicht" }, { status: 400 });
  }

  const existingInvite = await prisma.invite.findFirst({
    where: {
      workspaceId,
      email: body.email,
    },
  });

  if (existingInvite?.accepted) {
    return NextResponse.json(
      { error: "Deze gebruiker is al lid van deze workspace." },
      { status: 400 }
    );
  }

  if (existingInvite && !existingInvite.accepted) {
    return NextResponse.json(
      { error: "Deze gebruiker is al uitgenodigd maar heeft de uitnodiging nog niet geaccepteerd." },
      { status: 400 }
    );
  }

  const inviter = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!inviter) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const token = nanoid(32);

  await prisma.invite.create({
    data: {
      email: body.email,
      token,
      workspaceId,
      invitedById: inviter.id,
    },
  });

  const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/accept?token=${token}`;

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: body.email,
      subject: `${inviter.name || "Iemand"} heeft je uitgenodigd voor een Workspace in Rocket Issues!`,
      react: `
        Je bent uitgenodigd om deel te nemen aan een workspace in onze Rocket issues app.
        
        Link: ${inviteUrl}
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  } catch (error) {
    console.error("Resend error:", error);

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
