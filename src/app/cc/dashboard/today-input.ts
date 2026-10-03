// Pure: the rows /cc/dashboard already reads → what Today may say. A null
// list means the read failed (shown as "Couldn't load"), which is different
// from an empty list. `todayIso` is the server's YYYY-MM-DD; ISO dates compare
// correctly as strings, so no Date object is needed here.
import { resolveCatalogDeadline } from "@/lib/cc/catalog-deadline";

export type DeadlineKey =
  | "deadline_ea" | "deadline_ed" | "deadline_edii" | "deadline_rea" | "deadline_rd"
  | "deadline_financial_aid" | "deadline_css_profile" | "deadline_fafsa";

type CatalogSchool = { name?: string; regular_deadline?: string | null; early_deadline?: string | null };
export type RawSchoolRow = { application_status: string | null; cc_schools: CatalogSchool | CatalogSchool[] | null } &
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
  // True when the full cc_student_schools select (which carries the
  // deadline_* columns) failed and the minimal fallback select succeeded.
  // Deadlines are then unknown, not absent, even though schools loaded.
  deadlinesUnavailable: boolean;
};

export type StatusCounts = { submitted: number; accepted: number; rejected: number; waitlisted: number; deferred: number; deposited: number };

export type UpcomingDeadline = { schoolName: string; label: string; date: string; fromCatalog: boolean };

export type TodayInput = {
  preferredName: string | null;
  schoolCount: number | null;
  // The next three dated items, soonest first. `fromCatalog` marks a date
  // inferred from the year-less school catalog rather than saved on the list.
  upcomingDeadlines: UpcomingDeadline[];
  statusCounts: StatusCounts | null;
  essaysTotal: number | null;
  essaysFinal: number | null;
  personalStatementPhase: string | null;
  activitiesCount: number | null;
  transfer: { currentSchool: string | null; targetTerm: string | null; creditsCompleted: number | null };
  observationsEnabled: boolean;
  observation: { eyebrow: string; text: string } | null;
  blockedNotice: boolean;
  deadlinesUnavailable: boolean;
};

const DEADLINES: Array<[DeadlineKey, string]> = [
  ["deadline_ea", "EA"], ["deadline_ed", "ED"], ["deadline_edii", "EDII"], ["deadline_rea", "REA"],
  ["deadline_rd", "RD"], ["deadline_financial_aid", "financial aid"], ["deadline_css_profile", "CSS Profile"],
  ["deadline_fafsa", "FAFSA"],
];

const EARLY_KEYS: DeadlineKey[] = ["deadline_ea", "deadline_ed", "deadline_edii", "deadline_rea"];

const STATUSES: Array<keyof StatusCounts> = ["submitted", "accepted", "rejected", "waitlisted", "deferred", "deposited"];

export function deriveTodayInput(raw: RawDashboardRows, todayIso: string): TodayInput {
  const { schools, essays, activities } = raw;

  const dated: UpcomingDeadline[] = [];
  for (const s of schools ?? []) {
    const school = Array.isArray(s.cc_schools) ? s.cc_schools[0] : s.cc_schools;
    const schoolName = school?.name ?? "A saved school";
    for (const [key, label] of DEADLINES) {
      const day = (s[key] ?? "").slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < todayIso) continue;
      dated.push({ schoolName, label, date: day, fromCatalog: false });
    }
    // A date saved on the list wins over the catalog's date for that round.
    const savedEarly = EARLY_KEYS.some((k) => s[k]);
    const catalog: Array<[string, string | null | undefined, boolean]> = [
      ["early round", school?.early_deadline, savedEarly],
      ["RD", school?.regular_deadline, Boolean(s.deadline_rd)],
    ];
    for (const [label, value, saved] of catalog) {
      const day = saved ? null : resolveCatalogDeadline(value, todayIso);
      if (day) dated.push({ schoolName, label, date: day, fromCatalog: true });
    }
  }
  const upcomingDeadlines = dated.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)).slice(0, 3);

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
    upcomingDeadlines,
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
    deadlinesUnavailable: raw.deadlinesUnavailable,
  };
}
