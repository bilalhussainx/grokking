import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";
import { createServerSupabase } from "@/lib/supabase-auth";

// POST /api/classrooms/[id]/enroll — student joins via join code
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { join_code } = body;

  const db = createAdminSupabase();

  // Verify classroom exists and join code matches
  const { data: classroom, error } = await db
    .from("classrooms")
    .select("id, status")
    .eq("id", id)
    .eq("join_code", join_code)
    .single();

  if (error || !classroom) {
    return NextResponse.json({ error: "Invalid classroom or join code" }, { status: 404 });
  }

  if (classroom.status !== "active") {
    return NextResponse.json({ error: "This classroom is not accepting enrollments" }, { status: 400 });
  }

  // Check if already enrolled
  const { data: existing } = await db
    .from("classroom_enrollments")
    .select("id, status")
    .eq("classroom_id", id)
    .eq("student_id", user.id)
    .single();

  if (existing) {
    if (existing.status === "active") {
      return NextResponse.json({ message: "Already enrolled" });
    }
    // Re-activate dropped enrollment
    await db
      .from("classroom_enrollments")
      .update({ status: "active" })
      .eq("id", existing.id);
    return NextResponse.json({ message: "Re-enrolled successfully" });
  }

  // Create enrollment
  const { error: enrollError } = await db
    .from("classroom_enrollments")
    .insert({
      classroom_id: id,
      student_id: user.id,
      status: "active",
    });

  if (enrollError) {
    return NextResponse.json({ error: enrollError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Enrolled successfully" }, { status: 201 });
}
