// Adaptive Coach Kairos dashboard. Single route, six variants. Picks the
// right variant based on profile + computed phase, hydrates with live data,
// renders the shell.
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import {
  buildVariant,
  selectVariant,
  type DashboardData,
  type VariantKey,
} from "./variants";
import AdaptiveDashboard from "./AdaptiveDashboard";

export const dynamic = "force-dynamic";

type ProfileRow = {
  id: string;
  preferred_name: string | null;
  grade_level: number | null;
  is_transfer_student: boolean | null;
  is_international: boolean | null;
  language_picker_seen_at: string | null;
  transfer_current_school: string | null;
  transfer_target_term: string | null;
};

type StudentSchoolRow = {
  application_status: string | null;
  chancing_band: string | null;
  deadline_ea: string | null;
  deadline_ed: string | null;
  deadline_edii: string | null;
  deadline_rea: string | null;
  deadline_rd: string | null;
  deadline_financial_aid: string | null;
  deadline_css_profile: string | null;
  deadline_fafsa: string | null;
  cc_schools: { name?: string } | { name?: string }[] | null;
};

const DEADLINE_KEYS: Array<{ key: keyof Omit<StudentSchoolRow, "cc_schools" | "application_status" | "chancing_band">; label: string }> = [
  { key: "deadline_ea", label: "EA" },
  { key: "deadline_ed", label: "ED" },
  { key: "deadline_edii", label: "EDII" },
  { key: "deadline_rea", label: "REA" },
  { key: "deadline_rd", label: "RD" },
  { key: "deadline_financial_aid", label: "FinAid" },
  { key: "deadline_css_profile", label: "CSS" },
  { key: "deadline_fafsa", label: "FAFSA" },
];

function daysUntilLocal(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(y, (m ?? 1) - 1, d ?? 1);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function daysUntilCommonAppOpen(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getMonth() >= 7 ? today.getFullYear() + 1 : today.getFullYear();
  const aug1 = new Date(year, 7, 1);
  return Math.round((aug1.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/cc/dashboard");

  // Profile lookup — tolerate a partial schema (production may not have run
  // the latest migrations yet). Try the full select first; if it errors,
  // fall back to the minimal columns we know exist.
  let profile: ProfileRow | null = null;
  try {
    const full = await supabase
      .from("cc_student_profiles")
      .select(
        "id, preferred_name, grade_level, is_transfer_student, is_international, language_picker_seen_at, transfer_current_school, transfer_target_term",
      )
      .eq("user_id", user.id)
      .maybeSingle<ProfileRow>();
    if (full.error) throw full.error;
    profile = full.data;
  } catch {
    const fallback = await supabase
      .from("cc_student_profiles")
      .select("id, preferred_name, grade_level, is_international, language_picker_seen_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (fallback.data) {
      profile = {
        ...fallback.data,
        is_transfer_student: false,
        transfer_current_school: null,
        transfer_target_term: null,
      } as ProfileRow;
    }
  }

  if (!profile || profile.language_picker_seen_at == null) {
    redirect("/onboarding");
  }

  // Each side-table query is wrapped so a missing migration (e.g. cc_test_plan
  // or deadline_* columns) degrades to empty data instead of throwing the
  // whole server-component render. Parallelized via Promise.all.
  async function safe<T>(
    p: PromiseLike<{ data: T | null; error: unknown }>,
  ): Promise<T | null> {
    try {
      const { data, error } = await p;
      if (error) return null;
      return data;
    } catch {
      return null;
    }
  }

  // Schools — try the full row; fall back to a minimal select if the
  // deadline_* columns don't exist yet (Feature 2 migration not applied).
  let schools: Partial<StudentSchoolRow>[] | null = await safe<Partial<StudentSchoolRow>[]>(
    supabase
      .from("cc_student_schools")
      .select(
        `application_status, chancing_band,
         deadline_ea, deadline_ed, deadline_edii, deadline_rea, deadline_rd,
         deadline_financial_aid, deadline_css_profile, deadline_fafsa,
         cc_schools(name)`,
      )
      .eq("student_id", profile.id),
  );
  if (!schools) {
    schools = await safe<Partial<StudentSchoolRow>[]>(
      supabase
        .from("cc_student_schools")
        .select("application_status, chancing_band, cc_schools(name)")
        .eq("student_id", profile.id),
    );
  }

  const [essays, testPlan, activities, satAttempt] = await Promise.all([
    safe(
      supabase
        .from("cc_essays")
        .select("phase, essay_type")
        .eq("student_id", profile.id),
    ),
    safe(
      supabase
        .from("cc_test_plan")
        .select("recommended_test, next_sitting_date")
        .eq("student_id", profile.id)
        .maybeSingle(),
    ),
    safe(
      supabase
        .from("cc_activities")
        .select("id, impact_score")
        .eq("student_id", profile.id),
    ),
    // Most recent SAT attempt — drives the junior variant's SAT bars.
    safe(
      supabase
        .from("cc_test_attempts")
        .select("sat_reading, sat_math, total_score")
        .eq("student_id", profile.id)
        .eq("test_type", "SAT")
        .order("test_date", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ),
  ]);

  const schoolList = (schools ?? []) as StudentSchoolRow[];
  const essayList = (essays ?? []) as { phase: string | null; essay_type: string | null }[];
  const activityList = (activities ?? []) as { id: string; impact_score: number | null }[];

  // Reach / match / safety counts
  const reach = schoolList.filter((s) => s.chancing_band === "reach").length;
  const match = schoolList.filter((s) => s.chancing_band === "match").length;
  const safety = schoolList.filter((s) => s.chancing_band === "safety").length;

  // Next deadline across the school list (earliest >= today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let nextDeadline: DashboardData["nextDeadline"] = null;
  let urgent = 0;
  for (const s of schoolList) {
    const sch = Array.isArray(s.cc_schools) ? s.cc_schools[0] : s.cc_schools;
    const schoolName = sch?.name ?? "Unknown school";
    for (const { key, label } of DEADLINE_KEYS) {
      const v = s[key];
      if (!v) continue;
      const days = daysUntilLocal(v);
      if (days < 0) continue;
      if (days < 14) urgent++;
      if (!nextDeadline || days < nextDeadline.days) {
        nextDeadline = { schoolName, key: label, date: v, days };
      }
    }
  }

  // Waitlist
  const waitlistedRow = schoolList.find((s) => s.application_status === "waitlisted");
  const waitlistName = waitlistedRow
    ? (Array.isArray(waitlistedRow.cc_schools) ? waitlistedRow.cc_schools[0] : waitlistedRow.cc_schools)?.name ?? null
    : null;

  // Essay state
  const essaysSubmitted = essayList.filter((e) => e.phase === "submitted" || e.phase === "final").length;
  const essaysTotal = essayList.length;

  // Activities / test plan
  const activitiesAnalyzed = activityList.some((a) => a.impact_score != null);

  // ─── Phase 2.5 — derive bespoke priority module data ───────────────────
  // Personal statement phase — drives the senior_writing PS phase bar.
  const psEssay = essayList.find(
    (e) => (e as { essay_type: string | null }).essay_type === "personal_statement",
  );
  const personalStatementPhase = psEssay?.phase ?? null;

  // Decision counts — senior_post_submit / senior_decisions tracker.
  const decisionCounts = schoolList.length === 0
    ? null
    : {
        admitted: schoolList.filter(
          (s) => s.application_status === "accepted" || s.application_status === "deposited",
        ).length,
        waitlisted: schoolList.filter((s) => s.application_status === "waitlisted").length,
        denied: schoolList.filter((s) => s.application_status === "rejected").length,
        pending: schoolList.filter(
          (s) => s.application_status === "submitted" || s.application_status === "deferred",
        ).length,
      };

  // SAT sub-scores from the most recent attempt.
  const sat = satAttempt as
    | { sat_reading?: number | null; sat_math?: number | null; total_score?: number | null }
    | null;

  const data: DashboardData = {
    preferredName: profile.preferred_name ?? null,
    gradeLabel: profile.is_transfer_student
      ? "Transfer applicant"
      : profile.grade_level
        ? `Grade ${profile.grade_level}`
        : null,
    daysToCommonApp: daysUntilCommonAppOpen(),
    schoolCount: schoolList.length,
    schoolReachCount: reach,
    schoolMatchCount: match,
    schoolSafetyCount: safety,
    nextDeadline,
    urgentDeadlineCount: urgent,
    essaysSubmittedCount: essaysSubmitted,
    essaysTotal,
    activitiesCount: activityList.length,
    activitiesAnalyzed,
    satRecommendation:
      ((testPlan as { recommended_test?: string } | null)?.recommended_test ?? null) === "UNDECIDED"
        ? null
        : ((testPlan as { recommended_test?: string } | null)?.recommended_test ?? null),
    satNextSitting: (testPlan as { next_sitting_date?: string | null } | null)?.next_sitting_date ?? null,
    hasWaitlistedSchool: Boolean(waitlistedRow),
    waitlistSchoolName: waitlistName,
    hasGPA: false, // future: pull from cc_academic_profiles
    isInternational: Boolean(profile.is_international),
    transferCurrentSchool: profile.transfer_current_school ?? null,
    transferTargetTerm: profile.transfer_target_term ?? null,
    personalStatementPhase,
    decisionCounts,
    satReading: sat?.sat_reading ?? null,
    satMath: sat?.sat_math ?? null,
    satTotal: sat?.total_score ?? null,
  };

  const variantKey: VariantKey = selectVariant(
    { is_transfer_student: profile.is_transfer_student, grade_level: profile.grade_level },
    schoolList,
  );
  const variant = buildVariant(variantKey, data);

  return <AdaptiveDashboard data={data} variant={variant} variantKey={variantKey} />;
}
