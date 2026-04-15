// PATCH /api/activities/[id] — update fields
// DELETE /api/activities/[id]
// Spec: CollegeVCareers.md SP-2.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const k of ["title", "role", "category", "description"]) {
    if (k in body) patch[k] = body[k] == null ? null : String(body[k]).slice(0, 600);
  }
  if ("hours_per_week" in body) patch.hours_per_week = body.hours_per_week;
  if ("weeks_per_year" in body) patch.weeks_per_year = body.weeks_per_year;
  if ("grades_participated" in body) patch.grades_participated = body.grades_participated;
  if ("position" in body) patch.position = body.position;

  const { data, error } = await supabase
    .from("college_activities")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("college_activities")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
