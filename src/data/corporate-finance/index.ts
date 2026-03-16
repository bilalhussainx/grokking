import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { timeValueModule } from "./02-time-value";
import { valuationModule } from "./03-valuation";
import { capitalStructureModule } from "./04-capital-structure";
import { capitalBudgetingModule } from "./05-capital-budgeting";
import { dividendsModule } from "./06-dividends";
import { mergersModule } from "./07-mergers";

export const corporateFinanceCourse: Course = {
  id: "corporate-finance",
  slug: "corporate-finance",
  title: "Corporate Finance",
  description:
    "Master the analytical frameworks used by CFOs and investment bankers — from time value of money and DCF valuation to capital structure, M&A, and dividend policy. Grounded in Berk & DeMarzo, Damodaran, and MIT OCW 15.401.",
  icon: "\u{1F3E2}",
  tier: "pro",
  modules: [
    foundationsModule,
    timeValueModule,
    valuationModule,
    capitalStructureModule,
    capitalBudgetingModule,
    dividendsModule,
    mergersModule,
  ],
};
