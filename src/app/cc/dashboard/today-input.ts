// Pure: the rows /cc/dashboard already reads → what Today may say. A null
// list means the read failed (shown as "Couldn't load"), which is different
// from an empty list. `todayIso` is the server's YYYY-MM-DD; ISO dates compare
// correctly as strings, so no Date object is needed here.
export type DeadlineKey =
  | "deadline_ea" | "deadline_ed" | "deadline_edii" | "deadline_rea" | "deadline_rd"
  | "deadline_financial_aid" | "deadline_css_profile" | "deadline_fafsa";

export type RawSchoolRow = { application_status: string | null; cc_schools: { name?: string } | { name?: string }[] | null } &
  Partial<Record<DeadlineKey, string | null>>;

export type RawDashboardRows = {
  profile: {
    preferred_name: string | null;
    transfer_current_school: string | null;
    transfer_target_term: string | null;
    transfer_credits_completed: number | null;
    dashboard_observations_enabled: boolean | null;
  };
  schools: RawSchoolRow[] | null;
  essays: { phase: string | null; essay_type: string | null }[] | null;
  activities: { id: string }[] | null;
  observations: { module_label: string; observation: string; eyebrow: string }[] | null;
  blocked: boolean;
};

export type StatusCounts = { submitted: number; accepted: number; rejected: number; waitlisted: number; deferred: number; deposited: number };

export type TodayInput = {
  preferredName: string | null;
  schoolCount: number | null;
  nextDeadline: { schoolName: string; label: string; date: string } | null;
  statusCounts: StatusCounts | null;
  essaysTotal: number | null;
  essaysFinal: number | null;
  personalStatementPhase: string | null;
  activitiesCount: number | null;
  transfer: { currentSchool: string | null; targetTerm: string | null; creditsCompleted: number | null };
  observationsEnabled: boolean;
  observation: { eyebrow: string; text: string } | null;
  blockedNotice: boolean;
};

const DEADLINES: Array<[DeadlineKey, string]> = [
  ["deadline_ea", "EA"], ["deadline_ed", "ED"], ["deadline_edii", "EDII"], ["deadline_rea", "REA"],
  ["deadline_rd", "RD"], ["deadline_financial_aid", "financial aid"], ["deadline_css_profile", "CSS Profile"],
  ["deadline_fafsa", "FAFSA"],
];

const STATUSES: Array<keyof StatusCounts> = ["submitted", "accepted", "rejected", "waitlisted", "deferred", "deposited"];

export function deriveTodayInput(raw: RawDashboardRows, todayIso: string): TodayInput {
  const { schools, essays, activities } = raw;

  let nextDeadline: TodayInput["nextDeadline"] = null;
  for (const s of schools ?? []) {
    const school = Array.isArray(s.cc_schools) ? s.cc_schools[0] : s.cc_schools;
    for (const [key, label] of DEADLINES) {
      const day = (s[key] ?? "").slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < todayIso) continue;
      if (!nextDeadline || day < nextDeadline.date) {
        nextDeadline = { schoolName: school?.name ?? "A saved school", label, date: day };
      }
    }
  }

  let statusCounts: StatusCounts | null = null;
  if (schools) {
    statusCounts = { submitted: 0, accepted: 0, rejected: 0, waitlisted: 0, deferred: 0, deposited: 0 };
    for (const s of schools) {
      const st = s.application_status as keyof StatusCounts | null;
      if (st && STATUSES.includes(st)) statusCounts[st] += 1;
    }
  }

  const observationsEnabled = raw.profile.dashboard_observations_enabled !== false;
  const firstObservation = observationsEnabled
    ? [...(raw.observations ?? [])].sort((a, b) => a.module_label.localeCompare(b.module_label))[0]
    : undefined;

  return {
    preferredName: raw.profile.preferred_name,
    schoolCount: schools ? schools.length : null,
    nextDeadline,
    statusCounts,
    essaysTotal: essays ? essays.length : null,
    essaysFinal: essays ? essays.filter((e) => e.phase === "submitted" || e.phase === "final").length : null,
    personalStatementPhase: essays?.find((e) => e.essay_type === "personal_statement")?.phase ?? null,
    activitiesCount: activities ? activities.length : null,
    transfer: {
      currentSchool: raw.profile.transfer_current_school?.trim() || null,
      targetTerm: raw.profile.transfer_target_term?.trim() || null,
      creditsCompleted: raw.profile.transfer_credits_completed ?? null,
    },
    observationsEnabled,
    observation: firstObservation ? { eyebrow: firstObservation.eyebrow, text: firstObservation.observation } : null,
    blockedNotice: raw.blocked,
  };
}
