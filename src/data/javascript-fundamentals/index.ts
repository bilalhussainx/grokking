import { Course } from "../types";
import { basicsModule } from "./01-basics";
import { controlFlowModule } from "./02-control-flow";
import { functionsModule } from "./03-functions";
import { arraysModule } from "./04-arrays";
import { objectsModule } from "./05-objects";
import { asyncModule } from "./06-async";
import { domAndEventsModule } from "./07-dom-and-events";
import { projectsModule } from "./08-projects";

export const javascriptFundamentalsCourse: Course = {
  id: "javascript-fundamentals",
  slug: "javascript-fundamentals",
  title: "JavaScript Fundamentals: Modern JS Mastery",
  description:
    "Master modern JavaScript from basics to async patterns. 8 modules with hands-on exercises covering ES6+, closures, promises, and real-world patterns.",
  icon: "\u26A1",
  modules: [
    basicsModule,
    controlFlowModule,
    functionsModule,
    arraysModule,
    objectsModule,
    asyncModule,
    domAndEventsModule,
    projectsModule,
  ],
};
