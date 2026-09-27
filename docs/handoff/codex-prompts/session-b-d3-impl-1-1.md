**ASTRA — SESSION B: D3-IMPL-1.1 (review fixes) and the admissions-only direction.** Paste into session B. Work on `design/daybreak` in `../grokking-daybreak`, as before. Stop at **GATE D3-IMPL-1.1**.

## 1. The product changed (founder, 2026-09-26)

KairosLearn is now **only an AI college-admissions counselor**. The study-courses product is being removed:
- the course catalogue, lessons and code exercises;
- language courses and `/talk` tutoring;
- coding/tech interview prep and career pathways;
- classrooms and live lesson sessions;
- XP, gems, leaderboard and achievements;
- course-completion credentials.

Claude is doing the removal on branch `refocus/admissions-only`. The plan is `docs/superpowers/plans/2026-09-26-admissions-only-refocus.md` on that branch. Retired URLs redirect to admissions surfaces.

What that means for you:
- Design **no** course, lesson, language-course, coding-interview, XP or leaderboard surface, and no copy that mentions them. "Learn anything", "courses", "lessons" and "tutoring" are gone from the voice of the product.
- **"Courses" still exists in one sense:** a student's high-school coursework (AP/IB rigor, `/cc/courses`). D4.6 keeps it.
- Interview prep means **college interviews** only (`/cc/interview-prep`, `/college-interviews`).
- **To avoid merge conflicts, do not edit these files in this slice:**
  - `src/app/providers.tsx`, `src/app/page.tsx`, `src/middleware.ts`, `src/app/settings/page.tsx`
  - `src/components/layout/TopNav.tsx`, `src/components/layout/Footer.tsx`
  - `src/app/sitemap.ts`, `src/app/manifest.ts`, `src/app/robots.ts`, `src/app/llms*.txt/`
  - `next.config.ts`

  Claude changes them for the refocus: dead links out, admissions links in, no visual changes. If your design needs a change in one of them, describe it in the gate message and Claude will make it.

## 2. Fixes from Claude's D3-IMPL-1 review (do these)

1. **Script font weight.** The script/display faces add about 314 KB on first load.
   - Subset them to the glyphs the homepage uses: Latin plus the scripts actually rendered.
   - Keep `font-display: swap`, and preload only the hero face.
   - Remove the duplicate Urdu font file (it is loaded twice).
   - Target: fonts ≤ 200 KiB on `/` (Claude's measurement today is 574 KiB of fonts; `/pricing` is 200).
2. **Hardcoded fair-use numbers.** `DaybreakHomepage.tsx:37` says "300" and "120". Import them from `src/lib/pricing.ts`. If a named export doesn't exist, ask for it in the gate message; Claude adds it. No price or limit literal may appear in a component.
3. **BRAND-1 adoption.** Use the approved emblem (`docs/brand/kairos-icon-512.png`, `docs/brand/kairos-logo-1024.png`) in the Daybreak header and footer.
   - Produce the PWA icon set Claude needs for the installable phone app: 192, 512 and 512 maskable PNGs, plus a 180 apple-touch icon.
   - Put them in `public/icons/`.
   - Give Claude the `theme_color` and `background_color` for the manifest. Claude wires the manifest.
4. **Small UI fixes from the review:**
   - Cost check announces twice to screen readers; announce once.
   - The cost input rejects "45,000" with a comma; accept it.
   - Scope the `html:has(.daybreak)` rule so it can't leak into app pages.
   - Align the trial copy with `src/lib/pricing.ts` (7-day trial, then $15/month or $99/year).
   - Remove dead code left from R1/R2 mocks.
   - Make the homepage tests assert behavior, not class names.
5. **Footer design.** Design the Daybreak footer for the admissions-only link set:
   - **Platform:** Coach Kairos `/cc`, School list `/schools`, Pricing `/pricing`, Interview prep `/cc/interview-prep`.
   - **Resources:** About `/about`, FAQ `/faq`, Academic integrity `/integrity`.
   - **Legal:** Privacy `/privacy`, Terms `/terms`.

   Build it inside `src/components/marketing/daybreak/`. Claude swaps it into the shared `Footer.tsx`.

## 3. Rules (unchanged)

- Mobile-first: check 375×812 and 1440×900.
- Grounded data only. Never promise admission. The AI never writes essay prose.
- Never run `npm run test:unit`. Use `npx vitest run src`.
- Don't read `.env.local`. Use `git add` with explicit paths.
- Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`.

## Gate message (GATE D3-IMPL-1.1)

- commits;
- font weight before and after on `/`;
- icon file list with the two colors;
- any `pricing.ts` export you need;
- any change you need in the files Claude owns (§1);
- screenshots at both widths.

**After this gate, D4.2 (app shell and navigation) is the next slice.** Design the signed-in navigation for an admissions-only product. The primary destinations are: dashboard, Coach Kairos, school list, applications and deadlines, essays, activities, aid and net price, interview prep, and family mode. Counselors get their own workspace nav. Follow `session-b-note-02` for grade-stage honesty.
