import prisma from "@/prisma/client";
import { SubscriptionStatus } from "@prisma/client";

type IsProResult = boolean;

/**
 * Checks if a user currently has an active Pro subscription.
 * Server-only: uses Prisma.
 */
export async function isPro(userId: string): Promise<IsProResult> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true },
  });

  return subscription?.status === SubscriptionStatus.ACTIVE;
}