import { NextRequest, NextResponse } from "next/server";
import { InterviewType, InterviewPlan, TranscriptEntry } from "@/types/interview";
import { createServerSupabase } from "@/lib/supabase-auth";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";

// OpenRouter primary for scoring (Claude Sonnet 4.5 — best at nuanced
// behavioral feedback and writing the "what they would write" report mock).
// Kimi fallback if OPENROUTER_API_KEY is missing.
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const SCORE_MODEL = process.env.OPENROUTER_SCORE_MODEL || "anthropic/claude-sonnet-4.5";

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
- improvements: 2-4 specific, actionable areas to improve

COMMUNICATION — WHAT COUNTS AS A WEAKNESS:
- DO flag: filler words ("um", "uh", "like", "you know") used repeatedly.
- DO flag: long pauses (5+ seconds or "[pause]" markers) that break the candidate's thread.
- DO flag: false starts, unfinished sentences, circling without landing a point.
- DO flag: difficulty articulating — rambling without thesis, jargon they can't explain.
- DO NOT flag: line breaks or short sentences in the transcript. The transcript is segmented by pause detection, not meaning; sentence splits are NOT a communication weakness. Ignore transcript formatting when scoring.
- DO NOT flag: natural 1-3 second thinking pauses — those are a strength.`;

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  // Allow guest scoring (trial flow) — skip credit deduction for guests
  if (user) {
    const ok = await deductCredits(user.id, CREDIT_COSTS.interview_score, "interview_score");
    if (!ok) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }
  }

  try {
    const body = await req.json();
    const {
      transcript,
      questionPlan,
      finalCode,
      interviewType,
      preset,
      language = "en",
      companyPersonaId,
      // College vertical (spec: 2026-04-07-college-admissions-interviews-design.md)
      category = "tech",
      collegePersonaId,
      feedbackLanguage = "en",
      sessionId,
    }: {
      transcript: TranscriptEntry[];
      questionPlan: InterviewPlan;
      finalCode?: string;
      interviewType: InterviewType;
      preset?: string;
      language?: string;
      companyPersonaId?: string;
      category?: 'tech' | 'college';
      collegePersonaId?: string;
      feedbackLanguage?: string;
      sessionId?: string;
    } = body;

    if (!transcript || !questionPlan) {
      return NextResponse.json(
        { error: "transcript and questionPlan are required" },
        { status: 400 }
      );
    }

    // Write asked questions to history (best-effort, authenticated users only).
    // Spec keys history rows by category so tech and college pools stay separate.
    const historyPreset = category === "college" ? (collegePersonaId || "unknown") : preset;
    const historyType = category === "college" ? "college" : interviewType;
    if (user && historyPreset && historyType && questionPlan.questions?.length) {
      try {
        const rows = questionPlan.questions.map((q: { text: string; type?: string }) => ({
          user_id: user.id,
          preset: historyPreset,
          interview_type: historyType,
          company_persona_id: category === "college" ? collegePersonaId : (companyPersonaId || null),
          language,
          question_text: q.text,
          question_topic: q.type || null,
          category,
        }));
        await supabase.from("interview_question_history").insert(rows);
      } catch (e) {
        console.warn("[interviews/score] Failed to write history (non-fatal):", e);
      }
    }

    if (!OPENROUTER_API_KEY && !MOONSHOT_API_KEY) {
      return NextResponse.json(
        { error: "No LLM API key configured (OPENROUTER_API_KEY or MOONSHOT_API_KEY)" },
        { status: 500 }
      );
    }

    // OpenRouter primary, Kimi fallback
    const useOpenRouter = !!OPENROUTER_API_KEY;
    const llmUrl = useOpenRouter ? OPENROUTER_URL : MOONSHOT_URL;
    const llmKey = useOpenRouter ? OPENROUTER_API_KEY : MOONSHOT_API_KEY;
    const llmModel = useOpenRouter ? SCORE_MODEL : MOONSHOT_MODEL;

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

    // Pick the system prompt and user prompt based on category
    let systemPromptForScoring = SYSTEM_PROMPT;
    let userPrompt: string;

    if (category === "college") {
      try {
        const { COLLEGE_SCORECARD_SYSTEM_PROMPT } = await import("@/lib/college-interview-prompt-builders");
        systemPromptForScoring = COLLEGE_SCORECARD_SYSTEM_PROMPT;
      } catch (e) {
        console.error("[Interview Score] Failed to load college scorecard prompt:", e);
      }

      userPrompt = `Please evaluate this college admissions alumni interview.

QUESTION PLAN:
${formattedQuestions}

FULL INTERVIEW TRANSCRIPT:
${formattedTranscript}

Score the candidate using the 5-dimension college rubric (communication, intellectualCuriosity, authenticity, schoolFit, maturity). Pull DIRECT QUOTES from the transcript when possible. The 'whatTheyWouldWriteInTheReport' field is the most important field — make it feel like a real alumni report excerpt. Return the JSON scorecard now.`;
    } else {
      userPrompt = `Please evaluate this ${interviewType} interview.

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
    }

    const kimiRes = await fetch(llmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${llmKey}`,
      },
      body: JSON.stringify({
        model: llmModel,
        messages: [
          { role: "system", content: systemPromptForScoring },
          { role: "user", content: userPrompt },
        ],
        stream: false,
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!kimiRes.ok) {
      const errText = await kimiRes.text();
      console.error("[Interview Score] LLM error:", kimiRes.status, errText);
      return NextResponse.json(
        { error: `LLM API error: ${kimiRes.status}` },
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

    // Persist to interview_performance and write facts to knowledge graph
    if (user && sessionId) {
      import("@/lib/interview-session").then(({ endSession }) => {
        endSession(sessionId, user.id, scorecard).catch((err: unknown) => {
          console.warn("[Interview Score] Failed to persist session:", err);
        });
      }).catch(() => {});
    } else if (user) {
      // No session — still write performance facts to knowledge graph
      import("@/lib/knowledge-graph").then(({ upsertFact }) => {
        for (const improvement of (scorecard.improvements || []).slice(0, 3)) {
          upsertFact(user.id, {
            subject: user.id,
            predicate: "weak_at",
            object: improvement.slice(0, 100),
            confidence: 0.6,
            sourceAgent: "interviewer",
          }).catch(() => {});
        }
        for (const strength of (scorecard.strengths || []).slice(0, 3)) {
          upsertFact(user.id, {
            subject: user.id,
            predicate: "strong_at",
            object: strength.slice(0, 100),
            confidence: 0.6,
            sourceAgent: "interviewer",
          }).catch(() => {});
        }
      }).catch(() => {});
    }

    // College vertical: translate the scorecard text fields if requested
    if (category === "college" && feedbackLanguage && feedbackLanguage !== "en") {
      try {
        const { buildTranslationPrompt } = await import("@/lib/college-interview-prompt-builders");
        const langNames: Record<string, string> = {
          es: "Spanish", fr: "French", de: "German", it: "Italian",
          nl: "Dutch", ja: "Japanese", hi: "Hindi", pa: "Punjabi",
        };
        const langName = langNames[feedbackLanguage] || feedbackLanguage;
        const translationPrompt = buildTranslationPrompt(scorecard, feedbackLanguage, langName);

        const tRes = await fetch(llmUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${llmKey}`,
          },
          body: JSON.stringify({
            model: llmModel,
            messages: [
              { role: "system", content: "You are a precise translator. Return only valid JSON." },
              { role: "user", content: translationPrompt },
            ],
            stream: false,
            temperature: 0.2,
            max_tokens: 3000,
          }),
        });

        if (tRes.ok) {
          const tData = await tRes.json();
          let translated = tData.choices?.[0]?.message?.content || "";
          translated = translated
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();
          try {
            const translatedScorecard = JSON.parse(translated);
            // Keep the original English version available too for fallback display
            return NextResponse.json({ ...translatedScorecard, _englishOriginal: scorecard });
          } catch {
            console.warn("[Interview Score] Translation parse failed; returning English scorecard");
          }
        }
      } catch (e) {
        console.warn("[Interview Score] Translation failed (non-fatal):", e);
      }
    }

    return NextResponse.json(scorecard);
  } catch (error: unknown) {
    console.error("[Interview Score] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to score interview";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
