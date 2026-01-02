import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma/client";
import { SubscriptionStatus } from "@prisma/client";
import {
  StripeSubscriptionPayload,
  StripeWebhookEvent,
  retrieveSubscription,
  verifyStripeSignature,
} from "@/app/lib/stripe";

const mapStatus = (status: string): SubscriptionStatus => {
  const lookup: Record<string, SubscriptionStatus> = {
    active: SubscriptionStatus.ACTIVE,
    trialing: SubscriptionStatus.TRIALING,
    incomplete: SubscriptionStatus.INCOMPLETE,
    incomplete_expired: SubscriptionStatus.INCOMPLETE_EXPIRED,
    past_due: SubscriptionStatus.PAST_DUE,
    canceled: SubscriptionStatus.CANCELED,
    unpaid: SubscriptionStatus.UNPAID,
    paused: SubscriptionStatus.CANCELED,
  };

  return lookup[status] ?? SubscriptionStatus.INCOMPLETE;
};

const getCustomerId = (subscription: StripeSubscriptionPayload) =>
  subscription.customer ?? null;

const syncSubscription = async (subscription: StripeSubscriptionPayload) => {
  const stripeCustomerId = getCustomerId(subscription);
  const stripePriceId = subscription.items?.data?.[0]?.price?.id ?? null;
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;
  const subscriptionStatus = mapStatus(subscription.status);
  const userId = subscription.metadata?.userId;

  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      OR: [
        { stripeSubscriptionId: subscription.id },
        { stripeCustomerId: stripeCustomerId ?? undefined },
      ],
    },
  });

  const resolvedUserId = userId ?? existingSubscription?.userId;

  if (!resolvedUserId) return;

  await prisma.subscription.upsert({
    where: { userId: resolvedUserId },
    update: {
      status: subscriptionStatus,
      stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId,
      currentPeriodEnd,
    },
    create: {
      userId: resolvedUserId,
      status: subscriptionStatus,
      stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId,
      currentPeriodEnd,
    },
  });
};

export async function POST(req: NextRequest) {
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  const isValid = verifyStripeSignature(rawBody, signature, webhookSecret);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as StripeWebhookEvent;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as { subscription?: unknown };
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : null;

        if (subscriptionId) {
          const subscription = await retrieveSubscription(subscriptionId);
          await syncSubscription(subscription);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.created": {
        const subscription = event.data.object as StripeSubscriptionPayload;
        await syncSubscription(subscription);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler failed", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
