import { Course } from "../types";
import { introModule } from "./01-intro";
import { financialStatementsModule } from "./02-financial-statements";
import { journalEntriesModule } from "./03-journal-entries";
import { ratioAnalysisModule } from "./04-ratio-analysis";
import { costAccountingModule } from "./05-cost-accounting";
import { managerialModule } from "./06-managerial";
import { auditEthicsModule } from "./07-audit-ethics";

export const accountingFundamentalsCourse: Course = {
  id: "accounting-fundamentals",
  slug: "accounting-fundamentals",
  title: "Accounting Fundamentals",
  description:
    "Master the language of business — from the accounting equation and double-entry bookkeeping through financial statements, ratio analysis, cost accounting, managerial decision-making, and auditing ethics. 7 modules with 35 lessons and hands-on Python exercises.",
  icon: "\u{1F4CA}",
  tier: "free",
  modules: [
    introModule,
    financialStatementsModule,
    journalEntriesModule,
    ratioAnalysisModule,
    costAccountingModule,
    managerialModule,
    auditEthicsModule,
  ],
};
