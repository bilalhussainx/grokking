"use client";

// Manage billing over the existing POST /api/billing/stripe/portal. 404 means
// no Stripe customer (often a signup trial): explain it and never start a
// checkout. Anything else that fails leaves the plan unchanged and offers a retry.
import Link from "next/link";
import { useRef, useState } from "react";

type State = "idle" | "loading" | "missing" | "error";

export default function ManageBillingButton({
  onNavigate = (url: string) => window.location.assign(url),
}: {
  onNavigate?: (url: string) => void;
}) {
  const [state, setState] = useState<State>("idle");
  const inFlight = useRef(false);

  async function open() {
    if (inFlight.current) return;
    inFlight.current = true;
    setState("loading");
    try {
      const res = await fetch("/api/billing/stripe/portal", { method: "POST" });
      if (res.status === 404) { setState("missing"); return; }
      const data = (await res.json().catch(() => null)) as { url?: string } | null;
      if (!res.ok || !data?.url) { setState("error"); return; }
      onNavigate(data.url); // leaves the page; stay in "loading" meanwhile
    } catch {
      setState("error");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <div className="st-billing">
      <button type="button" className="af-primary" onClick={() => void open()} disabled={state === "loading"} aria-busy={state === "loading"}>
        {state === "loading" ? "Opening secure billing…" : "Manage billing"}
        <span aria-hidden="true">↗</span>
      </button>
      {state === "missing" && (
        <div role="status" className="af-notice">
          <strong>No billing account is connected.</strong>
          <p>You may be using a signup trial. Check your plan before making a purchase.</p>
          <Link className="af-quiet" href="/pricing">View plans</Link>
        </div>
      )}
      {state === "error" && (
        <div role="alert" className="af-notice">
          <strong>We couldn&apos;t open billing.</strong>
          <p>Your plan has not changed. Try again when you&apos;re ready.</p>
          <button type="button" className="af-quiet" onClick={() => void open()}>Try again</button>
        </div>
      )}
      <p className="af-caption">Cards, invoices, plan changes and cancellation open in Stripe.</p>
    </div>
  );
}
