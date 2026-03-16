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
import { backtrackingModule } from "./17-backtracking";
import { trieModule } from "./18-trie";
import { unionFindModule } from "./19-union-find";
import { segmentTreeModule } from "./20-segment-tree";

export const codingInterviewPremiumCourse: Course = {
  id: "coding-interview-premium",
  slug: "coding-interview-premium",
  title: "Grokking the Coding Interview: Premium Edition",
  description:
    "The ultimate coding interview preparation course. Master 20 essential patterns with 100+ carefully curated problems, AI-powered hints, voice coaching, and detailed solutions. Includes advanced patterns like Backtracking, Trie, Union Find, and Segment Trees not found in the standard edition.",
  icon: "🚀",
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
    backtrackingModule,
    trieModule,
    unionFindModule,
    segmentTreeModule,
  ],
};
