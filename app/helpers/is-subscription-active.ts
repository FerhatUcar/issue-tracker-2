import { SubscriptionStatus } from "@prisma/client";

const ACTIVE_STATUSES: SubscriptionStatus[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
  SubscriptionStatus.PAST_DUE,
];

export const isSubscriptionActive = (
  status: SubscriptionStatus | null | undefined,
) => {
  if (!status) return false;
  return ACTIVE_STATUSES.includes(status);
};
