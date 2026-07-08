// POST /api/counselor/payouts/onboard
//   Creates (or reuses) the counselor's Stripe Connect Express account and
//   returns a Stripe-hosted onboarding link. The acct_… id is stored on
//   cc_counselors.stripe_account_id the moment the account is created, so
//   an abandoned onboarding can resume with the same account.
//
// GET /api/counselor/payouts/onboard
//   Refreshes onboarding status from Stripe (charges_enabled /
//   details_submitted) and mirrors it into cc_counselors.payout_status
//   ('none' | 'pending' | 'enabled'). Called by the payouts page after the
//   return redirect and on load.

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";

export const runtime = "nodejs";

async function getCounselorRow(userId: string) {
  const db = createAdminSupabase();
  const { data } = await db
    .from("cc_counselors")
    .select("id, stripe_account_id, payout_status, display_name")
    .eq("user_id", userId)
    .maybeSingle<{
      id: string;
      stripe_account_id: string | null;
      payout_status: string | null;
      display_name: string | null;
    }>();
  return data ?? null;
}

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Payments aren't configured on this environment yet." },
      { status: 500 },
    );
  }
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const counselor = await getCounselorRow(user.id);
  if (!counselor) {
    return NextResponse.json({ error: "counselor profile required" }, { status: 403 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const db = createAdminSupabase();

  let accountId = counselor.stripe_account_id;
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: user.email ?? undefined,
      capabilities: { transfers: { requested: true } },
      business_profile: {
        product_description: "College counseling services on KairosLearn",
      },
      metadata: { counselor_id: counselor.id },
    });
    accountId = account.id;
    const { error } = await db
      .from("cc_counselors")
      .update({ stripe_account_id: accountId, payout_status: "pending" })
      .eq("id", counselor.id);
    if (error) {
      console.error("[payouts/onboard] failed to store acct id:", error);
      return NextResponse.json({ error: "could not save Stripe account" }, { status: 500 });
    }
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    req.headers.get("origin") ||
    `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/counselor/payouts?refresh=1`,
    return_url: `${origin}/counselor/payouts?return=1`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: link.url });
}

export async function GET() {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ status: "unconfigured" });
  }
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const counselor = await getCounselorRow(user.id);
  if (!counselor) {
    return NextResponse.json({ error: "counselor profile required" }, { status: 403 });
  }
  if (!counselor.stripe_account_id) {
    return NextResponse.json({ status: "none" });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const account = await stripe.accounts.retrieve(counselor.stripe_account_id);
  const enabled = Boolean(account.charges_enabled && account.details_submitted);
  const status = enabled ? "enabled" : "pending";

  if (status !== counselor.payout_status) {
    const db = createAdminSupabase();
    await db.from("cc_counselors").update({ payout_status: status }).eq("id", counselor.id);
  }

  return NextResponse.json({
    status,
    detailsSubmitted: Boolean(account.details_submitted),
    chargesEnabled: Boolean(account.charges_enabled),
  });
}
