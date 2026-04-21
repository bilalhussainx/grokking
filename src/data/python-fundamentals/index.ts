import { Course } from "../types";
import { gettingStartedModule } from "./01-getting-started";
import { variablesAndDataTypesModule } from "./02-variables-and-data-types";
import { stringsInDepthModule } from "./03-strings-in-depth";
import { controlFlowModule } from "./04-control-flow";
import { functionsModule } from "./05-functions";
import { dataStructuresModule } from "./06-data-structures";
import { errorHandlingAndFileIoModule } from "./07-error-handling-and-file-io";
import { objectOrientedProgrammingModule } from "./08-object-oriented-programming";
import { modulesAndPackagesModule } from "./09-modules-and-packages";
import { pythonicCodeAndBestPracticesModule } from "./10-pythonic-code-and-best-practices";

export const pythonFundamentalsCourse: Course = {
  id: "python-fundamentals",
  slug: "python-fundamentals",
  title: "Python Fundamentals: From Zero to Programmer",
  description: "Learn Python from scratch. 10 modules covering variables, control flow, functions, data structures, OOP, and real projects — all with hands-on exercises.",
  icon: "🐍",
  tier: "pro",
  domain: "computer-science",
  variation: "systems-programming",
  level: "beginner",
  featured: true,
  modules: [
    gettingStartedModule,
    variablesAndDataTypesModule,
    stringsInDepthModule,
    controlFlowModule,
    functionsModule,
    dataStructuresModule,
    errorHandlingAndFileIoModule,
    objectOrientedProgrammingModule,
    modulesAndPackagesModule,
    pythonicCodeAndBestPracticesModule,
  ],
};
