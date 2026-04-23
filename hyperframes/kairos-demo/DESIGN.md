# KairosLearn Demo — Visual Identity

## Style Prompt
Cinematic dark-mode brand system. Navy `#05080d` canvas with cream `#f2ede3` typography and a single antique-gold accent `#d4a84b`. Cormorant Garamond 300 italic for display moments (numbers, editorial one-liners), DM Sans 300 for body, JetBrains Mono for meta labels and tabular numerics. Interface surfaces are near-black `#141414` cards on the navy canvas with gold hairline edges (`rgba(212,168,75,.24)`). Every headline has one italicised gold word; every eyebrow is 10–11 px uppercase tracking 0.22em. No drop shadows, no gradients except radial gold glows behind hero frames and 1 px gold hairlines connecting pipeline steps. Motion is confident and editorial — 0.6–0.8s entrances with `power3.out`, no bouncy elastic, no frantic pacing.

## Colors
- `#05080d` — deep navy canvas
- `#141414` — app card surface
- `#d4a84b` — antique gold accent (landing)
- `#D4AF37` — gold (app surface, brighter)
- `#f2ede3` — cream foreground
- `#34d399` — live/saved status dot
- `rgba(212,168,75,.30)` — gold hairline border
- `rgba(242,237,227,.10)` — standard hairline
- `#f87171` — reach tier
- `#4ade80` — match / submitted
- `#60a5fa` — safety tier

## Typography
- **Display:** Cormorant Garamond 300 italic — headlines, numbers (01/02/03), figures ($10, 80%, 415 students)
- **Body:** DM Sans 300 — prose, CTAs, UI copy
- **Meta:** JetBrains Mono — eyebrows, counters, tabular numerics

## Motion
- Entrance: `gsap.from({ y: 30, opacity: 0, duration: 0.7, ease: "power3.out" })`
- Slight 0.2–0.3s stagger between siblings
- No exit animations between scenes — transitions handle scene changes

## What NOT to Do
- No bright blues, purples, or emoji splashes
- No uppercase everything — only eyebrows and CTAs are upper
- No drop shadows on cards — use gold hairline edges + subtle inner glow only
- No stock-photo hero imagery — everything is typography, cards, and live-looking UI
- No exclamation marks or marketing filler copy
