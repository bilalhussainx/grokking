// Which plan to show in Settings (GATE D4.2). The account role and the plan
// are different facts: profiles.role === "pro" can be a signup trial with no
// card and no Stripe customer, so only a live Stripe subscription reads as
// paid Pro. When billing can't be checked, say Pro without claiming either.
export type SubscriptionLike = { plan: string; status: string; stripeSubscriptionId: string | null };
export type PlanKind = "free" | "trial" | "pro" | "pro_unconfirmed" | "ended";
export type PlanState = { kind: PlanKind; trialEndsOn: string | null };

const LIVE = new Set(["active", "trialing", "past_due"]);

export function derivePlanState({
  role,
  trialEndsAt,
  subscription,
  todayIso,
}: {
  role: string | null | undefined;
  trialEndsAt: string | null | undefined;
  subscription: SubscriptionLike | null | "unavailable";
  todayIso: string;
}): PlanState {
  const trialDay = trialEndsAt ? trialEndsAt.slice(0, 10) : null;
  if (subscription && subscription !== "unavailable" && subscription.plan === "pro" && subscription.stripeSubscriptionId && LIVE.has(subscription.status)) {
    return { kind: "pro", trialEndsOn: null };
  }
  if (role === "pro") return { kind: subscription === "unavailable" ? "pro_unconfirmed" : "trial", trialEndsOn: trialDay };
  if (trialDay && trialDay < todayIso) return { kind: "ended", trialEndsOn: trialDay };
  return { kind: "free", trialEndsOn: null };
}
