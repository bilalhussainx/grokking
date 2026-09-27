import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { buildEssayContext, getOutlineSystemPrompt } from "@/lib/cc/essay-helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, addCredits, CREDIT_COSTS } from "@/lib/credits";
import { getOwnedEssay } from "@/lib/cc/ownership";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const body = await req.json();
  const { action, outline, selectedThemes } = body as {
    action: "generate" | "save" | "themes";
    outline?: Record<string, unknown>;
    selectedThemes?: string[];
  };

  const db = createAdminSupabase();

  // The student picked themes in Brainstorm: move to Outline and remember the
  // pick, so a reload doesn't send them back to Brainstorm.
  if (action === "themes") {
    const owned = await getOwnedEssay(db, auth.user.id, id);
    if (!owned) {
      return NextResponse.json({ error: "Essay not found" }, { status: 404 });
    }
    const themes = (selectedThemes ?? []).filter((t) => typeof t === "string" && t.trim()).slice(0, 10);
    await db.from("cc_essays").update({ phase: "outline", updated_at: new Date().toISOString() }).eq("id", owned.id);
    await db.from("cc_essay_interactions").insert({
      essay_id: owned.id,
      turn_type: "themes_selected",
      content: JSON.stringify(themes),
    });
    return NextResponse.json({ saved: true });
  }

  if (action === "save" && outline) {
    const owned = await getOwnedEssay(db, auth.user.id, id);
    if (!owned) {
      return NextResponse.json({ error: "Essay not found" }, { status: 404 });
    }

    const { error } = await db
      .from("cc_essays")
      .update({
        outline_json: outline,
        phase: "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", owned.id)
      .eq("student_id", owned.student_id);

    if (error) {
      return NextResponse.json({ error: "Failed to save outline" }, { status: 500 });
    }

    await db.from("cc_essay_interactions").insert({
      essay_id: owned.id,
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
  const result = await callLLMJSON<{ outlines: unknown[] }>(messages, { maxTokens: 4500, label: "outline", jsonMode: true });

  if (!result?.outlines || !Array.isArray(result.outlines) || result.outlines.length === 0) {
    // The student was charged before the model call; don't keep the credit
    // for a failed generation. callLLMJSON has already logged why it failed.
    await addCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_outline_refund");
    return NextResponse.json(
      {
        error: "Outline generation is temporarily unavailable. Your credit was refunded; please try again in a moment.",
        retryable: true,
      },
      { status: 503 },
    );
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

  // Keep the options the student paid a credit for; GET serves them back.
  await db.from("cc_essay_interactions").insert({
    essay_id: id,
    turn_type: "outline_options",
    content: JSON.stringify({ themes: selectedThemes ?? [], outlines: result.outlines }),
  });

  return NextResponse.json({ outlines: result.outlines });
}

// The latest chosen themes and generated outline options for this essay, so
// the Outline phase can be restored after a reload.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;
  const db = createAdminSupabase();
  const owned = await getOwnedEssay(db, auth.user.id, id);
  if (!owned) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  const latest = async (turnType: string) => {
    const { data } = await db
      .from("cc_essay_interactions")
      .select("content, timestamp")
      .eq("essay_id", owned.id)
      .eq("turn_type", turnType)
      .order("timestamp", { ascending: false })
      .limit(1);
    const raw = (data as { content: string | null }[] | null)?.[0]?.content;
    if (!raw) return null;
    try { return JSON.parse(raw) as unknown; } catch { return null; }
  };

  const [themesRaw, optionsRaw] = await Promise.all([latest("themes_selected"), latest("outline_options")]);
  const options = (optionsRaw ?? null) as { themes?: unknown; outlines?: unknown } | null;
  const themes = Array.isArray(themesRaw) ? themesRaw : Array.isArray(options?.themes) ? options.themes : [];
  const outlines = Array.isArray(options?.outlines) ? options.outlines : [];
  return NextResponse.json({ themes, outlines });
}
