"use client";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import MobileHeader from "./MobileHeader";
import MobileGreeting from "./MobileGreeting";
import MobileHero from "./MobileHero";
import MobilePriority from "./MobilePriority";
import MobileWidgets from "./MobileWidgets";
import MobileSectionHead from "./MobileSectionHead";

import BottomTabBar, { type TabId } from "../BottomTabBar";
import MobileDrawer from "../MobileDrawer";
import MobileSearchSheet from "../MobileSearchSheet";
import MobileCoachSheet from "../MobileCoachSheet";
import CoachFAB from "../CoachFAB";

import { useCoachKairos } from "@/contexts/CoachKairosContext";
import type { DashboardSummary } from "@/components/cc/dashboard/sections/types";

export default function MobileDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const coach = useCoachKairos();

  const fetchSummary = useCallback(() => {
    fetch("/api/cc/dashboard/summary")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`status ${r.status}`))))
      .then((d: DashboardSummary) => setSummary(d))
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Refetch when Coach Kairos completes a turn that mutated state. Mirrors
  // the pattern in src/app/cc/dashboard/AdaptiveDashboard.tsx.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ extracted?: number; actionKinds?: string[] }>).detail;
      if ((detail?.extracted ?? 0) > 0 || (detail?.actionKinds?.length ?? 0) > 0) {
        fetchSummary();
      }
    };
    window.addEventListener("kairos:message-complete", handler);
    return () => window.removeEventListener("kairos:message-complete", handler);
  }, [fetchSummary]);

  const handleTab = useCallback((id: TabId) => {
    setActiveTab(id);
    if (id === "search") setSearchOpen(true);
    else if (id === "coach") setCoachOpen(true);
  }, []);

  const handleSlashCommand = useCallback(
    (q: string) => {
      // Open the coach drawer; future enhancement will pre-fill the
      // coach with the typed question via a context method.
      setCoachOpen(true);
      void coach;
      void q;
    },
    [coach],
  );

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 text-rose-300 text-sm"
        style={{ background: "#0a0e16" }}
      >
        Couldn&apos;t load your dashboard: {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0e16" }}
      >
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#d4af37" }} />
      </div>
    );
  }

  // Hero is the first priority widget; rest stack as 1-up cards.
  const priorityRest = summary.priorityWidgets.slice(1);

  return (
    <div className="min-h-screen relative" style={{ background: "#0a0e16" }}>
      <MobileHeader onMenu={() => setDrawerOpen(true)} onSearch={() => setSearchOpen(true)} />

      <main className="pb-[88px]">
        <div className="px-4 pt-4 space-y-4">
          <MobileGreeting summary={summary} />
          <MobileHero summary={summary} />

          {priorityRest.length > 0 && (
            <>
              <MobileSectionHead>Priorities</MobileSectionHead>
              <div className="space-y-3">
                {priorityRest.map((w, i) => (
                  <MobilePriority key={`${w.kind}-${i}`} widget={w} />
                ))}
              </div>
            </>
          )}

          {summary.footerWidgets.length > 0 && (
            <>
              <MobileSectionHead>At a glance</MobileSectionHead>
              <MobileWidgets items={summary.footerWidgets} />
            </>
          )}
        </div>
      </main>

      <CoachFAB onClick={() => setCoachOpen(true)} />

      <BottomTabBar grade={summary.variantKey} active={activeTab} onTab={handleTab} />

      <MobileDrawer
        open={drawerOpen}
        grade={summary.variantKey}
        onClose={() => setDrawerOpen(false)}
      />
      <MobileSearchSheet
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSlashCommand={handleSlashCommand}
      />
      <MobileCoachSheet open={coachOpen} onClose={() => setCoachOpen(false)} />
    </div>
  );
}
