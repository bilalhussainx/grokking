**NOTE FOR SESSION B, from Claude's pre-deploy testing (2026-09-27).** Paste it into session B after D3-IMPL-1.1. Fold each item into the D4 gate named; there's no separate gate.

Evidence, all in the `grokking-integrate` worktree:
- `docs/qa/2026-09-27-predeploy-workflow-report.md` (the signed-in workflows and a re-test);
- `docs/qa/evidence/predeploy-2026-09-27/` (screenshots; signed-out pages at 1440 and 375; homepage in five languages);
- `docs/qa/2026-09-27-audit-resolution-matrix.md` (every QA-01…64 item with its status; your rows are the OPEN-DESIGN ones).

Engineering fixes already made are recorded in `docs/handoff/claude-progress.md`. Don't design around a bug that's already fixed.

## Legibility (every gate, starting with D3-IMPL-1.1)

1. **Small text.**
   - On `/product/*` and `/stories`, 37–47% of rendered text is under 12px; most of it is the 10.5px marketing nav.
   - `/pricing` goes down to 9px.
   - The TopNav "⌘K" hint is 10px.
   - Body and nav text should be at least 14px on phone and 12px for captions and badges.
2. **Low contrast.** Most app pages have 10–37 text elements below 3:1, mostly `white/40`–`white/50` on near-black. Aim for 4.5:1 on body text.
3. **Scripts.** Hindi, Punjabi and Urdu all render in real web fonts (Noto Sans Devanagari, Noto Sans Gurmukhi, Noto Nastaliq Urdu), which is good. On phone, the homepage language label is 10–11px. In Urdu, Latin letters and digits fall back to Times New Roman; add a Latin fallback to the Urdu stack.

## D4.8, pricing and upgrade moments

4. **Signed-in `/pricing` ignores the session.**
   - The header still offers "Sign in / Start for free".
   - "Start free" and "Start Pro free" send a signed-in trial student to `/intake`, then `/signup`.
   - Design the signed-in states: Free, in trial, Pro, and trial ended.
5. **Trial copy versus checkout.**
   - "7-day trial. No card required." is true of the automatic signup trial.
   - But "Start Pro" during the trial opens Stripe asking for a card.
   - Claude changed checkout so a student in the trial pays nothing today: Stripe shows "6 days free · then $15/month starting <trial end>".
   - Design that CTA as "Keep Pro after your trial — no charge until <date>" rather than "Start Pro".
6. **Settings.**
   - It shows "Role: pro" for a trial student.
   - "Login streak" is a leftover from the course product.
   - The Subscription card has no action; it should hand off to the Stripe customer portal.
   - The referral card is hidden until referral codes exist (founder decision).

## D4.4, Essay Studio

7. **Speed.** Brainstorm replies take about 12–30 seconds to render. Design the waiting state, and show that the coach is writing.
8. **Theme picker.** It sometimes offers outline labels ("Opening (lines 1-3)") as themes. Claude will tighten extraction; design the picker so a student can dismiss a wrong chip.
9. **Draft outline sidebar.** The outline bullets in Draft are 11–11.5px.

## D4.5, schools and D4.9, marketplace

10. **`/find-counselor`** lists only admin-verified counselors now, and there are none yet, so it shows the empty state. Design an honest empty state: what the marketplace is, and "Counselors are being verified; ask your school counselor for an invite code."
11. **Net price** says "not yet in our estimator" for schools without data (for example Toronto). Design that state so it never reads as $0.

Rules are as before: mobile first, grounded data only, never promise admission, the AI never writes essay prose, no `npm run test:unit`, and explicit-path commits with `Co-Authored-By: claude-flow <ruv@ruv.net>`.
