import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-auth";

/**
 * GET /api/bridges?lessonId=X
 * Returns cross-domain concept bridges for a given lesson.
 */
export async function GET(req: NextRequest) {
  const lessonId = req.nextUrl.searchParams.get("lessonId");
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const supabase = createAdminSupabase();

  // Try RPC first, fall back to direct query
  try {
    const { data, error } = await supabase.rpc("get_concept_bridges", {
      p_lesson_id: lessonId,
      p_limit: 3,
    });

    if (error) throw error;
    return NextResponse.json({ bridges: data ?? [] });
  } catch {
    // Fallback: direct query
    const { data } = await supabase
      .from("concept_bridges")
      .select("*")
      .or(`lesson_a_id.eq.${lessonId},lesson_b_id.eq.${lessonId}`)
      .order("similarity", { ascending: false })
      .limit(3);

    const bridges = (data ?? []).map((b: any) => ({
      connected_lesson_id: b.lesson_a_id === lessonId ? b.lesson_b_id : b.lesson_a_id,
      connected_course: b.lesson_a_id === lessonId ? b.lesson_b_course : b.lesson_a_course,
      connected_domain: b.lesson_a_id === lessonId ? b.lesson_b_domain : b.lesson_a_domain,
      similarity: b.similarity,
      bridge_label: b.bridge_label,
    }));

    return NextResponse.json({ bridges });
  }
}
