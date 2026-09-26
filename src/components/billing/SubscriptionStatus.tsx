// src/components/billing/SubscriptionStatus.tsx
// Shows current plan, status, next billing date, and a "Manage subscription"
// button that opens the Stripe Billing Portal. Cancel / pause / resume /
// update-card all live in the portal — we deliberately don't reimplement
// them so Stripe stays the source of truth and the webhook stays the only
// path that mutates user_subscriptions.
"use client";
import { PRICING, proMonthlyLabel } from "@/lib/pricing";

import { useState, useEffect, useCallback } from "react";
import {
  Crown,
  Calendar,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import type { Subscription } from "@/types/billing";

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  active: { text: "Active", color: "text-emerald-400" },
  trialing: { text: "Trial", color: "text-cyan-400" },
  canceled: { text: "Canceled", color: "text-amber-400" },
  paused: { text: "Paused", color: "text-yellow-400" },
  past_due: { text: "Past Due", color: "text-red-400" },
};

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalOpening, setPortalOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/subscription");
      if (res.ok) {
        const { subscription: sub } = await res.json();
        setSubscription(sub);
      }
    } catch {
      console.error("[Billing] Failed to fetch subscription");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const openPortal = async () => {
    setError(null);
    setPortalOpening(true);
    try {
      const res = await fetch("/api/billing/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Couldn't open the billing portal.");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't open the billing portal.");
      setPortalOpening(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-white/30" />
          <span className="text-sm text-white/40">Loading subscription...</span>
        </div>
      </div>
    );
  }

  if (!subscription) return null;

  const isFree = subscription.plan === "free";
  const isPro = subscription.plan === "pro";
  const statusInfo = STATUS_LABELS[subscription.status] || STATUS_LABELS.active;
  const periodEnd = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd)
    : null;
  const isCanceled = subscription.status === "canceled";

  // Subsidized grants don't have a real Stripe customer, so the portal
  // can't open for them — hide the manage button in that case.
  const hasStripeCustomer =
    !!subscription.stripeCustomerId &&
    subscription.stripeSubscriptionId !== "subsidized-grant";

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isPro
                ? "bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30"
                : "bg-white/[0.05] border border-white/[0.08]"
            }`}
          >
            <Crown
              className={`w-5 h-5 ${isPro ? "text-violet-400" : "text-white/30"}`}
            />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {isPro ? "Pro Plan" : "Free Plan"}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className={statusInfo.color}>{statusInfo.text}</span>
              {subscription.cancelAtPeriodEnd && (
                <span className="text-amber-400/70 text-xs">
                  (cancels at period end)
                </span>
              )}
            </div>
          </div>
        </div>

        {isPro && (
          <span className="text-2xl font-bold text-white">
            ${PRICING.pro.monthlyUsd}<span className="text-sm text-white/40 font-normal">/mo</span>
          </span>
        )}
      </div>

      {/* Billing period */}
      {isPro && periodEnd && (
        <div className="flex items-center gap-2 text-sm text-white/50 bg-white/[0.03] rounded-lg px-4 py-2.5 border border-white/[0.05]">
          <Calendar className="w-4 h-4 shrink-0" />
          <span>
            {isCanceled
              ? `Access until ${periodEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
              : `Next billing: ${periodEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-sm rounded-lg px-4 py-3 border bg-red-500/10 border-red-500/20 text-red-400">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Manage via Stripe portal */}
      {isPro && hasStripeCustomer && (
        <button
          type="button"
          onClick={openPortal}
          disabled={portalOpening}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/[0.05] text-white/70 hover:bg-white/10 hover:text-white transition-colors border border-white/[0.08] disabled:opacity-50"
        >
          {portalOpening ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ExternalLink className="w-3.5 h-3.5" />
          )}
          Manage subscription
        </button>
      )}

      {/* Free plan CTA */}
      {isFree && (
        <a
          href="/pricing"
          className="block text-center py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold text-sm hover:from-violet-400 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/25"
        >
          <Crown className="w-4 h-4 inline mr-2" />
          Upgrade to Pro -- {proMonthlyLabel()}
        </a>
      )}
    </div>
  );
}
