// POST /api/billing/stripe/portal — opens a Stripe Billing Portal session
// for the signed-in user. Returns { url } so the client can redirect into
// Stripe-hosted self-serve management (cancel, update card, view invoices).
//
// Required env:
//   STRIPE_SECRET_KEY               — same secret used by /checkout
//   NEXT_PUBLIC_APP_ORIGIN (optional) — fallback derived from the request
//
// This route is the user-facing self-cancel path. We deliberately do not
// implement cancel/pause/resume server-side ourselves — Stripe's portal
// is the source of truth and stays in sync via the webhook.

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase-auth";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured on the server (missing STRIPE_SECRET_KEY)." },
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

  // Look up the user's Stripe customer id. Without it we can't open the
  // portal — caller should have hit checkout first to create one.
  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle<{ stripe_customer_id?: string | null }>();

  const customerId = sub?.stripe_customer_id;
  if (!customerId) {
    return NextResponse.json(
      {
        error:
          "No Stripe customer on file. Subscribe first via /pricing, then come back here to manage your subscription.",
      },
      { status: 404 },
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    req.headers.get("origin") ||
    `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/settings`,
    });
    if (!session.url) {
      return NextResponse.json({ error: "Stripe returned no portal URL" }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/portal] error", err);
    const message = err instanceof Error ? err.message : "Portal failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
