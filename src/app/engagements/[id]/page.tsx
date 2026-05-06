// /engagements/[id] — engagement detail page visible to either party.
//
// Server-rendered. RLS already gates SELECT by participant; we double-check
// the calling user is one of (counselor.user_id, student.user_id) before
// rendering — defense-in-depth + a friendlier 403 message than a blank page.
//
// Renders: status timeline, scope summary, paid amount, "Open live session"
// link (Phase 3 placeholder), and a "Cancel + refund" stub for the student
// when status is paid_pending_start.

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Clock,
  CreditCard,
  PlayCircle,
  GraduationCap,
} from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";

interface EngagementFull {
  id: string;
  status: string;
  scope_jsonb: Record<string, unknown>;
  price_usd_paid: number | null;
  proposed_at: string | null;
  paid_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  service: { title: string | null; service_type: string | null; description: string | null }
    | { title: string | null; service_type: string | null; description: string | null }[]
    | null;
  counselor: { id: string; user_id: string; display_name: string; slug: string }
    | { id: string; user_id: string; display_name: string; slug: string }[]
    | null;
  student: { id: string; user_id: string; preferred_name: string | null }
    | { id: string; user_id: string; preferred_name: string | null }[]
    | null;
}

const STATUS_TIMELINE = [
  { key: "proposed", label: "Proposed", icon: Clock },
  { key: "paid_pending_start", label: "Paid · awaiting start", icon: CreditCard },
  { key: "in_progress", label: "In progress", icon: PlayCircle },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
] as const;

export default async function EngagementDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userSupabase = await createServerSupabase();
  const { data: { user } } = await userSupabase.auth.getUser();
  if (!user) redirect("/login");

  const db = createAdminSupabase();
  const { data: row } = await db
    .from("cc_counselor_engagements")
    .select(`
      id, status, scope_jsonb, price_usd_paid,
      proposed_at, paid_at, started_at, completed_at,
      service:cc_counselor_services!service_id (title, service_type, description),
      counselor:cc_counselors!counselor_id (id, user_id, display_name, slug),
      student:cc_student_profiles!student_id (id, user_id, preferred_name)
    `)
    .eq("id", id)
    .maybeSingle();
  const e = row as EngagementFull | null;
  if (!e) notFound();

  const counselor = Array.isArray(e.counselor) ? e.counselor[0] : e.counselor;
  const student = Array.isArray(e.student) ? e.student[0] : e.student;
  const service = Array.isArray(e.service) ? e.service[0] : e.service;
  const isParty = counselor?.user_id === user.id || student?.user_id === user.id;
  if (!isParty) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center">
        <p className="text-sm text-white/60">
          You don&apos;t have access to this engagement.
        </p>
      </div>
    );
  }
  const viewerRole = counselor?.user_id === user.id ? "counselor" : "student";

  const reachedIdx = (() => {
    const i = STATUS_TIMELINE.findIndex((s) => s.key === e.status);
    if (i >= 0) return i;
    if (["cancelled", "refunded"].includes(e.status)) return 1; // paid then refunded
    return 0;
  })();

  const liveSessionAvailable = ["paid_pending_start", "in_progress", "awaiting_student"].includes(e.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href={viewerRole === "counselor" ? "/counselor/dashboard" : "/cc/dashboard"}
        className="inline-flex items-center gap-1 text-[12px] text-white/55 hover:text-[#D4AF37] mb-3"
      >
        ← Back to dashboard
      </Link>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-5">
        <p className="text-[10.5px] uppercase tracking-wider text-white/45 mb-1">
          {viewerRole === "counselor" ? "With student" : "With counselor"}
        </p>
        <p className="text-lg font-bold text-white mb-1">
          {viewerRole === "counselor"
            ? (student?.preferred_name ?? "Student")
            : (counselor?.display_name ?? "Counselor")}
        </p>
        {service?.title && (
          <p className="text-sm text-white/75">{service.title}</p>
        )}
        {service?.description && (
          <p className="text-[12.5px] text-white/55 mt-2 leading-relaxed">{service.description}</p>
        )}
        {e.price_usd_paid !== null && (
          <p className="text-[12px] text-[#D4AF37] mt-3">
            Paid: ${Number(e.price_usd_paid).toLocaleString()}
          </p>
        )}
      </div>

      {/* Status timeline */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-5">
        <p className="text-[11px] uppercase tracking-wider text-white/55 mb-4">Status</p>
        <ol className="space-y-3">
          {STATUS_TIMELINE.map((step, i) => {
            const reached = i <= reachedIdx;
            const Icon = reached ? step.icon : Circle;
            return (
              <li key={step.key} className="flex items-start gap-3">
                <Icon
                  className={`w-4 h-4 mt-0.5 ${
                    reached ? "text-[#D4AF37]" : "text-white/20"
                  }`}
                />
                <div>
                  <p className={`text-[13px] ${reached ? "text-white" : "text-white/35"}`}>
                    {step.label}
                  </p>
                  <p className="text-[11px] text-white/40">
                    {step.key === "proposed" && e.proposed_at && new Date(e.proposed_at).toLocaleString()}
                    {step.key === "paid_pending_start" && e.paid_at && new Date(e.paid_at).toLocaleString()}
                    {step.key === "in_progress" && e.started_at && new Date(e.started_at).toLocaleString()}
                    {step.key === "completed" && e.completed_at && new Date(e.completed_at).toLocaleString()}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Live session entry */}
      {liveSessionAvailable && (
        <Link
          href={`/counselor/session/${e.id}`}
          className="block rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#1a1610] to-[#141414] p-5 hover:border-[#D4AF37]/50 transition-colors mb-5"
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-[#D4AF37] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Open live session room</p>
              <p className="text-[12px] text-white/55">
                Phase 3 — voice notes + inline comments. Placeholder UI today;
                WebSocket sidecar lights up next.
              </p>
            </div>
            <span className="text-[#D4AF37]">→</span>
          </div>
        </Link>
      )}

      {/* Scope JSON for transparency — Phase 2 will turn this into a per-essay/per-school list */}
      {Object.keys(e.scope_jsonb ?? {}).length > 0 && (
        <details className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-[12px] text-white/55">
          <summary className="cursor-pointer text-white/75">Engagement scope</summary>
          <pre className="mt-2 text-[11px] text-white/55 overflow-x-auto">
            {JSON.stringify(e.scope_jsonb, null, 2)}
          </pre>
        </details>
      )}

      {viewerRole === "student" && e.status === "paid_pending_start" && (
        <p className="text-[11px] text-white/40 mt-4">
          Need to cancel? Refunds within 24h of payment go through Stripe — Phase 2
          self-serve refund button lands with the payouts work.
        </p>
      )}
    </div>
  );
}
