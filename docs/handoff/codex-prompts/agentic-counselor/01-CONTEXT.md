# 01 — Context every session needs

## The product in one paragraph

KairosLearn (https://www.kairoslearn.com) is an AI admissions counselor for high-school students applying to the US, UK and Canada, including transfer students. Coach Kairos talks by text and voice, builds school lists, plans deadlines, coaches essays (it never writes them), runs mock interviews and brings in parents through family mode. Agencies of human counselors use the same platform to manage their students. Pricing: Free is 200 credits once at signup; Pro is $15/month or $99/year with a 7-day trial and no card. The source of truth is `src/lib/pricing.ts`. The site claims 18 coach languages (`src/lib/coach-language-claim.ts`, never hard-code the number).

## Repo and branches

- GitHub: `bilalhussainx/grokking`. **The repository is PUBLIC.** Never commit secrets, API keys, QA passwords, student data or `.env*` files. Before every commit, run `git diff --cached | grep -nE "sk-or-|sk_[a-z0-9]{6,}_|[0-9a-f]{40}"` and stop if it matches anything that is not a test fixture.
- Release branch: `refocus/admissions-only`. Production is `master`. Vercel deploys `master`.
- Founder's docs branch: `feat/counselor-marketplace` in `C:\Users\bilal\Downloads\grokking`. Do not touch it; it holds uncommitted founder work.
- Claude's release worktree: `C:\Users\bilal\Downloads\grokking-integrate` (branch `refocus/admissions-only`). Do not edit files there while Claude may be working. Codex works in its own worktree (below).

### Codex worktree (S0 creates it)

```bash
cd /c/Users/bilal/Downloads/grokking-integrate
git fetch origin
git worktree add ../grokking-codex -b codex/agentic-counselor origin/refocus/admissions-only
cd ../grokking-codex
pnpm install                      # real node_modules; NOT a junction (Turbopack rejects junctions)
cp ../grokking-integrate/.env.local .env.local   # git-ignored; holds keys and QA_* logins
```

Each slice is merged into `refocus/admissions-only` (fast-forward when possible; otherwise rebase `codex/agentic-counselor` onto it first), then deployed.

## Stack

Next.js 16 App Router (Turbopack), React 19, TypeScript strict, Tailwind 4, Supabase (Postgres plus RLS; `createServerSupabase` for user-scoped calls, `createAdminSupabase` only server-side after an auth check), Stripe, Vercel (Fluid Compute, Node runtime), vitest 4 plus jsdom, Playwright, pnpm, Windows plus Git Bash.

AI providers:
- **OpenRouter:** text coach and agent loop. Key `OPENROUTER_API_KEY`, server-only. The account balance is small; keep evals cheap.
- **Deepgram:** the Voice Agent (STT nova-3, TTS aura-2, and a **Deepgram-hosted LLM**, `think.provider {type:"anthropic", model:"claude-haiku-4-5" | "claude-sonnet-4-5"}`). The browser gets a 30-second token from `/v1/auth/grant` (`src/lib/voice/deepgram-agent-auth.ts`). The key is never sent to the browser.
- **Sarvam:** STT (saaras/saarika) and TTS (bulbul v3) for the 10 Indic languages. Header `api-subscription-key`.
- Moonshot and Gemini keys exist but are legacy; do not add new uses.

## Commands

```bash
npx vitest run src                       # unit suite (about 160 s). NEVER `npm run test:unit` (it hits the production DB)
npx vitest run path/to/file.test.ts      # one file
npx tsc --noEmit -p .                    # typecheck
npx next build                           # build (only in a worktree with real node_modules)
npx playwright test path/to/spec.ts      # one e2e file only; never the whole e2e folder
```

Playwright scripts outside the test runner: run from the worktree root with `createRequire(process.cwd()+"/package.json")` to load `playwright`. Read QA logins from `.env.local`: `QA_STUDENT_EMAIL`, `QA_STUDENT_PASSWORD`, `QA_COUNSELOR_EMAIL`, `QA_COUNSELOR_PASSWORD`. Never print them. Login page selectors: placeholder `you@example.com`, placeholder `Your password`, button `Sign in`.

Deploy:

```bash
git push origin refocus/admissions-only
git push origin refocus/admissions-only:master
gh api repos/bilalhussainx/grokking/commits/<sha>/status --jq .state   # poll until success
```

## Hard rules

1. **The AI never writes essay prose for a student.** It can interview, outline the student's own ideas, question, critique and point at sentences. A request to write is declined warmly, with a "3 questions instead" path (`ESSAY_WRITING_REQUEST` in `src/lib/cc/agent/s1-turn.ts`).
2. **No fabricated facts.** Dates, deadlines, amounts and policies come from data with a source, or the AI says "not yet verified for 2026–27". `src/lib/cc/agent/date-check.ts` redacts ungrounded dates; keep it on every agent path.
3. **Agent writes are proposals.** Every write the agent wants goes preview, then confirm, then commit (`src/lib/cc/agent/proposals.ts`: canonical payload hash, signed confirm token, a `committing` state, 10-minute undo). No silent writes.
4. **No secrets client-side.** Any setting object sent to the browser must be free of keys. There is a regression test: `src/app/api/__tests__/voice-session-secrets.test.ts`.
5. **Auth on every API route.** Use `supabase.auth.getUser()`. Never trust a `student_id` from the request body. Counselor reads go through the agency-scope helpers in `src/lib/cc/` (roster and agency membership).
6. **Template literals:** course or content strings in TS template literals must escape `${` and backticks.
7. **Design:** Daybreak tokens only (`src/styles/daybreak-tokens.css`, components in `src/components/ui/daybreak`). Read 03-DESIGN-DIRECTION.md.
8. **Copy:** no em dashes in UI copy. Plain words a 16-year-old understands. Explain every admissions term on first use (glossary linking exists: `/glossary`, inline term linking).
9. **Commits:** explicit `git add <paths>`, never `-A`. Message ends with `Co-Authored-By: claude-flow <ruv@ruv.net>`.

## Current state (2026-10-04)

Shipped and live:
- **Essays:**
  - brainstorm, 3 outline options, draft coach, version compare, multi-axis review;
  - supplement reuse and overlap detection, and word limits;
  - the UCAS 3-question personal statement.
- **Schools:**
  - search, detail, saved list and AI list generation;
  - LLM "chance estimate" bands (call them estimates);
  - UK and Canada catalogs, deadlines and grade conversion for a limited set of schools.
- **Applications:** board, calendar (iCal) export, ED/REA conflict check (`src/lib/applications/ed-strategy.ts`).
- **Reminders:** deadline emails at 14, 7, 3 and 1 days (`/api/cron/deadline-reminders`).
- **Today dashboard:** `src/components/cc/today/*` (one next step, ongoing work, "Your people"), with grade 9, junior and transfer variants.
- **Coach Kairos:** text (`/api/cc/coach/message`); voice (`src/components/cc/coach/CoachChat.tsx` → `/api/cc/coach/voice-prompt` → `/api/ai/voice-session`).
- **Other tools:** interview prep (voice, personas, reflections), activities optimizer, recommender tracker with brag sheet, waitlist LOCI drafts, test strategy, summer, visits, glossary, family mode, parent share link.
- **Counselor side:**
  - agency roster (head sees all, counselor sees assigned);
  - inline essay comments with review states, and a head review of junior counselors' comments;
  - invite codes, priced services with Stripe, and Connect payouts.

Built, dark (behind flags), not yet on for students:
- Agent A1+S1 (`src/lib/cc/agent/*`): an OpenRouter tool loop with a checker.
  - Read tools: `read_context`, `read_essay`, `read_published_feedback`.
  - Journey tools: `get_journey_state`, `list_my_schools`, `check_plan_conflicts`, `get_essay_status`.
  - Proposal tools: `propose_task`, `propose_calendar_hold`, `propose_add_schools`.
- Nudge triggers `plan_conflict`, `essay_stall` and `inactivity` (`triggers.ts`, cron `/api/cron/agent-nudges`).
- Inbox and activity log (`inbox.ts`, `/api/cc/agent/{turn,inbox,activity,nudges/[id],proposals/[id]}`, UI `src/components/cc/agent/{KairosInbox,ProposalCard,ActivityLog}.tsx`, page `/cc/agent/activity`).
- Flags: `AGENT_S1_ENABLED=1` plus the `AGENT_S1_USER_IDS` allowlist (`s1-flag.ts`). Migration `supabase/migrations/20261003_agent_s1.sql` is **not applied to production** (founder step). `AGENT_CONFIRM_SECRET` must be set (≥32 chars) before the flag goes on.
- Known S1 gaps: turns are stateless (no conversation history) and there is no `propose_fact_change`.
- Rulings that bind further agent work: `docs/evidence/agent/rulings-a1-s1.md`. The design spec: `docs/superpowers/specs/2026-09-25-counselor-agent-design.md`.

Stubs, so do not claim them:
- `api/cc/scholarships/*` returns empty;
- `financial-aid/fafsa/*`, `aid-offers/*` and `appeal/draft` are stubs;
- `api/cc/chancing/calculate`;
- `/counselor/session/*` (live sessions);
- `/counselor/admit-history` (scaffold).

Net price is rule-based for about 12 schools.

Voice today (see `docs/qa/2026-10-04-voice-language-validation.md`):
- Auth is fixed and the language is passed (commits e5e3362, 6b1d025).
- The coach voice prompt is about 24k characters, so Deepgram truncates it (`PROMPT_TOO_LONG`) and replies run 26 to 64 words.
- Measured latency from end of speech to first audio is 1.1 to 1.5 s for en and es with today's prompt, and about 0.9 s with a short prompt and `endpointing:150`. ja is about 2 s.
- The Sarvam route (`src/app/api/language/sarvam/stream/route.ts`) only accepts hi and pa, while the UI offers 10 Indic languages for voice.

## Gotchas

- Turbopack fails with "Symlink node_modules is invalid" in junctioned worktrees; install real `node_modules`.
- A stray `C:\Users\bilal\package.json` once broke tailwind resolution; if "Can't resolve 'tailwindcss' in C:\Users\bilal\Downloads" appears, report it and do not edit files outside the repo.
- CRLF: files are CRLF on disk. Scripted find/replace with `\n` anchors silently misses; prefer exact edits.
- Route modules read `process.env` at import time. In tests, set env in `vi.hoisted` before importing the route.
- `@/lib/supabase` (a client-side client) is imported by some server libs; mock it in route tests or they reach a real client.
- `useCounselorRole` shares one `/api/counselor/me` promise; don't add per-component fetches of the same endpoint.
- Never run the whole e2e folder; it creates real data. QA data only, through the QA accounts.
