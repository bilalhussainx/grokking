# KairosLearn — Design System

> *Your AI college counselor. For first-gen students. In your language.*

KairosLearn ([kairoslearn.com](https://kairoslearn.com)) is an AI-powered ed‑tech platform focused on the U.S. college application funnel — **intake → school-list building → essays & supplements → activities list → interview prep → recommender management**. The product is positioned around **Coach Kairos**, a multilingual AI college counselor that follows students through every stage of applying.

The name *Kairos* is Greek for *the right moment*. The brand mark is a navy + gold compass clock — a nod to timing, orientation, and quiet confidence.

---

## Products represented in this system

KairosLearn has **two distinct surfaces** with a shared gold-on-dark DNA but very different personalities. Both are fully dark-mode; there is no light mode.

| Surface | Role | Personality | Fonts | Reference folder |
|---|---|---|---|---|
| **Landing / Marketing** | `kairoslearn.com` front door — pitch the counselor, drive signups, host investor deck & survey | Cinematic, serif-display, editorial, grain, slow parallax | **Cormorant Garamond** (display, often italic) + **DM Sans** (body) | `grokking/KairosLearnLandingPage/` |
| **Product (College Counselor app)** | The logged-in toolkit — essays, school list, activities optimizer, interview prep, Coach Kairos | Dense, dark-UI, Lucide icons, rounded cards, framer-motion | **Inter** (sans) + **JetBrains Mono** (numbers) | `grokking/src/app/cc/` + `grokking/src/components/cc/` |

Both surfaces share `#D4AF37`-family gold as the single brand accent, the same near-black/cream pairing, and the same editorial voice. They diverge on: typography (serif vs sans), density (cinematic whitespace vs packed cards), radii (hard edges vs rounded‑2xl), and motion (GSAP scroll-pinning vs Framer spring).

See `ui_kits/landing/` and `ui_kits/app/` for recreations, and `slides/` for sample slide templates based on the pitch deck.

---

## Sources

**Codebase** (mounted locally, read-only): `grokking/`
- `grokking/KairosLearnLandingPage/` — Next.js 15 landing page (the canonical visual source for the marketing surface)
  - `app/globals.css` — core CSS vars for the landing palette
  - `app/layout.tsx` — font loader (Cormorant Garamond + DM Sans)
  - `components/*.tsx` + `components/*.module.css` — Nav, HeroSection, ScrollSequence, Features, Stats, CTASection, Footer
- `grokking/src/app/cc/` — College Counselor app pages (`page.tsx`, `essays/`, `activities-optimizer/`, `recommenders/`, `chances/`, `interview-prep/`, `share-settings/`)
- `grokking/src/app/my-schools/page.tsx` — school list view
- `grokking/src/components/cc/` — CC components (coach, essay, activities, recommenders, profile)
- `grokking/src/components/ai/` — shared AI coach shell (AICoach.tsx, SessionNotes.tsx, etc.)
- `grokking/src/app/globals.css` — core app CSS vars (black + gold dark theme)
- `grokking/src/app/layout.tsx` — Inter + JetBrains Mono loader
- `grokking/docs/coach-kairos/specs/phase0-04-landing-rebrand.md` — PRD for the college-counselor positioning
- `grokking/.agents/product-marketing-context.md` — voice & tone, audience, traction notes
- `grokking/images/pitch_deck_*.png` — pitch-deck visuals (cover hero, AI coaching, solution diagram, problem illustration, etc.)
- `grokking/public/kairos-logo.jpg` — master logo

**Uploads** (in `uploads/`):
- `uploads/logo.png` — dark badge variant of the compass-clock logo (navy/gold on black)
- `uploads/missing.png` — screenshot of the **Activities Optimizer** page (canonical app screenshot)

Assets copied into `assets/` for this design system — see "Index" below.

---

## Content fundamentals

**Voice in one line:** *Smart, specific, founder-led, no corporate jargon. Talks to the student directly. Warm but low-key — never bubbly.*

### Casing & mechanics
- **Sentence case for all UI labels and buttons.** `Run full review`, `Start Essay`, `New Essay`, `Browse Schools`. Never title-case. Never SHOUTY except the eyebrow/section labels on landing, which are `UPPERCASE` with `0.32em` tracking.
- **Title Case only for product-name feature headings** — `Essay Studio`, `Activities Optimizer`, `Interview Prep`, `Counselor Share Link`, `Coach Kairos`. These are proper nouns for sub-products.
- **em dashes (—) everywhere** to join two thoughts. `Edit bullets, get AI feedback, run full review` · `AI-guided essay writing — your words, your story` · `Your AI tutor that speaks your language.` This is the single most recognizable Kairos copywriting tic.
- **Serial commas** used. **Straight quotes** in the app, curly quotes allowed in landing prose.
- **Numerals for numerals.** `5 schools`, `650-word limit`, `$15/month`, `40+ languages`. Never "five schools."
- **Contractions welcome.** `you're`, `don't`, `we'll`.

### Pronouns
- **You-voice** throughout. `Your most important lesson is waiting.` `Your school list is empty.` `Your application toolkit.` Never `users`, rarely `we` except in brand pitches.
- **`I` appears only in AI dialog.** Coach Kairos speaks in first person: `I'll read your draft as you write.` `I think I've shared enough — please surface 2-3 concrete themes.`

### Tone patterns
- **Specific not squishy.** Always reference the real feature. Don't say "powerful AI" — say *"Practice with 10 Ivy+ alumni AI personas. Harvard, Yale, Stanford, MIT, and more."*
- **Numbers are the proof.** Hero sub on landing: *"Voice coaching, adaptive AI tutors, and structured courses across 40+ languages."* Feature blurbs lead with concrete claims (*"real-time pronunciation feedback"*, *"149 interactive Mermaid diagrams"*).
- **Empty states are friendly but terse.** `Your school list is empty.` `No activities or honors yet — import a resume or add entries from your profile.` `No essays yet. Click "New Essay" to start.`
- **Warnings are direct.** `Your list has no safety schools. Add at least 2 safety schools for a balanced list.` No emoji, no "whoops."
- **Italics, sparingly, for emphasis inside serif display text.** `Know when you're *ready* to learn` · `Courses that *evolve* with you` · `Your most important *lesson* is waiting.` The italicized word is always in `--kl-gold`.

### What KairosLearn doesn't do
- **No emoji in UI strings.** A single `⚠` appears on the Need-aware intl badge, and that's the exception. The landing page uses geometric Unicode glyphs (`◎ ⟡ ◈ ◐ ⬡ ◆`) as decorative icon placeholders — they read as glyphs, not emoji.
- **No exclamation points.** Ever. Scanning the codebase for `!` in user copy returns ~zero hits. Kairos does not yell.
- **No "✨ AI ✨" flourish.** The `Sparkles` icon from Lucide is used functionally (for AI-suggestion buttons) — never in copy.
- **No "welcome back," "hey there," or first-person-plural brand voice.** Kairos is the founder talking to you, not a marketing department.
- **No fake social proof.** Stats (`96% completion rate`, `50K+ learners`) are framed as metrics, not testimonials.

### Representative copy samples

> *"Your free AI college counselor. For first-gen students. In your language."*
> — positioning line, `phase0-04-landing-rebrand.md`

> *"Learn at the **Right Moment.**"*
> — landing hero headline (italic + gold on "Right Moment")

> *"Everything you need to **master** anything."*
> — features section header

> *"Voice coaching, adaptive AI tutors, and structured courses across 40+ languages. Your learning, timed perfectly."*
> — hero sub

> *"Edit bullets, get AI feedback, run full review."*
> — Activities Optimizer subtitle (in-app)

> *"Coach Kairos will pull these activities into every supplement brainstorm so you get topic ideas grounded in what you've actually done."*
> — in-app handoff copy

> *"I'll read your draft as you write. Ask me about grammar, phrasing, paragraph flow, or whether you're on track with the outline."*
> — Coach greeting in Draft Editor

---

## Visual foundations

### Color vibe
- **Dark always.** Neither surface has a light mode. The landing is a deep cold navy-black (`#05080d`); the app is true black (`#000`) with dark-grey elevated cards (`#141414`).
- **Accent = antique gold, one color.** `#d4a84b` on landing; `#D4AF37` in the app. This is the *only* brand hue — every call-to-action, every active-tab indicator, every icon-well, every AI-is-thinking pulse uses the same gold at varying opacities.
- **Cream, not white.** Foreground text is `#f2ede3` / `#f0ece2`, not `#fff`. This is intentional — makes the brand feel older, warmer, more editorial.
- **No other brand colors.** Red/green/blue/amber appear only as **semantic states** inside the app (reach/match/safety, error/success/warning, essay phase chips). Never as brand color.
- **Zero gradients** as a brand device. The only gradients in the system are:
  - vertical fade-to-bg at the bottom of the hero (protection gradient over the neural canvas)
  - radial vignette on the hero canvas
  - a single `from-[#D4AF37]/10 to-transparent` card on the Activities handoff panel
  No purple→pink "AI" gradients. No bluish tech-company gradients. (The app's `globals.css` has some old gradient utilities left over from a previous tech-interview brand — these are legacy and must not be used in new work. See `components/cc/*` for the live pattern.)

### Typography
- **Landing display:** *Cormorant Garamond*, weight **300**, often italic, in `--kl-gold-landing` for the emphasized word. The display is dramatic: `clamp(68px, 9.5vw, 128px)` at the hero.
- **Landing body:** *DM Sans*, weight 300, line-height 1.75 for prose, 1.85 in feature cards.
- **App display/body:** *Inter* across the board, weights 400–700. No serif in the app — the counselor UI is deliberately neutral so the writing is the focus.
- **App mono:** *JetBrains Mono* for word counts, stats, any tabular numerals.
- **Eyebrow labels (both surfaces):** UPPERCASE, `0.30–0.32em` tracking, 10–11px, in gold (landing) or muted white (app). `PLATFORM FEATURES` · `ACTIVITIES` · `HONORS` · `APPLYING AS`.

### Imagery
- **Photography:** essentially none on the marketing surface yet. The hero is a **live neural-network canvas** — particles + connecting lines, gold-on-navy, parallax-scrolled. The app has **no photography at all** — product visuals come from iconography and screenshots.
- **Pitch-deck imagery** (`assets/pitch/*.png`) skews editorial-tech: warm gold-on-black scenes, diagrammatic, no stock photos, no people.
- **No hand-drawn illustrations, no 3D renders, no Memphis shapes.**
- **Full-bleed:** reserved for the hero section only.

### Backgrounds & texture
- **Grain overlay on landing:** a fixed SVG turbulence noise, `opacity: 0.035`, animated in 10 keyframes across 0.6s to simulate film grain. Applied as a `fixed inset: -150%` overlay with `z-index: 1000`, pointer-events-none. See `.grain` in `colors_and_type.css` and the `Grain` card.
- **No grain in the app.** The product is clean.
- **Hairline dividers, not shadows.** Both surfaces prefer `1px solid rgba(cream, 0.09)` or `rgba(white, 0.08)` to define surface boundaries. Shadows are only used on the floating coach launcher and the hover state of the gradient-border card (`card-gradient-border` utility — app legacy).
- **Backdrop blur** is used for: the sticky nav when scrolled (landing, `blur(24px)`), and the `.glass` / `.glass-strong` utilities in the app.

### Layout rules
- **Landing:** centered column, `max-width: 1440px`, `padding: 150px 72px 100px` on major sections. Feature grids are `repeat(3, 1fr)` with `gap: 1.5px` (not a typo — the grid uses the card border as the divider, spaced by 1.5px).
- **App:** content column is `max-width: 3xl` (768px) for most tools pages (`essays`, `activities-optimizer`, `my-schools`), `max-width: 4xl` (896px) for the CC dashboard. Page padding is `px-4 py-10`.
- **Fixed elements (app):** floating `Coach Kairos` launcher is a 14×14 gold disc, `bottom-6 right-6`, `z-[9999]`. It flips into a right-side drawer `w-[400px]` on desktop, full-width sheet on mobile, with a spring transition.

### Borders, radii, corners
- **Landing is squared.** Buttons, feature cards, nav pill — all `border-radius: 0`. This is a deliberate editorial/brutalist choice.
- **App is rounded.** Primary cards `rounded-2xl` (16px). Buttons and rows `rounded-xl` (12px). Small chips `rounded-lg` (8px) or `rounded-md` (6px). Avatar and floating launcher are `rounded-full`.
- **Borders:** always a single 1px hairline, either `rgba(cream, .09)` on landing or `rgba(white, .08)` in the app. On hover, app cards shift border to `rgba(gold, .30–.40)`.

### Shadows & depth
- **Landing has no shadows.** Depth comes from grain + vignette + parallax + hairlines.
- **App shadows are subtle.** The floating coach launcher has `shadow-lg shadow-[#D4AF37]/20`. Popovers use inherited `shadow-xl` from Tailwind. The gradient-border card hover (`.card-gradient-border`) is the only showy shadow — and it's legacy purple/blue, to be avoided.

### Hover & press
- **Hover (app):**
  - Card borders lift from `white/10` to `[#D4AF37]/30–40`.
  - Background tints from transparent to `white/5 → white/10` or `gold/10 → gold/20`.
  - Arrow icons fade in and translate-x-0.5.
  - **No scale on hover** (except secondary CTAs with `-translate-y-0.5`).
- **Hover (landing):**
  - Primary button: `background: --cream → --gold` + `translateY(-1px)`.
  - Outline button: border brightens, text brightens.
  - Feature card: background tints gold + border gold + `translateY(-2px)` lift.
- **Press:** inherited browser default; some buttons use `opacity: 0.82` on active (the nav CTA). No shrink-on-press.
- **Focus:** relies on browser default ring; none explicitly styled. Flag if accessibility review needed.

### Motion
- **Landing:** **GSAP + ScrollTrigger** for all the signature moves — clip-in text reveals on hero, panel-pinning through the 3-step scroll sequence (01 Timing / 02 Voice / 03 Path), stat count-ups, feature-card stagger. Durations are long and cinematic: entrance timeline is 1.5s, scroll-pin duration is `+=2600` px. Easing is `power3.out` / `power2.out`.
- **App:** **Framer Motion** for route/card entrances — `initial opacity:0 y:20 → animate y:0` with `staggerChildren: 0.08`. Transitions are fast: `duration: 0.5`. The Coach drawer uses `spring, damping: 25, stiffness: 300`. Loading spinners are custom Tailwind `animate-spin` on a bordered circle with a gold top arc.
- **Ambient motion:** pulse rings around the Coach avatar when streaming (`animate-pulse` green dot), grain keyframe loop (0.6s), scroll-drop line in hero (2.2s infinite).
- **Reduced motion:** `@media (prefers-reduced-motion)` in `globals.css` drops all durations to 0.01ms.

### Transparency & blur
- **Blur is reserved for overlays.** Sticky nav when scrolled, Coach drawer backdrop (black/50 on mobile), app `.glass` utility (rarely used in CC).
- **Transparency is used constantly as a tonal tool.** Everything from `white/[0.02]` (subtle row bg) up to `white/15` is in active use. `rgba(cream, 0.09)` is the default hairline across the board.

### Iconography
See [`ICONOGRAPHY`](#iconography) section below.

---

## Iconography

**The app runs on [Lucide](https://lucide.dev) (React, via `lucide-react`).** Every icon in `grokking/src/components/cc/` and `grokking/src/app/cc/` is a Lucide glyph, used at its default 24px stroke-1.5 weight but sized down (`w-3.5 h-3.5` for inline, `w-4 h-4` for buttons, `w-5 h-5` for card wells, `w-7 h-7` / `w-8 h-8` for page icons). The Lucide set maps perfectly to the brand voice — thin strokes, geometric, restrained. Full list of active icons observed in the codebase:

```
GraduationCap  BookOpen  Target  Building2  ClipboardList  Users  Share2
ArrowRight  ArrowLeft  ChevronRight  Check  X  Plus  Minus
Sparkles  ListOrdered  Search  Pencil  PenLine  Upload  Send
FileText  Clock  MapPin  DollarSign  Calendar  MessageCircle
History  Eye  List  Loader2  AlertTriangle  ListChecks
Volume2  VolumeX  Languages  Mic
```

Convention: icons are **always `text-white/40`**, `text-white/50`, or `text-[#D4AF37]` — never full white, never colored. Gold is reserved for: (a) icons inside a gold well (`bg-[#D4AF37]/10 flex items-center justify-center rounded-xl`), (b) active-tab icons, (c) the AI `Sparkles` glyph.

In this design system we reference Lucide via the official CDN (`https://unpkg.com/lucide@latest`) — no local sprite. See the `Iconography` card in `preview/` for usage samples.

**The landing page does NOT use Lucide.** Its "icons" are **single Unicode glyphs** chosen to feel esoteric: `◎ ⟡ ◈ ◐ ⬡ ◆` inside a 38×38 thin-bordered gold square. This is a deliberate stylistic contrast — the app is tool-like, the landing is editorial/mystical.

**Emoji:** not used in UI chrome. Flag country flags appear once, inside the Coach-language picker (`🇺🇸 🇪🇸 🇨🇳 🇯🇵 …`), which are the unicode country flag emoji. That's the sole exception.

**Logos & brand marks** (in `assets/`):
- `assets/kairos-logo-badge.png` — dark circular badge variant (navy + gold compass-clock, "KAIROS" wordmark below)
- `assets/kairos-logo.jpg` — master logo (from the live site)
- Pitch deck visuals in `assets/pitch/` for reference when composing slide templates

---

## Font substitutions

**No substitutions needed.** Both font families are loaded directly from Google Fonts (`Cormorant Garamond`, `DM Sans`, `Inter`, `JetBrains Mono`) — the same source `next/font` uses in the codebase. See the `@import` at the top of `colors_and_type.css`.

If you're pulling this system into an offline/print context and need local files, flag that and we'll bundle the TTFs.

---

## Index — manifest of this folder

```
/
├── README.md                     ← you are here
├── SKILL.md                      ← Agent Skills entrypoint (drop into Claude Code)
├── colors_and_type.css           ← CSS variables & semantic type classes
│
├── assets/
│   ├── kairos-logo-badge.png     ← dark circular badge (primary)
│   ├── kairos-logo.jpg           ← master logo
│   ├── pitch/                    ← pitch-deck reference images
│   │   ├── pitch_deck_cover_hero.png
│   │   ├── pitch_deck_ai_coaching.png
│   │   ├── pitch_deck_solution_diagram.png
│   │   └── pitch_deck_problem_illustration.png
│   └── screenshots/
│       └── activities-optimizer.png   ← canonical app screenshot from user
│
├── preview/                      ← design-system cards (Design System tab)
│   ├── colors-*.html             ← color palettes
│   ├── type-*.html               ← typography specimens
│   ├── spacing-*.html            ← radii, spacing, shadows
│   ├── components-*.html         ← buttons, cards, chips, inputs, coach bubble, etc.
│   └── brand-*.html              ← logo, iconography, grain, hero canvas
│
├── ui_kits/
│   ├── landing/                  ← cinematic marketing surface
│   │   ├── README.md
│   │   ├── index.html
│   │   └── *.jsx                 ← Nav, Hero, ScrollSequence, Features, Stats, CTA, Footer
│   └── app/                      ← College Counselor product surface
│       ├── README.md
│       ├── index.html
│       └── *.jsx                 ← Sidebar, Dashboard, EssayStudio, SchoolList, ActivitiesOptimizer, CoachDrawer
│
└── slides/                       ← pitch-style slide templates (16:9)
    ├── index.html
    └── *.jsx                     ← TitleSlide, TwoColumnSlide, BigQuoteSlide, MetricSlide, etc.
```
