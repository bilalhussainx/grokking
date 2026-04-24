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
      content: `Brainstorm conversation:\n${brainstormSummary}\n\n${themesText}\n\nGenerate EXACTLY 3 outline options as JSON. If you find yourself running out of room, shorten bullet detail — NEVER drop an option.`,
    },
  ];

  // Bumped from 1500 → 3500 → 4500 tokens. The structural-diversity prompt
  // asks for three STRUCTURALLY different forms (vignettes / in-medias-res /
  // braided / letter / cyclical) with varying section counts (3-5) and
  // varying budgets, which is chunkier than the old Hook/Development/
  // Reflection template. 4500 gives enough headroom so the third option
  // never truncates regardless of form mix.
  const result = await callLLMJSON<{ outlines: unknown[] }>(messages, { maxTokens: 4500 });

  if (!result?.outlines || !Array.isArray(result.outlines) || result.outlines.length === 0) {
    return NextResponse.json({ error: "Failed to generate outlines" }, { status: 500 });
  }

  // If the model still returned fewer than 3 options, log so we can catch the
  // pattern but serve what we have — client shows a soft warning when count
  // is below 3.
  if (result.outlines.length < 3) {
    console.warn(
      `[outline/generate] model returned ${result.outlines.length} outlines; expected 3`,
    );
  }

  await db
    .from("cc_essays")
    .update({ phase: "outline", updated_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ outlines: result.outlines });
}
