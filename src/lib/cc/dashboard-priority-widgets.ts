// src/lib/cc/dashboard-priority-widgets.ts
// Server-side helpers that compute per-variant priority + footer widgets
// from raw dashboard data. Called from /api/cc/dashboard/summary.
//
// The shape returned matches DashboardSummary's priorityWidgets +
// footerWidgets fields. Each widget has a `kind` discriminator that
// PriorityWidgetRow keys off to render the right inline sub-component.
import type { VariantKey } from "@/app/cc/dashboard/variants";
import type {
  PriorityWidget, PriorityWidgetKind, WidgetItem,
} from "@/components/cc/dashboard/sections/types";

const PRIORITY_KINDS_BY_VARIANT: Record<VariantKey, PriorityWidgetKind[]> = {
  g9:                 ["courseRigorStretch", "summerPlan", "majorExploration"],
  g10:                ["psatPrep", "summerExperience", "activitiesDepth"],
  junior:             ["schoolListBalance", "satBars", "activitiesThroughLine"],
  senior_writing:     ["applicationTracker", "supplementsProgress", "psPhase"],
  senior_post_submit: ["decisionsTracker", "demonstratedInterest", "planB"],
  senior_decisions:   ["decisionsTracker", "aidComparator", "waitlist"],
  transfer:           ["whyTransferPhase", "articulationBreakdown", "professorRecs"],
  unknown:            [],
};

export function priorityWidgetsFor(
  variantKey: VariantKey,
  observations: Record<string, { observation: string; eyebrow: string }>,
): PriorityWidget[] {
  return PRIORITY_KINDS_BY_VARIANT[variantKey].map((kind) => ({
    kind,
    data: {}, // shape is widget-specific; v1 widgets don't read it yet
    nudge: observations[kind],
  }));
}

export function footerWidgetsFor(
  variantKey: VariantKey,
  ctx: {
    schoolCount: number;
    activitiesCount: number;
    essaysSubmittedCount: number;
    daysToCommonApp: number;
  },
): WidgetItem[] {
  const baseSchools: WidgetItem = {
    n: String(ctx.schoolCount),
    label: ctx.schoolCount === 1 ? "School" : "Schools",
    tone: "gold",
  };
  const baseActivities: WidgetItem = {
    n: String(ctx.activitiesCount),
    label: "Activities",
  };
  const baseEssays: WidgetItem = {
    n: String(ctx.essaysSubmittedCount),
    label: "Essays sent",
  };
  switch (variantKey) {
    case "g9":
    case "g10":
      return [
        { n: "—", label: "Streak", tone: "gold" },
        baseActivities,
        { n: String(ctx.daysToCommonApp), label: "Days to runway" },
        { n: "—", label: "XP today" },
      ];
    case "junior":
      return [
        { n: String(Math.max(0, ctx.daysToCommonApp)), label: "Days to App", tone: "gold" },
        baseSchools,
        baseActivities,
        { n: "—", label: "Streak" },
      ];
    case "senior_writing":
      return [
        baseSchools,
        baseEssays,
        baseActivities,
        { n: "—", label: "Streak" },
      ];
    case "senior_post_submit":
    case "senior_decisions":
      return [
        baseSchools,
        baseEssays,
        { n: "May 1", label: "Commit by" },
        { n: "—", label: "Streak" },
      ];
    case "transfer":
      return [
        baseSchools,
        baseEssays,
        { n: "—", label: "Credits" },
        { n: "—", label: "Streak" },
      ];
    case "unknown":
    default:
      return [
        baseSchools,
        baseActivities,
        baseEssays,
        { n: "—", label: "Streak" },
      ];
  }
}
