import { Course } from "../types";
import { module1 } from "./01-jsx-components";
import { module2 } from "./02-state-hooks";
import { module3 } from "./03-useeffect";
import { module4 } from "./04-refs-performance-hooks";
import { module5 } from "./05-controlled-forms";
import { module6 } from "./06-performance-patterns";
import { module7 } from "./07-advanced-patterns";
import { module8 } from "./08-context-state";
import { module9 } from "./09-custom-hooks";
import { module10 } from "./10-reconciliation-assessment";

export const reactCompleteCourse: Course = {
  id: "react-complete",
  slug: "react-complete",
  title: "React: Complete Developer Course",
  description:
    "Exhaustive React coverage — JSX, all hooks, performance, patterns, and everything you need to ace the LinkedIn React Skills Assessment. From fundamentals to advanced patterns.",
  icon: "⚛️",
  tier: "pro",
  featured: true,
  domain: "frontend",
  level: "intermediate",
  prerequisiteIds: ["javascript-fundamentals"],
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
