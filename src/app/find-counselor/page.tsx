"use client";

// /find-counselor — student-side discovery.
//
// Search by name fragment, target school (filters to counselors with verified
// admit history at that school), service type, and language. Mirrors the
// recommender-search UX so it's familiar to anyone who's already used the
// recommender flow.

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  GraduationCap,
  Star,
  CheckCircle2,
  Building2,
  Globe,
  Loader2,
} from "lucide-react";

interface CounselorResult {
  id: string;
  slug: string;
  display_name: string;
  headline: string | null;
  photo_url: string | null;
  verified: boolean;
  total_sessions: number;
  average_rating: number | null;
  total_reviews: number;
  hourly_rate_usd: number | null;
  languages: string[];
  specialties: string[];
  agency_name: string | null;
  agency_slug: string | null;
  agency_verified: boolean;
  matched_school_admits: number;
}

const SERVICE_OPTIONS = [
  { value: "", label: "Any service" },
  { value: "essay_review_single", label: "Single essay review" },
  { value: "essay_review_package", label: "Essay package" },
  { value: "common_app_full", label: "Common App — full" },
  { value: "supplement_full_school", label: "Supplements (single school)" },
  { value: "interview_prep_session", label: "Interview prep" },
  { value: "application_audit", label: "Application audit" },
  { value: "chancing_consultation", label: "Chancing consultation" },
  { value: "activity_strategy_g10", label: "Activity strategy — Grade 10" },
  { value: "activity_strategy_g11", label: "Activity strategy — Grade 11" },
];

const LANGUAGE_OPTIONS = [
  { value: "", label: "Any language" },
  { value: "en", label: "English" },
  { value: "ur", label: "Urdu" },
  { value: "hi", label: "Hindi" },
  { value: "pa", label: "Punjabi" },
  { value: "es", label: "Spanish" },
  { value: "zh", label: "Mandarin" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
];

export default function FindCounselorPage() {
  const [q, setQ] = useState("");
  const [school, setSchool] = useState("");
  const [service, setService] = useState("");
  const [language, setLanguage] = useState("");
  const [results, setResults] = useState<CounselorResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (school.trim()) params.set("school", school.trim());
    if (service) params.set("service", service);
    if (language) params.set("languages", language);

    const res = await fetch(`/api/counselor/search?${params.toString()}`);
    if (res.ok) {
      const data = (await res.json()) as { counselors: CounselorResult[] };
      setResults(data.counselors);
    }
    setLoading(false);
  }, [q, school, service, language]);

  // Initial load — show all accepting counselors.
  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-3">
        <GraduationCap className="w-7 h-7 text-[#D4AF37]" />
        <h1 className="text-xl font-bold text-white">Find a counselor</h1>
      </div>
      <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-2xl">
        Browse independent counselors and counseling agencies for paid essay
        reviews, full-application support, supplement packages, interview prep,
        and chancing consultations. Search by school target to find counselors
        with a verified admit history at the schools you&apos;re applying to.
      </p>

      {/* Search form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-white/10 bg-white/[0.02] p-4 mb-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Counselor name…"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
        <input
          type="text"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="Target school (e.g. Stanford)"
          className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
        />
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
        >
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="lg:col-span-3 px-4 py-2.5 rounded-lg bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Search
        </button>
      </form>

      {/* Results */}
      {loading && results.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
        </div>
      ) : results.length === 0 ? (
        <p className="text-[13px] text-white/45 italic text-center py-12 border border-white/10 rounded-xl">
          No counselors match your filters. Try widening the search.
        </p>
      ) : (
        <div className="space-y-3">
          {results.map((c) => (
            <Link
              key={c.id}
              href={`/counselors/${c.slug}`}
              className="block rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-[#D4AF37]/30 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30">
                  <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-white">
                      {c.display_name}
                    </span>
                    {c.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    {c.agency_name && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-white/45">
                        <Building2 className="w-3 h-3" /> {c.agency_name}
                        {c.agency_verified && (
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        )}
                      </span>
                    )}
                  </div>
                  {c.headline && (
                    <p className="text-[12.5px] text-white/65 leading-relaxed line-clamp-2 mb-2">
                      {c.headline}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-[11px] text-white/45 flex-wrap">
                    {c.average_rating !== null && (
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                        {c.average_rating.toFixed(1)} ({c.total_reviews})
                      </span>
                    )}
                    <span>{c.total_sessions} sessions</span>
                    {c.languages.length > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {c.languages.join(" · ")}
                      </span>
                    )}
                    {c.matched_school_admits > 0 && school && (
                      <span className="text-emerald-300">
                        {c.matched_school_admits} verified admit{c.matched_school_admits === 1 ? "" : "s"} to {school}
                      </span>
                    )}
                    {c.hourly_rate_usd && (
                      <span className="text-[#D4AF37]">
                        ${Number(c.hourly_rate_usd).toLocaleString()}/hr
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
