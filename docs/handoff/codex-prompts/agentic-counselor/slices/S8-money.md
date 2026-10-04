# S8 — Money: scholarship and aid finder, aid forms walkthrough, Ana's tools (effort: High)

## Why
- The founder asked for "access to aid and scholarships". Kollegio and Kolly both have scholarship finders; ours returns an empty list.
- Differentiator 4 is **affordability first**. Competitors lead with "chances"; NACAC's standard is the "best academic, personal, and **financial** college match", and families can be released from ED when aid makes attendance impossible.
- Cost is the first question families ask, especially first-generation and international families.

## Read first
- 02-SPEC §5.4.
- 04-RESEARCH-BRIEF §3 and §5 (data rules: **curate by hand, cite every field**).
- `docs/research/2026-10-03-part2-counselor-playbook.md` Topic 7.
- `docs/research/2026-10-03-part3-systems-rules.md` (FAFSA, CSS, UK and Canada aid sections).
- `docs/research/2026-09-27-agent-differentiation-research.md`:
  - §2.1, the "Financial aid and merit strategy" row: what to do and NOT do;
  - §4 A, seeds #1–#11: FAFSA already open, SAI −1500 is not a refund, contributor consent, FSA ID refusal, special circumstances, CSS fees and waivers, CSS per college, the NPC, Harvard international aid, FAFSA for internationals, ED release;
  - §5, the NPC and studentaid.gov flags.
- Existing code:
  - `src/app/api/cc/scholarships/*` (stubs) and `src/app/api/cc/financial-aid/**` (stubs);
  - `src/app/cc/net-price/page.tsx` and `src/lib/cc/net-price.ts` (rule-based, about 12 schools);
  - `src/components/cc/profile/FinancialForm.tsx` (its copy claims "find scholarships you qualify for"; make that true or change it);
  - `src/components/cc/resources/FirstGenResourcesCard.tsx`;
  - `src/data/uk/uk-scholarships.json` (10 awards) and `src/lib/cc/uk/scholarships.ts` (unused filter);
  - `src/app/parent/aid-explainer`.

## Phase A: data (do this first; it's research)
1. Build `src/data/scholarships/2026-27.json` with **≥ 50 awards**: about 25 US national, about 12 UK (include the existing 10 after re-checking them) and about 13 Canada.
   - Prioritize large, reputable and need-based or first-gen awards: national merit/need programs, QuestBridge (a match program; label it), Gates, Jack Kent Cooke, Coca-Cola, Dell, Burger King, Hispanic Scholarship Fund, Elks; UK university bursaries and named trusts; Loran, Schulich, TD and provincial awards.
   - **Verify each from the award's own official page with WebFetch.**
2. Each record:
   ```json
   { "id", "name", "provider", "country", "url", "checked_at",
     "amount": { "text": "as stated", "min": null|number, "max": null|number, "currency" },
     "deadline": { "text": "as stated", "date": null|"YYYY-MM-DD", "cycle": "2026-27" },
     "eligibility": { "grades": [], "citizenship": [], "need_based": bool|null, "first_gen": bool|null,
                      "min_gpa": null|number, "fields": [], "notes": "as stated" },
     "application": { "essay": bool|null, "recommendations": number|null, "interview": bool|null },
     "source_quote": "≤ 25 words copied from the page supporting the deadline or amount" }
   ```
   - Use `null` when not stated, and never guess.
   - A record whose page doesn't state the 2026–27 deadline gets `deadline.date = null` and `text: "Not yet announced for 2026-27"`.
3. Write `docs/research/2026-10-04-scholarships-sources.md` listing each award, its URL, the checked date and any doubt.
4. A test validates the schema, requires `url` and `checked_at`, and forbids a `deadline.date` without a `source_quote`.

## Phase B: finder plus Ana's tools
1. **Matching:** `src/lib/cc/money/scholarship-match.ts`, a pure function (profile → ranked awards with "why you match" reasons and "check" flags for unknown criteria). Never mark eligible on unknown data; mark "check".
2. **APIs:** `GET /api/cc/scholarships` (list and filter), `GET /api/cc/scholarships/match` (for the signed-in student), `POST /api/cc/scholarships/save`. These replace the stubs. Auth and rate limits apply.
3. **UI:** `/cc/money`, a hub with three tabs:
   - **Scholarships:** matched list with filters (country, need-based, deadline window), save, and add the deadline to the plan (a `propose_calendar_hold` via Ana);
   - **Cost:**
     - Per school, a link to **that college's own net price calculator** (Title IV schools must post one). The student runs it and types the result in; Kairos never submits family finances to an NPC.
     - The existing rule-based estimator stays as a labeled "rough estimate for select schools".
     - Grants are kept separate from loans and work. Unknown is never zero.
     - An **ED affordability check:** if a school on an ED or REA plan has no entered estimate, show a warning plus the NACAC release rule (seed #11).
   - **Forms:**
     - A walkthrough of FAFSA (2027–28 is already open), contributor consent, SAI literacy, CSS Profile (fees and waivers from evidence; participating schools per college, "not yet verified" otherwise), UK Student Finance and provincial aid (OSAP: citizens, PRs and protected persons only).
     - A **special-circumstances checklist** (the student writes and sends the request).
     - All dates and amounts come from S3 evidence.
     - **Refuse FSA ID or credential handling** (seed #4); this uses S10's redaction once it exists, and a fixed refusal now.

   Replace the stubbed FAFSA routes with this content-driven walkthrough (no form filling).
4. **Ana's playbook tools:** `search_scholarships`, `get_cost_picture` and `get_aid_forms` (read tools), plus the existing proposal tools. Add evals for:
   - "how much will Harvard cost me?" (no number without data; route to the NPC);
   - "find me scholarships" (uses the tool, cites URLs);
   - "write my appeal letter" (coaches and doesn't write);
   - 09-27 seeds #1–#11 as written.
5. **Trigger `aid_form_window`:** only from sourced open dates.
6. **Fix the FinancialForm copy** to match reality.
7. **Landing:** S6 shows the aid tile once a server helper `isMoneyHubLive()` returns true. Flip it in this slice after the prod checks pass.

## Acceptance
- ≥ 50 records, all with a URL and checked date, and zero `deadline.date` without a quote.
- Matching tests: an unknown GPA gives "check", never "eligible"; citizenship filters; deadline-passed awards are hidden by default.
- Ana's evals ≥ 90% deterministic pass, with 0 invented amounts or dates.

## Prod checks
The QA student opens `/cc/money`, sees matched scholarships with source links, saves one, adds its deadline through a proposal, and confirms. The calendar hold appears.
