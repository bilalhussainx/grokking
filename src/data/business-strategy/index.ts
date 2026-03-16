import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { competitiveAdvantageModule } from "./02-competitive-advantage";
import { disruptionModule } from "./03-disruption";
import { growthModule } from "./04-growth";
import { executionModule } from "./05-execution";
import { digitalModule } from "./06-digital";
import { globalModule } from "./07-global";
import { casesModule } from "./08-cases";

export const businessStrategyCourse: Course = {
  id: "business-strategy",
  slug: "business-strategy",
  title: "Business Strategy: From Analysis to Execution",
  description:
    "Master the frameworks that drive strategic decision-making. From Porter's Five Forces to Blue Ocean Strategy, from disruption theory to digital transformation \u2014 learn to analyze industries, build competitive advantage, and execute strategy effectively. Inspired by HBS curriculum.",
  icon: "\u265F\uFE0F",
  tier: "pro",
  modules: [
    foundationsModule,
    competitiveAdvantageModule,
    disruptionModule,
    growthModule,
    executionModule,
    digitalModule,
    globalModule,
    casesModule,
  ],
};
