// POST /api/billing/stripe/checkout — creates a Stripe Checkout Session for
// the Pro monthly plan. Returns { url } so the client can redirect into
// Stripe-hosted checkout. Replaces the old Paddle flow on the marketing
// pricing page (legacy PricingCards + /api/billing/checkout still around
// for back-compat, but new ProCheckoutButton uses this).
//
// Requires env:
//   STRIPE_SECRET_KEY                          — server, never NEXT_PUBLIC
//   NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY    — stripe price ID for Pro $12/mo
//   NEXT_PUBLIC_APP_ORIGIN (optional)          — if missing, derived from request

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase-auth";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const PRO_MONTHLY_PRICE = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY ?? "";

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY || !PRO_MONTHLY_PRICE) {
    return NextResponse.json(
      {
        error:
          "Stripe billing is not configured on the server. Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY.",
      },
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

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2026-04-22.dahlia" });

  // Look up an existing Stripe customer for this user from the user_subscriptions
  // table (same table the existing Paddle flow writes to). If none, Stripe creates
  // a new customer at checkout time.
  let customerId: string | undefined;
  const { data: existing } = await supabase
    .from("user_subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle<{ stripe_customer_id?: string | null }>();
  if (existing?.stripe_customer_id) customerId = existing.stripe_customer_id;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: PRO_MONTHLY_PRICE, quantity: 1 }],
      success_url: `${origin}/?upgraded=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=1`,
      ...(customerId
        ? { customer: customerId }
        : user.email
          ? { customer_email: user.email }
          : {}),
      client_reference_id: user.id,
      subscription_data: {
        metadata: { user_id: user.id, plan: "pro" },
        // First month free per the marketing page promise.
        trial_period_days: 30,
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
