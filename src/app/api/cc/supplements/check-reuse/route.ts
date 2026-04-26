// POST /api/cc/supplements/check-reuse — checks the given draft against all
// other supplement drafts the student has saved. Returns a reuse score +
// optional schoolLeakage warning.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { detectReuse } from "@/lib/supplements/reuse-detector";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    draft?: string;
    schoolName?: string;
    excludeEssayId?: string;
  };
  const draft = body.draft?.trim();
  const schoolName = body.schoolName?.trim();
  const exclude = body.excludeEssayId ?? null;
  if (!draft || !schoolName || draft.length < 30) {
    return NextResponse.json({ flagged: false, reuseScore: 0, schoolLeakageDetected: null });
  }

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) {
    return NextResponse.json({ flagged: false, reuseScore: 0, schoolLeakageDetected: null });
  }

  const { data: rows } = await db
    .from("cc_essays")
    .select("id, current_draft, cc_schools(name)")
    .eq("student_id", profile.id)
    .like("essay_type", "supplement%");

  type RawRow = {
    id: string;
    current_draft: string | null;
    cc_schools?: { name?: string } | { name?: string }[] | null;
  };

  const others = ((rows ?? []) as RawRow[])
    .filter((r) => r.id !== exclude)
    .map((r) => {
      const sch = Array.isArray(r.cc_schools) ? r.cc_schools[0] : r.cc_schools;
      return { id: r.id, school_name: sch?.name ?? "Unknown", current_draft: r.current_draft };
    });

  const finding = detectReuse(draft, schoolName, others);
  return NextResponse.json(finding);
}
