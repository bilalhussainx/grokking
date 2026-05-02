// src/components/cc/dashboard/sections/variant-sections.ts
// Per-variant ordered list of sections + the registry mapping ids to
// components. Adding a variant or moving a widget = editing this file
// only. The orchestrator is dumb — it just maps the array.
import type { ComponentType } from "react";
import type { VariantKey } from "@/app/cc/dashboard/variants";
import type { DashboardSummary } from "./types";
import PriorityBrief from "./PriorityBrief";
import LoomingDeadlines from "./LoomingDeadlines";
import SchoolCardGrid from "./SchoolCardGrid";
import CourseRigorGrid from "./CourseRigorGrid";
import PSATPlanCard from "./PSATPlanCard";
import WhyTransferFeatured from "./WhyTransferFeatured";
import PersonalStatementCard from "./PersonalStatementCard";
import PriorityWidgetRow from "./PriorityWidgetRow";
import ActivitiesSnapshot from "./ActivitiesSnapshot";
import WidgetStripFooter from "./WidgetStripFooter";

export type SectionId =
  | "PriorityBrief" | "LoomingDeadlines" | "SchoolCardGrid"
  | "CourseRigorGrid" | "PSATPlanCard" | "WhyTransferFeatured"
  | "PersonalStatementCard" | "PriorityWidgetRow"
  | "ActivitiesSnapshot" | "WidgetStripFooter";

type SectionComponent = ComponentType<{ summary: DashboardSummary }>;

export const SECTION_REGISTRY: Record<SectionId, SectionComponent> = {
  PriorityBrief,
  LoomingDeadlines,
  SchoolCardGrid,
  CourseRigorGrid,
  PSATPlanCard,
  WhyTransferFeatured,
  PersonalStatementCard,
  PriorityWidgetRow,
  ActivitiesSnapshot,
  WidgetStripFooter,
};

// Per-variant section order. Sections that have no data return null,
// so it's safe to include them defensively.
export const SECTION_ORDER: Record<VariantKey, SectionId[]> = {
  g9: [
    "PriorityBrief", "CourseRigorGrid", "PriorityWidgetRow",
    "ActivitiesSnapshot", "WidgetStripFooter",
  ],
  g10: [
    "PriorityBrief", "PSATPlanCard", "CourseRigorGrid",
    "PriorityWidgetRow", "ActivitiesSnapshot", "WidgetStripFooter",
  ],
  junior: [
    "PriorityBrief", "LoomingDeadlines", "SchoolCardGrid",
    "PriorityWidgetRow", "ActivitiesSnapshot", "WidgetStripFooter",
  ],
  senior_writing: [
    "PriorityBrief", "LoomingDeadlines", "SchoolCardGrid",
    "PersonalStatementCard", "PriorityWidgetRow",
    "ActivitiesSnapshot", "WidgetStripFooter",
  ],
  senior_post_submit: [
    "PriorityBrief", "SchoolCardGrid", "PriorityWidgetRow",
    "ActivitiesSnapshot", "WidgetStripFooter",
  ],
  senior_decisions: [
    "PriorityBrief", "SchoolCardGrid", "PriorityWidgetRow",
    "WidgetStripFooter",
  ],
  transfer: [
    "PriorityBrief", "WhyTransferFeatured", "SchoolCardGrid",
    "PriorityWidgetRow", "WidgetStripFooter",
  ],
  unknown: [
    "PriorityBrief", "WidgetStripFooter",
  ],
};
