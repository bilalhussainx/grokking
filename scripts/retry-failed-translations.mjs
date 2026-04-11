#!/usr/bin/env node
/**
 * retry-failed-translations.mjs
 *
 * Reads 025_seed_problems_translated.sql, finds problems whose Java
 * solution is still a "// TODO: Implement Java solution" stub, and
 * re-translates them with smaller batch size + higher token limit.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Load env
const envPath = path.join(ROOT, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) {
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[match[1]] = value;
    }
  }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY');
  process.exit(1);
}

const SQL_PATH = path.join(ROOT, 'supabase/migrations/025_seed_problems_translated.sql');
const OUTPUT_PATH = path.join(ROOT, 'supabase/migrations/025_seed_problems_translated.sql');

// ─── Parse problems ──────────────────────────────────────────────────
function parseSqlProblems(sql) {
  const blocks = sql.split(/(?=INSERT INTO interview_problems)/);
  const header = blocks[0];
  const problems = [];

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];

    const slugMatch = block.match(/VALUES\s*\(\s*'([^']+)'/);
    const slug = slugMatch ? slugMatch[1] : `unknown-${i}`;

    const fnNameMatch = block.match(/'::jsonb,\s*\n\s*'([a-z_]+)',\s*\n\s*E'/);
    const functionName = fnNameMatch ? fnNameMatch[1] : null;

    const eStrings = [];
    const eStringRegex = /E'((?:[^'\\]|\\.|'')*?)'/g;
    let m;
    while ((m = eStringRegex.exec(block)) !== null) {
      eStrings.push(m[1]);
    }

    if (eStrings.length >= 5) {
      const isJavaStub = eStrings[3].includes('TODO: Implement Java solution');
      problems.push({
        index: i,
        slug,
        functionName,
        starterPython: eStrings[0],
        solutionPython: eStrings[1],
        starterJava: eStrings[2],
        solutionJava: eStrings[3],
        starterJs: eStrings[4],
        rawBlock: block,
        needsRetry: isJavaStub,
      });
    } else {
      problems.push({ index: i, slug, rawBlock: block, skip: true });
    }
  }

  return { header, problems };
}

// ─── Gemini API ──────────────────────────────────────────────────────
async function callGemini(prompt, retries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 32768, // ← much higher
          },
        }),
      });

      if (resp.status === 429) {
        await new Promise(r => setTimeout(r, (attempt + 1) * 10000));
        continue;
      }

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Gemini ${resp.status}: ${errText.slice(0, 200)}`);
      }

      const data = await resp.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (err) {
      if (attempt < retries - 1) {
        await new Promise(r => setTimeout(r, 2000));
      } else throw err;
    }
  }
}

async function translateBatch(problems) {
  const batchPrompt = problems.map((p, i) => {
    const pySolution = p.solutionPython
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\'/g, "'");
    const pyStarter = p.starterPython
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\'/g, "'");

    return `### PROBLEM ${i + 1}: ${p.slug}
Function name: ${p.functionName}

Python solution:
\`\`\`python
${pySolution}
\`\`\`

Python starter:
\`\`\`python
${pyStarter}
\`\`\``;
  }).join('\n\n---\n\n');

  const prompt = `You are a code translator. For each problem below, translate the Python solution into:
1. A working Java solution (as a static method in a Solution class)
2. A working JavaScript solution (as a standalone function)

RULES:
- Java: Use \`class Solution { public static <ReturnType> <camelCaseName>(<params>) { ... } }\`. Infer correct Java types from Python (List<Integer>, int[], boolean, etc.). Helper classes can be nested static classes.
- JavaScript: Use \`function <camelCaseName>(<params>) { ... }\`. Clean idiomatic JS.
- Preserve algorithm exactly.
- Do NOT include explanation, only code.

OUTPUT FORMAT — for each problem output EXACTLY:
\`\`\`
PROBLEM <N>
===JAVA===
<java code>
===JAVASCRIPT===
<js code>
\`\`\`

${batchPrompt}`;

  const response = await callGemini(prompt);

  const results = [];
  const problemSections = response.split(/PROBLEM\s+\d+/);

  for (let i = 1; i < problemSections.length; i++) {
    const section = problemSections[i];
    const javaMatch = section.match(/===JAVA===\s*\n?([\s\S]*?)(?:===JAVASCRIPT===)/);
    let java = javaMatch ? javaMatch[1].trim() : '';
    java = java.replace(/```java\n?/g, '').replace(/```\n?/g, '').trim();

    const jsMatch = section.match(/===JAVASCRIPT===\s*\n?([\s\S]*?)(?:```|$)/);
    let js = jsMatch ? jsMatch[1].trim() : '';
    js = js.replace(/```javascript\n?/g, '').replace(/```js\n?/g, '').replace(/```\n?/g, '').trim();

    results.push({ java, js });
  }

  return results;
}

// ─── SQL escaping ────────────────────────────────────────────────────
function toEString(code) {
  if (!code) return '';
  return code
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/\r/g, '');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function rebuildBlock(problem, javaSolution, jsSolution) {
  let block = problem.rawBlock;

  const oldJavaSolution = problem.solutionJava;
  const newJavaSolution = toEString(javaSolution);
  if (oldJavaSolution && newJavaSolution) {
    block = block.replace(`E'${oldJavaSolution}'`, `E'${newJavaSolution}'`);
  }

  // Update solution_code_js — find the existing solution_code_js value (which was set to "// TODO: implement" stub)
  // The block already has solution_code_js column (set by the initial run)
  // We need to find: starter_code_js E-string, then the next E-string is solution_code_js

  // Find the starter_code_js E-string position
  const starterJsEscaped = problem.starterJs;
  const starterJsStr = `E'${starterJsEscaped}'`;
  const starterIdx = block.indexOf(starterJsStr);
  if (starterIdx !== -1) {
    // Find the next E-string after starter_code_js
    const afterStarter = block.slice(starterIdx + starterJsStr.length);
    const nextEMatch = afterStarter.match(/E'((?:[^'\\]|\\.|'')*?)'/);
    if (nextEMatch) {
      const oldJsSolution = nextEMatch[1];
      const newJsStr = `E'${toEString(jsSolution)}'`;
      block = block.replace(`E'${oldJsSolution}'`, newJsStr);
    }
  }

  return block;
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log('Reading translated SQL...');
  const sql = fs.readFileSync(SQL_PATH, 'utf-8');

  console.log('Parsing problems...');
  const { header, problems } = parseSqlProblems(sql);

  const needRetry = problems.filter(p => p.needsRetry);
  console.log(`Found ${needRetry.length} problems needing retry (out of ${problems.length} total)`);

  if (needRetry.length === 0) {
    console.log('Nothing to retry. Done.');
    return;
  }

  // Smaller batch size — 3 problems per batch
  const BATCH_SIZE = 3;
  const allResults = new Map();

  for (let i = 0; i < needRetry.length; i += BATCH_SIZE) {
    const batch = needRetry.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(needRetry.length / BATCH_SIZE);

    console.log(`\nBatch ${batchNum}/${totalBatches}: ${batch.map(p => p.slug.slice(0, 40)).join(', ')}`);

    try {
      const results = await translateBatch(batch);
      for (let j = 0; j < batch.length; j++) {
        if (results[j] && results[j].java && results[j].js) {
          allResults.set(batch[j].slug, results[j]);
          console.log(`  ✓ ${batch[j].slug}`);
        } else {
          console.warn(`  ✗ ${batch[j].slug} — incomplete`);
        }
      }
    } catch (err) {
      console.error(`  Batch ${batchNum} failed: ${err.message.slice(0, 100)}`);
      // Retry individually
      for (const p of batch) {
        try {
          const results = await translateBatch([p]);
          if (results[0]?.java && results[0]?.js) {
            allResults.set(p.slug, results[0]);
            console.log(`  ✓ ${p.slug} (individual)`);
          } else {
            console.error(`  ✗ ${p.slug} (individual): empty`);
          }
        } catch (innerErr) {
          console.error(`  ✗ ${p.slug}: ${innerErr.message.slice(0, 80)}`);
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }

    if (i + BATCH_SIZE < needRetry.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  console.log(`\nRetried ${allResults.size}/${needRetry.length}`);

  // Rebuild SQL
  console.log('Rebuilding SQL...');
  const rebuiltBlocks = [header];
  for (const problem of problems) {
    if (problem.skip) {
      rebuiltBlocks.push(problem.rawBlock);
      continue;
    }
    const translation = allResults.get(problem.slug);
    if (translation) {
      rebuiltBlocks.push(rebuildBlock(problem, translation.java, translation.js));
    } else {
      rebuiltBlocks.push(problem.rawBlock);
    }
  }

  const newSql = rebuiltBlocks.join('');
  fs.writeFileSync(OUTPUT_PATH, newSql, 'utf-8');
  console.log(`Written: ${OUTPUT_PATH} (${newSql.length} bytes)`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
