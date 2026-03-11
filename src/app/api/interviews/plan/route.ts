import { NextRequest, NextResponse } from "next/server";
import { InterviewPreset, InterviewType } from "@/types/interview";

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";

const PRESET_DESCRIPTIONS: Record<InterviewPreset, string> = {
  frontend:
    "Frontend engineering: HTML, CSS, JavaScript, React, browser APIs, performance, accessibility",
  backend:
    "Backend engineering: server architecture, databases, REST/GraphQL APIs, authentication, scalability",
  fullstack:
    "Full-stack engineering: both frontend and backend topics, system integration, deployment",
  "system-design":
    "System design: distributed systems, scalability, databases, caching, load balancing, microservices",
  dsa: "Data structures and algorithms: arrays, trees, graphs, dynamic programming, sorting, complexity analysis",
};

const SYSTEM_PROMPT = `You are an expert technical interviewer. When given a job description, interview preset, and interview type, generate a structured interview question plan.

Return ONLY valid JSON (no markdown fences, no extra text) with this exact shape:
{
  "questions": [
    {
      "id": 1,
      "text": "The question text",
      "type": "technical" | "behavioral",
      "followUps": ["Follow-up question 1", "Follow-up question 2"],
      "evaluationCriteria": "What a good answer looks like"
    }
  ],
  "interviewerPersona": "A short description of the interviewer's style and focus",
  "timeAllocation": {
    "intro": 5,
    "questions": 40,
    "wrapUp": 5
  }
}

Guidelines:
- Generate 5-7 questions total
- For "technical" interview type: all questions should be type "technical"
- For "behavioral" interview type: all questions should be type "behavioral"
- For "mixed" interview type: mix roughly 60% technical and 40% behavioral
- Each question should have 2-3 follow-up questions
- The interviewerPersona should be a brief description (1-2 sentences)
- timeAllocation values are in minutes and should sum to approximately 50`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobDescription,
      preset,
      interviewType,
    }: {
      jobDescription: string;
      preset: InterviewPreset;
      interviewType: InterviewType;
    } = body;

    if (!preset || !interviewType) {
      return NextResponse.json(
        { error: "preset and interviewType are required" },
        { status: 400 }
      );
    }

    const presetDescription = PRESET_DESCRIPTIONS[preset] || preset;

    const userPrompt = `Generate an interview question plan for the following:

Interview Preset: ${preset}
Preset Focus: ${presetDescription}
Interview Type: ${interviewType}
${jobDescription ? `Job Description:\n${jobDescription}` : "No specific job description provided — use a generic senior software engineer role."}

Return the JSON question plan now.`;

    if (!MOONSHOT_API_KEY) {
      return NextResponse.json(
        { error: "MOONSHOT_API_KEY not configured" },
        { status: 500 }
      );
    }

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
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!kimiRes.ok) {
      const errText = await kimiRes.text();
      console.error("[Interview Plan] Kimi error:", kimiRes.status, errText);
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

    let plan;
    try {
      plan = JSON.parse(rawContent);
    } catch {
      console.error("[Interview Plan] Failed to parse Kimi response:", rawContent);
      return NextResponse.json(
        { error: "Failed to parse interview plan from AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json(plan);
  } catch (error: unknown) {
    console.error("[Interview Plan] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate interview plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
