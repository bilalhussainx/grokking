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
    .select("plan, status, paddle_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.plan === "pro" && (existing.status === "active" || existing.status === "trialing")) {
    return NextResponse.json({ already: true, message: "You already have Pro access." });
  }

  const { error } = await db
    .from("user_subscriptions")
    .upsert({
      user_id: user.id,
      paddle_subscription_id: "subsidized-grant",
      paddle_customer_id: null,
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

  return NextResponse.json({ granted: true, message: "Pro access activated! You now have full access to all courses and features." });
}
