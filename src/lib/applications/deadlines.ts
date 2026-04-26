import schoolDeadlines from "@/data/school-deadlines-2026.json";

export type DeadlineKey =
  | "deadline_ea"
  | "deadline_ed"
  | "deadline_edii"
  | "deadline_rea"
  | "deadline_rd"
  | "deadline_financial_aid"
  | "deadline_css_profile"
  | "deadline_fafsa";

export type SchoolDeadlineRow = {
  id: string;
  school_name: string;
  application_plan: string | null;
  application_status: string | null;
  deadline_ea: string | null;
  deadline_ed: string | null;
  deadline_edii: string | null;
  deadline_rea: string | null;
  deadline_rd: string | null;
  deadline_financial_aid: string | null;
  deadline_css_profile: string | null;
  deadline_fafsa: string | null;
  common_app_filled: boolean;
  essays_complete: boolean;
  supplements_complete: boolean;
  recs_submitted: boolean;
  transcript_submitted: boolean;
  test_scores_submitted: boolean;
  financial_aid_filed: boolean;
  portal_url: string | null;
  notes: string | null;
};

const COMPONENT_FIELDS = [
  "common_app_filled",
  "essays_complete",
  "supplements_complete",
  "recs_submitted",
  "transcript_submitted",
  "test_scores_submitted",
  "financial_aid_filed",
] as const;

const DEADLINE_KEYS: DeadlineKey[] = [
  "deadline_ea",
  "deadline_ed",
  "deadline_edii",
  "deadline_rea",
  "deadline_rd",
  "deadline_financial_aid",
  "deadline_css_profile",
  "deadline_fafsa",
];

export function componentProgress(
  row: Pick<SchoolDeadlineRow, (typeof COMPONENT_FIELDS)[number]>,
): { complete: number; total: number; pct: number } {
  let complete = 0;
  for (const k of COMPONENT_FIELDS) {
    if (row[k]) complete++;
  }
  return { complete, total: COMPONENT_FIELDS.length, pct: Math.round((complete / COMPONENT_FIELDS.length) * 100) };
}

export function nextUpcomingDeadline(row: SchoolDeadlineRow): { key: DeadlineKey; date: string } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let best: { key: DeadlineKey; date: string; ms: number } | null = null;
  for (const k of DEADLINE_KEYS) {
    const v = row[k];
    if (!v) continue;
    const d = new Date(v);
    if (d.getTime() < today.getTime()) continue;
    if (!best || d.getTime() < best.ms) best = { key: k, date: v, ms: d.getTime() };
  }
  return best ? { key: best.key, date: best.date } : null;
}

export function daysUntil(dateStr: string): number {
  // Parse YYYY-MM-DD as a *local* date so it lines up with new Date() — naive
  // `new Date("2026-05-06")` parses as UTC midnight which slides to the
  // previous local day in negative-offset timezones.
  const [y, m, d] = dateStr.split("-").map((s) => Number(s));
  const target = new Date(y, (m ?? 1) - 1, d ?? 1);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function urgencyClass(days: number): "urgent" | "soon" | "ok" {
  if (days < 0) return "ok";
  if (days < 14) return "urgent";
  if (days < 30) return "soon";
  return "ok";
}

// Look up deadlines for a school name. Tries exact match, then case-insensitive,
// then "first word match" (e.g. "Massachusetts Institute of Technology" -> "MIT" via alias).
export function lookupSchoolDeadlines(schoolName: string): Partial<SchoolDeadlineRow> | null {
  if (!schoolName) return null;
  const data = schoolDeadlines as Record<string, Record<string, string | null>>;
  if (data[schoolName]) return data[schoolName] as never;
  const lower = schoolName.toLowerCase();
  for (const key of Object.keys(data)) {
    if (key.toLowerCase() === lower) return data[key] as never;
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) return data[key] as never;
  }
  return null;
}

export type KanbanColumn = "not_started" | "in_progress" | "submitted" | "decisions";

export function kanbanColumnFor(status: string | null | undefined): KanbanColumn {
  switch (status) {
    case "submitted":
      return "submitted";
    case "deferred":
    case "waitlisted":
    case "accepted":
    case "rejected":
    case "deposited":
    case "withdrawn":
      return "decisions";
    case "in_progress":
    case "considering":
      return "in_progress";
    case "not_started":
    default:
      return "not_started";
  }
}

export function buildICalendar(rows: SchoolDeadlineRow[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KairosLearn//Application Deadlines//EN",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:KairosLearn College Deadlines",
  ];

  const fmtDate = (d: string) => d.replace(/-/g, "");

  for (const row of rows) {
    for (const k of DEADLINE_KEYS) {
      const v = row[k];
      if (!v) continue;
      const dateStr = fmtDate(v);
      const label = k
        .replace(/^deadline_/, "")
        .replace("ea", "EA")
        .replace("ed", "ED")
        .replace("edii", "ED II")
        .replace("rea", "REA")
        .replace("rd", "Regular Decision")
        .replace("financial_aid", "Financial Aid")
        .replace("css_profile", "CSS Profile")
        .replace("fafsa", "FAFSA");
      const uid = `${row.id}-${k}@kairoslearn.com`;
      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `DTEND;VALUE=DATE:${dateStr}`,
        `SUMMARY:${row.school_name} — ${label} Deadline`,
        ...(row.portal_url ? [`URL:${row.portal_url}`] : []),
        "END:VEVENT",
      );
    }
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
