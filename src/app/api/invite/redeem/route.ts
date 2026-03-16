import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-auth";

/**
 * POST /api/invite/redeem
 * Redeem an invite code — grants pro role + credits for the specified duration.
 * Can be called during signup or from settings page.
 */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await req.json();
  if (!code?.trim()) {
    return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
  }

  const admin = createAdminSupabase();

  // Find the invite code
  const { data: invite, error: findErr } = await admin
    .from("invite_codes")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .single();

  if (findErr || !invite) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  // Check if expired
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: "This invite code has expired" }, { status: 410 });
  }

  // Check max uses
  if (invite.max_uses !== null && invite.times_used >= invite.max_uses) {
    return NextResponse.json({ error: "This invite code has reached its usage limit" }, { status: 410 });
  }

  // Check if user already redeemed this code
  const { data: existing } = await admin
    .from("invite_redemptions")
    .select("id")
    .eq("user_id", user.id)
    .eq("invite_code_id", invite.id);

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "You've already redeemed this code" }, { status: 409 });
  }

  // Calculate pro expiry
  const proExpiresAt = new Date();
  proExpiresAt.setDate(proExpiresAt.getDate() + invite.duration_days);

  // Grant pro role
  await admin
    .from("user_profiles")
    .update({ role: invite.role || "pro" })
    .eq("id", user.id);

  // Grant credits
  const { data: currentCredits } = await admin
    .from("user_credits")
    .select("balance")
    .eq("user_id", user.id)
    .single();

  const newBalance = (currentCredits?.balance || 0) + invite.credits;
  await admin
    .from("user_credits")
    .upsert({
      user_id: user.id,
      balance: Math.min(newBalance, 999999),
    }, { onConflict: "user_id" });

  // Log the credit grant
  await admin
    .from("credit_txns")
    .insert({
      user_id: user.id,
      amount: invite.credits,
      action: "invite_code",
      ref_id: invite.code,
    });

  // Record redemption
  await admin
    .from("invite_redemptions")
    .insert({
      user_id: user.id,
      invite_code_id: invite.id,
      pro_expires_at: proExpiresAt.toISOString(),
    });

  // Increment usage count
  await admin
    .from("invite_codes")
    .update({ times_used: invite.times_used + 1 })
    .eq("id", invite.id);

  return NextResponse.json({
    ok: true,
    granted: {
      role: invite.role,
      credits: invite.credits,
      expiresAt: proExpiresAt.toISOString(),
      durationDays: invite.duration_days,
      label: invite.label,
    },
  });
}
