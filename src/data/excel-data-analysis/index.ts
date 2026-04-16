import { Course } from "../types";
import { module1 } from "./01-excel-fundamentals";
import { module2 } from "./02-pivot-tables-analysis";

export const excelDataAnalysisCourse: Course = {
  id: "excel-data-analysis",
  slug: "excel-data-analysis",
  title: "Excel for Data Analysis",
  description: "From VLOOKUP to Power Query and dynamic arrays. Master pivot tables, conditional aggregation, dashboard design, and the Excel features that turn raw data into business decisions.",
  icon: "📗",
  tier: "pro",
  featured: false,
  domain: "finance-business",
  level: "beginner",
  prerequisiteIds: [],
  modules: [
    module1,
    module2,
  ],
};
