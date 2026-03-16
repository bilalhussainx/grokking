import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { recordSubmission, getCommonMisconceptions } from "@/lib/misconceptions";

/**
 * POST /api/ai/misconceptions
 * Record a submission and check for matching misconception patterns.
 *
 * Body: { courseId, lessonId, type: "code"|"quiz", text, isCorrect }
 * Returns: { misconception } or { misconception: null } if no match / correct answer.
 */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { courseId, lessonId, type, text, isCorrect } = body;

    if (!courseId || !lessonId || !type || !text || typeof isCorrect !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields: courseId, lessonId, type, text, isCorrect" },
        { status: 400 }
      );
    }

    if (type !== "code" && type !== "quiz") {
      return NextResponse.json(
        { error: "type must be 'code' or 'quiz'" },
        { status: 400 }
      );
    }

    const misconception = await recordSubmission(
      user.id,
      courseId,
      lessonId,
      type,
      text,
      isCorrect
    );

    return NextResponse.json({ misconception });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Misconceptions API] POST error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/ai/misconceptions?lessonId=X
 * Get common misconceptions for a lesson (for instructors/content improvement).
 */
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lessonId = req.nextUrl.searchParams.get("lessonId");
  if (!lessonId) {
    return NextResponse.json(
      { error: "Missing required query parameter: lessonId" },
      { status: 400 }
    );
  }

  try {
    const misconceptions = await getCommonMisconceptions(lessonId);
    return NextResponse.json({ misconceptions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Misconceptions API] GET error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
