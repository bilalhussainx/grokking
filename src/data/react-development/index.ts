import { Course } from "../types";
import { componentsModule } from "./01-components";
import { stateModule } from "./02-state";
import { hooksModule } from "./03-hooks";
import { effectsModule } from "./04-effects";
import { contextModule } from "./05-context";
import { routingModule } from "./06-routing";
import { formsModule } from "./07-forms";
import { projectsModule } from "./08-projects";

export const reactDevelopmentCourse: Course = {
  id: "react-development",
  slug: "react-development",
  title: "React Development",
  description:
    "Build modern UIs with React — from components and state to hooks, effects, routing, forms, and complete mini projects.",
  icon: "\u269B\uFE0F",
  tier: "pro",
  modules: [
    componentsModule,
    stateModule,
    hooksModule,
    effectsModule,
    contextModule,
    routingModule,
    formsModule,
    projectsModule,
  ],
};
