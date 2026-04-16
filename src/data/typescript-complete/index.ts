import { Course } from "../types";
import { module1 } from "./01-type-system";
import { module2 } from "./02-generics-advanced";
import { module3 } from "./03-classes-decorators";
import { module4 } from "./04-utility-types";
import { module5 } from "./05-config-ecosystem";
import { module6 } from "./06-real-world-patterns";
import { module7 } from "./07-performance-migration";
import { module8 } from "./08-assessment-mastery";

export const typescriptCompleteCourse: Course = {
  id: "typescript-complete",
  slug: "typescript-complete",
  title: "TypeScript Complete",
  description: "Master TypeScript from structural typing and advanced generics to production patterns with Zod, tRPC, decorators, and compiler internals. Built for engineers who want to think in types, not just compile.",
  icon: "🔷",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "intermediate",
  prerequisiteIds: ["javascript-complete"],
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
    module6,
    module7,
    module8,
  ],
};
