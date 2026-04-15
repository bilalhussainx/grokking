#!/usr/bin/env node
// Visual verification for SP acceptance criteria.
//
// Reads every `tests/sp-verify/criteria/SP-*.json`, pairs it with screenshots
// captured by the matching `SP-*.spec.ts`, sends the bundle to OpenRouter Sonnet
// (vision), and writes `tests/sp-verify/report.md` with pass/fail per criterion.
//
// Usage:
//   1) npx playwright test --config=playwright.sp-verify.config.ts
//   2) node scripts/verify-sp-screenshots.mjs
//
// Env:
//   OPENROUTER_API_KEY       required (same key Coach Alex uses)
//   SP_VERIFY_MODEL          optional — defaults to anthropic/claude-sonnet-4
//   SP_VERIFY_ONLY=SP-16     optional — limit to one SP id
//
// Output: tests/sp-verify/report.md + per-SP JSON verdicts in tests/sp-verify/verdicts/.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CRITERIA_DIR = path.join(ROOT, "tests", "sp-verify", "criteria");
const SCREENSHOT_DIR = path.join(ROOT, "tests", "sp-verify", "screenshots");
const VERDICT_DIR = path.join(ROOT, "tests", "sp-verify", "verdicts");
const REPORT_PATH = path.join(ROOT, "tests", "sp-verify", "report.md");

const MODEL = process.env.SP_VERIFY_MODEL || "anthropic/claude-sonnet-4";
const API_KEY = process.env.OPENROUTER_API_KEY;
const ONLY = process.env.SP_VERIFY_ONLY;

if (!API_KEY) {
  console.error("Missing OPENROUTER_API_KEY in environment.");
  process.exit(1);
}

fs.mkdirSync(VERDICT_DIR, { recursive: true });

const SYSTEM_PROMPT = `You are a QA reviewer auditing a Next.js app against explicit acceptance criteria for one Super-Project (SP) item.

You will receive:
  1. The SP id, name, and spec reference.
  2. A numbered list of acceptance criteria (MUST pass).
  3. A numbered list of anti-patterns (MUST NOT be visible).
  4. One or more screenshots with their step labels.

For each acceptance criterion, decide PASS / FAIL / UNCLEAR with a 1-sentence justification citing what you can see in the screenshots. For each anti-pattern, decide ABSENT / PRESENT / UNCLEAR.

Be strict. Do not accept vague evidence. If a screenshot does not show the feature, mark UNCLEAR and say which screenshot would be needed.

Return ONLY a JSON object matching this schema:

{
  "sp": "SP-XX",
  "overall": "pass" | "fail" | "partial",
  "summary": "2-3 sentence overall read",
  "criteria": [
    { "id": 1, "text": "<copy of criterion>", "verdict": "pass" | "fail" | "unclear", "evidence": "<what you saw>" }
  ],
  "antiPatterns": [
    { "id": 1, "text": "<copy>", "verdict": "absent" | "present" | "unclear", "evidence": "<what you saw>" }
  ],
  "missingScreenshots": ["description of any additional screenshot that would have clarified an UNCLEAR verdict"]
}`;

function loadCriteria() {
  const files = fs.readdirSync(CRITERIA_DIR).filter((f) => f.startsWith("SP-") && f.endsWith(".json"));
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(CRITERIA_DIR, f), "utf-8")))
    .filter((c) => !ONLY || c.sp === ONLY);
}

function collectScreenshots(spId) {
  const dir = path.join(SCREENSHOT_DIR, spId);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".png"))
    .map((f) => {
      const metaPath = path.join(dir, f.replace(/\.png$/, ".meta.json"));
      const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, "utf-8")) : {};
      const bytes = fs.readFileSync(path.join(dir, f));
      return {
        filename: f,
        step: meta.step || f.replace(/\.png$/, ""),
        url: meta.url || null,
        annotation: meta.annotation || null,
        dataUrl: `data:image/png;base64,${bytes.toString("base64")}`,
      };
    });
}

function buildUserMessage(criteria, screenshots) {
  const parts = [];
  const criteriaList = (criteria.acceptanceCriteria || [])
    .map((c, i) => `${i + 1}. ${c}`)
    .join("\n");
  const antiList = (criteria.antiPatterns || [])
    .map((c, i) => `${i + 1}. ${c}`)
    .join("\n");

  parts.push({
    type: "text",
    text: `SP: ${criteria.sp}
Name: ${criteria.name}
Spec: ${criteria.specRef}

ACCEPTANCE CRITERIA (must pass):
${criteriaList}

ANTI-PATTERNS (must be absent):
${antiList}

SCREENSHOTS (${screenshots.length}):
${screenshots.map((s, i) => `${i + 1}. step="${s.step}" url="${s.url || "n/a"}" annotation="${s.annotation || ""}"`).join("\n")}

Judge each criterion and anti-pattern strictly. Return JSON only.`,
  });

  for (const s of screenshots) {
    parts.push({ type: "text", text: `--- screenshot: ${s.step} ---` });
    parts.push({ type: "image_url", image_url: { url: s.dataUrl } });
  }

  return parts;
}

async function review(criteria, screenshots) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "HTTP-Referer": "https://kairoslearn.local/sp-verify",
      "X-Title": "KairosLearn SP verify",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserMessage(criteria, screenshots) },
      ],
      temperature: 0.1,
      max_tokens: 2500,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 400)}`);
  }
  const j = await res.json();
  const raw = j?.choices?.[0]?.message?.content || "";
  try {
    return JSON.parse(raw);
  } catch {
    return { sp: criteria.sp, overall: "fail", summary: "Model returned non-JSON.", raw };
  }
}

function verdictIcon(v) {
  return v === "pass" || v === "absent" ? "✅" : v === "fail" || v === "present" ? "❌" : "❓";
}

function renderReport(all) {
  const lines = [];
  lines.push("# SP visual-verify report");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Model: ${MODEL}`);
  lines.push("");
  lines.push("| SP | Overall | Criteria pass/total | Anti-patterns absent |");
  lines.push("|----|---------|---------------------|----------------------|");
  for (const v of all) {
    const critPass = (v.criteria || []).filter((c) => c.verdict === "pass").length;
    const critTotal = (v.criteria || []).length;
    const antiAbsent = (v.antiPatterns || []).filter((a) => a.verdict === "absent").length;
    const antiTotal = (v.antiPatterns || []).length;
    lines.push(
      `| ${v.sp} | ${verdictIcon(v.overall)} ${v.overall} | ${critPass}/${critTotal} | ${antiAbsent}/${antiTotal} |`
    );
  }
  lines.push("");
  for (const v of all) {
    lines.push(`## ${v.sp} — ${v.overall}`);
    lines.push(v.summary || "");
    lines.push("");
    lines.push("### Criteria");
    for (const c of v.criteria || []) {
      lines.push(`- ${verdictIcon(c.verdict)} **${c.verdict}** — ${c.text}`);
      if (c.evidence) lines.push(`  - ${c.evidence}`);
    }
    if ((v.antiPatterns || []).length) {
      lines.push("");
      lines.push("### Anti-patterns");
      for (const a of v.antiPatterns) {
        lines.push(`- ${verdictIcon(a.verdict)} **${a.verdict}** — ${a.text}`);
        if (a.evidence) lines.push(`  - ${a.evidence}`);
      }
    }
    if ((v.missingScreenshots || []).length) {
      lines.push("");
      lines.push("### Missing screenshots (would sharpen UNCLEAR verdicts)");
      for (const m of v.missingScreenshots) lines.push(`- ${m}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

async function main() {
  const criteria = loadCriteria();
  if (!criteria.length) {
    console.error(`No criteria files found in ${CRITERIA_DIR}`);
    process.exit(1);
  }

  const verdicts = [];
  for (const c of criteria) {
    const shots = collectScreenshots(c.sp);
    if (!shots.length) {
      const v = {
        sp: c.sp,
        overall: "unclear",
        summary: "No screenshots captured. Run `npx playwright test --config=playwright.sp-verify.config.ts` first.",
        criteria: (c.acceptanceCriteria || []).map((text, i) => ({
          id: i + 1,
          text,
          verdict: "unclear",
          evidence: "no screenshot",
        })),
        antiPatterns: (c.antiPatterns || []).map((text, i) => ({
          id: i + 1,
          text,
          verdict: "unclear",
          evidence: "no screenshot",
        })),
      };
      verdicts.push(v);
      console.log(`${c.sp}: skipped (no screenshots)`);
      continue;
    }
    console.log(`${c.sp}: reviewing ${shots.length} screenshot(s)…`);
    try {
      const v = await review(c, shots);
      v.sp = v.sp || c.sp;
      verdicts.push(v);
      fs.writeFileSync(path.join(VERDICT_DIR, `${c.sp}.json`), JSON.stringify(v, null, 2));
      console.log(`  → ${v.overall}`);
    } catch (e) {
      console.error(`  ! ${c.sp} review failed: ${e.message}`);
      verdicts.push({ sp: c.sp, overall: "fail", summary: `Review failed: ${e.message}` });
    }
  }

  fs.writeFileSync(REPORT_PATH, renderReport(verdicts));
  console.log(`\nReport written to ${REPORT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
