import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminSupabase();
  const { id } = await params;
  const { user_id, content, message_type, metadata, sender_name } = await req.json();
  if (!user_id || !content) return NextResponse.json({ error: "user_id and content required" }, { status: 400 });

  // Store sender_name in metadata so it persists
  const msgMetadata = { ...(metadata || {}), sender_name: sender_name || "User" };

  const { data, error } = await supabase
    .from("session_messages")
    .insert({
      session_id: id,
      user_id,
      content,
      message_type: message_type || "chat",
      metadata: msgMetadata,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return with sender_name extracted
  return NextResponse.json({ ...data, sender_name: msgMetadata.sender_name });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminSupabase();
  const { id } = await params;
  const { data, error } = await supabase
    .from("session_messages")
    .select("*")
    .eq("session_id", id)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Extract sender_name from metadata for each message
  const messages = (data || []).map((msg: Record<string, unknown>) => ({
    ...msg,
    sender_name: (msg.metadata as Record<string, unknown>)?.sender_name || "User",
  }));

  return NextResponse.json(messages);
}
