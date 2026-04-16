import { Course } from "../types";
import { module1 } from "./01-core-modules";
import { module2 } from "./02-express-advanced";
import { module3 } from "./03-worker-threads";
import { module4 } from "./04-testing-production";

export const nodejsCompleteCourse: Course = {
  id: "nodejs-complete",
  slug: "nodejs-complete",
  title: "Node.js: Complete Backend Development",
  description:
    "Advanced Node.js — event loop internals, streams, Worker Threads, clustering, production Express patterns, testing with Jest/Supertest, and security hardening.",
  icon: "🟢",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "intermediate",
  prerequisiteIds: ["javascript-fundamentals"],
  modules: [module1, module2, module3, module4],
};
