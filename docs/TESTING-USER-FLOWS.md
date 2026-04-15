# User-flow testing guide — college prep + career prep SPs

> **Last updated:** 2026-04-15
> **Scope:** Every SP shipped so far from `CollegeVCareers.md`. Each section below
> lists the *manual* clickpath plus the *automated* spec that proves it.
>
> **Two tracks:**
> - **College prep** — SP-1/2/3/6/7/9/10/11/13/15 + shared (journey, blog).
> - **Career prep** — SP-12 (pathways), SP-16 (resumes), shared interview history.

---

## 0 · Before you start

### Prereqs

```bash
# One-time
cp .env.example .env.local   # fill OPENROUTER_API_KEY + SUPABASE_* + PADDLE_*
npx supabase db push         # apply every migration under supabase/migrations/
npm install
```

### Running the app

```bash
# Terminal 1 — app
npm run dev

# Terminal 2 — visual-verify harness (uses reuseExistingServer)
npm run test:sp

# After screenshots land
OPENROUTER_API_KEY=sk-or-... npm run verify:sp
# → reads tests/sp-verify/screenshots, writes tests/sp-verify/report.md
```

### Test account

`testuser789@test.com` / `AuditPro2026!` (same account the e2e suite uses).
Seed realistic data once with:

```bash
node scripts/seed-interview/seed-college-data.mjs   # if present
# or manually: fill /college-interviews profile → /activities → /essays/new → /resumes
```

---

## 1 · SP-13 — journey banner (stage-aware next-best-action)

### What it does
Reads signals from `college_applicant_profile`, `essay_drafts`, `resume_docs`, recent `interview_sessions` and shows a stage-coloured banner with the highest-leverage next action.

### Manual flow
1. Sign in as an empty user → home page shows **"Welcome — let's get oriented"** (state: `discovering`).
2. Fill out `/college-interviews` profile (major + top project) → refresh home → banner flips to **"Profile in place"** (state: `profile_building`).
3. Start an essay at `/essays/new`, save as drafting → banner flips to **"Drafting essays"**.
4. Push it to `review` → banner flips to **"Polishing essays"**.
5. Do a mock interview (even 1 message) → banner flips to **"Interview practice mode"**.

### Acceptance
- Banner title + message + two CTA buttons always render.
- Stage colour changes across the 5 states.
- CTAs link to the right route (`/essays`, `/college-interviews`, etc).

### Automated
`tests/sp-verify/SP-13-journey.spec.ts` + `criteria/SP-13.json`.

---

## 2 · SP-9 — application-readiness score

### What it does
Deterministic 0-100 composite of 5 pillars (profile / activities / essays / interviews / resume). No LLM.

### Manual flow
1. Sign in. Home page → **Application readiness** card sits beside the interview block.
2. Score starts near 0 for an empty account. Click each pillar → lands on its canonical route (`/college-interviews`, `/activities`, `/essays`, `/college-interviews`, `/resumes`).
3. Fill activities with descriptions ≥ 80 chars → activities pillar climbs.
4. Mark an essay `done` → essays pillar jumps by 35.
5. Complete a college interview → interviews pillar is driven by average `overall_score` × 0.7 plus +10 per session up to 30.

### Acceptance
- Composite = `profile*0.15 + activities*0.25 + essays*0.30 + interviews*0.20 + resume*0.10`.
- Each pillar is clickable (whole row is a `<Link>`).
- Colours: green ≥ 80, yellow ≥ 60, orange ≥ 30, else dim.

### Automated
`SP-9-readiness.spec.ts` — captures home after login; verifier inspects that 5 pillars render.

---

## 3 · SP-1 — interview scorecard block

### What it does
Surfaces last 3 college interview sessions with per-session overall/communication/problem-solving scores and deep-link to the results page.

### Manual flow
1. Sign in → home page → **Recent interviews** card next to readiness.
2. If no sessions → empty state with "Start one" CTA to `/college-interviews`.
3. Complete a college interview (`/college-interviews` → pick school → go) → row appears on home next visit with overall /10.
4. Click row → lands on `/college-interviews/<sessionId>/results` with full scorecard.

### Acceptance
- Avg score is the arithmetic mean of `overall_score` across the returned rows.
- Each row shows date + persona id.
- Link target is `/college-interviews/<session_id>/results`.

### Automated
`SP-1-scorecard.spec.ts`.

---

## 4 · SP-2 — activities manager

### What it does
CRUD for `college_activities`. Save-on-blur, 8 category options, 0/600 char counter.

### Manual flow
1. `/activities` (linked from TopNav) → empty state.
2. Click **Add an activity** → a new editable row appears.
3. Fill title → blur → PATCH fires → row persists on reload.
4. Click trash → confirm → row gone.

### Acceptance
- TopNav link present.
- Add button creates a row with title/role/category/hrs-wk/wks-yr/description fields.
- Delete requires confirmation and removes the row.

### Automated
`SP-2-activities.spec.ts` (existing) — empty + post-Add.

---

## 5 · SP-10 — essay workbench

### What it does
Multi-essay list + new-essay editor with Common App presets and probe-hint extraction.

### Manual flow
1. `/essays` → list of existing drafts or empty state.
2. Click **New essay** → `/essays/new` → textarea + 7 preset prompt buttons.
3. Click a preset → prompt fills in above the textarea.
4. Write body → autosave.
5. Open a finalised essay → probe hints generated from the body (cached in `essay_probe_hints`).
6. Start a college interview — probe hints flow through to the voice-agent system prompt under **PRE-FLIGHT PROBE HINTS**.

### Acceptance
- 7 Common App presets render.
- No `&apos;` / `&quot;` artefacts in preset text.
- Probe hints are an array of `{moment, question, rationale}`, max 5.

### Automated
`SP-10-essays.spec.ts` (existing).

---

## 6 · SP-11 — dynamic persona (any school)

### What it does
"Don't see your school?" input → Sonnet generates a full persona JSON → cached in `college_personas_dynamic` → selectable in setup.

### Manual flow
1. `/college-interviews` → scroll past school grid to the text input.
2. Type `Rice University` → click **Generate**.
3. Loader ~20s → success line appears; the grid below shows the generated persona as the selected school.
4. Start interview → voice agent uses Rice-specific schoolFitTopics/antiPatterns.

### Acceptance
- Input + Generate button visible below grid.
- Generated persona sets `collegePersonaId` to the newly created id.
- Subsequent visits skip the LLM call (cached).

### Automated
`SP-11-dynamic-persona.spec.ts` (existing, captures the input).

---

## 7 · SP-7 — school-fit evaluator

### What it does
Given applicant profile + activities + latest essays, produces a school-specific fit report via Sonnet.

### Manual flow
1. `/college-fit` (linked from `/college-interviews` back-nav).
2. Pick a school from the dropdown → click **Evaluate fit**.
3. Loader ~10s → score 0-100, one-line read, strengths, gaps (with suggestions), next moves.
4. Re-evaluate same school → returns **cached** badge immediately.

### Acceptance
- Score 0-100, colour-coded.
- ≥1 strength AND ≥1 gap when profile is non-empty.
- Cached subsequent call returns in < 300ms.

### Automated
`SP-7-fit.spec.ts`.

---

## 8 · SP-15 — multi-country coverage

### What it does
Adds UK (Oxford, Cambridge, LSE) + CA (Toronto, McGill, UBC) personas. Country tabs filter the school grid.

### Manual flow
1. `/college-interviews` → 3 country tabs at top of school grid.
2. Click **🇬🇧 United Kingdom** → grid re-renders to UK-only schools.
3. Click **🇨🇦 Canada** → grid flips to CA schools.
4. Select Oxford → start interview → agent uses tutorial-style opening.

### Acceptance
- 3 tabs render with flags.
- US tab is default selected.
- Grid filters deterministically by `persona.country`.

### Automated
`SP-15-multicountry.spec.ts`.

---

## 9 · SP-6 — common-questions bank

### Manual flow
1. Visit `/college-interviews/questions/harvard-undergrad` (public, pre-auth).
2. Themed question groups render; each has ≥ 3 questions.

### Automated
`SP-6-questions-bank.spec.ts` (existing).

---

## 10 · SP-3 — parent dashboard

### What it does
Student generates a 12-char share code → parent visits `/parent/<code>` without signing in → read-only snapshot of readiness + profile + essays + activities + interviews.

### Manual flow
1. Sign in as the student → POST `/api/parent-share` with label `"Mom"` → receive code.
2. Open `/parent/<code>` in an incognito window → dashboard renders.
3. Revoke code via DELETE `/api/parent-share?code=<code>` → page flips to **"Share link revoked"**.

### Acceptance
- Revoked/expired codes show the gate, not the data.
- No client-side auth required to view.
- No edit affordances.

### Automated
`SP-3-parent.spec.ts` — POSTs a code then loads `/parent/<code>`.

---

## 11 · SP-14 — blog

### What it does
Index at `/blog` pulls from `src/data/blog-posts.ts`. 5 posts: 2 AI-education + 3 college/career.

### Manual flow
1. `/blog` → 5 cards, newest first.
2. Click **What Alumni Interviewers Actually Write in Their Reports** → full post renders with shell layout.
3. Back → other cards still there.

### Automated
`SP-14-blog.spec.ts`.

---

## 12 · Career track — SP-16 resume optimizer

### What it does
Upload PDF/DOCX resume → parse → optionally paste JD → Sonnet rewrite with accordion diff.

### Manual flow
1. `/resumes` → upload zone.
2. Drop a PDF → parse succeeds → card appears.
3. Click card → `/resumes/<id>` → original sections accordion.
4. Fill **target_role** + paste JD → **Rewrite** → stream tokens into the right pane.
5. Toggle **show original** → diff view.

### Acceptance
- Upload accepts PDF + DOCX; parser uses `pdf-parse` v2 named export.
- Rewrite streams via SSE-like chunks.
- Result persists in `resume_rewrites`.

### Automated
`SP-16-resumes.spec.ts` (existing) — list + empty state.

---

## 13 · Shared surfaces

### TopNav
- Shows `/activities`, `/essays`, `/resumes`, `/talk` for authed users.
- `/credentials` link surfaces when Pro.

### `/credentials`
- SP1 diploma grid — verify `/verify/<tokenId>` is public (middleware allow-list).

---

## 14 · Running the verifier end-to-end

The harness is in `tests/sp-verify/`. Every criteria file is strict (vague evidence → `unclear`).

```bash
# 1) Capture (dev server must be running)
SP_VERIFY_ONLY=SP-7 npm run test:sp   # one SP
npm run test:sp                       # all

# 2) Review with vision model
OPENROUTER_API_KEY=sk-or-... npm run verify:sp

# 3) Open the report
# tests/sp-verify/report.md   ← pass/fail per criterion + missingScreenshots suggestions
```

If a criterion falls under `missingScreenshots`, add a new step to the matching `SP-*.spec.ts` to capture that view.

---

## 15 · Quick clickpath — sanity smoke

A 5-minute smoke covering every shipped SP:

1. Sign in → home → **JourneyBanner** + **ReadinessCard** + **InterviewScorecardBlock** all render.
2. `/activities` → add one.
3. `/essays/new` → save a short draft.
4. `/resumes` → upload resume.
5. `/college-interviews` → country tab switch → pick school → start mock → exit.
6. `/college-fit` → evaluate for same school.
7. `/blog` → open any college post.
8. Generate share code → open `/parent/<code>` in incognito.
9. Home page readiness composite should now be materially > 0.

If every step above renders without a 500 and the readiness composite climbs as you fill data, the college-prep path is healthy. The career-prep path is covered by steps 4 + 7 (resume + careers post) today; SP-12 (career pathways) is still pending.
