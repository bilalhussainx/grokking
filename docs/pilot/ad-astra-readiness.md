# Ad Astra pilot readiness (as of 2026-09-26)

Owner: Claude (CTO). Status key: ✅ done in production · ☑️ done in code, awaiting deploy · 🔧 Claude is on it · 🟡 needs founder · ⛔ blocked.

| Area | Status | Evidence | Next step |
|---|---|---|---|
| Student-data ownership and counselor review security (fixes 1A/1B) | 🟡 | `docs/handoff/claude-progress.md` Security 1A/1B: tests, live probes, prod audit clean | Deploy the branch (founder go) |
| Credit functions locked from the public key | ✅ | Applied in production 2026-09-26 (`docs/handoff/claude-progress.md`, 2026-09-26 section). The anon key gets permission denied; service `add_credits` resolves again | — |
| Broken saves, dead pages, invites, counselor identity, workspace creation, mobile Essay Studio (fixes 2–3) | 🟡 | `claude-progress.md` Fix 2 and Fix 3 | Deploy |
| New pricing (Free 200 once, Pro $15/$99, fair use, 7-day trial) | 🟡 | Fix 4; Stripe prices created (`docs/handoff/stripe-setup-report.md`) | At deploy: set both `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_*` in Vercel and apply 3 migrations (200 credits / 7-day trial, trial-expiry view, credit reservations) |
| Every student type loads cleanly on desktop and phone | 🔧 | `docs/qa/2026-09-26-student-variant-audit.md`: 16/16 pass, 0 overflow on walked pages. The missing `/api/cc/me` and the COOP noise are fixed in fix-5b | Re-run of the hardened spec in progress |
| Activities optimizer works for full (10-activity) lists | ☑️ | `2a066f4`, test RED→GREEN | Deploy |
| Phone layout of marketing pages | ☑️ | `5f687d1`: `/pricing` and `/` measure 375px at 375px (`/product/*` and `/stories` share the footer but weren't measured) | Deploy |
| Cron auth (reminder emails, observations) | ☑️ | `e5bd50e`: fail-closed bearer check (hardening) | At deploy: confirm `CRON_SECRET` is set in Vercel |
| Supabase pausing (QA-11) | 🟡 | Two daily crons (`deadline-reminders` 09:07, `generate-observations` 04:07 UTC) hit the DB daily once deployed with `CRON_SECRET` | Founder: confirm the Supabase plan tier. Free-tier projects pause after about a week of inactivity; the crons prevent that only while they run |
| Counselor flow: invite → join → review → publish | ☑️ | `claude-progress.md` Security 1B and Fix 3 (QA-05); live-verified with the QA agency | Re-run after deploy with Ad Astra's head account |
| Minors' data and privacy | 🟡 | No raw-audio retention added; AI never writes prose; the privacy page exists | Founder: review `/privacy` and `/terms` (terms now say monthly or yearly) |
| Support email shown by Stripe | 🟡 | Currently a traderhussain.com address | Founder: switch to a KairosLearn address |
| Admin routes | ☑️ | Fail closed; no hardcoded secrets | At deploy: confirm `ADMIN_SECRET` and `TEACHER_SECRET_KEY` |
| Rollback plan | ☑️ | Vercel "promote previous deployment". The pending migrations replace `handle_new_user`, the signup-trial trigger and `v_user_tier`, and the applied lock-down dropped an `add_credits` overload. A Vercel rollback doesn't revert these. They're believed forward-compatible with the previous build, but that hasn't been verified | Claude: check compatibility with the previous build before deploy |
| New warm design (D3/D4) | 🔧 (Codex) | D3 sent back for a warm, welcoming reimagining | Not a pilot blocker: the pilot can start on the current UI |
| Pilot scope with Ad Astra | 🟡 | The research recommends a discovery interview on their current tools (`docs/research/2026-09-26-competitors-and-negative-reviews.md`) | Founder: 30-minute call with Ad Astra's head |

**The critical path to pilot start:**
1. ~~Fix-5b (`/api/cc/me`)~~ done in code.
2. Founder go to deploy, plus the Vercel env vars.
3. The 3 migrations.
4. Re-run the variant spec against production.
5. A seeded Ad Astra agency and invite codes.
