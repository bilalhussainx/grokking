"use client";
import { useEffect, useState } from "react";
import "./agent.css";

export function ActivityLog() {
  const [items, setItems] = useState<{ type: string; label: string; createdAt: string }[] | null>(null);
  useEffect(() => { fetch("/api/cc/agent/activity").then((r) => (r.ok ? r.json() : { items: [] })).then((b) => setItems(b.items ?? [])).catch(() => setItems([])); }, []);
  if (items === null) return <p className="ka-meta">Loading what Kairos did…</p>;
  if (items.length === 0) return <p className="ka-meta">Nothing yet. When Kairos checks something or you confirm a suggestion, it shows here.</p>;
  return (
    <ol className="ka-log" aria-label="What Kairos did and why">
      {items.map((e, i) => (
        <li key={i}><span className="ka-log-label">{e.label}</span> <time className="ka-meta" dateTime={e.createdAt}>{new Date(e.createdAt).toLocaleString()}</time></li>
      ))}
    </ol>
  );
}
