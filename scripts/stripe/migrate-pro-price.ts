// Move existing Pro subscriptions from the old price(s) to the new one. The
// new price applies from each subscription's next renewal invoice (no
// proration). Dry-run by default.
//
//   npx tsx scripts/stripe/migrate-pro-price.ts --old=price_A[,price_B] --new=price_C
//   npx tsx scripts/stripe/migrate-pro-price.ts --old=… --new=… --apply --expect=<n> [--live]
//
// Uses STRIPE_SECRET_KEY. .env.local holds a LIVE key, so a live run needs
// --live, and --apply needs --expect equal to the planned update count.
// Founder action only, after the price-change notice period
// (docs/handoff/pro-price-change-notice.md).
import { config } from "dotenv";
import Stripe from "stripe";
import { assertCompatiblePrices, assertKeyMode, planPriceMigration, type PriceLite, type SubLite } from "./price-migration";

config({ path: ".env.local", quiet: true });

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3);
}

async function main() {
  const oldIds = (arg("old") ?? "").split(",").filter(Boolean);
  const newId = arg("new");
  if (!oldIds.length || !newId) throw new Error("Usage: --old=price_A[,price_B] --new=price_C [--apply --expect=N] [--live]");
  const apply = process.argv.includes("--apply");
  const mode = assertKeyMode(process.env.STRIPE_SECRET_KEY, process.argv.includes("--live"));
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const toLite = (p: Stripe.Price): PriceLite => {
    if (!p.recurring) throw new Error(`${p.id} is not a recurring price`);
    return {
      id: p.id,
      product: typeof p.product === "string" ? p.product : p.product.id,
      currency: p.currency,
      interval: p.recurring.interval,
      interval_count: p.recurring.interval_count,
    };
  };
  const newPrice = toLite(await stripe.prices.retrieve(newId));
  for (const id of oldIds) assertCompatiblePrices(toLite(await stripe.prices.retrieve(id)), newPrice);

  const seen = new Map<string, SubLite>();
  for (const price of oldIds) {
    for await (const s of stripe.subscriptions.list({ status: "all", price, limit: 100 })) {
      seen.set(s.id, {
        id: s.id,
        status: s.status,
        cancel_at_period_end: s.cancel_at_period_end,
        items: s.items.data.map((i) => ({ id: i.id, price: i.price.id })),
        schedule: typeof s.schedule === "string" ? s.schedule : (s.schedule?.id ?? null),
        cancel_at: s.cancel_at ?? null,
      });
    }
  }
  const plan = planPriceMigration([...seen.values()], oldIds, newId);
  console.log(`mode: ${mode}; ${plan.updates.length} to move, ${plan.skipped.length} skipped`);
  for (const s of plan.skipped) console.log(`skip ${s.subscriptionId}: ${s.reason}`);
  for (const u of plan.updates) console.log(`move ${u.subscriptionId}`);

  if (!apply) {
    console.log("Dry run. Re-run with --apply --expect=<count> to move them.");
    return;
  }
  if (Number(arg("expect")) !== plan.updates.length) {
    throw new Error(`--expect must equal ${plan.updates.length}; nothing was changed`);
  }
  let failed = 0;
  for (const u of plan.updates) {
    try {
      await stripe.subscriptions.update(u.subscriptionId, {
        items: [{ id: u.itemId, price: newId }],
        proration_behavior: "none",
      });
      console.log(`moved ${u.subscriptionId}`);
    } catch (err) {
      failed++;
      console.error(`FAILED ${u.subscriptionId}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
