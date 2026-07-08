"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Sun } from "lucide-react";

type Experience = {
  id: string;
  experience_name: string;
  category: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
};

const CATEGORIES = ["Research", "Internship", "Job", "Volunteer", "Camp/Program", "Online course", "Self-directed project", "Family obligation"];

// Region-keyed suggestion lists — picked by the student's profile country
// (returned by GET /api/cc/summer). Admissions readers value local and
// family commitments; the point of each list is "what counts where you are".
const ALTERNATIVES: Record<string, { title: string; items: { name: string; category: string }[] }> = {
  SA: {
    title: "South Asia alternatives",
    items: [
      { name: "Aga Khan University Health Camp (Karachi)", category: "Volunteer" },
      { name: "LUMS Summer Coding Bootcamp (Lahore)", category: "Camp/Program" },
      { name: "Edhi Foundation hospital volunteer", category: "Volunteer" },
      { name: "TCS Foundation literacy mentor (Pakistan)", category: "Volunteer" },
      { name: "Local masjid Quran-teaching assistant", category: "Volunteer" },
      { name: "Family business shift work — log honestly as 'job'", category: "Job" },
      { name: "MIT OCW / Khan Academy + project (US-recognized)", category: "Online course" },
    ],
  },
  US: {
    title: "Ideas that count",
    items: [
      { name: "Local library / hospital volunteering", category: "Volunteer" },
      { name: "Community-college dual-enrollment course", category: "Online course" },
      { name: "Part-time job — retail, food service, lifeguarding all count", category: "Job" },
      { name: "State governor's school / summer academy", category: "Camp/Program" },
      { name: "Self-directed project (build, publish, organize something)", category: "Self-directed project" },
      { name: "Caring for siblings or family members — log it honestly", category: "Family obligation" },
      { name: "Cold-email a local lab or professor for research shadowing", category: "Research" },
    ],
  },
  INTL: {
    title: "Local alternatives that count",
    items: [
      { name: "Volunteering with a local NGO or hospital", category: "Volunteer" },
      { name: "National olympiad / competition training", category: "Self-directed project" },
      { name: "Family business shift work — log honestly as 'job'", category: "Job" },
      { name: "University-run summer school in your country", category: "Camp/Program" },
      { name: "MIT OCW / Khan Academy + project (US-recognized)", category: "Online course" },
      { name: "Community teaching or tutoring younger students", category: "Volunteer" },
    ],
  },
};

export default function SummerPage() {
  const [exps, setExps] = useState<Experience[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Research");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<string>("US");

  const refresh = async () => {
    const r = await fetch("/api/cc/summer");
    const d = await r.json();
    setExps(d.experiences ?? []);
    if (d.region) setRegion(d.region as string);
  };
  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);

  const add = async () => {
    if (!name.trim()) return;
    await fetch("/api/cc/summer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experienceName: name,
        category,
        startDate: start || undefined,
        endDate: end || undefined,
        description: desc || undefined,
      }),
    });
    setName(""); setStart(""); setEnd(""); setDesc("");
    await refresh();
  };

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Summer experiences</h1>
        <p className="text-[13px] text-white/60">Log every summer activity. Local jobs and family commitments count — admissions readers know.</p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h2 className="text-[12px] uppercase tracking-wider text-white/55 font-semibold mb-3">Add an experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-2 mb-2">
          <input placeholder="Name (e.g. AKU summer hospital volunteer)" value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input type="date" aria-label="Start date" placeholder="Start" value={start} onChange={(e) => setStart(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
          <input type="date" aria-label="End date" placeholder="End" value={end} onChange={(e) => setEnd(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
        </div>
        <textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className="w-full mb-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85 placeholder-white/30" />
        <button type="button" onClick={add} disabled={!name.trim()} className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-40 inline-flex items-center gap-1.5">
          <Plus className="w-3 h-3" /> Add
        </button>
      </section>

      <section className="rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 p-4">
        <h2 className="text-[12px] uppercase tracking-wider text-[#D4AF37] font-semibold mb-3 inline-flex items-center gap-1.5">
          <Sun className="w-3 h-3" /> {(ALTERNATIVES[region] ?? ALTERNATIVES.US).title}
        </h2>
        <ul className="space-y-1.5 text-[12.5px] text-white/80">
          {(ALTERNATIVES[region] ?? ALTERNATIVES.US).items.map((a, i) => (
            <li key={i}>
              <strong>{a.name}</strong> <span className="text-white/55">— {a.category}</span>
            </li>
          ))}
        </ul>
      </section>

      {exps.length > 0 && (
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-[12px] uppercase tracking-wider text-white/55 font-semibold mb-3">Logged</h2>
          <ul className="space-y-2">
            {exps.map((e) => (
              <li key={e.id} className="text-[12.5px] text-white/80 border-b border-white/5 pb-1.5">
                <p>
                  <strong className="text-white">{e.experience_name}</strong>
                  {e.category && <span className="text-white/55 ml-2">{e.category}</span>}
                  {e.start_date && (
                    <span className="text-white/45 ml-2">
                      {e.start_date}
                      {e.end_date ? ` → ${e.end_date}` : " → ongoing"}
                    </span>
                  )}
                </p>
                {e.description && <p className="text-white/65 mt-1">{e.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
