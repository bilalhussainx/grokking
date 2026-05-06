"use client";

// Per-role, per-status action panel rendered on /engagements/[id].
//
//   counselor + status='quote_requested'  → "Send quote" form (price + note)
//   counselor + status='quoted'            → "Update quote" (re-quote)
//   student   + status='quoted'            → "Accept & pay" (mints Checkout)
//                                             + "Decline quote" (soft cancel)
//
// All other states render nothing — the timeline + paid amount on the page
// already convey them.

import { useState } from "react";
import { Loader2, Check, X } from "lucide-react";

interface Props {
  engagementId: string;
  viewerRole: "counselor" | "student";
  status: string;
  quotedPriceUsd: number | null;
  rangeMin: number | null;
  rangeMax: number | null;
  typicalPriceUsd: number | null;
}

export default function QuoteActions({
  engagementId,
  viewerRole,
  status,
  quotedPriceUsd,
  rangeMin,
  rangeMax,
  typicalPriceUsd,
}: Props) {
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Counselor-side compose-quote state
  const [price, setPrice] = useState<number>(
    quotedPriceUsd ?? typicalPriceUsd ?? rangeMin ?? 100,
  );
  const [message, setMessage] = useState<string>("");

  async function sendQuote() {
    setSubmitting("quote");
    setError(null);
    try {
      const res = await fetch(`/api/counselor/engagements/${engagementId}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoted_price_usd: price, quote_message: message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(null);
    }
  }

  async function acceptQuote() {
    setSubmitting("accept");
    setError(null);
    try {
      const res = await fetch(`/api/counselor/engagements/${engagementId}/accept-quote`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      window.location.href = data.checkout_url;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(null);
    }
  }

  async function declineQuote() {
    if (!confirm("Decline this quote? The counselor can still send you a new one.")) return;
    setSubmitting("decline");
    setError(null);
    try {
      const res = await fetch(`/api/counselor/engagements/${engagementId}/decline-quote`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(null);
    }
  }

  // ─── Counselor: compose / re-compose a quote ──────────────────────────
  if (viewerRole === "counselor" && (status === "quote_requested" || status === "quoted")) {
    const isReQuote = status === "quoted";
    return (
      <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#1a1610] p-5">
        <p className="text-sm font-semibold text-white mb-1">
          {isReQuote ? "Update your quote" : "Respond with a quote"}
        </p>
        <p className="text-[12px] text-white/55 mb-3">
          {rangeMin != null && rangeMax != null
            ? `Your advertised range is $${rangeMin.toLocaleString()}–$${rangeMax.toLocaleString()}.`
            : "Set the price you want to charge for this specific request."}
        </p>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <label className="block sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-white/55 block mb-1">Price (USD)</span>
            <input
              type="number"
              min={1}
              step={1}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[11px] uppercase tracking-wider text-white/55 block mb-1">
              Note to student <span className="text-white/40 normal-case">(optional)</span>
            </span>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Includes 2 written passes + a 30-min debrief call. 5-day turnaround."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
            />
          </label>
        </div>
        {error && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[12px] text-rose-300">
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={sendQuote}
          disabled={submitting !== null || price < 1}
          className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[12px] font-semibold hover:bg-[#C4A030] disabled:opacity-50 inline-flex items-center gap-1.5"
        >
          {submitting === "quote" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isReQuote ? "Send updated quote" : "Send quote"}
        </button>
      </div>
    );
  }

  // ─── Student: accept or decline a quote ──────────────────────────────
  if (viewerRole === "student" && status === "quoted" && quotedPriceUsd) {
    return (
      <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#1a1610] p-5">
        <p className="text-[10.5px] uppercase tracking-wider text-white/45 mb-1">Counselor quoted</p>
        <p className="text-2xl font-bold text-[#D4AF37] mb-3">
          ${Number(quotedPriceUsd).toLocaleString()}
        </p>
        {error && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[12px] text-rose-300">
            {error}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={acceptQuote}
            disabled={submitting !== null}
            className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-semibold hover:bg-[#C4A030] disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {submitting === "accept" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Accept &amp; pay
          </button>
          <button
            type="button"
            onClick={declineQuote}
            disabled={submitting !== null}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/75 text-[13px] hover:bg-white/10 disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {submitting === "decline" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
            Decline quote
          </button>
        </div>
      </div>
    );
  }

  return null;
}
