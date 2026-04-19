import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";

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

  const db = createAdminSupabase();
  const { error } = await db
    .from("cc_recommenders")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ updated: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const db = createAdminSupabase();
  const { error } = await db
    .from("cc_recommenders")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
