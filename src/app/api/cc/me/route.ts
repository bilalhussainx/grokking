import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";
import { isAgentS1User } from "@/lib/cc/agent/s1-flag";

// The signed-in student's own profile fields read by /schools, /applications,
// the home walkthrough and /cc/transfer-profile. It was called in four places
// but never existed, so those pages silently fell back to defaults (and the
// transfer profile couldn't pre-fill saved answers).
const FIELDS =
  "id, preferred_name, grade_level, is_transfer_student, is_international, affordability_value, needs_full_aid, " +
  "transfer_current_school, transfer_credits_completed, transfer_target_term, transfer_reason, dashboard_observations_enabled";

type ProfileRow = { id: string } & Record<string, unknown>;

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { data, error } = await createAdminSupabase()
    .from("cc_student_profiles")
    .select(FIELDS)
    .eq("user_id", auth.user.id);
  if (error) return NextResponse.json({ error: "Could not load profile" }, { status: 500 });
  // cc_student_profiles has no unique user_id: pick one row deterministically.
  const rows = ((data ?? []) as unknown as ProfileRow[]).slice().sort((a, b) => a.id.localeCompare(b.id));
  // agentS1: the Coach routes this student's text turns to the S1 agent.
  return NextResponse.json({ profile: rows[0] ?? null, agentS1: isAgentS1User(auth.user.id) });
}
