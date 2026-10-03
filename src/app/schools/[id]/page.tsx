"use client";

import { useCallback, useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Users,
  GraduationCap,
  DollarSign,
  Globe,
  Sparkles,
  FileText,
  Info,
  ChevronRight,
  Loader2,
  ExternalLink,
  Unlock,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import { Tabs, type TabOption } from "@/components/cc/Tabs";
import { applicationSystemFor, applicationSystemLabel, UCAS_DATES_URL } from "@/lib/applications/system";

interface SchoolDetail {
  id: string;
  name: string;
  common_name: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  province?: string | null;
  application_platform?: string | null;
  regular_deadline?: string | null;
  website?: string | null;
  institution_type: string | null;
  enrollment_undergrad: number | null;
  acceptance_rate: number | null;
  sat_25: number | null;
  sat_75: number | null;
  act_25: number | null;
  act_75: number | null;
  avg_hs_gpa: number | null;
  cost_of_attendance: number | null;
  avg_net_price: number | null;
  meets_full_need: boolean | null;
  no_loan_institution: boolean | null;
  first_gen_pct: number | null;
  pell_pct: number | null;
  application_platforms: string[] | null;
  mission_statement: string | null;
  notable_departments: string[] | null;
  financial_aid_summary: string | null;
  scholarships_summary: string | null;
  loan_options: { federal?: string; state?: string; school?: string; international?: string } | null;
  international_aid_summary: string | null;
  website_url: string | null;
  graduation_rate_6y: number | null;
  alumni_interview_program: boolean | null;
  need_blind_international: boolean | null;
  meets_full_need_international: boolean | null;
  pct_international_students_receiving_aid: number | null;
  avg_aid_package_international: number | null;
  css_profile_required: boolean | null;
  fafsa_required_international: boolean | null;
  international_aid_notes: string | null;
  aid_policy_verified_date: string | null;
}

interface Supplement {
  id: string;
  prompt_text: string;
  word_limit: number | null;
  is_required: boolean | null;
  supplement_type: string | null;
  category: string | null;
  academic_year: string | null;
  source_url: string | null;
}

type Tab = "overview" | "aid" | "supplements";

export default function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [school, setSchool] = useState<SchoolDetail | null>(null);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [launchingId, setLaunchingId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [schoolRes, supRes] = await Promise.all([
        fetch(`/api/cc/schools/${id}`),
        fetch(`/api/cc/schools/${id}/supplements`),
      ]);
      if (!schoolRes.ok) {
        setErr("School not found");
        return;
      }
      const schoolData = await schoolRes.json();
      const supData = supRes.ok ? await supRes.json() : { supplements: [] };
      setSchool(schoolData.school);
      setSupplements(supData.supplements || []);
    } catch {
      setErr("Failed to load");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const launchSupplement = async (supplementId: string) => {
    setLaunchingId(supplementId);
    try {
      const res = await fetch("/api/cc/essays/from-supplement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplement_id: supplementId }),
      });
      const data = await res.json();
      if (res.ok && data.essay_id) {
        router.push(`/cc/essays/${data.essay_id}`);
      } else {
        setErr(data.error || "Could not start supplement essay");
        setLaunchingId(null);
      }
    } catch {
      setErr("Network error");
      setLaunchingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  if (err || !school) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-white/40">{err || "School not found"}</p>
        <Link href="/schools" className="text-[#D4AF37] text-sm mt-2 inline-block">
          Back to schools
        </Link>
      </div>
    );
  }

  const acceptPct = school.acceptance_rate ? Math.round(school.acceptance_rate * 100) : null;
  const gradPct = school.graduation_rate_6y ? Math.round(school.graduation_rate_6y * 100) : null;
  const pellPct = school.pell_pct ? Math.round(school.pell_pct * 100) : null;
  const firstGenPct = school.first_gen_pct ? Math.round(school.first_gen_pct * 100) : null;
  // Pell grants + CSS Profile are US instruments; framing a UK/CA/AU school
  // with them is factually wrong (Oxford was showing "CSS Profile required
  // for intl aid"). Everything US-specific below is gated on this.
  const isUS = !school.country || school.country === "US";
  const COUNTRY_NAMES: Record<string, string> = {
    GB: "United Kingdom", UK: "United Kingdom", CA: "Canada", AU: "Australia",
    NL: "Netherlands", DE: "Germany", IE: "Ireland", SG: "Singapore",
    HK: "Hong Kong", JP: "Japan", AE: "UAE",
  };
  const countryLabel = !isUS ? COUNTRY_NAMES[school.country ?? ""] ?? school.country : null;
  const systemLabel = applicationSystemLabel(school);
  const isUCAS = applicationSystemFor(school) === "UCAS";
  const websiteUrl = school.website_url || school.website || null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link
        href="/schools"
        className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to schools
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{school.name}</h1>
        <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
          {(school.city || school.state || countryLabel) && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {[school.city, isUS ? school.state : school.province, countryLabel].filter(Boolean).join(", ")}
            </span>
          )}
          {school.institution_type && (
            <span className="capitalize">{school.institution_type}</span>
          )}
          {systemLabel && <span>{systemLabel}</span>}
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#D4AF37]/80 hover:text-[#D4AF37]"
            >
              <Globe className="w-3 h-3" />
              Website
            </a>
          )}
        </div>
      </div>

      {(school.need_blind_international || school.meets_full_need_international || school.css_profile_required) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {school.need_blind_international && (
            <span
              title="Need-blind for international students — citizenship does not affect admission odds"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-green-500/15 border border-green-500/30 text-green-300 font-medium"
            >
              <Unlock className="w-3 h-3" /> Need-blind intl
            </span>
          )}
          {school.meets_full_need_international && !school.need_blind_international && (
            <span
              title="Meets 100% of demonstrated need for admitted international students, but is need-aware in admissions"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 font-medium"
            >
              <AlertTriangle className="w-3 h-3" /> Need-aware · full need
            </span>
          )}
          {school.css_profile_required && isUS && (
            <Link
              href="/profile/css-guide"
              title="CSS Profile required for international aid — click to open our step-by-step guide"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-white/5 hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/30 text-white/60 hover:text-[#D4AF37] font-medium transition-colors"
            >
              <ClipboardList className="w-3 h-3" /> CSS Profile guide
            </Link>
          )}
        </div>
      )}

      <Tabs
        className="mb-6 w-full"
        ariaLabel="School detail sections"
        active={tab}
        onChange={setTab}
        options={[
          { value: "overview" as Tab, label: "Overview", icon: Info },
          { value: "aid" as Tab, label: "Aid & Loans", icon: DollarSign },
          {
            value: "supplements" as Tab,
            label: `Supplements${supplements.length ? ` (${supplements.length})` : ""}`,
            icon: FileText,
          },
        ] satisfies TabOption<Tab>[]}
      />

      {tab === "overview" && (
        <div className="space-y-4">
          {!isUS && (
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white/70 leading-relaxed">
              <p className="text-white font-medium">How to apply</p>
              {school.regular_deadline ? (
                <p className="mt-1">Deadline: {school.regular_deadline}</p>
              ) : isUCAS ? (
                <p className="mt-1">
                  Apply through UCAS:{" "}
                  <a
                    href={UCAS_DATES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF37]/80 hover:text-[#D4AF37] underline"
                  >
                    see the UCAS deadline
                  </a>
                </p>
              ) : (
                <p className="mt-1">Check the university&apos;s admissions page for this cycle&apos;s deadline.</p>
              )}
            </div>
          )}
          {isUS && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={GraduationCap} label="Acceptance rate" value={acceptPct != null ? `${acceptPct}%` : "—"} />
            <StatCard icon={Users} label="Undergrads" value={school.enrollment_undergrad?.toLocaleString() || "—"} />
            <StatCard
              icon={GraduationCap}
              label="Test scores (mid-50%)"
              value={
                school.sat_25 && school.sat_75
                  ? `SAT ${school.sat_25}-${school.sat_75}`
                  : school.act_25 && school.act_75
                  ? `ACT ${school.act_25}-${school.act_75}`
                  : "—"
              }
            />
            <StatCard icon={GraduationCap} label="Avg HS GPA" value={school.avg_hs_gpa?.toFixed(2) || "—"} />
            <StatCard icon={GraduationCap} label="6-yr grad rate" value={gradPct != null ? `${gradPct}%` : "—"} />
            {isUS && (
              <StatCard
                icon={Users}
                label="Pell / first-gen"
                value={
                  pellPct != null || firstGenPct != null
                    ? `${pellPct ?? "—"}% / ${firstGenPct ?? "—"}%`
                    : "—"
                }
              />
            )}
          </div>
          )}

          {school.mission_statement && (
            <Section title="Mission">
              <p>{school.mission_statement}</p>
            </Section>
          )}

          {school.notable_departments && school.notable_departments.length > 0 && (
            <Section title="Notable departments">
              <div className="flex flex-wrap gap-1.5">
                {school.notable_departments.map((dept) => (
                  <span
                    key={dept}
                    className="px-2 py-0.5 rounded-md text-[11px] bg-white/5 border border-white/10 text-white/70"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {school.application_platforms && school.application_platforms.length > 0 && (
            <Section title="Application platforms">
              <p>{school.application_platforms.join(", ")}</p>
            </Section>
          )}
        </div>
      )}

      {tab === "aid" && (
        <div className="space-y-4">
          {school.need_blind_international && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Unlock className="w-4 h-4 text-green-300 shrink-0" />
                <span className="text-green-300 font-semibold text-sm">
                  Need-Blind for International Students
                </span>
              </div>
              <p className="text-green-200/90 text-xs leading-relaxed">
                This school does not consider your ability to pay when making admission decisions. If admitted, they will meet 100% of your demonstrated financial need.
              </p>
              {school.pct_international_students_receiving_aid != null && (
                <p className="text-green-200 text-xs mt-2 font-medium">
                  {Math.round(school.pct_international_students_receiving_aid)}% of international students at this school receive financial aid.
                </p>
              )}
            </div>
          )}

          {school.meets_full_need_international && !school.need_blind_international && (
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-300 shrink-0" />
                <span className="text-yellow-300 font-semibold text-sm">
                  Need-Aware, Meets Full Need
                </span>
              </div>
              <p className="text-yellow-200/90 text-xs leading-relaxed">
                This school meets 100% of your financial need if admitted, but your application may be less competitive if you need significant aid. Apply strategically.
              </p>
            </div>
          )}

          {(school.pct_international_students_receiving_aid != null || school.avg_aid_package_international != null) && (
            <div className="grid grid-cols-2 gap-3">
              {school.pct_international_students_receiving_aid != null && (
                <StatCard
                  icon={Users}
                  label="Intl students w/ aid"
                  value={`${Math.round(school.pct_international_students_receiving_aid)}%`}
                />
              )}
              {school.avg_aid_package_international != null && (
                <StatCard
                  icon={DollarSign}
                  label="Avg intl aid package"
                  value={`$${school.avg_aid_package_international.toLocaleString()}`}
                />
              )}
              {school.avg_aid_package_international != null && school.cost_of_attendance && (
                <StatCard
                  icon={DollarSign}
                  label="Net cost (intl)"
                  value={`$${Math.max(0, school.cost_of_attendance - school.avg_aid_package_international).toLocaleString()}`}
                />
              )}
            </div>
          )}

          {!isUS && (
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white/70 leading-relaxed">
              {countryLabel === "United Kingdom"
                ? "UK universities don't use the CSS Profile or FAFSA. Aid for international students is limited — look into university scholarships (e.g. Reach Oxford, Clarendon), external awards, and check UCAS for course fees. Applications go through UCAS with the personal statement."
                : `Aid at universities in ${countryLabel ?? "this country"} doesn't run on US instruments (CSS Profile / FAFSA). Check the university's international scholarships page and national aid schemes.`}
            </div>
          )}

          {isUS && (school.css_profile_required || school.fafsa_required_international) && (
            <div className="flex flex-wrap gap-1.5">
              {school.css_profile_required && (
                <Link
                  href="/profile/css-guide"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-white/5 hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/30 text-white/60 hover:text-[#D4AF37] transition-colors"
                >
                  <ClipboardList className="w-3 h-3" /> CSS Profile required for intl aid →
                </Link>
              )}
              {school.fafsa_required_international && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-white/5 border border-white/10 text-white/60">
                  <ClipboardList className="w-3 h-3" /> FAFSA required
                </span>
              )}
            </div>
          )}

          {school.international_aid_notes && (
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white/70 leading-relaxed">
              {school.international_aid_notes}
            </div>
          )}

          {school.aid_policy_verified_date && (
            <p className="text-[10px] text-white/30 text-right">
              Policy verified: {school.aid_policy_verified_date}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={DollarSign}
              label="Avg net price"
              value={school.avg_net_price ? `$${school.avg_net_price.toLocaleString()}` : "—"}
            />
            <StatCard
              icon={DollarSign}
              label="Cost of attendance"
              value={school.cost_of_attendance ? `$${school.cost_of_attendance.toLocaleString()}` : "—"}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {school.meets_full_need && (
              <span className="px-2 py-0.5 rounded-md text-[11px] bg-green-500/10 border border-green-500/30 text-green-300">
                Meets full demonstrated need
              </span>
            )}
            {school.no_loan_institution && (
              <span className="px-2 py-0.5 rounded-md text-[11px] bg-green-500/10 border border-green-500/30 text-green-300">
                No-loan institution
              </span>
            )}
          </div>

          {school.financial_aid_summary && (
            <Section title="Financial aid overview">
              <p>{school.financial_aid_summary}</p>
            </Section>
          )}

          {school.scholarships_summary && (
            <Section title="Scholarships">
              <p>{school.scholarships_summary}</p>
            </Section>
          )}

          {school.international_aid_summary && (
            <Section title="International student aid">
              <p>{school.international_aid_summary}</p>
            </Section>
          )}

          {school.loan_options && (
            <Section title="Loan options">
              <div className="space-y-1.5">
                {school.loan_options.federal && (
                  <p><span className="text-white/40">Federal: </span>{school.loan_options.federal}</p>
                )}
                {school.loan_options.state && (
                  <p><span className="text-white/40">State: </span>{school.loan_options.state}</p>
                )}
                {school.loan_options.school && (
                  <p><span className="text-white/40">School: </span>{school.loan_options.school}</p>
                )}
                {school.loan_options.international && (
                  <p><span className="text-white/40">International: </span>{school.loan_options.international}</p>
                )}
              </div>
            </Section>
          )}

          {!school.financial_aid_summary &&
            !school.scholarships_summary &&
            !school.loan_options &&
            !school.international_aid_summary && (
              <p className="text-xs text-white/30 py-6 text-center">
                Detailed aid information not yet available for this school.
              </p>
            )}
        </div>
      )}

      {tab === "supplements" && (
        <div className="space-y-3">
          {supplements.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-xs text-white/40">
                No supplement prompts loaded yet for this school.
              </p>
              <p className="text-[11px] text-white/25 mt-1">
                Check the school&rsquo;s application portal for the latest prompts.
              </p>
            </div>
          ) : (
            supplements.map((sup) => {
              const isPlaceholder = sup.academic_year === "2025-2026";
              return (
                <div
                  key={sup.id}
                  className="p-4 rounded-xl border border-white/10 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {sup.category && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-[#D4AF37]/15 text-[#D4AF37] uppercase tracking-wide">
                            {sup.category}
                          </span>
                        )}
                        {sup.is_required && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-red-500/10 text-red-300 border border-red-500/30">
                            Required
                          </span>
                        )}
                        {sup.word_limit && (
                          <span className="text-[10px] text-white/40">{sup.word_limit} words</span>
                        )}
                        {sup.academic_year && (
                          <span className="text-[10px] text-white/30">{sup.academic_year}</span>
                        )}
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">{sup.prompt_text}</p>
                      {isPlaceholder && (
                        <div className="mt-2 flex items-center gap-1.5">
                          {sup.source_url ? (
                            <a
                              href={sup.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              Verify on school site
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-300">
                              Verify current-year prompt on school site
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => launchSupplement(sup.id)}
                      disabled={launchingId === sup.id}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all disabled:opacity-60 bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37]/25"
                    >
                      {launchingId === sup.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Start</span>
                          <ChevronRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Info;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-white/40 mb-1">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
      <h3 className="text-[11px] uppercase tracking-wide text-[#D4AF37] font-semibold mb-2">
        {title}
      </h3>
      <div className="text-xs text-white/70 leading-relaxed space-y-1.5">{children}</div>
    </div>
  );
}
