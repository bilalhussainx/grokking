import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { owner_id, title, doc_type, session_id } = await req.json();
    if (!owner_id) return NextResponse.json({ error: "owner_id required" }, { status: 400 });

    const { data, error } = await supabase.from("documents").insert({
      owner_id, title: title || "Untitled Document", doc_type: doc_type || "essay",
      session_id: session_id || null, content: { type: "doc", content: [{ type: "paragraph" }] },
      plain_text: "", status: "draft",
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: "Failed to create document" }, { status: 500 }); }
}

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const { data, error } = await supabase.from("documents").select("*").eq("owner_id", userId).order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
