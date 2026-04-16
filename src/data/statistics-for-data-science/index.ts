import { Course } from "../types";
import { module1 } from "./01-probability-distributions";
import { module2 } from "./02-hypothesis-testing";

export const statisticsDataScienceCourse: Course = {
  id: "statistics-for-data-science",
  slug: "statistics-for-data-science",
  title: "Statistics for Data Science",
  description: "The statistical foundation every data scientist needs. Probability, distributions, CLT, hypothesis testing, A/B experiments, sample size calculation, and regression analysis — taught with Python code.",
  icon: "📐",
  tier: "pro",
  featured: false,
  domain: "computer-science",
  level: "intermediate",
  prerequisiteIds: ["data-science-python"],
  modules: [
    module1,
    module2,
  ],
};
