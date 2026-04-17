# Feature 6.3: Jargon Translator — Design Spec

**Date:** 2026-04-17
**Status:** Approved (compact spec — wiring existing components)

## Context

The glossary/jargon translation system is already 95% built across two separate subsystems:

1. **Lesson glossary** (`GlossaryText` + `GlossaryTooltip`) — uses static `src/data/glossary.ts` data, wraps terms in lesson markdown with hover tooltips. Already integrated into `LessonContent.tsx` via `processChildren()`. **Fully working.**

2. **CC glossary** (`Term.tsx` + `GlossaryContext`) — uses Supabase `cc_glossary` table via API, provides Radix hover card (desktop) and popover (mobile) with TTS listen button. **Components built but not wired** — `GlossaryProvider` is not in the root provider tree, and `Term` is not imported anywhere.

## What This Feature Does

1. **Wire `GlossaryProvider`** into the root provider tree so `<Term>` can be used on any page.
2. **Create `/glossary` browse page** — searchable list of all CC terms (from Supabase) so students can look up college admissions jargon independently.
3. **Add glossary link to navigation** — accessible from sidebar or TopNav.

## Design

### 1. Provider Wiring

Add `GlossaryProvider` inside the existing provider stack in `src/app/providers.tsx`. It should wrap the full app (alongside AuthProvider, AIProvider, etc.) so any page can use `<Term slug="...">` for inline jargon definitions.

Position: inside the existing provider nesting, alongside other feature contexts. It fetches on mount from `/api/cc/glossary` — lightweight (100-200 terms, ~10KB).

### 2. Glossary Browse Page (`/glossary`)

- **Route:** `src/app/glossary/page.tsx`
- **Layout:** Reuse app shell (TopNav visible)
- **Content:**
  - Search input (client-side filter by term name or definition text)
  - Category filter chips (from `cc_glossary.category` distinct values)
  - Term cards: term name, definition, category badge
  - Click/tap a card to expand and show "Listen" TTS button
- **Data source:** `useGlossary()` from context (already fetched)
- **No auth required** — public page

### 3. Navigation Link

Add "Glossary" link to the TopNav dropdown or sidebar. Small text link, not a primary nav item.

## Non-Goals

- No changes to the lesson glossary system (`GlossaryText`) — already working
- No seeding `cc_glossary` Supabase table (assume data exists or will be seeded separately)
- No translations UI (translations field exists but populating it is a separate task)

## Files to Create/Modify

- **Modify:** `src/app/providers.tsx` — add `GlossaryProvider` wrapper
- **Create:** `src/app/glossary/page.tsx` — browse page
- **Create:** `src/app/glossary/layout.tsx` — metadata
- **Modify:** TopNav or sidebar — add glossary link
