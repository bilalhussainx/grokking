import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminSupabase();
    const { title, description, session_type, course_slug, module_id, lesson_id, teacher_id } = await req.json();
    if (!title || !teacher_id) return NextResponse.json({ error: "Title and teacher_id required" }, { status: 400 });

    const { data, error } = await supabase
      .from("live_sessions")
      .insert({
        teacher_id,
        title,
        description: description || null,
        session_type: session_type || "coding",
        course_slug: course_slug || null,
        lesson_slug: lesson_id || null, // reuse lesson_slug column for lesson_id
        join_code: generateJoinCode(),
        status: "draft",
        settings: {
          module_id: module_id || null,
          lesson_id: lesson_id || null,
          course_slug: course_slug || null,
        },
      })
      .select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from("session_participants").insert({ session_id: data.id, user_id: teacher_id, role: "teacher" });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: "Failed to create session" }, { status: 500 }); }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminSupabase();
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const { data: participations } = await supabase.from("session_participants").select("session_id").eq("user_id", userId);
    const sessionIds = participations?.map((p) => p.session_id) || [];
    if (sessionIds.length === 0) return NextResponse.json([]);

    const { data, error } = await supabase.from("live_sessions").select("*").in("id", sessionIds).order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 }); }
}
