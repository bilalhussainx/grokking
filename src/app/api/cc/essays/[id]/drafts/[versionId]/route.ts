import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../../helpers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; versionId: string }> },
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id, versionId } = await params;

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { data: essay } = await db
    .from("cc_essays")
    .select("id")
    .eq("id", id)
    .eq("student_id", profile.id)
    .single();
  if (!essay) return NextResponse.json({ error: "Essay not found" }, { status: 404 });

  const { data: draft, error } = await db
    .from("cc_essay_drafts")
    .select("*")
    .eq("id", versionId)
    .eq("essay_id", id)
    .single();

  if (error || !draft) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }
  return NextResponse.json({ draft });
}
