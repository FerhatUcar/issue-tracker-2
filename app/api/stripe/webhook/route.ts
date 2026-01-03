import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma/client";
import { SubscriptionStatus } from "@prisma/client";
import {
  StripeSubscriptionPayload,
  StripeWebhookEvent,
  verifyStripeSignature,
} from "@/app/lib/stripe";

/**
 * Maps Stripe subscription status to internal SubscriptionStatus enum
 */
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

/**
 * Safely extracts Stripe customer id from a subscription payload
 */
const getCustomerId = (
  subscription: StripeSubscriptionPayload,
): string | null => {
  if (!subscription.customer) {
    return null;
  }

  return subscription.customer;
};

/**
 * Synchronizes a Stripe subscription with the local database
 * This is the single source of truth for subscription state
 */
const syncSubscription = async (
  subscription: StripeSubscriptionPayload,
): Promise<void> => {
  const stripeCustomerId = getCustomerId(subscription);
  const stripePriceId = subscription.items?.data?.[0]?.price?.id ?? null;
  const subscriptionStatus = mapStatus(subscription.status);

  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;

  const metadataUserId = subscription.metadata?.userId;

  /**
   * Attempt to resolve an existing subscription by Stripe identifiers
   */
  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      OR: [
        { stripeSubscriptionId: subscription.id },
        { stripeCustomerId: stripeCustomerId ?? undefined },
      ],
    },
  });

  const resolvedUserId = metadataUserId ?? existingSubscription?.userId;

  /**
   * Abort sync if no user can be resolved
   */
  if (!resolvedUserId) {
    console.warn("No userId resolved for subscription", {
      subscriptionId: subscription.id,
      stripeCustomerId,
    });
    return;
  }

  /**
   * Upsert ensures idempotency across webhook retries
   */
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

/**
 * Stripe webhook handler
 * Verifies signature and routes events to the correct handlers
 */
export async function POST(req: NextRequest) {
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Reject requests without required Stripe verification headers
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  // Validate Stripe webhook signature
  const isValid = verifyStripeSignature(rawBody, signature, webhookSecret);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as StripeWebhookEvent;

  try {
    switch (event.type) {
      // Checkout completion is only used to link user ↔ Stripe customer
      case "checkout.session.completed": {
        const session = event.data.object as {
          customer?: string;
          metadata?: { userId?: string };
        };

        const customerId = session.customer;
        const userId = session.metadata?.userId;

        if (!customerId || !userId) {
          break;
        }

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeCustomerId: customerId,
          },
          create: {
            userId,
            stripeCustomerId: customerId,
            status: SubscriptionStatus.INCOMPLETE,
          },
        });

        break;
      }

      // Successful invoice payment activates the subscription
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as {
          customer?: string;
          subscription?: string;
        };

        const customerId = invoice.customer;
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : undefined;

        if (!customerId) {
          break;
        }

        // updateMany is required because stripeCustomerId is not unique
        await prisma.subscription.updateMany({
          where: {
            stripeCustomerId: customerId,
          },
          data: {
            status: SubscriptionStatus.ACTIVE,
            stripeSubscriptionId: subscriptionId,
          },
        });

        break;
      }

      // Subscription lifecycle events are the authoritative source
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
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

/**
 * Disable caching for Stripe webhooks
 */
export const dynamic = "force-dynamic";
