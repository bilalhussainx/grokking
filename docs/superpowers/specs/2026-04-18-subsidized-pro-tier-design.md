# Subsidized Pro Tier

## Summary

Qualifying students (Pell-eligible, first-gen, low-income) get free Pro access via a self-service claim flow. No Paddle checkout involved — the system upserts a `user_subscriptions` row directly. The existing `isPro()` gate picks it up automatically.

## Eligibility Criteria

A student qualifies if ANY of:
1. `cc_financial.pell_eligible_estimate` is true
2. `cc_student_profiles.is_first_gen` is true AND `cc_financial.family_income_bracket` is in `['0-30000', '30001-48000', '48001-75000']`

If the student hasn't filled out their financial profile, they're prompted to do so first.

## Claim Flow

1. Student visits `/pricing` → sees banner "First-gen or low-income? You may qualify for free Pro."
2. Clicks through to `/pricing/subsidized`
3. Page calls `GET /api/billing/subsidized` to check eligibility
4. If eligible, shows "Claim Free Pro" button
5. Button calls `POST /api/billing/subsidized`
6. Server verifies eligibility, upserts `user_subscriptions` with `plan: 'pro', status: 'active', paddle_subscription_id: 'subsidized-grant'`
7. Success → redirects to `/pricing` showing Pro status

## Files

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/cc/subsidized-eligibility.ts` | Create | `checkSubsidizedEligibility(userId)` → `{ eligible, reason, missingFields }` |
| `src/app/api/billing/subsidized/route.ts` | Create | GET (check) + POST (claim) |
| `src/app/pricing/subsidized/page.tsx` | Create | Claim UI |
| `src/app/pricing/subsidized/layout.tsx` | Create | Metadata |
| `src/app/pricing/page.tsx` | Modify | Add subsidized banner |

## Subscription Row Shape

```json
{
  "user_id": "uuid",
  "paddle_subscription_id": "subsidized-grant",
  "paddle_customer_id": null,
  "plan": "pro",
  "status": "active",
  "current_period_start": "now",
  "current_period_end": null,
  "cancel_at_period_end": false
}
```

The `paddle_subscription_id: 'subsidized-grant'` marker distinguishes subsidized users from paying users in analytics.

## Not In Scope

- Reverification/expiry (v1 grants are permanent once claimed)
- Admin dashboard for subsidized users
- Document upload for proof of eligibility
