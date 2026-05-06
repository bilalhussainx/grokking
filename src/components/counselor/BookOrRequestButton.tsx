"use client";

// Two-mode booking button rendered next to each service on the counselor
// profile page.
//
//   pricing_model='fixed' → "Book for $X"
//     POSTs to /api/counselor/booking, follows checkout_url straight to Stripe.
//
//   pricing_model='quote' → "Request a quote"
//     Pops a modal where the student types a scope description, POSTs to
//     /api/counselor/request, redirects to /engagements/[id] where the
//     counselor will respond with a quote.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ServiceLike {
  id: string;
  pricing_model: "fixed" | "quote";
  price_usd: number;
  price_usd_min: number | null;
  price_usd_max: number | null;
}

export default function BookOrRequestButton({
  service,
  counselorSlug,
}: {
  service: ServiceLike;
  counselorSlug: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quote-mode-only state — scope textarea and modal toggle.
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  async function bookFixed() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/counselor/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_id: service.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      window.location.href = data.checkout_url;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  }

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/counselor/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: service.id,
          request_message: requestMessage.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      router.push(`/engagements/${data.engagement_id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  }

  if (service.pricing_model === "quote") {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowQuoteForm(true)}
          className="mt-3 w-full px-3 py-2 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[12px] font-medium hover:bg-[#D4AF37]/25"
        >
          Request a quote →
        </button>
        {showQuoteForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => !submitting && setShowQuoteForm(false)}
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={submitRequest}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e0e0e] p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-1">
                Request a quote
              </h3>
              <p className="text-[12px] text-white/55 mb-4">
                Tell the counselor what you need — number of essays, target
                schools, deadlines, anything that affects scope. They&apos;ll
                respond with a price within the
                {service.price_usd_min != null && service.price_usd_max != null
                  ? ` $${service.price_usd_min.toLocaleString()}–$${service.price_usd_max.toLocaleString()}`
                  : ""}{" "}
                range.
              </p>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={5}
                required
                minLength={20}
                placeholder="e.g. Reviewing 5 supplements for Stanford, MIT, and CMU. Submission deadlines Nov 1 and Jan 1. I have first drafts; need a second pass + a 30-min debrief call."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-y focus:outline-none focus:border-[#D4AF37]/50 mb-3"
              />
              {error && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[12px] text-rose-300">
                  {error}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setShowQuoteForm(false)}
                  className="px-3 py-2 rounded-lg text-[12px] text-white/55 hover:text-white/85"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || requestMessage.trim().length < 20}
                  className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[12px] font-semibold hover:bg-[#C4A030] disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Send request
                </button>
              </div>
            </form>
          </div>
        )}
      </>
    );
  }

  // Fixed price mode — direct to Checkout.
  return (
    <div>
      <button
        type="button"
        onClick={bookFixed}
        disabled={submitting}
        className="mt-3 w-full px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[12px] font-semibold hover:bg-[#C4A030] disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
      >
        {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        Book for ${Number(service.price_usd).toLocaleString()}
      </button>
      {error && (
        <p className="mt-1 text-[11px] text-rose-300">{error}</p>
      )}
      {/* counselorSlug is referenced by the import — link to the profile is
          rendered by the parent. Keeping the prop for symmetry / future use. */}
      <span className="hidden">{counselorSlug}</span>
    </div>
  );
}
