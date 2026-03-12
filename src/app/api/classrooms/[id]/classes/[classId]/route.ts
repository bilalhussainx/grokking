import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// PATCH /api/classrooms/[id]/classes/[classId] — unlock/update a class (teacher only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; classId: string }> }
) {
  const { id, classId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await verifyToken(token);
  if (!user || user.role !== "teacher") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = createAdminSupabase();

  // Verify teacher owns this classroom
  const { data: classroom } = await db
    .from("classrooms")
    .select("id")
    .eq("id", id)
    .eq("teacher_id", user.userId)
    .single();

  if (!classroom) {
    return NextResponse.json({ error: "Classroom not found" }, { status: 404 });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.status) {
    updates.status = body.status;
    if (body.status === "unlocked" || body.status === "in_progress") {
      updates.unlocked_at = new Date().toISOString();
    }
  }

  const { data, error } = await db
    .from("classes")
    .update(updates)
    .eq("id", classId)
    .eq("classroom_id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
