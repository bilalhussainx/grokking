"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { PriorityWidget } from "@/components/cc/dashboard/sections/types";

// Reuses the same kind-to-href / kind-to-title maps as MobileHero. Could
// be hoisted into a shared module if a third consumer appears.
const HREFS: Record<string, string> = {
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

const TITLES: Record<string, string> = {
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

export default function MobilePriority({ widget }: { widget: PriorityWidget }) {
  const title = TITLES[widget.kind] ?? "Priority";
  const href = HREFS[widget.kind] ?? "/?coach=open";
  return (
    <Link
      href={href}
      className="block rounded-xl p-4 active:scale-[0.99] transition-transform"
      style={{
        border: "1px solid rgba(255,255,255,.08)",
        background: "rgba(20,20,20,.6)",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-md"
          style={{ background: "rgba(212,175,55,.10)", border: "1px solid rgba(212,175,55,.20)" }}
        >
          <Sparkles className="w-3 h-3" style={{ color: "#d4af37" }} />
        </span>
        <p className="text-[14px] font-semibold text-white">{title}</p>
      </div>
      {widget.nudge && (
        <p className="text-[11.5px] italic text-white/70 leading-snug mb-2">
          &ldquo;{widget.nudge.observation}&rdquo;
        </p>
      )}
      <div className="flex items-center justify-end gap-1 text-[11px] font-semibold pt-1.5 border-t border-dashed border-white/[0.08]" style={{ color: "#d4af37" }}>
        Open <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}
