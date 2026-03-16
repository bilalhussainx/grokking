import { Course } from "../types";
import { overviewModule } from "./01-overview";
import { modelingModule } from "./02-financial-modeling";
import { dcfModule } from "./03-dcf-valuation";
import { compsModule } from "./04-comps-precedents";
import { lboModule } from "./05-lbo";
import { pitchbooksModule } from "./06-pitchbooks";
import { technicalInterviewModule } from "./07-technical-interview";

export const investmentBankingCourse: Course = {
  id: "investment-banking",
  slug: "investment-banking",
  title: "Investment Banking Fundamentals",
  description:
    "Master investment banking from deal processes and financial modeling to DCF valuation, LBO analysis, and technical interview prep — everything you need to break into IB.",
  icon: "\u{1F3E6}",
  tier: "pro",
  modules: [
    overviewModule,
    modelingModule,
    dcfModule,
    compsModule,
    lboModule,
    pitchbooksModule,
    technicalInterviewModule,
  ],
};
