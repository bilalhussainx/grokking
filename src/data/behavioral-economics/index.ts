import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { biasesModule } from "./02-biases";
import { prospectTheoryModule } from "./03-prospect-theory";
import { nudgeModule } from "./04-nudge";
import { marketAnomaliesModule } from "./05-market-anomalies";
import { applicationsModule } from "./06-applications";

export const behavioralEconomicsCourse: Course = {
  id: "behavioral-economics",
  slug: "behavioral-economics",
  title: "Behavioral Economics: Psychology of Decisions",
  description:
    "Explore how cognitive biases, heuristics, and emotions shape economic decisions. 6 modules covering Prospect Theory, nudge theory, market anomalies, and real-world applications in finance, health, and policy.",
  icon: "\u{1F9E0}",
  tier: "free",
  modules: [
    foundationsModule,
    biasesModule,
    prospectTheoryModule,
    nudgeModule,
    marketAnomaliesModule,
    applicationsModule,
  ],
};
