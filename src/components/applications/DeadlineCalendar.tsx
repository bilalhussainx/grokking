"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  daysUntil,
  type SchoolDeadlineRow,
  type DeadlineKey,
} from "@/lib/applications/deadlines";

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

const COLOR_BY_KEY: Record<DeadlineKey, string> = {
  deadline_ea: "bg-rose-500",
  deadline_ed: "bg-rose-600",
  deadline_edii: "bg-rose-700",
  deadline_rea: "bg-rose-400",
  deadline_rd: "bg-amber-500",
  deadline_financial_aid: "bg-sky-500",
  deadline_css_profile: "bg-sky-400",
  deadline_fafsa: "bg-emerald-500",
};

const KEY_LABEL: Record<DeadlineKey, string> = {
  deadline_ea: "EA",
  deadline_ed: "ED",
  deadline_edii: "ED II",
  deadline_rea: "REA",
  deadline_rd: "RD",
  deadline_financial_aid: "Aid",
  deadline_css_profile: "CSS",
  deadline_fafsa: "FAFSA",
};

type Event = {
  schoolName: string;
  key: DeadlineKey;
  date: string;
};

export default function DeadlineCalendar() {
  const [rows, setRows] = useState<SchoolDeadlineRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    fetch("/api/cc/applications/list")
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`Status ${r.status}`)))
      .then((data) => setRows(data.rows ?? []))
      .catch((e) => setError(String(e)));
  }, []);

  const events = useMemo<Event[]>(() => {
    const out: Event[] = [];
    for (const r of rows ?? []) {
      for (const k of DEADLINE_KEYS) {
        const v = r[k];
        if (v) out.push({ schoolName: r.school_name, key: k, date: v });
      }
    }
    return out;
  }, [rows]);

  const monthDays = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay();
    const days: { date: Date; iso: string }[] = [];
    for (let i = 0; i < startDay; i++) {
      const d = new Date(year, month, 1 - (startDay - i));
      days.push({ date: d, iso: toIso(d) });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      const dt = new Date(year, month, d);
      days.push({ date: dt, iso: toIso(dt) });
    }
    while (days.length % 7 !== 0) {
      const next = new Date(days[days.length - 1].date);
      next.setDate(next.getDate() + 1);
      days.push({ date: next, iso: toIso(next) });
    }
    return days;
  }, [cursor]);

  if (error) return <p className="p-6 text-rose-300 text-sm">{error}</p>;
  if (!rows) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  const monthLabel = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });
  const eventsByDate = new Map<string, Event[]>();
  for (const e of events) {
    if (!eventsByDate.has(e.date)) eventsByDate.set(e.date, []);
    eventsByDate.get(e.date)!.push(e);
  }

  const goPrev = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const goNext = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));

  const upcoming = events
    .map((e) => ({ ...e, days: daysUntil(e.date) }))
    .filter((e) => e.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 10);

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Deadline calendar</h1>
        <a href="/applications" className="text-[12px] text-[#D4AF37] hover:underline">
          ← Back to board
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={goPrev}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/60"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-white/80">{monthLabel}</span>
            <button
              onClick={goNext}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/60"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-[11px] text-white/40 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthDays.map(({ date, iso }, i) => {
              const isCurMonth = date.getMonth() === cursor.getMonth();
              const dayEvents = eventsByDate.get(iso) ?? [];
              return (
                <div
                  key={i}
                  className={`rounded-lg p-1.5 min-h-[64px] border ${
                    isCurMonth
                      ? "bg-white/[0.02] border-white/10"
                      : "bg-transparent border-white/5 opacity-40"
                  }`}
                >
                  <div className="text-[10px] text-white/55 mb-1">{date.getDate()}</div>
                  <div className="space-y-0.5">
                    {dayEvents.map((e, k) => (
                      <div
                        key={k}
                        title={`${e.schoolName} · ${KEY_LABEL[e.key]}`}
                        className={`text-[9px] text-white/90 px-1 rounded ${COLOR_BY_KEY[e.key]} truncate`}
                      >
                        {e.schoolName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="text-[12px] uppercase tracking-wide text-white/55 font-semibold mb-3">
              Upcoming
            </h3>
            {upcoming.length === 0 ? (
              <p className="text-[12px] text-white/40 italic">No upcoming deadlines.</p>
            ) : (
              <ul className="space-y-2.5">
                {upcoming.map((e, i) => (
                  <li key={i} className="text-[12px] flex justify-between gap-2">
                    <span className="text-white/80 truncate">
                      {e.schoolName} · {KEY_LABEL[e.key]}
                    </span>
                    <span className={e.days < 14 ? "text-rose-300 font-semibold" : "text-white/55"}>
                      {e.days}d
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
