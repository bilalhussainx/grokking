# OpenClaw Platform Audit Brief v2 — KairosLearn (refined)

**Date:** 2026-05-02
**Supersedes:** `2026-05-01-openclaw-platform-audit-brief.md` (kept for reference; the v1 was ~$22 of LLM and 50% verifiable from code).
**Target:** OpenClaw against `https://www.kairoslearn.com` (production)
**Budget ceiling:** $12 of LLM cost. Stop and report if exceeded by 20%.
**Strategic questions in v1 § 7 are NOT in scope.** Run those in Claude.ai Projects per `2026-05-02-kairoslearn-projects-strategic-brief.md`.

---

## What changed from v1 — read this first

These items are **already confirmed by code or existing tests** and must be skipped:

- Every commit hash + route in v1 § 4 (Feature Inventory) — verified by `git log` + `ls`.
- Variant routing logic (v1 § 5 Common Spine step 6) — `selectVariant()` has 17/17 unit tests passing. Just *observe* which variant renders; don't probe the algorithm.
- Coach Kairos variant-awareness — `scripts/test-variant-drift.ts` measured 0% drift across 35 synthetic probes against live OpenRouter Sonnet 4.6. Don't re-probe.
- Coach Kairos quality matrix (v1 § 6.1, 5 personas × 7 modes) — extend the existing drift script with multilingual probes; don't browser-test it.
- Onboarding funnel abandonment audit (v1 § 6.5) — needs analytics, not a browser.
- Top-10 missing features, international expansion, competitor positioning (v1 § 7.1-7.5) — strategic, runs in Projects.
- `/api/cc/glossary` 500 — already known and on the backlog.
- The `/auth/login` 404 + OG title fixes — landed in commits `d77fb5e` + `ff989d7`. Confirm once, don't re-file.

---

## Mission (now narrower)

Produce `docs/reports/2026-05-02-openclaw-audit-result.md` answering ONLY what requires a live production browser:

1. **Does production actually work end-to-end** for a fresh signup of each persona? (auth, onboarding write-back, dashboard variant pick, first coach turn)
2. **Do the high-stakes UX paths** (variant transitions, Urdu RTL, Spanish coach, Stripe checkout test card, mobile viewport) hold up?
3. **What's the live data depth** — actual school counts in `/schools` Browse, supplement prompts seeded, parent-portal token flow, share-link public render?

Every observation gets a verdict: Ship-grade / Beta / Demo-ware / Broken.

---

## Operating constraints (unchanged from v1, keep these)

- Tag every test user `full_name` with `AUDIT_` prefix for bulk delete.
- Email pattern: `audit-{persona}-{YYYYMMDD}@kairos-audit.test`.
- No real cards. For Stripe, use Stripe test card `4242 4242 4242 4242` only.
- One persona at a time.
- Stop on auth break — file Sev-1 and wait for triage.
- Save screenshots to `audit-screenshots/{persona}/{step}.png`.
- Save HARs to `audit-hars/{persona}.har` only when an error fires.
- **Cost cap: $12 total LLM. Track spend per persona.**

---

## Persona inventory (unchanged)

P1 Aanya (G9), P2 Diego (G10, Spanish), P3 Maya (G11 first-gen), P4 Hassan (G12 Pakistan/Urdu/intl), P5 Sarah (transfer). Profile fields per v1 § 3 — same.

Skip P6 Rohan unless budget permits at the end.

---

## Per-persona test plan — TRIMMED

### Common Spine (every persona, ~$0.80 each, ~$4 total)

1. Cold landing: load page, screenshot, check OG title, check demo iframe loads.
2. Sign up + onboarding: full multi-step flow, end on `/cc/dashboard`.
3. **Dashboard variant assertion** — note variant rendered, compare to expected. **Wrong variant = Sev-1, file and continue.**
4. Coach handshake: 1 message, "Hi Kairos." Verify first-token < 3s and that the response references the persona's grade or stage.
5. Profile sanity: open `/profile`, confirm onboarding selections persisted.

That's 5 quick steps. **Cap at 5 nav actions + 1 coach turn per persona.**

### Branch plan — slim version

Only the items below per persona. **Cap coach turns to 6 max per persona.**

#### P1 Aanya G9 (~$1)
- Walk g9 dashboard CTAs. Confirm Essays, Applications, Test Strategy, Interview Prep are NOT primary CTAs (locked tiles or hidden).
- 6-turn coach: "How should I plan grade 9?" Score: does it stay grade-appropriate (no Common App / SAT prep / interview prep)?
- Try `/cc/essays` direct nav — middleware should redirect to `/cc/dashboard?blocked=grade9` (Feature 16, just shipped).

#### P2 Diego G10 Spanish (~$1.50)
- Switch coach language to Spanish.
- 6-turn coach in Spanish: "¿Cómo me preparo para la PSAT?" Score: natural Spanish, US testing context (PSAT/NMSQT).
- Trigger Family Mode mid-conversation — does the prompt switch to parent register?

#### P3 Maya G11 first-gen (~$2)
- 8-turn coach: "I want to apply to college. I don't know where to start." Verify Kairos asks GPA / major / target list / aid / first-gen.
- Maya: "Stanford, MIT, UCLA, state school." → confirm Kairos auto-adds them and **rejects non-US** (CollegeVine cargo-cult check).
- Open `/schools`, confirm 4 schools added with ChanceBadge.
- One essay phase only (skip 4-phase deep-dive — drift test covers coach quality): start brainstorm, take 1 turn, exit.
- Generate counselor share-link. Open in incognito. Confirm public render.

#### P4 Hassan G12 Urdu / Pakistani / international (~$2.50) — HIGHEST VALUE
This persona catches the most regression. Spend the budget here.
- **Onboarding in Urdu** — confirm voice toggle disabled (text-only), `<html lang>` mirrors to `ur`, RTL applies to coach bubbles only (not whole dashboard — that's commit `3471a0e`'s fix).
- **Pakistani GPA conversion** — enter "82%", verify converts to ~3.5 US 4.0.
- **International filters on Schools** — apply need-blind + meets-full-need. Confirm seeded schools surface (count them — should be ≥30 per migration `1a9e6e4`).
- **Variant transition test** — add 3 schools, mark all submitted via Application Tracker, refresh. Variant should switch `senior_writing` → `senior_post_submit`. Then mark one accepted, refresh. → `senior_decisions`. **This is the marquee transition test.**
- 6-turn coach in Urdu: "Help me apply to Stanford as a Pakistani." Score: CSS Profile (not FAFSA), need-blind status correctness, Pakistan-specific tail.
- Family Mode in Urdu — trigger hand-to-parent.

#### P5 Sarah transfer (~$1)
- Verify `/cc/transfer-profile` page renders with form.
- Save profile, confirm dashboard `transfer` variant.
- 6-turn coach: "I want to transfer from UC Davis to UC Berkeley." Score: TAG / IGETC understanding (or default to Common App freshman flow = Sev-2).
- Search `/schools` — note whether transfer admit rates are surfaced separately.

---

## Cross-cutting audits — TRIMMED (~$2 total)

### CC-1. Live data depth (~$0.50)
- Open `/schools` Browse. Count total schools. Document.
- Pick 3 schools across reach/match/safety. For each, document fields populated (admit rate, SAT mid-50, GPA mid-50, intl aid, ED date, supplement count, NPC link).
- Open `/cc/essays/supplements` for any school in P3's list. Count seeded prompts.

### CC-2. Counselor share-link end-to-end (~$0.30)
P3 already generates a link. Open in fresh browser context. Verify:
- Public view loads without auth.
- Toggled-on sections render. Toggled-off sections hidden.
- No PII leakage (email, phone, address, SSN-equivalents).

### CC-3. Parent invite end-to-end (~$0.30)
Trigger parent invite from P4 (Urdu speaker). Confirm:
- Email actually sends via Resend (or fails gracefully if domain unverified — note which).
- Token URL `/parent/{token}` loads in fresh context, no auth required.
- Parent dashboard renders read-only.
- Family alignment ratings flow works from parent side.

### CC-4. Stripe checkout (~$0.50)
On any persona, click Pro upgrade. Use test card `4242 4242 4242 4242`, 12/30, CVV 123. Verify:
- Lands back on `/?upgraded=1&session_id=…`
- Supabase `user_subscriptions` row inserted (check via service-role from a test endpoint or just visual confirmation that Pro features unlock).
- Webhook fires (Stripe dashboard → recent events shows 200 OK).

### CC-5. Mobile sweep (~$0.40)
At 390px viewport:
- `/landing` — hero readable, no horizontal scroll.
- `/cc/dashboard` — variant renders, hero card readable.
- `/cc/essays/{id}` brainstorm — coach drawer works.
- `/applications` — board layout doesn't break.

---

## Bug filing rubric (unchanged from v1)

Sev-1 / Sev-2 / Sev-3 / Sev-4. Issue ID `AUD-{persona}-{seq}` or `AUD-X-{seq}` for cross-cutting.

---

## Deliverable schema

One file at `docs/reports/2026-05-02-openclaw-audit-result.md`:

```
# KairosLearn Production Audit — 2026-05-02 (OpenClaw v2)

## Executive Summary
- Cost spent: $X / $12.
- Persona pass/fail summary (5 rows).
- Top 5 Sev-1 findings.
- Indispensability score per persona (0-10).

## Persona Findings (5 sections, 1 per persona, ~150 words each)
For each: variant landed, verdict, walkthrough notes, findings table.

## Cross-cutting findings (CC-1 through CC-5)

## Bug backlog (sorted by severity)

## Appendix
- Screenshot index.
- HAR index.
- Coach transcripts (full text per persona).
```

---

## How to invoke

1. Clone the repo at latest `master`.
2. Read this file and v1 § 3 (persona inventory) only. **Do NOT read v1 § 4-7** — that scope was cut.
3. Sequential persona runs.
4. Track spend per persona in a running ledger.
5. Write result file + commit on branch `audit/openclaw-2026-05-02`.
6. Open PR.

Stop when ANY of:
- Cost reaches $12.
- All 5 personas + 5 cross-cutting audits complete.
- Sev-1 in auth surface (per v1 § 2 stop-on-auth-break rule).

---

**End of v2 brief.**
