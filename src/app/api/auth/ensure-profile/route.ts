import { NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-auth";

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

  // 1. Ensure profile exists
  const { data: existingProfile } = await admin
    .from("user_profiles")
    .select("id, role, trial_ends_at")
    .eq("id", user.id)
    .single();

  let role = existingProfile?.role || "pro";
  let trialEndsAt = existingProfile?.trial_ends_at;

  if (!existingProfile) {
    // Create profile with pro trial
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);
    trialEndsAt = trialEnd.toISOString();

    await admin.from("user_profiles").upsert({
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
      role: "pro",
      trial_ends_at: trialEndsAt,
    }, { onConflict: "id" });
    role = "pro";
  }

  // 2. Ensure credits exist — check if signup_bonus was ever granted
  const { data: bonusTxn } = await admin
    .from("credit_txns")
    .select("id")
    .eq("user_id", user.id)
    .eq("action", "signup_bonus")
    .limit(1)
    .maybeSingle();

  let credits = 0;

  if (!bonusTxn) {
    // Grant 50 signup bonus credits via admin RPC
    const { data: newBalance } = await admin.rpc("add_credits", {
      p_user_id: user.id,
      p_amount: 50,
      p_action: "signup_bonus",
    });
    credits = (newBalance as number) || 50;
  } else {
    // Already has signup bonus — just fetch current balance
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
