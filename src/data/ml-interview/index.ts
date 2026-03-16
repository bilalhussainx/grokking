import { Course } from "../types";
import { fundamentalsModule } from "./01-fundamentals";
import { featureEngineeringModule } from "./02-feature-engineering";
import { classicMlModule } from "./03-classic-ml";
import { deepLearningModule } from "./04-deep-learning";
import { searchRankingModule } from "./05-search-ranking";
import { recommendationsModule } from "./06-recommendations";
import { adPredictionModule } from "./07-ad-prediction";
import { feedRankingModule } from "./08-feed-ranking";

export const mlInterviewCourse: Course = {
  id: "ml-interview",
  slug: "ml-interview",
  title: "Machine Learning Interview Prep",
  description: "Prepare for ML interviews covering fundamentals, algorithms, deep learning, and real-world ML system design problems like search ranking, recommendations, and ad prediction.",
  icon: "🤖",
  tier: "pro",
  modules: [fundamentalsModule, featureEngineeringModule, classicMlModule, deepLearningModule, searchRankingModule, recommendationsModule, adPredictionModule, feedRankingModule],
};
