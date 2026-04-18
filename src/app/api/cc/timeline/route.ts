import { NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../helpers";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ tasks: [] });
  }

  const { data, error } = await supabase
    .from("cc_tasks")
    .select("id, school_id, task_type, title, description, due_date, status, priority, completed_at, created_at, cc_schools(name)")
    .eq("student_id", profile.id)
    .order("due_date", { ascending: true, nullsFirst: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tasks: data });
}
