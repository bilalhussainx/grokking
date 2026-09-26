// Create (or find) the KairosLearn Pro product and its $15/month and $99/year
// prices in Stripe TEST mode. Refuses live keys. Safe to re-run: prices are
// found by lookup_key, so nothing is duplicated.
//
//   npx tsx scripts/stripe/create-test-prices.ts
//
// Uses STRIPE_TEST_SECRET_KEY from .env.local. Prints only price IDs and the
// key mode, never the key.
import { config } from "dotenv";
import Stripe from "stripe";
import { PRICING } from "../../src/lib/pricing";
import { assertKeyMode } from "./price-migration";

config({ path: ".env.local", quiet: true });

const PRICES = [
  { lookup_key: `kl_pro_monthly_${PRICING.pro.monthlyUsd * 100}`, unit_amount: PRICING.pro.monthlyUsd * 100, interval: "month" as const },
  { lookup_key: `kl_pro_yearly_${PRICING.pro.yearlyUsd * 100}`, unit_amount: PRICING.pro.yearlyUsd * 100, interval: "year" as const },
];

async function main() {
  const key = process.env.STRIPE_TEST_SECRET_KEY;
  const mode = assertKeyMode(key, false);
  const stripe = new Stripe(key!);

  const existing = await stripe.products.search({ query: "metadata['kl_product']:'pro'" });
  const product =
    existing.data[0] ??
    (await stripe.products.create({ name: "KairosLearn Pro", metadata: { kl_product: "pro" } }));

  for (const p of PRICES) {
    const found = await stripe.prices.list({ lookup_keys: [p.lookup_key], limit: 1 });
    const price =
      found.data[0] ??
      (await stripe.prices.create({
        product: product.id,
        currency: "usd",
        unit_amount: p.unit_amount,
        recurring: { interval: p.interval },
        lookup_key: p.lookup_key,
      }));
    console.log(`${p.interval === "month" ? "NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY" : "NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY"}=${price.id}`);
  }
  console.log(`mode: ${mode}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
