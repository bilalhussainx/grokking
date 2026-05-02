"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { DashboardSummary, PriorityWidget } from "@/components/cc/dashboard/sections/types";

const KIND_TO_HREF: Record<string, string> = {
  applicationTracker: "/applications",
  supplementsProgress: "/cc/essays/supplements",
  psPhase: "/cc/essays",
  schoolListBalance: "/schools",
  satBars: "/cc/test-strategy",
  psatPrep: "/cc/test-strategy",
  activitiesThroughLine: "/cc/activities-optimizer",
  activitiesDepth: "/cc/activities-optimizer",
  courseRigorStretch: "/cc/courses",
  summerPlan: "/cc/summer",
  summerExperience: "/cc/summer",
  majorExploration: "/cc/majors",
  decisionsTracker: "/applications",
  demonstratedInterest: "/cc/visits",
  planB: "/?coach=open",
  aidComparator: "/applications",
  waitlist: "/cc/waitlist",
  whyTransferPhase: "/cc/essays",
  articulationBreakdown: "/cc/transfer-profile",
  professorRecs: "/cc/recommenders",
};

const KIND_TO_TITLE: Record<string, string> = {
  applicationTracker: "Application tracker",
  supplementsProgress: "Supplements",
  psPhase: "Personal statement",
  schoolListBalance: "School list",
  satBars: "SAT plan",
  psatPrep: "PSAT prep",
  activitiesThroughLine: "Activities through-line",
  activitiesDepth: "Activities depth",
  courseRigorStretch: "Course rigor",
  summerPlan: "Summer plan",
  summerExperience: "Summer experience",
  majorExploration: "Major exploration",
  decisionsTracker: "Decisions",
  demonstratedInterest: "Demonstrated interest",
  planB: "Plan B",
  aidComparator: "Aid comparator",
  waitlist: "Waitlist",
  whyTransferPhase: "Why-transfer essay",
  articulationBreakdown: "Articulation",
  professorRecs: "Professor recs",
};

export default function MobileHero({ summary }: { summary: DashboardSummary }) {
  const hero: PriorityWidget | undefined = summary.priorityWidgets[0];
  if (!hero) {
    // Fallback: minimal welcome card.
    return (
      <section
        className="rounded-2xl p-5"
        style={{
          border: "1px solid rgba(212,175,55,.30)",
          background: "linear-gradient(180deg, rgba(212,175,55,.06), rgba(255,255,255,.01))",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5" style={{ color: "#d4a84b" }} />
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#d4a84b" }}>
            This week
          </span>
        </div>
        <p className="text-white text-[15px] leading-snug">
          {summary.brief ?? "Add more schools or draft an essay and we'll surface what to work on next."}
        </p>
      </section>
    );
  }

  const title = KIND_TO_TITLE[hero.kind] ?? "Priority";
  const href = KIND_TO_HREF[hero.kind] ?? "/?coach=open";

  return (
    <Link
      href={href}
      className="block rounded-2xl p-5 active:scale-[0.99] transition-transform"
      style={{
        border: "1px solid rgba(212,175,55,.40)",
        background: "linear-gradient(180deg, rgba(212,175,55,.08), rgba(255,255,255,.01))",
        boxShadow: "0 0 0 1px rgba(212,175,55,.10), 0 12px 28px -16px rgba(212,175,55,.40)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-3.5 h-3.5" style={{ color: "#d4a84b" }} />
        <span className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#d4a84b" }}>
          Priority this week
        </span>
      </div>
      <h2
        className="text-[22px] leading-[1.18] mb-2"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          color: "#f2ede3",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {hero.nudge && (
        <p className="text-[12px] italic text-white/85 leading-snug mb-3">
          &ldquo;{hero.nudge.observation}&rdquo;
        </p>
      )}
      <div className="flex items-center justify-end gap-1 text-[12px] font-semibold" style={{ color: "#d4af37" }}>
        Open <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}
