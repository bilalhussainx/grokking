import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { generateJoinCode, generateClassesFromCourse, autoGenerateHomework } from "@/lib/classroom";

// GET /api/classrooms — list classrooms for the current user
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = user.user_metadata?.role || "student";
  const db = createAdminSupabase();

  if (userRole === "teacher") {
    // Teachers see classrooms they created
    const { data, error } = await db
      .from("classrooms")
      .select("*")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Get enrollment counts
    const classroomIds = (data || []).map((c: { id: string }) => c.id);
    const { data: enrollments } = await db
      .from("classroom_enrollments")
      .select("classroom_id")
      .in("classroom_id", classroomIds)
      .eq("status", "active");

    const countMap: Record<string, number> = {};
    (enrollments || []).forEach((e: { classroom_id: string }) => {
      countMap[e.classroom_id] = (countMap[e.classroom_id] || 0) + 1;
    });

    const enriched = (data || []).map((c: { id: string }) => ({
      ...c,
      enrollment_count: countMap[c.id] || 0,
    }));

    return NextResponse.json(enriched);
  } else {
    // Students see classrooms they're enrolled in
    const { data: enrollments } = await db
      .from("classroom_enrollments")
      .select("classroom_id")
      .eq("student_id", user.id)
      .eq("status", "active");

    if (!enrollments?.length) return NextResponse.json([]);

    const classroomIds = enrollments.map((e: { classroom_id: string }) => e.classroom_id);
    const { data, error } = await db
      .from("classrooms")
      .select("*")
      .in("id", classroomIds)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  }
}

// POST /api/classrooms — create a new classroom (teachers only)
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = user.user_metadata?.role || "student";
  if (userRole !== "teacher") {
    return NextResponse.json({ error: "Only teachers can create classrooms" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, course_slug } = body;

  if (!title || !course_slug) {
    return NextResponse.json({ error: "Title and course are required" }, { status: 400 });
  }

  const db = createAdminSupabase();
  const joinCode = generateJoinCode();

  // 1. Create the classroom
  const { data: classroom, error: classroomError } = await db
    .from("classrooms")
    .insert({
      teacher_id: user.id,
      course_slug,
      title,
      description: description || null,
      join_code: joinCode,
      status: "active",
    })
    .select()
    .single();

  if (classroomError) {
    return NextResponse.json({ error: classroomError.message }, { status: 500 });
  }

  // 2. Auto-generate classes from course modules
  const classUnits = generateClassesFromCourse(course_slug);
  if (classUnits.length > 0) {
    const classRows = classUnits.map((unit) => ({
      classroom_id: classroom.id,
      title: unit.title,
      description: unit.description,
      class_order: unit.class_order,
      module_id: unit.module_id,
      lesson_ids: unit.lesson_ids,
      status: unit.status,
    }));

    const { data: insertedClasses, error: classError } = await db
      .from("classes")
      .insert(classRows)
      .select();

    if (classError) {
      console.error("Failed to create classes:", classError);
    }

    // 3. Auto-generate homework for each class
    if (insertedClasses) {
      for (const cls of insertedClasses) {
        const homework = autoGenerateHomework(course_slug, cls.lesson_ids || []);
        if (homework.length > 0) {
          const hwRows = homework.map((hw) => ({
            class_id: cls.id,
            ...hw,
          }));
          await db.from("class_homework").insert(hwRows);
        }
      }
    }
  }

  return NextResponse.json(classroom, { status: 201 });
}
