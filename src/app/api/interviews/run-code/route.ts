// src/app/api/interviews/run-code/route.ts
// Executes user code against test cases via Piston API.
// Piston runs in Docker on localhost:2000 (self-hosted).

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { recordCodeSubmission } from "@/lib/interview-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PISTON_URL = process.env.PISTON_URL || "http://localhost:2000";

interface TestCase {
  input: string;
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

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      code,
      language = "python",
      testCases = [],
      sessionId,
      problemId,
    }: {
      code: string;
      language: string;
      testCases: TestCase[];
      sessionId?: string;
      problemId?: string;
    } = body;

    if (!code || code.length > 50000) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    const langConfig = LANGUAGE_VERSIONS[language];
    if (!langConfig) {
      return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
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

        // Check for compilation errors
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
        const expected = tc.expected_output.trim();
        const passed = actual === expected;

        testResults.push({
          input: tc.input,
          expected: tc.expected_output,
          actual: result.run.stderr ? `${actual}\nSTDERR: ${result.run.stderr}` : actual,
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

    const allPassed = testResults.length > 0 && testResults.every((r) => r.passed);

    // Record to session if provided
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
