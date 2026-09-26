// Billing period of a Stripe subscription as ISO strings. Current API
// versions put current_period_start/end on subscription items; older ones on
// the subscription itself. Reads the item first, then the legacy field.
type PeriodFields = { current_period_start?: number | null; current_period_end?: number | null };
type SubLike = (PeriodFields & { items?: { data?: PeriodFields[] } | null }) | null | undefined;

const iso = (s: number | null | undefined) => (s == null ? null : new Date(s * 1000).toISOString());

export function subscriptionPeriod(sub: SubLike): { start: string | null; end: string | null } {
  const item = sub?.items?.data?.[0];
  return {
    start: iso(item?.current_period_start ?? sub?.current_period_start),
    end: iso(item?.current_period_end ?? sub?.current_period_end),
  };
}
