# S4 — Companion UI: Kairos everywhere, the team, handoffs, "take me there" (effort: High)

## Why
The founder wants a "toy like a ChatGPT pet" that students use to move through the platform. The role engine (S3) gives Kairos a mind; this slice gives it a face, a home on every page, and hands.

## Read first
- 03-DESIGN-DIRECTION §3–§4 (binding).
- 02-SPEC §3.1 (states and play modes) and §6.
- Amendment C (`docs/design/2026-10-03-amendment-c-step-clarity.md`), especially C4 (one Coach door) and C8 (nothing floats without intent).
- Existing UI to absorb or replace:
  - `src/components/cc/coach/CoachChat.tsx`;
  - `src/components/cc/agent/{KairosInbox,ProposalCard,ActivityLog}.tsx`;
  - `src/components/cc/today/AskKairos.tsx`;
  - the app frame `src/components/app-shell/*` (`app-frame.css`);
  - `src/components/ui/daybreak/*` (Button, Card, StatusChip, BottomNav).

## Scope
1. **Character:** `src/components/companion/KairosFace.tsx`, an SVG with `{ mood, size, role? }`. It has 6 moods, 6 role variants (glyph plus accent token) and reduced-motion handling.
   - Add the `--db-role-*` tokens with contrast rows in `DESIGN.md`.
   - Snapshot or DOM tests for each mood and role.
   - Also add a Storybook-free preview page at `/dev/companion` that's only reachable when `NODE_ENV !== "production"`. Use it for screenshots.
2. **The dock:** `src/components/companion/CompanionDock.tsx`, mounted once in the signed-in app frame.
   - Desktop is a right rail (collapsed 64 px / expanded 380 px); phone is an avatar button plus a bottom sheet.
   - It contains: status line (`role="status"`), active role chip plus role picker, the Kairos inbox pinned on top, chat (the text stream from `/api/cc/agent/turn` for flagged users and the legacy coach otherwise), a voice button (S1 voice), and links to "What Kairos knows" and the activity log.
   - Remove other Coach entry points on pages that render the dock (C4). List every removed launcher in the ledger.
3. **State machine:** `src/components/companion/useCompanionState.ts` derives the mood from real events only. The inputs are: inbox count; an in-flight tool call (SSE events from `src/lib/cc/agent/sse.ts`); confirm or completion events (celebrating, ≤ 3 s); active role ≠ kairos (handoff); quiet hours or paused (quiet). Unit-test the reducer.
4. **Handoff UI:**
   - The `handoff` card renders as an inline banner ("Kairos brought in Wren · essays").
   - The dock shows both faces; "Back to Kairos" is always visible while a specialist is active.
   - The role picker lets the student call a specialist directly.
5. **"Take me there":** a `navigate_to({ path, focus? })` tool result. The client routes with `next/navigation`, then focuses and pulses the target (`data-kairos-target="<id>"` attributes on key fields: school search, essay editor, plan tasks, recommender list). Paths come from an **allowlist** of internal app routes; reject anything else. Test the allowlist.
6. **"What Kairos knows":** the page `/cc/kairos/knows` lists confirmed facts and stories (S3 tables) with source turn links, edit, delete, "don't use this", and "Forget everything" (confirm dialog). The API routes enforce ownership.
7. **Play modes:**
   - **60-second spark** (Kairos asks one story-mining question and the answer can become a `save_story` proposal);
   - **Hot seat** (Sam asks one interview question by voice and gives one tip; saved as an interview attempt in the existing interview tables);
   - **Myth or fact** (one card a day from a curated, sourced list in `src/data/myths.ts`, at least 30 items, each with a source URL).
   - Entry is from the dock's empty state and Today.
8. **Journey map plus growth traits:** a compact milestone map (list built, 5 stories, first draft, mock interview, apps submitted) computed from real data. Each completed milestone adds a visual trait to KairosFace (a scarf badge). There's no streak loss and no guilt copy.

## Tests first
- Each mood and role renders.
- The state reducer.
- Dock open/close persistence (localStorage in try/catch).
- Only one Coach door per page (render the frame with sample pages and assert a single launcher).
- The `navigate_to` allowlist.
- The knows-page APIs: ownership, delete, forget-all.
- The myths data has a source URL on every item.

## Evidence
Screenshots at 375 and 1440 of:
- the dock collapsed and expanded on Today, Essays, Schools and Applications;
- each mood;
- a handoff;
- the knows page;
- each play mode.

Also an axe pass on Today with the dock open. No overflow at 375; the phone sheet must not cover the BottomNav.

## Prod checks
As the flagged QA student:
1. Open the dock and send a text.
2. Get a handoff to Wren.
3. Confirm a story.
4. See it on the knows page.
5. Use navigate_to for the school list (the focus pulse visible in a screenshot).
6. Play a hot seat round.

As an unflagged student, the dock works in legacy mode (chat plus voice, no inbox or handoffs).
