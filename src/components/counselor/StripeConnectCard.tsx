"use client";

// Stripe Connect Express onboarding card for /counselor/payouts.
// Starts (or resumes) Stripe-hosted onboarding via
// POST /api/counselor/payouts/onboard, and refreshes live status via GET
// on mount — so returning from Stripe flips the badge without a manual
// reload.

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

type PayoutStatus = "none" | "pending" | "enabled" | "unconfigured" | "loading";

export default function StripeConnectCard({
  initialAccountId,
}: {
  initialAccountId: string | null;
}) {
  const [status, setStatus] = useState<PayoutStatus>("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/counselor/payouts/onboard")
      .then((r) => r.json())
      .then((d) => setStatus((d.status as PayoutStatus) ?? "none"))
      .catch(() => setStatus(initialAccountId ? "pending" : "none"));
  }, [initialAccountId]);

  async function startOnboarding() {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/counselor/payouts/onboard", { method: "POST" });
      const d = await r.json();
      if (d.url) {
        window.location.href = d.url as string;
        return;
      }
      setError(d.error ?? "Could not start Stripe onboarding. Try again.");
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 mb-4">
      <p className="text-[11px] uppercase tracking-wider text-white/55 mb-2">
        Connected account
      </p>

      {status === "loading" && (
        <p className="text-[13px] text-white/45 mb-3">Checking status…</p>
      )}
      {status === "enabled" && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-emerald-400 text-sm font-medium">
            Connected — you can accept bookings
          </span>
        </div>
      )}
      {status === "pending" && (
        <div className="mb-3">
          <span className="text-amber-300 text-sm font-medium">
            Onboarding started, not finished
          </span>
          <p className="text-[12px] text-white/50 mt-1">
            Stripe still needs a few details before payouts can flow. Pick up
            where you left off below.
          </p>
        </div>
      )}
      {status === "none" && (
        <p className="text-[13px] text-white/55 mb-3">
          Connect a payout account so students can book your services. Stripe
          handles identity and banking — it takes about five minutes.
        </p>
      )}
      {status === "unconfigured" && (
        <p className="text-[13px] text-white/45 mb-3 italic">
          Payments aren&apos;t enabled on this environment.
        </p>
      )}

      {(status === "none" || status === "pending") && (
        <button
          onClick={startOnboarding}
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#c9a532] disabled:opacity-50 transition-colors"
        >
          {busy ? "Opening Stripe…" : status === "pending" ? "Resume onboarding" : "Connect payouts with Stripe"}
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      )}
      {error && <p className="text-[12px] text-red-400 mt-2">{error}</p>}

      <p className="text-[12.5px] text-white/55 leading-relaxed mt-4">
        Students pay the listed price at booking. KairosLearn keeps a 10%
        platform fee; the rest lands in your Stripe account on Stripe&apos;s
        standard payout schedule. Refunds and disputes are handled through
        Stripe as well.
      </p>
    </div>
  );
}
