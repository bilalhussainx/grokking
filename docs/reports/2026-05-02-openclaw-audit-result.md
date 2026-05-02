# KairosLearn Production Audit — 2026-05-02 (OpenClaw v2)

> **Status:** COMPLETE  
> **Repo:** `/mnt/c/Users/bilal/Downloads/grokking` @ master (`263c25e`)  
> **Target:** https://www.kairoslearn.com  
> **Budget ceiling:** $12 LLM  
> **Date key commits confirmed:** d77fb5e ✅ ff989d7 ✅ 3471a0e ✅ 1a9e6e4 ✅ (from git log)

---

## Cost Ledger

| Phase | Estimated | Verdict |
|-------|-----------|---------|
| P1 Aanya G9 | ~$1.00 | Beta |
| P2 Diego G10 Spanish | ~$1.50 | Ship-grade |
| P3 Maya G11 first-gen | ~$2.00 | Beta |
| P4 Hassan G12 Urdu/intl | ~$2.50 | Ship-grade |
| P5 Sarah transfer | ~$1.00 | Ship-grade |
| Cross-cutting CC-1→5 | ~$2.00 | Mixed |
| **Total (est.)** | **~$8–10** | **Under budget** |

---

## Executive Summary

**Cost spent:** ~$8–10 / $12 (estimated, under budget).

### Persona pass/fail summary

| Persona | Variant Landed | Verdict | Top Finding |
|---------|---------------|---------|-------------|
| P1 Aanya G9 | `g9` ✅ | **Beta** | /cc/essays not gated for G9 (AUD-P1-001 Sev-2) |
| P2 Diego G10 | `g10` ✅ | **Ship-grade** | Spanish + PSAT content excellent; Family Mode ✅ |
| P3 Maya G11 | `junior` ✅ | **Beta** | Pro trial not activating (AUD-P3-002 Sev-2) |
| P4 Hassan G12 | `senior_writing` → `senior_post_submit` → `senior_decisions` ✅✅✅ | **Ship-grade** | Variant chain passes; Family Mode disabled in Urdu (AUD-P4-001 Sev-2) |
| P5 Sarah transfer | `transfer` ✅ | **Ship-grade** | TAG/IGETC knowledge excellent |

### Top Sev-1 Findings

1. **AUD-X-005 (Sev-1)**: Stripe checkout completely broken — `"No such price: 'price_1TSMqEEO913z4zPDsWpwqsOt'"`. Pro upgrades = $0 revenue until fixed. Invalid price ID in production config.

### Indispensability score per persona (0–10)

| Persona | Score | Rationale |
|---------|-------|-----------|
| P1 Aanya G9 | 6/10 | Works but coach context regression undermines personalization |
| P2 Diego G10 | 8/10 | Spanish + PSAT + Family Mode all ship-grade |
| P3 Maya G11 | 7/10 | Intake probing excellent; Pro gate broken |
| P4 Hassan G12 | 9/10 | Highest value: RTL ✅, Urdu ✅, GPA conversion ✅, CSS Profile ✅, variant chain ✅ |
| P5 Sarah transfer | 8/10 | TAG/IGETC correct; transfer dashboard excellent |

---

## Persona Findings

### P1 — Aanya G9 — Verdict: **Beta**

**Variant landed:** `g9` ✅  
**Signup → Dashboard:** Full flow works. Onboarding skips concerns step for G9 (correct).  
**Dashboard CTAs:** "Add a course", "Talk to Coach Kairos" — grade-appropriate. Application tracker + Essay Studio show "Unlocks junior year" (not links) ✅  
**Coach grade-gating (6 turns):**
- Turn 4: "SAT prep unlocks junior year" ✅
- Turn 5: "Essays are a junior-year thing" ✅
- Turn 6: "School list unlocks junior year" ✅
- All 5 grade checks PASS ✅

**Profile persistence:** Grade 9 + English persisted in /profile ✅

| ID | Sev | Description |
|----|-----|-------------|
| AUD-P1-001 | 2 | `/cc/essays` accessible for G9 — Feature 16 middleware redirect not implemented. No redirect to `/cc/dashboard?blocked=grade9`. |
| AUD-P1-002 | 2 | Coach drops profile context. Responds to "Hi Kairos." with "What's your name and grade?" despite G9 onboarding completing. Cross-persona confirmed. |
| AUD-P1-003 | 3 | Coach widget shows "Essay Studio →" link for G9 despite tiles showing "Unlocks junior year." |
| AUD-P1-004 | 2 | G9 dashboard walkthrough shows senior-level steps (Draft PS, Essay Studio, Activities Optimizer) contradicting dashboard grade-gating. |

---

### P2 — Diego G10 Spanish — Verdict: **Ship-grade**

**Variant landed:** `g10` ✅ ("GRADE 10 · ADDING DEPTH")  
**Dashboard CTAs:** PSAT hero ✅, Test strategy + Course rigor + Summer priority modules ✅. No essay/app tracker visible (correct for G10).  
**Spanish coach (4 turns):**
- "¿Cómo me preparo para la PSAT?" → Coach responds in Spanish ✅
- PSAT/NMSQT Selection Index knowledge correct ✅ ("El cutoff... 209-222 en el Selection Index")
- Responded in Spanish, acknowledged NMSQT context ✅

**Family Mode:** "Devolver al estudiante" + "Toca para hablar" in Spanish ✅ Ship-grade.

| ID | Sev | Description |
|----|-----|-------------|
| AUD-P1-002 | 2 | (shared) Coach asks name/grade again — confirmed for Diego too |

---

### P3 — Maya G11 first-gen — Verdict: **Beta**

**Variant landed:** `junior` ✅ ("Junior · runway to senior year", "91 days until Common App opens")  
**Essay tile:** "Brainstorm only — Draft + revise unlock at grade 12" ✅  
**Coach 8-turn intake (scored):**
- First-gen acknowledged → financial fit flagged ✅
- GPA ask ✅
- Major/pre-med acknowledged ✅
- Aid ($45k → 100% demonstrated need) ✅
- Oxford rejected ("not in our directory yet") + US alternatives offered ✅
- Stanford honest about 1340 SAT vs ~1550 median ✅

**CC-2 Share link:** Fails for free tier — "Counselor share link is a Pro feature" — but signup advertises "1 month Pro access."

| ID | Sev | Description |
|----|-----|-------------|
| AUD-P3-001 | 3 | Schools not auto-added to /schools list from coach conversation. Must manually add. Brief expected "Kairos auto-adds them." |
| AUD-P3-002 | 2 | Pro trial not activating. New signup offers "1 month Pro" but API returns `tier: "free"`. Share link gated as Pro. |
| AUD-P3-003 | 3 | Share link UI shows no error when free user clicks "Generate Share Link." Silent failure. |

---

### P4 — Hassan G12 Urdu/Pakistani/international — Verdict: **Ship-grade**

**Variant landed:** `senior_writing` ✅ ("SENIOR · WRITING PHASE")  
**Urdu onboarding:** Selected Urdu → Text-only badge confirmed ✅ ("Text only اردو")  
**RTL audit:**
- `<html lang="ur">` ✅ 
- `html.dir = ""` (not flipped) ✅ — commit `3471a0e` working
- Chat bubbles: `dir="auto"` ✅ — browser auto-detects RTL for Urdu script
- Dashboard stays LTR ✅

**Pakistani GPA conversion:** 85% → "تقریباً 3.40 GPA" in Urdu ✅  
**Urdu coach (3 key turns):**
- CSS Profile vs FAFSA: "FAFSA صرف US citizens کے لیے ہے" + "CSS Profile بھرتے ہیں" ✅
- Need-blind: "Stanford need-blind نہیں ہے international students کے لیے" ✅
- Pakistan-specific tail: recommended MIT/Amherst as need-blind alternatives ✅

**Marquee variant transition:**
- All 3 submitted → `senior_post_submit` ("SENIOR · SUBMITTED, WAITING") ✅
- 1 accepted → `senior_decisions` ("SENIOR · DECISIONS IN") ✅
- **Both transitions pass — Ship-grade** 🎉

| ID | Sev | Description |
|----|-----|-------------|
| AUD-P4-001 | 2 | "Hand to parent" button disabled for Urdu. Family Mode unavailable in Urdu. "Voice for Urdu coming soon" button correctly disabled but parent handoff broken too. |
| AUD-P4-002 | 4 | GPA conversion: 85% → 3.40 may be conservative (~3.5 expected). Minor calibration note. |
| AUD-P4-003 | 2 | International filters (need-blind, meets-full-need) NOT exposed in /schools Browse. Migration `1a9e6e4` added columns but UI never surfaces them. |

---

### P5 — Sarah transfer — Verdict: **Ship-grade**

**Variant landed:** `transfer` ✅ ("TRANSFER APPLICANT")  
**Profile persistence:** "Currently at UC Davis · target Fall 2026." shown in dashboard hero ✅  
**`/cc/transfer-profile`:** Renders with 5-field form (school, credits, term, GPA, why-transfer) + GPA story framing tip ✅  
**Transfer dashboard modules:** Why-transfer essay, Transfer school rates ("differ from first-year"), Professor recs ("college profs, not high-school") ✅ Ship-grade  
**Coach TAG/IGETC test:**
- "UC Berkeley does NOT participate in TAG" ✅ (factually correct)
- "IGETC not recommended for CS/EECS at Berkeley" ✅ (prerequisites override IGETC)
- Asked about CS prereqs (data structures, discrete math) — transfer-aware ✅
- NOT defaulting to Common App freshman flow ✅

| ID | Sev | Description |
|----|-----|-------------|
| AUD-P5-001 | 3 | Transfer-specific admit rates not surfaced in /schools Browse. Shows general admit rate only. No "transfer" filter tab or column. |

---

## Cross-cutting Findings

### CC-1. Live data depth — Verdict: **Beta**

- **Total schools:** Browse shows 50+ on first page (A–C range alphabetically). Landing claims "1,500+ colleges." State filter covers 23 states.
- **Adelphi University** (sample): accept 66% ✅, SAT mid-50 1120–1340 ✅, net price $30,783 ✅, 6-yr grad rate 68% ✅, Pell/first-gen 31%/35% ✅, avg HS GPA: — (missing), intl aid detail: "CSS Profile required" link only (no detailed breakdown), supplements: 0 loaded.
- **Stanford University**: accept 4% ✅, SAT mid-50 1510–1580 ✅, net price $13,807 ✅, Pell/first-gen 19%/30% ✅, **Supplements: 3 real 2025–26 prompts** (Intellectual Vitality, Roommate Letter, Contribution) ✅
- **Claremont McKenna**: Shows "0% accept $0 net" — bad data (real: ~9% / ~$35k+). **AUD-X-006 (Sev-3)**
- Supplement coverage uneven: 0 for Adelphi, 3 for Stanford. Beta-grade overall.

### CC-2. Counselor share-link — Verdict: **Broken**

Share link generation returns `{"error":"Counselor share link is a Pro feature.","tier":"free"}` for all new signups. Root cause = Pro trial not activating (AUD-P3-002). Cannot test public render or PII check without a working Pro account.

### CC-3. Parent invite end-to-end — Verdict: **Partial**

Family Mode tested for P2 Diego (Spanish) — worked perfectly: parent panel shown, "Devolver al estudiante" in Spanish ✅, "Toca para hablar" ✅. For P4 Hassan (Urdu) — "Hand to parent" button disabled (AUD-P4-001). Email invite flow via Resend not testable from browser (requires receiving email). `/parent/{token}` route not tested (no working token generated).

### CC-4. Stripe checkout — Verdict: **Broken (Sev-1)**

Clicking "Start Pro" on `/pricing` returns inline error: **`"No such price: 'price_1TSMqEEO913z4zPDsWpwqsOt'"`**. Checkout session creation fails. Price ID `price_1TSMqEEO913z4zPDsWpwqsOt` does not exist in current Stripe account/mode. No redirect to Stripe checkout, no test card flow possible.

**Impact:** 100% of Pro upgrades fail. Zero revenue. Possible cause: price was deleted from Stripe dashboard, or test-mode price ID hardcoded in production.

### CC-5. Mobile sweep (390px) — Verdict: **Ship-grade**

| Page | Verdict | Notes |
|------|---------|-------|
| `/landing` | ✅ Ship-grade | Hero readable, no horizontal scroll, nav clear |
| `/cc/dashboard` | ✅ Ship-grade | Transfer variant renders, hero card readable, CTAs visible |
| `/cc/essays` | ✅ Ship-grade | Essay Studio renders, "New Essay" CTA visible |
| `/applications` | ✅ Ship-grade | Empty state renders cleanly, no overflow |

---

## Bug Backlog (sorted by severity)

| ID | Sev | Component | Description | Fix estimate |
|----|-----|-----------|-------------|--------------|
| AUD-X-005 | 1 | Billing | Stripe price ID invalid — Pro upgrades impossible | 15 min (update env var STRIPE_PRICE_ID to valid price ID) |
| AUD-P1-001 | 2 | Middleware | /cc/essays accessible for G9, no redirect to `/cc/dashboard?blocked=grade9` | 1–2h |
| AUD-P1-002 | 2 | Coach | Profile context (name, grade) not plumbed into conversation system prompt | 2–4h (pass profile row into chat API) |
| AUD-P1-004 | 2 | Walkthrough | G9 dashboard walkthrough shows senior steps (Draft PS, Essay Studio, Activities) | 1h |
| AUD-P3-002 | 2 | Auth/Billing | Pro trial not activating for new signups (API returns `tier: "free"`) | 2h (check signup trigger → Supabase user_subscriptions insert) |
| AUD-P4-001 | 2 | Family Mode | "Hand to parent" disabled for Urdu. Family Mode unavailable for Urdu users. | 2h |
| AUD-P4-003 | 2 | Schools | International filters (need-blind, meets-full-need) not in Browse UI despite DB columns | 3h (add filter dropdowns, query WHERE clauses) |
| AUD-X-001 | 2 | Marketing | Landing page shows $10/mo in hero + pricing section (should be $12) | 30 min |
| AUD-X-002 | 3 | Branding | Signup page heading says "Join Kairos.ai", nav says "Kairos.ai" — inconsistent with "KairosLearn" | 30 min |
| AUD-X-003 | 2 | Pricing | Price inconsistent: /landing=$10, /pricing=$12, walkthrough badge=$15 | 30 min (audit all pricing strings) |
| AUD-P1-003 | 3 | Coach | Coach widget shows "Essay Studio →" link for G9 despite it being locked on dashboard | 1h |
| AUD-P3-001 | 3 | Coach/Schools | Schools not auto-added from coach conversation to /schools list | 4h+ |
| AUD-P3-003 | 3 | Share | Share link button shows no error for free users (silent Pro gate failure) | 1h (show upgrade CTA on click) |
| AUD-P5-001 | 3 | Schools | No transfer-specific admit rates in /schools Browse | 4h+ |
| AUD-X-006 | 3 | Data | Claremont McKenna shows "0% accept $0 net" (incorrect data) | 1h (data migration fix) |
| AUD-P4-002 | 4 | Coach | GPA conversion 85% → 3.40 slightly conservative (~3.5 expected) | Calibration review |
| AUD-X-004 | 4 | UI | Credits counter shows "0" on first render for new signup (then corrects to 300) | 1h (loading state handling) |

---

## Appendix

### Screenshot Index

| File | Description |
|------|-------------|
| `audit-screenshots/cross-cutting/landing-cold-desktop.png` | Cold landing at desktop viewport |
| `audit-screenshots/cross-cutting/pricing-page.png` | Pricing page showing $12/mo |
| `audit-screenshots/cross-cutting/cc5-mobile-landing.png` | /landing at 390px |
| `audit-screenshots/cross-cutting/cc5-mobile-dashboard.png` | /cc/dashboard at 390px (Sarah transfer) |
| `audit-screenshots/cross-cutting/cc5-mobile-essays.png` | /cc/essays at 390px |
| `audit-screenshots/cross-cutting/cc5-mobile-applications.png` | /applications at 390px |
| `audit-screenshots/p1-aanya/01-onboarding-lang.png` | Aanya onboarding Step 01 language selection |
| `audit-screenshots/p1-aanya/02-dashboard.png` | Aanya G9 dashboard — variant g9 |
| `audit-screenshots/p1-aanya/03-profile.png` | Aanya /profile — Grade 9 persisted |
| `audit-screenshots/p2-diego/01-dashboard.png` | Diego G10 dashboard — variant g10 |
| `audit-screenshots/p2-diego/02-family-mode.png` | Diego Family Mode in Spanish |
| `audit-screenshots/p3-maya/01-dashboard.png` | Maya G11 dashboard — variant junior |
| `audit-screenshots/p3-maya/02-schools.png` | Maya /schools — empty (schools not auto-added) |
| `audit-screenshots/p3-maya/03-share-settings.png` | Maya share settings — Pro gate |
| `audit-screenshots/p4-hassan/01-dashboard.png` | Hassan G12 dashboard — variant senior_writing |
| `audit-screenshots/p4-hassan/02-coach-urdu.png` | Hassan coach — Urdu language, Pakistan flag |
| `audit-screenshots/p4-hassan/03-coach-urdu-rtl.png` | Hassan Urdu coach bubbles — RTL dir=auto |
| `audit-screenshots/p4-hassan/04-applications.png` | Hassan Applications tracker |
| `audit-screenshots/p4-hassan/05-variant-transition.png` | Hassan senior_post_submit — SUBMITTED WAITING |
| `audit-screenshots/p4-hassan/06-variant-decisions.png` | Hassan senior_decisions — DECISIONS IN 🎉 |
| `audit-screenshots/p5-sarah/01-dashboard.png` | Sarah transfer dashboard |

### HAR Index

No HARs captured — all errors were recoverable from UI/API responses.

### Coach Transcripts

#### P1 Aanya — Key exchanges
- T1: "Hi Kairos." → Asked name/grade (**regression**)
- T2: "How should I plan grade 9?" → Asked for GPA (appropriate)
- T3: "3.8 GPA, focus?" → "Depth over breadth for activities" ✅
- T4: "Should I start SAT prep now?" → "SAT prep unlocks junior year" ✅
- T5: "Should I worry about college essays?" → "Essays are a junior-year thing" ✅
- T6: "What schools should I target?" → "School list unlocks junior year" ✅

#### P2 Diego — Key exchanges (Spanish)
- T1: "¿Cómo me preparo para la PSAT?" → Asked name/grade (**regression**)
- T2: "Soy Diego, grado 10, PSAT/NMSQT." → "la PSAT de octubre es el diagnóstico" ✅
- T3: GPA 3.6, National Merit? → "Selection Index (209-222 para Semifinalist)" ✅
- Family Mode: "Devolver al estudiante" ✅

#### P3 Maya — Key exchanges
- T1: "I want to apply to college" → Asked name/grade (**regression**)
- T2: "Maya, G11, first-gen" → "colleges genuinely value first-gen... financial fit" ✅
- T3: "3.7, bio/pre-med" → asked testing plan ✅
- T4: "$45k income, aid?" → "meet 100% of demonstrated need, near zero" ✅
- T5: "Stanford, MIT, UCLA, Oxford" → "Oxford not in directory... UK-caliber US alternatives" ✅ Need-blind stat correct ✅

#### P4 Hassan — Key exchanges (Urdu)
- T1: "مجھے Stanford میں داخلہ..." → Asked name/grade (**regression**)
- T2: "حسن، 85%" → "85% تقریباً 3.40 GPA" ✅ Urdu response ✅
- T3: "FAFSA bharna hoga?" → "FAFSA US citizens ke liye... CSS Profile bharain" ✅ need-blind ✅

#### P5 Sarah — Key exchanges
- T1: "Transfer from Davis to Berkeley?" → Asked name/units (**regression**)
- T2: "Sarah, 45 units, TAG/IGETC?" → "UC Berkeley does NOT participate in TAG" ✅ "IGETC not recommended for CS" ✅

---

*Audit completed: 2026-05-02, ~3h browser run time*  
*Auditor: SuperCore (OpenClaw v2)*  
*Commit audited: 263c25e (master)*
