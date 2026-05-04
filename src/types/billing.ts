// src/types/billing.ts
// Billing types — Stripe-only. The Paddle SDK + types were ripped out
// as part of the 2026-05-03 billing migration; if you need Stripe API
// shapes, import them directly from `stripe`.

export type PlanId = "free" | "pro";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "paused"
  | "past_due"
  | "trialing";

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  plan: PlanId;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

// Database row shape (snake_case from Supabase)
export interface SubscriptionRow {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  plan: PlanId;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

/** Convert a DB row to the client-facing Subscription shape */
export function rowToSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    stripeSubscriptionId: row.stripe_subscription_id,
    stripeCustomerId: row.stripe_customer_id,
    plan: row.plan,
    status: row.status,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: row.cancel_at_period_end,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
