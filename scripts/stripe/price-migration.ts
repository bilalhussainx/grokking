export type SubLite = {
  id: string;
  status: string;
  cancel_at_period_end: boolean;
  items: { id: string; price: string }[];
  schedule?: string | null;
  cancel_at?: number | null;
};

export type PriceLite = { id: string; product: string; currency: string; interval: "day" | "week" | "month" | "year"; interval_count: number };

// Swapping an item to a price with a different interval makes Stripe reset
// billing_cycle_anchor and invoice immediately, which is not "new price from the next
// renewal". Refuse anything but a same-product, same-currency, same-interval swap.
export function assertCompatiblePrices(oldPrice: PriceLite, newPrice: PriceLite): void {
  for (const k of ["product", "currency", "interval", "interval_count"] as const) {
    if (oldPrice[k] !== newPrice[k]) {
      throw new Error(`Incompatible prices: ${oldPrice.id} and ${newPrice.id} differ in ${k} (${oldPrice[k]} vs ${newPrice[k]})`);
    }
  }
}

// Scripts must not touch live Stripe by accident: .env.local holds a LIVE key.
export function assertKeyMode(key: string | undefined, allowLive: boolean): "test" | "live" {
  if (!key) throw new Error("Stripe key missing");
  if (key.startsWith("sk_test_")) return "test";
  if (key.startsWith("sk_live_")) {
    if (!allowLive) throw new Error("Refusing a live Stripe key without --live");
    return "live";
  }
  throw new Error("Unrecognized Stripe secret key type");
}

const MOVABLE = new Set(["active", "trialing", "past_due"]);

export function planPriceMigration(subs: SubLite[], oldPriceIds: string[], newPriceId: string) {
  const updates: { subscriptionId: string; itemId: string }[] = [];
  const skipped: { subscriptionId: string; reason: string }[] = [];
  for (const s of subs) {
    if (!MOVABLE.has(s.status)) { skipped.push({ subscriptionId: s.id, reason: `status ${s.status}` }); continue; }
    if (s.cancel_at_period_end) { skipped.push({ subscriptionId: s.id, reason: "ending at period end" }); continue; }
    // Schedule phases override item edits; a scheduled cancel_at is an ending subscription.
    if (s.schedule) { skipped.push({ subscriptionId: s.id, reason: "has a subscription schedule" }); continue; }
    if (s.cancel_at) { skipped.push({ subscriptionId: s.id, reason: "cancellation scheduled" }); continue; }
    const item = s.items.find((i) => oldPriceIds.includes(i.price) && i.price !== newPriceId);
    if (!item) { skipped.push({ subscriptionId: s.id, reason: "not on an old price" }); continue; }
    updates.push({ subscriptionId: s.id, itemId: item.id });
  }
  return { updates, skipped };
}
