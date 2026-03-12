import { Course } from "../types";
import { cppBasicsModule } from "./01-basics";
import { cppPointersMemoryModule } from "./02-pointers-memory";
import { cppOopModule } from "./03-oop";
import { cppStlModule } from "./04-stl";
import { cppAdvancedModule } from "./05-advanced";
import { cppProjectsModule } from "./06-projects";

export const cppFundamentalsCourse: Course = {
  id: "cpp-fundamentals",
  slug: "cpp-fundamentals",
  title: "C++ Fundamentals: Systems Programming Concepts",
  description:
    "Learn C++ concepts through hands-on exercises. 6 modules covering memory management, OOP, STL, templates, and systems programming patterns.",
  icon: "\u{1F527}",
  modules: [
    cppBasicsModule,
    cppPointersMemoryModule,
    cppOopModule,
    cppStlModule,
    cppAdvancedModule,
    cppProjectsModule,
  ],
};
