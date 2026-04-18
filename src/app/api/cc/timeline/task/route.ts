import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;

  const { title, due_date, description, priority } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("cc_tasks")
    .insert({
      student_id: profile.id,
      title,
      due_date: due_date || null,
      description: description || null,
      priority: priority || 3,
      task_type: "custom",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ created: true, id: data.id });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;

  const { id, status, title, due_date } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Task id required" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  if (status) {
    updates.status = status;
    if (status === "completed") updates.completed_at = new Date().toISOString();
  }
  if (title !== undefined) updates.title = title;
  if (due_date !== undefined) updates.due_date = due_date;

  const { error } = await supabase
    .from("cc_tasks")
    .update(updates)
    .eq("id", id)
    .eq("student_id", profile.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ updated: true });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Task id required" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("cc_tasks")
    .delete()
    .eq("id", id)
    .eq("student_id", profile.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
