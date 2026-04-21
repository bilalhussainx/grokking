import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "../../helpers";

export async function GET() {
  const userSupabase = await createServerSupabase();
  const { data: { user } } = await userSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminSupabase();

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ messages: [] });
  }

  const { data: messages } = await supabase
    .from("cc_coach_conversations")
    .select("id, role, content, mode, page_context, created_at")
    .eq("student_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({
    messages: (messages ?? []).reverse(),
  });
}
