// /counselor/admit-history — counselor-side view of their submitted
// admit-history rows in cc_counselor_admissions_proof. Each row is a
// past student outcome (anonymized alias + school + decision). Verified
// rows surface on the public profile and bump the agency's verified
// admit count; unverified rows wait in admin review.
//
// Phase 1 scaffold: read-only list of existing rows + placeholder for
// the submission form. The admin verification queue + the new-row form
// land in Phase 4 (along with the chancing report engine).

import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Construction,
  Building2,
  ArrowRight,
} from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getCounselorForUser } from "@/lib/cc/counselor-helpers";

interface ProofRow {
  id: string;
  student_alias: string;
  graduation_year: number | null;
  school_name: string;
  decision: string;
  decision_type: string | null;
  scholarship_usd: number | null;
  verified_by_admin: boolean;
  created_at: string;
}

export default async function AdmitHistoryPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const counselor = await getCounselorForUser(user.id);
  if (!counselor) redirect("/counselor/onboard");

  const db = createAdminSupabase();
  const { data: proofsRaw } = await db
    .from("cc_counselor_admissions_proof")
    .select("id, student_alias, graduation_year, school_name, decision, decision_type, scholarship_usd, verified_by_admin, created_at")
    .eq("counselor_id", counselor.id)
    .order("graduation_year", { ascending: false })
    .order("created_at", { ascending: false });
  const proofs = (proofsRaw ?? []) as ProofRow[];

  const verified = proofs.filter((p) => p.verified_by_admin);
  const pending = proofs.filter((p) => !p.verified_by_admin);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-6 h-6 text-[#D4AF37]" />
        <h1 className="text-xl font-bold text-white">Admit history</h1>
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 mb-5 flex items-start gap-3">
        <Construction className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white mb-1">
            Self-serve submission — Phase 4
          </p>
          <p className="text-[12.5px] text-white/65 leading-relaxed">
            The form for submitting a past admit (anonymized alias + school +
            decision + evidence link) lands with the chancing-engine work in
            Phase 4. Until then, send admit records to{" "}
            <strong className="text-white/85">support@kairoslearn.com</strong>
            {" "}for manual entry. Verified admits surface on your public
            profile and bump your agency&apos;s admit count.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <Stat label="Verified" value={String(verified.length)} accent />
        <Stat label="Pending review" value={String(pending.length)} />
      </div>

      <Section
        title="Verified"
        empty="No verified admits yet."
        rows={verified}
        verified
      />
      <Section
        title="Pending review"
        empty="Nothing pending. Submit admits via support email for now."
        rows={pending}
      />

      <div className="mt-6">
        <Link
          href="/counselor/dashboard"
          className="inline-flex items-center gap-1 text-[12px] text-white/55 hover:text-[#D4AF37]"
        >
          <ArrowRight className="w-3 h-3 rotate-180" /> Back to dashboard
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-white/[0.02]"}`}>
      <p className="text-[10.5px] uppercase tracking-wider text-white/55 mb-1">{label}</p>
      <p className={`text-xl font-bold ${accent ? "text-emerald-300" : "text-white"}`}>{value}</p>
    </div>
  );
}

function Section({
  title,
  rows,
  empty,
  verified,
}: {
  title: string;
  rows: ProofRow[];
  empty: string;
  verified?: boolean;
}) {
  return (
    <section className="mb-6">
      <p className="text-[11px] uppercase tracking-wider text-white/55 mb-2">{title}</p>
      {rows.length === 0 ? (
        <p className="text-[12.5px] text-white/40 italic">{empty}</p>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] divide-y divide-white/5">
          {rows.map((p) => (
            <div key={p.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] text-white">
                  <span className="font-medium">{p.school_name}</span>
                  {p.decision_type && (
                    <span className="ml-2 text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/5 text-white/55 border border-white/10">
                      {p.decision_type}
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-white/45 mt-0.5">
                  {p.student_alias}
                  {p.graduation_year && <> · Class of {p.graduation_year}</>}
                  {p.scholarship_usd && <> · ${p.scholarship_usd.toLocaleString()} scholarship</>}
                </p>
              </div>
              <span
                className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                  verified
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                }`}
              >
                {verified ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                {verified ? p.decision : "pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
