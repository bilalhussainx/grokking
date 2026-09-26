**ASTRA — SESSION D: brand craft. The hand-made details that make KairosLearn feel personally made rather than AI-generated.** This is a new session. Session B is implementing the merged "Daybreak + Table" design system on branch `design/daybreak` (see `docs/handoff/astra-gate-d3r2-response.md`). You make the craft assets it will use. **No production code:** deliver assets and specs under `docs/design/brand/`, and session B wires them in.

## Read first

- `docs/handoff/astra-gate-d3r2-response.md`: the chosen direction, and why.
- `docs/design/2026-09-d3r2-daybreak-directions.md`.
- The mocks in `docs/design/mocks/homepage-r2/`, especially Daybreak.
- `docs/brand/kairos-icon-512.png` and `public/kairos-logo.jpg`, the current mark (navy and gold).
- `docs/research/2026-09-26-competitors-and-negative-reviews.md`: what students distrust about AI tools.

## Deliver, one gate at the end (GATE BRAND-1)

1. **The mark in the new palette.** Redraw the KAIROS emblem (clock, star and rising arrow) as a clean vector SVG in the Daybreak palette, and keep the navy version as a legacy asset.
   - Produce an app icon family for the installable phone app: 512 and 192 maskable with safe-zone padding, 180 apple-touch, 32 and 16 favicon, and a monochrome variant.
   - Also: an Open Graph card template at 1200×630 for home, pricing and "your next good step".
   - The mark must be legible at 16px.
2. **An original illustration set**, as SVG, each file under 4 KB, in one consistent hand:
   - one spot illustration per student stage: g9 exploring, g10, junior, senior writing, submitted, decisions, transfer, and "not sure yet";
   - a family set (a parent and student at a table; grandparent; siblings) showing many cultures without stereotypes;
   - empty states (no schools yet, no essays yet, no counselor yet);
   - celebration moments (step done, application submitted), using the Patchwork tile motif sparingly.

   Abstract or illustrative people only; nothing that looks like a real user or a testimonial.
3. **Voice and microcopy kit.** For each state that matters, write the exact words in English. Cover:
   - loading, empty, error and offline;
   - a fair-use limit reached (Pro: "resets at midnight UTC; nothing is lost");
   - grade-9 stage gating ("Essays open in grade 11…");
   - a declined payment, and "we couldn't save".

   Then give the same set in **Urdu, Hindi, Punjabi (Gurmukhi) and Spanish**. Mark each non-English string `needs-native-review`, and don't claim fluency you can't verify. Write it as a JSON catalogue the app can import (`docs/design/brand/microcopy.json`).
4. **Anti-slop checklist.** A one-page rubric Claude will use to review every future surface:
   - no generic gradient blobs, no stock-like "diverse students laughing";
   - no emoji as UI;
   - no "Unlock your potential" or "AI-powered" hype;
   - no fake urgency;
   - every number sourced;
   - one primary action per screen;
   - it reads like a kind person wrote it.

   Include before-and-after examples from today's app, from the screenshots in `docs/qa/evidence/student-variants/`.

## Constraints

- Every asset is original work. Fonts and any third-party elements must be OFL-licensed or similar, with the license noted.
- WCAG AA contrast for any text on illustrations.
- Keep files small; SVGs are optimized.
- Never run `npm run test:unit`. Don't read `.env.local`. No deploys. Stage explicit paths only. Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`.
- **Memory:** the founder's machine is limited. Use one browser at a time and close preview servers when you're done.

Stop at **GATE BRAND-1** with a short message and a contact sheet (`docs/design/brand/contact-sheet.png`) showing everything at a glance.
