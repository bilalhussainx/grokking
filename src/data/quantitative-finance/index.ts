import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { derivativesModule } from "./02-derivatives";
import { optionsPricingModule } from "./03-options-pricing";
import { riskManagementModule } from "./04-risk-management";
import { fixedIncomeQuantModule } from "./05-fixed-income-quant";
import { portfolioTheoryModule } from "./06-portfolio-theory";
import { algoTradingModule } from "./07-algorithmic-trading";

export const quantitativeFinanceCourse: Course = {
  id: "quantitative-finance",
  slug: "quantitative-finance",
  title: "Quantitative Finance & Derivatives",
  description:
    "Master quantitative finance from mathematical foundations through derivatives pricing, risk management, portfolio theory, and algorithmic trading — all with hands-on Python implementations.",
  icon: "\u{1F522}",
  tier: "pro",
  modules: [
    foundationsModule,
    derivativesModule,
    optionsPricingModule,
    riskManagementModule,
    fixedIncomeQuantModule,
    portfolioTheoryModule,
    algoTradingModule,
  ],
};
