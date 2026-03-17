import { Course } from "../types";
import { whatIsPsychologyModule } from "./01-what-is-psychology";
import { researchMethodsModule } from "./02-research-methods";
import { biologicalBasesModule } from "./03-biological-bases";
import { sensationPerceptionModule } from "./04-sensation-perception";
import { learningMemoryModule } from "./05-learning-memory";
import { developmentalModule } from "./06-developmental";
import { socialPsychologyModule } from "./07-social-psychology";
import { abnormalModule } from "./08-abnormal";

export const introPsychologyCourse: Course = {
  id: "intro-psychology",
  slug: "intro-psychology",
  title: "Introduction to Psychology",
  description:
    "Explore the science of mind and behavior -- from neurons and perception to learning, development, social influence, and mental health. Covers classic experiments by Pavlov, Milgram, and Asch with clear analogies for high school students.",
  icon: "\uD83E\uDDE0",
  tier: "free",
  featured: true,
  domain: "health-wellness",
  variation: "mental-health",
  level: "beginner" as const,
  modules: [
    whatIsPsychologyModule,
    researchMethodsModule,
    biologicalBasesModule,
    sensationPerceptionModule,
    learningMemoryModule,
    developmentalModule,
    socialPsychologyModule,
    abnormalModule,
  ],
};
