# Agent S1 validation log

## Task 1: schema and local-Postgres constraint tests (2026-10-03)
- RED: `AGENT_PG_URL=postgres://postgres:agent@localhost:55432/postgres npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/s1-schema.pg.test.ts` failed with `ENOENT ... 20261003_agent_s1.sql`.
- GREEN: same command, 4 passed (local container kairos-agent-pg, postgres:16, port 55432 only).
- Gate: `npx vitest run src --config vitest.agent-source.config.ts` (AGENT_PG_URL unset): 148 files passed, 1 skipped (the pg test); 1048 passed, 4 skipped. `npx tsc --noEmit -p .`: 0 errors.

## Task 1 fix round 1: localhost guard (2026-10-03)
- Added `isLocalPgUrl` (`__tests__/helpers/local-pg.ts`) with 2 unit tests; the pg suite runs only for hostname localhost or 127.0.0.1, otherwise skips and writes one stderr warning.
- Remote URL (db.x.supabase.co) run: suite skipped with warning. Local container run: pg suite 4/4 plus helper tests, 6 passed. Container stopped.
- Gate: 149 files passed + 1 skipped, 1050 tests passed + 4 skipped; tsc 0.

## Task 2: flag and journey read tools
- RED: `npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/journey-tools.test.ts` -> FAIL, `../journey-tools` could not be resolved (no tests ran).
- GREEN: same command -> 1 file, 7 tests passed.
- Gate: `npx vitest run src --config vitest.agent-source.config.ts` -> 150 passed, 1 skipped files; 1057 passed, 4 skipped tests. `npx tsc --noEmit -p .` -> no output (0 errors).

## Task 3: proposals, confirmation tokens, commit/decline/undo, confirm route
- RED: `npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/proposals.test.ts` -> FAIL, `Cannot find module '../proposals'` (no tests ran).
- First GREEN attempt with the brief's code verbatim: 3 failed / 5 passed. The fake does not apply column defaults, so the inserted proposal had no `status` (DB default 'pending'). Fixed by writing `status: "pending"` explicitly on insert (matches the DB default).
- GREEN: same command -> 1 file, 8 tests passed (the brief says "7 passed", but its test file has 8 cases).
- Gate: `npx vitest run src --config vitest.agent-source.config.ts` -> 151 passed, 1 skipped files; 1065 passed, 4 skipped tests. `npx tsc --noEmit -p .` -> exit 0, no output.

## Task 3 fix round 1: C1, I2-I4, minors 5-10 (2026-10-03)
- RED: `npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/proposals.test.ts` -> 13 failed, 9 passed (22). Each failure was for the intended reason: 409 on a key-reordered payload (C1); no 'committing' state (I2); 200 instead of 409 for a racing undo or decline (I3); a second list row (I4); `RangeError: Input buffers must have the same byte length` (5); null proposalId on re-propose (6); 2027-02-29 accepted (7); wrong profile id (8); another student's row deleted (9); `ics` present (10).
- pg RED: against the committed migration (no 'committing'), `AGENT_PG_URL=postgres://postgres:agent@localhost:55432/postgres npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/s1-schema.pg.test.ts` -> 1 failed, 5 passed: `violates check constraint "cc_agent_proposals_status_check"`.
- GREEN: proposals 22/22. pg suite 6/6, including a real-Postgres check that jsonb returns `{date,title}` and `canonicalJson` matches across the round trip. Local container kairos-agent-pg (postgres:16, 127.0.0.1:55432) was started for the run and stopped after (`--rm`).
- Gate: `npx vitest run src --config vitest.agent-source.config.ts` -> 151 passed, 1 skipped files; 1079 passed, 6 skipped tests (the skipped pg suite now has 6 cases). `npx tsc --noEmit -p .` -> exit 0.

## Task 4: date redaction, S1 tools, runS1Turn, flagged turn route, legacy one-writer guard (2026-10-03)
- RED: `npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/date-check.test.ts src/lib/cc/agent/__tests__/s1-turn.test.ts src/lib/cc/agent/__tests__/loop.test.ts src/lib/cc/agent/__tests__/provider.test.ts src/app/api/cc/__tests__/coach-extraction-auth.test.ts` -> 5 files failed; `Cannot find module '../date-check'` and `'../s1-turn'`; loop redact test got 'What changed?' instead of 'WHAT CHANGED?'; injected-validator test threw `invalid_tool_arguments`; provider still sent the 3 read tools; legacy route lacked `isAgentS1User(user.id)`. 4 failed | 52 passed among the tests that loaded.
- GREEN: same command -> 5 files, 68 passed. After adding the abort-logging test: s1-turn 9/9. Mutation check: with the wrapper's `signal?.throwIfAborted()` commented out, that test fails (3 events instead of `turn.accepted, turn.failed`); restored -> 9/9.
- Gate: `npx vitest run src --config vitest.agent-source.config.ts` -> 153 passed, 1 skipped files; 1096 passed, 6 skipped tests. `npx tsc --noEmit -p .` -> exit 0 (one earlier run in a backgrounded subshell printed npx's "not the tsc command" notice; a direct rerun resolved node_modules/.bin/tsc and passed).
