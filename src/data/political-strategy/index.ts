import { Course } from "../types";
import { whatIsGeopoliticsModule } from "./01-what-is-geopolitics";
import { greatPowerCompetitionModule } from "./02-great-power-competition";
import { energyResourcesModule } from "./03-energy-resources";
import { internationalInstitutionsModule } from "./04-international-institutions";
import { intelligenceInformationModule } from "./05-intelligence-information";
import { diplomacyNegotiationModule } from "./06-diplomacy-negotiation";
import { capstoneStrategicModule } from "./07-capstone";

export const politicalStrategyCourse: Course = {
  id: "political-strategy",
  slug: "political-strategy",
  title: "Political Strategy & Geopolitics",
  description:
    "Analyze great power competition, energy politics, intelligence operations, and diplomatic strategy through the lens of realism, liberalism, and constructivism. 7 modules with real-world case studies and structured analytical frameworks.",
  icon: "\u{1F30D}",
  tier: "pro",
  domain: "political-strategy",
  variation: "geopolitics",
  level: "advanced",
  modules: [
    whatIsGeopoliticsModule,
    greatPowerCompetitionModule,
    energyResourcesModule,
    internationalInstitutionsModule,
    intelligenceInformationModule,
    diplomacyNegotiationModule,
    capstoneStrategicModule,
  ],
};
