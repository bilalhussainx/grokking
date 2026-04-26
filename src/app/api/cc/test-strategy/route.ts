// GET/POST /api/cc/test-strategy — manages cc_test_plan (recommendation,
// fee-waiver eligibility, next sitting). POST stores the user's quiz
// answers, computes recommendation + fee-waiver, persists the plan.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase, ensureStudentProfile } from "../helpers";
import { recommendSATorACT, feeWaiverEligibility } from "@/lib/tests/sat-act-quiz";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ plan: null });
  const { data } = await db.from("cc_test_plan").select("*").eq("student_id", profile.id).maybeSingle();
  return NextResponse.json({ plan: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    answers?: Array<"SAT" | "ACT" | "NEUTRAL">;
    nextSittingDate?: string | null;
    receivesFreeReducedLunch?: boolean;
    receivesPublicAssistance?: boolean;
  };

  const profile = await ensureStudentProfile(auth.supabase, auth.user);
  const db = createAdminSupabase();

  // Pull demographic flags for the fee waiver computation.
  const { data: demo } = await db
    .from("cc_student_profiles")
    .select("is_international, country, is_first_gen")
    .eq("id", profile.id)
    .maybeSingle();

  let recommendation: ReturnType<typeof recommendSATorACT> | null = null;
  if (Array.isArray(body.answers) && body.answers.length === 6) {
    recommendation = recommendSATorACT(body.answers);
  }

  const waiver = feeWaiverEligibility({
    isInternational: Boolean(demo?.is_international),
    countryCode: demo?.country ?? null,
    isFirstGen: Boolean(demo?.is_first_gen),
    receivesFreeReducedLunch: Boolean(body.receivesFreeReducedLunch),
    receivesPublicAssistance: Boolean(body.receivesPublicAssistance),
  });

  const planRow = {
    student_id: profile.id,
    recommended_test: recommendation?.test ?? "UNDECIDED",
    recommendation_reasons: recommendation?.reasons ?? [],
    fee_waiver_eligible: waiver.eligible,
    fee_waiver_reason: waiver.reason,
    next_sitting_date: body.nextSittingDate ?? null,
    registration_url:
      recommendation?.test === "ACT"
        ? "https://www.act.org/content/act/en/products-and-services/the-act/registration.html"
        : "https://satsuite.collegeboard.org/sat/registration",
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await db
    .from("cc_test_plan")
    .select("student_id")
    .eq("student_id", profile.id)
    .maybeSingle();

  if (existing) {
    await db.from("cc_test_plan").update(planRow).eq("student_id", profile.id);
  } else {
    await db.from("cc_test_plan").insert(planRow);
  }

  return NextResponse.json({ plan: planRow, recommendation, waiver });
}
