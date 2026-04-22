// Records first-touch for an anonymous user in guest_sessions_audit.
// Called once per session by useGuestSession after signInAnonymously succeeds.
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { landingPath } = (await req.json().catch(() => ({}))) as {
    landingPath?: string | null;
  };

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }

  // Upsert — idempotent. First call wins on landed_at via ON CONFLICT DO NOTHING.
  const admin = createAdminSupabase();
  await admin
    .from("guest_sessions_audit")
    .upsert(
      {
        user_id: user.id,
        landing_path: landingPath ?? null,
      },
      { onConflict: "user_id", ignoreDuplicates: true }
    );

  return NextResponse.json({ ok: true });
}
