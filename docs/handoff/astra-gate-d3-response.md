**GATE D3: CHANGES. Reimagine the visual identity. The founder has approved leaving the old design system.**

Your three mocks are solid interaction work: honest grounding, working inputs, 375 and 1440 checked, no invented data. But they all wear the **old KairosLearn skin** (navy/black, cream Cormorant, gold accents), because Claude's kickoff told you to build on `DESIGN.md`. That was Claude's mistake, not yours. The founder's verdict: *"the design looks exactly like the old design… I want more warm colors, welcoming students of all backgrounds."*

**`DESIGN.md` and `kairos-tokens.css` are no longer binding for D3.** D3 now proposes a **new design system**: palette, type, shape, imagery, motion and voice. D4 will follow it, and Claude will implement it as new tokens after this gate. Use your full frontend design capability at high reasoning. This is a creative brief, not a re-skin.

## What to keep from this round

- **Interaction A, "Your next good step,"** stays the homepage hero concept. The CEO has picked it: three answers → one next thing to do, with no signup.
- **B's cost check** becomes a secondary module, reached from A ("Thinking about cost first?"). Its honest "unknown is a place to start" behavior stays.
- **C** folds into A's result. Where it helps, A shows the first unanswered planning question.
- All the grounding work in `work-diary/d3-source-grounding.md` still applies.

## The brief: warm, welcoming, for students of every background

Who we serve:
- first-generation students
- international applicants (Pakistan, India, Canada and beyond)
- low-income families
- students whose parents don't speak English at home
- transfer students
- a 14-year-old in grade 9 and a stressed senior alike

Many will visit on a phone, at night, on a slow connection.

The feeling to design for: **"someone kind is sitting next to me at the kitchen table."** It shouldn't feel like an Ivy League brochure, a fintech dashboard or a luxury brand. Prestige cues (black and gold, crests, serif grandeur) tell many of our students "this isn't for you."

1. **Warm palette.** Warm light surfaces by default: sunlit paper, clay, apricot, saffron, terracotta, warm greens or teals as a calm counterweight, and a deep warm ink for text instead of pure black. A dark mode can come later and must stay warm, never cold black.
   - Every text/background pair meets **WCAG AA**. Report the contrast ratios.
   - Color is never the only signal.
2. **Type that welcomes.** Pick a friendly, highly legible humanist sans for UI and body, plus an optional warm display face for headlines. Both need **good support for Latin, Devanagari, Gurmukhi and Arabic/Nastaliq scripts**, or a named per-script fallback stack, because we coach in Urdu, Hindi, Punjabi and Spanish. Show a headline rendered in at least three scripts.
3. **Everyone sees themselves.** Use illustration, pattern or abstract art that suggests many cultures and family settings without stereotypes or tokenism.
   - **No stock photos of "our students," no fake testimonials, no invented user counts** (the grounding rule).
   - If you use people, they're illustrations and clearly not claims about real users.
4. **Multilingual welcome.** A visible, real language choice near the top, using the languages the coach actually supports (`src/lib/cc/coach-languages.ts`, `COACH_LANGUAGES`). Greet in several scripts.
   - The previous "{N} configured language options" copy was honest but flat (see `docs/handoff/codex-prompts/session-b-note-01-landing-copy.md`). Make the honest version warm: name the languages people recognize.
5. **Family is part of it.** Parents are often in the room. The page should make room for them (family mode exists), with plain words and no jargon.
6. **Calm, not hype.** Soft shapes and generous spacing. Motion is gentle and respects `prefers-reduced-motion`. No countdown pressure or FOMO. Use the "one good next step" voice throughout.
7. **Phone first and fast.** Design at **375×812 first**, then 1440×900. Keep the hero interactive within the first screen on a phone. Budget the page weight: no heavy video, and images lazy-loaded.

## Deliverables for GATE D3 (round 2)

- **Three genuinely different visual directions**, each a full homepage mock with the A interaction working. Different means different palettes, type and imagery, not three layouts in one style. For example:
  - (1) sunrise and paper: light and optimistic;
  - (2) kitchen table: earthy and family-centred;
  - (3) mosaic: vibrant, pattern-rich and multicultural.

  Name and justify each.
- For each direction:
  - a **one-page design system sheet**: palette with hex values and contrast ratios, type scale with script samples, radii, spacing, buttons, inputs, cards, focus states and the illustration or pattern language;
  - one **app-surface preview**: the student dashboard's first screen in that direction, showing the system scales beyond marketing. Mock only.
- Screenshots at 375 and 1440, plus your browser assertions, in `work-diary/d3r2-validation.md`.
- Mocks go in `docs/design/mocks/homepage-r2/`. Keep round 1 for reference. No production code.

## Unchanged rules

- Grounding: every claim maps to code, a table or a dated source. Never promise admission. The AI never writes essays.
- Pricing copy: Free (200 credits once), Pro $15/month or $99/year, unlimited under fair use (300 coach messages and 120 voice minutes a day), with a 7-day trial. Import from `src/lib/pricing.ts` in production. The yearly price shows only when configured.
- Never run `npm run test:unit`. `git add` explicit paths only. Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`.

Stop at **GATE D3-R2**. Recommend one direction, and say what you'd refine in it.
