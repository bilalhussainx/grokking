# S3 — Evidence cache, citations, refresh job and cross-list rule engine (effort: High)

## Why
These are differentiators 1, 2 and 5 (04-RESEARCH-BRIEF §1): **no competitor checked shows cited, dated, cycle-scoped facts or runs rule checks across a student's whole list.** The best-documented competitor failure is a wrong deadline (CollegeVine invented a Dartmouth ED II). Students lose real chances when a tool is wrong about the Oxford/Cambridge rule, a second Early Decision, or a UCAS 18:00 UK cut-off. Everything later (roles, Today, money, landing claims) builds on this.

## Read first
- 02-SPEC §4.6 (evidence cache) and §4.7 (rule engine): binding.
- 04-RESEARCH-BRIEF §0 (trust order), §3 and §5.
- `docs/research/2026-09-27-agent-differentiation-research.md`:
  - §3, the job-to-be-done tables with rules and sources by stage, US/UK/Canada;
  - §4, the 40 seeds, which become tests;
  - §5, the sources and automation flags;
  - §6.2, the refresh design;
  - §9, source URLs and (D)/(I) tags.
- `docs/superpowers/specs/2026-09-25-counselor-agent-design.md` §4 (tool names `list_requirements`, `verify_claims`, `request_refresh`) and §8 (freshness thresholds).
- Existing code:
  - `src/lib/cc/agent/date-check.ts` (`redactUngroundedDates`, `echoCheck`);
  - `src/lib/cc/agent/read-tools.ts`, `contracts.ts` and `loop.ts` (how tools and output checks plug in);
  - `src/lib/applications/ed-strategy.ts`, which folds into the rule engine;
  - `src/lib/cc/uk/*` and `src/lib/cc/canada/*` (deadlines, admissions tests, grade conversion);
  - `src/data/uk`, `src/data/canadian`;
  - `cc_schools`.

## Scope

### A. Evidence store
1. **Migration `<date>_public_evidence.sql`:** the `cc_public_evidence` table exactly as in 02-SPEC §4.6, plus `cc_evidence_allowlist(entity_key, domain)` and `cc_evidence_refresh_jobs(id, entity_key, claim_key, status, error, created_at, finished_at)`.
   - RLS: `published` rows are readable by any authenticated user; writes are service-role only.
   - Do not apply to production; stop at deploy and ask.
2. **Curated seed:** `supabase/seed/evidence-2026-27.json` plus a loader script `scripts/evidence/seed.ts` (it runs against the local or dev DB; production is the founder's step).
   - Seed at least these, each with a verbatim quote and URL:
     - **UCAS:** 15 Oct 2026 18:00 UK and 13 Jan 2027 18:00 UK; PS 3 questions, 350 minimum each, 4,000 total characters; fee £34.50 for up to 5 choices; ≤ 4 medicine/dentistry/vet choices.
     - **Oxford:** UAT-UK booking closed 28 Sep 2026; tests 12–16 Oct; TARA, ESAT and TMUA; one course; not both Oxford and Cambridge.
     - **OUAC:** Group A/B definitions; Group A 15 Jan 2027; $159 for 3 choices plus $51 each extra.
     - **UBC:** 15 Jan 2027 and 1 Dec 2026 for scholarships.
     - **Waterloo:** AIF by 1 Feb 2027.
     - **UC:** 1 Oct–30 Nov 2026; 4 of 8 PIQs, 350 words; TAG campuses.
     - **FAFSA 2027–28:** open; federal deadline 30 Jun 2028.
     - **CSS:** $25 plus $16; waivers.
     - **Harvard:** REA rules; SAT/ACT required for fall 2027.
     - **Dartmouth:** ED 1 Nov, RD 1 Jan, no ED II.
     - **NACAC:** May 1, one deposit, no waitlist fee, one pending ED.
   - **Re-fetch every (I)-tagged item** with WebFetch before seeding, and record `fetched_at` as today. Anything you can't confirm goes in with `status: "quarantined"` and a note.
   - **Sources that forbid scraping** (Common App, College Board, UCAS pages, OUAC): it's fine for a human to read one page and record one fact by hand (`method: "curated"`); do not script fetches of those domains.

### B. Tools and citation rendering
3. **Read tools in the agent registry:**
   - `list_requirements({ entity, cycle })`;
   - `verify_claims({ claims: [{ entity, claim_key, value }] })` → `{ verdict: "supported" | "contradicted" | "unknown", evidence_id? }`;
   - `request_refresh({ entity, claim_key })` (queues a job, returns `queued`).

   Add them to the S1 agent tool definitions (they're read-only, so no proposal flow).
4. **Output check `evidence-citation`:**
   - Any date, amount, fee, deadline or requirement in agent output must reference an evidence id returned in this turn. Otherwise it's redacted to "not yet verified for 2026–27", extending the existing `date-check` hook.
   - Model-written URLs are stripped.
   - The server renders `[[ev:<id>]]` markers into citation chips.
5. **Components:** `src/components/cc/evidence/{CitationChip,NotVerified,RuleConflictCard}.tsx` per 03-DESIGN §4b. "I can check" calls `POST /api/cc/evidence/refresh` (auth; rate limit 10/day per user; deduplicated per entity and claim).

### C. Refresh job
6. **`/api/cron/evidence-refresh`** (cron-secret protected, like the existing crons) processes queued jobs and items past the freshness thresholds:
   - search restricted to the allowlist domains (Exa or Firecrawl via a server key; if neither key exists, mark the job `needs_key` and stop);
   - fetch;
   - sha256 the content;
   - extract with a strict JSON schema (cheap model through OpenRouter) that **must** return a verbatim quote;
   - validate deterministically: the quote is in the fetched text, the date parses, the cycle matches;
   - publish, or quarantine with the reason.
   - Never fetch flagged domains.
   - Spend guard: ≤ 200 refreshes/day, configurable.
7. **Admin page `/admin/evidence`:** list, filter, approve quarantined rows, add curated rows (with the URL and quote required), and see job errors. Admin-only, using the existing admin auth.

### D. Cross-list rule engine
8. **`src/lib/cc/rules/`:** pure functions `checkList(input) → Conflict[]`, where `Conflict = { code, severity: "block" | "warn", title, explanation, evidenceIds[], fix?: { kind, args } }`. Rules: everything in 02-SPEC §4.7. Each rule reads its facts from evidence rows passed in, so there are no hard-coded dates. Fold `ed-strategy.ts` in, keeping its tests green.
9. **Wiring:**
   - Run `checkList` on school-list or plan changes (server) and on agent turns via `check_list_rules`.
   - Surface conflicts on `/applications` and `/my-schools` with `RuleConflictCard`.
   - Feed the S4 `rule_conflict` trigger: write to the existing nudge inbox for flagged users; everyone else gets a page banner only.
10. **Fix the PS limits:** wherever the product counts UCAS personal statement length, use **characters** (350 minimum per question, 4,000 total) from evidence. An earlier fix touched this; verify and test it.

## Tests first
- **Evidence schema:** a date without a quote fails; a quarantined row is never returned to the agent.
- **The citation check:** a reply with "Nov 1" and no evidence id gets redacted; with an evidence id, it's kept and rendered as a chip; a model URL is stripped.
- **Refresh validation:** a quote not in the page gives quarantine; a cycle mismatch gives quarantine; a flagged domain is never fetched (assert on a fetch spy).
- **Rule engine table tests.** Use 09-27 §4 seeds #12, #13, #20, #19 (medicine cap), #24 (Group A), #35 (TAG), #38 (two deposits) and #21 (PS characters) as cases, with fixture evidence.
- **API:** refresh rate limit; admin-only routes.

## Acceptance
- At least 40 published evidence rows (curated plus fetched), each with a quote and URL. Quarantined rows are listed in the ledger.
- The rule engine passes all of its seed cases.
- The S1 agent golden-set cases about dates now cite evidence or abstain: 0 ungrounded dates.

## Prod checks (after the founder applies the migration and runs the seed)
1. As the QA student, add Harvard (REA) and an EA private school: a conflict card appears with the Harvard source chip.
2. Ask the agent (flagged) "When is the UCAS deadline for Oxford?": it answers 15 Oct 2026, 18:00 UK, with a chip.
3. Ask "Dartmouth ED II deadline?": it answers that there's no ED II, with a chip.
4. Ask about a school with no evidence: it says "not yet verified", and "I can check" queues a job.
5. The admin page lists the job.
