// Synthetic drift test for the per-variant coach prompts.
//
// We just shipped the variant guidance block on 2026-05-01 (commit fa62c13).
// Real-conversation auditing has to wait for a week of usage. But we can
// validate the *system* immediately: build the actual system prompt for
// each variant, send a drift-bait user message to OpenRouter, and check
// whether the model stays inside the variant's boundaries.
//
// Run:  npx tsx -r dotenv/config scripts/test-variant-drift.ts dotenv_config_path=.env.local
//
// Output: a markdown report at docs/reports/variant-drift-synthetic-<date>.md
// plus a console summary table.
//
// Cost note: 7 variants × 5 prompts = 35 LLM calls @ Sonnet 4.6, ~700 input
// tokens + ~250 output tokens each. About $0.40 total per run.

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import {
  buildSystemPrompt,
  type CoachContext,
  type DashboardVariantKey,
} from "../src/lib/cc/coach-prompt-builder";

type DriftCheck = {
  // Phrases the assistant SHOULD use (variant-aligned answer).
  expect: RegExp[];
  // Phrases the assistant SHOULD NOT use (drift signal).
  avoid: RegExp[];
};

type ProbeCase = {
  name: string;
  message: string;
  // Per-variant expected behavior. Variants not listed are skipped.
  byVariant: Partial<Record<DashboardVariantKey, DriftCheck>>;
};

const VARIANTS: DashboardVariantKey[] = [
  "g9",
  "g10",
  "junior",
  "senior_writing",
  "senior_post_submit",
  "senior_decisions",
  "transfer",
];

// Drift-bait probes. Each tries to lure the model out of the variant's lane.
const PROBES: ProbeCase[] = [
  {
    name: "draft_personal_statement",
    message:
      "I want to start drafting my Common App personal statement this week. Can you help me brainstorm topics and write a first draft?",
    byVariant: {
      g9: {
        expect: [/grade 9|too early|four years|junior|senior/i, /club|course|summer|rigor/i],
        avoid: [/let'?s draft|first draft|write the essay|350 words/i],
      },
      g10: {
        expect: [/too early|grade 10|junior|senior/i],
        avoid: [/let'?s draft|first draft|write the essay/i],
      },
      junior: {
        expect: [/brainstorm|outline|raw material|no draft|drafting starts senior/i],
        avoid: [/here'?s a first draft|let me write your essay/i],
      },
      senior_writing: {
        // Senior writing IS the time — drafting is fine.
        expect: [/topic|brainstorm|outline|draft/i],
        avoid: [],
      },
    },
  },
  {
    name: "sat_prep_strategy",
    message: "What's the best SAT prep strategy I should follow right now?",
    byVariant: {
      g9: {
        expect: [/grade 9|too early|psat 10|grade 10|grade 11/i],
        avoid: [/practice tests|khan academy now|study plan|aim for 1500/i],
      },
      g10: {
        expect: [/psat 10|october|diagnostic/i],
        avoid: [/full-length practice tests now|grade 12 strategy/i],
      },
      junior: {
        // Junior should engage — testing is on the path.
        expect: [/diagnostic|test plan|sat|act/i],
        avoid: [],
      },
    },
  },
  {
    name: "supplement_essays",
    message: "Can you help me start writing supplements for MIT, Harvard, and Stanford?",
    byVariant: {
      g9: {
        expect: [/grade 9|too early|junior|senior|locked/i],
        avoid: [/let'?s start with mit|here'?s a supplement|first supplement/i],
      },
      g10: {
        expect: [/too early|grade 12|senior fall/i],
        avoid: [/let'?s start with mit|here'?s a supplement/i],
      },
      junior: {
        // Junior summer pre-drafts ARE in the path, but only for top schools after the list is real.
        expect: [/summer|outline|after.+school list|junior/i],
        avoid: [/let'?s draft your mit supplement now/i],
      },
      transfer: {
        expect: [/why-transfer|professor rec|transfer/i],
        avoid: [/first-year|common app personal statement/i],
      },
    },
  },
  {
    name: "transfer_first_year_strategy",
    message: "Should I write my essay about my high school robotics team and my parents' influence?",
    byVariant: {
      transfer: {
        expect: [/why-transfer|inflection|college|don'?t (carry|apply)/i],
        avoid: [/great topic for your common app|that'?s a strong personal statement angle/i],
      },
      senior_writing: {
        // Senior may engage with the topic critique, that's fine.
        expect: [/topic|angle|story/i],
        avoid: [],
      },
    },
  },
  {
    name: "post_submit_panic",
    message:
      "I already submitted my applications but I'm panicking. Can I update my essays or add more schools to my list now?",
    byVariant: {
      senior_post_submit: {
        expect: [/already (submitted|in)|can'?t (re-?open|change)|wait|demonstrated interest|interview/i],
        avoid: [/let'?s rewrite|here'?s a new essay|adding stanford/i],
      },
      senior_decisions: {
        expect: [/decisions|aid|deposit|may 1/i],
        avoid: [/let'?s add new schools|rewrite your essay/i],
      },
    },
  },
];

// Build a baseline CoachContext for a variant. Uses minimal, non-drift-prone
// values so the variant guidance is the only thing steering behavior.
function baseContextFor(variant: DashboardVariantKey): CoachContext {
  const grade =
    variant === "g9" ? 9 :
    variant === "g10" ? 10 :
    variant === "junior" ? 11 :
    variant === "transfer" ? null :
    12;
  return {
    mode: "general",
    studentName: "Sam",
    grade,
    country: "US",
    state: "CA",
    isInternational: false,
    isFirstGen: false,
    gpaUnweighted: 3.7,
    gpaRawDisplay: null,
    testStrategy: null,
    satTotal: null,
    actComposite: null,
    schoolCount: 0,
    schoolSummary: "",
    hasIntakeCompleted: true,
    hasGPA: true,
    hasSchools: false,
    hasEssays: false,
    hasEssayReviewed: false,
    hasActivitiesOptimized: false,
    hasSupplementsStarted: false,
    hasInterviewSessions: false,
    latestEssayReview: null,
    preferences: null,
    focusEssay: null,
    applicationSnapshot: null,
    affordabilityValue: null,
    needsFullAid: false,
    variantKey: variant,
  };
}

async function callOpenRouter(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set in .env.local");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://kairoslearn.com",
      "X-Title": "Coach Kairos · variant drift test",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4-6",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 400,
      temperature: 0.7,
      stream: false,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.choices?.[0]?.message?.content as string | undefined) ?? "";
}

type Result = {
  variant: DashboardVariantKey;
  probe: string;
  message: string;
  response: string;
  expectHits: number;
  expectTotal: number;
  avoidHits: string[]; // patterns that triggered (drift)
  verdict: "pass" | "weak" | "drift";
};

function score(response: string, check: DriftCheck): Pick<Result, "expectHits" | "expectTotal" | "avoidHits" | "verdict"> {
  const expectHits = check.expect.filter((r) => r.test(response)).length;
  const expectTotal = check.expect.length;
  const avoidHits = check.avoid.filter((r) => r.test(response)).map((r) => r.source);

  let verdict: Result["verdict"];
  if (avoidHits.length > 0) verdict = "drift";
  else if (expectTotal === 0 || expectHits === expectTotal) verdict = "pass";
  else verdict = "weak";

  return { expectHits, expectTotal, avoidHits, verdict };
}

async function main() {
  const startedAt = new Date();
  console.log(`Starting variant drift synthetic test at ${startedAt.toISOString()}`);
  console.log(`Variants: ${VARIANTS.length} · Probes: ${PROBES.length}\n`);

  const results: Result[] = [];

  for (const variant of VARIANTS) {
    const ctx = baseContextFor(variant);
    const systemPrompt = buildSystemPrompt(ctx);

    for (const probe of PROBES) {
      const check = probe.byVariant[variant];
      if (!check) continue; // probe doesn't apply to this variant

      process.stdout.write(`  [${variant}] ${probe.name} ... `);
      let response = "";
      try {
        response = await callOpenRouter(systemPrompt, probe.message);
      } catch (err) {
        console.log(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
        continue;
      }

      const scored = score(response, check);
      results.push({ variant, probe: probe.name, message: probe.message, response, ...scored });
      console.log(scored.verdict.toUpperCase());
    }
  }

  // Console summary
  console.log("\n==================================================");
  console.log("SUMMARY");
  console.log("==================================================");
  const byVariant = new Map<string, { pass: number; weak: number; drift: number; total: number }>();
  for (const r of results) {
    const cur = byVariant.get(r.variant) ?? { pass: 0, weak: 0, drift: 0, total: 0 };
    cur[r.verdict]++;
    cur.total++;
    byVariant.set(r.variant, cur);
  }
  for (const [variant, counts] of byVariant) {
    const driftRate = counts.total === 0 ? 0 : (counts.drift / counts.total) * 100;
    console.log(
      `  ${variant.padEnd(20)} pass:${counts.pass}  weak:${counts.weak}  drift:${counts.drift}  (drift ${driftRate.toFixed(0)}%)`,
    );
  }

  // Markdown report
  const today = startedAt.toISOString().slice(0, 10);
  const reportDir = path.join(process.cwd(), "docs", "reports");
  if (!existsSync(reportDir)) mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, `variant-drift-synthetic-${today}.md`);

  const lines: string[] = [];
  lines.push(`# Coach Kairos variant drift — synthetic test\n`);
  lines.push(`**Run at:** ${startedAt.toISOString()}`);
  lines.push(`**Model:** anthropic/claude-sonnet-4-6 via OpenRouter`);
  lines.push(`**Probes per variant:** designed to lure the model out of the variant's lane`);
  lines.push("");
  lines.push(`## Summary`);
  lines.push("");
  lines.push("| Variant | Pass | Weak | Drift | Drift % |");
  lines.push("|---|---:|---:|---:|---:|");
  for (const [variant, counts] of byVariant) {
    const driftRate = counts.total === 0 ? 0 : (counts.drift / counts.total) * 100;
    lines.push(
      `| \`${variant}\` | ${counts.pass} | ${counts.weak} | ${counts.drift} | ${driftRate.toFixed(0)}% |`,
    );
  }
  lines.push("");
  lines.push(`## Verdicts per probe`);
  lines.push("");
  for (const r of results) {
    lines.push(`### ${r.variant} · ${r.probe} → **${r.verdict.toUpperCase()}**`);
    lines.push("");
    lines.push(`**User:** ${r.message}`);
    lines.push("");
    lines.push(`**Coach (sample):** ${r.response.slice(0, 600)}${r.response.length > 600 ? "…" : ""}`);
    lines.push("");
    if (r.avoidHits.length) {
      lines.push(`**Drift signals matched:** ${r.avoidHits.map((s) => `\`${s}\``).join(", ")}`);
      lines.push("");
    }
    if (r.verdict === "weak") {
      lines.push(`**Weak match:** expected ${r.expectTotal} alignment phrases, got ${r.expectHits}.`);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }
  lines.push(`## Caveats\n`);
  lines.push("- Synthetic. The real signal comes from production conversations.");
  lines.push("- The avoid/expect regexes are heuristics — a passing score isn't proof of correctness.");
  lines.push("- Sonnet 4.6 is non-deterministic. Re-run for variance.");

  writeFileSync(reportPath, lines.join("\n"), "utf8");
  console.log(`\nReport written: ${path.relative(process.cwd(), reportPath)}\n`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
