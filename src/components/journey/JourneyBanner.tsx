"use client";

// Journey banner — stage-aware CTA for the homepage.
// Spec: CollegeVCareers.md SP-13.

import { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { JourneySnapshot } from "@/lib/journey-state";

export default function JourneyBanner() {
  const { user, loading: authLoading } = useAuth();
  const [snap, setSnap] = useState<JourneySnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/journey/state");
        if (res.ok) setSnap(await res.json());
      } catch {
        /* silent — banner is advisory */
      } finally {
        setLoading(false);
      }
    })();
  }, [user, authLoading]);

  if (loading || !user || !snap) return null;

  const stateColor: Record<string, string> = {
    discovering: "from-slate-500/15 to-slate-500/5 border-slate-400/30",
    profile_building: "from-sky-500/15 to-sky-500/5 border-sky-400/30",
    essay_drafting: "from-violet-500/15 to-violet-500/5 border-violet-400/30",
    essay_polishing: "from-fuchsia-500/15 to-fuchsia-500/5 border-fuchsia-400/30",
    interview_practice: "from-amber-500/15 to-amber-500/5 border-amber-400/30",
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br ${stateColor[snap.state] || stateColor.discovering} p-5`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-white/10 border border-white/10">
          <Compass className="w-4 h-4 text-white/80" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-white/40 mb-0.5">
            Your next move
          </div>
          <h3 className="text-base font-semibold text-white">{snap.title}</h3>
          <p className="text-sm text-white/70 mt-1">{snap.message}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {snap.nextActions.map((a, i) => (
          <Link
            key={a.href + i}
            href={a.href}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              i === 0
                ? "bg-white text-black hover:bg-white/90"
                : "bg-white/5 border border-white/15 text-white/80 hover:bg-white/10"
            }`}
            title={a.reason}
          >
            {i === 0 && <Sparkles className="w-3.5 h-3.5" />}
            {a.label}
            <ArrowRight className="w-3 h-3" />
          </Link>
        ))}
      </div>
    </div>
  );
}
