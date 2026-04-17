# Phase 0.3 — Jargon Translator (Feature 6.3)

## Problem
First-gen students encounter 200+ unfamiliar college admissions terms.
Each unknown term is friction that can cause abandonment.

## Solution
Every admissions term on the site renders as a tappable/hoverable link.
Popover shows: plain-language definition + "Listen" TTS button in the
student's home language.

## Architecture

### Data
- `cc_glossary` table (already created in Phase 0.1)
- Seed script: `scripts/seed-glossary.ts` — 200+ terms
- Categories: application, financial_aid, testing, admissions_strategy, terminology

### Components
1. `src/components/cc/Term.tsx` — client component
   - Desktop: Radix HoverCard (hover to see definition)
   - Mobile: Radix Popover (tap to see definition)
   - "Listen" button calls `/api/language/tts` with definition text
   - Shows translation if student's home_language !== 'en'

2. `src/contexts/GlossaryContext.tsx` — provider
   - Fetches all terms once on mount via `GET /api/cc/glossary`
   - Provides `lookupTerm(slug)` to any descendant
   - Cached in state — no re-fetches

3. `src/lib/cc/rehype-glossary.ts` — rehype plugin
   - At render time, scans text nodes for known term matches
   - Wraps matches in `<Term term="slug">display text</Term>`
   - Case-insensitive matching
   - Skips code blocks, headings, and already-wrapped terms

### API (wire the existing stub)
- `GET /api/cc/glossary` → returns all terms (public, no auth)
- `GET /api/cc/glossary/:term_slug` → returns single term + translations

## Acceptance Criteria
- [ ] 200+ terms seeded with accurate, plain-language definitions
- [ ] Term component shows popover on hover (desktop) / tap (mobile)
- [ ] Each popover has a "Listen" button that plays TTS in current language
- [ ] Translations available for at least es, hi, zh
- [ ] Rehype plugin auto-wraps terms in markdown content
- [ ] Terms don't wrap inside code blocks or headings
- [ ] Glossary loads in <200ms (single fetch, ~40KB)

## Testing Guide
1. Navigate to any page with admissions terms in content
2. Hover over a highlighted term → popover appears with definition
3. Click "Listen" → hear definition in English (or selected language)
4. Switch language to Spanish → popover shows Spanish translation
5. Check mobile: tap term → popover appears
6. Check that code blocks don't get terms wrapped
