import { Course } from "../types";
import { whatIsMeditationModule } from "./01-what-is-meditation";
import { breathAwarenessModule } from "./02-breath-awareness";
import { bodyScanModule } from "./03-body-scan";
import { lovingKindnessModule } from "./04-loving-kindness";
import { mindfulLivingModule } from "./05-mindful-living";
import { difficultEmotionsModule } from "./06-difficult-emotions";
import { capstoneModule } from "./07-capstone";

export const meditationMindfulnessCourse: Course = {
  id: "meditation-mindfulness",
  slug: "meditation-mindfulness",
  title: "Meditation & Mindfulness Practice",
  description:
    "Learn evidence-based meditation and mindfulness practices — from breath awareness and body scans to loving-kindness and emotional regulation. Build a sustainable daily practice backed by neuroscience research from JAMA, The Lancet, and leading universities.",
  icon: "\u{1F9D8}\u200D\u2642\uFE0F",
  tier: "free",
  featured: true,
  domain: "health-wellness",
  variation: "meditation-mindfulness",
  level: "beginner" as const,
  modules: [
    whatIsMeditationModule,
    breathAwarenessModule,
    bodyScanModule,
    lovingKindnessModule,
    mindfulLivingModule,
    difficultEmotionsModule,
    capstoneModule,
  ],
};
