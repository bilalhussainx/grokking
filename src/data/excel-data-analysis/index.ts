import { Course } from "../types";
import { module1 } from "./01-excel-fundamentals";
import { module2 } from "./02-pivot-tables-analysis";
import { module3 } from "./03-advanced-formulas";
import { module4 } from "./04-charts-dashboards";
import { module5 } from "./05-power-query";
import { module6 } from "./06-financial-modeling";
import { module7 } from "./07-vba-macros";

export const excelDataAnalysisCourse: Course = {
  id: "excel-data-analysis",
  slug: "excel-data-analysis",
  title: "Excel for Data Analysis",
  description: "From VLOOKUP to Power Query, financial modeling, and VBA automation. Master pivot tables, dynamic arrays with XLOOKUP/FILTER, dashboard design, DCF models with scenario analysis, Power Query ETL, and macros that automate hours of work.",
  icon: "📗",
  tier: "pro",
  featured: false,
  domain: "finance-business",
  level: "beginner",
  prerequisiteIds: [],
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
