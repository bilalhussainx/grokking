# S9 — Role workflows: story bank, weekly plan, full mock interview, balanced list, requirements checklist (effort: Medium; use High if the S4 tables changed shape)

## Why
These are the workflows that make the firm feel real (02-SPEC §5). S4 gave each role its brain and S5 its face; S9 gives each role the one screen where its work lives. Each workflow must save something the student can see again.

## Read first
- 02-SPEC §5.1 to §5.6.
- The ledger for S4, S5 and S7 (table names, rulings).
- Existing code to reuse:
  - interview prep: `src/app/cc/interview-prep/**`, `src/components/interview/*`;
  - the school list: `src/app/my-schools`, `src/app/schools`, `src/app/api/cc/school-list/*`;
  - applications: `src/app/applications/**`, `src/lib/applications/ed-strategy.ts`;
  - essays: `src/app/cc/essays/**`, `src/components/cc/essay/*`.

## Scope (each one is a sub-slice; commit and test each)
1. **Weekly plan (Kairos):** a `/cc/plan` page and a Today card.
   - Shows the week's 3 tasks (from the S4 `weekly_plan` proposals), done states, swap (asks Kairos for an alternative) and a counselor-assigned badge.
   - A Sunday summary of what got done and what's next, written by Kairos in ≤ 60 words.
2. **Story bank (Wren):** `/cc/essays/stories`.
   - Story cards with the student's quote, tags and mapped prompts.
   - A gaps view ("UCAS Q2 has no story yet").
   - "Start a 10-minute story interview" opens the dock with Wren in voice or text.
   - On the outline step of an essay, offer "Build from my stories". Outline bullets reference story ids and the student's own phrases. Add a test that outline bullets contain no sentences not traceable to the student's quotes, beyond short connective labels.
3. **Full mock interview (Sam):** reuse the interview sessions.
   - Add the style picker (US alumni / Oxford-style academic conversation with think-aloud problem reasoning / Canada program), with no scripted answers and no claims to know real questions, and a rubric (content, specificity, structure, delivery; 1–4 each, with one quoted moment as evidence per score).
   - The transcript has highlights, and two practice tasks are proposed to the plan.
   - The hot seat (S5) results appear in the history.
4. **Balanced list (Leo):** a panel on `/my-schools`.
   - **No personal chances.** Balance is computed from **published admit rates with their year** (S3 evidence or Scorecard/CDS), in plain tiers:
     - "most applicants are admitted" (≥ 50%);
     - "about 1 in N admitted";
     - "fewer than 1 in 10 admitted".
   - The panel also shows affordability fit (S8 data when present: "no affordable likely school yet" is a warning) and system mix (UCAS max 5, medicine cap, OUAC Group, Common App, UC).
   - **Retire the chance bands:**
     - remove `reach|match|safety` labels from the school list UI;
     - change `api/cc/chances/*` to return the published-rate tier with a citation, or delete it if unused;
     - in `coach-actions-block.ts`, `coach-agents.ts`, `coach-extract.ts` and `coach-prompt-builder.ts`, keep the parsing backward compatible, but stop prompting or displaying "safety".
     - Write tests that fail if "safety" or a "% chance" string reaches the UI.
   - "Ask Leo to suggest 2 more" produces a `propose_add_schools` with one sourced reason each (fit, affordability or rate tier), never "you'll get in".
5. **Requirements checklist (Juno):** per school on `/applications`.
   - Covers essays, tests, recommenders, portfolio, interview and supplements outside the main portal (e.g. the Waterloo AIF), from S3 evidence. Unknown shows "not yet verified" plus "I can check" (`request_refresh`).
   - Conflicts come from the S3 rule engine as `RuleConflictCard`s with plain-language ethics notes from Part 2 Topic 9.
   - Recommenders link to the existing tracker, plus a **FERPA waiver explainer** (09-27 seed #34) and a thank-you reminder task when a letter is marked submitted.
   - The brag-sheet interview collects the student's own facts to share with recommenders. Kairos never drafts the teacher's letter.

## Tests first
One per sub-slice:
- the plan page states;
- the story mapping and gaps;
- the outline traceability;
- the rubric scoring shape and evidence quotes;
- the list balance math (rate tiers, UCAS 5-choice cap, medicine cap);
- no "safety" or "% chance" in rendered output;
- the checklist with unknown fields;
- the FERPA explainer matches the evidence (you can change the decision only until the first recommender submits or you submit your first application).

## Evidence
Screenshots at 375 and 1440 of each new screen, plus one end-to-end Playwright journey per workflow as the QA student (flagged).

## Prod checks
For each workflow, the QA student completes it once and the saved artifact appears on Today or in the journey map.
