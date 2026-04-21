import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../../../helpers";
import { buildEssayContext, getOutlineRefineSystemPrompt } from "@/lib/cc/essay-helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

interface OutlineSection {
  label: string;
  bullets: string[];
  wordBudget: number;
}
interface OutlineOption {
  title: string;
  sections: OutlineSection[];
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_outline_refine");
  if (!ok) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx) return NextResponse.json({ error: "Essay not found" }, { status: 404 });

  const body = await req.json();
  const { outlines, selectedThemes, history, userGuidance } = body as {
    outlines: OutlineOption[];
    selectedThemes: string[];
    history: { role: "user" | "assistant"; content: string }[];
    userGuidance?: string;
  };

  if (!outlines?.length) {
    return NextResponse.json({ error: "Missing outlines" }, { status: 400 });
  }

  const fullHistory = userGuidance
    ? [...(history || []), { role: "user" as const, content: userGuidance }]
    : history || [];

  const systemPrompt = getOutlineRefineSystemPrompt(ctx, outlines, selectedThemes || [], fullHistory);
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: "Generate the refined outline as JSON now." },
  ];

  const result = await callLLMJSON<{ outline: OutlineOption }>(messages, { maxTokens: 1200 });
  if (!result?.outline) {
    return NextResponse.json({ error: "Failed to refine outline" }, { status: 500 });
  }

  return NextResponse.json({ outline: result.outline });
}
