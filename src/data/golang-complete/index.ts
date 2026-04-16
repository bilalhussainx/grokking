import { Course } from "../types";
import { module1 } from "./01-go-fundamentals";
import { module2 } from "./02-goroutines-channels";
import { module3 } from "./03-interfaces-http";

export const golangCompleteCourse: Course = {
  id: "golang-complete",
  slug: "golang-complete",
  title: "Go (Golang) Complete",
  description: "Master Go from syntax and goroutines to production HTTP APIs. Covers the type system, channels, pipelines, interfaces, net/http with Chi, table-driven testing, and building systems that scale.",
  icon: "🐹",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "intermediate",
  prerequisiteIds: ["nodejs-complete"],
  modules: [
    module1,
    module2,
    module3,
  ],
};
