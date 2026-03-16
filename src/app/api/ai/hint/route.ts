import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { HINT_SYSTEM_PROMPT } from "@/lib/ai-prompts";
import { AIHintRequest } from "@/types/ai";
import { createServerSupabase } from "@/lib/supabase-auth";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ok = await deductCredits(user.id, CREDIT_COSTS.hint, "hint");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  try {
    const body: AIHintRequest = await req.json();
    const { code, starterCode, solutionCode, lessonTitle, lessonContent, hintLevel } = body;

    const model = getGeminiModel(HINT_SYSTEM_PROMPT);

    const prompt = `PROBLEM: ${lessonTitle}

PROBLEM DESCRIPTION:
${lessonContent.substring(0, 2000)}

STARTER CODE:
\`\`\`python
${starterCode}
\`\`\`

STUDENT'S CURRENT CODE:
\`\`\`python
${code}
\`\`\`

SOLUTION CODE (FOR YOUR REFERENCE ONLY — DO NOT REVEAL):
\`\`\`python
${solutionCode}
\`\`\`

REQUESTED HINT LEVEL: ${hintLevel}

Provide a Level ${hintLevel} hint now.`;

    const result = await model.generateContent(prompt);
    const hint = result.response.text();

    return Response.json({ hint, level: hintLevel });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[hint] Error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
