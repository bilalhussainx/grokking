import { Course } from "../types";
import { arraysStringsModule } from "./01-arrays-strings";
import { hashTablesModule } from "./02-hash-tables";
import { linkedListsModule } from "./03-linked-lists";
import { stacksQueuesModule } from "./04-stacks-queues";
import { treesModule } from "./05-trees";
import { heapsModule } from "./06-heaps";
import { graphsModule } from "./07-graphs";
import { triesAdvancedModule } from "./08-tries-advanced";

export const dsInterviewCourse: Course = {
  id: "ds-interview",
  slug: "ds-interview",
  title: "Data Structures Interview Mastery",
  description: "Master every data structure for coding interviews. Build hash maps, heaps, tries from scratch. Learn when to use which structure.",
  icon: "🗃️",
  tier: "pro",
  modules: [arraysStringsModule, hashTablesModule, linkedListsModule, stacksQueuesModule, treesModule, heapsModule, graphsModule, triesAdvancedModule],
};
