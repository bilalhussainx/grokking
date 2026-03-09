import { Course } from "../types";
import { twoPointersModule } from "./01-two-pointers";
import { fastSlowPointersModule } from "./02-fast-slow-pointers";
import { slidingWindowModule } from "./03-sliding-window";
import { mergeIntervalsModule } from "./04-merge-intervals";
import { cyclicSortModule } from "./05-cyclic-sort";
import { linkedListReversalModule } from "./06-linked-list-reversal";
import { treeBFSModule } from "./07-tree-bfs";
import { treeDFSModule } from "./08-tree-dfs";
import { twoHeapsModule } from "./09-two-heaps";
import { subsetsModule } from "./10-subsets";
import { modifiedBinarySearchModule } from "./11-modified-binary-search";
import { bitwiseXORModule } from "./12-bitwise-xor";
import { topKElementsModule } from "./13-top-k-elements";
import { kWayMergeModule } from "./14-k-way-merge";
import { topologicalSortModule } from "./15-topological-sort";
import { dynamicProgrammingModule } from "./16-dynamic-programming";

export const codingInterviewCourse: Course = {
  id: "coding-interview",
  slug: "coding-interview",
  title: "Grokking the Coding Interview: Patterns in Python",
  description:
    "Master 16 essential coding patterns to solve any interview question. Each pattern includes detailed explanations, visual walkthroughs, and hands-on Python exercises with an in-browser IDE.",
  icon: "\u{1F4BB}",
  modules: [
    twoPointersModule,
    fastSlowPointersModule,
    slidingWindowModule,
    mergeIntervalsModule,
    cyclicSortModule,
    linkedListReversalModule,
    treeBFSModule,
    treeDFSModule,
    twoHeapsModule,
    subsetsModule,
    modifiedBinarySearchModule,
    bitwiseXORModule,
    topKElementsModule,
    kWayMergeModule,
    topologicalSortModule,
    dynamicProgrammingModule,
  ],
};
