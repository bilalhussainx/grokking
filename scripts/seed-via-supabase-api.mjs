#!/usr/bin/env node
/**
 * seed-via-supabase-api.mjs
 *
 * Executes the seed SQL programmatically against Supabase via direct
 * Postgres connection (using `pg`). Splits the SQL into individual
 * statements and runs them one-by-one with progress tracking.
 *
 * Usage: node scripts/seed-via-supabase-api.mjs [path-to-sql]
 * Defaults to: supabase/migrations/025_seed_problems.sql
 *
 * Requires one of these in .env.local:
 *   - DATABASE_URL (full postgres connection string)
 *   - SUPABASE_DB_URL
 *   - POSTGRES_URL
 *
 * Or derives from:
 *   - NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Load env ────────────────────────────────────────────────────────
const envPath = path.join(ROOT, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) {
      let value = match[2].trim();
      // Strip surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[match[1]] = value;
    }
  }
}

// ─── Build connection string ─────────────────────────────────────────
function buildConnectionString() {
  // Direct connection string
  const direct = process.env.DATABASE_URL ||
                 process.env.SUPABASE_DB_URL ||
                 process.env.POSTGRES_URL ||
                 process.env.POSTGRES_URL_NON_POOLING;

  if (direct) return direct;

  // Build from Supabase URL + password
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD || process.env.POSTGRES_PASSWORD;

  if (supabaseUrl && dbPassword) {
    // Extract project ref from https://<ref>.supabase.co
    const refMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
    if (refMatch) {
      const ref = refMatch[1];
      // Use the pooler endpoint (works around IPv6 issues)
      return `postgresql://postgres.${ref}:${encodeURIComponent(dbPassword)}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`;
    }
  }

  return null;
}

const connectionString = buildConnectionString();
if (!connectionString) {
  console.error(`
Could not build database connection string. Please add one of these to .env.local:

  DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres

Or:

  SUPABASE_DB_PASSWORD=<your-db-password>
  (will use existing NEXT_PUBLIC_SUPABASE_URL to build the connection string)

You can find the connection string in:
  Supabase Dashboard → Project Settings → Database → Connection string (URI tab)
`);
  process.exit(1);
}

// Mask password in logged URL
const maskedUrl = connectionString.replace(/:([^:@]+)@/, ':***@');
console.log(`Connection: ${maskedUrl}`);

// ─── Load SQL ────────────────────────────────────────────────────────
const sqlFile = process.argv[2] || path.join(ROOT, 'supabase/migrations/025_seed_problems.sql');
console.log(`SQL file:   ${sqlFile}`);

if (!fs.existsSync(sqlFile)) {
  console.error(`File not found: ${sqlFile}`);
  process.exit(1);
}

const sql = fs.readFileSync(sqlFile, 'utf-8');

// ─── Split SQL into statements ───────────────────────────────────────
function splitStatements(sql) {
  const statements = [];
  let current = '';
  let inEString = false;
  let prevChar = '';

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const next = sql[i + 1];

    // Detect E'...' string boundaries
    if (!inEString && ch === 'E' && next === "'") {
      inEString = true;
      current += ch;
      continue;
    }

    if (inEString && ch === "'" && prevChar !== '\\') {
      // Check for escaped '' (two single quotes)
      if (next === "'") {
        current += ch + next;
        i++;
        prevChar = "'";
        continue;
      }
      inEString = false;
      current += ch;
      prevChar = ch;
      continue;
    }

    current += ch;

    // Statement terminator: ; followed by newline, outside any string
    if (!inEString && ch === ';' && (next === '\n' || next === '\r' || next === undefined)) {
      const trimmed = current.trim();
      if (trimmed && !trimmed.startsWith('--')) {
        statements.push(trimmed);
      }
      current = '';
    }

    prevChar = ch;
  }

  if (current.trim()) {
    const trimmed = current.trim();
    if (!trimmed.startsWith('--')) statements.push(trimmed);
  }

  return statements;
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log('Splitting SQL into statements...');
  const statements = splitStatements(sql);
  console.log(`Found ${statements.length} statements`);

  const alters = statements.filter(s => /^ALTER\s/i.test(s));
  const deletes = statements.filter(s => /^DELETE\s/i.test(s));
  const inserts = statements.filter(s => /^INSERT\s/i.test(s));
  const others = statements.filter(s =>
    !/^(ALTER|DELETE|INSERT)\s/i.test(s)
  );
  console.log(`  ALTER: ${alters.length}, DELETE: ${deletes.length}, INSERT: ${inserts.length}, Other: ${others.length}`);

  console.log('\nConnecting to Postgres...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected ✓');
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }

  let success = 0, failed = 0;
  const failures = [];

  // Run schema/delete first
  for (const stmt of [...alters, ...deletes, ...others]) {
    const preview = stmt.replace(/\s+/g, ' ').slice(0, 80);
    try {
      await client.query(stmt);
      console.log(`✓ ${preview}`);
      success++;
    } catch (err) {
      console.error(`✗ ${preview}\n  ${err.message}`);
      failed++;
      failures.push({ stmt: preview, error: err.message });
    }
  }

  // Run inserts
  console.log(`\nInserting ${inserts.length} problems...`);
  for (let i = 0; i < inserts.length; i++) {
    const stmt = inserts[i];
    const slugMatch = stmt.match(/'(coding-interview-[^']+)'/);
    const slug = slugMatch ? slugMatch[1] : `insert-${i + 1}`;

    try {
      await client.query(stmt);
      success++;
      if ((i + 1) % 25 === 0 || i === inserts.length - 1) {
        console.log(`  Progress: ${i + 1}/${inserts.length}`);
      }
    } catch (err) {
      failed++;
      failures.push({ slug, error: err.message.slice(0, 200) });
      console.error(`  ✗ ${slug}: ${err.message.slice(0, 120)}`);
    }
  }

  await client.end();

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Done: ${success} succeeded, ${failed} failed`);
  if (failures.length > 0) {
    const failPath = path.join(ROOT, 'scripts/seed-failures.json');
    fs.writeFileSync(failPath, JSON.stringify(failures, null, 2));
    console.log(`Failures written to: ${failPath}`);
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
