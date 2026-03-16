import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { growthModule } from "./02-growth";
import { unemploymentInflationModule } from "./03-unemployment-inflation";
import { fiscalPolicyModule } from "./04-fiscal-policy";
import { monetaryPolicyModule } from "./05-monetary-policy";
import { internationalModule } from "./06-international";
import { businessCyclesModule } from "./07-business-cycles";

export const macroeconomicsCourse: Course = {
  id: "macroeconomics",
  slug: "macroeconomics",
  title: "Macroeconomics: The Big Picture",
  description:
    "Understand the forces that shape the entire economy — GDP, growth, unemployment, inflation, fiscal and monetary policy, international trade, and financial crises. 7 modules with 35 lessons covering the essential macroeconomic frameworks.",
  icon: "\u{1F30D}",
  tier: "free",
  modules: [
    foundationsModule,
    growthModule,
    unemploymentInflationModule,
    fiscalPolicyModule,
    monetaryPolicyModule,
    internationalModule,
    businessCyclesModule,
  ],
};
