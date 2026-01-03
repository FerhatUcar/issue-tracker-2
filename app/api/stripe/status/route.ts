import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { SubscriptionStatus } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ isPro: false });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: { status: true },
  });

  return NextResponse.json({
    isPro: subscription?.status === SubscriptionStatus.ACTIVE,
  });
}