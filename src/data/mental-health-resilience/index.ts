import { Course } from "../types";
import { understandingMentalHealthModule } from "./01-understanding-mental-health";
import { stressNervousSystemModule } from "./02-stress-nervous-system";
import { anxietyManagementModule } from "./03-anxiety-management";
import { buildingResilienceModule } from "./04-building-resilience";
import { sleepRecoveryModule } from "./05-sleep-recovery";
import { mindfulnessMeditationModule } from "./06-mindfulness-meditation";
import { capstoneResilienceToolkitModule } from "./07-capstone";

export const mentalHealthResilienceCourse: Course = {
  id: "mental-health-resilience",
  slug: "mental-health-resilience",
  title: "Mental Health & Resilience",
  description:
    "Evidence-based strategies for managing stress, anxiety, and building lasting resilience. Learn practical techniques from CBT, mindfulness, and sleep science.",
  icon: "\u{1F9D8}",
  tier: "free",
  featured: true,
  domain: "health-wellness",
  variation: "mental-health",
  level: "beginner",
  modules: [
    understandingMentalHealthModule,
    stressNervousSystemModule,
    anxietyManagementModule,
    buildingResilienceModule,
    sleepRecoveryModule,
    mindfulnessMeditationModule,
    capstoneResilienceToolkitModule,
  ],
};
