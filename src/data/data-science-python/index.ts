import { Course } from "../types";
import { module1 } from "./01-numpy-pandas";
import { module2 } from "./02-visualization-eda";
import { module3 } from "./03-data-cleaning";
import { module4 } from "./04-scikit-learn-ml";
import { module5 } from "./05-capstone-pipeline";

export const dataSciencePythonCourse: Course = {
  id: "data-science-python",
  slug: "data-science-python",
  title: "Data Science with Python",
  description: "From NumPy arrays to deployed ML models. Master pandas, matplotlib/seaborn, data cleaning, feature engineering, and scikit-learn through a complete end-to-end house price prediction project.",
  icon: "📊",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "intermediate",
  prerequisiteIds: ["python-fundamentals"],
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
  ],
};
