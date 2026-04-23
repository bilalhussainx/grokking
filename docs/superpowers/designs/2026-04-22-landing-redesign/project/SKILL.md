---
name: KairosLearn brand system
description: Apply the KairosLearn visual system — a dual-surface dark brand (cinematic gold-on-navy landing + rounded black-and-gold counselor app) with a single antique-gold accent, italicized Cormorant display, Inter app UI, and a strict editorial voice. Use when producing anything for KairosLearn — landing work, product screens, slides, emails, social, pitch decks.
---

# KairosLearn — how to design for the brand

KairosLearn is a multilingual AI college counselor ("Coach Kairos") for first‑gen, international, and under‑resourced students. The name is Greek for *the right moment*. Tone is editorial, founder‑led, specific.

Always load `colors_and_type.css` at the root. Read `README.md` in full before designing — it's the canonical source. Cards in `preview/` show every token in use.

## The single most important rule

**There are TWO surfaces with ONE shared DNA. Never mix them.** Pick a surface first, then follow its rules consistently.

| | Landing / Marketing | Product / College Counselor App |
|---|---|---|
| Role | Pitch, convert, host deck | Logged‑in toolkit — essays, schools, activities, interview prep |
| Personality | Cinematic, editorial, grain, parallax | Dense, tool‑like, focused, calm |
| Background | `#05080d` cold navy‑black | `#000` true black + `#141414` elevated cards |
| Display type | **Cormorant Garamond 300**, italic + gold on emphasis word | **Inter** across the board |
| Body type | **DM Sans 300**, line‑height 1.75–1.85 | **Inter** + **JetBrains Mono** for numerals |
| Corners | **Squared** — `border-radius: 0` | **Rounded** — `rounded-2xl` (16), `rounded-xl` (12), `rounded-lg` (8) |
| Motion | GSAP + ScrollTrigger, 1.5–2.6s cinematic | Framer Motion, 0.5s springs, stagger 0.08 |
| Icons | Unicode glyphs `◎ ⟡ ◈ ◐ ⬡ ◆` in 38px thin‑bordered gold square | Lucide (`lucide-react`) at stroke‑1.5, sized 3.5/4/5 |
| Grain | Yes — SVG turbulence, opacity 0.035 | No — the product is clean |
| Kit folder | `ui_kits/landing.jsx` | `ui_kits/app.jsx` |

## Tokens (load from `colors_and_type.css`)

- **Single brand accent** — `#D4AF37` (app) / `#d4a84b` (landing). One gold, everywhere — CTAs, active tabs, icon wells, the AI‑thinking pulse. **Never invent a second brand hue.**
- **Foreground is cream, not white** — `#f2ede3` (landing) / `#f0ece2` (app). This is what makes the brand feel older and warmer.
- **Semantic colors** — red / amber / green / blue — are used **only inside the app** for state (reach/match/safety, error/warn/success). They're never brand color.
- **Zero gradients as a brand device.** Allowed: hero‑bottom fade‑to‑bg, hero canvas vignette, one `gold/10→transparent` Activities handoff card. That's it. No purple→pink AI gradients. No bluish tech gradients.
- **Hairlines over shadows.** `1px solid rgba(cream, .09)` (landing) or `rgba(white, .08)` (app) is the primary divider. Shadows are reserved for the floating coach launcher.

## Voice & copywriting — the non‑negotiables

1. **em dashes (—) joining two thoughts** — this is the single most recognizable Kairos tic. *"Edit bullets, get AI feedback — run full review."*
2. **Sentence case for UI labels** — `Run full review`, never `Run Full Review`. Title Case is only for sub‑product proper nouns: `Essay Studio`, `Activities Optimizer`, `Coach Kairos`.
3. **UPPERCASE eyebrows** at `0.30–0.32em` tracking, 10–11px. `PLATFORM FEATURES`, `ACTIVITIES`.
4. **You‑voice, never "users."** `I` appears only in Coach Kairos dialog.
5. **Specific not squishy.** Numbers as proof — *"40+ languages,"* *"149 interactive Mermaid diagrams,"* *"10 Ivy+ alumni AI personas."* Never "powerful AI."
6. **No exclamation points. Ever.** No emoji in UI chrome (country flags in the language picker are the one exception). No "✨ AI ✨" flourish. No "welcome back."
7. **Italics, sparingly, for emphasis inside serif display** — and the italicized word is **always in gold**. *"Know when you're **ready** to learn."*
8. **Empty states are friendly but terse** — *"Your school list is empty."* *"No essays yet. Click New Essay to start."*

## Layout & structure

- **Landing** — centered column, `max-width: 1440px`, section padding `150px 72px 100px`. Feature grids use a 1.5px gap with card borders as the divider. Full‑bleed is reserved for the hero.
- **App** — tool pages are `max-width: 3xl` (768px); CC dashboard is `max-width: 4xl` (896px). Page padding `px-4 py-10`. Floating coach launcher is a 14×14 gold disc at `bottom-6 right-6, z-[9999]`, opening a 400px right‑side drawer.

## Checklist before shipping

- [ ] Picked **one** surface (landing OR app) — no mixing fonts, corners, or densities
- [ ] Loaded `colors_and_type.css`; no hex values hard‑coded outside the tokens
- [ ] Every gold is the **same** gold — no second accent
- [ ] em dashes present in ≥1 headline or subhead
- [ ] Sentence case on buttons; UPPERCASE eyebrows where used
- [ ] No gradients outside the three allowlisted cases
- [ ] No emoji in UI; Lucide (app) or Unicode glyphs (landing) for icons
- [ ] No exclamation points anywhere in copy
- [ ] Grain overlay included on landing, absent on app
- [ ] Italicized emphasis word (if any) is rendered in gold

## When in doubt

Open `ui_kits/index.html` — the two canonical artboards sit side‑by‑side and show the full vocabulary. Copy the pattern you need from there rather than inventing a new one.
