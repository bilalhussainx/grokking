"use client";
import { useEffect, useRef, useState } from "react";
import AiBadge from "@/components/app-shell/AiBadge";
import type { InboxItem } from "@/lib/cc/agent/inbox";
import "./agent.css";

type State = "pending" | "saving" | "saved" | "declined" | "undone" | "failed" | "expired";
type Item = Extract<InboxItem, { kind: "proposal" }>;

const RETRY_MS = 3000;
const MAX_TRIES = 3;

function summary(item: Item): string {
  const p = item.payload as Record<string, unknown>;
  if (item.proposalKind === "add_schools") {
    const names = Array.isArray(p.schools) ? (p.schools as { name?: string }[]).map((s) => s.name).filter(Boolean) : [];
    return `Add ${names.join(", ")} to your list`;
  }
  return String(p.title ?? "");
}
function when(item: Item): string | null {
  const p = item.payload as Record<string, unknown>;
  const d = (p.dueDate ?? p.date) as string | null | undefined;
  return d ? (item.proposalKind === "calendar_hold" ? `Calendar hold on ${d}` : `Due ${d} (you can change this later)`) : null;
}

export function ProposalCard({ item, onDone }: { item: Item; onDone?: () => void }) {
  const [state, setState] = useState<State>(Date.now() > item.tokenExpiresAtMs ? "expired" : "pending");
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  async function post(body: Record<string, string>) {
    const res = await fetch(`/api/cc/agent/proposals/${item.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => ({}))) as { status?: string; error?: string };
    return { res, data };
  }

  // A 202 {status:"saving"} means the commit is still in flight: never show
  // Saved for it. Re-confirm (idempotent) up to MAX_TRIES, then ask to retry.
  async function confirm() {
    setState("saving");
    for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
      let out: Awaited<ReturnType<typeof post>>;
      try { out = await post({ action: "confirm", token: item.token }); } catch { if (alive.current) setState("failed"); return; }
      if (!alive.current) return;
      const { res, data } = out;
      if (res.status === 200 && data.status === "committed") { setState("saved"); return; }
      if (res.status === 202) {
        if (attempt === MAX_TRIES) break;
        await new Promise((r) => setTimeout(r, RETRY_MS));
        if (!alive.current) return;
        continue;
      }
      setState(data.error === "token_invalid_or_expired" ? "expired" : "failed");
      return;
    }
    setState("failed");
  }

  async function other(action: "decline" | "undo") {
    try {
      const { res, data } = await post({ action });
      if (!alive.current) return;
      if (!res.ok) { setState(data.error === "token_invalid_or_expired" ? "expired" : "failed"); return; }
      setState(action === "decline" ? "declined" : "undone");
      onDone?.();
    } catch { if (alive.current) setState("failed"); }
  }

  const due = when(item);
  return (
    <article className="ka-card" aria-live="polite">
      <p className="ka-eyebrow">Kairos suggests <AiBadge /></p>
      <h4 className="ka-title">{summary(item)}</h4>
      {due && <p className="ka-meta">{due}</p>}
      <p className="ka-why">Why: {item.reason}</p>
      {state === "pending" && (
        <div className="ka-actions">
          <button type="button" className="ka-primary" onClick={confirm}>Confirm</button>
          <button type="button" className="ka-quiet" onClick={() => other("decline")}>Not now</button>
        </div>
      )}
      {state === "saving" && <p className="ka-meta">Saving…</p>}
      {state === "saved" && (
        <div className="ka-actions"><p className="ka-done">Saved</p><button type="button" className="ka-quiet" onClick={() => other("undo")}>Undo</button></div>
      )}
      {state === "declined" && <p className="ka-meta">Okay, not now.</p>}
      {state === "undone" && <p className="ka-meta">Undone.</p>}
      {state === "expired" && <p className="ka-meta">This suggestion needs a refresh. Reload to see it again.</p>}
      {state === "failed" && <p className="ka-error">That didn&apos;t save. Try again in a moment.</p>}
    </article>
  );
}
