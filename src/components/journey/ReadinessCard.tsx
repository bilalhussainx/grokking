"use client";

// SP-9 — holistic readiness card. Transparent pillar breakdown.
import { useEffect, useState } from "react";
import Link from "next/link";
import { Target, ArrowRight } from "lucide-react";

interface Pillar {
  key: string;
  label: string;
  score: number;
  message: string;
  href: string;
}
interface Snap {
  overall: number;
  pillars: Pillar[];
}

function barColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 30) return "bg-orange-500";
  return "bg-white/20";
}

export default function ReadinessCard() {
  const [snap, setSnap] = useState<Snap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    fetch("/api/readiness")
      .then((r) => r.ok ? r.json() : null)
      .then((j) => { if (!cancel && j && !j.error) setSnap(j); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, []);

  if (loading || !snap) return null;

  const overallColor =
    snap.overall >= 80 ? "text-emerald-400" :
    snap.overall >= 60 ? "text-yellow-400" :
    snap.overall >= 30 ? "text-orange-400" :
    "text-white/40";

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-sky-400" />
          <h3 className="font-medium">Application readiness</h3>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold leading-none ${overallColor}`}>{snap.overall}</div>
          <div className="text-xs text-white/40">composite</div>
        </div>
      </div>

      <div className="space-y-3">
        {snap.pillars.map((p) => (
          <Link key={p.key} href={p.href} className="block group">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-white/80 group-hover:text-white">{p.label}</span>
              <span className="text-white/50 text-xs tabular-nums">{p.score}/100</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${barColor(p.score)} transition-all`} style={{ width: `${p.score}%` }} />
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-white/50 group-hover:text-white/70">
              {p.message}
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
