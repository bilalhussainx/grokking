import { Course } from "../types";
import { chemistryOfLifeModule } from "./01-chemistry-of-life";
import { cellStructureModule } from "./02-cell-structure";
import { cellularEnergeticsModule } from "./03-cellular-energetics";
import { cellCommunicationModule } from "./04-cell-communication";
import { heredityGeneticsModule } from "./05-heredity-genetics";
import { geneExpressionModule } from "./06-gene-expression";
import { evolutionModule } from "./07-evolution";
import { ecologyModule } from "./08-ecology";

export const apBiologyCourse: Course = {
  id: "ap-biology",
  slug: "ap-biology",
  title: "AP Biology Essentials",
  description:
    "Master the AP Biology curriculum -- from the chemistry of life and cell structure to genetics, evolution, and ecology. Aligned with College Board standards, with analogies and real experiments that make complex biology accessible.",
  icon: "\uD83E\uDDEC",
  tier: "free",
  featured: true,
  domain: "health-wellness",
  variation: "holistic-health",
  level: "beginner" as const,
  modules: [
    chemistryOfLifeModule,
    cellStructureModule,
    cellularEnergeticsModule,
    cellCommunicationModule,
    heredityGeneticsModule,
    geneExpressionModule,
    evolutionModule,
    ecologyModule,
  ],
};
