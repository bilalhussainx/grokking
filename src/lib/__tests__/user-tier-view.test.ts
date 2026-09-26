// The signup Pro trial is a user_subscriptions row with status 'trialing'
// and no Stripe subscription. v_user_tier counted any 'trialing' row as Pro
// with no end date, so the 7-day trial never ended for tier-gate (and, with
// Pro exempt from credits, trial users would be unlimited forever).
import { describe, it, expect } from "vitest";
import fs from "node:fs";

const sql = fs.readFileSync("supabase/migrations/20260925_user_tier_trial_expiry.sql", "utf8");

describe("v_user_tier trial expiry", () => {
  it("a Stripe-managed active/trialing subscription is Pro", () => {
    expect(sql).toMatch(/s\.stripe_subscription_id IS NOT NULL AND s\.status IN \('active', 'trialing'\) AND s\.plan = 'pro' THEN 'pro'/);
  });
  it("a signup trial (no Stripe subscription) is Pro only until current_period_end", () => {
    expect(sql).toMatch(/s\.stripe_subscription_id IS NULL AND s\.status = 'trialing' AND s\.plan = 'pro' AND s\.current_period_end > now\(\) THEN 'pro'/);
  });
  it("keeps the canceled-until-period-end grace and the guest rule", () => {
    expect(sql).toMatch(/s\.status = 'canceled' AND s\.plan = 'pro' AND s\.current_period_end > now\(\) THEN 'pro'/);
    expect(sql).toMatch(/WHEN u\.is_anonymous THEN 'guest'/);
  });
});
