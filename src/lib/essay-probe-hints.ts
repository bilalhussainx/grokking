// SP-2 — pre-flight essay critic pass.
// Extract 3-5 "specific moments the interviewer should probe" from a student's
// essay. Cached by sha256 of the essay body so we don't re-run on every interview start.

import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface ProbeHint {
  moment: string;       // e.g. "the 3am call with his sister"
  question: string;     // e.g. "What did that call change about how you approach family?"
  rationale: string;    // why the interviewer should ask
}

export function hashEssay(body: string): string {
  return createHash("sha256").update(body.trim()).digest("hex");
}

const MODEL = "anthropic/claude-sonnet-4";

export async function extractProbeHints(essayBody: string): Promise<ProbeHint[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || !essayBody.trim()) return [];

  const system = `You are an experienced alumni interviewer. You read college admissions essays and identify the 3-5 most interesting specific moments an interviewer should probe in a conversation.

For each moment: quote the specific image/event/phrase, draft a question that goes one layer deeper than "tell me more about that", and say why probing this would surface authentic depth (vs. rehearsed talking points).

Return ONLY a JSON array. No prose, no markdown.

Shape: [{ "moment": "...", "question": "...", "rationale": "..." }]`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Essay:\n\n${essayBody.slice(0, 8000)}` },
      ],
      temperature: 0.5,
      max_tokens: 800,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) return [];
  const j = await res.json().catch(() => null);
  const raw = j?.choices?.[0]?.message?.content || "";
  try {
    // Model sometimes wraps array in { "hints": [...] } despite instructions.
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed) ? parsed : (parsed.hints || parsed.probes || []);
    return (arr as unknown[])
      .filter((h): h is Record<string, unknown> => typeof h === "object" && h !== null)
      .slice(0, 5)
      .map((h) => ({
        moment: String(h.moment || "").slice(0, 400),
        question: String(h.question || "").slice(0, 400),
        rationale: String(h.rationale || "").slice(0, 400),
      }))
      .filter((h) => h.moment && h.question);
  } catch {
    return [];
  }
}

/**
 * Returns cached hints if present; otherwise extracts + caches + returns.
 * Uses service role when given; falls back to the caller's supabase client
 * (which RLS restricts to SELECT-only for authenticated users).
 */
export async function getOrComputeProbeHints(
  supabase: SupabaseClient,
  userId: string,
  essayBody: string,
  adminSupabase?: SupabaseClient
): Promise<ProbeHint[]> {
  const body = essayBody.trim();
  if (!body) return [];
  const hash = hashEssay(body);

  const { data: cached } = await supabase
    .from("essay_probe_hints")
    .select("hints_json")
    .eq("user_id", userId)
    .eq("essay_hash", hash)
    .maybeSingle();

  if (cached?.hints_json) return cached.hints_json as ProbeHint[];

  const hints = await extractProbeHints(body);
  if (hints.length > 0 && adminSupabase) {
    await adminSupabase
      .from("essay_probe_hints")
      .insert({ user_id: userId, essay_hash: hash, hints_json: hints })
      .then(() => null, () => null);
  }
  return hints;
}
