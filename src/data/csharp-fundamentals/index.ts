import { Course } from "../types";
import { csharpBasicsModule } from "./01-basics";
import { controlFlowModule } from "./02-control-flow";
import { oopModule } from "./03-oop";
import { collectionsModule } from "./04-collections";
import { asyncModule } from "./05-async";
import { projectsModule } from "./06-projects";

export const csharpFundamentalsCourse: Course = {
  id: "csharp-fundamentals",
  slug: "csharp-fundamentals",
  title: "C# Fundamentals",
  description: "Learn C# from basics to async programming with hands-on projects.",
  icon: "\u{1F7E3}",
  tier: "pro",
  modules: [csharpBasicsModule, controlFlowModule, oopModule, collectionsModule, asyncModule, projectsModule],
};
