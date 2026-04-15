// SP-7 — holistic fit evaluator.
// Given an applicant profile + activities + a target college persona,
// asks Sonnet (OpenRouter) to produce a structured fit read:
// overall 0-100 score, strengths, gaps, and concrete next-step suggestions.
// Cached by hash of (profileSig + schoolId) so repeat calls don't re-spend tokens.

import crypto from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { COLLEGE_PERSONAS, type CollegePersona } from "@/data/college-interviewer-personas";
import { getCachedDynamicPersona } from "@/lib/dynamic-college-persona";

const MODEL = "anthropic/claude-sonnet-4";

export interface FitReport {
  schoolId: string;
  schoolName: string;
  overallScore: number; // 0-100
  oneLineRead: string;
  strengths: Array<{ title: string; evidence: string }>;
  gaps: Array<{ title: string; why: string; suggestion: string }>;
  nextMoves: string[]; // 3-5 concrete asks
  model: string;
  cached: boolean;
}

interface ApplicantInput {
  profile: {
    intended_major?: string | null;
    top_project_title?: string | null;
    top_project_description?: string | null;
    recent_influence?: string | null;
  } | null;
  activities: Array<{
    title: string;
    role?: string | null;
    category?: string | null;
    description?: string | null;
    hours_per_week?: number | null;
    weeks_per_year?: number | null;
  }>;
  essays: Array<{ prompt?: string | null; body?: string | null; word_target?: number | null }>;
}

function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function profileSignature(input: ApplicantInput): string {
  const profile = input.profile || {};
  const parts = [
    profile.intended_major || "",
    profile.top_project_title || "",
    (profile.top_project_description || "").slice(0, 400),
    profile.recent_influence || "",
    ...input.activities.map((a) => `${a.title}|${a.role || ""}|${a.hours_per_week || ""}`),
    ...input.essays.map((e) => (e.body || "").slice(0, 200)),
  ];
  return sha256(parts.join("::"));
}

async function resolvePersona(
  _supabase: SupabaseClient,
  schoolId: string
): Promise<CollegePersona | null> {
  const staticP = COLLEGE_PERSONAS.find((p) => p.id === schoolId);
  if (staticP) return staticP;
  const dyn = await getCachedDynamicPersona(schoolId);
  return dyn;
}

function buildPrompt(persona: CollegePersona, input: ApplicantInput) {
  const p = input.profile || {};
  const activitiesBlock =
    input.activities.length === 0
      ? "(no activities listed)"
      : input.activities
          .map(
            (a, i) =>
              `${i + 1}. ${a.title}${a.role ? ` — ${a.role}` : ""}${a.category ? ` [${a.category}]` : ""}${
                a.hours_per_week ? ` (${a.hours_per_week}h/wk` : ""
              }${a.weeks_per_year ? `, ${a.weeks_per_year}wks/yr)` : a.hours_per_week ? ")" : ""}${
                a.description ? `\n   ${a.description.slice(0, 280)}` : ""
              }`
          )
          .join("\n");
  const essaysBlock =
    input.essays.length === 0
      ? "(no essay drafts available)"
      : input.essays
          .slice(0, 2)
          .map((e, i) => `Essay ${i + 1} (target ${e.word_target || "?"} words):\nPrompt: ${e.prompt || "(none)"}\n${(e.body || "").slice(0, 1200)}`)
          .join("\n\n");

  return `TARGET SCHOOL: ${persona.fullName || persona.school}
SCHOOL-FIT TOPICS this admissions office actually cares about:
${persona.schoolFitTopics.map((t, i) => `  ${i + 1}. ${t}`).join("\n")}

ANTI-PATTERNS the alumni interviewers flag as weak:
${persona.antiPatterns.map((t, i) => `  ${i + 1}. ${t}`).join("\n")}

APPLICANT PROFILE
  Intended major: ${p.intended_major || "(not set)"}
  Top project: ${p.top_project_title || "(not set)"}
  Project description: ${(p.top_project_description || "").slice(0, 500) || "(not set)"}
  Recent influence: ${p.recent_influence || "(not set)"}

ACTIVITIES
${activitiesBlock}

ESSAY DRAFTS (most recent)
${essaysBlock}`;
}

const SYSTEM_PROMPT = `You are a strict admissions reader evaluating an applicant's *fit* for a specific school.

Ground every claim in the provided text — do NOT invent activities, courses, or details. If something is missing, say so as a gap.

Return ONLY valid JSON matching this schema:
{
  "overallScore": <0-100 integer — how well this applicant's current profile aligns with what the school distinctively values>,
  "oneLineRead": "<one sentence capturing the applicant's fit posture for this school>",
  "strengths": [ { "title": "<short>", "evidence": "<which activity/essay/profile line supports this>" } ],
  "gaps": [ { "title": "<short>", "why": "<what the school values that isn't visible>", "suggestion": "<concrete next step the applicant can take>" } ],
  "nextMoves": [ "<3-5 concrete, sequenced asks — revise X, add Y, practice Z>" ]
}

Be honest. A mismatch is a gap, not an insult. Max 4 strengths, 4 gaps, 5 nextMoves.`;

export async function computeFitReport(
  supabase: SupabaseClient,
  input: ApplicantInput,
  schoolId: string
): Promise<FitReport> {
  const persona = await resolvePersona(supabase, schoolId);
  if (!persona) throw new Error(`Unknown schoolId: ${schoolId}`);

  const sig = profileSignature(input);
  const cacheKey = sha256(`${sig}::${schoolId}`);

  const { data: cached } = await supabase
    .from("college_fit_reports")
    .select("report_json, model")
    .eq("cache_key", cacheKey)
    .maybeSingle();
  if (cached?.report_json) {
    return { ...(cached.report_json as FitReport), cached: true, model: cached.model };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY missing");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://kairoslearn.local/college-fit",
      "X-Title": "KairosLearn fit evaluator",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(persona, input) },
      ],
      temperature: 0.3,
      max_tokens: 1200,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 400)}`);
  }
  const j = await res.json();
  const raw = j?.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw);

  const report: FitReport = {
    schoolId,
    schoolName: persona.fullName || persona.school,
    overallScore: clampScore(parsed.overallScore),
    oneLineRead: String(parsed.oneLineRead || "").slice(0, 300),
    strengths: sanitizeArray(parsed.strengths, 4),
    gaps: sanitizeArray(parsed.gaps, 4),
    nextMoves: (Array.isArray(parsed.nextMoves) ? parsed.nextMoves : [])
      .slice(0, 5)
      .map((m: unknown) => String(m).slice(0, 220)),
    model: MODEL,
    cached: false,
  };

  await supabase
    .from("college_fit_reports")
    .upsert({
      cache_key: cacheKey,
      user_id: (input as unknown as { userId?: string }).userId || null,
      school_id: schoolId,
      report_json: report,
      model: MODEL,
    })
    .select()
    .maybeSingle();

  return report;
}

function clampScore(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function sanitizeArray<T>(v: unknown, max: number): T[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, max).filter((x) => x && typeof x === "object") as T[];
}
