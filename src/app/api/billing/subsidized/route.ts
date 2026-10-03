import { NextResponse } from "next/server";
import { getAuthUser, createAdminSupabase } from "@/lib/supabase-auth";
import { checkSubsidizedEligibility } from "@/lib/cc/subsidized-eligibility";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await checkSubsidizedEligibility(user.id);
  return NextResponse.json(result);
}

export async function POST() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await checkSubsidizedEligibility(user.id);
  if (!result.eligible) {
    return NextResponse.json({ error: result.reason }, { status: 403 });
  }

  const db = createAdminSupabase();

  const { data: existing } = await db
    .from("user_subscriptions")
    .select("plan, status, stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.plan === "pro" && (existing.status === "active" || existing.status === "trialing")) {
    return NextResponse.json({ already: true, message: "You already have Pro access." });
  }

  // Subsidized grant — no Stripe subscription exists. We mark the row with
  // the literal string "subsidized-grant" in stripe_subscription_id so the
  // status route + UI can distinguish a comped account from a paid one
  // (and so the Stripe webhook will never collide with this row, since real
  // Stripe sub IDs are prefixed `sub_`). When/if the user later subscribes,
  // the webhook resolves them by user_id from metadata and overwrites this
  // marker with the real subscription id.
  const { error } = await db
    .from("user_subscriptions")
    .upsert({
      user_id: user.id,
      stripe_subscription_id: "subsidized-grant",
      stripe_customer_id: null,
      plan: "pro",
      status: "active",
      current_period_start: new Date().toISOString(),
      current_period_end: null,
      cancel_at_period_end: false,
    }, { onConflict: "user_id" });

  if (error) {
    console.error("[Subsidized] Upsert failed:", error);
    return NextResponse.json({ error: "Failed to activate Pro" }, { status: 500 });
  }

  return NextResponse.json({ granted: true, message: "Pro access activated! You now have full access to Pro." });
}
