import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

interface BulletFeedback {
  works: string[];
  improve: string[];
  rewrite: string;
  charCount: number;
  withinLimit: boolean;
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const { text, kind, organization, role, charLimit } = (await req.json()) as {
    text?: string;
    kind?: "activity" | "honor";
    organization?: string;
    role?: string;
    charLimit?: number;
  };

  if (!text || !text.trim()) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const limit = charLimit || (kind === "honor" ? 100 : 150);
  const bulletKind = kind === "honor" ? "honor description" : "activity bullet";

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "bullet_suggest");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const contextLine = organization || role
    ? `Context: ${[organization, role].filter(Boolean).join(" — ")}`
    : "";

  const systemPrompt = `You are a Common App admissions counselor reviewing a single ${bulletKind}.

RULES for a strong bullet:
- Starts with a concrete action verb (Founded, Led, Engineered, Analyzed, NOT "Helped" or "Participated").
- Quantifies impact where possible (numbers, percentages, headcount, dollars).
- Names the result, not just the activity.
- No filler ("responsible for", "various", "many").
- Fits under ${limit} characters.
- Avoids first-person pronouns ("I", "my").

Return JSON ONLY, nothing else:
{
  "works": ["specific thing that's strong about this bullet"],
  "improve": ["specific thing that could be stronger"],
  "rewrite": "one tight rewrite under ${limit} characters",
  "charCount": ${text.length},
  "withinLimit": ${text.length <= limit}
}

Keep "works" and "improve" to 1-3 items each, each under 80 characters. Be concrete, not generic.`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `${contextLine}\n\nCurrent ${bulletKind} (${text.length} chars, limit ${limit}):\n"${text}"`,
    },
  ];

  const result = await callLLMJSON<BulletFeedback>(messages, { maxTokens: 500, temperature: 0.4 });

  if (!result) {
    return NextResponse.json({ error: "Suggestion failed" }, { status: 500 });
  }

  return NextResponse.json({
    ...result,
    charCount: text.length,
    withinLimit: text.length <= limit,
  });
}
