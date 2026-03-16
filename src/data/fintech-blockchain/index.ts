import { Course } from "../types";
import { fintechOverviewModule } from "./01-fintech-overview";
import { paymentsModule } from "./02-payments";
import { blockchainModule } from "./03-blockchain";
import { defiModule } from "./04-defi";
import { cryptoInvestingModule } from "./05-crypto-investing";
import { neobankingModule } from "./06-neobanking";
import { futureModule } from "./07-future";

export const fintechBlockchainCourse: Course = {
  id: "fintech-blockchain",
  slug: "fintech-blockchain",
  title: "FinTech & Blockchain",
  description:
    "Master the FinTech revolution — from payment systems and digital wallets to blockchain, DeFi, crypto investing, neobanking, and the future of money. 7 modules covering the technologies reshaping financial services.",
  icon: "\u26D3\uFE0F",
  tier: "pro",
  modules: [
    fintechOverviewModule,
    paymentsModule,
    blockchainModule,
    defiModule,
    cryptoInvestingModule,
    neobankingModule,
    futureModule,
  ],
};
