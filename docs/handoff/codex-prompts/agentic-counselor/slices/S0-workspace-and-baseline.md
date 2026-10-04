# S0 — Workspace, baseline and ledger (effort: Medium)

## Goal
Create the Codex worktree, prove the baseline is green, and start the ledger that every later slice appends to. Ship nothing to users.

## Steps
1. Create the worktree exactly as in 01-CONTEXT ("Codex worktree"). Confirm `node_modules` is a real directory: `node -e "console.log(require('fs').lstatSync('node_modules').isSymbolicLink())"` must print `false`.
2. Confirm `.env.local` exists and has these names (print names only, never values): `DEEPGRAM_API_KEY`, `OPENROUTER_API_KEY`, `SARVAM_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `QA_STUDENT_EMAIL`, `QA_STUDENT_PASSWORD`, `QA_COUNSELOR_EMAIL`, `QA_COUNSELOR_PASSWORD`.
3. Run the baseline and save the tails to `docs/qa/evidence/codex-S0/baseline.txt`:
   - `npx vitest run src`
   - `npx tsc --noEmit -p .` (record the pre-existing error count, so later slices can show "no new errors")
   - `npx next build`
4. Run a production smoke check with a script at `scripts/codex/prod-smoke.mjs` (commit it; it reads QA logins from `.env.local` and must not print them). It should:
   - check that `/`, `/pricing`, `/login` and `/signup` return 200;
   - sign in as the QA student and check that `/cc/dashboard` renders a heading;
   - POST `/api/ai/voice-session` with `{mode:"coach",language:"en"}` and expect 200 with an `auth.scheme === "bearer"` field and no `"key"` field;
   - sign in as the QA counselor and check that `/counselor/students` renders.
5. **Remove hard-coded test passwords (the repo is public).** `git grep -nE "KairosQA!|E2eTestPass!1"` finds QA and e2e passwords in tests, scripts and docs (`tests/e2e/helpers/auth-fixtures.ts`, `tests/e2e/*.spec.ts`, `scripts/qa-seed-*.mjs`, several docs).
   - Change code to read `QA_*` and `E2E_TEST_PASSWORD` from the environment, failing with a clear message when they're missing.
   - Replace passwords in docs with "see `.env.local`".
   - The old values stay in git history, so tell the founder in your report to rotate those account passwords and put the new ones in `.env.local`. Do not rotate them yourself.
6. Create `.agent/codex-ledger.md`:
   ```
   # Codex ledger: Agentic Counselor build
   Plan pack: docs/handoff/codex-prompts/agentic-counselor/
   ## S0 <date>: baseline <vitest result>, tsc errors <n>, build ok, prod smoke <result>
   ```
   Also create `.agent/codex-plans/`.
7. Commit the smoke script, ledger, evidence and the password cleanup. Push `codex/agentic-counselor`. Do not deploy (no app changes).

## Done when
The baseline numbers are recorded, the smoke script passes against production, and the ledger exists.
