import { NextRequest } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { GRADE_SYSTEM_PROMPT } from "@/lib/ai-prompts";
import { AIGradeRequest, AIGradeResult } from "@/types/ai";

export async function POST(req: NextRequest) {
  try {
    const body: AIGradeRequest = await req.json();
    const { code, output, starterCode, solutionCode, lessonTitle, lessonContent } = body;

    const model = getGeminiModel(GRADE_SYSTEM_PROMPT);

    const prompt = `PROBLEM: ${lessonTitle}

PROBLEM DESCRIPTION:
${lessonContent.substring(0, 2000)}

STARTER CODE:
\`\`\`python
${starterCode}
\`\`\`

STUDENT'S SUBMITTED CODE:
\`\`\`python
${code}
\`\`\`

CODE OUTPUT:
\`\`\`
${output}
\`\`\`

SOLUTION CODE:
\`\`\`python
${solutionCode}
\`\`\`

Evaluate this submission now. Return ONLY valid JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Failed to parse grading response" }, { status: 500 });
    }

    const grade: AIGradeResult = JSON.parse(jsonMatch[0]);
    return Response.json(grade);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
