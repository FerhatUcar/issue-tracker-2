import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { Resend } from "resend";
import { nanoid } from "nanoid";
import { InviteBody, WorkspaceParams } from "@/app/validations";

const resend = new Resend(process.env.RESEND_API_KEY);

type Params = Promise<{ id: string }>;

export async function POST(
  request: NextRequest,
  { params }: { params: Params },
) {
  // AuthN
  const session = await getServerSession(authOptions);
  const requester = session?.user;

  if (!requester?.id || !requester.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paramsParsed = WorkspaceParams.safeParse(params);

  if (!paramsParsed.success) {
    return NextResponse.json(
      { errors: paramsParsed.error.flatten() },
      { status: 400 },
    );
  }

  const workspaceId = paramsParsed.data.id;

  const bodyParsed = InviteBody.safeParse(await request.json());

  if (!bodyParsed.success) {
    return NextResponse.json(
      { errors: bodyParsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email } = bodyParsed.data;

  // Prevent self-invite
  if (email.toLowerCase() === requester.email.toLowerCase()) {
    return NextResponse.json(
      { error: "You cannot invite yourself" },
      { status: 400 },
    );
  }

  // Authorization: requester must be ADMIN of the workspace
  const requesterMembership = await prisma.membership.findFirst({
    where: { workspaceId, userId: requester.id, role: "ADMIN" },
    select: { id: true },
  });

  if (!requesterMembership) {
    return NextResponse.json({ error: "No admin rights" }, { status: 403 });
  }

  // If a user already exists and is already a member, block
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });

  if (existingUser) {
    const isAlreadyMember = await prisma.membership.findUnique({
      where: { userId_workspaceId: { userId: existingUser.id, workspaceId } },
      select: { userId: true },
    });

    if (isAlreadyMember) {
      return NextResponse.json(
        { error: "This user is already a member of this workspace" },
        { status: 400 },
      );
    }
  }

  // Existing invite checks
  const existingInvite = await prisma.invite.findFirst({
    where: { workspaceId, email: email.toLowerCase() },
    select: { accepted: true },
  });

  if (existingInvite?.accepted) {
    return NextResponse.json(
      { error: "This user is already a member of this workspace" },
      { status: 400 },
    );
  }

  if (existingInvite && !existingInvite.accepted) {
    return NextResponse.json(
      { error: "This user has already been invited and has not accepted yet" },
      { status: 400 },
    );
  }

  // Create invite
  const token = nanoid(32);
  await prisma.invite.create({
    data: {
      email: email.toLowerCase(),
      token,
      workspaceId,
      invitedById: requester.id,
    },
  });

  // Compose invite email
  const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/accept?token=${token}`;

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: `${requester.name || "Someone"} invited you to a workspace in Rocket Issues`,
      text: [
        `You've been invited to join a workspace in Rocket Issues.`,
        ``,
        `Open this link to accept: ${inviteUrl}`,
        ``,
        `If you didn't expect this, you can ignore the email.`,
      ].join("\n"),
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }
  } catch (err) {
    // Resend threw before returning structured { error }
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
