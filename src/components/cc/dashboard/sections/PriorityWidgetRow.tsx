// src/components/cc/dashboard/sections/PriorityWidgetRow.tsx
// 3-column row of variant-specific priority widgets, glass-card aesthetic.
// Each widget is keyed on PriorityWidget.kind and renders the matching
// inline sub-component. Coach Kairos nudges (Phase 2.7) attach to widgets
// whose `nudge` field is populated by the API.
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { DashboardSummary, PriorityWidget } from "./types";

export default function PriorityWidgetRow({ summary }: { summary: DashboardSummary }) {
  const widgets = summary.priorityWidgets;
  if (!widgets.length) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.22 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37]">
          Priority widgets
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {widgets.slice(0, 3).map((w, i) => (
          <PriorityCard key={`${w.kind}-${i}`} widget={w} />
        ))}
      </div>
    </motion.section>
  );
}

function PriorityCard({ widget }: { widget: PriorityWidget }) {
  const config = WIDGET_CONFIG[widget.kind] ?? FALLBACK;
  return (
    <Link
      href={config.href}
      className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#141414]/60 backdrop-blur-sm p-5 hover:border-[#D4AF37]/30 transition-all min-h-[200px]"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37]">
          {config.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{config.title}</p>
          <p className="text-[11px] text-white/50">{config.subtitle}</p>
        </div>
      </div>
      <div className="flex-1 text-[12px] text-white/65 leading-relaxed">
        {config.body}
      </div>
      {widget.nudge && (
        <div className="rounded-lg border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] p-2.5">
          <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1">{widget.nudge.eyebrow}</p>
          <p className="text-[12px] italic text-white/85 leading-snug">&ldquo;{widget.nudge.observation}&rdquo;</p>
        </div>
      )}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-dashed border-white/10 text-[12px] text-[#D4AF37]">
        <span>Open</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}

// Per-kind static config (icon + copy + href). Keeping all variant copy
// in one map means rebalancing widgets per variant is a config edit, not
// a code change.
type WidgetConfig = { icon: React.ReactNode; title: string; subtitle: string; body: string; href: string };

const FALLBACK: WidgetConfig = {
  icon: <Sparkles className="w-4 h-4" />,
  title: "Coach Kairos",
  subtitle: "Anything you need",
  body: "Open the drawer to ask Coach about what to focus on next.",
  href: "/?coach=open",
};

const WIDGET_CONFIG: Record<PriorityWidget["kind"], WidgetConfig> = {
  courseRigorStretch: {
    icon: <Sparkles className="w-4 h-4" />, title: "Course rigor",
    subtitle: "Stretch this year", body: "Pick one harder course for next semester. Honors counts.",
    href: "/cc/courses",
  },
  summerPlan: {
    icon: <Sparkles className="w-4 h-4" />, title: "Summer plan",
    subtitle: "One real thing", body: "One meaningful summer experience beats three filler ones.",
    href: "/cc/summer",
  },
  majorExploration: {
    icon: <Sparkles className="w-4 h-4" />, title: "Major exploration",
    subtitle: "Low-stakes", body: "Take the interest quiz. No commitment.",
    href: "/cc/majors",
  },
  psatPrep: {
    icon: <Sparkles className="w-4 h-4" />, title: "PSAT prep",
    subtitle: "Diagnostic", body: "PSAT 10 in October — anchor your test plan.",
    href: "/cc/test-strategy",
  },
  summerExperience: {
    icon: <Sparkles className="w-4 h-4" />, title: "Summer experience",
    subtitle: "Show, don't tell", body: "Research, real job, structured program — pick one.",
    href: "/cc/summer",
  },
  activitiesDepth: {
    icon: <Sparkles className="w-4 h-4" />, title: "Activities depth",
    subtitle: "Depth over breadth", body: "Double down on one area — admissions remember spike.",
    href: "/cc/activities-optimizer",
  },
  schoolListBalance: {
    icon: <Sparkles className="w-4 h-4" />, title: "School list",
    subtitle: "Reach / match / safety", body: "Aim for balance — Coach can suggest safeties.",
    href: "/schools",
  },
  satBars: {
    icon: <Sparkles className="w-4 h-4" />, title: "SAT plan",
    subtitle: "Reading + math + target", body: "Diagnostic this fall. Lift in spring.",
    href: "/cc/test-strategy",
  },
  activitiesThroughLine: {
    icon: <Sparkles className="w-4 h-4" />, title: "Activities through-line",
    subtitle: "Find your story", body: "Coach finds the through-line at 3+ activities.",
    href: "/cc/activities-optimizer",
  },
  applicationTracker: {
    icon: <Sparkles className="w-4 h-4" />, title: "Application tracker",
    subtitle: "Next 3 deadlines", body: "EA / ED / RD — what's blocking the next submit.",
    href: "/applications",
  },
  supplementsProgress: {
    icon: <Sparkles className="w-4 h-4" />, title: "Supplements",
    subtitle: "X of Y complete", body: "Tackle by school — soonest deadline first.",
    href: "/cc/essays/supplements",
  },
  psPhase: {
    icon: <Sparkles className="w-4 h-4" />, title: "Personal statement",
    subtitle: "Phase progress", body: "Brainstorm → outline → draft → revise.",
    href: "/cc/essays",
  },
  decisionsTracker: {
    icon: <Sparkles className="w-4 h-4" />, title: "Decisions tracker",
    subtitle: "Admit / waitlist / deny", body: "Track every response in one place.",
    href: "/applications",
  },
  demonstratedInterest: {
    icon: <Sparkles className="w-4 h-4" />, title: "Demonstrated interest",
    subtitle: "Visit + email log", body: "Some schools track touchpoints up to decision day.",
    href: "/cc/visits",
  },
  planB: {
    icon: <Sparkles className="w-4 h-4" />, title: "Plan B",
    subtitle: "If deferred", body: "Have a defer / accept / reject framework ready.",
    href: "/?coach=open",
  },
  aidComparator: {
    icon: <Sparkles className="w-4 h-4" />, title: "Aid comparator",
    subtitle: "Net price by school", body: "Compare offers. Negotiate where there's room.",
    href: "/applications",
  },
  waitlist: {
    icon: <Sparkles className="w-4 h-4" />, title: "Waitlist",
    subtitle: "LOCI ready", body: "Decide to stay + write a letter of continued interest.",
    href: "/cc/waitlist",
  },
  whyTransferPhase: {
    icon: <Sparkles className="w-4 h-4" />, title: "Why-transfer essay",
    subtitle: "Phase progress", body: "The heart of your file — committee reads first.",
    href: "/cc/essays",
  },
  articulationBreakdown: {
    icon: <Sparkles className="w-4 h-4" />, title: "Articulation",
    subtitle: "Credits transfer", body: "How many of your credits each target school accepts.",
    href: "/cc/transfer-profile",
  },
  professorRecs: {
    icon: <Sparkles className="w-4 h-4" />, title: "Professor recs",
    subtitle: "College recs only", body: "Transfers need college, not high school recs.",
    href: "/cc/recommenders",
  },
};
