import { Course } from "../types";
import { module1 } from "./01-fundamentals";
import { module2 } from "./02-oop-classes";
import { module3 } from "./03-inheritance-interfaces";
import { module4 } from "./04-collections";
import { module5 } from "./05-exceptions";
import { module6 } from "./06-generics-streams";
import { module7 } from "./07-concurrency";
import { module8 } from "./08-design-patterns";
import { module9 } from "./09-modern-java";
import { module10 } from "./10-interview-mastery";

export const javaCompleteCourse: Course = {
  id: "java-complete",
  slug: "java-complete",
  title: "Java: Complete Developer Course",
  description:
    "Comprehensive Java from fundamentals to interview mastery — OOP, Collections, Generics, Streams, Concurrency, Design Patterns, and Modern Java (8–21). Everything you need for Java developer roles.",
  icon: "☕",
  tier: "pro",
  featured: true,
  domain: "programming",
  level: "intermediate",
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
