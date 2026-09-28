// src/app/cc/dashboard/page.tsx
// Today (GATE D4.2). Server side: the auth + onboarding gate, one read of the
// student's existing rows, then a pure view model passed to a client
// component as plain strings. The only clock read is the server's calendar
// day, used to skip past deadlines, and it never reaches the browser as
// something to recompute. The removed legacy Greeting rendered "Good evening ·
// Sat · Sep 27" on a UTC server and again in the student's timezone; that
// mismatch was production React #418.
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { selectVariant } from "./variants";
import { deriveTodayInput, type RawDashboardRows, type RawSchoolRow } from "./today-input";
import { buildTodayModel } from "./today-model";
import TodayDashboard from "@/components/cc/today/TodayDashboard";

export const dynamic = "force-dynamic";

type ProfileRow = {
  id: string;
  preferred_name: string | null;
  grade_level: number | null;
  is_transfer_student: boolean | null;
  language_picker_seen_at: string | null;
  transfer_current_school: string | null;
  transfer_target_term: string | null;
  transfer_credits_completed: number | null;
  dashboard_observations_enabled: boolean | null;
};

// A failed read resolves to null (shown as "Couldn't load"), never to [].
async function safe<T>(p: PromiseLike<{ data: T | null; error: unknown }>): Promise<T | null> {
  try {
    const { data, error } = await p;
    return error ? null : data;
  } catch {
    return null;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/cc/dashboard");

  // Tolerate a partial schema: try the full profile first, then the columns
  // that have always existed.
  let profile = await safe<ProfileRow>(
    supabase
      .from("cc_student_profiles")
      .select("id, preferred_name, grade_level, is_transfer_student, language_picker_seen_at, transfer_current_school, transfer_target_term, transfer_credits_completed, dashboard_observations_enabled")
      .eq("user_id", user.id)
      .maybeSingle<ProfileRow>(),
  );
  if (!profile) {
    const minimal = await safe<Pick<ProfileRow, "id" | "preferred_name" | "grade_level" | "language_picker_seen_at">>(
      supabase
        .from("cc_student_profiles")
        .select("id, preferred_name, grade_level, language_picker_seen_at")
        .eq("user_id", user.id)
        .maybeSingle(),
    );
    profile = minimal
      ? { ...minimal, is_transfer_student: false, transfer_current_school: null, transfer_target_term: null, transfer_credits_completed: null, dashboard_observations_enabled: null }
      : null;
  }
  if (!profile || profile.language_picker_seen_at == null) redirect("/onboarding");

  // Schools: the full row, or a minimal select if the deadline_* columns are
  // missing. Both failing → null → "Couldn't load".
  let schools = await safe<RawSchoolRow[]>(
    supabase
      .from("cc_student_schools")
      .select("application_status, deadline_ea, deadline_ed, deadline_edii, deadline_rea, deadline_rd, deadline_financial_aid, deadline_css_profile, deadline_fafsa, cc_schools(name)")
      .eq("student_id", profile.id),
  );
  if (!schools) {
    schools = await safe<RawSchoolRow[]>(
      supabase.from("cc_student_schools").select("application_status, cc_schools(name)").eq("student_id", profile.id),
    );
  }

  const observationsEnabled = profile.dashboard_observations_enabled !== false;
  const [essays, activities, observations] = await Promise.all([
    safe<{ phase: string | null; essay_type: string | null }[]>(
      supabase.from("cc_essays").select("phase, essay_type").eq("student_id", profile.id),
    ),
    safe<{ id: string }[]>(supabase.from("cc_activities").select("id").eq("student_id", profile.id)),
    observationsEnabled
      ? safe<{ module_label: string; observation: string; eyebrow: string }[]>(
          supabase
            .from("cc_dashboard_observations")
            .select("module_label, observation, eyebrow")
            .eq("student_id", profile.id)
            .gt("expires_at", new Date().toISOString()),
        )
      : Promise.resolve(null),
  ]);

  const raw: RawDashboardRows = {
    profile: {
      preferred_name: profile.preferred_name,
      transfer_current_school: profile.transfer_current_school,
      transfer_target_term: profile.transfer_target_term,
      transfer_credits_completed: profile.transfer_credits_completed,
      dashboard_observations_enabled: profile.dashboard_observations_enabled,
    },
    schools,
    essays,
    activities,
    observations,
    blocked: params.blocked === "grade9",
  };
  const variantKey = selectVariant(
    { is_transfer_student: profile.is_transfer_student, grade_level: profile.grade_level },
    schools ?? [],
  );
  const todayIso = new Date().toISOString().slice(0, 10); // server calendar day (UTC on Vercel)
  return <TodayDashboard model={buildTodayModel(variantKey, deriveTodayInput(raw, todayIso))} />;
}
