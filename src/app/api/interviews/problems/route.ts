// src/app/api/interviews/problems/route.ts
// GET: fetch random problems from the bank — no auth required.
// Used as a fallback when the full session API isn't available
// (guest users, expired auth tokens, etc.)

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-auth";
import type { InterviewProblem } from "@/types/interview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const count = Math.min(parseInt(searchParams.get("count") || "3", 10), 10);
  const difficulty = searchParams.get("difficulty"); // optional filter

  try {
    const admin = createAdminSupabase();

    let query = admin
      .from("interview_problems")
      .select("*")
      .limit(50);

    if (difficulty && ["easy", "medium", "hard"].includes(difficulty)) {
      query = query.eq("difficulty", difficulty);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return NextResponse.json({ problems: [] });
    }

    // Fisher-Yates shuffle and take `count`
    const shuffled = [...data];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selected = shuffled.slice(0, count).map(mapDbProblem);

    return NextResponse.json({ problems: selected });
  } catch (err) {
    console.error("[Problems] GET error:", err);
    return NextResponse.json({ problems: [] });
  }
}

function mapDbProblem(raw: Record<string, unknown>): InterviewProblem {
  return {
    id: raw.id as string,
    slug: raw.slug as string,
    title: raw.title as string,
    difficulty: raw.difficulty as "easy" | "medium" | "hard",
    description: raw.description as string,
    constraints: (raw.constraints as string) || null,
    examples:
      (raw.examples as Array<{
        input: string;
        output: string;
        explanation?: string;
      }>) || [],
    functionName: (raw.function_name as string) || null,
    starterCodePython: (raw.starter_code_python as string) || null,
    starterCodeJava: (raw.starter_code_java as string) || null,
    starterCodeJs: (raw.starter_code_js as string) || null,
    solutionCodePython: (raw.solution_code_python as string) || null,
    solutionCodeJava: (raw.solution_code_java as string) || null,
    topics: (raw.topics as string[]) || [],
    companyTags: (raw.company_tags as string[]) || [],
    pattern: (raw.pattern as string) || null,
    testCasesVisible:
      (raw.test_cases_visible as Array<{
        input: string;
        expected_output: string;
      }>) || [],
    testCasesHidden:
      (raw.test_cases_hidden as Array<{
        input: string;
        expected_output: string;
      }>) || [],
  };
}
