# S8 — Role workflows: story bank, weekly plan, full mock interview, balanced list, requirements checklist (effort: Medium; use High if the S3 tables changed shape)

## Why
These are the workflows that make the firm feel real (02-SPEC §5). S3 gave each role its brain and S4 its face; S8 gives each role the one screen where its work lives. Each workflow must save something the student can see again.

## Read first
- 02-SPEC §5.1 to §5.6.
- The ledger for S3, S4 and S6 (table names, rulings).
- Existing code to reuse:
  - interview prep: `src/app/cc/interview-prep/**`, `src/components/interview/*`;
  - the school list: `src/app/my-schools`, `src/app/schools`, `src/app/api/cc/school-list/*`;
  - applications: `src/app/applications/**`, `src/lib/applications/ed-strategy.ts`;
  - essays: `src/app/cc/essays/**`, `src/components/cc/essay/*`.

## Scope (each one is a sub-slice; commit and test each)
1. **Weekly plan (Kairos):** a `/cc/plan` page and a Today card.
   - Shows the week's 3 tasks (from the S3 `weekly_plan` proposals), done states, swap (asks Kairos for an alternative) and a counselor-assigned badge.
   - A Sunday summary of what got done and what's next, written by Kairos in ≤ 60 words.
2. **Story bank (Wren):** `/cc/essays/stories`.
   - Story cards with the student's quote, tags and mapped prompts.
   - A gaps view ("UCAS Q2 has no story yet").
   - "Start a 10-minute story interview" opens the dock with Wren in voice or text.
   - On the outline step of an essay, offer "Build from my stories". Outline bullets reference story ids and the student's own phrases. Add a test that outline bullets contain no sentences not traceable to the student's quotes, beyond short connective labels.
3. **Full mock interview (Sam):** reuse the interview sessions.
   - Add the style picker (US alumni / UK academic / Canada program) and a rubric (content, specificity, structure, delivery; 1–4 each, with one quoted moment as evidence per score).
   - The transcript has highlights, and two practice tasks are proposed to the plan.
   - The hot seat (S4) results appear in the history.
4. **Balanced list (Leo):** a panel on `/my-schools`.
   - Shows the reach/match/likely mix (the existing estimates, labeled "estimate"), cost fit (S7 data when present) and system mix (UCAS max 5 choices; OUAC; Common App).
   - "Ask Leo to suggest 2 more" produces a `propose_add_schools` with one sourced reason each.
5. **Requirements checklist (Juno):** per school on `/applications`.
   - Covers essays, tests, recommenders, portfolio and interview, from data with sources; unknown shows "not yet verified" plus a "verify" link.
   - ED/EA conflicts come as Juno proposals with plain-language ethics notes from Part 2 Topic 9.
   - Recommenders link to the existing tracker.

## Tests first
One per sub-slice:
- the plan page states;
- the story mapping and gaps;
- the outline traceability;
- the rubric scoring shape and evidence quotes;
- the list balance math (UCAS 5-choice cap);
- the checklist with unknown fields.

## Evidence
Screenshots at 375 and 1440 of each new screen, plus one end-to-end Playwright journey per workflow as the QA student (flagged).

## Prod checks
For each workflow, the QA student completes it once and the saved artifact appears on Today or in the journey map.
