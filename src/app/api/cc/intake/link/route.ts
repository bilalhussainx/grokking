import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../../helpers";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const userSupabase = await createServerSupabase();
  const { data: { user } } = await userSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { session_token } = await req.json();
  if (!session_token) {
    return NextResponse.json({ error: "Missing session_token" }, { status: 400 });
  }

  const admin = createAdminSupabase();

  const { data: session } = await admin
    .from("cc_intake_sessions")
    .select("id, completed, extracted_fields")
    .eq("session_token", session_token)
    .is("user_id", null)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found or already linked" }, { status: 404 });
  }

  await admin
    .from("cc_intake_sessions")
    .update({ user_id: user.id })
    .eq("id", session.id);

  // Deliberately no profile adoption here. The previous code linked "the
  // newest profile with no user", which belongs to whichever anonymous
  // student finished intake last: another student's data. Sessions don't
  // record the profile they created, so a correct link needs a
  // session→profile column first (tracked in docs/handoff).

  return NextResponse.json({ linked: true });
}
