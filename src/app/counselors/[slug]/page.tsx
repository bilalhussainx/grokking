// /counselors/[slug]
// Public counselor profile page — services list, reviews, admit history.
// Server-rendered for SEO + share-link previews. Phase 1 renders the
// scaffold; Phase 2 wires the booking buttons into Stripe checkout.

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  CheckCircle2,
  Star,
  Globe,
  Building2,
} from "lucide-react";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getCounselorBySlug } from "@/lib/cc/counselor-helpers";

interface ServiceRow {
  id: string;
  service_type: string;
  title: string;
  description: string | null;
  price_usd: number;
  turnaround_hours: number | null;
}

interface ProofRow {
  student_alias: string;
  graduation_year: number | null;
  school_name: string;
  decision: string;
  decision_type: string | null;
  scholarship_usd: number | null;
}

interface ReviewRow {
  student_rating: number;
  student_review_text: string | null;
  reviewed_at: string | null;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  essay_review_single: "Single essay review",
  essay_review_package: "Essay package",
  common_app_full: "Common App — full review",
  supplement_full_school: "Supplements — single school",
  interview_prep_session: "Interview prep session",
  application_audit: "Application audit",
  chancing_consultation: "Chancing consultation",
  activity_strategy_g10: "Activity strategy (Grade 10)",
  activity_strategy_g11: "Activity strategy (Grade 11)",
};

export default async function CounselorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const counselor = await getCounselorBySlug(slug);
  if (!counselor) notFound();

  const db = createAdminSupabase();
  const [{ data: services }, { data: proof }, { data: reviews }, { data: agency }] =
    await Promise.all([
      db
        .from("cc_counselor_services")
        .select("id, service_type, title, description, price_usd, turnaround_hours")
        .eq("counselor_id", counselor.id)
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      db
        .from("cc_counselor_admissions_proof")
        .select("student_alias, graduation_year, school_name, decision, decision_type, scholarship_usd")
        .eq("counselor_id", counselor.id)
        .eq("verified_by_admin", true)
        .order("graduation_year", { ascending: false })
        .limit(20),
      db
        .from("cc_counselor_engagements")
        .select("student_rating, student_review_text, reviewed_at")
        .eq("counselor_id", counselor.id)
        .not("student_rating", "is", null)
        .order("reviewed_at", { ascending: false })
        .limit(8),
      counselor.agency_id
        ? db
            .from("cc_agencies")
            .select("slug, name, verified, logo_url")
            .eq("id", counselor.agency_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  const serviceList = (services ?? []) as ServiceRow[];
  const proofList = (proof ?? []) as ProofRow[];
  const reviewList = (reviews ?? []) as ReviewRow[];
  const admitCount = proofList.filter((p) => p.decision === "admitted").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30">
          <GraduationCap className="w-7 h-7 text-[#D4AF37]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{counselor.display_name}</h1>
            {counselor.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          {counselor.headline && (
            <p className="text-sm text-white/70 mt-1">{counselor.headline}</p>
          )}
          {agency && (
            <Link
              href={`/agencies/${agency.slug}`}
              className="inline-flex items-center gap-1.5 mt-2 text-[12px] text-white/50 hover:text-[#D4AF37] transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" /> {agency.name}
              {agency.verified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            </Link>
          )}
          <div className="flex items-center gap-4 mt-3 text-[12px] text-white/50">
            {counselor.average_rating !== null && (
              <span className="inline-flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                {counselor.average_rating.toFixed(1)} ({counselor.total_reviews} review{counselor.total_reviews === 1 ? "" : "s"})
              </span>
            )}
            <span>{counselor.total_sessions} sessions</span>
            {counselor.years_experience && <span>{counselor.years_experience}y experience</span>}
            {counselor.languages.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> {counselor.languages.join(" · ")}
              </span>
            )}
          </div>
        </div>
      </div>

      {counselor.bio && (
        <p className="text-[14px] text-white/75 leading-relaxed mb-8">{counselor.bio}</p>
      )}

      {/* Services */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-white/85 uppercase tracking-wider mb-3">
          Services
        </h2>
        {serviceList.length === 0 ? (
          <p className="text-[13px] text-white/40 italic">
            This counselor hasn&apos;t published a service catalog yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {serviceList.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col"
              >
                <p className="text-[10.5px] uppercase tracking-wider text-white/45 mb-1">
                  {SERVICE_TYPE_LABELS[s.service_type] ?? s.service_type}
                </p>
                <p className="text-sm font-semibold text-white mb-1.5">{s.title}</p>
                {s.description && (
                  <p className="text-[12.5px] text-white/55 leading-relaxed mb-3 flex-1">
                    {s.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                  <span className="text-base font-semibold text-[#D4AF37]">
                    ${Number(s.price_usd).toLocaleString()}
                  </span>
                  {s.turnaround_hours && (
                    <span className="text-[11px] text-white/45">
                      {s.turnaround_hours}h turnaround
                    </span>
                  )}
                </div>
                {/* Phase 2: <BookButton serviceId={s.id} /> goes here. */}
                <button
                  type="button"
                  disabled
                  className="mt-3 w-full px-3 py-2 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[12px] font-medium opacity-60 cursor-not-allowed"
                  title="Booking unlocks in Phase 2 — Stripe Connect onboarding required"
                >
                  Book — coming soon
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Admit history */}
      {proofList.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-white/85 uppercase tracking-wider mb-3">
            Verified admit history{" "}
            <span className="text-white/40 font-normal">
              ({admitCount} admits)
            </span>
          </h2>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] divide-y divide-white/5">
            {proofList.map((p, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
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
                    {p.scholarship_usd && (
                      <> · ${p.scholarship_usd.toLocaleString()} scholarship</>
                    )}
                  </p>
                </div>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                    p.decision === "admitted"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : p.decision === "waitlisted"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {p.decision}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviewList.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-white/85 uppercase tracking-wider mb-3">
            Recent reviews
          </h2>
          <div className="space-y-3">
            {reviewList.map((r, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < r.student_rating
                          ? "text-[#D4AF37] fill-[#D4AF37]"
                          : "text-white/15"
                      }`}
                    />
                  ))}
                </div>
                {r.student_review_text && (
                  <p className="text-[13px] text-white/70 leading-relaxed">
                    {r.student_review_text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
