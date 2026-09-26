// /counselor/dashboard — counselor's home page after sign-in.
//
// Server-rendered: queries cc_counselor_engagements grouped by lifecycle
// state and renders three columns (proposed / in-progress / completed)
// plus quick links to services + payouts. If the user isn't a counselor,
// bounces to /counselor/onboard.

import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  ListChecks,
  CreditCard,
  Star,
  Settings2,
} from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getCounselorForUser } from "@/lib/cc/counselor-helpers";
import { getAnyAgencyMembership } from "@/lib/cc/agency-membership";
import CreateWorkspaceCard from "@/components/counselor/CreateWorkspaceCard";

interface EngagementRow {
  id: string;
  status: string;
  price_usd_paid: number | null;
  proposed_at: string | null;
  paid_at: string | null;
  completed_at: string | null;
  service: { title: string | null; service_type: string | null } | { title: string | null; service_type: string | null }[] | null;
  student: { preferred_name: string | null } | { preferred_name: string | null }[] | null;
}

// Quote-mode statuses (quote_requested, quoted, quote_declined) added
// 2026-05-06. Quote-requested goes to inbox first — that's the "you have
// a new request waiting on your response" surface counselors will check.
const STATUS_GROUPS = {
  inbox: ["quote_requested", "quoted", "proposed", "paid_pending_start"],
  active: ["in_progress", "awaiting_student"],
  done: ["completed", "cancelled", "refunded", "quote_declined"],
} as const;

const STATUS_LABELS: Record<string, string> = {
  quote_requested: "New request · respond",
  quoted: "Quoted · awaiting student",
  quote_declined: "Quote declined",
  proposed: "Proposed",
  paid_pending_start: "Paid · awaiting start",
  in_progress: "In progress",
  awaiting_student: "Awaiting student",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default async function CounselorDashboard() {
  const userSupabase = await createServerSupabase();
  const { data: { user } } = await userSupabase.auth.getUser();
  if (!user) redirect("/login");

  const counselor = await getCounselorForUser(user.id);
  if (!counselor) redirect("/counselor/onboard");
  // Invite codes, the roster and essay review all need an agency (QA-04).
  const membership = await getAnyAgencyMembership(user.id);

  const db = createAdminSupabase();
  const [{ data: engagementsRaw }, { count: serviceCount }] = await Promise.all([
    db
      .from("cc_counselor_engagements")
      .select(`
        id, status, price_usd_paid, proposed_at, paid_at, completed_at,
        service:cc_counselor_services!service_id (title, service_type),
        student:cc_student_profiles!student_id (preferred_name)
      `)
      .eq("counselor_id", counselor.id)
      .order("proposed_at", { ascending: false })
      .limit(50),
    db
      .from("cc_counselor_services")
      .select("id", { count: "exact", head: true })
      .eq("counselor_id", counselor.id)
      .eq("active", true),
  ]);
  const engagements = (engagementsRaw ?? []) as EngagementRow[];

  function bucket(group: keyof typeof STATUS_GROUPS) {
    const set = new Set(STATUS_GROUPS[group] as readonly string[]);
    return engagements.filter((e) => set.has(e.status));
  }
  const inbox = bucket("inbox");
  const active = bucket("active");
  const done = bucket("done");

  const earnings = engagements
    .filter((e) => e.status === "completed" && e.price_usd_paid)
    .reduce((sum, e) => sum + Number(e.price_usd_paid ?? 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-white truncate">
            {counselor.display_name}
          </h1>
          <Link
            href={`/counselors/${counselor.slug}`}
            className="text-[12px] text-white/55 hover:text-[#D4AF37]"
          >
            View public profile →
          </Link>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/counselor/services" className="px-3 py-2 rounded-md bg-[#141414] border border-white/[0.08] text-[12px] text-white/75 hover:bg-[#1a1a1a] inline-flex items-center gap-1.5">
            <ListChecks className="w-3.5 h-3.5" /> Services
          </Link>
          <Link href="/counselor/payouts" className="px-3 py-2 rounded-md bg-[#141414] border border-white/[0.08] text-[12px] text-white/75 hover:bg-[#1a1a1a] inline-flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" /> Payouts
          </Link>
        </div>
      </div>

      {!membership && <CreateWorkspaceCard displayName={counselor.display_name} />}

      {/* Top-line stats */}
      <div className="grid sm:grid-cols-4 gap-3 mb-8">
        <Stat label="Inbox" value={String(inbox.length)} icon={Briefcase} accent />
        <Stat label="Active" value={String(active.length)} icon={GraduationCap} />
        <Stat
          label="Sessions"
          value={String(counselor.total_sessions)}
          extra={counselor.average_rating !== null ? `★ ${counselor.average_rating.toFixed(1)}` : undefined}
          icon={Star}
        />
        <Stat label="Active services" value={String(serviceCount ?? 0)} icon={ListChecks} />
      </div>

      {/* Setup checklist — surfaces missing pieces */}
      {(serviceCount ?? 0) === 0 || !counselor.bio ? (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold text-amber-200 mb-2 inline-flex items-center gap-1.5">
            <Settings2 className="w-4 h-4" /> Finish setting up your profile
          </p>
          <ul className="text-[12.5px] text-white/65 space-y-1">
            {!counselor.bio && (
              <li>
                ·{" "}
                <Link href="/counselor/profile" className="text-[#D4AF37] underline">
                  Add a bio + headline
                </Link>{" "}
                so students know who they&apos;re hiring
              </li>
            )}
            {(serviceCount ?? 0) === 0 && (
              <li>
                ·{" "}
                <Link href="/counselor/services" className="text-[#D4AF37] underline">
                  Publish at least one service
                </Link>{" "}
                — without one, students can&apos;t book you
              </li>
            )}
            {!counselor.verified && (
              <li>
                ·{" "}
                <Link href="/counselor/admit-history" className="text-[#D4AF37] underline">
                  Get verified
                </Link>{" "}
                — add two admit-history entries and we&apos;ll review them
              </li>
            )}
          </ul>
        </div>
      ) : null}

      {/* 3-column engagement board */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Column title="Inbox" hint="Booked + waiting to start" items={inbox} role="counselor" />
        <Column title="Active" hint="Open work" items={active} role="counselor" />
        <Column title="Completed" hint="Recent + closed" items={done.slice(0, 10)} role="counselor" />
      </div>

      {earnings > 0 && (
        <p className="mt-6 text-[12px] text-white/45 text-right">
          Lifetime earnings (gross): <span className="text-[#D4AF37]">${earnings.toLocaleString()}</span>
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  accent,
  extra,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: boolean;
  extra?: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "border-[#D4AF37]/30 bg-[#D4AF37]/10" : "border-white/[0.08] bg-[#141414]"}`}>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.10em] text-white/40 font-medium mb-1.5">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <p className={`text-xl font-bold tabular-nums ${accent ? "text-[#D4AF37]" : "text-white"}`}>
        {value}{extra && <span className="text-[12px] text-white/55 font-normal ml-2">{extra}</span>}
      </p>
    </div>
  );
}

function Column({
  title,
  hint,
  items,
  role,
}: {
  title: string;
  hint: string;
  items: EngagementRow[];
  role: "counselor" | "student";
}) {
  void role; // reserved for student-side reuse later
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-4 min-h-[200px]">
      <div className="mb-3">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-[11px] text-white/45">{hint}</p>
      </div>
      {items.length === 0 ? (
        <p className="text-[12px] text-white/30 italic">Nothing here.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((e) => {
            const svc = Array.isArray(e.service) ? e.service[0] : e.service;
            const stu = Array.isArray(e.student) ? e.student[0] : e.student;
            return (
              <li key={e.id}>
                <Link
                  href={`/engagements/${e.id}`}
                  className="block rounded-xl border border-white/[0.08] bg-black/20 p-3 hover:border-[#D4AF37]/30 hover:bg-[#1a1a1a]"
                >
                  <p className="text-[12.5px] font-medium text-white truncate">
                    {svc?.title ?? "Untitled service"}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[10.5px] text-white/45">
                    <span>{stu?.preferred_name ?? "Student"}</span>
                    <span className="text-white/55">{STATUS_LABELS[e.status] ?? e.status}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
