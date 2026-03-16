import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { statisticsModule } from "./02-statistics";
import { regressionModule } from "./03-regression";
import { optimizationModule } from "./04-optimization";
import { forecastingModule } from "./05-forecasting";
import { abTestingModule } from "./06-ab-testing";
import { visualizationModule } from "./07-visualization";

export const businessAnalyticsCourse: Course = {
  id: "business-analytics",
  slug: "business-analytics",
  title: "Business Analytics & Data-Driven Decisions",
  description:
    "Master the analytical toolkit for modern business decisions. From statistics and regression to optimization, forecasting, A/B testing, and data visualization \u2014 learn to turn data into actionable insights. Inspired by HBS curriculum.",
  icon: "\uD83D\uDCCA",
  tier: "pro",
  modules: [
    foundationsModule,
    statisticsModule,
    regressionModule,
    optimizationModule,
    forecastingModule,
    abTestingModule,
    visualizationModule,
  ],
};
