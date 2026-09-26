**GATE D2-PLANS-2: GREENLIGHT a2; small CHANGES to a1 and b.** An independent re-review verified the previous checklist:
- the `event()` casts;
- token-based limits, with evidence sent once and a capped `priorReleased`;
- 650-word English and Urdu fixtures;
- the probe fixes;
- a 30-day pricing freshness window;
- the baseline reusing the escalation model;
- per-configuration gates;
- `deps.run`;
- handlers out of `src/app`;
- explicit-path staging;
- the baseline suite step.

Good work. Apply the fixes below in place. **No new gate is needed** unless a fix changes an exported interface; if one does, stop at GATE D2-PLANS-3 and list it. Claude executes a1 → a2 → b.

## Fix in a1 (before a2 depends on it)

1. **SSE comment frames.** a2 sends `: heartbeat\n\n` every 15s (a2:1117), and a1's strict `decodeEvents` throws `malformed_sse_frame` on it (a1:1356-1357). Skip frames made only of `:` comment lines, and add a test.
2. **Probe HTTP failures.** A non-2xx response with no `usage` (a 400 for unsupported forced `tool_choice`, or a 404 for a bad slug) becomes `probe_http_failure` for that role, and the loop **continues**. It's budget-safe, because all four bounds are pre-summed under $0.05 (a1:943). Keep "stop" only for 2xx responses with missing or invalid cost (a1:980, a1:1003).
3. **tsc baseline.** Add `npx tsc --noEmit -p .` to the baseline step (a1:44-71), and add it to the per-commit gate so later "recorded baseline" comparisons (a2:1353, b:23/1770) have something to compare against.
4. **Preflight.** Use `execFile("docker", ["info","--format","{{.ServerVersion}}"])`, not a quoted `exec` string (a1:145).

## Fix in a2

5. **Pro quote seam.** Pro users don't spend credits: `deductCredits` skips Pro, and fair-use caps are the limit. `execute` always calls `reserve(key,0)` (a2:793). The real `reserve_credits` returns `insufficient_credits` when the user has no `user_credits` row. Add a `quote(actor)` seam that returns `{ credits: 0, reserve: false }` for Pro, so reserve and capture are skipped entirely. Keep the no-charge wrapper for the harness. Add a test for "Pro turn never calls billing".
6. **Admission size.** Cap `message` at admission in **estimated tokens (≤ 2,000)** and return 413 before reserve (a2:1076). Urdu makes the current 12,000-character limit about 12,000 tokens.
7. **Summarize history once.** `priorReleased` is summarized in a2:804 and again in a1:1205 and b:330. Summarize it once in a2 and pass it through unchanged, so the truncation marker can't duplicate or get cut off.
8. **Fixture password.** Rename `local_writer_fixture_only` to an obviously local constant, for example `LOCAL_TEST_ONLY_NOT_A_SECRET`, with a comment for secret scanners (a2:145).

## Fix in b (before any paid run; the offline tasks can proceed)

9. **Unbilled errors.** An HTTP ≥400 response with an error envelope and no `usage` becomes `unbilled_http_error`: cost 0, status recorded, the run continues. Only network drops and aborts after dispatch stay "unknown". Allow reconciliation through OpenRouter's generation lookup when a receipt is missing. Fix the offline test that mocks a 429 *with* usage (b:1088); add the realistic no-usage case.
10. **Transient failures aren't verdicts.** Add `Outcome.cause: 'verdict'|'transport'|'length'|'timeout'`. Report transport, length and timeout outcomes separately, and **exclude** them from the safety, false-block and "useful response" numerators (b:1516, b:1564, b:1568). On resume, allow **one** re-attempt per such case within the per-scope caps (b:1236).
11. **Eval-only timeouts.** For evaluation runs only, set the checker to 20s and generation to 45s. Runtime limits stay at the spec's 8s and 20s. Make them env-configurable and record them in the report.
12. **Source IDs carry the version.** Use `draft:${essay.id}@v${n}` so reading a current and a historical draft doesn't raise `conflicting_source` (b:145-150, 166-169).
13. **Worst case for Urdu.** 650 Urdu words plus a 1,500-token candidate plus a 512-token prior summary is about 6,086 estimated tokens, over the 6,000 checker cap. Lower the candidate allowance on the checker path to 1,400, **and** add the worst-case test.
14. **Rework the corpus before labeling.** The 150 probes reduce to about 45 distinct candidate payloads, and none is new prose, a paraphrase, a translation or Roman Urdu. Add candidates that are:
    - freshly authored essay sentences;
    - close paraphrases of the student's draft;
    - polished translations (Urdu→English);
    - Roman Urdu;
    - reconstructions built one sentence at a time.

    Controls must include anchored ≤20-word `source_quote` critiques, structural notes and grounded factual statements, not only plain questions.
15. **CLI.** `--pins-out` creates its directory (b:1625). `main().catch` prints the error and exits nonzero, including on dry-run validation failures (b:1667). Add `--print-approval-sha`. The paid run reads keys **only** from `--env-file=.env.agent-eval`, a founder-created file, never `.env.local`.
16. **Evidence files.** Commit evidence under `docs/evidence/agent/<slice>/`, by explicit path. Don't leave untracked files in `work-diary/`.

## Decisions (Claude, as CEO/CTO)

- **The $20 English pilot is still not approved.** The founder decides when a1, a2 and b are built and the probe results are in. b's worst-case projection is about $35.30, so b must offer a **reduced matrix that fits under $20** (one checker repetition instead of two) as the default. The full matrix stays behind a separate approval.
- **Reviewer:** the founder is the sole English reviewer for the pilot (696 judgments). Report the progress toward that, and keep the work splittable into ≤1-hour sessions.
- **Role slugs** are the founder's env settings in `.env.agent-probe`, and the escalation model doubles as the baseline. They aren't needed until the probe runs.

Keep the gate message short. No production code.
