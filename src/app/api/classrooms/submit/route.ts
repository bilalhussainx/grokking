import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// POST /api/classrooms/submit — submit code for grading
// Supports two modes:
// 1. Classroom homework: { classroom_id, homework_id, code }
// 2. Session submission: { session_id, lesson_id, code, score, passed, feedback }
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = createAdminSupabase();

  // Mode 2: Session-based submission (no classroom required)
  if (body.session_id) {
    const { session_id, lesson_id, code, language, score, passed, feedback } = body;

    // Store as a session submission in a generic way
    // Use session_messages table with type "submission" to persist
    const { error } = await db.from("session_messages").insert({
      session_id,
      user_id: user.userId,
      content: code,
      message_type: "submission",
      metadata: {
        sender_name: user.name,
        lesson_id,
        language: language || "python",
        score,
        passed,
        feedback,
        submitted_at: new Date().toISOString(),
      },
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "Submission recorded", score, passed }, { status: 201 });
  }

  // Mode 1: Classroom homework submission
  const { classroom_id, homework_id, code } = body;
  if (!classroom_id || !homework_id || !code) {
    return NextResponse.json({ error: "classroom_id, homework_id, and code are required" }, { status: 400 });
  }

  // Verify enrollment
  const { data: enrollment } = await db
    .from("classroom_enrollments")
    .select("id")
    .eq("classroom_id", classroom_id)
    .eq("student_id", user.userId)
    .eq("status", "active")
    .single();

  if (!enrollment) {
    return NextResponse.json({ error: "You are not enrolled in this classroom" }, { status: 403 });
  }

  // Insert homework submission
  const { data: submission, error: submitError } = await db
    .from("homework_submissions")
    .insert({
      homework_id,
      student_id: user.userId,
      code,
      status: "submitted",
    })
    .select()
    .single();

  if (submitError) return NextResponse.json({ error: submitError.message }, { status: 500 });
  return NextResponse.json(submission, { status: 201 });
}

// GET /api/classrooms/submit?homework_id=xxx OR ?session_id=xxx
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const homeworkId = searchParams.get("homework_id");
  const sessionId = searchParams.get("session_id");
  const db = createAdminSupabase();

  if (sessionId) {
    // Get session submissions
    const { data, error } = await db
      .from("session_messages")
      .select("*")
      .eq("session_id", sessionId)
      .eq("message_type", "submission")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Filter: teachers see all, students see own
    const filtered = user.role === "teacher"
      ? data
      : (data || []).filter((m: { user_id: string }) => m.user_id === user.userId);

    return NextResponse.json(filtered || []);
  }

  if (homeworkId) {
    const query = db
      .from("homework_submissions")
      .select("*")
      .eq("homework_id", homeworkId)
      .order("submitted_at", { ascending: false });

    if (user.role !== "teacher") {
      query.eq("student_id", user.userId);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  }

  return NextResponse.json({ error: "homework_id or session_id required" }, { status: 400 });
}
