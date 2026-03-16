import { Course } from "../types";
import { whatIsAIModule } from "./01-what-is-ai";
import { supervisedLearningModule } from "./02-supervised-learning";
import { neuralNetworksModule } from "./03-neural-networks";
import { trainingOptimizationModule } from "./04-training-optimization";
import { computerVisionModule } from "./05-computer-vision";
import { nlpBasicsModule } from "./06-nlp-basics";
import { ethicsInAIModule } from "./07-ethics-in-ai";
import { capstoneClassifierModule } from "./08-capstone";

export const aiMlFundamentalsCourse: Course = {
  id: "ai-ml-fundamentals",
  slug: "ai-ml-fundamentals",
  title: "AI & Machine Learning Fundamentals",
  description:
    "Master the foundations of AI and machine learning from scratch. Build linear regression, logistic regression, neural networks, CNNs, and NLP pipelines using only NumPy — no frameworks, just understanding.",
  icon: "\u{1F916}",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  variation: "ai-ml",
  level: "beginner" as const,
  modules: [
    whatIsAIModule,
    supervisedLearningModule,
    neuralNetworksModule,
    trainingOptimizationModule,
    computerVisionModule,
    nlpBasicsModule,
    ethicsInAIModule,
    capstoneClassifierModule,
  ],
};
