# KairosLearn Strategic Audit — Claude.ai Projects Brief

**Date:** 2026-05-02
**Companion to:** `2026-05-02-openclaw-audit-brief-v2.md` (browser-required tests)
**Run in:** [Claude.ai Projects](https://claude.ai/projects) — NOT OpenClaw, NOT Claude Code
**Why Projects:** these questions are "read code + market context + reason about strategy" — no browser needed. Projects is 60-80% cheaper for that workload because there are no per-action page-state tokens, no screenshot inflation, no HAR overhead. Each prompt below is a single 2-4K-input + 2-4K-output conversation, ~$0.30 each.

---

## Setup (one-time, ~10 minutes)

1. Open [claude.ai/projects](https://claude.ai/projects) → **Create project** → name "KairosLearn strategic audit".
2. **Set the project instruction** to:
   > You are a senior advisor to the founder of KairosLearn (kairoslearn.com), an AI college admissions counselor for first-gen, international, and underprivileged students. The repo is uploaded to this Project as Knowledge. When answering, ground every claim in the actual codebase or external market data — never speculate. If a fact requires data we don't have (e.g., live competitor pricing), say so explicitly and propose how to gather it.
3. **Upload as Project knowledge** (drag into the Knowledge panel):
   - `CLAUDE.md` (project context)
   - `docs/reports/2026-05-02-openclaw-audit-brief-v2.md` (so the model knows what's being browser-tested separately)
   - `src/data/school-application-plans.json`
   - `src/data/school-deadlines-2026.json`
   - `src/data/cc/supplements-2025-26.ts`
   - `src/lib/cc/coach-prompt-builder.ts`
   - `src/app/cc/dashboard/variants.ts`
   - `src/lib/cc/variant-walkthroughs.ts`
   - `package.json`
   - `todo-features/IMPLEMENTATION-ORDER.md`
4. **Pick model:** Sonnet 4.6. (Opus is overkill for these prompts.)

That's it. Now run the prompts below in any order. Each is independent.

---

## Prompt 1 — Indispensability bar per persona

**Why:** the v1 brief asked this in § 7.1 but a browser can't answer it. Strategic.

```
For each of these seven user types, give me:
(a) The single sentence that expresses what would make KairosLearn indispensable to them.
(b) Where the platform CURRENTLY stands against that bar (cite specific routes / files from the Knowledge).
(c) The single highest-leverage gap to close — concrete, not "improve X."

User types:
- Grade 9 (variant g9)
- Grade 10 (variant g10)
- Junior, US first-gen (variant junior)
- Senior, international Pakistani (variant senior_writing → senior_post_submit → senior_decisions)
- Transfer applicant (variant transfer)
- Parent of a senior who doesn't read English well
- High school counselor managing 50 students

Format as a 7-row table. Be opinionated. If a row is currently "demo-ware", say so.
```

Expected output: a clear 7-row table with concrete asks per row.

---

## Prompt 2 — International expansion: Canada, Hong Kong, Mainland China, Singapore

**Why:** v1 § 7.2 asked the same. Strategic decision: build, wait, or partner per market.

```
For each of these markets, answer:
(a) What student-side data does KairosLearn need to seed (admit rates, predicted-grades systems, language requirements, application platforms)?
(b) What changes are needed in coach-prompt-builder.ts and variant-walkthroughs.ts? (Both are uploaded.)
(c) What in the current platform PORTS as-is vs. NEEDS rebuilding?
(d) Effort estimate: small (1 week), medium (1 month), large (3+ months).
(e) Build / wait / partner recommendation for 2026.

Markets:
- Canada (UofT, McGill, UBC, Waterloo, McMaster) — OUAC for Ontario, no Common App
- Hong Kong (HKU, HKUST, CUHK) — JUPAS for locals + non-JUPAS for internationals
- Mainland China (Tsinghua, Peking, Fudan, SJTU) — separate intl admissions, HSK testing
- Singapore (NUS, NTU, SMU) — high overlap with HK infrastructure

Anchor each recommendation in: KairosLearn's stated ICP is Pakistani / South Asian / first-gen. Where do these markets overlap with that ICP?
```

Expected output: 4 markets × 5 questions = ~20-cell answer plus a single "do this in 2026" recommendation.

---

## Prompt 3 — Top 10 missing features (prioritized)

**Why:** v1 § 7.3 asked this. The list of categories is in the brief; you want a ranked output.

```
The previous audit identified 14 candidate missing features:
1. Net Price Calculator aggregator (one form → 20 schools' NPCs)
2. Merit scholarship matcher per profile
3. Aid offer comparison + negotiation script generator
4. Common App + UC + Coalition + ApplyTexas dashboard
5. Recommendation letter portal (counselor uploads PDF)
6. Yield protection model (waitlist/deny prediction)
7. Demonstrated interest tracker
8. Plagiarism + AI-detection guard for student drafts
9. Adaptive practice problems for SAT/ACT
10. Bulk student dashboard for counselors managing 20+ kids
11. Weekly digest email for parents (now possible — Resend wrapper just shipped)
12. Visa / I-20 tracker post-admit
13. ASSIST.org articulation integration for California CCs
14. High school + zip-code-aware school suggestions

Rank these top-10 for KairosLearn given:
- ICP = Pakistani / South Asian / first-gen / international
- Current Stripe Pro is $12/mo
- The team is small (one engineer)
- A few features overlap with what's already shipped — flag those

For each top-10, give:
- Effort (S/M/L)
- ICP fit (high/medium/low)
- Revenue impact (which Pro features get more sticky)
- The single concrete thing that ships first
```

---

## Prompt 4 — Top 5 depth gaps with concrete fixes

**Why:** v1 § 7.4. Looking at *existing* features, where does the user hit a wall in 2-3 minutes of use?

```
Without browser-testing, infer the top 5 depth gaps in shipped features by reading the code in the Knowledge. For each:
(a) Feature name + where it lives in the repo.
(b) The depth gap (specifically: what hits a wall after 2-3 minutes of real student use?).
(c) Concrete fix with effort estimate.
(d) Revenue / retention argument for fixing it.

Anchor in:
- src/lib/cc/coach-prompt-builder.ts (mode definitions)
- src/lib/cc/variant-walkthroughs.ts (per-grade walkthroughs)
- src/app/cc/dashboard/variants.ts (which tools surface per variant)
- supplements-2025-26.ts (count of seeded prompts)
- school-deadlines-2026.json (count of seeded schools)

Examples of depth gaps to look for: "school list contains only 30 schools", "supplement prompts only cover 15 schools", "interview personas only cover Ivy+", "first-gen guidance is generic", etc. Don't just listthe categories — name the FEATURE and the GAP.
```

---

## Prompt 5 — Competitor positioning

**Why:** v1 § 7.5. KairosLearn vs. CollegeVine vs. Crimson vs. Naviance vs. AdmitYogi.

```
Give me a positioning matrix comparing KairosLearn to:
- Naviance / Scoir / MaiaLearning (school-issued, counselor-centric)
- CollegeVine (free + $400/mo Premium, AI-guided)
- Crimson Education ($30k-50k+ private counseling)
- AdmitYogi (AI essay tool, ~$30/mo)
- Polygence (mentor-matching, $1500-3000)
- Empowerly (~$8k human + AI)

Axes:
- Price tier
- AI vs. human counseling
- Multilingual coverage
- First-gen / international focus
- Aid sophistication (NPC, CSS Profile, scholarship matching)
- Counselor-facing tools
- Geography

Then answer:
1. Where does KairosLearn already win? (Cite specific code/features.)
2. Where is it behind? (Be honest.)
3. What ONE positioning sentence should KairosLearn lead with? (something Crimson can't match at $50k and CollegeVine can't match at $400/mo)
4. Who is the realistic Year-2 competitive threat?
```

---

## Prompt 6 — Financial Aid & Scholarships scorecard

**Why:** v1 § 6.2. Live "what's actually wired up" needs OpenClaw, but **what's missing in the market vs. what's built** is a desk question.

```
The platform has these aid surfaces (per Knowledge):
- /api/cc/financial-aid (likely a stub — confirm by checking what fields it returns)
- /api/cc/aid-offers (route exists)
- /api/cc/scholarships (route exists)
- a030d2f shipped a CSS Profile guide
- 30 international-aid-policy schools seeded (1a9e6e4)
- Pakistan-specific tail in coach-prompt-builder

Score the platform on a 0-10 indispensability scale: "Could a Pakistani parent rely on this to make the affordability call before their child applies?"

Then list, in priority order, what would push the score from N to 10:
1. Domestic FAFSA walkthrough — exists or stub?
2. CSS Profile depth — guide exists; what's missing for completeness?
3. Net Price Calculator integration (link out / ingest / replace?)
4. Merit scholarship matcher per school (USC Trustee, Vanderbilt CV, Duke Robertson, etc.)
5. External scholarship search (HEC Pakistan, Inlaks, Aga Khan, Common App fee waiver, QuestBridge…)
6. Aid offer comparison
7. Country-specific scholarship lists (Pakistan, India, Bangladesh, Nigeria)

For each, recommend "build / link out / partner / skip."
```

---

## Prompt 7 — Counselor / parent indispensability deep-dive

**Why:** v1 § 6.4 had two sub-audits; the parts that don't need a browser are here.

```
KairosLearn ships these counselor / parent surfaces (from Knowledge):
- /cc/share-settings (toggle per-section)
- /cc/shared/{token} (public read-only view)
- /parent/{token} (parent portal — d4f623c)
- /cc/family page (just shipped — invite + alignment)
- /api/cc/family-alignment (just shipped)
- Family Mode voice (during coach session)

Compare against what real counselors get from Naviance / Scoir / MaiaLearning. List:
1. What KairosLearn ALREADY does better than school-issued tools.
2. What Naviance does that KairosLearn lacks (deal-breakers for school-paid adoption).
3. The minimum surface needed for a high school counselor managing 50 students to actually adopt KairosLearn.

For parents specifically: KairosLearn's parent surface is "during" (Family Mode) and "static" (parent portal). Most parents want "async digest". Design the weekly digest email — what fields, what cadence, what tone for an Urdu/Hindi/Punjabi speaker?
```

---

## Prompt 8 — Where to spend the next 4 weeks of engineering

**Why:** synthesis of all the above into a single prioritized backlog.

```
Given everything you've learned from prompts 1-7, give me a 4-week engineering plan with:

Week 1: [single most important thing]
Week 2: [next]
Week 3: [next]
Week 4: [next]

Constraints:
- One engineer (me).
- Stripe Pro is $12/mo and live since 2026-05-01.
- Resend transactional email just shipped.
- Variant-aware Coach Kairos is shipped + drift-tested at 0%.
- Audit gaps closed yesterday (parent portal, family alignment, deadline reminders, brag-sheet PDF, ED $-figure, grade-9 guards, confidence chart).
- ICP = Pakistani / first-gen / international, but I want to expand to Canada in Q3 2026.

For each week, include: (a) the one feature shipped, (b) the metric it moves, (c) what I should NOT do (avoid scope creep).
```

---

## Output format for the final synthesis

After running all 8 prompts, save the responses to:

```
docs/reports/2026-05-02-kairoslearn-strategic-audit-result.md
```

with sections matching prompt numbers (1-8), so it lines up with the v1 brief's § 7 + § 6.2 + § 6.4.

---

## Estimated total cost in Projects

8 prompts × ~$0.40 average = **~$3.20 total**, vs. ~$10 if you ran the same questions through OpenClaw. Plus you keep the conversation editable — re-run a prompt with tweaks for free in the same context.

---

## What this brief intentionally does NOT cover

These belong in OpenClaw (see `2026-05-02-openclaw-audit-brief-v2.md`):
- Live persona walkthroughs against production
- Variant transition tests (Hassan senior_writing → senior_post_submit)
- Stripe checkout end-to-end with test card
- Mobile viewport rendering
- Real coach latency / first-token timing
- Parent invite Resend deliverability

If a Projects answer requires browser data ("how many schools are actually seeded?"), the model will tell you to check the OpenClaw audit. That's by design — keep the two files in sync.

---

**End of strategic brief.**
