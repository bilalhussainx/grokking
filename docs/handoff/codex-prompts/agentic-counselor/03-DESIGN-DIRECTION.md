# 03 — Design direction

## What the founder said (2026-10-03/04)

> "the design looks like a homework diary with lots of scribbled text with no specific design or user-friendly interface"
> "the page looks like a basic fill the form with no useful output"
> "there needs to be a toy like chatgpt pet … that allows them to use and communicate with the interface"

The diagnosis:
- The current Daybreak screens explain a process in paragraphs.
- Emphasis comes from italic serif words ("One good *next step*").
- The product itself is almost never shown.
- Interactions end in canned text.

The fix is **product-first, alive and warm**: show the real interface, let students *do* something within seconds, and let Kairos be the face that makes it feel personal.

## 1. Keep / change / drop

| Keep | Change | Drop |
|---|---|---|
| Daybreak color tokens and contrast table (`DESIGN.md`, `src/styles/daybreak-tokens.css`) | Display type: Nunito Sans 700 at tight leading (1.05–1.15), with sizes on a clear scale (56/40/28/20 desktop, 36/28/22/18 phone) | Italic serif emphasis inside headlines |
| Atkinson Hyperlegible for body | Sections lead with a **product frame** (a real component in a device-like frame) instead of a paragraph | Paragraph-first sections and "feelings" copy blocks |
| Warm canvas `--db-page` | Bento grids for toolkits: 2–3 columns desktop, 1 column phone, each tile = live mini-UI + 1 line | Decorative step numbers ("01 02 03") as the main structure |
| Amendment C rules C1–C11 (`docs/design/2026-10-03-amendment-c-step-clarity.md`) | Motion: small, purposeful (150–250 ms), only on state change; respects `prefers-reduced-motion` | Floating overlays without intent; confetti |
| One Coach door per screen (C4) | The Coach door **is** the Kairos dock; remove other chat entry points as the dock lands | Duplicate chat launchers |

New tokens are allowed only through `daybreak-tokens.css`, with a contrast row added to `DESIGN.md`. Specialists need one accent each; derive them from the existing palette (clay, green, a deeper apricot, a slate blue ≥ 4.5:1 on card) and add them as `--db-role-<id>`.

## 2. Product frames

A product frame is a real React component rendered with **fixture data** inside a framed container:
- 12–22 px radius, `--db-shadow-raised`;
- an optional fake window bar on desktop;
- labeled "Example" for screen readers and visually in small text.

Never screenshot-and-paste static PNGs for core claims; a frame must be the actual component, so it stays true. Fixtures live in `src/components/marketing/fixtures/*.ts`. They must not contain real student data or real dates. Use "Example" dates or relative phrasing ("in 12 days").

## 3. The companion: visual spec

**Character:**
- Kairos is a small, round, non-human character that grows out of the Daybreak sun motif.
- A soft circle body with two simple eyes and a mouth line, plus a small scarf in clay.
- No hands needed. It must read clearly at 28 px (dock collapsed) and at 120 px (hero).
- Build it as an inline **SVG React component** with props `{ mood, size, role? }`. Do not use raster images.

**Moods** (map 1:1 to the states in 02-SPEC §3.1): `idle`, `noticed`, `working`, `celebrating`, `handoff`, `quiet`.
- Each is a small change: eyes, mouth, scarf position, and one optional overlay glyph (a dot, a spinner arc, a sparkle, "zz").
- Transitions are 200 ms CSS.
- Under `prefers-reduced-motion`, swap the state without animating.

**Specialists:**
- Same family, same body.
- Each has its role accent color and one prop glyph:
  - Wren: a lantern (finding stories, *not* a pen);
  - Sam: a microphone;
  - Ana: a coin stack;
  - Leo: a compass;
  - Juno: a calendar page.
- In a handoff the specialist appears beside Kairos (overlap 30%) and its name shows in the status line.

**Accessibility:**
- The character is decorative (`aria-hidden`).
- The status line carries the meaning (`role="status"`, polite).
- Never convey state by color alone.

## 4. The dock

**Desktop (≥ 1024 px):** a right rail, 64 px collapsed and 380 px expanded.
- **Collapsed:** face, inbox count, mic button.
- **Expanded:**
  - status line;
  - active role chip with a role picker;
  - chat (text plus voice toggle);
  - Kairos inbox (pinned above chat);
  - "What Kairos knows" link.
- Expansion state persists per user (localStorage, wrapped in try/catch).
- It must never overlap page content; the main column reflows.

**Phone:** a 56 px avatar button bottom-right, above the safe area and clear of the BottomNav (`src/components/ui/daybreak/BottomNav.tsx`).
- It opens a bottom sheet at 90 vh with the same content.
- Mic is thumb-reachable.
- All targets are ≥ 44 px.

**Voice in the dock:**
- One big mic button.
- While listening, a live waveform and the transcript as it streams.
- While Kairos speaks, the text streams in sync.
- "Tap to interrupt" (barge-in is supported by Deepgram).

**"Take me there":** when Kairos navigates, the target field gets a 2 s focus ring pulse and the dock shows "I opened your school list".

## 5. Landing page structure (S5)

1. **Hero.**
   - Left: an H1 that names what it is. Draft: "Meet Kairos. The admissions counselor in your pocket." The sub-line covers US · UK · Canada · transfer, talking in your language, never writing your essay.
   - Primary CTA "Start free"; secondary "Hear Kairos" (plays a recorded voice clip with captions).
   - Right: the companion at 120 px plus a live product frame of a real conversation fixture, where Wren is brought in and a story card is saved.
2. **"Your counseling team":** six cards, Kairos plus the five specialists, each with face, role, and one thing they do *with you* (a product frame snippet).
3. **"What Kairos does while you're busy":** a timeline of real proactive behavior (weekly plan, deadline reminder, conflict caught, story gap). Label anything not yet on for everyone as "rolling out".
4. **Signature workflows:** story bank, hot seat, balanced list, requirements checklist, and aid plan once S7 ships. Each is a product frame plus a 1-line outcome.
5. **"What students told us they hate about other tools":** a 6-row table pairing the complaint with what Kairos does. Use only true statements (02-SPEC §9).
6. **Voice band:** verified languages in native script with measured latency (from S9), plus a "Hear it" sample per language (pre-recorded clips; no live anonymous voice).
7. **For counselors:** a teaser leading to `/counselors`.
8. **Pricing:** Free and Pro from `src/lib/pricing.ts`, the trial wording from `TRIAL_TERMS`, and the integrity promise.
9. **FAQ** (`src/lib/faq-items.ts`).

The header has a Students | Counselors switch and a mobile "Start free" button. One header and one footer across all signed-out pages.

## 6. Today and the counselor work queue (S6)

**Today:**
- The top card is the single next step: the first open weekly-plan task, with its finish line (C2).
- Below it:
  - the journey map, compact (C3);
  - a deadline countdown (sourced dates only);
  - the essay pipeline (stories → outline → draft → review, per prompt);
  - the Kairos inbox.
- The dock is the only Coach door.

**Counselor work queue:**
- One list, sorted by urgency.
- Each row has the student, why they're here (essay awaiting review / stalled 10 days / deadline in 5 days / agent flagged plan conflict), and one primary action.
- Filters: mine / agency (heads).
- Empty state: "Nobody needs you right now."

## 7. Anti-patterns (reject in review)

- Paragraphs before product.
- Lorem-like reassurance copy ("It is okay not to know yet") as section content.
- Any number, date, admit or testimonial that isn't real and sourced.
- A second chat launcher.
- Text over 75 characters per line on desktop.
- Gray-on-cream text below 4.5:1.
- Em dashes in UI copy.
- Animations that loop forever.
- Gradients that aren't from tokens.

## 8. Evidence for review

For every UI slice:
- Screenshots at 375x812 and 1440x900 into `docs/qa/evidence/codex-SN/`, light mode, of each new or changed screen and each companion mood.
- An axe or Lighthouse accessibility pass on the landing page and Today.
- No horizontal overflow at 375.
