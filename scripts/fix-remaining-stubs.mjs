#!/usr/bin/env node
/**
 * fix-remaining-stubs.mjs
 *
 * Properly parses E-strings (with `''` escapes) and re-translates
 * problems whose Java solution is still a stub.
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
const SQL_PATH = path.join(ROOT, 'supabase/migrations/025_seed_problems_translated.sql');

// ─── Proper E-string parser ──────────────────────────────────────────
function parseEStringAt(text, startIdx) {
  if (text[startIdx] !== 'E' || text[startIdx + 1] !== "'") return null;
  let i = startIdx + 2;
  let content = '';
  while (i < text.length) {
    const ch = text[i];
    if (ch === '\\' && i + 1 < text.length) {
      content += ch + text[i + 1];
      i += 2;
      continue;
    }
    if (ch === "'") {
      if (text[i + 1] === "'") {
        content += "''";
        i += 2;
        continue;
      }
      return { content, start: startIdx, end: i + 1 };
    }
    content += ch;
    i++;
  }
  return null;
}

function findAllEStrings(block) {
  const results = [];
  let i = 0;
  while (i < block.length - 1) {
    if (block[i] === 'E' && block[i + 1] === "'") {
      // Make sure E is preceded by whitespace or comma (not part of an identifier)
      const prev = i > 0 ? block[i - 1] : ' ';
      if (/[\s,(]/.test(prev)) {
        const parsed = parseEStringAt(block, i);
        if (parsed) {
          results.push(parsed);
          i = parsed.end;
          continue;
        }
      }
    }
    i++;
  }
  return results;
}

// ─── Parse problems with proper E-string parser ──────────────────────
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

    const eStrings = findAllEStrings(block);

    if (eStrings.length >= 5) {
      const isJavaStub = eStrings[3].content.includes('TODO: Implement Java solution');
      problems.push({
        index: i,
        slug,
        functionName,
        starterPython: eStrings[0],
        solutionPython: eStrings[1],
        starterJava: eStrings[2],
        solutionJava: eStrings[3],
        starterJs: eStrings[4],
        solutionJs: eStrings[5] || null,
        rawBlock: block,
        eStrings,
        needsRetry: isJavaStub,
      });
    } else {
      console.warn(`Skipping ${slug}: ${eStrings.length} E-strings`);
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
          generationConfig: { temperature: 0.1, maxOutputTokens: 32768 },
        }),
      });
      if (resp.status === 429) {
        await new Promise(r => setTimeout(r, (attempt + 1) * 10000));
        continue;
      }
      if (!resp.ok) {
        throw new Error(`Gemini ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
      }
      const data = await resp.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (err) {
      if (attempt < retries - 1) await new Promise(r => setTimeout(r, 2000));
      else throw err;
    }
  }
}

async function translateOne(problem) {
  // Unescape Python solution from SQL E-string format
  const pySolution = problem.solutionPython.content
    .replace(/''/g, "'")
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\');

  const prompt = `Translate this Python solution into:
1. A Java solution as \`class Solution { public static <Type> ${camelCase(problem.functionName)}(...) {...} }\`
2. A JavaScript solution as \`function ${camelCase(problem.functionName)}(...) {...}\`

If the Python has multiple functions, include all of them in the Java class / JS file.
For helper data structures, use nested static classes in Java.

Function name: ${problem.functionName}

Python:
\`\`\`python
${pySolution}
\`\`\`

Output EXACTLY in this format:
===JAVA===
<java code>
===JAVASCRIPT===
<js code>`;

  const response = await callGemini(prompt);

  const javaMatch = response.match(/===JAVA===\s*\n?([\s\S]*?)===JAVASCRIPT===/);
  let java = javaMatch ? javaMatch[1].trim() : '';
  java = java.replace(/```java\n?/g, '').replace(/```\n?/g, '').trim();

  const jsMatch = response.match(/===JAVASCRIPT===\s*\n?([\s\S]*?)$/);
  let js = jsMatch ? jsMatch[1].trim() : '';
  js = js.replace(/```javascript\n?/g, '').replace(/```js\n?/g, '').replace(/```\n?/g, '').trim();

  return { java, js };
}

function camelCase(snake) {
  if (!snake) return 'solve';
  return snake.split('_').map((w, i) => i === 0 ? w : w[0].toUpperCase() + w.slice(1)).join('');
}

// ─── SQL escaping ────────────────────────────────────────────────────
function toEStringContent(code) {
  if (!code) return '';
  return code
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "''") // SQL-style escape
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/\r/g, '');
}

// ─── Rebuild block: replace java solution, insert js solution if missing ───
function rebuildBlock(problem, javaCode, jsCode) {
  const block = problem.rawBlock;
  const javaEStr = problem.solutionJava;
  const starterJsEStr = problem.starterJs;
  const jsEStr = problem.solutionJs;

  if (!javaEStr) return block;

  const replacements = [];

  // Replace Java solution
  replacements.push({
    start: javaEStr.start,
    end: javaEStr.end,
    replacement: `E'${toEStringContent(javaCode)}'`,
  });

  if (jsEStr) {
    // Replace existing JS solution
    replacements.push({
      start: jsEStr.start,
      end: jsEStr.end,
      replacement: `E'${toEStringContent(jsCode)}'`,
    });
  } else if (starterJsEStr) {
    // Insert JS solution after starter_code_js E-string
    // Find the `,` after starter_code_js and insert new E-string + ,
    const afterStarterJs = starterJsEStr.end;
    // Find the next char(s): should be `,\n  `
    // Insert right after the E-string's `'` and the comma/newline that follows
    const insertPos = afterStarterJs; // position right after the closing '
    // Insert: `,\n  E'<jsCode>'`
    replacements.push({
      start: insertPos,
      end: insertPos,
      replacement: `,\n  E'${toEStringContent(jsCode)}'`,
    });
  }

  // Sort by start desc so earlier replacements don't shift later indices
  replacements.sort((a, b) => b.start - a.start);

  let result = block;
  for (const r of replacements) {
    result = result.slice(0, r.start) + r.replacement + result.slice(r.end);
  }
  return result;
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log('Reading SQL...');
  const sql = fs.readFileSync(SQL_PATH, 'utf-8');

  console.log('Parsing with proper E-string parser...');
  const { header, problems } = parseSqlProblems(sql);

  const stillStubs = problems.filter(p => p.needsRetry && !p.skip);
  console.log(`Found ${stillStubs.length} stub problems to fix:\n  ${stillStubs.map(p => p.slug).join('\n  ')}`);

  if (stillStubs.length === 0) {
    console.log('All problems already have real Java solutions. Done.');
    return;
  }

  const results = new Map();

  for (const p of stillStubs) {
    console.log(`\nTranslating ${p.slug}...`);
    try {
      const { java, js } = await translateOne(p);
      if (java && js) {
        results.set(p.slug, { java, js });
        console.log(`  ✓ java: ${java.length} chars, js: ${js.length} chars`);
      } else {
        console.error(`  ✗ empty result (java=${!!java}, js=${!!js})`);
      }
    } catch (err) {
      console.error(`  ✗ ${err.message.slice(0, 120)}`);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`\nTranslated ${results.size}/${stillStubs.length}`);

  // Rebuild SQL
  const newBlocks = [header];
  for (const problem of problems) {
    if (problem.skip) {
      newBlocks.push(problem.rawBlock);
      continue;
    }
    const t = results.get(problem.slug);
    if (t) {
      newBlocks.push(rebuildBlock(problem, t.java, t.js));
    } else {
      newBlocks.push(problem.rawBlock);
    }
  }

  const newSql = newBlocks.join('');
  fs.writeFileSync(SQL_PATH, newSql, 'utf-8');
  console.log(`Written: ${SQL_PATH} (${newSql.length} bytes)`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
