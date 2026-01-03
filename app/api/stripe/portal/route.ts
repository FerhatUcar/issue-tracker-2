import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { createBillingPortalSession } from "@/app/lib/stripe";

const missingEnvVars = () =>
  !process.env.STRIPE_SECRET_KEY ||
  !process.env.NEXT_PUBLIC_APP_URL;

export async function POST() {
  if (missingEnvVars()) {
    return NextResponse.json(
      { error: "Stripe is not configured on the server." },
      { status: 500 },
    );
  }

  const session = await getServerSession(authOptions);
  const requesterEmail = session?.user?.email;

  if (!requesterEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: requesterEmail },
    include: { Subscription: true },
  });

  const customerId = user?.Subscription?.stripeCustomerId;

  if (!customerId) {
    return NextResponse.json(
      { error: "No subscription found for this account." },
      { status: 404 },
    );
  }

  try {
    const portalSession = await createBillingPortalSession({
      customer: customerId,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return NextResponse.json({ url: portalSession.url }, { status: 200 });
  } catch (error) {
    console.error("Stripe portal creation failed", error);
    return NextResponse.json(
      { error: "Unable to open stripe portal." },
      { status: 500 },
    );
  }
}
