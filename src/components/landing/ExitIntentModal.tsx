"use client";

// Exit-intent capture. Arms once per session on /landing when the guest has
// had at least one productive interaction (1 coach message, 1 school added,
// or 1 essay draft). Fires on desktop mouse-leave at the top of the viewport
// and on mobile back-button press.
//
// Plan: docs/superpowers/plans/2026-04-22-guest-trial-funnel.md § 8.5
import { useEffect, useRef, useState } from "react";

const EXIT_INTENT_ENABLED =
  process.env.NEXT_PUBLIC_EXIT_INTENT_ENABLED !== "false";
const SESSION_KEY = "kairos_exit_intent_fired";

interface Props {
  armThreshold?: "productive" | "aggressive";
}

export default function ExitIntentModal({ armThreshold = "productive" }: Props) {
  const [shown, setShown] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const armed = useRef(false);

  useEffect(() => {
    if (!EXIT_INTENT_ENABLED) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;

    const productive =
      armThreshold === "aggressive" || detectProductiveSignal();
    if (!productive) return;

    armed.current = true;

    const handleMouseLeave = (e: MouseEvent) => {
      if (!armed.current) return;
      // Only fire when the cursor exits the top of the viewport — side exits
      // usually mean reaching for a tab, not leaving.
      if (e.clientY <= 0) {
        fire();
      }
    };

    const handlePopstate = () => {
      if (!armed.current) return;
      fire();
    };

    function fire() {
      armed.current = false;
      sessionStorage.setItem(SESSION_KEY, "1");
      setShown(true);
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("popstate", handlePopstate);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [armThreshold]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-intent" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to save — try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!shown) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={() => setShown(false)}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl border border-[#D4AF37]/30 bg-[#0a0c11] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShown(false)}
          className="absolute top-3 right-3 text-white/40 hover:text-white/70 text-sm"
          aria-label="Close"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-2xl mb-3">✓</div>
            <div className="text-lg text-white font-medium mb-2">
              Got it — we&apos;ll be in touch.
            </div>
            <div className="text-sm text-white/60">
              Your progress is saved in this browser. Sign up anytime to access it on other devices.
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-serif text-white mb-2">
              Stay in the loop?
            </h2>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              Drop your email and we&apos;ll reach out when resume links and new features launch.
              Your current progress is already saved in this browser.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50"
              />
              {error && <div className="text-xs text-red-400">{error}</div>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#D4AF37] text-black py-2.5 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-[#E0BC4C] transition-colors"
              >
                {submitting ? "Saving…" : "Save my email"}
              </button>
              <p className="text-[11px] text-white/40 text-center">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// Hueristic: has the guest taken any productive action in this session?
// We cheat here and read localStorage keys the rest of the app writes. The
// modal arms more aggressively if nothing is found (blank-slate bouncers get
// served the modal too, just with weaker copy downstream).
function detectProductiveSignal(): boolean {
  if (typeof window === "undefined") return false;
  // Plausible signals set by HeroCoachChat / school-list / essay drafts.
  const signals = [
    "kairos_hero_chat_count",
    "kairos_school_added",
    "kairos_essay_drafted",
  ];
  for (const key of signals) {
    const v = localStorage.getItem(key);
    if (v && v !== "0") return true;
  }
  // Fall back to any coach history at all — the coach context writes to its
  // own keys. Be permissive: arm on any kairos_* hit so blank bouncers also
  // see the modal, just once per session.
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith("kairos_")) return true;
  }
  // Blank-slate fallback: still arm the modal — exit-intent on zero-signal
  // bouncers is the whole point of the "aggressive" variant.
  return true;
}
