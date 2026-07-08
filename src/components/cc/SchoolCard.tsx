"use client";

import Link from "next/link";
import { MapPin, Clock, DollarSign, GraduationCap, ChevronRight, Building2 } from "lucide-react";
import { ChanceBadge, tierFromBand } from "./ChanceBadge";

interface School {
  id: string;
  name: string;
  city: string;
  state: string;
  country?: string | null;
  province?: string | null;
  school_type: string;
  acceptance_rate: number;
  avg_net_price: number;
  test_policy: string;
  regular_deadline: string;
  early_deadline: string | null;
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  UK: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  NL: "Netherlands",
  DE: "Germany",
  IE: "Ireland",
  SG: "Singapore",
  HK: "Hong Kong",
  JP: "Japan",
  AE: "UAE",
};

// "City, ST" for US schools, "City, Country" internationally. Never renders
// a dangling comma when parts are missing (the old template produced "📍 , "
// for schools with no city/state).
function formatLocation(s: School): string {
  const isUS = !s.country || s.country === "US";
  const region = isUS ? s.state : s.province || COUNTRY_NAMES[s.country ?? ""] || s.country;
  const parts = [s.city, region].filter(Boolean);
  if (!isUS && s.province) {
    const countryName = COUNTRY_NAMES[s.country ?? ""] || s.country;
    if (countryName) parts.push(countryName);
  }
  return parts.join(", ") || (COUNTRY_NAMES[s.country ?? ""] ?? "Location unlisted");
}

interface Props {
  school: School;
  onAdd?: (schoolId: string) => void;
  onRemove?: (id: string) => void;
  onPlanChange?: (listEntryId: string, plan: string | null) => void;
  listEntryId?: string;
  chancingBand?: string;
  applicationPlan?: string | null;
  showAddButton?: boolean;
  added?: boolean;
  aidWarning?: "need-aware";
}

const PLAN_OPTIONS: { value: string; label: string; early?: boolean }[] = [
  { value: "ED", label: "ED", early: true },
  { value: "EA", label: "EA", early: true },
  { value: "REA", label: "REA", early: true },
  { value: "RD", label: "RD" },
  { value: "rolling", label: "Rolling" },
];

export default function SchoolCard({ school, onAdd, onRemove, onPlanChange, listEntryId, chancingBand, applicationPlan, showAddButton, added, aidWarning }: Props) {
  const acceptPct = Math.round((school.acceptance_rate || 0) * 100);
  const chanceTier = tierFromBand(chancingBand);

  return (
    <div>
      <div className="kl-school-row">
        {/* Icon */}
        <div
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))",
            border: "1px solid rgba(212,175,55,0.18)",
          }}
          aria-hidden
        >
          <Building2 className="w-4 h-4 text-[var(--kl-gold-app,#D4AF37)]" />
        </div>

        {/* Name + meta */}
        <Link href={`/schools/${school.id}`} className="min-w-0 flex-1 group">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-semibold text-white truncate group-hover:text-[#D4AF37] transition-colors">
              {school.name}
            </h3>
            <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-white/50">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" aria-hidden />
              {formatLocation(school)}
            </span>
            <span className="capitalize">{school.school_type}</span>
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3" aria-hidden />
              {acceptPct}% accept
            </span>
            {/* avg_net_price is a US IPEDS statistic — showing "$0 net" for
                international schools (or any school missing the datum) reads
                as "free", which is wrong. Only render when we have a value. */}
            {school.avg_net_price > 0 && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" aria-hidden />
                ${school.avg_net_price.toLocaleString()} net
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" aria-hidden />
              {school.regular_deadline}
            </span>
            <span className="capitalize">Test {school.test_policy}</span>
          </div>
        </Link>

        {/* Right cluster: badges + actions */}
        <div className="shrink-0 flex items-center gap-2">
          {aidWarning === "need-aware" && (
            <span
              title="This school is need-aware for your status — applying will factor aid need into admission"
              className="px-2 py-0.5 rounded-full text-[10px] font-medium border bg-amber-500/15 text-amber-400 border-amber-500/30"
            >
              Need-aware intl
            </span>
          )}
          {chancingBand && <ChanceBadge tier={chanceTier} />}
          {showAddButton && onAdd && (
            <button
              onClick={() => onAdd(school.id)}
              disabled={added}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                added
                  ? "bg-white/5 text-white/30 cursor-default"
                  : "bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20"
              }`}
            >
              {added ? "Added" : "+ Add"}
            </button>
          )}
          {onRemove && listEntryId && (
            <button
              onClick={() => onRemove(listEntryId)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {onPlanChange && listEntryId && (
        <div className="mt-2 ml-12 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-white/30">Applying as</span>
          <div className="flex flex-wrap gap-1">
            {PLAN_OPTIONS.map((opt) => {
              const active = applicationPlan === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onPlanChange(listEntryId, active ? null : opt.value)}
                  className={`kl-chip${active ? " is-active" : ""}`}
                  style={{ padding: "2px 10px", fontSize: 10 }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
