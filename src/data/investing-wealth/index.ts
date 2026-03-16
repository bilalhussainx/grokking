import { Course } from "../types";
import { whyInvestModule } from "./01-why-invest";
import { stockMarketModule } from "./02-stock-market";
import { bondsModule } from "./03-bonds";
import { indexFundsEtfsModule } from "./04-index-funds-etfs";
import { realEstateModule } from "./05-real-estate";
import { retirementPlanningModule } from "./06-retirement";
import { riskManagementModule } from "./07-risk-management";
import { capstonePortfolioModule } from "./08-capstone";

export const investingWealthCourse: Course = {
  id: "investing-wealth",
  slug: "investing-wealth",
  title: "Investing & Wealth Building",
  description:
    "From stock market fundamentals to retirement planning and portfolio construction. 8 modules covering everything you need to build lasting wealth through disciplined, evidence-based investing.",
  icon: "\u{1F4C8}",
  tier: "pro",
  domain: "finance-business",
  variation: "personal-finance",
  level: "advanced",
  prerequisiteIds: ["personal-finance"],
  modules: [
    whyInvestModule,
    stockMarketModule,
    bondsModule,
    indexFundsEtfsModule,
    realEstateModule,
    retirementPlanningModule,
    riskManagementModule,
    capstonePortfolioModule,
  ],
};
