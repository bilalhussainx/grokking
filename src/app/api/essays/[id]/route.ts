// GET /api/essays/[id] — draft + all versions
// PATCH /api/essays/[id] — update title/status/prompt
// DELETE /api/essays/[id]
// Spec: CollegeVCareers.md SP-10.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: draft, error: draftErr } = await supabase
    .from("essay_drafts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (draftErr) return NextResponse.json({ error: draftErr.message }, { status: 500 });
  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: versions } = await supabase
    .from("essay_versions")
    .select("*")
    .eq("draft_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ draft, versions: versions || [] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.title === "string") patch.title = body.title.slice(0, 200);
  if (typeof body.prompt === "string") patch.prompt = body.prompt.slice(0, 4000);
  if (typeof body.status === "string" && ["ideation", "drafting", "review", "done"].includes(body.status)) {
    patch.status = body.status;
  }

  const { data, error } = await supabase
    .from("essay_drafts")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("essay_drafts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
