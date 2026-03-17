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

  // Check if already used (old schema uses used_by, new schema uses times_used)
  if (invite.used_by && invite.used_by !== user.id) {
    return NextResponse.json({ error: "This invite code has already been used" }, { status: 410 });
  }

  // Check max uses (if column exists)
  if (invite.max_uses !== null && invite.max_uses !== undefined && invite.times_used >= invite.max_uses) {
    return NextResponse.json({ error: "This invite code has reached its usage limit" }, { status: 410 });
  }

  // Defaults for codes that use old schema (no credits/duration columns)
  const creditsToGrant = invite.credits ?? 1000; // Default 1000 for investor codes
  const durationDays = invite.duration_days ?? 90;
  const role = invite.role || "pro";

  // Calculate pro expiry
  const proExpiresAt = new Date();
  proExpiresAt.setDate(proExpiresAt.getDate() + durationDays);

  // Grant role (pro or teacher)
  await admin
    .from("user_profiles")
    .update({ role })
    .eq("id", user.id);

  // Grant credits via RPC — also ensure profile exists first
  await admin.from("user_profiles").upsert({
    id: user.id,
    email: user.email || "",
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
    role,
  }, { onConflict: "id" });

  try {
    const { error: rpcErr } = await admin.rpc("add_credits", {
      p_user_id: user.id,
      p_amount: creditsToGrant,
      p_action: "invite_code",
      p_ref_id: invite.code,
    });
    if (rpcErr) throw rpcErr;
  } catch {
    // Fallback: direct upsert
    const { data: currentCredits } = await admin
      .from("user_credits")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    const newBalance = (currentCredits?.balance || 0) + creditsToGrant;
    await admin
      .from("user_credits")
      .upsert({
        user_id: user.id,
        balance: Math.min(newBalance, 999999),
      }, { onConflict: "user_id" });
  }

  // Mark code as used (old schema)
  await admin
    .from("invite_codes")
    .update({
      used_by: user.id,
      used_at: new Date().toISOString(),
      ...(invite.times_used !== undefined ? { times_used: (invite.times_used || 0) + 1 } : {}),
    })
    .eq("id", invite.id);

  // Try to record redemption (new schema table may not exist)
  try {
    await admin
      .from("invite_redemptions")
      .insert({
        user_id: user.id,
        invite_code_id: invite.id,
        pro_expires_at: proExpiresAt.toISOString(),
      });
  } catch {
    // Table may not exist in old schema — non-critical
  }

  return NextResponse.json({
    ok: true,
    granted: {
      role,
      credits: creditsToGrant,
      expiresAt: proExpiresAt.toISOString(),
      durationDays,
      label: invite.label || invite.code,
    },
  });
}
