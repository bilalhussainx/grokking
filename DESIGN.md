# Design System — KairosLearn

> Codified 2026-05-24 from the existing token source of truth (`src/styles/kairos-tokens.css`)
> and the shipped student dashboard (`src/app/cc/dashboard/`). This documents a system
> that already exists in code — it is not a from-scratch proposal. Read it before any
> visual/UI work; flag code that drifts from it.

## Product Context
- **What this is:** KairosLearn — an AI college-counseling platform. Students manage essays, school lists, activities, financial aid (CSS Profile / net-price), and academic reports; counselors/agencies run their student book on top of the same data.
- **Who it's for:** High-school and transfer students; independent counselors and counseling agencies (e.g. Add Astra).
- **Project type:** Two surfaces — a cinematic **marketing/landing** site and a functional **product app** (student dashboard + counselor workspace).
- **Memorable thing:** "Serious admissions software with a gold spine" — dark, calm, premium; the gold is the one gesture that says *this is KairosLearn* across both surfaces.

## Two Surfaces, Shared Gold DNA
Pick the surface with a parent class: `.kl-surface-landing` or `.kl-surface-app` (both dark; **there is no light mode**).

| | Landing / marketing | Product app (incl. counselor) |
|---|---|---|
| Background | navy `#05080d` | true black `#000000` |
| Text | cream `#f2ede3` | off-white `#f0ece2` |
| Display font | Cormorant Garamond (serif, 300 italic) | — |
| UI font | DM Sans | **Inter** |
| Gold accent | antique `#d4a84b` | rich `#D4AF37` |
| Radii | `0` (square / brutalist) | rounded (8–16px) |
| Motion | cinematic (900ms reveals) | snappy (120–300ms) |

**The counselor surface is the app surface.** Counselor screens must use `.kl-surface-app` conventions: Inter, `#000` page bg, `#141414` cards, `#D4AF37` gold, rounded radii, `tabular-nums` for any numbers.

## Typography
- **Display/Hero (landing only):** Cormorant Garamond — `var(--kl-font-display)`, weight 300, italic for the gold emphasis word.
- **Body (landing):** DM Sans — `var(--kl-font-body)`, weight 300.
- **App UI (incl. counselor):** Inter — `var(--kl-font-sans)`, with `font-feature-settings: "cv11","ss01"`.
- **Data/Tables:** Inter with `font-variant-numeric: tabular-nums` (class `.kl-mono` applies it). Use for any column of numbers, counts (`usedCount/maxUses`), dates, scores.
- **Code/IDs:** JetBrains Mono — `var(--kl-font-mono)`.
- **App scale (discrete px):** h1 24/700, h2 16/600, h3 14/600, body 14, sm 12, xs 11, eyebrow 10 UPPERCASE (`.kl-kbd`, letter-spacing 0.10em).
- **Line heights:** heading 1.10, body 1.55.

Semantic app type classes (use these instead of ad-hoc Tailwind sizes): `.kl-h1 .kl-h2 .kl-h3 .kl-body .kl-sm .kl-xs .kl-kbd .kl-mono`.

## Color (app surface — counselor relevant)
- **Page bg:** `#000000` (`--kl-app-bg`)
- **Card surface:** `#141414` (`--kl-app-card`), hover `#1a1a1a` (`--kl-app-card-hover`)
- **Popover/menu:** `#151515` (`--kl-app-popover`)
- **Body text:** `#f0ece2` (`--kl-app-fg`); muted `#a0a0a0` (`--kl-app-fg-muted`)
- **Borders:** `rgba(255,255,255,.08)` (`--kl-app-border`), hairline-2 `.10`
- **Gold accent:** `#D4AF37`; hover/pressed `#C4A030`; link-hover bright `#F4D03F`
- **Gold tints:** bg `.10/.15/.20`, edge `.30` (`--kl-app-gold-edge`), hover-edge `.40`
- **Semantic school states:** reach `#f87171`, match `#4ade80`, safety `#60a5fa` (each with `-bg` `.20` and `-edge` `.30` variants)
- **Essay phase chips:** brainstorm purple `#d8b4fe`, outline blue `#93c5fd`, draft amber `#fcd34d`, revise green `#86efac`
- **Warn:** `#fbbf24`; **success/streaming:** `#34d399`; **voice live:** `#38bdf8`

## Spacing
- **Base unit:** 4px. Scale: `--kl-s-1..24` = 4,8,12,16,20,24,32,40,48,64,80,96.
- **Density:** comfortable. Page padding `p-8` (32px); card padding 16–24px; section gap 32–40px.

## Layout
- **Approach:** grid-disciplined app shell. Persistent left sidebar (`AppShell` → `Sidebar`, 240px expanded / 64px collapsed) + scrollable content. The sidebar swaps IA by role (`useCounselorRole`): student grade-routed IA vs counselor Workspace/Practice/Brand IA.
- **Max content width:** counselor pages center at `max-w-5xl` (team) / responsive grid (roster). Keep page content `mx-auto`.
- **Radii (app):** sm 6, md 8 (inputs/small buttons), lg/xl 12 (rows, pills), 2xl 16 (primary card), full 9999 (avatar, launcher).

## Motion
- **Approach:** snappy-functional in the app. Easing `--kl-ease-out` cubic-bezier(0.22,1,0.36,1).
- **Duration:** instant 120ms, fast 200ms, base 300ms. Reserve cinematic 900ms for landing only.
- **Backdrop:** `blur(24px)` for popovers/floating coach.

## Shadows
- sm `0 1px 2px rgba(0,0,0,.3)`, md `0 8px 24px rgba(0,0,0,.35)`, pop `0 20px 50px -12px rgba(0,0,0,.6)`.
- **Gold glow** (`--kl-shadow-gold`): `0 0 0 1px rgba(212,175,55,.30), 0 0 40px -6px rgba(212,175,55,.25)` — for the active/primary moment only, used sparingly.

## Counselor Surface — current state vs. the bar
The SP1 counselor screens (`/counselor/team`, `/counselor/students`, `/counselor/dashboard`) shipped functional but used **ad-hoc Tailwind tokens** (`bg-white/5`, `border-white/10`, `text-white/60`) instead of the system tokens. To reach the student-dashboard bar they need:

1. **Card surface:** `bg-white/5` → `#141414` (`--kl-app-card`) with `--kl-app-border`. The translucent white reads grey-on-black; the real card color is a warm near-black.
2. **Type classes:** replace ad-hoc `text-2xl font-semibold` etc. with `.kl-h1/.kl-h2/.kl-body/.kl-sm/.kl-kbd` so weights/tracking match.
3. **Numbers:** `usedCount/maxUses`, dates, completion % → `.kl-mono` (tabular-nums) so columns align.
4. **Eyebrows:** section labels ("Counselors", "Invite codes") → `.kl-kbd` uppercase 10px gold-muted, matching dashboard section headers.
5. **Radii:** standardize cards on `rounded-2xl` (16px), rows/pills on `rounded-xl` (12px), inputs on `rounded-md` (8px).
6. **Gold usage:** primary action (Mint code, Add counselor) uses solid gold `#D4AF37` text-on-dark or gold-tint bg + gold-edge; reserve the gold glow shadow for the single primary CTA per view.
7. **Empty states:** match the dashboard's empty-state voice — one calm line + one action, not a bare sentence.
8. **Roster cards:** adopt the dashboard's stat-card composition (title row + meta row + status pill) rather than a flat list, so the roster reads as a workspace, not a table dump.

## Anti-slop (enforced)
No purple gradients (purple is reserved for the essay "brainstorm" phase chip only), no 3-column icon grids, no centered-everything, no gradient CTAs, no `system-ui` as display/body, no bubble-radius on everything. The gold is the only brand flourish — use it with restraint.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-24 | Codified existing two-surface system into DESIGN.md | No DESIGN.md existed; tokens lived only in `kairos-tokens.css`. Needed a written bar to bring the counselor surface up to the student dashboard. |
| 2026-05-24 | Counselor surface = app surface (`.kl-surface-app`) | Counselor screens are functional product UI, not marketing; they share the student app's Inter/black/gold/rounded language. |
