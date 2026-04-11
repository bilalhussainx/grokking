// src/app/api/interviews/run-code/route.ts
// LeetCode-style code execution via Piston API.
// Supports two modes:
//   1. Harness mode (default) — server wraps user code with test harness
//   2. Raw mode — user code runs directly with stdin (legacy)
//
// Piston runs in Docker on localhost:2000 (self-hosted).

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { recordCodeSubmission } from "@/lib/interview-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PISTON_URL = process.env.PISTON_URL || "http://localhost:2000";

interface TestCase {
  input: string; // For harness mode: "func_name(args)" or just "args". For raw: stdin content
  expected_output: string;
}

interface PistonResult {
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
  };
}

const LANGUAGE_VERSIONS: Record<string, { language: string; version: string }> = {
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  javascript: { language: "javascript", version: "18.15.0" },
};

// ─── Test Harness Generators ─────────────────────────────────────────────────

function buildPythonHarness(
  userCode: string,
  functionName: string,
  testCases: TestCase[]
): string {
  // Strip any existing print-based test calls from user code
  const cleanedCode = userCode
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return (
        !trimmed.startsWith("print(") &&
        !trimmed.startsWith("# Test") &&
        !trimmed.startsWith("# test")
      );
    })
    .join("\n");

  // Build test calls
  const testCalls = testCases.map((tc, i) => {
    // tc.input is like "func_name([1,2,3], 6)" or just "[1,2,3], 6"
    const call = tc.input.startsWith(functionName)
      ? tc.input
      : `${functionName}(${tc.input})`;
    return `
try:
    _result_${i} = ${call}
    print(repr(_result_${i}))
except Exception as _e_${i}:
    print(f"ERROR: {_e_${i}}")`;
  });

  return `${cleanedCode}

# === AUTO TEST HARNESS ===
${testCalls.join("\n")}
`;
}

function buildJavaScriptHarness(
  userCode: string,
  functionName: string,
  testCases: TestCase[]
): string {
  // Convert Python function name to camelCase for JS
  const camelName = functionName.replace(/_([a-z])/g, (_, c: string) =>
    c.toUpperCase()
  );

  const testCalls = testCases.map((tc, i) => {
    // Try both snake_case and camelCase
    const call = tc.input.startsWith(functionName)
      ? tc.input.replace(functionName, camelName)
      : tc.input.startsWith(camelName)
        ? tc.input
        : `${camelName}(${tc.input})`;
    return `
try {
  const _result_${i} = ${call};
  console.log(JSON.stringify(_result_${i}));
} catch(_e_${i}) {
  console.log("ERROR: " + _e_${i}.message);
}`;
  });

  return `${userCode}

// === AUTO TEST HARNESS ===
${testCalls.join("\n")}
`;
}

function buildJavaHarness(
  userCode: string,
  functionName: string,
  testCases: TestCase[]
): string {
  // For Java, we wrap in a Main class that calls the Solution class
  // This is simplified — complex Java test cases need more structure
  const camelName = functionName.replace(/_([a-z])/g, (_, c: string) =>
    c.toUpperCase()
  );

  // Check if user code already has a class
  const hasClass = /class\s+\w+/.test(userCode);

  if (!hasClass) {
    // Wrap in Solution class
    return `class Solution {
${userCode.split("\n").map((l) => "    " + l).join("\n")}
}

class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test cases would be called here
        System.out.println("Java execution ready");
    }
}`;
  }

  // User code has a class — append a Main class for testing
  return `${userCode}

class Main {
    public static void main(String[] args) {
        try {
            // Instantiate solution
            var sol = new Solution();
            System.out.println("Java execution ready");
        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
        }
    }
}`;
}

// ─── Comparison helpers ──────────────────────────────────────────────────────

function normalizeOutput(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/'/g, "")  // Python uses ' for strings in repr
    .replace(/"/g, "")  // Normalize quotes
    .replace(/True/g, "true")
    .replace(/False/g, "false")
    .replace(/None/g, "null");
}

function outputsMatch(actual: string, expected: string): boolean {
  if (actual.trim() === expected.trim()) return true;
  return normalizeOutput(actual) === normalizeOutput(expected);
}

// ─── Main handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      code,
      language = "python",
      testCases = [],
      sessionId,
      problemId,
      functionName,
      mode = "harness", // "harness" (LeetCode) or "raw" (stdin)
      customTestInput, // For "Run with custom input" feature
    }: {
      code: string;
      language: string;
      testCases: TestCase[];
      sessionId?: string;
      problemId?: string;
      functionName?: string;
      mode?: "harness" | "raw";
      customTestInput?: string;
    } = body;

    if (!code || code.length > 50000) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    const langConfig = LANGUAGE_VERSIONS[language];
    if (!langConfig) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const testResults: Array<{
      input: string;
      expected: string;
      actual: string;
      passed: boolean;
      runtimeMs: number;
    }> = [];

    let compilationError: string | undefined;

    // ── Custom test input mode ──
    if (customTestInput !== undefined && functionName) {
      const tc: TestCase = {
        input: `${functionName}(${customTestInput})`,
        expected_output: "?", // User doesn't know expected — just show output
      };
      const result = await executeWithHarness(
        code,
        language,
        functionName,
        [tc],
        langConfig
      );
      return NextResponse.json(result);
    }

    // ── Harness mode (LeetCode-style) ──
    if (mode === "harness" && functionName && testCases.length > 0) {
      const result = await executeWithHarness(
        code,
        language,
        functionName,
        testCases,
        langConfig
      );

      // Record to session
      if (sessionId && problemId) {
        recordCodeSubmission(sessionId, {
          problemId,
          code,
          language,
          passed: result.allPassed,
        }).catch(() => {});
      }

      return NextResponse.json(result);
    }

    // ── Raw mode (stdin/stdout per test case) ──
    for (const tc of testCases) {
      const tcStart = Date.now();
      try {
        const pistonRes = await fetch(`${PISTON_URL}/api/v2/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: langConfig.language,
            version: langConfig.version,
            files: [{ content: code }],
            stdin: tc.input,
            run_timeout: 10000,
            compile_timeout: 10000,
            memory_limit: 256000000,
          }),
        });

        if (!pistonRes.ok) {
          testResults.push({
            input: tc.input,
            expected: tc.expected_output,
            actual: `Execution error: ${pistonRes.status}`,
            passed: false,
            runtimeMs: Date.now() - tcStart,
          });
          continue;
        }

        const result: PistonResult = await pistonRes.json();

        if (result.compile && result.compile.code !== 0) {
          compilationError = result.compile.stderr || result.compile.stdout;
          testResults.push({
            input: tc.input,
            expected: tc.expected_output,
            actual: `Compilation error: ${compilationError}`,
            passed: false,
            runtimeMs: Date.now() - tcStart,
          });
          break;
        }

        const actual = (result.run.stdout || "").trim();
        const passed = outputsMatch(actual, tc.expected_output);

        testResults.push({
          input: tc.input,
          expected: tc.expected_output,
          actual: result.run.stderr
            ? `${actual}\nSTDERR: ${result.run.stderr}`
            : actual,
          passed,
          runtimeMs: Date.now() - tcStart,
        });
      } catch (err) {
        testResults.push({
          input: tc.input,
          expected: tc.expected_output,
          actual: `Runtime error: ${err instanceof Error ? err.message : "unknown"}`,
          passed: false,
          runtimeMs: Date.now() - tcStart,
        });
      }
    }

    const allPassed =
      testResults.length > 0 && testResults.every((r) => r.passed);

    if (sessionId && problemId) {
      recordCodeSubmission(sessionId, {
        problemId,
        code,
        language,
        passed: allPassed,
      }).catch(() => {});
    }

    return NextResponse.json({
      testResults,
      allPassed,
      compilationError,
      executionTimeMs: Date.now() - startTime,
    });
  } catch (error) {
    console.error("[run-code] Error:", error);
    return NextResponse.json({ error: "Code execution failed" }, { status: 500 });
  }
}

// ─── Harness execution ──────────────────────────────────────────────────────

async function executeWithHarness(
  userCode: string,
  language: string,
  functionName: string,
  testCases: TestCase[],
  langConfig: { language: string; version: string }
): Promise<{
  testResults: Array<{
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    runtimeMs: number;
  }>;
  allPassed: boolean;
  compilationError?: string;
  executionTimeMs: number;
}> {
  const startTime = Date.now();

  // Build the harness-wrapped code
  let wrappedCode: string;
  switch (language) {
    case "javascript":
      wrappedCode = buildJavaScriptHarness(userCode, functionName, testCases);
      break;
    case "java":
      wrappedCode = buildJavaHarness(userCode, functionName, testCases);
      break;
    default:
      wrappedCode = buildPythonHarness(userCode, functionName, testCases);
  }

  try {
    const pistonRes = await fetch(`${PISTON_URL}/api/v2/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [{ content: wrappedCode }],
        stdin: "",
        run_timeout: 15000,
        compile_timeout: 10000,
        memory_limit: 256000000,
      }),
    });

    if (!pistonRes.ok) {
      return {
        testResults: testCases.map((tc) => ({
          input: tc.input,
          expected: tc.expected_output,
          actual: `Execution service error: ${pistonRes.status}`,
          passed: false,
          runtimeMs: 0,
        })),
        allPassed: false,
        compilationError: `Piston error: ${pistonRes.status}`,
        executionTimeMs: Date.now() - startTime,
      };
    }

    const result: PistonResult = await pistonRes.json();

    // Compilation error
    if (result.compile && result.compile.code !== 0) {
      const errMsg = result.compile.stderr || result.compile.stdout;
      return {
        testResults: [],
        allPassed: false,
        compilationError: errMsg,
        executionTimeMs: Date.now() - startTime,
      };
    }

    // Runtime error (non-zero exit + no stdout)
    if (result.run.code !== 0 && !result.run.stdout.trim()) {
      return {
        testResults: [],
        allPassed: false,
        compilationError: result.run.stderr || `Exit code: ${result.run.code}`,
        executionTimeMs: Date.now() - startTime,
      };
    }

    // Parse output lines — each line corresponds to one test case result
    const outputLines = result.run.stdout.trim().split("\n");
    const testResults = testCases.map((tc, i) => {
      const actual = (outputLines[i] || "").trim();
      const isError = actual.startsWith("ERROR:");
      const passed =
        !isError &&
        tc.expected_output !== "?" &&
        outputsMatch(actual, tc.expected_output);

      return {
        input: tc.input,
        expected: tc.expected_output,
        actual: isError ? actual : actual,
        passed: tc.expected_output === "?" ? true : passed, // Custom input mode: always "pass"
        runtimeMs: 0, // Single execution — can't measure per-test
      };
    });

    const allPassed =
      testResults.length > 0 &&
      testResults.every(
        (r) => r.passed || r.expected === "?"
      );

    return {
      testResults,
      allPassed,
      compilationError: result.run.stderr
        ? result.run.stderr.slice(0, 500)
        : undefined,
      executionTimeMs: Date.now() - startTime,
    };
  } catch (err) {
    return {
      testResults: testCases.map((tc) => ({
        input: tc.input,
        expected: tc.expected_output,
        actual: `Connection error: ${err instanceof Error ? err.message : "unknown"}`,
        passed: false,
        runtimeMs: 0,
      })),
      allPassed: false,
      compilationError: "Failed to connect to code execution service",
      executionTimeMs: Date.now() - startTime,
    };
  }
}
