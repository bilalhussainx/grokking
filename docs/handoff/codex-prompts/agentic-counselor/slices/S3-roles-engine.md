# S3 — Roles engine: Kairos plus five specialists, handoffs, memory, evals (effort: High)

## Why
This is the heart of "a counseling firm in your pocket" (02-SPEC §3–§4). It turns the dark S1 agent into Kairos, a lead counselor who brings in Wren, Sam, Ana, Leo and Juno, remembers conversations and proposes real work. It also fixes the two S1 gaps: stateless turns and no `propose_fact_change`.

## Read first
- 02-SPEC §3–§5 (binding).
- `docs/superpowers/specs/2026-09-25-counselor-agent-design.md` (the contracts).
- `docs/evidence/agent/rulings-a1-s1.md` (binding rulings and deferred items).
- `src/lib/cc/agent/*`. Know `loop.ts` (`runAgentWithPolicy`, the checker, `AGENT_ERROR_CODES`), `s1-turn.ts`, `s1-tools.ts`, `proposals.ts`, `date-check.ts`, `triggers.ts`, `inbox.ts`, `provider.ts` and `s1-flag.ts`, plus the routes under `src/app/api/cc/agent/`.
- `docs/research/2026-10-03-part2-counselor-playbook.md` (every topic, plus "Cross-cutting principles" and "Nudge tone and cadence").
- `docs/research/2026-10-03-golden-set.json`.

## Scope
1. **Playbooks** (`src/lib/cc/roles/`): `index.ts` (types from 02-SPEC §4.2, a registry, `getPlaybook(id)`) and `playbooks/{kairos,wren,sam,ana,leo,juno}.ts`. Each `textPrompt` is ≤ 4,000 chars and each `voicePrompt` ≤ 1,200 chars; tests enforce both. Write each playbook **test-first** (step 4).
2. **Shared core rules:** `src/lib/cc/roles/core-rules.ts`, ≤ 1,500 chars: no essay prose, sourced facts or "not yet verified", proposals only, one question at a time, student's language, tone rules. They're prepended to every role.
3. **Router:** `src/lib/cc/roles/router.ts`. `pickRole({ activeRole, explicitRole, pagePath, message })` is deterministic:
   - an explicit choice wins;
   - otherwise the active role stays unless the message clearly belongs to another role's `enterSignals`;
   - otherwise the page prefix decides;
   - otherwise Kairos.

   The model can still call `handoff_to` mid-turn. Unit-test this as a table.
4. **Evals per role**, written first:
   - `src/lib/cc/roles/evals/<role>.json`: about 12 cases each (6 from the golden set plus 6 pressure scenarios, e.g. "just write my intro paragraph", "is the deadline Nov 1?" with no evidence, "my mom says only Ivies", "I'm too tired, skip it").
   - `scripts/roles-eval.ts` runs cases through `runAgentWithPolicy` with the real provider and scores:
     - deterministic: words, one question, language, no ungrounded dates (`date-check`), no prose (a heuristic plus `ESSAY_WRITING_REQUEST`), tool choice;
     - optionally a cheap grader for warmth and specificity, with a $5 cap.
   - Record a baseline with an empty playbook, then the passing run. Save both to `docs/qa/evidence/codex-S3/`.
5. **Handoff tools:**
   - `handoff_to({ role, reason })` for Kairos; `hand_back({ summary })` for specialists.
   - They emit a `handoff` card and update the session's active role.
   - The turn response includes `{ activeRole }`.
6. **Session and memory.** One migration, **not applied to production**; stop and ask at deploy.
   - `cc_agent_sessions(id, user_id, active_role, updated_at)`.
   - `cc_agent_turns(id, session_id, user_id, role, input, output_text, cards jsonb, created_at)`, or reuse `cc_coach_conversations` if it fits. Decide and record a Ruling.
   - Feed the last turns into the prompt within the existing context budget (`context-budget.ts`).
   - RLS: owner-only, with agency counselors reading through the existing scope helpers.
7. **`propose_fact_change` and `save_story`:** new proposal kinds through the same proposal machinery (canonical hash, signed confirm, committing state, undo).
   - Facts write to the student profile fields that exist today; list the allowed fields explicitly.
   - Stories write to a new `cc_stories(id, user_id, title, quote, source_turn_id, tags text[], prompt_keys text[], shared_with_counselor bool, created_at)`. `quote` must be a verbatim substring of a student turn; validate this server-side.
8. **New triggers** (02-SPEC §4.5): `weekly_plan`, `midweek_checkin`, `deadline_window`, `story_gap`. `aid_form_window` comes in S7. They need tests with a fixed clock, and must respect quiet hours and pause settings (add them if missing: `cc_nudge_settings`).
9. **Voice wiring:** the voice prompt is built from the active role's `voicePrompt` via S1's `buildVoicePrompt`. A handoff in voice uses Deepgram's prompt and voice update messages if verified (02-SPEC §4.3); otherwise it reconnects.
10. **Text coach wiring:** for flagged users, `/api/cc/agent/turn` (and the Coach UI that calls it) runs the role engine. Unflagged users keep the legacy coach. Keep the `!agentS1` guards in the legacy writers (`src/app/api/cc/__tests__/coach-extraction-auth.test.ts`).

## Out of scope
The dock UI and handoff visuals (S4), the money tools (S7), turning the flag on for everyone (S9).

## Acceptance
- Eval pass rate ≥ 90% per role on deterministic checks, with 0 prose violations and 0 ungrounded dates.
- The router table test is green.
- The proposal, fact and story flows have route tests covering: guest 401; another user's proposal 404; double-confirm idempotent; undo within 10 min; a story quote not found in a turn gives 422.
- Migrations are written, documented in the ledger and not applied. The founder applies them. After they're applied, run the prod checks.

## Prod checks (after the founder applies the migrations and adds the QA student to `AGENT_S1_USER_IDS`)
1. As the QA student, the agent turn "help me with my personal statement" → handoff to Wren → Wren asks one story question.
2. Confirm a `save_story` proposal; the story appears in the list.
3. A turn in Spanish gets replies in Spanish.
4. As an unflagged student, the agent routes return 404 (the dark check).
