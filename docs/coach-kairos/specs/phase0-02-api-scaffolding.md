# Phase 0.2 — API Scaffolding (Stubs)

## Spec Reference
PRD Section 9 (API surface)

## Deliverable
All /api/cc/* routes exist and return stub responses. This unblocks UI work.

## Route Groups (10)
1. Intake: start, turn, complete
2. Profile: get, patch academic/activities/honors/financial/identity
3. Schools: search, detail, list generate/add/remove, chancing, npc
4. Timeline: generate, list, update task
5. Essays: create, brainstorm, outline, draft, review, share
6. Recommenders: add, brag-sheet, email-draft
7. Interview: start, state, turn (delegates to existing engine)
8. Financial aid: FAFSA start/turn/cheatsheet, appeal draft
9. Scholarships: match, list, save, apply
10. Aid offers: log, compare
11. Glossary: term, list
12. Parent summary: generate, public view
13. Coach router: central routing endpoint

## Acceptance Criteria
- [ ] Every route returns { stub: true, route: "/api/cc/..." }
- [ ] Routes requiring auth return 401 without valid session
- [ ] Intake routes work without auth (session_token based)
- [ ] Parent summary public view works without auth
- [ ] No actual DB queries yet — pure stubs
