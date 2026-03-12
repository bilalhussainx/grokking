import { NextRequest } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { SUPERVISION_SYSTEM_PROMPT } from "@/lib/ai-prompts";
import { AISupervisionRequest } from "@/types/ai";

export async function POST(req: NextRequest) {
  try {
    const body: AISupervisionRequest = await req.json();
    const { code, starterCode, solutionCode, lessonTitle, timeSinceLastChange, changeCount } = body;

    const model = getGeminiModel(SUPERVISION_SYSTEM_PROMPT);

    const prompt = `LESSON: ${lessonTitle}

STARTER CODE:
\`\`\`python
${starterCode}
\`\`\`

STUDENT'S CURRENT CODE:
\`\`\`python
${code}
\`\`\`

SOLUTION CODE (REFERENCE ONLY):
\`\`\`python
${solutionCode}
\`\`\`

TIME SINCE LAST CODE CHANGE: ${timeSinceLastChange} seconds
TOTAL CODE CHANGES THIS SESSION: ${changeCount}

Analyze if the student needs help. Return ONLY valid JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ isStuck: false }, { status: 200 });
    }

    const intervention = JSON.parse(jsonMatch[0]);
    return Response.json(intervention);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
