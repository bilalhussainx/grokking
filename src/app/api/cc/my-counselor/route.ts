import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";

// The signed-in student's active counselor link, named for display (QA-05:
// students used to join an agency and never learn who they were linked to).
export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const db = createAdminSupabase();

  const { data: link } = await db
    .from("cc_student_counselor_links")
    .select("agency_id, primary_counselor_user_id, linked_at")
    .eq("student_user_id", auth.user.id)
    .eq("status", "active")
    .order("linked_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!link) return NextResponse.json({ counselor: null });

  let counselorName: string | null = null;
  if (link.primary_counselor_user_id) {
    const { data: c } = await db
      .from("cc_counselors")
      .select("display_name")
      .eq("user_id", link.primary_counselor_user_id)
      .maybeSingle();
    counselorName = c?.display_name ?? null;
  }
  const { data: agency } = await db.from("cc_agencies").select("name").eq("id", link.agency_id).maybeSingle();

  return NextResponse.json({
    counselor: {
      displayName: counselorName ?? agency?.name ?? "Your counselor",
      agencyName: agency?.name ?? null,
      linkedAt: link.linked_at,
    },
  });
}
