import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { budgetingModule } from "./02-budgeting";
import { debtModule } from "./03-debt";
import { savingInvestingModule } from "./04-saving-investing";
import { retirementModule } from "./05-retirement";
import { taxesModule } from "./06-taxes";
import { insuranceEstateModule } from "./07-insurance-estate";

export const personalFinanceCourse: Course = {
  id: "personal-finance",
  slug: "personal-finance",
  title: "Personal Finance Mastery",
  description:
    "Master your money — from budgeting and debt management to investing, retirement planning, taxes, and estate planning. 7 modules covering everything you need to build lasting wealth.",
  icon: "\u{1F4B0}",
  tier: "free",
  featured: true,
  domain: "finance-business",
  variation: "personal-finance",
  level: "beginner" as const,
  modules: [
    foundationsModule,
    budgetingModule,
    debtModule,
    savingInvestingModule,
    retirementModule,
    taxesModule,
    insuranceEstateModule,
  ],
};
