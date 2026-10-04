# Agentic Counselor build: runbook for Codex (GPT 6.1 Sol)

Written 2026-10-04 by Claude (CTO role) for the founder and for Codex. This folder is the whole handoff: context, spec, design direction, research and one prompt per slice. Codex runs one slice per session, in order. Each slice ends deployed and verified, or it ends with a clear BLOCKED report.

## Files

| File | What it is | Who reads it |
|---|---|---|
| `00-RUNBOOK.md` | Order, effort level, gates, how to start a session | Founder, Codex |
| `01-CONTEXT.md` | Repo, stack, commands, rules, current state, gotchas | Codex, every session |
| `02-SPEC.md` | The product: Kairos companion, specialist roles, workflows, surfaces | Codex, every session |
| `03-DESIGN-DIRECTION.md` | Visual and interaction direction | Codex, UI slices |
| `04-RESEARCH-BRIEF.md` | Competitors, student pain points, voice findings, data rules | Codex, every session |
| `slices/S0-*.md` … `slices/S9-*.md` | One self-contained prompt per slice | Codex, one per session |

## Order and effort

| # | Slice | Effort | Depends on | Ships to students? |
|---|---|---|---|---|
| S0 | Workspace, baseline, ledger | Medium | none | No |
| S1 | Voice core: role prompts, reply cap, latency probe (7 Deepgram languages) | High | S0 | Yes |
| S2 | Indic voice: all 10 Sarvam languages routed and streaming | High | S1 | Yes |
| S3 | Roles engine: Kairos orchestrator plus 6 specialist playbooks with evals | High | S1 | Yes, behind flag |
| S4 | Companion UI: Kairos everywhere, handoffs, "take me there" | High | S3 | Yes, behind flag |
| S5 | Landing page and `/counselors` page | High | S1 to S4 shipped (claims) | Yes |
| S6 | Today dashboard and counselor work queue | High | S3, S4 | Yes |
| S7 | Money: scholarship and aid finder, FAFSA/CSS walkthrough | High | S3 | Yes |
| S8 | Role workflows: story bank, weekly mentor plan, interview hookup | Medium | S3, S4 | Yes |
| S9 | Rollout: flags on, live checks in 17 languages, claims sync | Medium | all | Yes |

Use **High** for anything that touches the agent loop, voice transport, auth, money data or the database. **Medium** is enough for S0, S8 and S9. If a Medium session reports two failed attempts at the same step, rerun that slice on High.

## How to start each Codex session

Paste this, replacing `SN-file`:

```
You are implementing one slice of the KairosLearn Agentic Counselor build.
Working directory: C:\Users\bilal\Downloads\grokking-codex (see 01-CONTEXT.md if it does not exist yet).
Read, in this order, before touching code:
  docs/handoff/codex-prompts/agentic-counselor/01-CONTEXT.md
  docs/handoff/codex-prompts/agentic-counselor/02-SPEC.md
  docs/handoff/codex-prompts/agentic-counselor/04-RESEARCH-BRIEF.md
  docs/handoff/codex-prompts/agentic-counselor/03-DESIGN-DIRECTION.md   (UI slices only)
  docs/handoff/codex-prompts/agentic-counselor/slices/SN-file.md
Then read .agent/codex-ledger.md to see what earlier slices did.
Write your own task-by-task plan for this slice into .agent/codex-plans/SN.md before coding.
Work test-first. Do not start the next slice.
```

## Gates (every slice)

A slice is done only when all of these are true, with output pasted into the report:

1. **Tests:** `npx vitest run src` is green, and the new tests were seen failing first. Name them in the report.
2. **Types:** `npx tsc --noEmit -p .` shows no new errors in files you touched.
3. **Build:** `npx next build` succeeds in the Codex worktree. That worktree must have a real `node_modules`, not a junction (see 01-CONTEXT gotchas).
4. **UI evidence (UI slices):** Playwright screenshots at 375x812 and 1440x900 of every changed screen, saved under `docs/qa/evidence/codex-SN/`. No horizontal overflow at 375.
5. **Claims check:** every user-facing claim you added is true in code today. Use the claims table in 02-SPEC §9.
6. **Deploy:** merge to `refocus/admissions-only`, push that branch, then `git push origin refocus/admissions-only:master`. Poll `gh api repos/bilalhussainx/grokking/commits/<sha>/status` until `success`.
7. **Production smoke:** run the slice's prod checks against https://www.kairoslearn.com with the QA accounts in 01-CONTEXT. Record the results.
8. **Ledger:** append to `.agent/codex-ledger.md` and `.agent/VALIDATION_LOG.md`: commits, tests, evidence paths, deferred items and rulings.

## Stop and ask the founder (do not work around these)

- Applying a migration to the production database. Write the migration, test it locally against the schema, then stop and ask.
- Setting or rotating secrets or Vercel env vars.
- Turning a feature flag on for real students (beyond the QA allowlist).
- Anything that emails or messages real users.
- Spending more than $5 of API credit on one slice's tests or evals.
- A spec conflict where every option is a guess.

For any other ambiguity, decide, write `Ruling: <decision> — <why> — <cost if wrong>` in the ledger and keep going.

## Report format (end of every session)

```
STATUS: DONE | DONE_WITH_CONCERNS | BLOCKED
Slice: SN <name>
Commits: <sha list>   Deployed: master <sha> (Vercel success | not deployed)
Tests: <new test names>, suite <passed>/<total>
Evidence: <paths>
Prod checks: <each check: pass/fail + one line>
Rulings: <list>
Founder actions needed: <list or none>
Deferred: <list>
```
