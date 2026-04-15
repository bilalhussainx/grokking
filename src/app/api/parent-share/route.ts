// SP-3 — parent share tokens.
// POST /api/parent-share { label? } → generates a 12-char code for the caller.
// GET  /api/parent-share → list caller's existing tokens.
// DELETE /api/parent-share?code= → revoke.

import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

function randomCode(len = 12) {
  // URL-safe alphabet, unambiguous (no 0/O/1/I/l)
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
  const bytes = crypto.randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase
    .from("parent_share_tokens")
    .select("code, label, created_at, expires_at, revoked_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tokens: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const label = body.label ? String(body.label).slice(0, 60) : null;

  for (let i = 0; i < 5; i++) {
    const code = randomCode(12);
    const { data, error } = await supabase
      .from("parent_share_tokens")
      .insert({ code, user_id: user.id, label })
      .select()
      .maybeSingle();
    if (!error && data) return NextResponse.json({ token: data });
    if (error && !/duplicate/i.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

  const { error } = await supabase
    .from("parent_share_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("code", code)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
