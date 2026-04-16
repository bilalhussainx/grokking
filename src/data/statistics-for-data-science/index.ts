import { Course } from "../types";
import { module1 } from "./01-probability-distributions";
import { module2 } from "./02-hypothesis-testing";
import { module3 } from "./03-bayesian-statistics";
import { module4 } from "./04-regression-analysis";
import { module5 } from "./05-time-series";
import { module6 } from "./06-experimental-design";
import { module7 } from "./07-statistical-computing";

export const statisticsDataScienceCourse: Course = {
  id: "statistics-for-data-science",
  slug: "statistics-for-data-science",
  title: "Statistics for Data Science",
  description: "The statistical foundation every data scientist needs. Probability, distributions, CLT, hypothesis testing, A/B experiments, Bayesian statistics, regression analysis with regularization, time series forecasting with ARIMA and Prophet, causal inference with DiD and RD, and Monte Carlo simulation.",
  icon: "📐",
  tier: "pro",
  featured: false,
  domain: "computer-science",
  level: "intermediate",
  prerequisiteIds: ["data-science-python"],
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
    module6,
    module7,
  ],
};
