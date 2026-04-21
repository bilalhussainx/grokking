#!/usr/bin/env tsx
// scripts/seed-interview-problems.ts
// Extracts all coding problems from Grokking courses and generates SQL
// to populate the interview_problems table with 250+ problems.
//
// Features:
// - Parses function names, test cases, examples from course data
// - Generates visible + hidden test cases
// - Maps patterns to company tags from frequency data
// - Adds function_name for harness-based execution (LeetCode model)
//
// Usage: npx tsx scripts/seed-interview-problems.ts > supabase/migrations/025_seed_problems.sql

import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

// ─── Company frequency mapping ───────────────────────────────────────────────
const COMPANY_TAGS: Record<string, string[]> = {
  "two-pointers": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2", "apple-ict3", "linkedin-swe"],
  "fast-slow-pointers": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2"],
  "sliding-window": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2", "uber-sde2", "databricks-swe"],
  "merge-intervals": ["google-l4", "meta-e4", "uber-sde2", "airbnb-swe", "linkedin-swe"],
  "cyclic-sort": ["google-l4", "amazon-sde2", "microsoft-sde2"],
  "linked-list-reversal": ["meta-e4", "amazon-sde2", "microsoft-sde2", "apple-ict3"],
  "tree-bfs": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2", "uber-sde2"],
  "tree-dfs": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2", "uber-sde2"],
  "two-heaps": ["google-l4", "meta-e4", "amazon-sde2", "netflix-senior"],
  "subsets": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2", "airbnb-swe"],
  "modified-binary-search": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2", "uber-sde2"],
  "bitwise-xor": ["google-l4", "amazon-sde2", "nvidia-swe"],
  "top-k-elements": ["google-l4", "meta-e4", "amazon-sde2", "netflix-senior", "uber-sde2"],
  "k-way-merge": ["google-l4", "meta-e4", "amazon-sde2", "databricks-swe"],
  "topological-sort": ["google-l4", "meta-e4", "amazon-sde2", "uber-sde2", "airbnb-swe"],
  "dynamic-programming": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2", "stripe-l2"],
  "backtracking": ["google-l4", "meta-e4", "amazon-sde2", "airbnb-swe"],
  "trie": ["google-l4", "meta-e4", "amazon-sde2", "uber-sde2"],
  "union-find": ["google-l4", "meta-e4", "amazon-sde2", "databricks-swe"],
  "segment-tree": ["google-l4", "nvidia-swe", "databricks-swe"],
  // DSA course
  "arrays-strings": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2", "apple-ict3"],
  "hash-tables": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2", "uber-sde2"],
  "linked-lists": ["meta-e4", "amazon-sde2", "microsoft-sde2", "apple-ict3"],
  "stacks-queues": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2"],
  "trees": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2", "uber-sde2"],
  "heaps": ["google-l4", "meta-e4", "amazon-sde2", "netflix-senior", "databricks-swe"],
  "graphs": ["google-l4", "meta-e4", "amazon-sde2", "uber-sde2", "databricks-swe"],
  "tries-advanced": ["google-l4", "meta-e4", "amazon-sde2", "uber-sde2"],
  "sorting": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2"],
  "complexity": ["google-l4", "meta-e4", "amazon-sde2"],
  // DP patterns
  "knapsack": ["google-l4", "amazon-sde2", "microsoft-sde2", "databricks-swe"],
  "unbounded-knapsack": ["google-l4", "amazon-sde2"],
  "fibonacci": ["amazon-sde2", "microsoft-sde2", "linkedin-swe"],
  "palindromic": ["google-l4", "meta-e4", "amazon-sde2"],
  "lcs": ["google-l4", "amazon-sde2", "microsoft-sde2", "databricks-swe"],
  "mcm": ["google-l4", "amazon-sde2"],
  "dp-strings": ["google-l4", "meta-e4", "amazon-sde2", "microsoft-sde2"],
};

interface ParsedProblem {
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  constraints: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  functionName: string;
  starterCodePython: string;
  solutionCodePython: string;
  starterCodeJava: string;
  solutionCodeJava: string;
  starterCodeJs: string;
  testCasesVisible: Array<{ input: string; expected_output: string }>;
  testCasesHidden: Array<{ input: string; expected_output: string }>;
  topics: string[];
  companyTags: string[];
  pattern: string;
  courseSource: string;
}

// ─── Parsing helpers ─────────────────────────────────────────────────────────

/** Extract function name from Python code */
function extractFunctionName(code: string): string {
  const match = code.match(/^def\s+(\w+)\s*\(/m);
  if (match) return match[1];
  // Class-based (like LRUCache)
  const classMatch = code.match(/^class\s+(\w+)/m);
  if (classMatch) return classMatch[1];
  return "solution";
}

/** Parse test cases from Python print() statements */
function parseTestCases(
  code: string,
  funcName: string
): Array<{ input: string; expected: string }> {
  const tests: Array<{ input: string; expected: string }> = [];

  // Pattern: print(func_name(args))  # Expected: value
  const printRegex = new RegExp(
    `print\\(${funcName}\\((.+?)\\)\\)\\s*#\\s*Expected:\\s*(.+)`,
    "g"
  );
  let match;
  while ((match = printRegex.exec(code)) !== null) {
    tests.push({
      input: match[1].trim(),
      expected: match[2].trim(),
    });
  }

  // Also try: print(func_name(args))  # [1, 3] or similar without "Expected:"
  if (tests.length === 0) {
    const simpleRegex = new RegExp(
      `print\\(${funcName}\\((.+?)\\)\\)\\s*#\\s*(.+)`,
      "g"
    );
    while ((match = simpleRegex.exec(code)) !== null) {
      tests.push({
        input: match[1].trim(),
        expected: match[2].trim(),
      });
    }
  }

  // Fallback: just find print(func_name(...)) without expected comment
  if (tests.length === 0) {
    const bareRegex = new RegExp(
      `print\\(${funcName}\\((.+?)\\)\\)`,
      "g"
    );
    while ((match = bareRegex.exec(code)) !== null) {
      tests.push({
        input: match[1].trim(),
        expected: "",
      });
    }
  }

  return tests;
}

/** Extract examples from markdown content */
function parseExamples(
  content: string
): Array<{ input: string; output: string; explanation?: string }> {
  const examples: Array<{ input: string; output: string; explanation?: string }> = [];

  // Pattern: Input: ... Output: ... Explanation: ...
  const blocks = content.split(/```\n?/);
  for (const block of blocks) {
    const inputMatch = block.match(/Input:\s*(.+)/);
    const outputMatch = block.match(/Output:\s*(.+)/);
    if (inputMatch && outputMatch) {
      const explanationMatch = block.match(/Explanation:\s*(.+)/);
      examples.push({
        input: inputMatch[1].trim(),
        output: outputMatch[1].trim(),
        explanation: explanationMatch?.[1]?.trim(),
      });
    }
  }

  // Also try non-code-block patterns
  if (examples.length === 0) {
    const lineMatches = content.matchAll(
      /Input:\s*(.+?)[\n\r]+\s*Output:\s*(.+?)(?:[\n\r]+\s*Explanation:\s*(.+?))?(?:[\n\r]|$)/g
    );
    for (const m of lineMatches) {
      examples.push({
        input: m[1].trim(),
        output: m[2].trim(),
        explanation: m[3]?.trim(),
      });
    }
  }

  return examples;
}

/** Extract problem description from content (before approach/hints sections) */
function parseDescription(content: string): string {
  // Remove mermaid diagrams
  let desc = content.replace(/```mermaid[\s\S]*?```/g, "");
  // Remove code blocks
  desc = desc.replace(/```[\s\S]*?```/g, "");
  // Take text up to "Approach" or "Hints" or "Complexity" section
  const cutoff = desc.search(/##\s*(Approach|Hints|Complexity|Solution|Algorithm)/i);
  if (cutoff > 0) desc = desc.slice(0, cutoff);
  // Remove markdown headers but keep the text
  desc = desc.replace(/^#+\s*/gm, "").trim();
  // Remove stray # characters at the end
  desc = desc.replace(/\n#\s*$/g, "").trim();
  // Collapse whitespace
  desc = desc.replace(/\n{3,}/g, "\n\n").trim();
  return desc.slice(0, 1000);
}

/** Extract constraints from content */
function parseConstraints(content: string): string {
  const constraintMatch = content.match(
    /(?:Constraints?|Bounds|Limits)[\s:]*\n([\s\S]*?)(?:\n#|\n\n\n|$)/i
  );
  if (constraintMatch) {
    return constraintMatch[1]
      .replace(/^[-*]\s*/gm, "")
      .trim()
      .slice(0, 500);
  }
  return "";
}

/** Infer difficulty based on module position and course */
function inferDifficulty(
  courseSlug: string,
  moduleIndex: number,
  lessonIndex: number
): "easy" | "medium" | "hard" {
  const isPremium = courseSlug.includes("premium");
  // Premium course: first half medium, second half hard
  if (isPremium) {
    if (moduleIndex >= 14) return "hard";
    if (lessonIndex === 0) return "medium";
    if (lessonIndex >= 3) return "hard";
    return "medium";
  }
  // Regular courses: more balanced distribution
  if (moduleIndex >= 12) return "hard";
  if (lessonIndex === 0) return "easy";
  if (moduleIndex >= 8 && lessonIndex >= 2) return "hard";
  if (lessonIndex >= 3) return "medium";
  return lessonIndex <= 1 ? "easy" : "medium";
}

/** Generate a clean Python starter code (function signature + pass, no test prints) */
function cleanStarterCode(code: string, funcName: string): string {
  const lines = code.split("\n");
  const result: string[] = [];
  let inFunction = false;
  let functionIndent = 0;

  for (const line of lines) {
    // Skip print() test lines
    if (line.trim().startsWith("print(") || line.trim().startsWith("# Test")) continue;
    if (line.trim() === "") {
      if (inFunction) {
        result.push("");
        inFunction = false;
      }
      continue;
    }

    const defMatch = line.match(/^(\s*)def\s+\w+/);
    if (defMatch) {
      inFunction = true;
      functionIndent = defMatch[1].length;
      result.push(line);
      continue;
    }

    if (inFunction) {
      const indent = line.search(/\S/);
      if (indent > functionIndent) {
        result.push(line);
      } else {
        inFunction = false;
        if (!line.trim().startsWith("print") && !line.trim().startsWith("#")) {
          result.push(line);
        }
      }
    } else {
      if (!line.trim().startsWith("print") && !line.trim().startsWith("# Test")) {
        result.push(line);
      }
    }
  }

  return result.join("\n").trim();
}

/** Generate Java starter code from Python function signature */
function generateJavaStarter(funcName: string, pythonCode: string): string {
  // Extract parameters from def funcName(params):
  const defMatch = pythonCode.match(/def\s+\w+\((.*?)\)/);
  if (!defMatch) return "";

  const params = defMatch[1].split(",").map((p) => p.trim());

  // Heuristic type inference from parameter names and test cases
  const javaParams = params
    .filter((p) => p && p !== "self")
    .map((p) => {
      const name = p.split(":")[0].trim().split("=")[0].trim();
      // Infer type from name
      if (name === "arr" || name === "nums" || name === "numbers" || name === "intervals") return `int[] ${name}`;
      if (name === "matrix" || name === "grid") return `int[][] ${name}`;
      if (name === "s" || name === "str" || name === "word" || name === "text") return `String ${name}`;
      if (name === "n" || name === "k" || name === "target" || name === "capacity") return `int ${name}`;
      if (name === "head" || name === "node") return `ListNode ${name}`;
      if (name === "root") return `TreeNode ${name}`;
      if (name.includes("list") || name.includes("List")) return `List<Integer> ${name}`;
      return `Object ${name}`;
    })
    .join(", ");

  const camelName = funcName.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

  return `class Solution {
    public Object ${camelName}(${javaParams}) {
        // Your code here
        return null;
    }
}`;
}

/** Generate Java solution stub (placeholder — needs LLM for full solutions) */
function generateJavaSolution(funcName: string, pythonSolution: string): string {
  // For now, include the Python solution as a comment for reference
  const camelName = funcName.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  const commented = pythonSolution
    .split("\n")
    .filter((l) => !l.trim().startsWith("print(") && !l.trim().startsWith("# Test"))
    .map((l) => `    // ${l}`)
    .join("\n");

  return `class Solution {
    // TODO: Implement Java solution
    // Python reference:
${commented}
}`;
}

/** Generate JavaScript starter code */
function generateJsStarter(funcName: string, pythonCode: string): string {
  const defMatch = pythonCode.match(/def\s+\w+\((.*?)\)/);
  if (!defMatch) return "";

  const params = defMatch[1]
    .split(",")
    .map((p) => p.trim().split(":")[0].trim().split("=")[0].trim())
    .filter((p) => p && p !== "self");

  const camelName = funcName.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

  return `/**
 * @param {${params.map(() => "any").join(", ")}} ${params.join(", ")}
 * @return {any}
 */
function ${camelName}(${params.join(", ")}) {
    // Your code here
}`;
}

// ─── SQL generation ──────────────────────────────────────────────────────────

function sqlEscape(s: string): string {
  if (!s) return "";
  return s.replace(/'/g, "''").replace(/\\/g, "\\\\");
}

function sqlEscapeE(s: string): string {
  if (!s) return "";
  // For E'' strings — escape single quotes and backslashes, preserve newlines as \n
  return s
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "''")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "")
    .replace(/\t/g, "\\t");
}

// ─── Main extraction ─────────────────────────────────────────────────────────

interface CourseDir {
  path: string;
  slug: string;
}

const COURSE_DIRS: CourseDir[] = [
  { path: "src/data/coding-interview", slug: "coding-interview" },
  { path: "src/data/coding-interview-premium", slug: "coding-interview-premium" },
  { path: "src/data/data-structures-algorithms", slug: "dsa" },
  { path: "src/data/dp-patterns", slug: "dp-patterns" },
  { path: "src/data/ds-interview", slug: "ds-interview" },
];

async function extractFromCourse(dir: CourseDir): Promise<ParsedProblem[]> {
  const problems: ParsedProblem[] = [];

  try {
    // Import the course index (use file:// URL for Windows compatibility)
    const indexPath = path.resolve(dir.path, "index.ts");
    const indexUrl = pathToFileURL(indexPath).href;
    const courseModule = await import(indexUrl);
    const course = Object.values(courseModule)[0] as {
      modules: Array<{
        id: string;
        title: string;
        description: string;
        lessons: Array<{
          id: string;
          slug: string;
          title: string;
          content: string;
          starterCode?: string;
          solutionCode?: string;
        }>;
      }>;
    };

    if (!course?.modules) return problems;

    for (let mi = 0; mi < course.modules.length; mi++) {
      const mod = course.modules[mi];
      const pattern = mod.id;
      const tags = COMPANY_TAGS[pattern] || ["generic"];

      let exerciseIndex = 0;
      for (const lesson of mod.lessons) {
        if (!lesson.starterCode) continue; // Skip non-coding lessons

        const funcName = extractFunctionName(lesson.starterCode);
        const difficulty = inferDifficulty(dir.slug, mi, exerciseIndex);
        exerciseIndex++;

        // Parse test cases from starterCode and solutionCode
        const starterTests = parseTestCases(lesson.starterCode, funcName);
        const solutionTests = lesson.solutionCode
          ? parseTestCases(lesson.solutionCode, funcName)
          : [];

        // Combine and deduplicate test cases
        const allTests = [...starterTests];
        for (const st of solutionTests) {
          if (!allTests.some((t) => t.input === st.input)) {
            allTests.push(st);
          }
        }

        // Split: first 2-3 are visible, rest are hidden
        const visibleTests = allTests.slice(0, Math.min(3, allTests.length));
        const hiddenTests = allTests.slice(3);

        // Format test cases for DB
        const testCasesVisible = visibleTests.map((t) => ({
          input: `${funcName}(${t.input})`,
          expected_output: t.expected || "?",
        }));
        const testCasesHidden = hiddenTests.map((t) => ({
          input: `${funcName}(${t.input})`,
          expected_output: t.expected || "?",
        }));

        // Parse examples and description from content
        const examples = parseExamples(lesson.content);
        const description = parseDescription(lesson.content);
        const constraints = parseConstraints(lesson.content);

        // Clean starter code (remove test print statements)
        const cleanedStarter = cleanStarterCode(lesson.starterCode, funcName);
        const cleanedSolution = lesson.solutionCode
          ? cleanStarterCode(lesson.solutionCode, funcName)
          : "";

        // Generate Java + JS stubs
        const javaStarter = generateJavaStarter(funcName, lesson.starterCode);
        const javaSolution = lesson.solutionCode
          ? generateJavaSolution(funcName, lesson.solutionCode)
          : "";
        const jsStarter = generateJsStarter(funcName, lesson.starterCode);

        // Build topics
        const topics = [pattern];
        const titleLower = mod.title.toLowerCase();
        if (titleLower.includes("array")) topics.push("arrays");
        if (titleLower.includes("tree")) topics.push("trees");
        if (titleLower.includes("graph")) topics.push("graphs");
        if (titleLower.includes("string")) topics.push("strings");
        if (titleLower.includes("linked")) topics.push("linked-list");
        if (titleLower.includes("stack")) topics.push("stack");
        if (titleLower.includes("heap")) topics.push("heap");
        if (titleLower.includes("dp") || titleLower.includes("dynamic")) topics.push("dynamic-programming");
        if (titleLower.includes("sort")) topics.push("sorting");

        problems.push({
          slug: `${dir.slug}-${lesson.slug || lesson.id}`,
          title: lesson.title,
          difficulty,
          description: description || lesson.title,
          constraints,
          examples: examples.length > 0 ? examples : visibleTests.map((t) => ({
            input: t.input,
            output: t.expected,
          })),
          functionName: funcName,
          starterCodePython: cleanedStarter,
          solutionCodePython: cleanedSolution,
          starterCodeJava: javaStarter,
          solutionCodeJava: javaSolution,
          starterCodeJs: jsStarter,
          testCasesVisible,
          testCasesHidden,
          topics: [...new Set(topics)],
          companyTags: tags,
          pattern,
          courseSource: dir.slug,
        });
      }
    }
  } catch (err) {
    console.error(`[${dir.slug}] Failed to extract:`, err);
  }

  return problems;
}

function generateSQL(problems: ParsedProblem[]): string {
  const lines: string[] = [
    "-- 025_seed_interview_problems.sql",
    "-- Auto-generated from Grokking course data + company frequency mapping.",
    `-- Generated: ${new Date().toISOString()}`,
    `-- Total problems: ${problems.length}`,
    "",
    "-- Add function_name column for harness-based execution",
    "ALTER TABLE interview_problems ADD COLUMN IF NOT EXISTS function_name TEXT;",
    "-- Add starter_code_java if not exists",
    "ALTER TABLE interview_problems ADD COLUMN IF NOT EXISTS starter_code_js TEXT;",
    "",
    "-- Clear the 5 initial seed problems (they'll be re-inserted with better data)",
    "DELETE FROM interview_problems WHERE slug IN ('two-sum', 'valid-parentheses', 'merge-intervals', 'lru-cache', 'number-of-islands');",
    "",
  ];

  for (const p of problems) {
    const examplesJson = JSON.stringify(p.examples).replace(/'/g, "''");
    const visibleJson = JSON.stringify(p.testCasesVisible).replace(/'/g, "''");
    const hiddenJson = JSON.stringify(p.testCasesHidden).replace(/'/g, "''");

    lines.push(`INSERT INTO interview_problems (slug, title, difficulty, description, constraints, examples, function_name, starter_code_python, solution_code_python, starter_code_java, solution_code_java, starter_code_js, topics, company_tags, pattern, test_cases_visible, test_cases_hidden) VALUES (
  '${sqlEscape(p.slug)}',
  '${sqlEscape(p.title)}',
  '${p.difficulty}',
  '${sqlEscape(p.description)}',
  '${sqlEscape(p.constraints)}',
  '${examplesJson}'::jsonb,
  '${sqlEscape(p.functionName)}',
  E'${sqlEscapeE(p.starterCodePython)}',
  E'${sqlEscapeE(p.solutionCodePython)}',
  E'${sqlEscapeE(p.starterCodeJava)}',
  E'${sqlEscapeE(p.solutionCodeJava)}',
  E'${sqlEscapeE(p.starterCodeJs)}',
  ARRAY[${p.topics.map((t) => `'${sqlEscape(t)}'`).join(", ")}],
  ARRAY[${p.companyTags.map((t) => `'${sqlEscape(t)}'`).join(", ")}],
  '${sqlEscape(p.pattern)}',
  '${visibleJson}'::jsonb,
  '${hiddenJson}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  description = EXCLUDED.description,
  constraints = EXCLUDED.constraints,
  examples = EXCLUDED.examples,
  function_name = EXCLUDED.function_name,
  starter_code_python = EXCLUDED.starter_code_python,
  solution_code_python = EXCLUDED.solution_code_python,
  starter_code_java = EXCLUDED.starter_code_java,
  solution_code_java = EXCLUDED.solution_code_java,
  starter_code_js = EXCLUDED.starter_code_js,
  topics = EXCLUDED.topics,
  company_tags = EXCLUDED.company_tags,
  pattern = EXCLUDED.pattern,
  test_cases_visible = EXCLUDED.test_cases_visible,
  test_cases_hidden = EXCLUDED.test_cases_hidden;
`);
  }

  return lines.join("\n");
}

async function main() {
  let allProblems: ParsedProblem[] = [];

  for (const dir of COURSE_DIRS) {
    const problems = await extractFromCourse(dir);
    console.error(`[${dir.slug}] Extracted ${problems.length} problems`);
    allProblems = allProblems.concat(problems);
  }

  // Deduplicate by slug
  const seen = new Set<string>();
  allProblems = allProblems.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  console.error(`\nTotal unique problems: ${allProblems.length}`);
  console.error(
    `Difficulty: easy=${allProblems.filter((p) => p.difficulty === "easy").length} medium=${allProblems.filter((p) => p.difficulty === "medium").length} hard=${allProblems.filter((p) => p.difficulty === "hard").length}`
  );
  console.error(
    `With test cases: ${allProblems.filter((p) => p.testCasesVisible.length > 0).length}`
  );
  console.error(
    `Patterns: ${[...new Set(allProblems.map((p) => p.pattern))].join(", ")}`
  );

  console.log(generateSQL(allProblems));
}

main().catch(console.error);
