import { Course } from "../types";
import { module1 } from "./01-app-router";
import { module2 } from "./02-server-components";
import { module3 } from "./03-server-actions-data";
import { module4 } from "./04-optimization";
import { module5 } from "./05-auth-middleware";

export const nextjsCompleteCourse: Course = {
  id: "nextjs-complete",
  slug: "nextjs-complete",
  title: "Next.js: Complete Web Development",
  description:
    "Master Next.js App Router from routing and layouts to Server Components, Server Actions, caching, image optimization, and production authentication.",
  icon: "▲",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "intermediate",
  prerequisiteIds: ["react-complete"],
  modules: [module1, module2, module3, module4, module5],
};
