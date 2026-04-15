// GET /api/essays — list user's drafts
// POST /api/essays — create a new draft (title, prompt, school_id?, word_target?)
// Spec: CollegeVCareers.md SP-10.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("essay_drafts")
    .select("id, title, prompt, school_id, word_target, status, current_version, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ drafts: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, prompt, school_id, word_target } = body;

  if (!title || !prompt) {
    return NextResponse.json({ error: "title and prompt required" }, { status: 400 });
  }
  if (String(title).length > 200) {
    return NextResponse.json({ error: "title too long" }, { status: 400 });
  }
  if (String(prompt).length > 4000) {
    return NextResponse.json({ error: "prompt too long" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("essay_drafts")
    .insert({
      user_id: user.id,
      title: String(title).slice(0, 200),
      prompt: String(prompt).slice(0, 4000),
      school_id: school_id || null,
      word_target: typeof word_target === "number" && word_target > 0 ? Math.min(word_target, 5000) : null,
      status: "ideation",
      current_version: 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
