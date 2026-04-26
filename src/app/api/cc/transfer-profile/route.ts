import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, ensureStudentProfile } from "../helpers";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const profile = await ensureStudentProfile(auth.supabase, auth.user);

  const { error } = await auth.supabase
    .from("cc_student_profiles")
    .update({
      is_transfer_student: Boolean(body.isTransferStudent ?? true),
      transfer_current_school: body.transferCurrentSchool ?? null,
      transfer_credits_completed: body.transferCreditsCompleted ?? null,
      transfer_target_term: body.transferTargetTerm ?? null,
      transfer_reason: body.transferReason ?? null,
    })
    .eq("id", profile.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
