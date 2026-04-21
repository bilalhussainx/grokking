import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../../helpers";
import { buildEssayContext, getDraftCompareSystemPrompt } from "@/lib/cc/essay-helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

interface CompareResult {
  worksWellByDraft: { label: string; points: string[] }[];
  weakByDraft: { label: string; points: string[] }[];
  mergeSuggestions: string[];
  editPriorities: string[];
  overallNotes: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const { versionIds, includeCurrent } = body as {
    versionIds?: string[];
    includeCurrent?: boolean;
  };

  if (!versionIds?.length && !includeCurrent) {
    return NextResponse.json({ error: "Provide versionIds or includeCurrent" }, { status: 400 });
  }

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_draft_compare");
  if (!ok) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx) return NextResponse.json({ error: "Essay not found" }, { status: 404 });

  const db = createAdminSupabase();
  const drafts: { label: string; content: string; wordCount: number }[] = [];

  if (versionIds?.length) {
    const { data: rows, error } = await db
      .from("cc_essay_drafts")
      .select("id, version_number, label, content, word_count")
      .eq("essay_id", id)
      .in("id", versionIds)
      .order("version_number", { ascending: true });
    if (error) return NextResponse.json({ error: "Failed to load drafts" }, { status: 500 });
    for (const r of rows || []) {
      drafts.push({
        label: r.label || `Draft v${r.version_number}`,
        content: r.content,
        wordCount: r.word_count || r.content.trim().split(/\s+/).filter(Boolean).length,
      });
    }
  }

  if (includeCurrent && ctx.currentDraft?.trim()) {
    drafts.push({
      label: "Current working draft",
      content: ctx.currentDraft,
      wordCount: ctx.currentDraft.trim().split(/\s+/).filter(Boolean).length,
    });
  }

  if (drafts.length < 2) {
    return NextResponse.json(
      { error: "Need at least 2 drafts to compare" },
      { status: 400 },
    );
  }

  const systemPrompt = getDraftCompareSystemPrompt(ctx, drafts);
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: "Produce the comparison JSON now." },
  ];

  const result = await callLLMJSON<CompareResult>(messages, { maxTokens: 1800 });
  if (!result) {
    return NextResponse.json({ error: "Compare failed" }, { status: 500 });
  }

  return NextResponse.json({ comparison: result });
}
