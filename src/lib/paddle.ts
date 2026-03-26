// src/lib/paddle.ts
// Server-side Paddle helpers.
// Env vars: PADDLE_API_KEY, PADDLE_WEBHOOK_SECRET, NEXT_PUBLIC_PADDLE_ENVIRONMENT
import crypto from "crypto";

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || "";
const PADDLE_API_KEY = process.env.PADDLE_API_KEY || "";
const PADDLE_ENV = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox";

const PADDLE_API_BASE =
  PADDLE_ENV === "production"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------

/**
 * Verify Paddle webhook signature.
 * Paddle sends: Paddle-Signature header with ts=TIMESTAMP;h1=HASH
 */
export function verifyPaddleWebhook(
  rawBody: string,
  signatureHeader: string
): boolean {
  if (!PADDLE_WEBHOOK_SECRET || !signatureHeader) return false;

  try {
    const parts: Record<string, string> = {};
    signatureHeader.split(";").forEach((part) => {
      const [key, value] = part.split("=");
      if (key && value) parts[key.trim()] = value.trim();
    });

    const ts = parts["ts"];
    const h1 = parts["h1"];
    if (!ts || !h1) return false;

    // Check timestamp is within 5 minutes
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(ts, 10)) > 300) return false;

    // Compute HMAC
    const signedPayload = `${ts}:${rawBody}`;
    const computed = crypto
      .createHmac("sha256", PADDLE_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest("hex");

    // Constant-time comparison
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(h1));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Paddle API v2 helpers
// ---------------------------------------------------------------------------

async function paddleAPI<T = Record<string, unknown>>(
  method: string,
  path: string,
  body?: Record<string, unknown>
): Promise<{ data: T | null; error: string | null }> {
  if (!PADDLE_API_KEY) {
    return { data: null, error: "PADDLE_API_KEY is not configured" };
  }

  try {
    const res = await fetch(`${PADDLE_API_BASE}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${PADDLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const json = await res.json();

    if (!res.ok) {
      const errMsg =
        json?.error?.detail || json?.error?.type || `Paddle API ${res.status}`;
      console.error("[Paddle API]", method, path, res.status, errMsg);
      return { data: null, error: errMsg };
    }

    return { data: json.data as T, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[Paddle API] Network error:", msg);
    return { data: null, error: msg };
  }
}

/**
 * Create a Paddle transaction (checkout session) for a given price.
 * The transaction ID is used client-side to open the overlay checkout.
 */
export async function createCheckoutTransaction(opts: {
  priceId: string;
  userId: string;
  userEmail?: string;
  plan: string;
}): Promise<{ transactionId?: string; checkoutUrl?: string; error?: string }> {
  const { data, error } = await paddleAPI<{
    id: string;
    checkout: { url: string } | null;
  }>("POST", "/transactions", {
    items: [{ price_id: opts.priceId, quantity: 1 }],
    custom_data: { userId: opts.userId, plan: opts.plan },
    ...(opts.userEmail
      ? { customer: { email: opts.userEmail } }
      : {}),
  });

  if (error || !data) {
    return { error: error || "Failed to create transaction" };
  }

  return {
    transactionId: data.id,
    checkoutUrl: data.checkout?.url || undefined,
  };
}

/**
 * Get a Paddle subscription by its ID.
 */
export async function getSubscription(subscriptionId: string) {
  return paddleAPI<{
    id: string;
    status: string;
    customer_id: string;
    current_billing_period: { starts_at: string; ends_at: string } | null;
    scheduled_change: { action: string; effective_at: string } | null;
    management_urls: { update_payment_method: string; cancel: string } | null;
    custom_data: Record<string, string> | null;
  }>("GET", `/subscriptions/${subscriptionId}`);
}

/**
 * Cancel a Paddle subscription at end of billing period.
 */
export async function cancelSubscription(subscriptionId: string) {
  return paddleAPI("POST", `/subscriptions/${subscriptionId}/cancel`, {
    effective_from: "next_billing_period",
  });
}

/**
 * Pause a Paddle subscription at end of billing period.
 */
export async function pauseSubscription(subscriptionId: string) {
  return paddleAPI("POST", `/subscriptions/${subscriptionId}/pause`, {
    effective_from: "next_billing_period",
  });
}

/**
 * Resume a paused Paddle subscription.
 */
export async function resumeSubscription(subscriptionId: string) {
  return paddleAPI("POST", `/subscriptions/${subscriptionId}/resume`, {
    effective_from: "immediately",
  });
}
