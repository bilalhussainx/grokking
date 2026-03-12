import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// GET /api/classrooms/[id]/submissions — get all submissions for a classroom
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createAdminSupabase();

  // Verify the classroom exists
  const { data: classroom, error: classroomError } = await db
    .from("classrooms")
    .select("id, teacher_id, course_slug")
    .eq("id", id)
    .single();

  if (classroomError || !classroom) {
    return NextResponse.json({ error: "Classroom not found" }, { status: 404 });
  }

  const isTeacher = classroom.teacher_id === user.userId;

  // If not the teacher, verify the user is an enrolled student
  if (!isTeacher) {
    const { data: enrollment } = await db
      .from("classroom_enrollments")
      .select("id")
      .eq("classroom_id", id)
      .eq("student_id", user.userId)
      .eq("status", "active")
      .single();

    if (!enrollment) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
  }

  // Get all classes for this classroom
  const { data: classes } = await db
    .from("classes")
    .select("id, title, class_order")
    .eq("classroom_id", id)
    .order("class_order", { ascending: true });

  if (!classes?.length) {
    return NextResponse.json([]);
  }

  const classIds = classes.map((c: { id: string }) => c.id);

  // Get all homework for these classes
  const { data: homework } = await db
    .from("class_homework")
    .select("id, class_id, title, source_lesson_id")
    .in("class_id", classIds);

  if (!homework?.length) {
    return NextResponse.json([]);
  }

  const homeworkIds = homework.map((hw: { id: string }) => hw.id);

  // Build the submissions query
  let submissionsQuery = db
    .from("homework_submissions")
    .select("*")
    .in("homework_id", homeworkIds)
    .order("submitted_at", { ascending: false });

  // Students only see their own submissions
  if (!isTeacher) {
    submissionsQuery = submissionsQuery.eq("student_id", user.userId);
  }

  const { data: submissions, error: submissionsError } = await submissionsQuery;

  if (submissionsError) {
    return NextResponse.json({ error: submissionsError.message }, { status: 500 });
  }

  // Build lookup maps for enrichment
  const classMap: Record<string, { id: string; title: string; class_order: number }> = {};
  for (const cls of classes) {
    classMap[cls.id] = cls;
  }

  const homeworkMap: Record<string, { id: string; class_id: string; title: string; source_lesson_id: string | null }> = {};
  for (const hw of homework) {
    homeworkMap[hw.id] = hw;
  }

  // Enrich submissions with homework and class info
  const enriched = (submissions || []).map((sub: { homework_id: string; [key: string]: unknown }) => {
    const hw = homeworkMap[sub.homework_id];
    const cls = hw ? classMap[hw.class_id] : null;
    return {
      ...sub,
      homework_title: hw?.title || null,
      class_title: cls?.title || null,
      class_order: cls?.class_order || null,
      source_lesson_id: hw?.source_lesson_id || null,
    };
  });

  return NextResponse.json(enriched);
}
