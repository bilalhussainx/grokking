"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Rating = { rater: "student" | "parent"; school_name: string; rating: number; notes: string | null };

export default function AlignmentPage() {
  const [schools, setSchools] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const refresh = async () => {
    const r = await fetch("/api/cc/family-alignment");
    if (!r.ok) return;
    const d = await r.json();
    setSchools(d.schools ?? []);
    setRatings(d.ratings ?? []);
  };
  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);

  const setRating = async (school: string, value: number) => {
    setSaving(school);
    try {
      await fetch("/api/cc/family-alignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolName: school, rating: value }),
      });
      await refresh();
    } finally { setSaving(null); }
  };

  const getRating = (school: string, who: "student" | "parent"): number | null =>
    ratings.find((r) => r.school_name === school && r.rater === who)?.rating ?? null;

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-[12px] text-white/55 uppercase tracking-wider">Family alignment</p>
        <h1 className="text-2xl font-semibold text-white">Rate your school list — your parent rates the same list</h1>
        <p className="text-[13.5px] text-white/65 mt-1">
          Where your numbers and your parent&apos;s numbers diverge, that&apos;s where the conversation needs to happen. Rate from 1 (not for me) to 10 (top choice).
        </p>
      </div>

      {schools.length === 0 ? (
        <p className="text-[13px] text-white/65">
          Add schools to your list first. <Link href="/schools" className="text-[#D4AF37] hover:underline">Open the School List Builder →</Link>
        </p>
      ) : (
        <div className="space-y-3">
          {schools.map((school) => {
            const s = getRating(school, "student");
            const p = getRating(school, "parent");
            const delta = s != null && p != null ? Math.abs(s - p) : null;
            return (
              <div key={school} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-white">{school}</h3>
                  {delta != null && (
                    <span className={"text-[11.5px] " + (delta >= 4 ? "text-rose-300" : delta >= 2 ? "text-amber-300" : "text-emerald-300")}>
                      Δ {delta} {delta >= 4 ? "· big gap" : delta >= 2 ? "· some gap" : "· aligned"}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2 text-[12px] text-white/70">
                  <div>You: <strong className="text-white">{s ?? "—"}</strong></div>
                  <div>Parent: <strong className="text-white">{p ?? "—"}</strong></div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(school, n)}
                      disabled={saving === school}
                      className={"w-7 h-7 rounded text-[11.5px] font-semibold border " + (s === n ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "border-white/15 text-white/70 hover:bg-white/5")}
                    >
                      {n}
                    </button>
                  ))}
                  {saving === school && <Loader2 className="w-3.5 h-3.5 animate-spin text-white/55 ml-2 self-center" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
