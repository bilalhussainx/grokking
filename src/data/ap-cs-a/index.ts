import { Course } from "../types";
import { primitiveTypesModule } from "./01-primitive-types";
import { usingObjectsModule } from "./02-using-objects";
import { booleanExpressionsModule } from "./03-boolean-expressions";
import { iterationModule } from "./04-iteration";
import { writingClassesModule } from "./05-writing-classes";
import { arraysModule } from "./06-arrays";
import { arrayListModule } from "./07-arraylist";
import { twoDArraysModule } from "./08-2d-arrays";
import { inheritanceModule } from "./09-inheritance";
import { recursionModule } from "./10-recursion";

export const apCsACourse: Course = {
  id: "ap-cs-a",
  slug: "ap-cs-a",
  title: "AP Computer Science A",
  description:
    "Master object-oriented programming concepts aligned with the AP CSA curriculum. Covers primitives, objects, control flow, arrays, inheritance, and recursion with hands-on Python exercises.",
  icon: "\u2615",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  variation: "systems-programming",
  level: "beginner" as const,
  modules: [
    primitiveTypesModule,
    usingObjectsModule,
    booleanExpressionsModule,
    iterationModule,
    writingClassesModule,
    arraysModule,
    arrayListModule,
    twoDArraysModule,
    inheritanceModule,
    recursionModule,
  ],
};
