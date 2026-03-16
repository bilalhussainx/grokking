import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";

// GET /api/progress?course=<courseSlug>
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ lessons: [] }, { status: 401 });

  const courseSlug = req.nextUrl.searchParams.get("course");
  if (!courseSlug) return NextResponse.json({ lessons: [] }, { status: 400 });

  const sb = createAdminSupabase();
  const { data, error } = await sb
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug);

  if (error) {
    console.error("[progress] GET error:", error);
    return NextResponse.json({ lessons: [] }, { status: 500 });
  }

  return NextResponse.json({ lessons: (data ?? []).map((r) => r.lesson_id) });
}

// POST /api/progress  { courseSlug, lessonId, complete: true|false }
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseSlug, lessonId, complete } = await req.json();
  if (!courseSlug || !lessonId || typeof complete !== "boolean") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const sb = createAdminSupabase();

  if (complete) {
    const { error } = await sb.from("lesson_progress").upsert(
      { user_id: user.id, course_slug: courseSlug, lesson_id: lessonId },
      { onConflict: "user_id,course_slug,lesson_id" }
    );
    if (error) {
      console.error("[progress] POST upsert error:", error, "userId:", user.id);
      return NextResponse.json({ error: "DB error", detail: error.message, userId: user.id }, { status: 500 });
    }
  } else {
    const { error } = await sb
      .from("lesson_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("lesson_id", lessonId);
    if (error) {
      console.error("[progress] POST delete error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  // Return updated list
  const { data } = await sb
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug);

  return NextResponse.json({ lessons: (data ?? []).map((r) => r.lesson_id) });
}
