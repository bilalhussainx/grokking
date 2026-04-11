#!/usr/bin/env node
/**
 * chunk-seed-sql.mjs
 *
 * Splits 025_seed_problems.sql into smaller files (~20 inserts each)
 * that fit in the Supabase SQL editor.
 *
 * Output: supabase/migrations/chunks/025_chunk_NN_*.sql
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SQL_PATH = path.join(ROOT, 'supabase/migrations/025_seed_problems.sql');
const CHUNKS_DIR = path.join(ROOT, 'supabase/migrations/chunks');

// ─── E-string aware statement splitter ──────────────────────────────
function splitStatements(sql) {
  const statements = [];
  let current = '';
  let inEString = false;
  let inString = false; // regular '...' string
  let i = 0;

  while (i < sql.length) {
    const ch = sql[i];

    // Skip -- line comments (outside strings) — preserves them in `current`
    if (!inEString && !inString && ch === '-' && sql[i + 1] === '-') {
      while (i < sql.length && sql[i] !== '\n') {
        current += sql[i];
        i++;
      }
      continue;
    }

    if (!inEString && !inString && ch === 'E' && sql[i + 1] === "'") {
      const prev = i > 0 ? sql[i - 1] : ' ';
      if (/[\s,(]/.test(prev)) {
        inEString = true;
        current += "E'";
        i += 2;
        continue;
      }
    }

    if (inEString) {
      if (ch === '\\' && i + 1 < sql.length) {
        current += ch + sql[i + 1];
        i += 2;
        continue;
      }
      if (ch === "'") {
        if (sql[i + 1] === "'") {
          current += "''";
          i += 2;
          continue;
        }
        inEString = false;
        current += ch;
        i++;
        continue;
      }
      current += ch;
      i++;
      continue;
    }

    if (inString) {
      if (ch === "'") {
        if (sql[i + 1] === "'") {
          current += "''";
          i += 2;
          continue;
        }
        inString = false;
        current += ch;
        i++;
        continue;
      }
      current += ch;
      i++;
      continue;
    }

    if (ch === "'") {
      inString = true;
      current += ch;
      i++;
      continue;
    }

    current += ch;

    if (ch === ';' && (sql[i + 1] === '\n' || sql[i + 1] === '\r' || sql[i + 1] === undefined)) {
      const trimmed = current.trim();
      if (trimmed && !trimmed.startsWith('--')) {
        statements.push(trimmed);
      }
      current = '';
    }

    i++;
  }

  if (current.trim() && !current.trim().startsWith('--')) {
    statements.push(current.trim());
  }

  return statements;
}

// ─── Main ────────────────────────────────────────────────────────────
function main() {
  console.log(`Reading ${SQL_PATH}...`);
  const sql = fs.readFileSync(SQL_PATH, 'utf-8');

  console.log('Splitting...');
  const statements = splitStatements(sql);
  console.log(`Found ${statements.length} statements`);

  const alters = statements.filter(s => /^ALTER\s/i.test(s));
  const deletes = statements.filter(s => /^DELETE\s/i.test(s));
  const inserts = statements.filter(s => /^INSERT\s/i.test(s));
  console.log(`  ALTER: ${alters.length}, DELETE: ${deletes.length}, INSERT: ${inserts.length}`);

  if (!fs.existsSync(CHUNKS_DIR)) {
    fs.mkdirSync(CHUNKS_DIR, { recursive: true });
  }

  // Clean old chunks
  for (const f of fs.readdirSync(CHUNKS_DIR)) {
    if (f.startsWith('025_chunk_')) fs.unlinkSync(path.join(CHUNKS_DIR, f));
  }

  // Chunk 0: schema (ALTER + DELETE) — hardcoded since the splitter
  // strips them when they're preceded by `--` comment lines.
  const schemaSql = `-- Schema setup for interview_problems
ALTER TABLE interview_problems ADD COLUMN IF NOT EXISTS function_name TEXT;
ALTER TABLE interview_problems ADD COLUMN IF NOT EXISTS starter_code_js TEXT;
ALTER TABLE interview_problems ADD COLUMN IF NOT EXISTS solution_code_js TEXT;

DELETE FROM interview_problems WHERE slug IN ('two-sum', 'valid-parentheses', 'merge-intervals', 'lru-cache', 'number-of-islands');
`;
  fs.writeFileSync(path.join(CHUNKS_DIR, '025_chunk_00_schema.sql'), schemaSql);
  console.log(`✓ chunk_00_schema.sql (${schemaSql.length} bytes)`);

  // Chunks 1+: 20 inserts each
  const CHUNK_SIZE = 20;
  for (let i = 0; i < inserts.length; i += CHUNK_SIZE) {
    const chunk = inserts.slice(i, i + CHUNK_SIZE);
    const num = String(Math.floor(i / CHUNK_SIZE) + 1).padStart(2, '0');
    const filename = `025_chunk_${num}_problems_${i + 1}-${Math.min(i + CHUNK_SIZE, inserts.length)}.sql`;
    const content = `-- Problems ${i + 1}-${Math.min(i + CHUNK_SIZE, inserts.length)} of ${inserts.length}\n\n` +
                    chunk.join(';\n\n') + ';\n';
    fs.writeFileSync(path.join(CHUNKS_DIR, filename), content);
    console.log(`✓ ${filename} (${content.length} bytes, ${chunk.length} inserts)`);
  }

  const totalChunks = Math.ceil(inserts.length / CHUNK_SIZE) + 1;
  console.log(`\nDone! ${totalChunks} chunks written to: ${CHUNKS_DIR}`);
  console.log('\nUsage:');
  console.log('  1. Open Supabase Dashboard → SQL Editor');
  console.log('  2. Paste 025_chunk_00_schema.sql first, run');
  console.log('  3. Paste each 025_chunk_NN_problems_*.sql in order, run each');
}

main();
