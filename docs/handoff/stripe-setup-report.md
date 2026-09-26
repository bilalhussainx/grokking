# Stripe setup report: KairosLearn Pro ($15/mo · $99/yr)

_Prepared 2026-09-26 in the Stripe Dashboard (browser). Save as `docs/handoff/stripe-setup-report.md` on `feat/counselor-marketplace`. Not committed._

> **Secrets policy.** This file holds **IDs and publishable keys only**. No `sk_…`, `rk_…` or `whsec_…` value was revealed, copied or typed. The founder puts those into Vercel/`.env.local` himself (see §6).

---

## 1. Account

| | |
|---|---|
| Account name | Kairoslearn |
| Account ID | `acct_1RMw5ICvx3JX9BYY` |
| Test environment | Classic test mode on the same account (the dashboard labels it "Sandbox / Test mode") |
| Other products on the account (leave alone) | `OutreachOS Pro`, `OutreachOS Starter` |

## 2. Products and prices

### Live

Product **KairosLearn Pro**: `prod_URFK9EsOoQrsuA` (existing product; name and image unchanged)

| Price ID | Amount | Interval | Lookup key | Nickname | Status |
|---|---|---|---|---|---|
| `price_1UK0IQCvx3JX9BYYy6j6V7K6` | **15.00 USD** | month | `kl_pro_monthly_1500` | Pro monthly $15 | active, **new** |
| `price_1UK0LfCvx3JX9BYYFHlvEruR` | **99.00 USD** | year | `kl_pro_yearly_9900` | Pro yearly $99 | active, **new** |
| `price_1TSgD3Cvx3JX9BYYScp9QBiT` | 12.00 USD | month | none | none | active, legacy, **unchanged** |
| `price_1TSNAsCvx3JX9BYYXLOLrEG2` | 12.00 CAD | month | none | none | active, **still the product's default price**, unchanged |

All new prices are flat rate, have no Stripe trial, and keep the default tax behavior ("inferred by currency").

### Test

Product **KairosLearn Pro**: `prod_VKfOCdYMEuSHCY` (metadata `kl_product=pro`, no image)

| Price ID | Amount | Interval | Lookup key | Nickname |
|---|---|---|---|---|
| `price_1UK045Cvx3JX9BYYAhVqUC0b` | 15.00 USD | month | `kl_pro_monthly_1500` | Pro monthly $15 (default price) |
| `price_1UK045Cvx3JX9BYYy1B6sc1N` | 99.00 USD | year | `kl_pro_yearly_9900` | Pro yearly $99 |

## 3. Legacy $12 subscribers

| Price | active | trialing | past_due |
|---|---|---|---|
| `price_1TSgD3…` (12 USD) | 0 | 0 | 0 |
| `price_1TSNAs…` (12 CAD) | 0 | 0 | 0 |

**The live account has no subscriptions in any status.** The $12→$15 migration has nobody to move right now. The command is kept here in case $12 subscribers appear before launch. Only the **USD** $12 price is valid as `--old`, because the script rejects a currency mismatch.

```bash
# founder-run, only after the 30-day notice in docs/handoff/pro-price-change-notice.md
npx tsx scripts/stripe/migrate-pro-price.ts --old=price_1TSgD3Cvx3JX9BYYScp9QBiT --new=price_1UK0IQCvx3JX9BYYy6j6V7K6 --live
```

## 4. Customer portal

| | Live | Test |
|---|---|---|
| Configuration ID (Default) | `bpc_1UK0QHCvx3JX9BYYAPCRNo1Y` | `bpc_1UK06TCvx3JX9BYYIvoFD6Lw` |
| Update payment methods | on | on |
| Invoice history | on | on |
| Customer info (name, email, billing addr, phone) | on | on |
| Cancel | on, **at end of billing period**, reason collected | same |
| Switch plans | on, **only** $15/mo ↔ $99/yr (the $12 prices are not offered) | on, $15/mo ↔ $99/yr |
| Quantity changes / promo codes | off | off |
| Proration (Stripe default) | Prorate charges and credits, invoiced immediately | same |
| Downgrade / shorter interval | Update immediately (default) | same |
| End trials on subscription updates | on (default; the app handles trials, so this doesn't matter) | same |
| No-code portal link | not activated | not activated |
| Terms / Privacy links | set account-wide via Public details (see §8) | same |

Preview screenshots of the plan-switch screen: `live-portal-switch-monthly.png`, `live-portal-switch-yearly.png`, `test-portal-switch-*.png`.

## 5. Webhooks

**Live:** `we_1TSONZCvx3JX9BYYR2rdoWap` → `https://kairoslearn.com/api/billing/stripe/webhook`. It's active, on API version `2025-04-30.basil`, with the description "KairosLearn subscription state sync".

| Required event | Subscribed |
|---|---|
| checkout.session.completed | yes |
| customer.subscription.created | yes |
| customer.subscription.updated | yes |
| customer.subscription.deleted | yes |
| invoice.payment_succeeded | yes |
| invoice.payment_failed | yes |

There are no gaps and nothing was changed.

**Test:** there's no endpoint. For local work, use the Stripe CLI (it prints a temporary `whsec_…` for local use only):

```bash
stripe login
stripe listen --forward-to localhost:3000/api/billing/stripe/webhook
stripe trigger checkout.session.completed   # optional smoke test
```

## 6. Keys and env vars

**Publishable keys (safe for the client bundle):**

```
# live
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RMw5ICvx3JX9BYY39Cm95gQMrhNLrOCvwWNIlH3THH0Oqb9vk2XQPdlmu7OaUtyvSw17Z2Fac4dbMF4FKs2TDx900h
# test
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RMw5ICvx3JX9BYYFAsYfJduKxuoYqW7CSB6hbaPB4tdMGU3t62QKEOTuFOpnJhb4EAuPFxkDgRWregmk1sOQBW600C
```
_(Read from the API keys page. Check them against Dashboard → Developers → API keys before deploying.)_

**Price IDs (set at deploy time):**

```
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=price_1UK0IQCvx3JX9BYYy6j6V7K6
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY=price_1UK0LfCvx3JX9BYYFHlvEruR
# test mode, for local verification:
# NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=price_1UK045Cvx3JX9BYYAhVqUC0b
# NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY=price_1UK045Cvx3JX9BYYy1B6sc1N
```

Optional, if the code wants them: `STRIPE_PORTAL_CONFIGURATION_ID=bpc_1UK0QHCvx3JX9BYYAPCRNo1Y` (test: `bpc_1UK06TCvx3JX9BYYIvoFD6Lw`). You can also resolve prices at runtime with `stripe.prices.list({ lookup_keys: ['kl_pro_monthly_1500','kl_pro_yearly_9900'] })`, which means no env change if prices are ever replaced (use "transfer lookup key" on the new price).

**Secrets (the founder sets these; Claude never sees them):**

| Env var | Where the founder gets it |
|---|---|
| `STRIPE_SECRET_KEY` | Dashboard → Developers → API keys. Prefer a **restricted key** `rk_live_…` with: Checkout Sessions (write), Customers (write), Customer portal (write), Subscriptions (read), Prices and Products (read), Invoices (read). Use `sk_test_…` locally. |
| `STRIPE_WEBHOOK_SECRET` | Workbench → Webhooks → `we_1TSONZ…` → Signing secret (live). Locally, the `whsec_` printed by `stripe listen`. |

Set them in Vercel (Production for live, Preview/Development for test) and in `.env.local`. Never commit them. Check the exact names against `src/app/api/billing/stripe/*/route.ts`. I couldn't read the repo from this session.

## 7. A Shopify-style checkout flow with Stripe

Shopify's checkout is a hosted, single-page, trusted checkout with wallets. The Stripe equivalent is **Stripe Checkout** (`mode: 'subscription'`). There are two ways to show it:

- **Hosted** (`ui_mode` default): redirect to `checkout.stripe.com`. This is closest to Shopify and needs the least code.
- **Embedded** (`ui_mode: 'embedded'`): the same checkout, mounted inside `/checkout` on kairoslearn.com via `@stripe/react-stripe-js` `<EmbeddedCheckout>`. It keeps users on your domain.

Apple Pay, Google Pay and Link appear automatically when **Settings → Payment methods** has them on (dynamic payment methods). Don't pass `payment_method_types`. Apple Pay on the embedded version needs the domain verified under Settings → Payment method domains.

**Flow**

1. `/pricing`: the user picks Monthly ($15) or Yearly ($99).
2. `POST /api/billing/stripe/checkout` with `{ interval }`. The server:
   ```ts
   const session = await stripe.checkout.sessions.create({
     mode: 'subscription',
     line_items: [{ price: interval === 'year' ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY! : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY!, quantity: 1 }],
     customer: existingStripeCustomerId,          // or customer_email for first purchase
     client_reference_id: supabaseUserId,          // ties the session to the app user
     subscription_data: { metadata: { user_id: supabaseUserId } }, // NO trial_period_days: the app grants the trial
     success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${origin}/pricing`,
     billing_address_collection: 'auto',
     allow_promotion_codes: false,                 // no coupons set up
     // ui_mode: 'embedded', return_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`  // for the embedded version
   });
   return Response.json({ url: session.url /* or client_secret for embedded */ });
   ```
3. Stripe collects the card or wallet and creates the Customer and Subscription.
4. **The webhook is the source of truth.** On `checkout.session.completed` and `customer.subscription.created`/`updated`, upsert `{ user_id, stripe_customer_id, subscription_id, price_id, status, current_period_end, cancel_at_period_end }` in Supabase. On `deleted`, downgrade to Free. On `invoice.payment_failed`, flag it as past_due. On `invoice.payment_succeeded`, extend access. Verify the signature with `STRIPE_WEBHOOK_SECRET` against the **raw body**.
5. `/billing/success` shows a confirmation screen and polls the app's own DB, not Stripe, until the webhook has landed.
6. For "Manage billing", `POST /api/billing/stripe/portal` → `stripe.billingPortal.sessions.create({ customer, return_url, configuration: 'bpc_…' })` → redirect. Plan switching, cancel at period end, cards and invoices are handled there (see §4).

**Test before going live** (in test mode): card `4242 4242 4242 4242`, any future date, any CVC. A declined card is `4000 0000 0000 0002`, and 3-D Secure is `4000 0025 0000 3155`. Then check that the Supabase row and portal switching behave as expected.

## 8. Open items for the founder

1. **Public details: done.** The founder saved them on 2026-09-26. Privacy is `https://kairoslearn.com/privacy`, terms is `https://kairoslearn.com/terms`, and the support email is `support@traderhussain.com`. These show in Checkout, the portal and receipts. Make sure both pages are live before launch. Consider a KairosLearn-branded support address, since customers will see a traderhussain.com one.
2. **The product default price is still $12 CAD.** That's harmless for this code (it passes explicit price IDs), but Payment Links and Pricing Tables would default to it. If you want it changed, set the default to `price_1UK0IQ…` ($15 USD).
3. **Images (decision: reuse the existing KAIROS logo):** the live product already has it. The test product and the account branding icon/logo (Settings → Branding, shared by live and test) still need it. The copy stored in Stripe is only ~130×118 px and can't be copied between objects in the dashboard, and Stripe's icon needs a square image of at least 128 px. So upload the original logo file. For the icon, use a square version.
4. If you want the embedded version with Apple Pay, verify `kairoslearn.com` under Payment method domains.
5. The $12→$15 migration has nothing to move (0 subscribers). You can skip the price-change notice unless subscribers appear.
