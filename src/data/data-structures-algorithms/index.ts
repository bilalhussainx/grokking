import { Course } from "../types";
import { complexityModule } from "./01-complexity";
import { arraysStringsModule } from "./02-arrays-strings";
import { linkedListsModule } from "./03-linked-lists";
import { stacksQueuesModule } from "./04-stacks-queues";
import { treesModule } from "./05-trees";
import { graphsModule } from "./06-graphs";
import { sortingModule } from "./07-sorting";
import { dynamicProgrammingModule } from "./08-dynamic-programming";

export const dataStructuresAlgorithmsCourse: Course = {
  id: "data-structures-algorithms",
  slug: "data-structures-algorithms",
  title: "Data Structures & Algorithms",
  description:
    "Master fundamental data structures and algorithms from complexity analysis through dynamic programming, with hands-on Python exercises.",
  icon: "\u{1F9EE}",
  modules: [
    complexityModule,
    arraysStringsModule,
    linkedListsModule,
    stacksQueuesModule,
    treesModule,
    graphsModule,
    sortingModule,
    dynamicProgrammingModule,
  ],
};
