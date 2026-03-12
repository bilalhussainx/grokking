import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase();
  const { id } = await params;
  const { author_id, author_type, content, selection_from, selection_to } = await req.json();
  const { data, error } = await supabase.from("document_comments").insert({
    document_id: id, author_id: author_type === "ai" ? null : author_id,
    author_type: author_type || "human", content, selection_from: selection_from ?? null, selection_to: selection_to ?? null,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase();
  const { id } = await params;
  const { data, error } = await supabase.from("document_comments").select("*").eq("document_id", id).order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
