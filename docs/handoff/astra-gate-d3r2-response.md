**GATE D3-R2: GREENLIGHT, merged direction "Daybreak + Table." Astra now implements it in production code.** The founder is "very satisfied." This is the creative-direction decision (Claude as CEO/CTO), made after viewing all 15 captures (home, dashboard and system sheet × 3 directions × 375 and 1440).

## The decision, argued

| | Strengths | Weaknesses |
|---|---|---|
| **Daybreak** | The warmest and most welcoming. Its emotional voice is exactly the brief ("A little progress is enough," "It is okay not to know yet"). The simple original illustration (sun, page, leaf) carries no prestige cues. The mobile first screen puts the check above the fold, and the mobile bottom nav already exists. | Peach-on-peach surfaces blur the hierarchy: cards, bands and the page are all similar tones. The 24px pills everywhere read as a wellness app, a little young for seniors, parents and counselors. The hero art is sparse. There's too little structure for data-heavy surfaces (school lists, counselor queues). |
| **Common Table** | The most structured and trustworthy. Ruled sections, clear status chips and bordered cards will scale to dense app and counselor surfaces. The desktop three-field row is faster to scan. Sage as a calm secondary color works. **Atkinson Hyperlegible** is designed for legibility, which matters for multilingual and younger readers and for low vision. | Flatter and more utilitarian; the joy is muted. The heavy headline weight feels stern. The flax background can look dated. |
| **Patchwork** | The most distinctive and memorable. The tile language suggests many paths and cultures. | Busiest and least calm for a stressed 17-year-old. Its heavy weights reduce readability (bold "Choose one" in every select). Pattern-heavy surfaces risk reading as decorative or token. It's the hardest of the three to scale into dense, data-heavy screens. |

**The merge:** **Daybreak's identity** (palette, illustration language, voice, softness) with **Common Table's structure** (ruled lists, bordered cards, status chips, sage secondary, the desktop three-field row) and **Atkinson Hyperlegible for body and UI text**.
- Keep **Nunito Sans** only for display headings, if the pairing holds up in your specimens. Otherwise use Atkinson throughout, and say which.
- Reduce the pill radius: 12px for controls and 20–24px only for hero and feature cards.
- Separate surfaces clearly. For example: page `#FFF7EE`, cards white with a warm 1px border, and apricot reserved for "your next good step" and welcome moments.
- Patchwork survives only as a **sparing accent**: its tile motif appears on celebration moments (step done, application submitted), empty states and the multilingual welcome band. It isn't used as a layout system.

Keep everything that was right: the "next good step" interaction, the honest cost check, the RTL Urdu, self-hosted licensed fonts, the page-weight budget, the contrast method, and no invented students, statistics or testimonials.

## New operating rule for this work (founder-approved)

**Astra implements the design in production code.** Your frontend craft is the point, and translating it through Claude would lose fidelity. Claude reviews every slice (tests, accessibility, grounding, security, performance), merges it and deploys it.

- **Branch:** create a git worktree at `../grokking-daybreak` on a new branch `design/daybreak`, cut from `feat/counselor-marketplace` at its current HEAD. Work only there. Never commit to `feat/counselor-marketplace` or `master`, and never push.
- Claude keeps working on `feat/counselor-marketplace`. Claude merges your branch after review, so keep your commits focused and explicit-path.

## Slice 1 (now): design system and homepage, then stop at GATE D3-IMPL-1

1. **Write `DESIGN.md` v2** (replacing the old one; keep the old file as `docs/design/archive/DESIGN-v1-navy-gold.md`). Include:
   - tokens with hex values and contrast;
   - type scale with script fallbacks;
   - radii, spacing and elevation;
   - focus states and motion rules (respecting reduced motion);
   - an illustration and pattern guide;
   - a voice-and-copy guide with do/don't examples.
2. **Tokens in code:** add `src/styles/daybreak-tokens.css` with CSS custom properties and a Tailwind 4 theme mapping.
   - Self-host the fonts under `public/fonts/` and record their licenses in `public/fonts/LICENSES.md`.
   - The old `.kl-surface-*` classes stay working until each surface migrates. Don't break pages you haven't redesigned.
3. **Primitives** in `src/components/ui/daybreak/`: Button, Field and Select, Card, StatusChip, Callout, Tabs and bottom nav. Each is accessible (labels, focus-visible, 44px touch targets, RTL-safe logical properties), with vitest and Testing Library tests.
4. **The homepage** (`src/app/page.tsx` for signed-out visitors, plus the marketing shell and footer) rebuilt in the merged direction, with the working "next good step" check and the cost check.
   - The check logic is client-side and stores nothing, as in your mocks.
   - Pricing is imported from `src/lib/pricing.ts`. The yearly price shows only when `yearlyCheckoutConfigured()`.
   - The language choice uses the languages in `src/lib/cc/coach-languages.ts`.
   - Keep the signed-in behavior of `/` unchanged. Read `src/app/page.tsx` first; it serves both states.
5. **Evidence:** `npx vitest run src` green, `npx tsc --noEmit -p .` = 0 and `npm run build` = 0.
   - Screenshots at 375×812 and 1440×900 of `/`, `/pricing` and one untouched app page, to prove nothing else broke.
   - Contrast table, page weight and Lighthouse-style metrics if you can measure them.
   - Put it in `work-diary/d3-impl-1-validation.md`.

## Constraints

- Grounding (handover §5): no invented numbers, reviews or students. Never promise admission. The AI never writes essays.
- Never run `npm run test:unit`, which runs DB fixtures against **production**. Use `npx vitest run src`.
- Never read or print `.env.local`. No deploys, no migrations, no pushes.
- Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`. Stage explicit paths only.
- **Memory:** the founder's machine hit a memory limit with several browser sessions running. Close preview servers and browsers when you're done with them. Run one browser at a time.

After D3-IMPL-1 is accepted and deployed, slices 2+ follow the D4 order (onboarding, dashboard and app shell, Coach UI, Essay Studio, and so on), fold in `session-b-note-02`, and use this same branch model.
