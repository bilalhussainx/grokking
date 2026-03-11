import { NextRequest, NextResponse } from "next/server";
import { InterviewType, InterviewPlan, TranscriptEntry } from "@/types/interview";

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";

const SYSTEM_PROMPT = `You are an expert technical interview evaluator. Given a full interview transcript, the original question plan, and optionally a code submission, score the candidate's performance.

Return ONLY valid JSON (no markdown fences, no extra text) with this exact shape:
{
  "overall": 7.5,
  "categories": {
    "communication": 8,
    "technicalDepth": 7,
    "problemSolving": 8,
    "codeQuality": 6
  },
  "questions": [
    {
      "id": 1,
      "question": "The original question text",
      "answerSummary": "Brief summary of how the candidate answered",
      "score": 8,
      "feedback": "Specific feedback on this answer"
    }
  ],
  "strengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "improvements": [
    "Area to improve 1",
    "Area to improve 2",
    "Area to improve 3"
  ]
}

Scoring Guidelines:
- All scores are on a scale of 1-10
- overall: weighted average across all categories
- communication: clarity, conciseness, ability to explain complex ideas
- technicalDepth: accuracy and depth of technical knowledge
- problemSolving: approach to breaking down and solving problems
- codeQuality: only score if code was submitted; otherwise base on verbal explanations (score 0 if not applicable)
- For behavioral interviews, weight communication higher and codeQuality lower
- Be honest and constructive — not overly harsh or overly lenient
- strengths: 2-4 specific things the candidate did well
- improvements: 2-4 specific, actionable areas to improve`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      transcript,
      questionPlan,
      finalCode,
      interviewType,
    }: {
      transcript: TranscriptEntry[];
      questionPlan: InterviewPlan;
      finalCode?: string;
      interviewType: InterviewType;
    } = body;

    if (!transcript || !questionPlan) {
      return NextResponse.json(
        { error: "transcript and questionPlan are required" },
        { status: 400 }
      );
    }

    if (!MOONSHOT_API_KEY) {
      return NextResponse.json(
        { error: "MOONSHOT_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Truncate transcript to last 100 entries if too long
    const truncatedTranscript = transcript.slice(-100);

    // Format transcript as readable text
    const formattedTranscript = truncatedTranscript
      .map((entry) => {
        const speaker = entry.role === "agent" ? "INTERVIEWER" : "CANDIDATE";
        return `${speaker}: ${entry.text}`;
      })
      .join("\n\n");

    // Format question plan
    const formattedQuestions = questionPlan.questions
      .map(
        (q) =>
          `Q${q.id} [${q.type}]: ${q.text}\n  Evaluation Criteria: ${q.evaluationCriteria}`
      )
      .join("\n\n");

    const userPrompt = `Please evaluate this ${interviewType} interview.

ORIGINAL QUESTION PLAN:
${formattedQuestions}

FULL INTERVIEW TRANSCRIPT:
${formattedTranscript}
${
  finalCode
    ? `
CANDIDATE'S CODE SUBMISSION:
\`\`\`
${finalCode}
\`\`\``
    : "\nNo code was submitted during this interview."
}

Score the candidate's performance and return the JSON scorecard now.`;

    const kimiRes = await fetch(MOONSHOT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MOONSHOT_API_KEY}`,
      },
      body: JSON.stringify({
        model: MOONSHOT_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        stream: false,
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!kimiRes.ok) {
      const errText = await kimiRes.text();
      console.error("[Interview Score] Kimi error:", kimiRes.status, errText);
      return NextResponse.json(
        { error: `Kimi API error: ${kimiRes.status}` },
        { status: 502 }
      );
    }

    const kimiData = await kimiRes.json();
    let rawContent: string =
      kimiData.choices?.[0]?.message?.content || "";

    // Strip markdown fences if present
    rawContent = rawContent
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    let scorecard;
    try {
      scorecard = JSON.parse(rawContent);
    } catch {
      console.error("[Interview Score] Failed to parse Kimi response:", rawContent);
      return NextResponse.json(
        { error: "Failed to parse scorecard from AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json(scorecard);
  } catch (error: unknown) {
    console.error("[Interview Score] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to score interview";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
