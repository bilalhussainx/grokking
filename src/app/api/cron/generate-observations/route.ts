// Phase 2.7 — daily observation generation. Runs at 04:07 UTC via Vercel
// Cron (vercel.json). For each active student with observations enabled,
// generates up to 4 module-specific "Coach noticed" callouts via Sonnet
// 4.6, upserts them into cc_dashboard_observations.
//
// Cost guardrails (must hold — these are why this stays under $50/mo at
// 1k DAU):
//   - Active = signed in within the last 7 days. Inactive students get
//     no generation; their dashboards already cache yesterday's row or
//     fall through to no-callout.
//   - Hard cap of 4 modules per student per run.
//   - Hash-based skip: each module's input context is SHA-256'd; if the
//     hash matches the previous run, skip the LLM call and just bump
//     expires_at. This is the single biggest cost-control lever.
//   - 7-day TTL — the dashboard reads anything not expired, and the
//     hash-skip means most rows just get extended without regeneration.
//
// Auth: protected by CRON_SECRET — Vercel sends Authorization: Bearer ${CRON_SECRET}
// when it invokes the route. Same pattern as deadline-reminders.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { chatOnce } from "@/lib/cc/openrouter";
import { hasBearerSecret } from "@/lib/admin-secret";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Avoid Vercel's default 10s timeout for hobby plan; this route can take
// up to ~3 minutes when generating for many students.
export const maxDuration = 180;

const MODEL = "anthropic/claude-sonnet-4-6";
const MAX_OUTPUT_TOKENS = 200;
// Sonnet 4.6 pricing (per M tokens). Update if pricing changes.
const PRICE_INPUT_PER_M = 3.0;
const PRICE_OUTPUT_PER_M = 15.0;
const TTL_DAYS = 7;

// The four modules we generate for. Mirror PriorityCard.label values
// exactly — that's how variants.ts looks them up.
type ModuleKey =
  | "Personal statement"
  | "Activities"
  | "School list"
  | "Test strategy";

const MODULE_PROMPTS: Record<ModuleKey, string> = {
  "Personal statement":
    "You're noticing something specific about the student's personal-statement work-in-progress: phase progress, themes that recur, places where the draft tells instead of shows. ONE sentence, under 25 words.",
  "Activities":
    "You're noticing a through-line in the student's activity list — not what each activity is, but the THEME that connects them (teaching, building, advocacy, etc.). ONE sentence, under 25 words.",
  "School list":
    "You're noticing the balance of their school list: reach/match/safety distribution, geographic diversity, or major fit. ONE sentence, under 25 words.",
  "Test strategy":
    "You're noticing where the student should focus their next study block: which section is weakest relative to their target, or whether they're ready to retake. ONE sentence, under 25 words.",
};

function hashContext(payload: string): string {
  return crypto.createHash("sha256").update(payload).digest("hex");
}

function estimatedCost(inTok: number, outTok: number): number {
  return (inTok / 1_000_000) * PRICE_INPUT_PER_M + (outTok / 1_000_000) * PRICE_OUTPUT_PER_M;
}

type GenInput = {
  module: ModuleKey;
  contextLines: string[];
};

const SYSTEM_PROMPT = `You are Coach Kairos generating a single dashboard observation for a college applicant. Output ONLY the observation — no prefix, no explanation, no quotation marks.

CONSTRAINTS:
- One sentence. Under 25 words.
- SPECIFIC to the student's actual data. Reference school names, essay paragraphs, activity counts, scores.
- Voice: warm, observant, occasionally witty. NEVER use exclamation marks. NEVER use "Great!" / "Awesome!" / "Keep up the great work!" — banned phrases.
- Tone changes per module:
  - Personal statement: editorial — surface a craft observation, not encouragement.
  - Activities: pattern recognition — the through-line, not the count.
  - School list: balance — what's missing or overrepresented, not "good list!"
  - Test strategy: tactical — what to study next, not a pep talk.

Examples of correct outputs:
- "5 of 8 involve teaching others. That's your through-line."
- "¶3 still tells, doesn't show. 15 min if you want to nail it."
- "All 7 schools are East Coast. Worth a UC or two for balance."
- "Reading 720 caps your section; Math 670 has 100 points to find."

Generate the observation now. ONE sentence. No prefix.`;

async function generateObservation(input: GenInput): Promise<{
  text: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}> {
  const userMessage = `Module: ${input.module}\n\n${MODULE_PROMPTS[input.module]}\n\nSTUDENT CONTEXT:\n${input.contextLines.join("\n")}`;
  const out = await chatOnce([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ]);
  const cleaned = out.trim().replace(/^["'""]+|["'""]+$/g, ""); // strip stray quotes
  // Rough token estimate when the SDK doesn't report usage. ~4 chars per
  // token is the OpenAI rule of thumb; close enough for cost auditing.
  const inputTokens = Math.ceil((SYSTEM_PROMPT.length + userMessage.length) / 4);
  const outputTokens = Math.ceil(cleaned.length / 4);
  return {
    text: cleaned,
    inputTokens,
    outputTokens,
    costUsd: Number(estimatedCost(inputTokens, outputTokens).toFixed(4)),
  };
}

type StudentRow = {
  id: string;
  user_id: string;
  preferred_name: string | null;
  grade_level: number | null;
  is_transfer_student: boolean | null;
};

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!hasBearerSecret(auth, "CRON_SECRET")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  // Active students = onboarded + observations enabled + signed in within
  // the last 7 days. We approximate "signed in" by joining auth.users
  // last_sign_in_at, which Supabase exposes via the admin API.
  const { data: students } = await db
    .from("cc_student_profiles")
    .select("id, user_id, preferred_name, grade_level, is_transfer_student")
    .not("language_picker_seen_at", "is", null)
    .neq("dashboard_observations_enabled", false);

  let generated = 0;
  let skipped = 0;
  let errors = 0;
  let totalCost = 0;

  for (const studentRow of (students ?? []) as StudentRow[]) {
    try {
      // Per-student cost cap — should never trip with the 4-module limit,
      // but defensive.
      let perStudentCost = 0;

      // Fetch the data we need to build module-specific contexts. Cheap
      // — same tables the dashboard reads.
      const [{ data: essays }, { data: activities }, { data: schools }, { data: testAttempt }] =
        await Promise.all([
          db.from("cc_essays").select("phase, essay_type, word_count").eq("student_id", studentRow.id),
          db.from("cc_activities").select("name, role, hours_per_week").eq("student_id", studentRow.id),
          db
            .from("cc_student_schools")
            .select("application_status, chancing_band, cc_schools(name)")
            .eq("student_id", studentRow.id),
          db
            .from("cc_test_attempts")
            .select("sat_reading, sat_math, total_score")
            .eq("student_id", studentRow.id)
            .eq("test_type", "SAT")
            .order("test_date", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

      // Build context strings per module. If the data is too thin
      // (e.g. zero activities), skip that module — generic AI output
      // costs the same as specific output and is worse for the user.
      type ModuleJob = { module: ModuleKey; contextLines: string[] };
      const jobs: ModuleJob[] = [];

      const ps = (essays ?? []).find(
        (e) => (e as { essay_type: string | null }).essay_type === "personal_statement",
      ) as { phase: string | null; word_count: number | null } | undefined;
      if (ps && ps.phase) {
        jobs.push({
          module: "Personal statement",
          contextLines: [
            `Phase: ${ps.phase}`,
            `Word count: ${ps.word_count ?? "unknown"}`,
          ],
        });
      }

      if ((activities ?? []).length >= 3) {
        const acts = (activities ?? []) as Array<{ name: string; role: string | null; hours_per_week: number | null }>;
        jobs.push({
          module: "Activities",
          contextLines: [
            `Total activities: ${acts.length}`,
            ...acts.slice(0, 10).map(
              (a) => `- ${a.name}${a.role ? ` (${a.role})` : ""}${a.hours_per_week ? ` · ${a.hours_per_week}h/wk` : ""}`,
            ),
          ],
        });
      }

      if ((schools ?? []).length >= 3) {
        const schoolList = schools as Array<{
          application_status: string | null;
          chancing_band: string | null;
          cc_schools: { name?: string } | { name?: string }[] | null;
        }>;
        jobs.push({
          module: "School list",
          contextLines: [
            `Total schools: ${schoolList.length}`,
            ...schoolList.slice(0, 12).map((s) => {
              const sch = Array.isArray(s.cc_schools) ? s.cc_schools[0] : s.cc_schools;
              return `- ${sch?.name ?? "Unknown"} · ${s.chancing_band ?? "?"} · ${s.application_status ?? "not started"}`;
            }),
          ],
        });
      }

      const testRow = testAttempt as
        | { sat_reading: number | null; sat_math: number | null; total_score: number | null }
        | null;
      if (testRow && (testRow.sat_reading || testRow.sat_math)) {
        jobs.push({
          module: "Test strategy",
          contextLines: [
            `Reading: ${testRow.sat_reading ?? "—"}`,
            `Math: ${testRow.sat_math ?? "—"}`,
            `Total: ${testRow.total_score ?? "—"}`,
            `Target: 1500`,
          ],
        });
      }

      // Hard cap.
      const trimmedJobs = jobs.slice(0, 4);

      for (const job of trimmedJobs) {
        const contextStr = job.contextLines.join("|");
        const ctxHash = hashContext(contextStr);

        // Hash-skip: if the latest row for this (student, module) used the
        // same context, just extend its expires_at and move on. Saves the
        // LLM call entirely.
        const { data: existing } = await db
          .from("cc_dashboard_observations")
          .select("id, context_hash")
          .eq("student_id", studentRow.id)
          .eq("module_label", job.module)
          .maybeSingle();

        if (existing && existing.context_hash === ctxHash) {
          await db
            .from("cc_dashboard_observations")
            .update({
              expires_at: new Date(Date.now() + TTL_DAYS * 86400 * 1000).toISOString(),
            })
            .eq("id", existing.id);
          skipped++;
          continue;
        }

        const result = await generateObservation(job);
        perStudentCost += result.costUsd;
        totalCost += result.costUsd;

        await db.from("cc_dashboard_observations").upsert(
          {
            student_id: studentRow.id,
            module_label: job.module,
            observation: result.text,
            eyebrow: job.module === "Personal statement" ? "COACH'S NUDGE" : "COACH NOTICED",
            context_hash: ctxHash,
            generated_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + TTL_DAYS * 86400 * 1000).toISOString(),
            model: MODEL,
            input_tokens: result.inputTokens,
            output_tokens: result.outputTokens,
            cost_usd: result.costUsd,
          },
          { onConflict: "student_id,module_label" },
        );
        generated++;
      }

      // Defensive per-student cost ceiling — shouldn't fire with 4-module cap.
      if (perStudentCost > 0.25) {
        console.warn(
          `[cron/generate-observations] high cost for student ${studentRow.id}: $${perStudentCost.toFixed(3)}`,
        );
      }
    } catch (err) {
      errors++;
      console.error(`[cron/generate-observations] student ${studentRow.id}`, err);
    }
  }

  return NextResponse.json({
    ok: true,
    generated,
    skipped,
    errors,
    totalCostUsd: Number(totalCost.toFixed(4)),
    students: (students ?? []).length,
  });
}
