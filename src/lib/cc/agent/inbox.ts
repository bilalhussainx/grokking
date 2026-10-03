import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthScope, Json } from "./contracts";
import { signConfirmToken } from "./proposals";

export type InboxItem =
  | { kind: "nudge"; id: string; trigger: string; title: string; detail: string; createdAt: string }
  | { kind: "proposal"; id: string; proposalKind: string; payload: Json; reason: string; token: string; tokenExpiresAtMs: number };

export async function loadInbox(db: SupabaseClient, scope: AuthScope, now: Date, secret: string): Promise<InboxItem[]> {
  const today = now.toISOString().slice(0, 10);
  const [{ data: nudges }, { data: proposals }] = await Promise.all([
    db.from("cc_agent_nudges").select("id,trigger,reason,status,snoozed_until,created_at").eq("user_id", scope.userId),
    db.from("cc_agent_proposals").select("id,kind,payload,payload_hash,reason,status,expires_at,turn_id").eq("user_id", scope.userId).eq("status", "pending"),
  ]);
  const n = ((nudges ?? []) as { id: string; trigger: string; reason: { title: string; detail: string }; status: string; snoozed_until: string | null; created_at: string }[])
    .filter((x) => x.status === "open" || (x.status === "snoozed" && x.snoozed_until !== null && x.snoozed_until <= today))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((x): InboxItem => ({ kind: "nudge", id: x.id, trigger: x.trigger, title: x.reason.title, detail: x.reason.detail, createdAt: x.created_at }));
  const live = ((proposals ?? []) as { id: string; kind: string; payload: Json; payload_hash: string; reason: string; expires_at: string; turn_id: string | null }[])
    .filter((x) => new Date(x.expires_at).getTime() > now.getTime());
  // Defense in depth: a failed turn's proposals must never surface, even if Task 4's expiry missed them.
  const turnIds = [...new Set(live.map((x) => x.turn_id).filter((t): t is string => !!t))];
  const failed = new Set<string>();
  if (turnIds.length > 0) {
    const { data: turns } = await db.from("cc_agent_turns").select("id,status").eq("user_id", scope.userId).in("id", turnIds);
    for (const t of (turns ?? []) as { id: string; status: string }[]) if (t.status === "failed") failed.add(t.id);
  }
  const p = live
    .filter((x) => !x.turn_id || !failed.has(x.turn_id))
    .map((x): InboxItem => {
      const t = signConfirmToken({ id: x.id, userId: scope.userId, payloadHash: x.payload_hash }, now, secret);
      return { kind: "proposal", id: x.id, proposalKind: x.kind, payload: x.payload, reason: x.reason, token: t.token, tokenExpiresAtMs: t.expiresAtMs };
    });
  return [...n, ...p];
}

export async function loadActivity(db: SupabaseClient, scope: AuthScope, limit: number) {
  const { data } = await db.from("cc_agent_events").select("type,label,created_at").eq("user_id", scope.userId).order("created_at", { ascending: false }).limit(limit);
  return ((data ?? []) as { type: string; label: string; created_at: string }[])
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit)
    .map((e) => ({ type: e.type, label: e.label, createdAt: e.created_at }));
}

export async function setNudgeStatus(db: SupabaseClient, scope: AuthScope, id: string, action: "dismiss" | "snooze", now: Date): Promise<number> {
  const { data } = await db.from("cc_agent_nudges").select("id").eq("id", id).eq("user_id", scope.userId).maybeSingle();
  if (!data) return 404;
  const until = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10);
  await db.from("cc_agent_nudges").update(action === "snooze" ? { status: "snoozed", snoozed_until: until } : { status: "dismissed" }).eq("id", id).eq("user_id", scope.userId);
  return 200;
}
