"use client";
import { useEffect, useState } from "react";
import AiBadge from "@/components/app-shell/AiBadge";
import type { InboxItem } from "@/lib/cc/agent/inbox";
import { ProposalCard } from "./ProposalCard";
import "./agent.css";

export function KairosInbox() {
  const [items, setItems] = useState<InboxItem[] | null>(null);
  const load = () => fetch("/api/cc/agent/inbox").then((r) => (r.ok ? r.json() : { items: [] })).then((b) => setItems(b.items ?? [])).catch(() => setItems([]));
  useEffect(() => { load(); }, []);
  if (!items || items.length === 0) return null;
  async function nudge(id: string, action: "dismiss" | "snooze") {
    await fetch(`/api/cc/agent/nudges/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) }).catch(() => undefined);
    load();
  }
  return (
    <section className="ka-inbox" aria-labelledby="ka-inbox-h">
      <h3 id="ka-inbox-h" className="ka-eyebrow">Kairos noticed <AiBadge /></h3>
      {items.map((it) => it.kind === "nudge" ? (
        <article key={it.id} className="ka-card">
          <h4 className="ka-title">{it.title}</h4>
          <p className="ka-why">{it.detail}</p>
          <div className="ka-actions">
            <button type="button" className="ka-quiet" onClick={() => nudge(it.id, "snooze")}>Remind me next week</button>
            <button type="button" className="ka-quiet" onClick={() => nudge(it.id, "dismiss")}>Dismiss</button>
          </div>
        </article>
      ) : <ProposalCard key={it.id} item={it} onDone={load} />)}
    </section>
  );
}
