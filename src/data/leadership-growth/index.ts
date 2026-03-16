import { Course } from "../types";
import { selfAwarenessModule } from "./01-self-awareness";
import { emotionalIntelligenceModule } from "./02-emotional-intelligence";
import { communicationModule } from "./03-communication";
import { decisionMakingModule } from "./04-decision-making";
import { buildingTeamsModule } from "./05-building-teams";
import { managingConflictModule } from "./06-managing-conflict";
import { capstoneLeadershipPlanModule } from "./07-capstone";

export const leadershipGrowthCourse: Course = {
  id: "leadership-growth",
  slug: "leadership-growth",
  title: "Leadership & Personal Growth",
  description:
    "Build the inner skills that define great leaders. Grounded in psychology research from Goleman, Dweck, Kahneman, and Seligman — master self-awareness, emotional intelligence, communication, decision-making, and team building.",
  icon: "\u{1F31F}",
  tier: "free",
  featured: false,
  domain: "health-wellness",
  variation: "stress-management",
  level: "beginner" as const,
  modules: [
    selfAwarenessModule,
    emotionalIntelligenceModule,
    communicationModule,
    decisionMakingModule,
    buildingTeamsModule,
    managingConflictModule,
    capstoneLeadershipPlanModule,
  ],
};
