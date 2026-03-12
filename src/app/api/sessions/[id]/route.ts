import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createAdminSupabase();
    const { id } = await params;
    const { data, error } = await supabase.from("live_sessions").select("*, session_participants(id, user_id, role, is_active, joined_at)").eq("id", id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminSupabase();
  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.status) {
    updates.status = body.status;
    if (body.status === "active") updates.started_at = new Date().toISOString();
    if (body.status === "ended") updates.ended_at = new Date().toISOString();
  }
  if (body.title) updates.title = body.title;
  const { data, error } = await supabase.from("live_sessions").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
