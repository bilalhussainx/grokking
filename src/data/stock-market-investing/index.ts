import { Course } from "../types";
import { basicsModule } from "./01-basics";
import { fundamentalAnalysisModule } from "./02-fundamental-analysis";
import { technicalAnalysisModule } from "./03-technical-analysis";
import { portfolioModule } from "./04-portfolio";
import { etfsFundsModule } from "./05-etfs-funds";
import { fixedIncomeModule } from "./06-fixed-income";
import { alternativeModule } from "./07-alternative";
import { strategyModule } from "./08-strategy";

export const stockMarketInvestingCourse: Course = {
  id: "stock-market-investing",
  slug: "stock-market-investing",
  title: "Stock Market & Investing",
  description:
    "Learn to invest confidently — from stock market basics and fundamental analysis to portfolio management, ETFs, bonds, and proven investment strategies.",
  icon: "\u{1F4CA}",
  tier: "free",
  modules: [
    basicsModule,
    fundamentalAnalysisModule,
    technicalAnalysisModule,
    portfolioModule,
    etfsFundsModule,
    fixedIncomeModule,
    alternativeModule,
    strategyModule,
  ],
};
