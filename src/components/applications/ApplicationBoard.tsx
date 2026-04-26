"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Download,
  ExternalLink,
  TriangleAlert,
  Loader2,
  Check,
} from "lucide-react";
import {
  componentProgress,
  daysUntil,
  kanbanColumnFor,
  nextUpcomingDeadline,
  urgencyClass,
  type SchoolDeadlineRow,
  type DeadlineKey,
  type KanbanColumn,
} from "@/lib/applications/deadlines";

const PLAN_OPTIONS = ["RD", "EA", "ED", "EDII", "REA", "QuestBridge", "Coalition"] as const;
const STATUS_OPTIONS = [
  "not_started",
  "in_progress",
  "submitted",
  "deferred",
  "waitlisted",
  "accepted",
  "rejected",
  "deposited",
  "withdrawn",
] as const;

const COLUMN_LABEL: Record<KanbanColumn, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  submitted: "Submitted",
  decisions: "Decisions",
};

const DEADLINE_LABEL: Record<DeadlineKey, string> = {
  deadline_ea: "EA",
  deadline_ed: "ED",
  deadline_edii: "ED II",
  deadline_rea: "REA",
  deadline_rd: "RD",
  deadline_financial_aid: "FinAid",
  deadline_css_profile: "CSS",
  deadline_fafsa: "FAFSA",
};

export default function ApplicationBoard() {
  const [rows, setRows] = useState<SchoolDeadlineRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cc/applications/list")
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`Status ${r.status}`)))
      .then((data) => setRows(data.rows ?? []))
      .catch((e) => setError(String(e)));
  }, []);

  const columns = useMemo(() => {
    const out: Record<KanbanColumn, SchoolDeadlineRow[]> = {
      not_started: [],
      in_progress: [],
      submitted: [],
      decisions: [],
    };
    for (const r of rows ?? []) {
      out[kanbanColumnFor(r.application_status)].push(r);
    }
    return out;
  }, [rows]);

  const upcomingFive = useMemo(() => {
    if (!rows) return [];
    const items: { schoolName: string; key: DeadlineKey; date: string; days: number }[] = [];
    for (const r of rows) {
      const next = nextUpcomingDeadline(r);
      if (!next) continue;
      items.push({
        schoolName: r.school_name,
        key: next.key,
        date: next.date,
        days: daysUntil(next.date),
      });
    }
    items.sort((a, b) => a.days - b.days);
    return items.slice(0, 5);
  }, [rows]);

  const updateRow = async (id: string, updates: Partial<SchoolDeadlineRow>) => {
    setRows((prev) => prev ? prev.map((r) => (r.id === id ? { ...r, ...updates } : r)) : prev);
    try {
      await fetch("/api/cc/applications/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates }),
      });
    } catch (e) {
      console.warn("[ApplicationBoard] update failed", e);
    }
  };

  if (error) {
    return <p className="text-rose-300 text-sm p-6">Couldn&apos;t load: {error}</p>;
  }
  if (!rows) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }
  if (rows.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-white/60 text-sm">
          No schools yet. Add some on the <a href="/schools" className="text-[#D4AF37] underline">School List</a> page.
        </p>
      </div>
    );
  }

  const urgentCount = upcomingFive.filter((u) => u.days < 14 && u.days >= 0).length;

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      {urgentCount > 0 && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-2">
          <TriangleAlert className="w-4 h-4 shrink-0" />
          <span>
            <strong>Deadline alert:</strong> {urgentCount} deadline{urgentCount !== 1 ? "s" : ""} within 14 days.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-white">Applications</h1>
        <a
          href="/api/cc/applications/ical"
          download
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/80 hover:bg-white/10"
        >
          <Download className="w-3.5 h-3.5" />
          Export to calendar (.ics)
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {(Object.keys(columns) as KanbanColumn[]).map((col) => (
            <div key={col} className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-white/55 font-semibold">
                  {COLUMN_LABEL[col]}
                </span>
                <span className="text-[11px] text-white/40">{columns[col].length}</span>
              </div>
              {columns[col].map((row) => (
                <SchoolCard
                  key={row.id}
                  row={row}
                  expanded={expandedId === row.id}
                  onToggle={() => setExpandedId((id) => (id === row.id ? null : row.id))}
                  onUpdate={(u) => updateRow(row.id, u)}
                />
              ))}
              {columns[col].length === 0 && (
                <p className="text-[11px] text-white/30 italic">No schools here.</p>
              )}
            </div>
          ))}
        </div>

        <aside className="space-y-3 lg:sticky lg:top-20 self-start">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-[12px] text-white/60 mb-3">
              <Clock className="w-3.5 h-3.5" />
              Next deadlines
            </div>
            {upcomingFive.length === 0 ? (
              <p className="text-[12px] text-white/40 italic">No upcoming deadlines.</p>
            ) : (
              <ul className="space-y-2.5">
                {upcomingFive.map((u, i) => {
                  const cls = urgencyClass(u.days);
                  return (
                    <li key={i} className="text-[12.5px] flex items-baseline justify-between gap-2">
                      <span className="text-white/80 truncate">
                        {u.schoolName} · {DEADLINE_LABEL[u.key]}
                      </span>
                      <span
                        className={
                          cls === "urgent"
                            ? "text-rose-300 font-semibold"
                            : cls === "soon"
                              ? "text-amber-300"
                              : "text-white/55"
                        }
                      >
                        {u.days >= 0 ? `${u.days}d` : "past"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-[12px] text-white/60 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              Calendar view
            </div>
            <a
              href="/applications/calendar"
              className="text-[12px] text-[#D4AF37] hover:underline"
            >
              Open monthly calendar →
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SchoolCard({
  row,
  expanded,
  onToggle,
  onUpdate,
}: {
  row: SchoolDeadlineRow;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (u: Partial<SchoolDeadlineRow>) => void;
}) {
  const next = nextUpcomingDeadline(row);
  const days = next ? daysUntil(next.date) : null;
  const urgency = days !== null ? urgencyClass(days) : "ok";
  const progress = componentProgress(row);
  const showEDWarning =
    row.application_plan === "ED" || row.application_plan === "EDII" || row.application_plan === "REA";

  return (
    <div
      className={`rounded-xl border p-3 transition-colors ${
        urgency === "urgent"
          ? "border-rose-500/50 bg-rose-500/5"
          : urgency === "soon"
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[14px] font-medium text-white truncate">{row.school_name}</span>
          {row.application_plan && (
            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-white/10 text-white/70 shrink-0">
              {row.application_plan}
            </span>
          )}
        </div>
        {next && (
          <div className="text-[11.5px] mb-2">
            <span className="text-white/55">Next:</span>{" "}
            <span
              className={
                urgency === "urgent"
                  ? "text-rose-300 font-semibold"
                  : urgency === "soon"
                    ? "text-amber-300"
                    : "text-white/75"
              }
            >
              {next.date} ({days !== null && days >= 0 ? `${days} days` : "past"})
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#D4AF37]"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <span className="text-[10px] text-white/45">{progress.complete}/{progress.total}</span>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-[11.5px]">
            <select
              value={row.application_plan ?? ""}
              onChange={(e) => onUpdate({ application_plan: e.target.value || null })}
              className="px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white/80"
            >
              <option value="">Plan…</option>
              {PLAN_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={row.application_status ?? "not_started"}
              onChange={(e) => onUpdate({ application_status: e.target.value })}
              className="px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white/80"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          {showEDWarning && (
            <div className="px-3 py-2 rounded bg-amber-500/15 border border-amber-500/40 text-[11.5px] text-amber-100">
              <strong>ED warning:</strong> Early Decision is binding. If you depend on financial
              aid, consider EA or RD so you can compare aid offers before committing.
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["common_app_filled", "Common App"],
                ["essays_complete", "Essays"],
                ["supplements_complete", "Supplements"],
                ["recs_submitted", "Recs"],
                ["transcript_submitted", "Transcript"],
                ["test_scores_submitted", "Test scores"],
                ["financial_aid_filed", "Aid filed"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-1.5 text-[11.5px] text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(row[key])}
                  onChange={(e) => onUpdate({ [key]: e.target.checked } as Partial<SchoolDeadlineRow>)}
                />
                {label}
              </label>
            ))}
          </div>

          <div className="space-y-1.5">
            {(
              [
                ["deadline_ea", "EA"],
                ["deadline_ed", "ED"],
                ["deadline_rea", "REA"],
                ["deadline_rd", "RD"],
                ["deadline_financial_aid", "Aid"],
                ["deadline_css_profile", "CSS"],
                ["deadline_fafsa", "FAFSA"],
              ] as const
            )
              .filter(([k]) => row[k])
              .map(([k, label]) => (
                <div key={k} className="flex items-center justify-between text-[11.5px]">
                  <span className="text-white/55">{label}</span>
                  <input
                    type="date"
                    value={(row[k] as string) ?? ""}
                    onChange={(e) => onUpdate({ [k]: e.target.value } as Partial<SchoolDeadlineRow>)}
                    className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/80 text-[11px]"
                  />
                </div>
              ))}
          </div>

          {row.portal_url && (
            <a
              href={row.portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11.5px] text-[#D4AF37] hover:underline"
            >
              <ExternalLink className="w-3 h-3" /> Open portal
            </a>
          )}

          {progress.complete === progress.total && (
            <div className="text-[11.5px] text-emerald-400 inline-flex items-center gap-1">
              <Check className="w-3 h-3" /> All components complete
            </div>
          )}
        </div>
      )}
    </div>
  );
}
