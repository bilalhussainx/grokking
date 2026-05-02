// src/components/cc/dashboard/sections/types.ts
// Shared types for the unified variant-aware dashboard. Every section
// consumes a slice of DashboardSummary; the orchestrator passes the full
// object to each section so adding new fields doesn't require plumbing.
import type { VariantKey } from "@/app/cc/dashboard/variants";

// LIFTED from CounselorDashboard's existing prop types. Match the shape
// /api/cc/dashboard/summary already returns so the legacy / page keeps
// working unchanged.
export type EssayStatus = "missing" | "draft" | "review" | "revised";

export interface SchoolProgress {
  studentSchoolId: string;
  schoolId: string;
  name: string;
  website: string | null;
  acceptanceRate: number | null;
  chancingBand: string | null;
  applicationPlan: string | null;
  isEarlyRound: boolean;
  regularDeadline: string | null;
  earlyDeadline: string | null;
  daysToDeadline: number | null;
  nearestDeadlineLabel: string | null;
  supplements: {
    total: number;
    drafted: number;
    reviewed: number;
    missing: number;
    items: Array<{
      supplementId: string;
      promptSnippet: string;
      wordLimit: number | null;
      status: EssayStatus;
      essayId: string | null;
    }>;
  };
  overallCompletion: number;
  nextAction: string;
}

export interface PersonalStatement {
  id: string;
  phase: string | null;
  wordCount: number | null;
  hasReview: boolean;
  updatedAt: string;
}

// New types for the variant-aware sections.
export interface CourseRow {
  id: string;
  courseName: string;
  level: string | null; // 'honors' | 'AP' | null
  grade: string | null; // 'A' | 'B+' | etc.
  inProgress: boolean;
}

export interface PsatPlan {
  testDateIso: string;
  weeksRemaining: number;
  studyHoursLogged: number;
  recommendedHoursPerWeek: number;
}

export interface WhyTransferEssay {
  id: string;
  phase: string;
  wordCount: number;
  wordTarget: number;
}

export type PriorityWidgetKind =
  | "courseRigorStretch" | "summerPlan" | "majorExploration"
  | "psatPrep" | "summerExperience" | "activitiesDepth"
  | "schoolListBalance" | "satBars" | "activitiesThroughLine"
  | "applicationTracker" | "supplementsProgress" | "psPhase"
  | "decisionsTracker" | "demonstratedInterest" | "planB"
  | "aidComparator" | "waitlist"
  | "whyTransferPhase" | "articulationBreakdown" | "professorRecs";

export interface PriorityWidget {
  kind: PriorityWidgetKind;
  // Each kind has its own data shape; PriorityWidgetRow renders the
  // appropriate sub-component per kind. Kept as `unknown` here to keep
  // this type module dependency-light; the consuming sub-components
  // narrow it.
  data: unknown;
  // Coach Kairos observation for this widget, if any (Phase 2.7).
  nudge?: { observation: string; eyebrow: string };
}

export interface WidgetItem {
  n: string;
  label: string;
  tone?: "gold";
  delta?: string;
}

// THE shape returned by /api/cc/dashboard/summary after this plan ships.
// Existing fields preserved verbatim for legacy CounselorDashboard.
export interface DashboardSummary {
  // ─── Existing — UNCHANGED for legacy / compatibility ───
  firstName: string | null;
  brief: string | null;
  schools: SchoolProgress[];
  personalStatement: PersonalStatement | null;
  activities: { logged: number; optimized: number };

  // ─── New — additive ───
  variantKey: VariantKey;
  statusLabel: string;
  statusTone: "gold" | "leaf" | "sky" | "rose";
  courses: CourseRow[] | null;
  psatPlan: PsatPlan | null;
  whyTransferEssay: WhyTransferEssay | null;
  priorityWidgets: PriorityWidget[];
  footerWidgets: WidgetItem[];
  observations: Record<string, { observation: string; eyebrow: string }>;
}
