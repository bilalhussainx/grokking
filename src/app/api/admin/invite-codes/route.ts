import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-auth";
import { hasAdminSecret } from "@/lib/admin-secret";


/**
 * POST /api/admin/invite-codes — Create invite codes (admin only)
 * GET /api/admin/invite-codes — List all codes with usage stats
 *
 * Requires: x-admin-secret header matching ADMIN_SECRET env var
 */
export async function POST(req: NextRequest) {
  if (!hasAdminSecret(req.headers.get("x-admin-secret"), "ADMIN_SECRET")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { label, credits, durationDays, maxUses, count, prefix, role } = await req.json();

  const admin = createAdminSupabase();
  const codes: string[] = [];

  const numCodes = count || 1;
  const codePrefix = (prefix || "INVESTOR").toUpperCase();

  for (let i = 0; i < numCodes; i++) {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `${codePrefix}-${randomPart}`;

    // Try new schema first (with label, credits, duration_days, max_uses)
    const { error } = await admin.from("invite_codes").insert({
      code,
      role: role || "pro",
      label: label || `${codePrefix} Demo`,
      credits: credits || 1000,
      duration_days: durationDays || 14,
      max_uses: maxUses ?? 1,
    });

    if (error) {
      // Fallback: old schema only has code, role, used_by, created_by, expires_at
      const { error: fallbackErr } = await admin.from("invite_codes").insert({
        code,
        role: "pro",
      });
      if (!fallbackErr) codes.push(code);
    } else {
      codes.push(code);
    }
  }

  return NextResponse.json({ codes, count: codes.length });
}

export async function GET(req: NextRequest) {
  if (!hasAdminSecret(req.headers.get("x-admin-secret"), "ADMIN_SECRET")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminSupabase();
  const { data: codes } = await admin
    .from("invite_codes")
    .select("*, invite_redemptions(user_id, redeemed_at)")
    .order("created_at", { ascending: false });

  return NextResponse.json({ codes });
}
