import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

interface ChanceResult {
  band: "reach" | "match" | "safety" | "extreme-reach";
  probability: number; // 0-100
  rationale: string;
  strengths: string[];
  weaknesses: string[];
  missingPieces: string[];
  academicFit: "below" | "at" | "above";
  essayStrength: "weak" | "average" | "strong" | "unknown";
  activitiesStrength: "weak" | "average" | "strong" | "unknown";
  interviewSignal: "negative" | "neutral" | "positive" | "none";
}

const SYSTEM_PROMPT = `You are a senior college admissions consultant with 15+ years experience reading applications for highly-selective US colleges.

You will receive a student's complete application snapshot and a target school's profile. Produce a holistic, realistic chance assessment — NOT a probability calculator, but a seasoned counselor's judgment.

RULES:
- Weight academics (GPA, rigor, test scores) against the school's 25th-75th percentile.
- Weight essays by review score and revision status. Drafts without reviews are weaker signals.
- Weight activities by impact scores if present, diversity of categories, and leadership depth.
- Honors at State/National/International level meaningfully lift odds.
- Interview recommendation is a TIEBREAKER, not a primary driver (1-5 scale).
- First-gen, international, and financial aid need all affect the admissions bar at different schools.
- Be honest. A 3.4 GPA at a Harvard-tier school is a reach even with great essays. Say so.
- Probability ranges: extreme-reach (1-9%), reach (10-29%), match (30-60%), safety (61-90%).
- For schools with <15% acceptance rate, only "match" or "safety" if the student is objectively top-tier.
- If needsFullAid=true and the school's needBlindInternational=false, downgrade the band by one tier and flag aid-admission risk in weaknesses. If in addition meetsFullNeedInternational=true, note that the student would still receive full aid *if admitted* — the risk is admission odds, not affordability. If meetsFullNeedInternational=false as well, also warn that affordability is uncertain even post-admission.

Return JSON ONLY:
{
  "band": "reach|match|safety|extreme-reach",
  "probability": 25,
  "rationale": "2-3 sentence realistic assessment",
  "strengths": ["bullet 1", "bullet 2"],
  "weaknesses": ["bullet 1", "bullet 2"],
  "missingPieces": ["what's incomplete or would strengthen"],
  "academicFit": "below|at|above",
  "essayStrength": "weak|average|strong|unknown",
  "activitiesStrength": "weak|average|strong|unknown",
  "interviewSignal": "negative|neutral|positive|none"
}`;

export async function POST(req: NextRequest, { params }: { params: Promise<{ school_id: string }> }) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { user } = auth;

  const { school_id } = await params;
  const db = createAdminSupabase();

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, preferred_name, legal_first_name, grade_level, state_province, country, is_first_gen, is_international, affordability_value, needs_full_aid")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Complete intake first" }, { status: 400 });
  }

  const { data: studentSchool } = await db
    .from("cc_student_schools")
    .select("id, school_id, application_plan, application_status")
    .eq("student_id", profile.id)
    .eq("school_id", school_id)
    .maybeSingle();

  if (!studentSchool) {
    return NextResponse.json({ error: "School not on your list" }, { status: 404 });
  }

  const { data: school } = await db
    .from("cc_schools")
    .select("id, name, city, state, acceptance_rate, sat_25, sat_75, act_25, act_75, avg_hs_gpa, school_type, test_policy, meets_full_need, need_blind_international, meets_full_need_international, pct_international_students_receiving_aid, first_gen_programs, alumni_interview_program, persona_slug")
    .eq("id", school_id)
    .maybeSingle();

  if (!school) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  const [academicRes, activitiesRes, honorsRes, essaysRes, supplementsRes, financialRes, interviewRes] = await Promise.all([
    db.from("cc_academic_profiles").select("gpa_unweighted, gpa_weighted, gpa_scale, class_rank, class_size, sat_total, sat_math, sat_erw, act_composite, test_strategy, ap_ib_courses").eq("student_id", profile.id).maybeSingle(),
    db.from("cc_activities").select("position, activity_type, organization, role, description_150, impact_score, grades_participated").eq("student_id", profile.id).order("position"),
    db.from("cc_honors").select("position, title, level, grade").eq("student_id", profile.id).order("position"),
    db.from("cc_essays").select("essay_type, word_count, revision_comments, school_id, supplement_id").eq("student_id", profile.id).is("supplement_id", null).not("current_draft", "is", null),
    db.from("cc_essays").select("essay_type, word_count, revision_comments, school_id, supplement_id").eq("student_id", profile.id).eq("school_id", school_id).not("supplement_id", "is", null),
    db.from("cc_financial_profiles").select("household_income_bracket, pell_eligible_estimate").eq("student_id", profile.id).maybeSingle(),
    (school.persona_slug
      ? db.from("interview_performance").select("overall_score, created_at").eq("user_id", user.id).eq("college_persona_id", school.persona_slug).order("created_at", { ascending: false }).limit(1)
      : Promise.resolve({ data: null })),
  ]);

  const academic = academicRes.data;
  const activities = activitiesRes.data || [];
  const honors = honorsRes.data || [];
  const personalEssays = essaysRes.data || [];
  const supplements = supplementsRes.data || [];
  const financial = financialRes.data;
  const latestInterview = Array.isArray(interviewRes.data) ? interviewRes.data[0] : null;

  const hasReviewedPersonal = personalEssays.some((e) => e.revision_comments);
  if (!hasReviewedPersonal) {
    return NextResponse.json({
      error: "Get your Common App essay reviewed first",
      gate: "essay_review",
    }, { status: 400 });
  }

  const optimizedActivities = activities.filter((a) => a.impact_score !== null).length;
  if (activities.length < 3 || optimizedActivities === 0) {
    return NextResponse.json({
      error: "Add at least 3 activities and run the optimizer first",
      gate: "activities",
    }, { status: 400 });
  }

  const ok = await deductCredits(user.id, CREDIT_COSTS.coach_text * 5, "admissions_chance");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const interviewRec = latestInterview
    ? Math.max(1, Math.min(5, Math.round((latestInterview.overall_score / 10) * 5)))
    : null;

  const snapshot = {
    student: {
      name: profile.preferred_name || profile.legal_first_name || "Student",
      grade: profile.grade_level,
      state: profile.state_province,
      country: profile.country,
      firstGen: profile.is_first_gen,
      international: profile.is_international,
      incomeBracket: financial?.household_income_bracket,
      pellEligible: financial?.pell_eligible_estimate,
      affordabilityValue: (profile as { affordability_value?: string | null }).affordability_value ?? null,
      needsFullAid: !!(profile as { needs_full_aid?: boolean | null }).needs_full_aid,
    },
    academics: academic ? {
      gpaUnweighted: academic.gpa_unweighted,
      gpaWeighted: academic.gpa_weighted,
      gpaScale: academic.gpa_scale,
      classRank: academic.class_rank,
      classSize: academic.class_size,
      satTotal: academic.sat_total,
      satMath: academic.sat_math,
      satErw: academic.sat_erw,
      actComposite: academic.act_composite,
      testStrategy: academic.test_strategy,
      apIbCount: Array.isArray(academic.ap_ib_courses) ? academic.ap_ib_courses.length : 0,
    } : null,
    activities: activities.map((a) => ({
      position: a.position,
      type: a.activity_type,
      role: a.role,
      organization: a.organization,
      description: a.description_150,
      impactScore: a.impact_score,
    })),
    honors: honors.map((h) => ({
      position: h.position,
      title: h.title,
      level: h.level,
      grade: h.grade,
    })),
    essays: {
      personalStatement: personalEssays.map((e) => ({
        type: e.essay_type,
        wordCount: e.word_count,
        reviewScore: (e.revision_comments as { promptFitScore?: number } | null)?.promptFitScore ?? null,
        reviewNotes: ((e.revision_comments as { overallNotes?: string } | null)?.overallNotes || "").slice(0, 300),
      }))[0] || null,
      supplementsCompleted: supplements.filter((s) => s.revision_comments).length,
      supplementsDrafted: supplements.length,
    },
    interview: latestInterview ? {
      recommendation: interviewRec,
      rawScore: latestInterview.overall_score,
    } : null,
  };

  const schoolContext = {
    name: school.name,
    location: `${school.city}, ${school.state}`,
    acceptanceRate: school.acceptance_rate,
    sat25_75: school.sat_25 && school.sat_75 ? `${school.sat_25}-${school.sat_75}` : null,
    act25_75: school.act_25 && school.act_75 ? `${school.act_25}-${school.act_75}` : null,
    avgHsGpa: school.avg_hs_gpa,
    testPolicy: school.test_policy,
    meetsFullNeed: school.meets_full_need,
    needBlindInternational: !!(school as { need_blind_international?: boolean | null }).need_blind_international,
    meetsFullNeedInternational: !!(school as { meets_full_need_international?: boolean | null }).meets_full_need_international,
    pctInternationalReceivingAid: (school as { pct_international_students_receiving_aid?: number | null }).pct_international_students_receiving_aid ?? null,
    firstGenPrograms: school.first_gen_programs,
    alumniInterviewProgram: school.alumni_interview_program,
  };

  const userContent = `TARGET SCHOOL:\n${JSON.stringify(schoolContext, null, 2)}\n\nSTUDENT APPLICATION SNAPSHOT:\n${JSON.stringify(snapshot, null, 2)}\n\nProvide a holistic chance assessment. Be realistic and specific. Return JSON only.`;

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userContent },
  ];

  const result = await callLLMJSON<ChanceResult>(messages, { maxTokens: 1200, temperature: 0.4 });

  if (!result) {
    return NextResponse.json({ error: "Couldn't compute chance — try again" }, { status: 500 });
  }

  const clamped: ChanceResult = {
    ...result,
    probability: Math.max(1, Math.min(95, Math.round(result.probability))),
  };

  if (studentSchool.id) {
    await db
      .from("cc_student_schools")
      .update({
        chancing_band: clamped.band === "extreme-reach" ? "reach" : clamped.band,
        chancing_rationale: clamped.rationale,
      })
      .eq("id", studentSchool.id);
  }

  return NextResponse.json({
    result: clamped,
    school: { id: school.id, name: school.name, acceptanceRate: school.acceptance_rate },
    computedAt: new Date().toISOString(),
  });
}
