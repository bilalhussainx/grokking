// Marks the guest_sessions_audit row as upgraded when an anonymous user
// converts to a real account (or upgrades to Pro).
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { to } = (await req.json().catch(() => ({}))) as { to?: "free" | "pro" };

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }

  const admin = createAdminSupabase();
  const column =
    to === "pro" ? "upgraded_to_pro_at" : "upgraded_to_free_at";

  await admin
    .from("guest_sessions_audit")
    .update({ [column]: new Date().toISOString() })
    .eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
