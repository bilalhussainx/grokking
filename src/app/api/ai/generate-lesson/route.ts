import { NextRequest } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

const SYSTEM_PROMPT = `You are an expert curriculum designer for a coding education platform called Grokking.
You create lessons that teach data structures, algorithms, and system design.

When asked to generate a lesson, produce:
1. A clear title
2. Educational markdown content (500-1000 words) that explains the concept
3. Python starter code with function signature and docstring
4. A complete Python solution

Your content should be:
- Clear and progressive (build from simple to complex)
- Include code examples inline
- Use analogies when helpful
- Include time/space complexity analysis

RESPOND IN THIS EXACT JSON FORMAT (no markdown wrapping):
{
  "title": "Lesson Title Here",
  "content": "# Full markdown content here...",
  "starterCode": "def solution():\\n    # Your code here\\n    pass",
  "solutionCode": "def solution():\\n    # Complete solution\\n    return result"
}`;

export async function POST(req: NextRequest) {
  try {
    const { topic, courseTitle, moduleTitle } = await req.json();

    const model = getGeminiModel(SYSTEM_PROMPT);

    const prompt = `Generate a lesson for:
Course: ${courseTitle}
Module: ${moduleTitle}
Topic: ${topic}

Create a complete lesson with educational content, starter code, and solution code. Return ONLY valid JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Failed to parse lesson" }, { status: 500 });
    }

    const lesson = JSON.parse(jsonMatch[0]);
    return Response.json(lesson);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
