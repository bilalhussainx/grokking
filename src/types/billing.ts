// src/types/billing.ts
// Environment variables required:
//   PADDLE_API_KEY              — Paddle API key (server-side)
//   PADDLE_WEBHOOK_SECRET       — Webhook signature verification
//   NEXT_PUBLIC_PADDLE_CLIENT_TOKEN  — Client-side token
//   NEXT_PUBLIC_PADDLE_ENVIRONMENT   — 'sandbox' or 'production'

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
  paddleSubscriptionId: string | null;
  paddleCustomerId: string | null;
  plan: PlanId;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaddleWebhookEvent {
  event_type: string;
  event_id: string;
  occurred_at: string;
  notification_id: string;
  data: Record<string, unknown>;
}

export interface CheckoutRequest {
  planId: PlanId;
  userId: string;
}

export interface CheckoutResponse {
  transactionId?: string;
  checkoutUrl?: string;
  error?: string;
}

export interface SubscriptionAction {
  action: "cancel" | "pause" | "resume";
}

// Paddle API v2 response types (subset)
export interface PaddleSubscription {
  id: string;
  status: string;
  customer_id: string;
  current_billing_period: {
    starts_at: string;
    ends_at: string;
  } | null;
  scheduled_change: {
    action: string;
    effective_at: string;
  } | null;
  custom_data: Record<string, string> | null;
}

export interface PaddleTransaction {
  id: string;
  subscription_id: string | null;
  customer_id: string;
  status: string;
  checkout: {
    url: string;
  } | null;
}

// Database row shape (snake_case from Supabase)
export interface SubscriptionRow {
  id: string;
  user_id: string;
  paddle_subscription_id: string | null;
  paddle_customer_id: string | null;
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
    paddleSubscriptionId: row.paddle_subscription_id,
    paddleCustomerId: row.paddle_customer_id,
    plan: row.plan,
    status: row.status,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: row.cancel_at_period_end,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
