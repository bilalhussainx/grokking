import { Course } from "../types";
import { module1 } from "./01-foundations";
import { module2 } from "./02-joins";
import { module3 } from "./03-aggregations-grouping";
import { module4 } from "./04-subqueries-ctes";
import { module5 } from "./05-indexes-optimization";

export const sqlCompleteCourse: Course = {
  id: "sql-complete",
  slug: "sql-complete",
  title: "SQL: Complete Database Mastery",
  description:
    "Master SQL from fundamentals to advanced — JOINs, aggregations, window functions, CTEs, indexes, query optimization, transactions, and PostgreSQL-specific features.",
  icon: "🗄️",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "beginner",
  modules: [module1, module2, module3, module4, module5],
};
