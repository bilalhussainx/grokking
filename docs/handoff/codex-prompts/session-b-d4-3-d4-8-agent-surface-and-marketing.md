**ASTRA — DESIGN SESSION B (continued): D4.3 Coach as an agent, D4.8 one marketing site and pricing, and design review of Claude-built pages.** Start a fresh session. D4.2 is live on kairoslearn.com. Thank you; it was implemented almost exactly as greenlit.

## What changed since D4.2 (don't re-test these)

- D4.2 is in production (master `e6c62aa`, then `f6270b0`…`0bba14b`): the Daybreak frame, Today, Settings, AI badges, and the React #418 fix.
- Phone overflow is fixed on `/schools`, `/cc/essays` and `/cc/activities-optimizer`. A 375px scan of 21 signed-in pages shows 0 overflow.
- `/stories` is offline (307 to home). It showed illustrative named admits; it returns only with verified, consented stories.
- Security fixes:
  - an unauthenticated `/api/cc/coach/extract` was deleted;
  - counselors can no longer attach themselves to an agency by typing its slug.

## Read first

1. **`docs/design/2026-10-03-amendment-c-step-clarity.md`: binding on everything you design from now on.** The founder asked for steps and actions that are easier for students to understand. Amendment C turns that into rules C1–C11 with acceptance checks. In short:
   - lead with the step;
   - every step has a finish line;
   - show the map;
   - one Coach door per screen;
   - one status vocabulary;
   - explain every admissions term;
   - dates carry their source;
   - nothing floats without intent;
   - one visual system;
   - agent-ready slots.
2. `docs/strategy/2026-10-03-agentic-counselor-gap-analysis.md`, especially §4 (what "agentic" looks like to a student) and §7 (UI implications for D4.3). Coach today is a context-aware chatbot (L1). The target is an agent that proposes actions the student confirms, cites sources, remembers with consent, and reaches out first.
3. The D2 agent spec: `docs/superpowers/specs/2026-09-25-counselor-agent-design.md`. Its contracts are binding:
   - preview → confirm → commit;
   - citations only from evidence IDs;
   - no essay prose;
   - an "unknown" state.
4. `docs/design/2026-10-03-landing-audit.md`: the signed-out site audit, with Now/Next/Later items and two hero rewrites.
5. Workflow audits: `docs/qa/2026-10-03-student-workflows.md` and `docs/qa/2026-10-03-counselor-workflows.md`.
6. Competitor research Part 1: `docs/research/compass_artifact_wf-be7cb4e1-71de-5117-b1c0-a0de2600d77f_text_markdown.md`, TL;DR and Recommendations. The white space is:
   - proactive, not reactive;
   - US + UK + Canada + transfer;
   - affordable;
   - not selling student attention;
   - suggestion-only edits.

## What to deliver, in order, each behind its own gate

### D4.3: Coach Kairos as an agent (the conversation surface)

Design the surface for the agent that Claude will build in phases. It must work today as chat, and gain agency without a redesign. Mocks go in `docs/design/mocks/coach/`. Design every one of these:

1. **The "Kairos noticed" inbox.** Agent-started messages are pinned and kept separate from the chat the student started. Each one shows why it appeared (a trigger reason) and offers snooze or not-now.
2. **Proposed-action cards.** Each card has:
   - a title;
   - exactly what will change (a diff such as "Northwestern: EA → RD", "Add 3 tasks", "Add calendar hold Oct 29");
   - "Why?";
   - source chips;
   - Confirm / Edit / Decline.

   States to design:
   - pending;
   - confirming;
   - saved, with 10-minute Undo;
   - expired;
   - declined;
   - failed, with retry.

   Never show "Saved" before the commit is durable. "Confirm all" appears only for homogeneous low-risk items.
3. **Citations and unknowns.** Inline source chips (publisher, "checked Oct 19", link). The first-class **"Not yet verified for 2026–27 — I can check"** state reads as information, not an error.
4. **"What I did and why."** A chronological activity log of reads, proposals, commits, declines and nudges. It's exportable and doubles as the integrity record.
5. **"What Kairos remembers."** Grouped facts (academics, money, preferences, stories, coaching style), each with its source message and date and a confirmed or suggested state. Each fact supports edit, delete and "don't use this". "Forget everything" requires confirmation. Suggested facts appear as cards to confirm.
6. **Nudge settings.** Channel, cadence, quiet hours, gentle or direct style, a pause for a week, and for agency-linked students, what their counselor can see.
7. **Essay integrity moment.** A fixed, warm decline when asked to write prose, with a "let's do 3 questions instead" path. Show it inside chat and inside Essay Studio.
8. **Running states.** Fixed labels ("Checking your deadlines…", "Reading sources…"), a near-limit daily budget, and the Pro fair-use 429 message (not an upsell).
9. **Placement.** Show how proposals surface on Today, inside the next-step card ("Kairos suggests…"), so Today keeps **one** Coach door (Amendment C4). The late-night message moves into this invitation (C9).
10. **Phone first.** Full-width cards, thumb-reachable Confirm/Decline at 44px or more, and citations collapsed to chips.

Use the gap analysis §4 scenarios as the mock fixtures. Label them as fixtures. No invented dates: use "Not yet verified" wherever a date would come from evidence we don't have yet.

### D4.8: One marketing site, and the pricing page

Today the signed-out site uses three visual systems: cream Daybreak (home, FAQ, about), navy and gold (pricing, product, stories) and a black app shell (signup, login, find-counselor). Signup shows two logos. Unify everything signed-out on Daybreak, with one header and one footer, so the homepage leads straight into the app. Mocks go in `docs/design/mocks/marketing/`.

- **Homepage.**
  - The hero must pass the five-second test: it says AI admissions counselor, for the US, UK and Canada, and that the student writes every essay.
  - Start from the audit's two hero rewrites. Add UK to the quiz.
  - Add a mobile header "Start free" button.
  - Put a CTA on the quiz result ("Keep going with Coach Kairos") and scroll the result into view.
  - Then a block that differentiates on three points: it reaches out first, it covers three systems plus transfer, and it never writes your essay.
  - Add a "Why not ChatGPT / a school counselor / a private firm" block using only verifiable statements. Don't quote competitor prices unless a cited source is on the page.
- **Pricing.**
  - All plan facts come from `src/lib/pricing.ts` only: Free is 200 credits once; Pro is $15/month or $99/year, with a 7-day trial and fair use of 300 coach messages and 120 voice minutes a day.
  - One honest trial sentence: what is charged and when, and what each button does.
  - Remove "Free forever", "unlimited everything" and the old 3-schools plan copy.
  - Keep the first-gen/low-income free-Pro banner and the "Why $15?" FAQ.
- **Language count.** Use one true number everywhere. Ask the founder; the site currently says 5, 10 and 18 in different places.
- **Counselor and agency entry.** A path from the homepage and nav for counselors. The "Counselor" nav item currently means the AI. Show what agencies pay, and an honest empty state for `/find-counselor` until a counselor is verified.
- **Trust block.**
  - Founder or team.
  - A privacy summary: "We don't sell your data; no recruiter outreach", but only if true. Ask Claude to verify it in code.
  - Who sees what (parents, counselors).
  - A minors note at signup.
- **Signup.** A "what happens next" panel (about 2 minutes: grade, countries, first school) and a link to privacy.

### Your new standing role: design reviewer for pages Claude builds

The founder may have Claude design and build D4.4–D4.7 and D4.9 directly in code on the Daybreak system, with Amendment C as the rulebook. If so, after each Claude page ships to a preview:

1. Review it at 375×812 and 1440×900 against Daybreak, Amendment C and the audits.
2. Log findings as QA-60+ in `docs/design/2026-09-live-audit.md` in readable prose, each with severity and a concrete fix (copy, spacing, hierarchy, state).
3. Don't write production code.

The maker is not the final grader; you are the independent eye.

If the founder instead asks you to design D4.4–D4.7 and D4.9 as well, use the appendix below as each gate's brief.

## Rules (unchanged, plus Amendment C)

- No production code: nothing under `src/`, `supabase/migrations/` or config. Static mocks go under `docs/design/mocks/` only.
- Every mock ships at **375×812 and 1440×900**. Phone is the primary layout.
- Grounded data only. No invented statistics, reviews, admits or deadlines. Never promise admission. The AI never writes essay prose.
- Never run `npm run test:unit`. Don't read `.env.local`. `git add` explicit paths only. Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`.
- After each GREENLIGHT, write the spec, plan and Claude prompt in the current formats:
  - the spec in `docs/superpowers/specs/`;
  - the plan in `docs/superpowers/plans/`, with a Review Focus section and 8 tasks or fewer;
  - the prompt in `docs/handoff/claude-prompts/`, numbered from 10.
- Update only your D4 rows in `docs/handoff/codex-progress.md`. Gate messages stay short.

**Start with D4.3.**

---

## Appendix: briefs for D4.4–D4.7 and D4.9 (use only if the founder assigns them to you)

Each page must pass Amendment C's acceptance checks. The problems listed are from the October 3 live audits.

- **D4.4 Essay Studio.**
  - Problems:
    - three overlapping states on one row ("Changes requested" + "Revise" + "Open");
    - "1 comments";
    - phase isn't shown as a stepper.
  - Design for:
    - the review visible in every phase;
    - counselor comments with author and role;
    - the integrity decline (D4.3 item 7);
    - the "unknown prompt for 2026–27" state.
- **D4.5 School list, applications, requirements, private files.**
  - Problems:
    - "Uncategorized (2)" with an unlabeled "—" pill;
    - ED/EA/REA/RD/Rolling chips with no explanation;
    - "Location unlisted" on Toronto;
    - deadlines with no source (the deadline data is last cycle's).
  - Design for:
    - reach/target/likely sorting with a plain explanation;
    - per-system requirement checklists (US, UCAS up to 5 choices, OUAC Group A/B);
    - plan-conflict warnings (e.g. REA + private EA) as proposal cards;
    - the C8 date treatment.
- **D4.6 Activities, profile, testing, majors, visits, summer.**
  - Problems:
    - "Narrative Diagnosis" jargon;
    - a full-review button competing with the tabs.
  - Design for: the student writes and the AI critiques; activity text is never AI-composed without confirmation.
- **D4.7 Aid and scholarships, interviews, waitlist, family, voice.**
  - Keep the honest net-price language ("does not estimate what a school will award you"; unknown is not zero).
- **D4.9 Counselor workspace.**
  - Problems:
    - The roster isn't a work queue. "Which student needs me today?" can't be answered.
    - There's no assignment or reassignment of students to counselors in the UI.
    - The student detail shows "Unnamed student" and only grade, Pro and essays.
    - The invite has no consent screen.
    - Onboarding is split between "claim profile" and "create workspace".
  - Design for:
    - an urgency-sorted queue with a "needs you because…" reason;
    - a rich student view (schools, deadlines, activities, recent activity);
    - assign/reassign;
    - one onboarding flow: claim, then create workspace, then invite first student;
    - the invite consent screen for students.
