import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, ensureStudentProfile } from "../../helpers";
import { assertCapacity, blockedResponse } from "@/lib/cc/tier-gate";
import { seedDeadlinesFor } from "@/lib/applications/deadlines";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;

  const { school_id, chancing_band } = await req.json();
  if (!school_id) {
    return NextResponse.json({ error: "school_id required" }, { status: 400 });
  }

  const profile = await ensureStudentProfile(supabase, user);

  // Dedupe before counting — an update to an existing row should not count
  // against the tier cap.
  const { data: existing } = await supabase
    .from("cc_student_schools")
    .select("id")
    .eq("student_id", profile.id)
    .eq("school_id", school_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "School already in list" }, { status: 409 });
  }

  const { count: currentCount } = await supabase
    .from("cc_student_schools")
    .select("id", { count: "exact", head: true })
    .eq("student_id", profile.id);

  const check = await assertCapacity(user.id, "schoolsMax", currentCount ?? 0);
  if (!check.ok) return blockedResponse(check);

  // Auto-populate deadlines from data/school-deadlines-2026.json (Feature 2).
  // Look up by school name from cc_schools so the seed (keyed on common
  // school names) matches without requiring an explicit school_id mapping.
  const { data: schoolMeta } = await supabase
    .from("cc_schools")
    .select("name, country")
    .eq("id", school_id)
    .maybeSingle();
  const deadlinesSeed = schoolMeta?.name ? seedDeadlinesFor(schoolMeta.name, schoolMeta.country) : null;

  const { data, error } = await supabase
    .from("cc_student_schools")
    .insert({
      student_id: profile.id,
      school_id,
      chancing_band: chancing_band || "unknown",
      application_status: "researching",
      ...(deadlinesSeed ?? {}),
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ added: true, id: data.id });
}
