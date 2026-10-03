// src/lib/cc/agent/triggers.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import { checkREAConflict } from "@/lib/applications/ed-strategy";
import { isAgentS1User } from "./s1-flag";

export type TriggerInput = { userId: string; studentId: string; schools: { schoolName: string; plan: string | null }[]; essays: { id: string; reviewState: string | null; phase: string | null; updatedAt: string | null }[]; lastLoginDate: string | null };
export type Nudge = { trigger: "plan_conflict" | "essay_stall" | "inactivity"; entityKey: string; periodKey: string; reason: { title: string; detail: string } };
const DAY = 86400000;

export function isoWeek(now: Date): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / DAY + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function evaluateTriggers(input: TriggerInput, now: Date): Nudge[] {
  const period = isoWeek(now);
  const out: Nudge[] = [];
  const conflict = checkREAConflict(input.schools);
  if (conflict.conflict) out.push({ trigger: "plan_conflict", entityKey: `rea:${conflict.reaSchool}`, periodKey: period, reason: { title: "Your early plans conflict", detail: conflict.message } });
  for (const e of input.essays) {
    if (e.reviewState !== "changes_requested" || !e.updatedAt) continue;
    const days = Math.floor((now.getTime() - new Date(e.updatedAt).getTime()) / DAY);
    if (days >= 10) out.push({ trigger: "essay_stall", entityKey: `essay:${e.id}`, periodKey: period, reason: { title: "An essay is waiting on your revision", detail: `Your counselor asked for changes ${days} days ago.` } });
  }
  if (input.lastLoginDate) {
    const days = Math.floor((now.getTime() - new Date(`${input.lastLoginDate}T00:00:00Z`).getTime()) / DAY);
    if (days >= 14) out.push({ trigger: "inactivity", entityKey: "login", periodKey: period, reason: { title: "Welcome back", detail: `It's been ${days} days. Want a 10-minute version of your next step?` } });
  }
  return out;
}

export async function runNudgeCron(db: SupabaseClient, now: Date, env: Record<string, string | undefined> = process.env) {
  const allow = (env.AGENT_S1_USER_IDS ?? "").split(",").map((s) => s.trim()).filter((id) => id && isAgentS1User(id, env));
  if (!allow.length) return { inserted: 0, students: 0 };
  const { data: profiles } = await db.from("cc_student_profiles").select("id,user_id").in("user_id", allow);
  let inserted = 0;
  const byUser = new Map<string, string[]>();
  for (const p of (profiles ?? []) as { id: string; user_id: string }[]) byUser.set(p.user_id, [...(byUser.get(p.user_id) ?? []), p.id]);
  for (const [userId, ids] of byUser) {
    const [{ data: ss }, { data: essays }, { data: up }] = await Promise.all([
      db.from("cc_student_schools").select("school_id,application_plan").in("student_id", ids),
      db.from("cc_essays").select("id,counselor_review_state,phase,updated_at").in("student_id", ids),
      db.from("user_profiles").select("last_login_date").eq("id", userId).maybeSingle(),
    ]);
    const schoolIds = ((ss ?? []) as { school_id: string }[]).map((r) => r.school_id);
    const { data: names } = schoolIds.length ? await db.from("cc_schools").select("id,name").in("id", schoolIds) : { data: [] };
    const nameOf = new Map(((names ?? []) as { id: string; name: string }[]).map((s) => [s.id, s.name]));
    const nudges = evaluateTriggers({
      userId, studentId: ids[0],
      schools: ((ss ?? []) as { school_id: string; application_plan: string | null }[]).filter((r) => nameOf.has(r.school_id)).map((r) => ({ schoolName: nameOf.get(r.school_id)!, plan: r.application_plan })),
      essays: ((essays ?? []) as { id: string; counselor_review_state: string | null; phase: string | null; updated_at: string | null }[]).map((e) => ({ id: e.id, reviewState: e.counselor_review_state, phase: e.phase, updatedAt: e.updated_at })),
      lastLoginDate: ((up ?? null) as { last_login_date: string | null } | null)?.last_login_date ?? null,
    }, now);
    for (const n of nudges) {
      const { data: dup } = await db.from("cc_agent_nudges").select("id").eq("student_id", ids[0]).eq("trigger", n.trigger).eq("entity_key", n.entityKey).eq("period_key", n.periodKey).maybeSingle();
      if (dup) continue;
      const { error } = await db.from("cc_agent_nudges").insert({ user_id: userId, student_id: ids[0], trigger: n.trigger, entity_key: n.entityKey, period_key: n.periodKey, reason: n.reason });
      if (!error) {
        inserted++;
        await db.from("cc_agent_events").insert({ user_id: userId, turn_id: null, seq: 0, type: "nudge.created", label: n.reason.title, payload: { trigger: n.trigger } });
      }
    }
  }
  return { inserted, students: byUser.size };
}
