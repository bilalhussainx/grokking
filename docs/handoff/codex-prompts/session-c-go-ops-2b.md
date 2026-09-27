**GO: OPS-2b.** The production deploy succeeded (2026-09-27): commit `ae82a5a` on `master`, and both Vercel builds report success.

Verified on kairoslearn.com:
- `/pricing` shows $15/month and $99/year, and no $12;
- signed-in checkout opens hosted Checkout at US$15.00/month and US$99.00/year, with the navy/gold emblem branding;
- the security probes reject as expected;
- `/settings` and `/cc/net-price` load.

Now run the three Supabase migrations, exactly as in `docs/handoff/codex-prompts/session-c-ops-2-deploy-prep.md` § OPS-2b:
1. `supabase/migrations/20260925_pricing_200_credits_7day_trial.sql`
2. `supabase/migrations/20260925_user_tier_trial_expiry.sql`
3. `supabase/migrations/20260925_credit_reservations.sql`

For each: SQL Editor, paste the **whole file** as one query, Run, and record "Success" or the exact error. **Stop at the first error.** Don't re-run the credit lock-down; it's already applied. Stop at **GATE OPS-2b** with screenshots of the result panes.

**One small Stripe fix at the same time (live).** The KairosLearn Pro product **description** says "Unlimited schools, essays, voice sessions, 18 languages, full FAFSA + aid comparator." Change it to:

> Your college guidance, one good next step at a time. Unlimited under fair use.

Don't change anything else on the product.
