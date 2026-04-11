#!/usr/bin/env node
/**
 * translate-solutions.mjs
 *
 * Parses 025_seed_problems.sql, extracts Python solutions,
 * uses Gemini API to translate them into real Java + JavaScript solutions,
 * then rewrites the SQL file with proper implementations.
 *
 * Usage: node scripts/translate-solutions.mjs
 * Requires: GEMINI_API_KEY in .env.local
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
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].trim();
  }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY in .env.local');
  process.exit(1);
}

const SQL_PATH = path.join(ROOT, 'supabase/migrations/025_seed_problems.sql');
const OUTPUT_PATH = path.join(ROOT, 'supabase/migrations/025_seed_problems_translated.sql');

// ─── Parse SQL into problem blocks ───────────────────────────────────
function parseSqlProblems(sql) {
  // Split on INSERT INTO statements
  const blocks = sql.split(/(?=INSERT INTO interview_problems)/);
  const header = blocks[0]; // ALTER TABLE + DELETE statements
  const problems = [];

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];

    // Extract function_name
    const fnMatch = block.match(/function_name,[\s\S]*?'([^']+)',\s*\n\s*E'/);
    // Better: find function_name value by looking at the position in the VALUES
    // The order is: slug, title, difficulty, description, constraints, examples, function_name, ...

    // Extract slug
    const slugMatch = block.match(/VALUES\s*\(\s*'([^']+)'/);
    const slug = slugMatch ? slugMatch[1] : `unknown-${i}`;

    // Extract function_name - it's after examples jsonb and before starter_code_python
    const fnNameMatch = block.match(/'::jsonb,\s*\n\s*'([a-z_]+)',\s*\n\s*E'/);
    const functionName = fnNameMatch ? fnNameMatch[1] : null;

    // Extract solution_code_python (the E'...' string after starter_code_python)
    // Pattern: starter_code_python is E'...', then solution_code_python is the next E'...'
    const eStrings = [];
    const eStringRegex = /E'((?:[^'\\]|\\.|'')*?)'/g;
    let m;
    while ((m = eStringRegex.exec(block)) !== null) {
      eStrings.push(m[1]);
    }

    // eStrings order: starter_py, solution_py, starter_java, solution_java, starter_js
    // (indices 0-4)
    if (eStrings.length >= 5) {
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
      });
    } else {
      console.warn(`Skipping ${slug}: only found ${eStrings.length} E-strings`);
      problems.push({ index: i, slug, rawBlock: block, skip: true });
    }
  }

  return { header, problems };
}

// ─── Gemini API call ─────────────────────────────────────────────────
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
            maxOutputTokens: 8192,
          },
        }),
      });

      if (resp.status === 429) {
        console.log(`  Rate limited, waiting ${(attempt + 1) * 10}s...`);
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
        console.log(`  Retry ${attempt + 1}: ${err.message.slice(0, 100)}`);
        await new Promise(r => setTimeout(r, 2000));
      } else throw err;
    }
  }
}

// ─── Translate a batch of problems ───────────────────────────────────
async function translateBatch(problems) {
  const batchPrompt = problems.map((p, i) => {
    // Unescape the E-string Python solution for readability
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

Python starter (shows parameters):
\`\`\`python
${pyStarter}
\`\`\``;
  }).join('\n\n---\n\n');

  const prompt = `You are a code translator. For each problem below, translate the Python solution into:
1. A working Java solution (as a static method in a Solution class)
2. A working JavaScript solution (as a standalone function)

RULES:
- Java: Use \`class Solution { public static <ReturnType> <camelCaseName>(<params>) { ... } }\`. Infer correct Java types from the Python code (List<Integer>, int[], boolean, etc.). Use java.util imports as needed but put them INSIDE the class as comments noting required imports.
- JavaScript: Use \`function <camelCaseName>(<params>) { ... }\`. Clean idiomatic JS.
- Preserve the exact algorithm and logic from the Python solution.
- For problems returning lists/arrays, match the Python return type semantics.
- Do NOT include any explanation, just code.

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

  // Parse response
  const results = [];
  const problemSections = response.split(/PROBLEM\s+\d+/);

  for (let i = 1; i < problemSections.length; i++) {
    const section = problemSections[i];

    // Extract Java
    const javaMatch = section.match(/===JAVA===\s*\n?([\s\S]*?)(?:===JAVASCRIPT===)/);
    let java = javaMatch ? javaMatch[1].trim() : '';
    // Clean markdown code fences
    java = java.replace(/```java\n?/g, '').replace(/```\n?/g, '').trim();

    // Extract JavaScript
    const jsMatch = section.match(/===JAVASCRIPT===\s*\n?([\s\S]*?)(?:```|$)/);
    let js = jsMatch ? jsMatch[1].trim() : '';
    js = js.replace(/```javascript\n?/g, '').replace(/```js\n?/g, '').replace(/```\n?/g, '').trim();

    results.push({ java, js });
  }

  return results;
}

// ─── Escape for SQL E-string ─────────────────────────────────────────
function toEString(code) {
  if (!code) return '';
  return code
    .replace(/\\/g, '\\\\')   // escape backslashes first
    .replace(/'/g, "\\'")      // escape single quotes
    .replace(/\n/g, '\\n')    // newlines
    .replace(/\t/g, '\\t')    // tabs
    .replace(/\r/g, '');       // remove CR
}

// ─── Rebuild SQL block with new solutions ────────────────────────────
function rebuildBlock(problem, javaSolution, jsSolution) {
  let block = problem.rawBlock;

  // 1. Replace solution_code_java (the 4th E-string)
  // We need to replace the old stub Java solution with the real one
  const oldJavaSolution = problem.solutionJava;
  const newJavaSolution = toEString(javaSolution);

  if (oldJavaSolution && newJavaSolution) {
    block = block.replace(`E'${oldJavaSolution}'`, `E'${newJavaSolution}'`);
  }

  // 2. Add solution_code_js column to INSERT and value
  // The INSERT column list needs solution_code_js added after starter_code_js
  // And the VALUES needs solution_code_js value added after starter_code_js value

  // Add column to INSERT list
  if (!block.includes('solution_code_js')) {
    block = block.replace(
      'starter_code_js, topics,',
      'starter_code_js, solution_code_js, topics,'
    );
  }

  // Add value after starter_code_js E-string
  // Find the starter_code_js E-string and add solution_code_js after it
  const starterJsEscaped = problem.starterJs;
  if (starterJsEscaped) {
    const starterJsStr = `E'${starterJsEscaped}'`;
    const newJsStr = `E'${toEString(jsSolution)}'`;
    // Replace: E'<starter_js>',\n  ARRAY  →  E'<starter_js>',\n  E'<solution_js>',\n  ARRAY
    block = block.replace(
      new RegExp(`(E'${escapeRegex(starterJsEscaped)}',\\s*\\n)(\\s*ARRAY)`),
      `$1  ${newJsStr},\n$2`
    );
  }

  // Add solution_code_js to ON CONFLICT clause
  if (!block.includes('solution_code_js = EXCLUDED.solution_code_js')) {
    block = block.replace(
      'starter_code_js = EXCLUDED.starter_code_js,',
      'starter_code_js = EXCLUDED.starter_code_js,\n  solution_code_js = EXCLUDED.solution_code_js,'
    );
  }

  return block;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log('Reading SQL file...');
  const sql = fs.readFileSync(SQL_PATH, 'utf-8');

  console.log('Parsing problems...');
  const { header, problems } = parseSqlProblems(sql);

  const translatable = problems.filter(p => !p.skip);
  console.log(`Found ${translatable.length} problems to translate (${problems.length} total)`);

  // Batch translate - 8 problems per batch
  const BATCH_SIZE = 8;
  const allResults = new Map(); // slug -> {java, js}

  for (let i = 0; i < translatable.length; i += BATCH_SIZE) {
    const batch = translatable.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(translatable.length / BATCH_SIZE);

    console.log(`\nBatch ${batchNum}/${totalBatches}: translating ${batch.map(p => p.slug.slice(0, 30)).join(', ')}...`);

    try {
      const results = await translateBatch(batch);

      for (let j = 0; j < batch.length; j++) {
        if (results[j] && results[j].java && results[j].js) {
          allResults.set(batch[j].slug, results[j]);
          console.log(`  ✓ ${batch[j].slug}`);
        } else {
          console.warn(`  ✗ ${batch[j].slug} — incomplete translation`);
        }
      }
    } catch (err) {
      console.error(`  Batch ${batchNum} failed: ${err.message}`);
      // Try individually
      for (const p of batch) {
        try {
          console.log(`  Retrying ${p.slug} individually...`);
          const results = await translateBatch([p]);
          if (results[0]?.java && results[0]?.js) {
            allResults.set(p.slug, results[0]);
            console.log(`  ✓ ${p.slug} (individual)`);
          }
        } catch (innerErr) {
          console.error(`  ✗ ${p.slug}: ${innerErr.message.slice(0, 80)}`);
        }
      }
    }

    // Rate limit: 1s between batches
    if (i + BATCH_SIZE < translatable.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  console.log(`\nTranslated ${allResults.size}/${translatable.length} problems`);

  // ─── Rebuild SQL ─────────────────────────────────────────────────
  console.log('\nRebuilding SQL file...');

  // Update header to add solution_code_js column
  let newHeader = header;
  if (!newHeader.includes('solution_code_js')) {
    newHeader = newHeader.replace(
      'ALTER TABLE interview_problems ADD COLUMN IF NOT EXISTS starter_code_js TEXT;',
      'ALTER TABLE interview_problems ADD COLUMN IF NOT EXISTS starter_code_js TEXT;\nALTER TABLE interview_problems ADD COLUMN IF NOT EXISTS solution_code_js TEXT;'
    );
  }

  const rebuiltBlocks = [newHeader];

  for (const problem of problems) {
    if (problem.skip) {
      rebuiltBlocks.push(problem.rawBlock);
      continue;
    }

    const translation = allResults.get(problem.slug);
    if (translation) {
      rebuiltBlocks.push(rebuildBlock(problem, translation.java, translation.js));
    } else {
      // Keep as-is but still add empty solution_code_js
      rebuiltBlocks.push(rebuildBlock(problem, null, '// TODO: implement'));
    }
  }

  const newSql = rebuiltBlocks.join('');
  fs.writeFileSync(OUTPUT_PATH, newSql, 'utf-8');
  console.log(`\nWritten to: ${OUTPUT_PATH}`);
  console.log(`Original: ${sql.length} bytes → New: ${newSql.length} bytes`);

  // Write a summary
  const summary = {
    total: problems.length,
    translated: allResults.size,
    failed: translatable.length - allResults.size,
    skipped: problems.length - translatable.length,
  };
  console.log('\nSummary:', JSON.stringify(summary, null, 2));
  fs.writeFileSync(
    path.join(ROOT, 'scripts/translate-summary.json'),
    JSON.stringify(summary, null, 2)
  );
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
