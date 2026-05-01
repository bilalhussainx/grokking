"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * Pro upgrade button used by the marketing pricing page. Calls
 * POST /api/billing/stripe/checkout which returns a Stripe-hosted
 * checkout URL; we redirect into it.
 *
 * Behavior:
 *   - Unauth user: route to /auth/login?next=/pricing&intent=upgrade so
 *     Stripe gets a real signed-in user (and an email) at checkout.
 *   - Auth + Stripe configured: redirect to session.url
 *   - Auth + Stripe not configured: show inline error.
 */
export default function ProCheckoutButton({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setError(null);
    if (!user) {
      router.push("/auth/login?next=/pricing&intent=upgrade");
      return;
    }
    setOpening(true);
    try {
      const res = await fetch("/api/billing/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Checkout failed (${res.status})`);
      }
      const { url } = (await res.json()) as { url: string };
      if (!url) throw new Error("Stripe returned no checkout URL");
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOpening(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={onClick}
        disabled={opening}
        aria-busy={opening}
      >
        {opening ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Opening checkout…
          </>
        ) : (
          children
        )}
      </button>
      {error && (
        <p
          role="alert"
          style={{
            marginTop: 8,
            fontSize: 11.5,
            color: "rgb(252, 165, 165)",
            fontFamily: "'DM Sans', sans-serif",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}
    </>
  );
}
