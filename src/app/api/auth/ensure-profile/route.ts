import { NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-auth";
import { PRICING } from "@/lib/pricing";

/**
 * POST /api/auth/ensure-profile
 * Ensures user profile + credits exist after signup/login.
 * Uses admin client (service role) to bypass RLS — guaranteed to work
 * even when the signup trigger fails silently.
 */
export async function POST() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let admin;
  try {
    admin = createAdminSupabase();
  } catch {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  // 1. Ensure profile exists with pro trial
  const { data: existingProfile } = await admin
    .from("user_profiles")
    .select("id, role, trial_ends_at")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    // Create profile with pro trial (7 days)
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    await admin.from("user_profiles").upsert({
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
      role: "pro",
      trial_ends_at: trialEnd.toISOString(),
    }, { onConflict: "id" });
  } else if (!existingProfile.trial_ends_at) {
    // Existing user without trial_ends_at — set it now (7 days from today)
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);
    await admin.from("user_profiles")
      .update({ role: "pro", trial_ends_at: trialEnd.toISOString() })
      .eq("id", user.id);
  }

  // 2. Ensure user has the signup credits (PRICING.free.signupCredits, once)
  //    Check total signup_bonus credits ever granted
  const { data: bonusTxns } = await admin
    .from("credit_txns")
    .select("amount")
    .eq("user_id", user.id)
    .eq("action", "signup_bonus");

  const totalBonusGranted = (bonusTxns || []).reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);
  let credits = 0;

  const signupCredits = PRICING.free.signupCredits;
  if (totalBonusGranted < signupCredits) {
    // Top up to the signup amount — grant the difference
    const topUp = signupCredits - totalBonusGranted;
    const { data: newBalance } = await admin.rpc("add_credits", {
      p_user_id: user.id,
      p_amount: topUp,
      p_action: "signup_bonus",
    });
    credits = (newBalance as number) || signupCredits;
  } else {
    // Already has full signup bonus — fetch current balance
    const { data: bal } = await admin.rpc("get_credit_balance", {
      p_user_id: user.id,
    });
    credits = (bal as number) || 0;
  }

  // 3. Fetch the final profile state
  const { data: profile } = await admin
    .from("user_profiles")
    .select("id, email, full_name, role, referral_code, login_streak, avatar_url, trial_ends_at")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    ok: true,
    profile,
    credits,
  });
}
