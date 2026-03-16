import { Course } from "../types";
import { knapsackModule } from "./01-knapsack";
import { unboundedKnapsackModule } from "./02-unbounded-knapsack";
import { fibonacciModule } from "./03-fibonacci";
import { palindromicModule } from "./04-palindromic";
import { lcsModule } from "./05-lcs";
import { mcmModule } from "./06-mcm";
import { dpStringsModule } from "./07-dp-strings";

export const dpPatternsCourse: Course = {
  id: "dp-patterns",
  slug: "dp-patterns",
  title: "Mastering Dynamic Programming Patterns",
  description:
    "Master dynamic programming by learning the underlying patterns. Covers 0/1 Knapsack, Unbounded Knapsack, Fibonacci, Palindromic Subsequences, LCS, Matrix Chain Multiplication, and DP on Strings — with hands-on Python exercises.",
  icon: "🧩",
  tier: "pro",
  modules: [
    knapsackModule,
    unboundedKnapsackModule,
    fibonacciModule,
    palindromicModule,
    lcsModule,
    mcmModule,
    dpStringsModule,
  ],
};
