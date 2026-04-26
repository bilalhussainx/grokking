// POST /api/cc/supplements/trim — Claude-trims a draft to within the word
// limit, preserving voice. Returns the trimmed text only.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";
import { chatOnce } from "@/lib/cc/openrouter";
import { wordCount } from "@/lib/supplements/reuse-detector";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    draft?: string;
    wordLimit?: number;
  };
  const draft = body.draft?.trim();
  const limit = body.wordLimit;
  if (!draft || !limit || limit < 25) {
    return NextResponse.json({ error: "Missing draft or invalid wordLimit" }, { status: 400 });
  }

  const currentCount = wordCount(draft);
  if (currentCount <= limit) {
    return NextResponse.json({ trimmed: draft, originalCount: currentCount, finalCount: currentCount, changed: false });
  }

  const systemPrompt = `You trim a college supplement essay to ${limit} words MAX while preserving the student's voice. Rules:

- Output the trimmed essay ONLY. No preamble, no notes, no markdown, no quote marks.
- Cut: redundancies, throat-clearing, generic adjectives, intro-summary patterns, low-info clauses.
- Keep: specific scenes, numbers, named people/places, quoted dialogue, the student's distinctive turns of phrase.
- Aim for ${Math.max(limit - 5, Math.round(limit * 0.95))} - ${limit} words. Don't go under 90% of the limit.
- Never add facts or claims that weren't in the original.
- If the original is already strong, prefer micro-cuts over rephrasing whole sentences.`;

  let trimmed: string;
  try {
    trimmed = await chatOnce([
      { role: "system", content: systemPrompt },
      { role: "user", content: draft },
    ]);
  } catch (err) {
    console.error("[supplements/trim] LLM error", err);
    return NextResponse.json({ error: "Trim failed" }, { status: 503 });
  }

  trimmed = trimmed.replace(/^["']|["']$/g, "").trim();
  const finalCount = wordCount(trimmed);

  return NextResponse.json({ trimmed, originalCount: currentCount, finalCount, changed: true });
}
