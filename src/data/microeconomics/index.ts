import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { supplyDemandModule } from "./02-supply-demand";
import { consumerTheoryModule } from "./03-consumer-theory";
import { producerTheoryModule } from "./04-producer-theory";
import { marketStructuresModule } from "./05-market-structures";
import { marketFailuresModule } from "./06-market-failures";
import { laborMarketsModule } from "./07-labor-markets";

export const microeconomicsCourse: Course = {
  id: "microeconomics",
  slug: "microeconomics",
  title: "Microeconomics: Markets & Decision Making",
  description:
    "Master the economics of individual choice and market dynamics — from supply and demand through consumer theory, producer theory, market structures, market failures, and labor markets. 7 modules with 35 lessons and Python exercises.",
  icon: "\u{1F4C8}",
  tier: "free",
  modules: [
    foundationsModule,
    supplyDemandModule,
    consumerTheoryModule,
    producerTheoryModule,
    marketStructuresModule,
    marketFailuresModule,
    laborMarketsModule,
  ],
};
