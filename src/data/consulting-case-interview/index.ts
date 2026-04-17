import { Course } from "../types";
import { module1 } from "./01-case-interview-fundamentals";
import { module2 } from "./02-frameworks";
import { module3 } from "./03-market-sizing";
import { module4 } from "./04-market-entry";
import { module5 } from "./05-mental-math";
import { module6 } from "./06-operations-cases";
import { module7 } from "./07-ma-pricing-advanced";
import { module8 } from "./08-behavioral-fit";
import { module9 } from "./09-mock-cases";
import { module10 } from "./10-firm-specific-prep";

export const consultingCaseInterviewCourse: Course = {
  id: "consulting-case-interview",
  slug: "consulting-case-interview",
  title: "Consulting Case Interview Mastery",
  description: "The complete McKinsey/BCG/Bain case interview course: frameworks, market sizing, market entry, operations, M&A, pricing, behavioral interviews, and full mock cases with worked solutions",
  icon: "💼",
  tier: "pro",
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
    module6,
    module7,
    module8,
    module9,
    module10,
  ],
};
