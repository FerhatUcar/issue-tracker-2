import crypto from "crypto";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

const getStripeKey = () => process.env.STRIPE_SECRET_KEY ?? "";

const stripeRequest = async (
  path: string,
  body?: URLSearchParams,
  method: "POST" | "GET" = "POST",
) => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${getStripeKey()}`,
  };

  const init: RequestInit = { method, headers };

  if (body && method === "POST") {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    init.body = body.toString();
  }

  const response = await fetch(`${STRIPE_API_BASE}${path}`, init);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Stripe request failed: ${error}`);
  }

  return response.json();
};

export type StripeSubscriptionPayload = {
  id: string;
  status: string;
  current_period_end?: number;
  items?: { data?: { price?: { id?: string } }[] };
  customer?: string;
  metadata?: Record<string, string>;
};

export const createStripeCustomer = async (params: {
  email?: string | null;
  name?: string | null;
  userId: string;
}) => {
  const body = new URLSearchParams();

  if (params.email) body.append("email", params.email);
  if (params.name) body.append("name", params.name);
  body.append("metadata[userId]", params.userId);

  return stripeRequest("/customers", body);
};

export const createCheckoutSession = async (params: {
  customer: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  userId: string;
}) => {
  const body = new URLSearchParams();
  body.append("mode", "subscription");
  body.append("customer", params.customer);
  body.append("line_items[0][price]", params.priceId);
  body.append("line_items[0][quantity]", "1");
  body.append("success_url", params.successUrl);
  body.append("cancel_url", params.cancelUrl);
  body.append("metadata[userId]", params.userId);
  body.append("subscription_data[metadata][userId]", params.userId);

  return stripeRequest("/checkout/sessions", body);
};

export const createBillingPortalSession = async (params: {
  customer: string;
  returnUrl: string;
}) => {
  const body = new URLSearchParams();
  body.append("customer", params.customer);
  body.append("return_url", params.returnUrl);

  return stripeRequest("/billing_portal/sessions", body);
};

export const retrieveSubscription = async (subscriptionId: string) =>
  stripeRequest(`/subscriptions/${subscriptionId}`, undefined, "GET") as Promise<StripeSubscriptionPayload>;

export type StripeWebhookEvent = {
  type: string;
  data: { object: Record<string, unknown> };
};

export const verifyStripeSignature = (
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string,
) => {
  const parts = signatureHeader.split(",");
  const timestampPart = parts.find((part) => part.startsWith("t="));
  const signaturePart = parts.find((part) => part.startsWith("v1="));

  if (!timestampPart || !signaturePart) return false;

  const timestamp = timestampPart.replace("t=", "");
  const signature = signaturePart.replace("v1=", "");

  const signedPayload = `${timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "utf8");
  const received = Buffer.from(signature, "utf8");

  if (expected.length !== received.length) return false;

  return crypto.timingSafeEqual(expected, received);
};
