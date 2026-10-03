# Amendment C: every screen tells the student what to do next

2026-10-03 · Claude (CTO), after a live review of D4.2 on kairoslearn.com and the October 3 workflow audits. This amends GATE D4.2 and binds D4.3 through D4.9.

## What D4.2 got right

- A single navigation rail on desktop and four phone tabs.
- An honest, stage-based Today page that doesn't invent urgency.
- AI labels on every Coach entry point.
- Calm visual warmth.
- No streaks or score rings.

Keep all of it.

## What is still hard for a student

These come from the live Today page (QA student, grade 11, 2 schools) and the inner pages, at 375×812 and 1440×900.

1. **The page says how to feel, not what to do.** The largest type on Today is "A little clarity. A good next step." On a phone, that headline, its subline and the Ask Kairos box fill the first screen. The actual next step, "Keep shaping your school list", starts below the fold.
2. **The next step is vague.**
   - "Keep shaping your school list. Look at the place, the learning and the cost for each school" has no target, no finish line and no time estimate.
   - A 16-year-old can't tell when it's done. Is that 3 schools? 8? Today?
3. **There's no map.** A student can't see where they are in the whole process. The process is list → requirements → essays → recommenders → submit → decisions, with transfer, UK and Canada variants. Without that they can't tell how far they are from finished.
4. **Three Coach doors on one screen.** On desktop, the Ask Kairos box, the "Talk with Coach" card and the rail item compete. On a phone the Ask box ranks above the next step. With one door, the next step is easy to see.
5. **Inner pages are a different product.** `/schools`, `/cc/essays`, `/cc/activities-optimizer` and `/applications` are still black and gold inside the warm Daybreak frame. Moving from Today to School list feels like leaving the app.
6. **Jargon with no explanation.**
   - The school card's "Applying as" chips read ED · EA · REA · RD · Rolling.
   - Schools sit under "Uncategorized (2)", with an unlabeled "—" pill.
   - Essays show three overlapping states: "Changes requested", "Revise" and "Open".
   - Activities says "unlock the Narrative Diagnosis".
   - Essays shows "1 comments".
7. **Interruptions without intent.** The "Working late?" toast appears after 10pm over page content, above the phone tab bar. D4.2 already says no Coach overlay without intent.

## The rules

**C1. Lead with the step.**
- The first thing on Today, on a phone, inside the first 812px, is the student's next step.
- Write it as a verb, an object, a finish line and a size. Examples:
  - "Add 3 more schools so you have a reach, a target and a likely — about 15 minutes."
  - "Answer 3 questions about your summer job for your personal statement — 10 minutes."
- A mood line may sit under the step as a subtitle. It may never sit above it.

**C2. Every step has a finish line the product can check.**
- Each step names its done-state: "Done when you have 5 schools", or "Done when your outline has 3 parts".
- The step card shows progress toward it, for example 2 of 5.
- When done, the step says so and the next one appears.
- No step is "keep doing X".

**C3. Show the map.**
- Add one compact journey strip to Today, with a full view behind it.
- Steps per path:
  - US first-year: List → Requirements → Essays → Recommenders → Submit → Decisions.
  - Transfer: List → Credits & transcripts → Essays → Recommenders → Submit → Decisions.
  - UK (UCAS): Choices (max 5) → Personal statement → Reference → Submit by date.
  - Ontario (OUAC): Choices (Group A/B) → Supplementary → Submit → Decisions.
- Mark each step done, here or not started. A student with schools in several systems sees one strip per system.
- Dates appear only when they come from a verified source. Otherwise the strip shows "date not yet verified".

**C4. One Coach door per screen in the content area,** plus the navigation item.
- On Today it is the Ask Kairos box, placed after the next step.
- The "Talk with Coach" card and duplicate buttons go.
- When the agent ships (D4.3), its proposals appear inside the next-step card ("Kairos suggests…") rather than as another door.

**C5. Every page header answers four questions in plain words:**
- what this page is for;
- where it sits in the map;
- the one thing to do here now;
- what done looks like.

Empty states give one primary action, plus a secondary text link at most. Two equal-weight cards ("Talk to Coach Kairos" vs "Browse schools") ask the student to choose before they understand the choice.

**C6. One status vocabulary across the app:** Not started · In progress · Waiting on someone · Needs your fix · Done.
- Each status uses the same color and words on every page.
- Each item shows exactly one status.
- An essay's phase (brainstorm → outline → draft → review) is progress, not status, and is shown as a stepper.

**C7. Explain every admissions term where it appears.**
- ED, EA, REA, RD, Rolling, need-aware, UCAS choice, OUAC group and test-optional each get a plain-language tap-to-explain. Example: "ED: binding. If you're admitted you must attend. You can apply ED to one school."
- Rename "Uncategorized" to "Not sorted yet: is this a reach, target or likely?"
- Never use internal feature names such as "Narrative Diagnosis".
- Pluralize correctly.

**C8. Dates carry their source and freshness.** Every deadline shows:
- the date and days left;
- where it came from ("from duke.edu, checked Oct 19");
- or "last cycle's date, not yet verified". No countdown is shown for an unverified date.

**C9. Nothing floats over the work unless the student asked for it.**
- The late-night message moves into the Today invitation ("It's late — want a 10-minute version of today's step?").
- Toasts confirm the student's own actions only.

**C10. One visual system.** Every signed-in page uses Daybreak (`src/components/app-shell/app-frame.css` tokens). No page ships black-and-gold inside the warm frame. The marketing pages follow (see the landing audit) so the product feels like one place from the homepage to the essay editor.

**C11. Agent-ready slots.** Every task surface reserves the patterns D4.3 will define:
- a "Kairos suggests" proposal card with Why? and Confirm / Not now;
- source chips;
- an "unknown, I can check" state.

Pages built now should place these slots so the agent doesn't need a redesign later.

## Acceptance checks (for designs and for code)

- At 375×812, the next step's verb and finish line are visible without scrolling on Today.
- On any page, a first-time 16-year-old can say in 5 seconds what to do and how they'll know it's done. Test this with the QA personas: grade 9, 11, 12, transfer, UK, Canada.
- No admissions term appears without an explanation within one tap.
- No two Coach entry points in the content area of one screen.
- No date without a source or an "unverified" label.
- No horizontal overflow at 375px. A 21-page scan exists; run it.
