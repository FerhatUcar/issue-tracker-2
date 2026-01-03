import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { isSubscriptionActive } from "@/app/helpers";
import { FREE_WORKSPACE_LIMIT } from "@/app/constants/billing";
import {
  createCheckoutSession,
  createStripeCustomer,
} from "@/app/lib/stripe";

const missingEnvVars = () =>
  !process.env.STRIPE_SECRET_KEY ||
  !process.env.STRIPE_PRICE_ID ||
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

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const subscription = user.Subscription;

  if (isSubscriptionActive(subscription?.status)) {
    return NextResponse.json(
      { error: "You already have an active subscription." },
      { status: 400 },
    );
  }

  const existingWorkspaceCount = await prisma.workspace.count({
    where: { ownerId: user.id },
  });

  const shouldHighlightLimit = existingWorkspaceCount >= FREE_WORKSPACE_LIMIT;

  try {
    const price = process.env.STRIPE_PRICE_ID as string;
    const customerId = subscription?.stripeCustomerId
      ? subscription.stripeCustomerId
      : (
          await createStripeCustomer({
            email: user.email,
            name: user.name,
            userId: user.id,
          })
        ).id;

    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: { stripeCustomerId: customerId },
      create: { userId: user.id, stripeCustomerId: customerId },
    });

    const checkoutSession = await createCheckoutSession({
      customer: customerId,
      priceId: price,
      userId: user.id,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings?billing=success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings?billing=cancelled`,
    });

    return NextResponse.json(
      {
        url: checkoutSession.url,
        limitedByPlan: shouldHighlightLimit,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Stripe checkout creation failed", error);
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 500 },
    );
  }
}
