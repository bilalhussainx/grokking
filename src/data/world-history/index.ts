import { Course } from "../types";
import { ancientCivilizationsModule } from "./01-ancient-civilizations";
import { classicalEraModule } from "./02-classical-era";
import { medievalWorldModule } from "./03-medieval-world";
import { islamicGoldenAgeModule } from "./04-islamic-golden-age";
import { renaissanceReformationModule } from "./05-renaissance-reformation";
import { ageOfRevolutionModule } from "./06-age-of-revolution";
import { modernEraModule } from "./07-modern-era";
import { capstoneModule } from "./08-capstone";

export const worldHistoryCourse: Course = {
  id: "world-history",
  slug: "world-history",
  title: "World History: Civilizations & Change",
  description:
    "Journey from ancient Mesopotamia to the modern era -- explore how geography, technology, ideas, and human choices shaped civilizations across every continent. Presents multiple perspectives including Islamic, Asian, African, and Latin American voices alongside European.",
  icon: "\uD83C\uDF0D",
  tier: "free",
  featured: true,
  domain: "philosophy",
  variation: "western-ancient",
  level: "beginner" as const,
  modules: [
    ancientCivilizationsModule,
    classicalEraModule,
    medievalWorldModule,
    islamicGoldenAgeModule,
    renaissanceReformationModule,
    ageOfRevolutionModule,
    modernEraModule,
    capstoneModule,
  ],
};
