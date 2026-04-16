import { Course } from "../types";
import { module1 } from "./01-closures-scope";
import { module2 } from "./02-event-loop-async";
import { module3 } from "./03-es6-modern";
import { module4 } from "./04-design-patterns";
import { module5 } from "./05-typescript-bridge";
import { module6 } from "./06-assessment-mastery";

export const javascriptCompleteCourse: Course = {
  id: "javascript-complete",
  slug: "javascript-complete",
  title: "JavaScript: Complete Developer Course",
  description:
    "Master modern JavaScript from closures and the event loop to ES2024 features, design patterns, TypeScript, and everything you need to ace technical assessments.",
  icon: "⚡",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "intermediate",
  prerequisiteIds: ["javascript-fundamentals"],
  modules: [module1, module2, module3, module4, module5, module6],
};
