import { Course } from "../types";
import { numpyFoundationsModule } from "./01-numpy-foundations";
import { mathForMlModule } from "./02-math-for-ml";
import { dataPreprocessingModule } from "./03-data-preprocessing";
import { linearRegressionModule } from "./04-linear-regression";
import { logisticRegressionModule } from "./05-logistic-regression";
import { neuralNetworksFromScratchModule } from "./06-neural-networks-from-scratch";
import { trainingDeepNetworksModule } from "./07-training-deep-networks";
import { convolutionalNeuralNetworksModule } from "./08-convolutional-neural-networks";
import { nlpFundamentalsModule } from "./09-nlp-fundamentals";
import { unsupervisedLearningModule } from "./10-unsupervised-learning";
import { modelEvaluationDeploymentModule } from "./11-model-evaluation-deployment";

export const aiMlFundamentalsCourse: Course = {
  id: "ai-ml-fundamentals",
  slug: "ai-ml-fundamentals",
  title: "AI & Machine Learning Fundamentals",
  description: "Master the foundations of AI and machine learning from scratch. Build linear regression, logistic regression, neural networks, CNNs, and NLP pipelines using only NumPy — no frameworks, just understanding.",
  icon: "🤖",
  tier: "pro",
  domain: "computer-science",
  variation: "ai-ml",
  level: "beginner",
  featured: true,
  modules: [
    numpyFoundationsModule,
    mathForMlModule,
    dataPreprocessingModule,
    linearRegressionModule,
    logisticRegressionModule,
    neuralNetworksFromScratchModule,
    trainingDeepNetworksModule,
    convolutionalNeuralNetworksModule,
    nlpFundamentalsModule,
    unsupervisedLearningModule,
    modelEvaluationDeploymentModule,
  ],
};
