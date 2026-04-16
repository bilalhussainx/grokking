import { Course } from "../types";
import { module1 } from "./01-ml-foundations";
import { module2 } from "./02-supervised-learning";
import { module3 } from "./03-neural-networks";
import { module4 } from "./04-unsupervised-evaluation";
import { module5 } from "./05-ml-production";

export const machinelearningCompleteCourse: Course = {
  id: "machine-learning-complete",
  slug: "machine-learning-complete",
  title: "Machine Learning Complete",
  description: "From bias-variance fundamentals to PyTorch neural networks and production MLOps. Master supervised learning, clustering, dimensionality reduction, and deploy models that survive real-world data drift.",
  icon: "🤖",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "advanced",
  prerequisiteIds: ["data-science-python"],
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
  ],
};
