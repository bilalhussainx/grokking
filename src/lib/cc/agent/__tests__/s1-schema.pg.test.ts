// @vitest-environment node
// src/lib/cc/agent/__tests__/s1-schema.pg.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
// @ts-ignore -- @types/pg is not installed; pg is only used by this local-Postgres test
import { Client } from "pg";

const URL = process.env.AGENT_PG_URL;
const run = URL ? describe : describe.skip;
const SQL = path.join(process.cwd(), "supabase/migrations/20261003_agent_s1.sql");
const STUBS = `
  drop schema if exists auth cascade; create schema auth;
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.uid', true), '')::uuid $$;
  drop table if exists cc_student_profiles cascade;
  create table cc_student_profiles (id uuid primary key, user_id uuid not null);
  insert into cc_student_profiles values ('11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
`;
const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const S = "11111111-1111-4111-8111-111111111111";

run("S1 schema (local Postgres only)", () => {
  const db = new Client({ connectionString: URL });
  beforeAll(async () => {
    await db.connect();
    await db.query("drop table if exists cc_agent_events, cc_agent_proposals, cc_agent_nudges, cc_agent_turns cascade");
    await db.query(STUBS);
    await db.query(fs.readFileSync(SQL, "utf8"));
  });
  afterAll(async () => { await db.end(); });

  it("rejects a second turn with the same user and operation key", async () => {
    await db.query("insert into cc_agent_turns (user_id, operation_key, input_hash) values ($1,'op-key-0001','h1')", [U]);
    await expect(db.query("insert into cc_agent_turns (user_id, operation_key, input_hash) values ($1,'op-key-0001','h2')", [U]))
      .rejects.toThrow(/duplicate key/);
  });

  it("rejects an unknown proposal kind and status", async () => {
    await expect(db.query(
      "insert into cc_agent_proposals (user_id, student_id, kind, payload, payload_hash, operation_key, reason, expires_at) values ($1,$2,'email','{}','h','op-1','r', now())",
      [U, S])).rejects.toThrow(/check constraint/);
  });

  it("dedupes nudges per student, trigger, entity and period", async () => {
    const q = "insert into cc_agent_nudges (user_id, student_id, trigger, entity_key, period_key, reason) values ($1,$2,'essay_stall','essay:1','2026-W40','{}') on conflict do nothing returning id";
    expect((await db.query(q, [U, S])).rowCount).toBe(1);
    expect((await db.query(q, [U, S])).rowCount).toBe(0);
  });

  it("enables row level security on every S1 table", async () => {
    const r = await db.query("select relname, relrowsecurity from pg_class where relname like 'cc_agent_%' and relkind = 'r' order by relname");
    expect(r.rows.map((x: { relname: string; relrowsecurity: boolean }) => [x.relname, x.relrowsecurity])).toEqual([
      ["cc_agent_events", true], ["cc_agent_nudges", true], ["cc_agent_proposals", true], ["cc_agent_turns", true],
    ]);
  });
});
