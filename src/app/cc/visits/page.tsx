"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, MapPin, Video, Users, BookOpen, Mail } from "lucide-react";

type Visit = {
  id: string;
  visit_date: string;
  visit_type: string;
  notes: string | null;
  cc_student_schools?: { id: string; cc_schools?: { name?: string } | { name?: string }[] | null } | { id: string; cc_schools?: { name?: string } | { name?: string }[] | null }[] | null;
};

const TYPE_ICONS: Record<string, typeof MapPin> = {
  in_person: MapPin,
  virtual_tour: Video,
  info_session: BookOpen,
  fair: Users,
  webinar: Video,
  rep_meeting: Mail,
};

const TYPE_LABELS: Record<string, string> = {
  in_person: "In person",
  virtual_tour: "Virtual tour",
  info_session: "Info session",
  fair: "College fair",
  webinar: "Webinar",
  rep_meeting: "Rep meeting",
};

const VIRTUAL_TOUR_LINKS = [
  { school: "MIT", url: "https://mitadmissions.org/virtual-tour" },
  { school: "Harvard", url: "https://college.harvard.edu/admissions/explore-harvard/virtual-tour" },
  { school: "Stanford", url: "https://visit.stanford.edu/virtual-tour" },
  { school: "Yale", url: "https://admissions.yale.edu/visit-yale" },
  { school: "Princeton", url: "https://admission.princeton.edu/visit/virtual-tour" },
];

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [date, setDate] = useState("");
  const [type, setType] = useState("in_person");
  const [schoolId, setSchoolId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const [vRes, lRes] = await Promise.all([fetch("/api/cc/visits"), fetch("/api/cc/applications/list")]);
    setVisits((await vRes.json()).visits ?? []);
    type Row = { id: string; school_name: string };
    setSchools(((await lRes.json()).rows ?? []).map((r: Row) => ({ id: r.id, name: r.school_name })));
  };
  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);

  const add = async () => {
    if (!date) return;
    await fetch("/api/cc/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentSchoolId: schoolId || undefined,
        visitDate: date,
        visitType: type,
        notes: notes || undefined,
      }),
    });
    setDate(""); setNotes(""); setSchoolId("");
    await refresh();
  };

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /></div>;

  // Group visits by school for the demonstrated-interest indicator.
  const byStudentSchool = new Map<string, number>();
  for (const v of visits) {
    const ss = Array.isArray(v.cc_student_schools) ? v.cc_student_schools[0] : v.cc_student_schools;
    if (ss?.id) byStudentSchool.set(ss.id, (byStudentSchool.get(ss.id) ?? 0) + 1);
  }

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Campus visits</h1>
        <p className="text-[13px] text-white/60">Log every visit, virtual tour, info session, and rep meeting. Some schools track demonstrated interest.</p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h2 className="text-[12px] uppercase tracking-wider text-white/55 font-semibold mb-3">Log a visit</h2>
        <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_140px] gap-2 mb-2">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
          <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85">
            <option value="">School (from list)…</option>
            {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85">
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full mb-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85 placeholder-white/30" />
        <button type="button" onClick={add} disabled={!date} className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-40 inline-flex items-center gap-1.5">
          <Plus className="w-3 h-3" /> Add
        </button>
      </section>

      {byStudentSchool.size > 0 && schools.length > 0 && (
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-[12px] uppercase tracking-wider text-white/55 font-semibold mb-3">Demonstrated interest</h2>
          <ul className="space-y-1.5">
            {schools.map((s) => {
              const count = byStudentSchool.get(s.id) ?? 0;
              return (
                <li key={s.id} className="flex justify-between text-[12.5px] text-white/80">
                  <span>{s.name}</span>
                  <span className={count >= 2 ? "text-emerald-300" : count === 1 ? "text-amber-300" : "text-white/30"}>
                    {count} touchpoint{count !== 1 ? "s" : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h2 className="text-[12px] uppercase tracking-wider text-white/55 font-semibold mb-3">Virtual tours</h2>
        <ul className="space-y-1.5">
          {VIRTUAL_TOUR_LINKS.map((v) => (
            <li key={v.school}>
              <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-[12.5px] text-[#D4AF37] hover:underline">
                {v.school} — virtual tour →
              </a>
            </li>
          ))}
        </ul>
      </section>

      {visits.length > 0 && (
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-[12px] uppercase tracking-wider text-white/55 font-semibold mb-3">History</h2>
          <ul className="space-y-1.5">
            {visits.map((v) => {
              const Icon = TYPE_ICONS[v.visit_type] ?? MapPin;
              const ss = Array.isArray(v.cc_student_schools) ? v.cc_student_schools[0] : v.cc_student_schools;
              const sch = ss && (Array.isArray(ss.cc_schools) ? ss.cc_schools[0] : ss.cc_schools);
              return (
                <li key={v.id} className="text-[12.5px] text-white/80 border-b border-white/5 pb-1.5 flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-white/55 shrink-0" />
                  <span>{v.visit_date}</span>
                  <span className="text-white/55">{TYPE_LABELS[v.visit_type] ?? v.visit_type}</span>
                  {sch?.name && <span className="text-white/85">— {sch.name}</span>}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
