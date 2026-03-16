import { Course } from "../types";
import { fundamentalsModule } from "./01-fundamentals";
import { synchronizationModule } from "./02-synchronization";
import { classicProblemsModule } from "./03-classic-problems";
import { concurrentDsModule } from "./04-concurrent-ds";
import { pythonConcurrencyModule } from "./05-python-concurrency";
import { realWorldPatternsModule } from "./06-real-world-patterns";
import { interviewProblemsModule } from "./07-interview-problems";

export const concurrencyMultithreadingCourse: Course = {
  id: "concurrency-multithreading",
  slug: "concurrency-multithreading",
  title: "Concurrency & Multithreading Mastery",
  description: "Master concurrency for coding interviews. Threading, synchronization, classic problems, concurrent data structures, and Python concurrency patterns.",
  icon: "🔄",
  tier: "pro",
  modules: [fundamentalsModule, synchronizationModule, classicProblemsModule, concurrentDsModule, pythonConcurrencyModule, realWorldPatternsModule, interviewProblemsModule],
};
