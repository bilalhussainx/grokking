import { Course } from "../types";
import { arraysStringsModule } from "./01-arrays-strings";
import { hashMapsSetsModule } from "./02-hash-maps-sets";
import { linkedListsModule } from "./03-linked-lists";
import { stacksQueuesModule } from "./04-stacks-queues";
import { treesGraphsModule } from "./05-trees-graphs";
import { capstoneModule } from "./06-capstone";

export const grokkingDsaPythonCourse: Course = {
  id: "grokking-dsa-python",
  slug: "grokking-dsa-python",
  title: "Grokking Data Structures in Python",
  description:
    "Master arrays, hash maps, linked lists, stacks, queues, trees and graphs with hands-on Python exercises. Build the foundation for coding interviews.",
  icon: "\uD83E\uDDE9",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  variation: "interview-prep",
  level: "beginner",
  modules: [
    arraysStringsModule,
    hashMapsSetsModule,
    linkedListsModule,
    stacksQueuesModule,
    treesGraphsModule,
    capstoneModule,
  ],
};
