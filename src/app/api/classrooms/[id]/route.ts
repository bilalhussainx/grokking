import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// GET /api/classrooms/[id] — get classroom details with classes
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

  // Fetch classroom
  const { data: classroom, error } = await db
    .from("classrooms")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !classroom) {
    return NextResponse.json({ error: "Classroom not found" }, { status: 404 });
  }

  // Check access: teacher who owns it or enrolled student
  if (classroom.teacher_id !== user.userId) {
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

  // Fetch classes ordered
  const { data: classes } = await db
    .from("classes")
    .select("*")
    .eq("classroom_id", id)
    .order("class_order", { ascending: true });

  // Fetch enrollment count
  const { count } = await db
    .from("classroom_enrollments")
    .select("*", { count: "exact", head: true })
    .eq("classroom_id", id)
    .eq("status", "active");

  // Fetch homework for each class
  const classIds = (classes || []).map((c: { id: string }) => c.id);
  const { data: homework } = classIds.length
    ? await db.from("class_homework").select("*").in("class_id", classIds)
    : { data: [] };

  // Attach homework to classes
  const classesWithHomework = (classes || []).map((cls: { id: string }) => ({
    ...cls,
    homework: (homework || []).filter((hw: { class_id: string }) => hw.class_id === cls.id),
  }));

  return NextResponse.json({
    ...classroom,
    classes: classesWithHomework,
    enrollment_count: count || 0,
  });
}

// PATCH /api/classrooms/[id] — update classroom (teacher only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await verifyToken(token);
  if (!user || user.role !== "teacher") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = createAdminSupabase();
  const body = await req.json();

  const { data, error } = await db
    .from("classrooms")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("teacher_id", user.userId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
