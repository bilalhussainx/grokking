import { Course } from "../types";
import { variablesAndTypesModule } from "./01-variables-and-types";
import { controlFlowModule } from "./02-control-flow";
import { loopsModule } from "./03-loops";
import { functionsModule } from "./04-functions";
import { listsModule } from "./05-lists";
import { dictionariesModule } from "./06-dictionaries";
import { stringsModule } from "./07-strings";
import { fileHandlingModule } from "./08-file-handling";
import { oopBasicsModule } from "./09-oop-basics";
import { projectsModule } from "./10-projects";

export const pythonFundamentalsCourse: Course = {
  id: "python-fundamentals",
  slug: "python-fundamentals",
  title: "Python Fundamentals: From Zero to Programmer",
  description:
    "Learn Python from scratch. 10 modules covering variables, control flow, functions, data structures, OOP, and real projects — all with hands-on exercises.",
  icon: "\u{1F40D}",
  modules: [
    variablesAndTypesModule,
    controlFlowModule,
    loopsModule,
    functionsModule,
    listsModule,
    dictionariesModule,
    stringsModule,
    fileHandlingModule,
    oopBasicsModule,
    projectsModule,
  ],
};
