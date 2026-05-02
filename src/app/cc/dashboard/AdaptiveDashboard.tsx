// src/app/cc/dashboard/AdaptiveDashboard.tsx
"use client";
// Variant-aware dashboard orchestrator. Fetches /api/cc/dashboard/summary
// once on mount, looks up SECTION_ORDER for the resolved variant, renders
// each section in sequence. Sections that return null when their data is
// empty keep the layout adaptive without conditional logic here.
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Greeting from "@/components/cc/dashboard/sections/Greeting";
import { SECTION_ORDER, SECTION_REGISTRY } from "@/components/cc/dashboard/sections/variant-sections";
import type { DashboardSummary } from "@/components/cc/dashboard/sections/types";

export default function AdaptiveDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cc/dashboard/summary")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`status ${r.status}`))))
      .then((d: DashboardSummary) => setSummary(d))
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-rose-300 text-sm">
        Couldn&apos;t load your dashboard: {error}
      </div>
    );
  }
  if (!summary) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }
  const sectionIds = SECTION_ORDER[summary.variantKey] ?? SECTION_ORDER.unknown;
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 pt-12 pb-20">
      <Greeting summary={summary} />
      {sectionIds.map((id) => {
        const Section = SECTION_REGISTRY[id];
        return <Section key={id} summary={summary} />;
      })}
    </div>
  );
}
