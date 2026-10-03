// /agencies/[slug]
// Public agency landing page — agency description, counselor roster, and the
// agency's overall verified admit count (rolled up from cc_counselor_admissions_proof).
// Server-rendered.

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getAgencyBySlug, listPublicAgencyCounselors } from "@/lib/cc/counselor-helpers";

export default async function AgencyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);
  if (!agency) notFound();

  const db = createAdminSupabase();
  const [counselorList, { count: verifiedAdmits }] = await Promise.all([
    listPublicAgencyCounselors(agency.id),
    db
      .from("cc_counselor_admissions_proof")
      .select("id", { count: "exact", head: true })
      .eq("agency_id", agency.id)
      .eq("decision", "admitted")
      .eq("verified_by_admin", true),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-start gap-4 mb-6">
        <div className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30">
          <Building2 className="w-7 h-7 text-[#D4AF37]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{agency.name}</h1>
            {agency.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Verified agency
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-[12px] text-white/55">
            {agency.country && <span>{agency.country}</span>}
            {agency.founded_year && <span>Founded {agency.founded_year}</span>}
            {(verifiedAdmits ?? 0) > 0 && (
              <span className="text-emerald-300">
                {verifiedAdmits} verified admit{(verifiedAdmits ?? 0) === 1 ? "" : "s"}
              </span>
            )}
            {agency.website_url && (
              <a
                href={agency.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#D4AF37] transition-colors"
              >
                Website <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {agency.description && (
        <p className="text-[14px] text-white/75 leading-relaxed mb-8">
          {agency.description}
        </p>
      )}

      {/* Counselor roster */}
      <section>
        <h2 className="text-sm font-semibold text-white/85 uppercase tracking-wider mb-3">
          Counselors at {agency.name}
        </h2>
        {counselorList.length === 0 ? (
          <p className="text-[13px] text-white/40 italic">
            No counselors listed yet for this agency.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {counselorList.map((c) => (
              <Link
                key={c.slug}
                href={`/counselors/${c.slug}`}
                className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-[#D4AF37]/30 hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm font-medium text-white truncate">
                    {c.display_name}
                  </span>
                  {c.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>
                {c.headline && (
                  <p className="text-[12px] text-white/55 line-clamp-2 mb-2 leading-relaxed">
                    {c.headline}
                  </p>
                )}
                <div className="text-[11px] text-white/45">
                  {c.average_rating !== null && (
                    <>★ {c.average_rating.toFixed(1)} · </>
                  )}
                  {c.total_sessions} sessions
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
