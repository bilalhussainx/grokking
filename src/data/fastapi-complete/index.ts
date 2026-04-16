import { Course } from "../types";
import { module1 } from "./01-fundamentals";
import { module2 } from "./02-pydantic";
import { module3 } from "./03-database";
import { module4 } from "./04-auth";
import { module5 } from "./05-advanced";
import { module6 } from "./06-testing-deployment";

export const fastapiCompleteCourse: Course = {
  id: "fastapi-complete",
  slug: "fastapi-complete",
  title: "FastAPI: Complete API Development",
  description:
    "Build production-grade Python APIs with FastAPI — Pydantic validation, async SQLAlchemy, JWT auth, background tasks, WebSockets, pytest, and Docker deployment.",
  icon: "⚡",
  tier: "pro",
  featured: true,
  domain: "backend",
  level: "intermediate",
  prerequisiteIds: ["python-fundamentals"],
  modules: [module1, module2, module3, module4, module5, module6],
};
