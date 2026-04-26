// POST /api/cc/activities/enhance — takes one activity description and
// returns: what it currently communicates + a stronger version.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";
import { chatOnce } from "@/lib/cc/openrouter";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    description?: string;
    position?: string;
    organization?: string;
    activity_type?: string;
  };

  const description = body.description?.trim();
  if (!description || description.length < 10) {
    return NextResponse.json({ error: "Description too short" }, { status: 400 });
  }

  const systemPrompt = `You enhance Common App activity descriptions. Common App caps each at 150 characters. Output STRICT JSON only:

{
  "currentlyCommunicates": string,   // 1 sentence, what an admissions reader takes away from the current text
  "strongerVersion": string,         // <=150 chars, more specific + impact-forward (numbers, scope, outcome)
  "diff": string                     // 1 sentence, what changed and why
}

Rules:
- strongerVersion MUST be <=150 chars. Count carefully.
- Use active verbs (led, built, taught, scaled). No "passionate about", no "responsible for".
- Surface numbers: "team of 12", "raised $4k", "300 students reached".
- If the original is already strong, say so honestly in diff and propose a tiny refinement only.`;

  const userPrompt = `Activity: ${body.position ?? "?"} at ${body.organization ?? "?"} (${body.activity_type ?? "?"})

Current description: "${description}"

Enhance.`;

  let raw: string;
  try {
    raw = await chatOnce([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
  } catch (err) {
    console.error("[activities/enhance] LLM error", err);
    return NextResponse.json({ error: "Enhancement failed" }, { status: 503 });
  }

  try {
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Could not parse enhancement" }, { status: 502 });
  }
}
