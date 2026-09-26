// POST /api/billing/stripe/checkout — creates a Stripe Checkout Session for
// Pro, monthly or yearly (body { interval: "month" | "year" }, default month;
// prices in src/lib/pricing.ts). Returns { url } so the client can redirect into
// Stripe-hosted checkout. Replaces the old Paddle flow on the marketing
// pricing page (legacy PricingCards + /api/billing/checkout still around
// for back-compat, but new ProCheckoutButton uses this).
//
// Requires env:
//   STRIPE_SECRET_KEY                          — server, never NEXT_PUBLIC
//   NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY    — stripe price ID for Pro monthly
//   NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY     — stripe price ID for Pro yearly
//   NEXT_PUBLIC_APP_ORIGIN (optional)          — if missing, derived from request

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase-auth";

const PRICE_ENV = {
  month: "NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY",
  year: "NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY",
} as const;
type Interval = keyof typeof PRICE_ENV;

export async function POST(req: NextRequest) {
  const raw: unknown = await req.json().catch(() => null);
  const interval = (raw && typeof raw === "object" ? (raw as { interval?: unknown }).interval : undefined) ?? "month";
  if (interval !== "month" && interval !== "year") {
    return NextResponse.json({ error: "interval must be 'month' or 'year'" }, { status: 400 });
  }
  // Read per request (not module scope) so a missing yearly price never
  // silently falls back to the monthly one.
  const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
  const price = process.env[PRICE_ENV[interval as Interval]] ?? "";
  if (!secretKey || !price) {
    return NextResponse.json(
      { error: `Stripe billing is not configured on the server. Set STRIPE_SECRET_KEY and ${PRICE_ENV[interval as Interval]}.` },
      { status: 500 },
    );
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }

  // Origin for success/cancel return URLs.
  const origin =
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    req.headers.get("origin") ||
    `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  // Omit apiVersion — let the Stripe SDK pick its own default. Pinning a
   // dahlia release (or any specific version) forces the SDK and the
   // server to disagree if either drifts.
  const stripe = new Stripe(secretKey);

  // Look up an existing Stripe customer for this user from the user_subscriptions
  // table (same table the existing Paddle flow writes to). If none, Stripe creates
  // a new customer at checkout time.
  let customerId: string | undefined;
  const { data: existing } = await supabase
    .from("user_subscriptions")
    .select("stripe_customer_id, stripe_subscription_id, status")
    .eq("user_id", user.id)
    .maybeSingle<{ stripe_customer_id?: string | null; stripe_subscription_id?: string | null; status?: string | null }>();
  // Already paying through Stripe: a second checkout would create a second,
  // separately billed subscription. Send them to the billing portal instead.
  // (Signup-trial rows have no stripe_subscription_id and may subscribe.)
  if (existing?.stripe_subscription_id && ["active", "trialing", "past_due"].includes(existing.status ?? "")) {
    return NextResponse.json(
      { error: "You already have Pro. Manage or switch your plan from the billing portal.", manage: true },
      { status: 409 },
    );
  }
  if (existing?.stripe_customer_id) customerId = existing.stripe_customer_id;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/?upgraded=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=1`,
      ...(customerId
        ? { customer: customerId }
        : user.email
          ? { customer_email: user.email }
          : {}),
      client_reference_id: user.id,
      subscription_data: {
        metadata: { user_id: user.id, plan: "pro", interval },
        // No trial here. The free 7-day Pro trial is granted at signup
        // by the Supabase trigger (create_signup_pro_trial in migration
        // 013_align_pro_trial_to_7_days). Stripe Checkout is hit AFTER
        // the trial expires, so we charge the Pro price immediately on subscribe.
      },
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe returned no checkout URL" }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout] error", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
