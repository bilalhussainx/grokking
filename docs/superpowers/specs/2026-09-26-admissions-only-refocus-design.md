# Admissions-only refocus: retire the study-courses product

_2026-09-26. Owner: Claude (CEO/CTO role). Founder request: "remove the courses, it should just focus on An AI Admissions Counselor Agent Platform instead of providing courses to study. Its for students to get into college mainly."_

## Decision

KairosLearn is an AI college-admissions counselor platform: Coach Kairos, school list, essays (the AI never writes prose), activities, aid and net price, FAFSA, family mode, college interviews, applications, the counselor workspace, and billing. The learning product goes: the course catalogue, lessons and code exercises, language courses and `/talk` tutoring, tech/coding interview prep, career pathways, classrooms and live lesson sessions, XP/gems/leaderboard/achievements, and course-completion credentials.

## What "course" still means

A student's **high-school coursework** (AP/IB rigor, `/cc/courses`, transcripts, `cc_*` tables) is admissions data and stays. Nothing under `src/app/cc`, `src/lib/cc`, `src/components/cc` or `/counselor` is removed by this work.

## Rules

1. **Code only, no database changes.** Learning tables (`lesson_progress`, `xp_transactions`, `user_gamification`, credentials tables, language profiles, etc.) keep their rows. Dropping them is a separate, founder-approved migration no sooner than 30 days after this ships.
2. **Every retired page URL redirects** to the nearest admissions surface. Redirects are temporary (307) for the first release, so a reversal is cheap. Make them permanent after 30 days.
   - Coding interviews go to `/cc/interview-prep`.
   - `/dashboard` goes to `/cc/dashboard`.
   - `/onboarding/language` goes to `/onboarding`.
   - `/admin` and `/admin/courses` go to `/admin/survey`.
   - Everything else goes to `/`, which already routes signed-in users to their dashboard and signed-out visitors to the homepage.
3. **Retired API routes are deleted** and return 404. No retained client calls them.
4. **Shared infrastructure stays.** The voice stack is used by Coach Kairos and college interviews:
   - hooks: `useVoiceAgent`, `useDeepgramAgent`, `useOrchestratedVoiceAgent`, `useCoachVoice`;
   - libraries: `language-personas`, `voice-provider-router`;
   - language routes: `translate`, `tts`, `persona-config`, `analyze-session`, `sarvam/stream`, `ai/voice-session`.

   So does the college-interview stack: `components/interview/*` used by `/college-interviews` and `/cc/interview-prep`, plus `interviews/{plan,session,score,text-message}`.
5. **Tech-interviewer personas** (`src/data/interview-personas.ts`) stay in this release, because the shared interview routes import them dynamically. Making those routes college-only is follow-up F1.
6. **Guest and signed-in routing:** `/` renders the Daybreak homepage for signed-out visitors. Any session, guest or real, on `/` goes to `/cc/dashboard` with its query string kept (`coach=open`, `focus=intake`). The legacy course home in `src/app/page.tsx` is removed.
7. **SEO and meta:**
   - The sitemap, `llms.txt`, `llms-full.txt`, the manifest and the WebSite schema describe the admissions product.
   - No course, lesson, pathway, blog or comparison URLs.
   - `robots.ts` drops `/credentials`.
8. **Pricing copy** never mentions courses. `src/lib/pricing.ts` is already clean. The legacy `PricingCards`/`PaywallModal` components are deleted: they have no importers.

## Out of scope (follow-ups, logged in `docs/handoff/claude-progress.md`)

- F1: make the interview routes college-only and delete the tech personas.
- F2: `/call` (Twilio live translation), `/writing` (legacy doc pipeline) and `/history` are not learning and not clearly admissions. They need a founder decision.
- F3: drop the learning tables (a migration, founder go, 30 days or more after release).
- F4: trim `lib/credits.ts` learning actions (`hint`, `grade`, `lesson_generation`, `course_complete`, `streak_bonus`) after F3.
- F5: update the repo `CLAUDE.md` "Samsara.ai" section. The file is the founder's; Claude proposes the edit.
- Design of the admissions-only IA (nav, dashboard, app shell) belongs to Codex session B (D4.2). This work only removes dead links and entries.

## Success criteria

- No page or API route of the retired product exists. Each retired page URL redirects as in rule 2.
- No shipped source file links to a retired URL, calls a retired API, or imports the course catalogue.
- `src/data` holds only the admissions keep-set:
  - `college-interviewer-personas.ts`, `interview-personas.ts` (F1);
  - `school-application-plans.json`, `school-deadlines-2026.json`, `supplement-prompts-2026.json`;
  - `canadian/`, `uk/`, `cc/`.
- The `tsc` type-check passes, `npx vitest run src` is green, and `npm run build` succeeds, all in a clean worktree.
- The student-variant e2e passes.
- First-load weight of `/`, `/pricing` and `/login` is no worse than 975 / 617 / 621 KiB.
