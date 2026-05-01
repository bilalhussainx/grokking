// src/components/billing/SubscriptionStatus.tsx
// Shows current plan, next billing date, and manage/cancel buttons.
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Crown,
  Calendar,
  AlertTriangle,
  Pause,
  Play,
  XCircle,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import type { Subscription, SubscriptionAction } from "@/types/billing";

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
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"cancel" | "pause" | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const performAction = async (action: SubscriptionAction["action"]) => {
    setActionLoading(action);
    setMessage(null);
    setConfirmAction(null);

    try {
      const res = await fetch("/api/billing/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Action failed" });
      } else {
        const actionLabels: Record<string, string> = {
          cancel: "Subscription will cancel at end of billing period.",
          pause: "Subscription will pause at end of billing period.",
          resume: "Subscription resumed successfully.",
        };
        setMessage({ type: "success", text: actionLabels[action] || "Done." });
        // Refresh subscription data
        await fetchSubscription();
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setActionLoading(null);
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
  const isActive = subscription.status === "active" || subscription.status === "trialing";
  const isPaused = subscription.status === "paused";
  const isCanceled = subscription.status === "canceled";

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
            $10<span className="text-sm text-white/40 font-normal">/mo</span>
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

      {/* Messages */}
      {message && (
        <div
          className={`flex items-start gap-2 text-sm rounded-lg px-4 py-3 border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Confirmation dialog */}
      {confirmAction && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 space-y-3">
          <p className="text-sm text-amber-300">
            {confirmAction === "cancel"
              ? "Are you sure you want to cancel? You'll retain access until the end of your billing period."
              : "Are you sure you want to pause your subscription?"}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => performAction(confirmAction)}
              disabled={!!actionLoading}
              className="px-4 py-2 text-sm rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading === confirmAction && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              Yes, {confirmAction}
            </button>
            <button
              onClick={() => setConfirmAction(null)}
              className="px-4 py-2 text-sm rounded-lg bg-white/[0.05] text-white/60 hover:bg-white/10 transition-colors"
            >
              Keep my plan
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {isPro && !confirmAction && (
        <div className="flex flex-wrap gap-2">
          {/* Manage in Paddle */}
          {subscription.paddleSubscriptionId && (
            <a
              href={`https://${
                process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production"
                  ? "customer"
                  : "sandbox-customer"
              }.paddle.com/subscriptions/${subscription.paddleSubscriptionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/[0.05] text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors border border-white/[0.08]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Manage Subscription
            </a>
          )}

          {/* Cancel */}
          {isActive && !subscription.cancelAtPeriodEnd && (
            <button
              onClick={() => setConfirmAction("cancel")}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/[0.05] text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-white/[0.08]"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}

          {/* Pause (only active subs) */}
          {isActive && !subscription.cancelAtPeriodEnd && (
            <button
              onClick={() => setConfirmAction("pause")}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/[0.05] text-white/40 hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors border border-white/[0.08]"
            >
              <Pause className="w-3.5 h-3.5" />
              Pause
            </button>
          )}

          {/* Resume (only paused subs) */}
          {isPaused && (
            <button
              onClick={() => performAction("resume")}
              disabled={!!actionLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition-colors border border-violet-500/30 disabled:opacity-50"
            >
              {actionLoading === "resume" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              Resume
            </button>
          )}
        </div>
      )}

      {/* Free plan CTA */}
      {isFree && (
        <a
          href="/pricing"
          className="block text-center py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold text-sm hover:from-violet-400 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/25"
        >
          <Crown className="w-4 h-4 inline mr-2" />
          Upgrade to Pro -- $12/mo
        </a>
      )}
    </div>
  );
}
