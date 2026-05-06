// POST /api/counselor/booking
//
// Creates a cc_counselor_engagements row in `proposed` state and returns a
// Stripe Checkout Session URL. Counselor.stripe_account_id (Stripe Connect
// Express account) is REQUIRED for marketplace splits — otherwise the
// platform would receive 100% of funds with no path to pay the counselor
// out. We mark the engagement `paid_pending_start` from the webhook handler
// once Stripe confirms `checkout.session.completed`.
//
// Body:
//   { service_id: string, scope?: Record<string, unknown> }
//
// Returns:
//   { engagement_id, checkout_url }
//
// Stripe metadata threaded through so the webhook can find the engagement
// without a separate index:
//   metadata.marketplace        = "engagement"
//   metadata.engagement_id      = <uuid>
//   metadata.counselor_id       = <uuid>
//   metadata.student_id         = <uuid>

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
// Application fee in basis points (250 = 2.5%). Phase 2 ships at 10% (1000 bp);
// pulled from env so it can be tuned without redeploy. Falls back to 1000.
const APPLICATION_FEE_BP = Number(
  process.env.MARKETPLACE_APPLICATION_FEE_BP ?? "1000",
);

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured on the server (missing STRIPE_SECRET_KEY)" },
      { status: 500 },
    );
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to book" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as {
    service_id?: string;
    scope?: Record<string, unknown>;
  };
  if (!body.service_id) {
    return NextResponse.json({ error: "Missing service_id" }, { status: 400 });
  }

  const db = createAdminSupabase();

  // Resolve the student's profile id (engagements are keyed on cc_student_profiles.id).
  let { data: studentProfile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle<{ id: string }>();
  if (!studentProfile) {
    const { data: created } = await db
      .from("cc_student_profiles")
      .insert({ user_id: user.id })
      .select("id")
      .single<{ id: string }>();
    studentProfile = created ?? null;
  }
  if (!studentProfile) {
    return NextResponse.json({ error: "Could not resolve student profile" }, { status: 500 });
  }

  // Pull the service + counselor in one shot.
  const { data: serviceRow } = await db
    .from("cc_counselor_services")
    .select(`
      id, title, price_usd, active,
      counselor:cc_counselors!counselor_id (id, display_name, slug, stripe_account_id, payout_status)
    `)
    .eq("id", body.service_id)
    .maybeSingle();
  type ServiceFull = {
    id: string;
    title: string;
    price_usd: number;
    active: boolean;
    counselor: { id: string; display_name: string; slug: string; stripe_account_id: string | null; payout_status: string }
      | { id: string; display_name: string; slug: string; stripe_account_id: string | null; payout_status: string }[]
      | null;
  };
  const service = serviceRow as ServiceFull | null;
  if (!service || !service.active) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 404 });
  }
  const counselor = Array.isArray(service.counselor) ? service.counselor[0] : service.counselor;
  if (!counselor) {
    return NextResponse.json({ error: "Counselor not found" }, { status: 404 });
  }
  if (!counselor.stripe_account_id) {
    return NextResponse.json(
      {
        error:
          "This counselor hasn't completed Stripe Connect onboarding yet, so payouts can't flow. Please try again later.",
      },
      { status: 409 },
    );
  }

  // Create the engagement row first so we have an id to thread through Stripe.
  const { data: engagement, error: engErr } = await db
    .from("cc_counselor_engagements")
    .insert({
      counselor_id: counselor.id,
      student_id: studentProfile.id,
      service_id: service.id,
      status: "proposed",
      scope_jsonb: body.scope ?? {},
    })
    .select("id")
    .single<{ id: string }>();
  if (engErr || !engagement) {
    return NextResponse.json({ error: engErr?.message ?? "Could not create engagement" }, { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const origin =
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    req.headers.get("origin") ||
    `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  // Marketplace charge with destination + application fee. Stripe automatically
  // sends the gross MINUS application fee to the counselor's connected account.
  const amountCents = Math.round(Number(service.price_usd) * 100);
  const applicationFeeCents = Math.round((amountCents * APPLICATION_FEE_BP) / 10000);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: service.title,
            description: `With ${counselor.display_name}`,
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: applicationFeeCents,
      transfer_data: {
        destination: counselor.stripe_account_id,
      },
      // Threaded into the PaymentIntent so it shows in dashboards and is
      // searchable in Stripe.
      metadata: {
        marketplace: "engagement",
        engagement_id: engagement.id,
        counselor_id: counselor.id,
      },
    },
    customer_email: user.email,
    success_url: `${origin}/engagements/${engagement.id}?paid=1`,
    cancel_url: `${origin}/counselors/${counselor.slug}?cancelled=1`,
    metadata: {
      marketplace: "engagement",
      engagement_id: engagement.id,
      counselor_id: counselor.id,
      student_id: studentProfile.id,
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe didn't return a checkout URL" }, { status: 500 });
  }

  return NextResponse.json({
    engagement_id: engagement.id,
    checkout_url: session.url,
  });
}
