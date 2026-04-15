// GET /api/activities — list user's college_activities
// POST /api/activities — create one
// Spec: CollegeVCareers.md SP-2.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("college_activities")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activities: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const title = String(body.title || "").slice(0, 120).trim();
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const { count } = await supabase
    .from("college_activities")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data, error } = await supabase
    .from("college_activities")
    .insert({
      user_id: user.id,
      title,
      role: body.role ? String(body.role).slice(0, 120) : null,
      category: body.category ? String(body.category).slice(0, 40) : null,
      description: body.description ? String(body.description).slice(0, 600) : null,
      hours_per_week: body.hours_per_week ?? null,
      weeks_per_year: body.weeks_per_year ?? null,
      grades_participated: Array.isArray(body.grades_participated) ? body.grades_participated : null,
      position: count || 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
