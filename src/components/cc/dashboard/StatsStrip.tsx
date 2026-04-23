"use client";

import { useEffect, useState } from "react";
import { Building2, BookOpen, Sparkles } from "lucide-react";

interface Counts {
  schools: number | null;
  essays: number | null;
  xp: number | null;
}

interface ProfileWithXP {
  total_xp?: number | null;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default function StatsStrip({ className = "" }: { className?: string }) {
  const [counts, setCounts] = useState<Counts>({ schools: null, essays: null, xp: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [schoolsRes, essaysRes, profileRes] = await Promise.all([
        fetchJson<{ schools?: unknown[] }>("/api/cc/school-list"),
        fetchJson<{ essays?: unknown[] }>("/api/cc/essays"),
        fetchJson<{ profile?: ProfileWithXP }>("/api/cc/profile"),
      ]);
      if (cancelled) return;
      setCounts({
        schools: Array.isArray(schoolsRes?.schools) ? schoolsRes.schools.length : 0,
        essays: Array.isArray(essaysRes?.essays) ? essaysRes.essays.length : 0,
        xp: typeof profileRes?.profile?.total_xp === "number" ? profileRes.profile.total_xp : 0,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tiles = [
    {
      key: "schools",
      icon: Building2,
      label: "Schools on your list",
      value: counts.schools,
    },
    {
      key: "essays",
      icon: BookOpen,
      label: "Essays in progress",
      value: counts.essays,
    },
    {
      key: "xp",
      icon: Sparkles,
      label: "XP earned",
      value: counts.xp,
    },
  ];

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}
      role="region"
      aria-label="Dashboard stats"
    >
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <div key={t.key} className="kl-card-primary" style={{ padding: "14px 16px" }}>
            <div className="flex items-center gap-3">
              <div className="kl-card-icon shrink-0" style={{ marginBottom: 0, width: 32, height: 32 }}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-white/50 tracking-wide uppercase">
                  {t.label}
                </div>
                <div className="text-white font-semibold text-lg tabular-nums">
                  {t.value === null ? "—" : t.value}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
