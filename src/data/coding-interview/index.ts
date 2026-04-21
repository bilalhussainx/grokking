import { Course } from "../types";
import { twoPointersModule } from "./01-two-pointers";
import { fastSlowPointersModule } from "./02-fast-slow-pointers";
import { slidingWindowModule } from "./03-sliding-window";
import { mergeIntervalsModule } from "./04-merge-intervals";
import { cyclicSortLinkedListReversalModule } from "./05-cyclic-sort-linked-list-reversal";
import { treeBfsDfsModule } from "./06-tree-bfs-dfs";
import { heapsTopKModule } from "./07-heaps-top-k";
import { subsetsBinarySearchModule } from "./08-subsets-binary-search";
import { kWayMergeBitwiseXorModule } from "./09-k-way-merge-bitwise-xor";
import { graphsTopologicalSortModule } from "./10-graphs-topological-sort";
import { dynamicProgrammingPatternsModule } from "./11-dynamic-programming-patterns";
import { mockInterviewPatternMasteryModule } from "./12-mock-interview-pattern-mastery";

export const codingInterviewCourse: Course = {
  id: "coding-interview",
  slug: "coding-interview",
  title: "Grokking the Coding Interview: Patterns in Python",
  description: "Master 16 essential coding patterns to solve any interview question. Each pattern includes detailed explanations, visual walkthroughs, and hands-on Python exercises with an in-browser IDE.",
  icon: "💻",
  tier: "pro",
  domain: "computer-science",
  variation: "interview-prep",
  level: "advanced",
  featured: true,
  modules: [
    twoPointersModule,
    fastSlowPointersModule,
    slidingWindowModule,
    mergeIntervalsModule,
    cyclicSortLinkedListReversalModule,
    treeBfsDfsModule,
    heapsTopKModule,
    subsetsBinarySearchModule,
    kWayMergeBitwiseXorModule,
    graphsTopologicalSortModule,
    dynamicProgrammingPatternsModule,
    mockInterviewPatternMasteryModule,
  ],
};
