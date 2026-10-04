# S6 — Landing page and /counselors page (effort: High)

## Why
The founder: "I myself am not convinced that any student would be interested … the design looks like a homework diary." Students must see in 5 seconds:
- what this is (an AI admissions counselor with a team);
- what it does for them (real tools and real work between chats);
- why it beats what they tried (the complaints-to-answers table).

Counselors need their own page.

## Read first
- 03-DESIGN-DIRECTION §1, §2, §5 and §7 (binding).
- 02-SPEC §9, the claims table. **Every sentence must pass it at deploy time.**
- `docs/design/2026-10-03-landing-audit.md`: fix its NOW items on the way: one header and footer on all signed-out pages, a mobile header CTA, canonical URLs per page on the www host, page-specific OG titles, the double-logo issue, and `/find-counselor` noindex while empty.
- Current code: `src/app/page.tsx`, `src/components/marketing/daybreak/*` (DaybreakHomepage, Shell, Footer, NextStepCheck, CostCheck), `src/components/marketing/MarketingShell.tsx`, `src/app/pricing/page.tsx`, `src/lib/seo.ts`, `src/lib/pricing.ts`, `src/lib/faq-items.ts`, `src/lib/coach-language-claim.ts`, and the existing tests in `src/components/marketing/daybreak/daybreak-homepage.test.tsx`.

## Scope
1. **A new homepage** with the 03-DESIGN §5 structure, built from Daybreak components. The hero uses `KairosFace` (S5) and a **product frame** that replays a fixture conversation: the student asks about their personal statement, Kairos brings in Wren, a story card is saved. Use the real `ProposalCard` and handoff banner components with fixtures. The frame is labeled "Example".
2. **Recorded voice demo:** "Hear Kairos" plays short pre-recorded clips (en plus the languages verified in S1 and S2 so far), with captions.
   - Generate them with the **production voice settings** through a script `scripts/marketing/record-voice-clips.mjs` into `public/audio/kairos/<lang>.mp3`, with a transcript JSON alongside. Keep the total ≤ 1.5 MB, lazy-loaded.
   - No live anonymous voice (security).
3. **"Your counseling team":** 6 cards from the playbook registry (name, title, one "does with you" line). Read names and titles from `src/lib/cc/roles`, so they never drift.
4. **"What Kairos does while you're busy":** a proactive timeline. Label items not yet on for all students as "Rolling out". Read their state from the flag config through a small server helper; don't hard-code it.
5. **Signature workflows** grid: story bank, hot seat, balanced list, requirements checklist, and aid plan **only if S8 has shipped** (hide the tile otherwise).
5b. **The differentiation bands from 03-DESIGN §5** (items 3, 5, 8 and 9):
   - **"Right, not just fast":** a citation chip, the "not yet verified" state and a rule conflict card, all as real S3 components with fixtures.
   - **"Your words. Always."** (integrity log row plus a link to Common App's fraud policy).
   - **"Built on the rules professional counselors follow"** (IECA and NACAC quotes with links).
   - **The family band.**

   Each band renders only when its slice is live (a server helper per feature); otherwise it's hidden.
6. **Complaints-to-answers table:**

   | They complained about | What Kairos does |
   |---|---|
   | wrong deadlines | dates come with a source, or "not yet verified" |
   | AI spam | no ads; Kairos only messages you about your own plan, and you control nudges |
   | $25k firms and refund fights | $15/month or $99/year, cancel anytime (check the refund wording in `/terms`) |
   | slow replies | answers in seconds, any hour |
   | US-only | US, UK, Canada and transfer |
   | chat that waits | weekly plan and check-ins, at your pace |
   | wrong chance numbers | no made-up odds: published admit rates with the year and source |
   | "they don't know you" | Kairos remembers your stories and plan, and you can see and edit what it knows |
   | AI that writes for you (and fraud risk) | coaches only; you get a "coached, not written" record |

   The CollegeVine "recruiter money" line stays out until the founder confirms ([OPEN]).
7. **Voice band:** the languages from `verified-voice-languages.ts` (S11 finalizes it; in S6 show only en, es and de unless S1/S2 probes show more passing) with the measured p50 from the latest probe file.
8. **Pricing** from `pricing.ts` (`TRIAL_TERMS`); the FAQ from `faq-items.ts`.
9. **`/counselors`:**
   - a hero for agencies and independent counselors;
   - a roster screenshot frame (fixture);
   - the essay review frame (inline comments plus review states);
   - the work queue frame (S7, once shipped; otherwise omit it);
   - head review of junior counselors' comments, invite codes, services and payouts;
   - how students and counselors share the plan;
   - Kairos does the accountability between sessions and refers cases to you (S10 referrals in the S7 queue);
   - the student-shared integrity log (S10), useful when a school asks about AI use;
   - a CTA to counselor signup (`/counselor/onboard`).
10. **Header:** a Students | Counselors switch, "Start free" on mobile and desktop, and one header and footer everywhere signed-out (home, pricing, FAQ, about, integrity, privacy, terms, login, signup, counselors). Retire the navy/gold and black shells on signed-out pages.
11. **SEO:** per-page canonical on `https://www.kairoslearn.com`, unique titles and descriptions and OG titles via `pageMetadata` (`src/lib/seo.ts`). The sitemap includes `/counselors`.

## Tests first
- The homepage renders the team from the registry.
- The workflow grid hides aid until a flag or helper says S8 shipped.
- A claims test: render the homepage and `/counselors` to text and assert that forbidden phrases are absent unless enabled:
  - "every university";
  - "sub-second" or "under a second" without a measured probe file;
  - "never sell" until a config flag `FOUNDER_CONFIRMED_NO_DATA_SALE` is true;
  - "scholarship finder" before S8;
  - "catches plan conflicts" before S3 is live for everyone;
  - "coached, not written record" before S10.

  Always forbidden: "safety school", "% chance", "chances of admission", "guarantee", "× more likely", "got into", testimonials, and IECA or NACAC logos or "member"/"endorsed" wording.
- The "rules counselors follow" band links to the IECA and NACAC source documents in `docs/research/2026-09-27-agent-differentiation-research.md` §9 [S12][S13].
- Prices come from `pricing.ts` (no hard-coded "$15").
- The language count comes from the verified list.
- Canonical and OG per page.
- One header component on all signed-out routes.

## Evidence
- Screenshots at 375 and 1440 of every signed-out page.
- A Lighthouse run on `/` (performance ≥ 85 mobile, accessibility ≥ 95). Record LCP and total transfer weight, and keep the homepage ≤ 1.2 MB transferred before audio is played.
- No overflow at 375.

## Prod checks
- 5-second test: a fresh Playwright load of `/` at 375 must show "Kairos", "admissions counselor", "US, UK" and "Canada", and "Start free" above the fold. Assert by bounding box.
- The audio plays (the request returns 200 and the clip has a duration > 2 s).
- Canonicals are correct per page.
- `/counselors` is linked from the header.
