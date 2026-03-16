import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { threeStatementModule } from "./02-three-statement";
import { dcfModelModule } from "./03-dcf-model";
import { lboModelModule } from "./04-lbo-model";
import { mergerModelModule } from "./05-merger-model";
import { realEstateModule } from "./06-real-estate";
import { scenariosModule } from "./07-scenarios";

export const financialModelingCourse: Course = {
  id: "financial-modeling",
  slug: "financial-modeling",
  title: "Financial Modeling & Analysis",
  description:
    "Master financial modeling from three-statement models and DCF valuation to LBO, merger, and real estate models — with scenario analysis and presentation techniques.",
  icon: "\u{1F4C9}",
  tier: "pro",
  modules: [
    foundationsModule,
    threeStatementModule,
    dcfModelModule,
    lboModelModule,
    mergerModelModule,
    realEstateModule,
    scenariosModule,
  ],
};
