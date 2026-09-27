# KairosLearn design system v2 — Daybreak + Table

Approved direction; slice 1 awaiting GATE D3-IMPL-1. Authority: `docs/handoff/astra-gate-d3r2-response.md`, 2026-09-26. Previous system archived at `docs/design/archive/DESIGN-v1-navy-gold.md`. This system governs migrated surfaces only.

## Intent

College planning should feel possible before it feels comprehensive. Lead with one useful action, then reveal the detail needed to make that action honest. Daybreak supplies warmth, voice and illustration. Table supplies white bordered cards, ruled rows and a calm reading order. Students, families and counselors share a visual language without being treated as the same user.

The public homepage offers a three-answer check without signup. Its result names one action and one open question. The annual cost check treats missing amounts as unknown, not zero. No prestige badges, invented students, fabricated outcomes or admission guarantees.

## Color and contrast

Source: `src/styles/daybreak-tokens.css`. Tailwind 4 utilities use the `daybreak-` namespace, e.g. `bg-daybreak-page`, `font-daybreak`, `rounded-daybreak-control`. Never remap existing global tokens or `.kl-surface-*` classes during gradual migration.

| Token | Hex | Purpose |
|---|---|---|
| `--db-page` | #FFF7EE | Page canvas |
| `--db-card` | #FFFFFF | Forms and reading surfaces |
| `--db-ink` | #342A24 | Headings and body |
| `--db-muted` | #69584B | Supporting copy, never low-opacity text |
| `--db-clay` | #A13E24 | Primary actions and links |
| `--db-clay-hover` | #85321D | Primary hover |
| `--db-on-clay` | #FFFFFF | Primary button text |
| `--db-apricot` | #FCE4CD | Welcome and next-step moments |
| `--db-sage` | #E6EDDF | Family support and calm information |
| `--db-green` | #315B4C | Positive states and structural accents |
| `--db-border` | #967D6A | Functional boundaries, never text |
| `--db-focus` | #245C52 | Focus ring |
| `--db-error` | #A12720 | Errors, always accompanied by words |

Use WCAG sRGB luminance: linearize each channel, compute `0.2126R + 0.7152G + 0.0722B`, then `(Llighter + 0.05)/(Ldarker + 0.05)`. Normal text needs 4.5:1; meaningful UI boundaries/focus need 3:1. Ratios rounded below; decisions use unrounded values.

| Foreground | Page | White | Apricot | Sage |
|---|---:|---:|---:|---:|
| Ink | 13.17 | 13.98 | 11.39 | 11.68 |
| Muted | 6.39 | 6.78 | 5.53 | 5.66 |
| Clay | 6.13 | 6.50 | 5.30 | 5.43 |
| Green | 7.25 | 7.69 | 6.27 | 6.42 |
| Border (UI only) | 3.64 | 3.86 | 3.15 | 3.23 |
| Focus | 7.26 | 7.70 | 6.28 | 6.43 |
| Error | 7.00 | 7.43 | 6.06 | 6.21 |

White on clay is 6.50:1. Raw calculations: `work-diary/d3-impl-1-evidence/contrast.json`. Token checks do not replace browser checks for inherited colors or transparency.

## Typography and scripts

Atkinson Hyperlegible is body/UI at 400 and 700. Nunito Sans is display at 600–700: rounded forms soften the welcome while Atkinson distinguishes labels and numbers. Avoid 800–900 headings and synthetic script weights.

| Role | Desktop | Mobile | Leading |
|---|---:|---:|---:|
| Hero | 68px / 600 | 34px / 600 | 1.08–1.12 |
| Section | 38px / 700 | 30px / 700 | 1.15–1.25 |
| Subheading | 23px / 700 | 21–23px / 700 | 1.3 |
| Lead | 21px / 400 | 17px / 400 | 1.5 |
| Body | 17px / 400 | 17px / 400 | 1.55 |
| Control | 16px | 16px | 1.4–1.45 |
| Label | 14px / 700 | 13–14px / 700 | 1.4 |
| Note | 13–14px | 13–14px | 1.5 |

Paragraphs stay near 60–75 characters per line. Labels remain visible outside fields; placeholders never replace them. Native select options use regular weight. Self-hosted named font stacks:

- English/Spanish: Daybreak Atkinson → Arial → sans-serif. Display: Daybreak Nunito → Daybreak Atkinson.
- Hindi (`hi`): Daybreak Devanagari (Noto Sans Devanagari), 1.7 leading.
- Punjabi (`pa`): Daybreak Gurmukhi (Noto Sans Gurmukhi), 1.7 leading.
- Urdu (`ur`): Daybreak Urdu (Noto Nastaliq Urdu), regular weight, 1.9–2.1 leading. Display 48px desktop/26px mobile. Scope RTL to translated regions, not unrelated English content. Leave room above/below connected glyphs.

Language codes come from `src/lib/cc/coach-languages.ts`. The picker explicitly controls the quick check and hero, not the whole site. Native-speaker editorial acceptance is required before deployment; browser testing proves rendering/direction only. WOFF2 uses `font-display: swap`; licenses and provenance are in `public/fonts/LICENSES.md`. Daybreak adds no remote font calls; legacy root fonts remain on unmigrated surfaces.

## Layout, shape and elevation

- Content max-width 1200px, mobile gutters 18px, desktop at least 24px.
- Desktop check has three fields in a row and the action beside them when space permits. Stack on mobile in the same order. The English check and action should fit the first 812px screen.
- Spacing: 4, 8, 12, 16, 24, 32, 48, 64px. Use 16px within groups; 32–64px between tasks.
- Controls 12px radius, standard cards 12px, feature cards 22px, chips 8px. Avoid full pills.
- White cards have 1px warm borders. Prefer ruled rows to a card around every data item. Reserve apricot for welcome and next-step results.
- Elevation: `0 3px 0 #342a240b`; raised `0 8px 24px #342a2412`. Borders carry hierarchy.
- Use logical margins/padding/borders. Avoid fixed heights around translated text. No horizontal page scrolling at 375px.

## Accessible primitives and feedback

Components: `src/components/ui/daybreak/`. Their `db-*` classes are styled by the Daybreak stylesheet, imported by the opt-in marketing shell; future app shells must import it too.

- Button uses native semantics and defaults to `type="button"`; variants primary, secondary, quiet.
- Field/Select have visible labels, linked hints/errors and `aria-invalid`. Empty required choices prompt a deliberate selection.
- Card does not create interactive semantics. StatusChip has a visible label plus redundant symbol; never color alone.
- Callout error announces an alert; ordinary supporting copy does not.
- Tabs: named tablist, roving focus, locally directed arrows, Home/End, disabled skip, associated hidden panels.
- BottomNav: named navigation landmark, `aria-current="page"`; future app shell owns positioning and safe-area clearance.

Controls target at least 44px, normally 48px. Focus uses a 3px green outline, 4px offset and white separation ring. Underline inline links. Preserve zoom and a skip link. After submission focus the result heading; validation focuses a useful error summary. Reset clears results and focuses the first field. Editing answers invalidates stale results.

## Motion, illustration and pattern

Use at most 120ms color transitions. No autoplay, animated counters, urgency pulses or entrance sequence. Reduced motion removes transitions/animation, decorative rotation and smooth scrolling. Essential state never depends on motion.

The original sun/page/leaf SVG suggests time, learning and growth without a prestige signal. Keep warm strokes and an uncluttered canvas. Decorative art has empty alt text; meaningful diagrams need a text equivalent. Never imply stock people are customers.

Patchwork survives as a small three-tile mark in the multilingual welcome. Later celebrations/empty states may reuse two or three shapes. It is not a layout system or a reading-surface background. Never assign cultures to decorative motifs. Family support uses a question note instead of duplicating the hero.

## Voice and copy

Calm, concrete, respectful. Name a small action and leave room for uncertainty. Students own their choices and every word of their essays. Invite family participation without assuming it. External facts require a source URL and checked date; estimates must be labeled estimates.

| Do | Don't |
|---|---|
| “A little progress is enough.” | “Crush admissions and beat everyone else.” |
| “One thing you can do next.” | “Your guaranteed path to your dream school.” |
| “Leave unknown amounts unknown.” | Fill unknown costs with zero or invented averages. |
| “Name a decision you made. You will write the essay.” | “Let AI write your personal statement.” |
| “Bring a parent or someone you trust.” | Assume every student has parental support. |
| “An amount still to plan for.” | Promise affordability from a subtraction. |

Prices come from `PRICING`; annual price only when `yearlyCheckoutConfigured()`. Currency changes clear inputs, never silently convert. Loans are not grants. Zero estimated gap is not an aid award or an affordability promise. Free credits are once at signup, not monthly. Fair-use claims include their limits.

## Rollout and evidence

This slice migrates signed-out `/` and its shell. Preserve signed-in routes and use `/pricing` and `/courses` as regression surfaces. Checks make no API request and persist no answers. Retain the prior D3-R2 default page-weight target of 550KiB; measure total resources separately from design assets and report shared-app overhead honestly.

Evidence: `work-diary/d3-impl-1-validation.md`. Required: src tests, TypeScript, production build, phone/desktop captures, browser forms/focus/scripts, contrast, page weight and available performance entries. Existing blockers stay visible. Claude reviews, merges and deploys. Astra stops at GATE D3-IMPL-1.
