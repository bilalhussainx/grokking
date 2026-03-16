import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { supervisedModule } from "./02-supervised";
import { deepLearningModule } from "./03-deep-learning";
import { nlpFinanceModule } from "./04-nlp-finance";
import { rlTradingModule } from "./05-rl-trading";
import { productionModule } from "./06-production";

export const financialMlCourse: Course = {
  id: "financial-ml",
  slug: "financial-ml",
  title: "Financial Machine Learning",
  description:
    "Master machine learning for finance — from feature engineering and supervised learning to deep learning, NLP, reinforcement learning, and production deployment. All with hands-on Python implementations using real financial concepts.",
  icon: "\u{1F911}",
  tier: "pro",
  modules: [
    foundationsModule,
    supervisedModule,
    deepLearningModule,
    nlpFinanceModule,
    rlTradingModule,
    productionModule,
  ],
};
