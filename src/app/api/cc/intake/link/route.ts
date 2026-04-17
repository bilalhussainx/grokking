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

  // Link the orphan profile created during intake completion
  // Find profiles with no user_id that were created around the same session
  const { data: orphanProfile } = await admin
    .from("cc_student_profiles")
    .select("id")
    .is("user_id", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (orphanProfile) {
    await admin
      .from("cc_student_profiles")
      .update({ user_id: user.id })
      .eq("id", orphanProfile.id);
  }

  return NextResponse.json({ linked: true });
}
