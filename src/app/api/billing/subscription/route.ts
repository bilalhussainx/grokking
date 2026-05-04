// GET /api/billing/subscription — returns the current user's subscription
// row in the client-facing Subscription shape. Read-only and vendor-agnostic;
// cancel / pause / resume / update-card are handled by the Stripe Billing
// Portal at /api/billing/stripe/portal, not by this route.
//
// Replaces the Paddle-era POST handler which called Paddle's API directly.

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { rowToSubscription, type SubscriptionRow } from "@/types/billing";

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: row } = await supabase
    .from("user_subscriptions")
    .select(
      "id, user_id, stripe_subscription_id, stripe_customer_id, plan, status, current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at",
    )
    .eq("user_id", user.id)
    .maybeSingle<SubscriptionRow>();

  if (!row) {
    // No row yet — caller treats this as the free tier. Return a synthetic
    // subscription rather than 404 so the UI can render a free-plan card.
    return NextResponse.json({
      subscription: {
        id: "",
        userId: user.id,
        stripeSubscriptionId: null,
        stripeCustomerId: null,
        plan: "free",
        status: "active",
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        createdAt: new Date(0).toISOString(),
        updatedAt: new Date(0).toISOString(),
      },
    });
  }

  return NextResponse.json({ subscription: rowToSubscription(row) });
}
