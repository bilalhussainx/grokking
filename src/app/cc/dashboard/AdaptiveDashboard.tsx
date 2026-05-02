// src/app/cc/dashboard/AdaptiveDashboard.tsx
"use client";
// Variant-aware dashboard orchestrator. Fetches /api/cc/dashboard/summary
// on mount AND on kairos:message-complete events that signal coach-side
// mutations (schools added, etc.) — so the dashboard reflects coach actions
// without a manual reload. Looks up SECTION_ORDER for the resolved variant,
// renders each section in sequence. Sections that return null when their
// data is empty keep the layout adaptive without conditional logic here.
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Greeting from "@/components/cc/dashboard/sections/Greeting";
import { SECTION_ORDER, SECTION_REGISTRY } from "@/components/cc/dashboard/sections/variant-sections";
import type { DashboardSummary } from "@/components/cc/dashboard/sections/types";

export default function AdaptiveDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(() => {
    fetch("/api/cc/dashboard/summary")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`status ${r.status}`))))
      .then((d: DashboardSummary) => setSummary(d))
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Refetch when Coach Kairos completes a turn that mutated state — e.g.
  // it added schools or updated profile fields. The CoachKairosContext
  // populates `extracted` (DB rows added this turn) and `actionKinds`
  // (canonical action names emitted by the LLM) on the event detail. We
  // refetch when either signal indicates something changed.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{
        extracted?: number;
        actionKinds?: string[];
      }>).detail;
      if ((detail?.extracted ?? 0) > 0 || (detail?.actionKinds?.length ?? 0) > 0) {
        fetchSummary();
      }
    };
    window.addEventListener("kairos:message-complete", handler);
    return () => window.removeEventListener("kairos:message-complete", handler);
  }, [fetchSummary]);

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
