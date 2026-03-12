import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminSupabase();
    const { join_code, user_id } = await req.json();
    if (!join_code || !user_id) return NextResponse.json({ error: "join_code and user_id required" }, { status: 400 });

    const { data: session, error: sessionError } = await supabase.from("live_sessions").select("*").eq("join_code", join_code.toUpperCase().trim()).single();
    if (sessionError || !session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (session.status === "ended") return NextResponse.json({ error: "Session has ended" }, { status: 400 });

    const { data: existing } = await supabase.from("session_participants").select("id").eq("session_id", session.id).eq("user_id", user_id).single();
    if (existing) {
      await supabase.from("session_participants").update({ is_active: true, left_at: null }).eq("id", existing.id);
    } else {
      await supabase.from("session_participants").insert({ session_id: session.id, user_id, role: "student" });
    }

    return NextResponse.json({ session });
  } catch { return NextResponse.json({ error: "Failed to join" }, { status: 500 }); }
}
