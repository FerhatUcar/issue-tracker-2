import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { Resend } from "resend";
import { nanoid } from "nanoid";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const body = await request.json();
  const workspaceId = params.id;

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      subject: `${inviter.name || "Iemand"} heeft je uitgenodigd voor een workspace in rocket issues!`,
      react: `
        <p>Hoi 👋,</p>
        <p>Je bent uitgenodigd om deel te nemen aan een workspace in onze Rocket issues app.</p>
        <p>
          <a href="${inviteUrl}" style="display:inline-block;background-color:#4F46E5;color:white;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">
            Accepteer uitnodiging
          </a>
        </p>
        <p>Of open deze link: <br /><a href="${inviteUrl}">${inviteUrl}</a></p>
        <hr />
        <small>Als je dit niet herkent, kun je deze e-mail negeren.</small>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
