# CollegeVCareers — Master Plan

> **Created:** 2026-04-14
> **Owner:** Bilal (product) / Claude Code (implementation)
> **Status:** Living doc. Each numbered sub-project below is self-contained so any future Claude/Kimi session can pick it up without re-deriving intent.

---

## 0. User's Original Prompt (verbatim — do not edit)

> Today I had a conversation with my counselor. He was impressed by the platform but suggested that there is a real market for a Kollegia like app in Canada for Canadian and Pakistani students applying to Colleges where underprivileged kids like from Sindh in Pakistan don't have any idea about which colleges they qualify for according to their GPA or a real jpg virtual capture of images of their grades in high school reading reports in different formats along with other data on the student that is part of commonapp process for colleges in Canada, Pakistan, and the US. So they will get an idea of what resources which you will provide for each college like their gpa requirements, SAT scores average, cv/resume with extra-curriculars, honors, awards, and distinctions. And then also provide a Dashboard for parents. Make tasks to fill all the gaps and make proper commits and design using brainstorm and superpowers for planning of features to fill these gaps in addition to what I highlighted. Real resources and links and blogs that are made by Sonnet for quality and step by step handheld process from questionnaire about whether the user is a student in university, or a student in high school trying to get into colleges, for the university students make the platform customized such that it directs them to jobs access through a board where popular job links are posted whereas for high school students a customized user flow and experience where they are directed to college prep, commonapp, overall evaluation of which universities they should apply to. This experience should be extremely customized and use agentic flow using python and langgraph along with advanced algorithms for recommendation, customization, long term experience as signed in users where their activity on the platform is evaluated for a certain step in their career, or journey to get into colleges, like essay ideation, essay review, along with college interview scorecard being used together to judge each student holistically, provide resources like news about culture of different up to 50 total colleges, use Tavily Search API key I have provided to look for real resources and an agentic flow that allows real-time research on universities. Make a .md of my instructions broken down into smaller problems for claude code to handle and implement. Then follow that detailed document to implement everything I have said, copy my prompt at the top of the .md file that you will be executing, lets call it COLLEGEVCareers.md
>
> **Gap 1 — No "Why This School" specific coaching**
> This is the single most important college interview question and KairosLearn doesn't appear to coach it specifically. Every admissions counselor will tell you this. Ask him to confirm.
>
> **Gap 2 — No essay-to-interview bridge**
> Students work hard on their Common App essays. The interview often references those themes. KairosLearn doesn't let students input their essay or activities list so the AI can ask interview questions that connect to their specific story.
>
> **Gap 3 — No parent-facing dashboard**
> His clients are high school students — but the parents are paying the admissions counselor. A parent progress view ("your child practiced 3 sessions this week, here are their scores") would be a powerful B2B feature for counselors like him.
>
> **Gap 4 — Missing schools**
> Northwestern, UChicago, Duke, Georgetown, NYU, Vanderbilt, Emory, USC, Notre Dame are all common targets. If a student is applying to Duke and you don't have Duke, they'll go elsewhere.
>
> **Gap 5 — No session history for students**
> Can students look back at their previous interview sessions and track improvement over time? If not, that's a retention problem for serious applicants who practice repeatedly.
>
> **Gap 6 — No "common questions" bank**
> Students want to see the 10-15 most common alumni interview questions per school. Even a simple reference list alongside the practice session would add value.

---

## 1. Product Vision — one paragraph

Samsara.ai becomes the holistic **college-and-careers companion** that follows a learner from "I'm a high schooler in Sindh with only a phone camera and a transcript PDF" → shortlist of realistic-fit universities → Common App / UCAS / Canadian application prep → essay ideation + review → alumni interview practice → admitted. And for university students: pivots the same account into career-mode with a curated job board, resume grading, and career interview prep. One account, two modes, lifetime context.

The distinguishing layer is a **Python + LangGraph agentic research service** that uses the Tavily Search API to do real-time, citation-backed research on up to 50 universities (culture, news, GPA/SAT ranges, scholarship availability) rather than hard-coding stale facts.

---

## 2. Audience-split routing (new top-level feature)

**Status:** Not built. Blocks most high-school features.

At signup (or first visit for existing users without a set mode), show a **one-question questionnaire**: *"Where are you today?"* with 3 options:

1. **High school student — applying to college** → "college-prep mode"
2. **University student — preparing for jobs** → "careers mode"
3. **Working professional — upskilling** → "courses mode" (existing default)

Persist to `user_profile.track ENUM('college_prep','careers','courses')`. The TopNav, homepage, and sidebar all re-render based on this value. Users can switch tracks from settings.

Acceptance: a brand-new user sees the split screen once, picks a track, is redirected to the matching dashboard, and never sees it again unless they change it in settings.

---

## 3. Gap-driven sub-projects (numbered, executable independently)

Each sub-project below is self-contained: it lists **goal, files to touch, acceptance criteria, dependencies.** A future Claude Code session can pick any SP and ship it.

### SP-1 — "Why This School" coaching (Gap 1) — SMALL

- **Goal:** Every college interview explicitly probes "why this school" at least twice, scored as its own rubric dimension.
- **Files:**
  - `src/lib/college-interview-prompt-builders.ts`: add mandatory "Why This School" question in Session 1-3 behavior rules.
  - `src/app/api/interviews/score/route.ts`: bump `schoolFit` rubric weight and add dedicated "whyThisSchoolAnswer" field in the scorecard JSON.
  - `src/components/college/CollegeInterviewScorecard.tsx`: surface the why-this-school evaluation as its own callout block.
- **Acceptance:** After any college interview, scorecard shows a "Why {{School}}?" block with specific-moment feedback.
- **Deps:** none.

### SP-2 — Essay-to-interview bridge (Gap 2) — PARTIALLY DONE 2026-04-13

Already shipped on 2026-04-13:
- `collegeEssay` field on `college_applicant_profile` + textarea in `CollegeInterviewSetup`.
- Essay injected into the interviewer system prompt (capped at 4000 chars).

**Still to build:**
- **Activities list / extracurriculars**: separate structured field (table: `college_activities(user_id, title, role, hours_per_week, weeks_per_year, description, category)`). The AI should cross-reference activities when asking follow-ups ("you listed debate — tell me about a round that didn't go your way").
- **Essay critic pass**: before the interview, run the essay through a pre-flight LLM pass that extracts 3-5 "specific moments the interviewer should probe" and injects them into the prompt as hints.
- **Multi-essay support**: students write supplementals per-school. Add a `college_essays(user_id, school_id, prompt, body)` table so the AI can also reference the school-specific essay.

Acceptance: a student who pasted their Common App essay sees the alumni interviewer ask about a specific image/moment from that essay within the first 10 minutes.

### SP-3 — Parent-facing dashboard (Gap 3) — MEDIUM

- **Goal:** Parents get a read-only progress view of their child's interview practice + essay work, invited by the student via email.
- **Data model:**
  - `parent_student_links(id, parent_user_id, student_user_id, invited_at, accepted_at, relationship)`.
  - Inviter flow: student goes to `/settings/family` → enters parent email → email sent with magic-link invite.
- **Routes:**
  - `/parent` — parent dashboard showing all linked students.
  - `/parent/[studentId]` — per-student view: sessions this week, score trend chart, strengths/weaknesses rollup, essays written (title + word count, NOT body unless student opts in to share).
- **Privacy:** students own a kill-switch (`parent_student_links.student_visibility: 'scores_only' | 'scores_and_feedback' | 'revoked'`).
- **Acceptance:** Parent logs in, sees their kid's three sessions this week, the trend chart slopes up over time, can drill into one scorecard. Student can revoke access at any time and the parent immediately loses visibility.
- **Deps:** none.

### SP-4 — Missing schools (Gap 4) — SMALL — ✅ SHIPPED THIS SESSION

Added to `src/data/college-interviewer-personas.ts`:
- Northwestern, UChicago, Duke, Georgetown, NYU, Vanderbilt, Emory, USC, Notre Dame (9 schools).
- Each with full persona: 6 school-fit topics, 6 signature question themes, 5 anti-patterns, 3 opening lines, closing note, report template.
- `src/components/college/CollegeInterviewSetup.tsx` — emoji map extended.

**Stretch (deferred to SP-11):** expand to full 50 schools across US/Canada/UK via the LangGraph research agent rather than hand-writing each.

### SP-5 — Session history (Gap 5) — MEDIUM

- **Goal:** Signed-in students can view all past interview sessions with timestamps, school, scores, and a "compare to last session" delta.
- **Data model:** already have `interview_sessions` + `interview_performance` (tech interviews). Need a parallel `college_interview_sessions(id, user_id, college_persona_id, session_number, started_at, ended_at, scorecard_json)`.
- **Routes:**
  - `/college-interviews/history` — table of past sessions with sparklines of 5-dimension scores over time.
  - Detail view re-uses `CollegeInterviewScorecard` in read-only mode.
- **Write path:** `CollegeInterviewScorecard` should persist to this table the moment the scorecard is generated.
- **Acceptance:** after 3 mock interviews with Harvard, the student sees a list of 3 rows, can click any, and sees a line chart of their `authenticity` score climbing from 6 → 7 → 8.

### SP-6 — Common-questions bank (Gap 6) — SMALL — ✅ SHIPPED THIS SESSION

- **Data:** `src/data/college-common-questions.ts` — 10-15 real alumni interview questions per school (public-information grounded: r/ApplyingToCollege threads, alumni interviewer guides, College Confidential). Each question has `{ question, category, source }`.
- **UI:** `/college-interviews/questions/[schoolId]` — list view + study mode. Linked from `CollegeInterviewSetup` ("See common {{School}} questions →").

### SP-7 — Fit evaluator / shortlist builder (core new feature) — LARGE

This is the "Sindh student with a phone and a transcript" user story.

- **Inputs:**
  - User uploads **transcript/grade report image** (JPG/PNG/PDF) → OCR → structured grades (subject, grade, term).
  - User enters **SAT/ACT score** (optional), **IELTS/TOEFL** (optional), **country of residence**, **target country** (US/CA/UK/PK).
  - User enters **intended major**, **budget constraint**, **need financial aid**.
- **OCR pipeline:**
  - Client captures image → `/api/fit/ingest-transcript` → Google Vision / Tesseract fallback → structured JSON.
  - Show the extracted table to the user for correction before saving.
- **Shortlist engine:**
  - For each of the 50 schools in scope: compare student's GPA (normalized) and test scores to the school's published 25th/75th percentile ranges.
  - Classify as **Reach / Target / Safety** with a probability estimate (+ confidence band).
  - Surface scholarship/aid programs relevant to the student's profile (via Tavily research — see SP-8).
- **Route:** `/fit` — a wizard flow (profile → transcript upload → targets → shortlist).
- **Acceptance:** A student uploads a Pakistani matriculation result image, adds their SAT, and sees 15 schools split into 5 reach / 5 target / 5 safety, each with a one-paragraph "why this fits" written by Sonnet referencing their actual numbers.
- **Deps:** SP-8 (Tavily research service) for the "why this fits" paragraphs and scholarship data.

### SP-8 — Python + LangGraph research service (core new feature) — LARGE

- **Why separate service:** Next.js is not the right home for long-running multi-step agent graphs, token-heavy context assembly, and caching of Tavily results across users. Python + LangGraph + a thin FastAPI layer is.
- **Repo layout:** `services/research-agent/` (new, pnpm-workspace-sibling or separate repo).
- **Capabilities:**
  - `POST /research/university` with `{ schoolId, questions: string[] }` → returns cited facts (GPA range, SAT range, tuition, deadlines, culture summary, news highlights from last 90 days).
  - Cached in Postgres (`university_research_cache(school_id, question_hash, answer, citations, fetched_at)`) with 7-day TTL on dynamic fields (news), 90-day on stable fields (GPA stats).
  - LangGraph graph: `route → tavily_search → extract_citations → synthesize → self_critique → return`.
  - Tavily API key from `TAVILY_API_KEY` env var.
- **Next.js integration:** new `/api/research/university/route.ts` proxies to the Python service. If Python service is down, falls back to a "basic info only" path that reads the existing static `collegeFitTopics` from the persona file.
- **Deployment:** service runs on the same VPS that hosts SadTalker; expose only on tailscale or behind auth.
- **Acceptance:** calling `/api/research/university?schoolId=duke&q=recent-news` returns 3-5 news bullets with live links dated within the last quarter.

### SP-9 — Holistic student evaluator (Gap continues) — MEDIUM

- **Goal:** Combine essay scores + interview scorecards + profile completeness + activity-list depth into a single "admissions readiness" readout.
- **Output:** `/college-prep/readiness` — a radar chart + a Sonnet-written paragraph ("based on your essay and 3 interviews, your biggest lever right now is specificity in the 'why Duke' answer").
- **Inputs used:**
  - Avg of recent interview scorecard dimensions.
  - Essay critic output (SP-2).
  - Activity-list density and quality (SP-2).
  - Fit-evaluator shortlist strength (SP-7).
- **Deps:** SP-2, SP-5, SP-7.

### SP-10 — Essay ideation + review workbench — MEDIUM

- `/college-prep/essays` — new page.
- Two modes: **ideation** (student picks a prompt, AI asks probing questions, outputs 3 angles to try) and **review** (student pastes a draft, AI returns line-by-line suggestions + overall verdict).
- Uses the same user profile + activity list so feedback is personalized (not generic).
- Per-prompt history: drafts v1..vN saved.
- Uses Sonnet for quality.

### SP-11 — 50-college coverage via the research agent — LARGE

- Instead of hand-writing 41 more `CollegePersona` objects, add a **"Load school from research"** code path: when a user picks a school not in the hard-coded list, call the Python service for a structured persona (themes, anti-patterns, opening lines) + cache to `college_personas_dynamic` table.
- Hybrid: keep the 19 hand-authored ones (10 existing + 9 shipped this session) as gold-standard, generate the rest on demand.
- Acceptance: user types "University of Toronto" — in 10 seconds, they have a working interviewer with Canadian-university-specific themes, not a generic fallback.

### SP-12 — Careers-mode (job board + career interview prep) — LARGE

- **Trigger:** track = 'careers' on `user_profile`.
- **Dashboard:**
  - Job board (`/careers/jobs`) — curated role links from Greenhouse / Lever / company pages. Seeded from a `job_listings` table populated by the research agent (SP-8 extension) from a list of ~200 top employers.
  - Resume grader (`/careers/resume`) — student uploads PDF → LLM feedback.
  - Existing tech-interview practice at `/interviews` — already live, re-parented under `/careers/interviews`.
- **Personalization:** the existing skills graph + course completion data scores which roles the student is ready for.

### SP-13 — Long-term user activity evaluator — MEDIUM

- **Goal:** identify which stage of the journey the student is in based on observed activity, so nudges and recommendations are stage-appropriate.
- **States** (for college track): `discovering → profile_building → shortlisting → essay_drafting → essay_polishing → interview_practice → applications_submitted → waiting → admitted/deciding`.
- **State machine:** transitions triggered by activity (uploaded transcript → `shortlisting`; started an essay draft → `essay_drafting`; completed 3 interviews for same school → `interview_practice`).
- **UI surface:** the homepage banner for that track always reflects the current state with the 1-2 next best actions.

### SP-14 — Blog/resources system (Sonnet-authored) — MEDIUM

- **Requirement from user:** "real resources and links and blogs that are made by Sonnet for quality."
- **Data:** `blog_posts(id, slug, title, body_md, author, track, tags[], published_at)`. Authored by Sonnet through a dedicated content pipeline in the research agent service (not user-facing generation — pre-produced curated content).
- **Topics:** "How to answer 'Why Duke'", "Common App activities list — how to write each one", "SAT vs ACT for Pakistani students", etc.
- **Route:** `/resources` + `/resources/[slug]`.

### SP-15 — Multi-country application support — LARGE

- Spec the differences: **US Common App, Canadian OUAC / UBC / McGill, UK UCAS, Pakistani HEC + institution-specific**.
- Per-country checklist components. Shared schema under `application_checklists(user_id, country, school_id, items jsonb)`.
- Deadline tracker with timezone awareness.

---

## 4. Cross-cutting infrastructure needs

- **Track system**: `user_profile.track` column + middleware that redirects users to their track's home.
- **Python service**: new `services/research-agent/` with FastAPI + LangGraph + Tavily. Runs on the existing VPS.
- **Tavily env var**: `TAVILY_API_KEY` (user has provided). Stored in `.env.local` for dev, added to Vercel + VPS secrets.
- **Parent-auth isolation**: Supabase RLS policies ensuring `parent_student_links` only exposes what the student chose to share.
- **Rate limiting**: cache everything Tavily returns — one view of a school by 50 users should result in 1 Tavily call, not 50.

---

## 5. Execution phases (sequence)

**Phase 0 — Quick wins (shipped this session, 2026-04-14)**
- ✅ SP-4: 9 new schools.
- ✅ SP-6: common-questions bank data + UI.
- ✅ SP-1 (partial): "Why this school" prompt emphasis strengthened.

**Phase 1 — Track system + retention wins (1-2 sessions)**
- SP-2 (remaining): activities list + multi-essay table + essay critic pre-flight.
- SP-5: college session history table + UI.
- Audience split (Section 2): the questionnaire router.

**Phase 2 — B2B monetization (2-3 sessions)**
- SP-3: parent dashboard. Biggest willingness-to-pay lift per counselor.

**Phase 3 — The big research + fit pipeline (3-5 sessions)**
- SP-8: Python research service scaffolded + Tavily integration.
- SP-7: fit evaluator + OCR for transcripts.
- SP-11: dynamic persona loader for 50-school coverage.

**Phase 4 — Holistic student experience (2-3 sessions)**
- SP-10: essay workbench.
- SP-9: readiness readout.
- SP-13: activity state machine.
- SP-14: blog system.

**Phase 5 — Multi-country + careers mode (many sessions)**
- SP-12: careers track.
- SP-15: country-specific application flows.

---

## 6. Honest scoping notes

- **Not in one commit.** This doc covers ~8-12 weeks of focused work. Any single session should pick 1-2 SPs.
- **Canada/Pakistan coverage is real work, not cosmetic.** Each country's application system is genuinely different. UCAS is one application for 5 UK universities. OUAC is per-province. Pakistani university admissions go through HEC for some and direct for others. Do not fake it.
- **OCR is risky without calibration.** Handwritten Urdu marksheets will fail generic OCR. Budget for a human-review step in SP-7 where the student confirms extracted grades before saving.
- **Tavily budget is real.** At $0.001 per search and 50 schools × 5 questions = 250 searches per student's initial shortlist, cost management matters. Cache aggressively, dedupe across users.

---

## 7. Commits log for sessions executing this plan

- **2026-04-14 (Phase 0):** SP-4 (9 schools), SP-6 (common questions bank), SP-1 (Why-this-school prompt emphasis), this plan doc.
- *(next sessions log their work here)*
