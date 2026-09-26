**GATE D2-PLANS: CHANGES (targeted revision, not a rewrite).** Claude's independent review found the plans well structured and compliant with all seven amendments. The imports resolve against the real repo, the types line up a1 → a2 → b, `envDir:false` isolation and the loopback-only DB guard are good, and no path sends unchecked text to a client. Fix the items below in place, re-run your static checks, and stop at **GATE D2-PLANS-2** with a short list of what changed. The c–f outline is accepted as is.

## Blockers (fix before any execution)

1. **a2:443-447: `event()` SQL fails on every call.** `$1` is bound to the uuid `operation_id` and reused as `$1::text` inside `jsonb_build_object`, so Postgres raises "inconsistent types deduced for parameter $1". Every admit/finish path breaks. Cast explicitly (`$1::uuid` in the column, `$1::uuid::text` in the JSON) or pass a separate text parameter. Add a test that runs `event()` once against the local DB.
2. **Size limits are in bytes, and evidence is sent two or three times, so real essays fail closed.**
   - Byte caps in the plans: a1:730 (12,000/6,000 bytes), a1:1048 (10,000), a1:1067 (6,000), b:895 (6,000), and b:310 allows 48,000 bytes that can never fit.
   - Each tool message carries the essay in both `data` and `evidence` (a1:581, a1:1061). b's checker payload repeats it again (`evidenceIndex` plus `sources`, b:301-309). a2 feeds up to 24,000 chars of `priorReleased` into the check (a2:708). `CHECK_SYSTEM` alone is about 2.7 KB.
   - Result: a 650-word essay (about 3.7 KB, double that in Urdu) fails every turn, and the pilot's d1_bicycle, counselor_conflict and false_quote scenarios fail the gate for size alone.
   - Fix: express limits as **estimated tokens**, matching spec §10.2 (12,000 generation, 6,000 checker). Strip `evidence` from the tool message sent to the model. Send each source to the checker exactly once. Cap and summarize `priorReleased`. Add a test with a real 650-word English essay and a 650-word Urdu one that passes the size gates.
3. **b pilot: one transient error loses the whole paid run.**
   - `makeMeteredProvider` calls `ledger.fail` on any error, including 429, 5xx and `finish_reason:'length'` (b:923).
   - `healthy()` sits outside the try block (b:1078).
   - The report is written only at the end (b:1229-1230), and resume is forbidden (b:929).
   - `completion_tokens > 1500` stops the run (b:909-910), which reasoning models can exceed.
   - Fix: record transport errors and length stops as that case's `uncertain` outcome and continue. Stop the run only on receipt or price anomalies. Write outcomes incrementally (append-only JSONL, opened with `wx`). Allow a resume that skips completed case IDs under the same approval hash.

## Important

4. **Probe design (a1:846-849, 885, 908, 917).**
   - Drop `response_format` for generation roles; forced tool plus JSON mode is rejected by many endpoints.
   - Use `max_tokens` around 256, not 64 (reasoning models hit `length`), and add `usage:{include:true}` so `usage.cost` is returned.
   - Break the loop only when cost is unknown; a failed role must not leave later roles unprobed.
   - Validate models, key, pricing and the bound sum **before** writing the one-run fence.
   - **Key source:** the founder runs the probe with `node --env-file=.env.agent-probe`, a founder-created file containing only `OPENROUTER_API_KEY` and the `OPENROUTER_AGENT_*` variables. Claude never reads `.env.local` for it.
   - Keep the total under $0.05.
5. **Pricing freshness (a1:691, a1:781, b:855).** The source is the free `GET https://openrouter.ai/api/v1/models`. Runtime maximum age is **30 days**, set as an env var. The probe uses a pessimistic output multiplier instead of requiring proof that `max_tokens` bounds reasoning tokens. Don't make the agent fail closed every day.
6. **Baseline role (b:839-840, 858-859).** The baseline **reuses the escalation slug and its probe observation**; there is no fifth paid call. Add the step that converts a1's probe report into b's `Pins` shape (a1:831-833 vs b:841-843; a1:630 vs b:842).
7. **Gate per configuration (b:1164-1166).** The pilot gate passes or fails **each configuration separately**, and the founder adopts a passing one. Don't require all three to pass.
8. **b:1256: injection point mismatch.** a2's `execute` takes 7 arguments and injects `run` through `deps.run` (a2:679-680). Use that.
9. **a2 routes (a2:139-146, 948, 1013-1014, 1048-1100).** Keep the internal routes **out of `src/app`** until activation. Put the handlers under `src/lib/cc/agent/routes/` with tests, and add mounting as a later activated step, so a future deploy never compiles unbuilt `pg`/`createRequire` routes. State plainly in a2 that it is a harness and not deployable. The production DB transport (pooler plus writer role) is a separate later plan.
10. **Staging files that already have unrelated edits (a2:1281, b:1248).** `.agent/VALIDATION_LOG.md`, `.agent/WORKFLOW_STATE.md` and `.gitignore` already have uncommitted founder edits. Never `git add` them whole: write ledger entries to the plan's own workspace, or stage with `git add -p` for only the appended hunk.
11. **Corpus and review load (b:706-714, 755, 1140).**
    - The 150 probes are one template × 10 topics, and the 50 controls are 5 fixed questions. Write varied real cases: distinct request shapes, disguises and multi-turn assembly; controls that are real critique questions across all essay phases.
    - For the **English pilot, one fluent reviewer (the founder) is accepted**, with a second reviewer required for general rollout.
    - Report the expected judgment count and hours.
12. **Unverified baseline suite.** Before Task 1 of a1, add a step that runs the existing `src` suite under `vitest.agent-source.config.ts` (no dotenv) and records the result. If it fails for reasons unrelated to the agent, the commit gates use a recorded baseline rather than blocking forever.

## Minor (fix if cheap)

- a1: drop the host `psql` requirement (a2 uses psql inside the container). Fix the step labelled "Write the failing test" whose Expected is PASS (a1:1312-1319). Make `decodeEvents` report malformed or trailing frames instead of dropping them (a1:1239-1254). Keep model text out of probe error messages (a1:866, 881).
- a2/b: `revoke … from anon` as well (a2:304, b:514). A `denied` tool reply goes back to the model instead of failing the turn (a2:715). Use `try/finally` around `pool.end` (a2:595-613). Replace the conditional instructions (a2:565, a2:1096) with decisions. Add Expected lines to the psql apply steps (a2:187, 312-313; b:580-582). Use one canonical hash implementation, not two (a2:419 vs b:112).
- b: move the per-commit source-suite rule into Global Constraints (b:1340), make the tsc expectation match a2's, and avoid `vi.spyOn` on the ESM namespace (b:993).

## Decisions recorded

- **The $20 English pilot is NOT approved yet.** The founder decides after a1 and a2 land and the probe results are in.
- **Billing:** Claude has shipped the `BillingPort` implementation for item 4 (`src/lib/credit-reservations.ts`: `makeCreditBilling(userId)` with `reserve/capture/release`, typed `BillingError` codes, migration `20260925_credit_reservations.sql`, not applied). a2 keeps its no-charge implementation. Its signature matches.
- **Docker:** Docker Desktop is installed but its engine isn't running, and psql 16 is present. The founder starts Docker before a1/a2 execution.
- **Planning package:** Claude commits the spec, plans, contract and prompts at the start of execution. Don't commit them yourself.

Keep the gate message short. No production code.
