import { Course } from "../types";
import { tradeTheoryModule } from "./01-trade-theory";
import { tradePolicyModule } from "./02-trade-policy";
import { exchangeRatesModule } from "./03-exchange-rates";
import { balancePaymentsModule } from "./04-balance-payments";
import { developmentModule } from "./05-development";
import { globalizationModule } from "./06-globalization";

export const internationalEconomicsCourse: Course = {
  id: "international-economics",
  slug: "international-economics",
  title: "International Economics & Trade",
  description:
    "Master the economics of global trade, exchange rates, balance of payments, development, and globalization. 6 modules covering trade theory, policy, forex markets, sovereign debt, and the forces shaping the world economy.",
  icon: "\u{1F310}",
  tier: "free",
  modules: [
    tradeTheoryModule,
    tradePolicyModule,
    exchangeRatesModule,
    balancePaymentsModule,
    developmentModule,
    globalizationModule,
  ],
};
