import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { buildEssayContext, getOutlineSystemPrompt } from "@/lib/cc/essay-helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const body = await req.json();
  const { action, outline, selectedThemes } = body as {
    action: "generate" | "save";
    outline?: Record<string, unknown>;
    selectedThemes?: string[];
  };

  const db = createAdminSupabase();

  if (action === "save" && outline) {
    const { error } = await db
      .from("cc_essays")
      .update({
        outline_json: outline,
        phase: "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to save outline" }, { status: 500 });
    }

    await db.from("cc_essay_interactions").insert({
      essay_id: id,
      turn_type: "outline_save",
      content: JSON.stringify(outline),
    });

    return NextResponse.json({ saved: true });
  }

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_outline");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  const systemPrompt = getOutlineSystemPrompt(ctx);
  const themesText = selectedThemes?.length
    ? `Student chose these themes: ${selectedThemes.join(", ")}`
    : "Use the brainstorm conversation to identify the best themes.";

  const transcript = ctx.brainstormTranscript || [];
  const brainstormSummary = transcript
    .map((t) => `${t.role}: ${t.content}`)
    .join("\n");

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Brainstorm conversation:\n${brainstormSummary}\n\n${themesText}\n\nGenerate 3 outline options as JSON.`,
    },
  ];

  const result = await callLLMJSON<{ outlines: unknown[] }>(messages, { maxTokens: 1500 });

  if (!result?.outlines) {
    return NextResponse.json({ error: "Failed to generate outlines" }, { status: 500 });
  }

  await db
    .from("cc_essays")
    .update({ phase: "outline", updated_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ outlines: result.outlines });
}
