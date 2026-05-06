// POST /api/counselor/engagements/[id]/accept-quote
//
// Student accepts the counselor's quote. Mints a Stripe Checkout Session
// for quoted_price_usd with the same destination-charge + application-fee
// pattern the fixed-price booking flow uses, so the post-payment lifecycle
// (webhook → status='paid_pending_start') is identical.
//
// Body: empty.
// Returns: { checkout_url }

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const APPLICATION_FEE_BP = Number(
  process.env.MARKETPLACE_APPLICATION_FEE_BP ?? "1000",
);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createAdminSupabase();
  const { data: engagement } = await db
    .from("cc_counselor_engagements")
    .select(`
      id, status, quoted_price_usd, counselor_id, student_id,
      service:cc_counselor_services!service_id (title),
      counselor:cc_counselors!counselor_id (display_name, slug, stripe_account_id),
      student:cc_student_profiles!student_id (user_id)
    `)
    .eq("id", id)
    .maybeSingle();
  type Eng = {
    id: string;
    status: string;
    quoted_price_usd: number | null;
    counselor_id: string;
    student_id: string;
    service: { title: string | null } | { title: string | null }[] | null;
    counselor:
      | { display_name: string; slug: string; stripe_account_id: string | null }
      | { display_name: string; slug: string; stripe_account_id: string | null }[]
      | null;
    student: { user_id: string } | { user_id: string }[] | null;
  };
  const e = engagement as Eng | null;
  if (!e) return NextResponse.json({ error: "Engagement not found" }, { status: 404 });

  const student = Array.isArray(e.student) ? e.student[0] : e.student;
  if (student?.user_id !== user.id) {
    return NextResponse.json({ error: "Not your engagement" }, { status: 403 });
  }
  if (e.status !== "quoted") {
    return NextResponse.json(
      { error: `Cannot accept from status '${e.status}'` },
      { status: 409 },
    );
  }
  if (!e.quoted_price_usd || e.quoted_price_usd < 1) {
    return NextResponse.json({ error: "No valid quote on this engagement" }, { status: 409 });
  }

  const counselor = Array.isArray(e.counselor) ? e.counselor[0] : e.counselor;
  if (!counselor?.stripe_account_id) {
    return NextResponse.json(
      { error: "Counselor has no payout account configured yet" },
      { status: 409 },
    );
  }

  const service = Array.isArray(e.service) ? e.service[0] : e.service;
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const origin =
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    req.headers.get("origin") ||
    `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  const amountCents = Math.round(Number(e.quoted_price_usd) * 100);
  const applicationFeeCents = Math.round((amountCents * APPLICATION_FEE_BP) / 10000);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: service?.title ?? "Counselor service",
            description: `Quoted by ${counselor.display_name}`,
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: applicationFeeCents,
      transfer_data: { destination: counselor.stripe_account_id },
      metadata: {
        marketplace: "engagement",
        engagement_id: e.id,
        counselor_id: e.counselor_id,
      },
    },
    customer_email: user.email,
    success_url: `${origin}/engagements/${e.id}?paid=1`,
    cancel_url: `${origin}/engagements/${e.id}?cancelled=1`,
    metadata: {
      marketplace: "engagement",
      engagement_id: e.id,
      counselor_id: e.counselor_id,
      student_id: e.student_id,
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe didn't return a checkout URL" }, { status: 500 });
  }
  return NextResponse.json({ checkout_url: session.url });
}
