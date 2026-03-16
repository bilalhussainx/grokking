import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";
import { createServerSupabase } from "@/lib/supabase-auth";

// POST /api/classrooms/join — join a classroom by code only (no ID needed)
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { join_code } = await req.json();
  if (!join_code) {
    return NextResponse.json({ error: "Join code is required" }, { status: 400 });
  }

  const db = createAdminSupabase();

  // Find classroom by join code
  const { data: classroom } = await db
    .from("classrooms")
    .select("id, title, status, course_slug")
    .eq("join_code", join_code.toUpperCase().trim())
    .single();

  if (!classroom) {
    return NextResponse.json({ error: "Invalid join code" }, { status: 404 });
  }

  if (classroom.status !== "active") {
    return NextResponse.json({ error: "This classroom is not accepting students" }, { status: 400 });
  }

  // Check existing enrollment
  const { data: existing } = await db
    .from("classroom_enrollments")
    .select("id, status")
    .eq("classroom_id", classroom.id)
    .eq("student_id", user.id)
    .single();

  if (existing?.status === "active") {
    return NextResponse.json({ classroom, message: "Already enrolled" });
  }

  if (existing) {
    await db
      .from("classroom_enrollments")
      .update({ status: "active" })
      .eq("id", existing.id);
  } else {
    const { error } = await db
      .from("classroom_enrollments")
      .insert({ classroom_id: classroom.id, student_id: user.id, status: "active" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ classroom, message: "Enrolled successfully" }, { status: 201 });
}
