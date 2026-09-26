import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { getStudentProfileId, isUuid } from "@/lib/cc/ownership";

const notFound = () => NextResponse.json({ error: "Recommender not found" }, { status: 404 });

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const body = await req.json();
  const { status, name, subject, email, asked_at, submitted_at } = body as {
    status?: string;
    name?: string;
    subject?: string;
    email?: string;
    asked_at?: string;
    submitted_at?: string;
  };

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (name) updates.name = name;
  if (subject !== undefined) updates.subject = subject;
  if (email !== undefined) updates.email = email;
  if (asked_at) updates.asked_at = asked_at;
  if (submitted_at) updates.submitted_at = submitted_at;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }
  if (!isUuid(id)) return notFound();

  const db = createAdminSupabase();
  const profileId = await getStudentProfileId(db, auth.user.id);
  if (!profileId) return notFound();

  const { data: updated, error } = await db
    .from("cc_recommenders")
    .update(updates)
    .eq("id", id)
    .eq("student_id", profileId)
    .select("id");

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  if (!updated || updated.length === 0) return notFound();

  return NextResponse.json({ updated: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;
  if (!isUuid(id)) return notFound();

  const db = createAdminSupabase();
  const profileId = await getStudentProfileId(db, auth.user.id);
  if (!profileId) return notFound();

  const { data: deleted, error } = await db
    .from("cc_recommenders")
    .delete()
    .eq("id", id)
    .eq("student_id", profileId)
    .select("id");

  if (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
  if (!deleted || deleted.length === 0) return notFound();

  return NextResponse.json({ deleted: true });
}
