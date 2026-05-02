// POST /api/cc/onboarding/complete — saves the full multi-step onboarding
// payload (language + role + grade OR transfer profile + concerns) in one
// transaction. Sets BOTH language_picker_seen_at (middleware sentinel — so
// we stop redirecting back to /onboarding) AND intake_completed_at (coach
// mode-detector sentinel — so the coach doesn't ask name+grade on every
// first turn). The new multi-step onboarding captures the same identity
// surface the legacy /intake captured, so both flags should flip together.
// Cross-persona regression confirmed in 2026-05-02 OpenClaw audit (AUD-P1-002).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, ensureStudentProfile } from "../../helpers";
import { COACH_LANGUAGES } from "@/lib/cc/coach-languages";

const ALLOWED_LANGS = new Set(COACH_LANGUAGES.map((l) => l.code));
const ALLOWED_CONCERNS = new Set(["deadlines", "aid", "essays", "activities", "interviews", "unsure"]);

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    language?: string;
    role?: "hs" | "tx";
    grade?: number | null;
    concerns?: string[];
    transfer?: {
      currentSchool?: string;
      creditsCompleted?: number | null;
      targetTerm?: string;
      gpa?: string;
      reason?: string;
    } | null;
  };

  if (!body.language || !ALLOWED_LANGS.has(body.language)) {
    return NextResponse.json({ error: "Missing or unsupported language" }, { status: 400 });
  }
  if (body.role !== "hs" && body.role !== "tx") {
    return NextResponse.json({ error: "Missing role" }, { status: 400 });
  }
  if (body.role === "hs" && (!body.grade || body.grade < 9 || body.grade > 13)) {
    return NextResponse.json({ error: "Missing or invalid grade" }, { status: 400 });
  }
  if (body.role === "tx") {
    const t = body.transfer;
    if (!t?.currentSchool || !t.targetTerm || !t.reason || (t.reason ?? "").trim().length < 12) {
      return NextResponse.json({ error: "Incomplete transfer profile" }, { status: 400 });
    }
  }

  // Ensure profile row exists (lazy creation — same path /api/cc/profile/voice
  // uses).
  await ensureStudentProfile(auth.supabase, auth.user);

  const cleanedConcerns = (body.concerns ?? [])
    .filter((c): c is string => typeof c === "string" && ALLOWED_CONCERNS.has(c))
    .slice(0, 2);

  const now = new Date().toISOString();
  const update: Record<string, unknown> = {
    home_language: body.language,
    language_picker_seen_at: now,
    intake_completed_at: now,
    concerns: cleanedConcerns,
  };

  if (body.role === "hs") {
    update.is_transfer_student = false;
    update.grade_level = body.grade ?? null;
    update.transfer_current_school = null;
    update.transfer_credits_completed = null;
    update.transfer_target_term = null;
    update.transfer_reason = null;
  } else {
    update.is_transfer_student = true;
    update.grade_level = null;
    update.transfer_current_school = body.transfer?.currentSchool?.trim() ?? null;
    update.transfer_credits_completed =
      body.transfer?.creditsCompleted == null ? null : Number(body.transfer.creditsCompleted);
    update.transfer_target_term = body.transfer?.targetTerm?.trim() ?? null;
    update.transfer_reason = body.transfer?.reason?.trim() ?? null;
    // GPA is stored on cc_academic_profiles separately; we skip persisting
    // it from onboarding to avoid an extra round-trip. The student can fill
    // it in on the /cc/courses page later.
  }

  const { error } = await auth.supabase
    .from("cc_student_profiles")
    .update(update)
    .eq("user_id", auth.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    profile: {
      language: body.language,
      grade: update.grade_level ?? null,
      isTransfer: update.is_transfer_student === true,
      concerns: cleanedConcerns,
    },
  });
}
