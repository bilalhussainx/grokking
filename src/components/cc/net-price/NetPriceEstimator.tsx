"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, TriangleAlert, ArrowRight, Languages } from "lucide-react";
import Link from "next/link";

type AidRiskFlag = "none" | "need_aware_admission_risk" | "limited_intl_aid";

type Estimate = {
  schoolName: string;
  ipeds: number;
  stickerPrice: number;
  estimatedFamilyContribution: number;
  estimatedGrantAid: number;
  estimatedNetPrice: number;
  confidence: number;
  aidRiskFlag: AidRiskFlag;
  notes: string[];
};

type Inputs = {
  isInternational: boolean;
  isTransfer: boolean;
  isFirstGen: boolean;
  affordabilityValue: string | null;
  hasIncomeBracket: boolean;
};

type Response = {
  inputs: Inputs;
  estimates: Estimate[];
  uncovered: string[];
  catalogSize: number;
  generatedAt: string;
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function ConfidenceDot({ confidence }: { confidence: number }) {
  const level =
    confidence >= 0.85 ? "high" : confidence >= 0.65 ? "mid" : "low";
  const color =
    level === "high" ? "#5ECB80" : level === "mid" ? "#D4AF37" : "#F2A07B";
  const label =
    level === "high" ? "High confidence" : level === "mid" ? "Medium confidence" : "Low — add more profile data";
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/55 font-mono">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} aria-hidden />
      {label}
    </span>
  );
}

function FlagBadge({ flag }: { flag: AidRiskFlag }) {
  if (flag === "none") return null;
  const text =
    flag === "need_aware_admission_risk"
      ? "Need-aware — aid request can reduce admit odds"
      : "Limited intl aid — typical award shown";
  return (
    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-200 border border-amber-500/30">
      <TriangleAlert className="w-3 h-3" aria-hidden />
      {text}
    </span>
  );
}

export default function NetPriceEstimator() {
  const [data, setData] = useState<Response | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cc/net-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        return (await r.json()) as Response;
      })
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load estimates"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/60 text-sm py-12 justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
        Pulling your school list…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-200 text-sm">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const inputsCovered =
    data.inputs.affordabilityValue != null || data.inputs.hasIncomeBracket;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
          <div className="uppercase tracking-wider text-white/45 mb-1 font-mono">Profile flags</div>
          <div className="text-white/85 leading-snug">
            {data.inputs.isInternational ? "International · " : ""}
            {data.inputs.isFirstGen ? "First-gen · " : ""}
            {data.inputs.isTransfer ? "Transfer · " : ""}
            {!data.inputs.isInternational && !data.inputs.isFirstGen && !data.inputs.isTransfer
              ? "Domestic, continuing"
              : ""}
          </div>
        </div>
        <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
          <div className="uppercase tracking-wider text-white/45 mb-1 font-mono">Affordability</div>
          <div className="text-white/85 leading-snug">
            {data.inputs.affordabilityValue ?? "Not set"}
          </div>
        </div>
        <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
          <div className="uppercase tracking-wider text-white/45 mb-1 font-mono">Catalog</div>
          <div className="text-white/85 leading-snug">
            {data.estimates.length} of {data.estimates.length + data.uncovered.length} schools covered
          </div>
        </div>
      </div>

      {!inputsCovered && (
        <div className="p-4 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-sm text-[#F5E6B0] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0" aria-hidden />
          <div className="flex-1 leading-relaxed">
            <strong>Estimates are using defaults.</strong> Add your affordability + household income on{" "}
            <Link href="/profile" className="underline">Profile → Financial</Link> to get high-confidence
            numbers. Your data stays private.
          </div>
        </div>
      )}

      <ul className="space-y-3">
        {data.estimates.map((e) => (
          <li
            key={e.ipeds}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-base font-semibold text-white mb-1">{e.schoolName}</h3>
                <ConfidenceDot confidence={e.confidence} />
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-white/45 font-mono">Estimated net price</div>
                <div className="text-2xl font-bold text-[#D4AF37] leading-tight">{fmt(e.estimatedNetPrice)}</div>
                <div className="text-[11px] text-white/50">/ year</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
              <div className="px-3 py-2 rounded-lg bg-white/[0.03]">
                <div className="text-white/45 mb-0.5">Sticker</div>
                <div className="text-white/85 font-semibold">{fmt(e.stickerPrice)}</div>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/[0.03]">
                <div className="text-white/45 mb-0.5">Est. grant aid</div>
                <div className="text-green-300 font-semibold">−{fmt(e.estimatedGrantAid)}</div>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/[0.03]">
                <div className="text-white/45 mb-0.5">Your contribution</div>
                <div className="text-white/85 font-semibold">{fmt(e.estimatedFamilyContribution)}</div>
              </div>
            </div>

            {e.aidRiskFlag !== "none" && (
              <div className="mb-2">
                <FlagBadge flag={e.aidRiskFlag} />
              </div>
            )}

            {e.notes.length > 0 && (
              <ul className="text-[12px] text-white/60 leading-snug list-disc pl-5 space-y-1">
                {e.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}

            <div className="mt-3 pt-3 border-t border-white/5">
              <Link
                href={
                  `/parent/aid-explainer?` +
                  `school=${encodeURIComponent(e.schoolName)}` +
                  `&sticker=${e.stickerPrice}` +
                  `&net=${e.estimatedNetPrice}` +
                  `&grant=${e.estimatedGrantAid}` +
                  `&efc=${e.estimatedFamilyContribution}` +
                  `&flag=${e.aidRiskFlag}`
                }
                className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors"
              >
                <Languages className="w-3.5 h-3.5" aria-hidden />
                Explain this to my parent in their language
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {data.uncovered.length > 0 && (
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] text-xs text-white/65">
          <div className="font-semibold text-white/85 mb-2 text-sm">
            Not yet in our estimator ({data.uncovered.length})
          </div>
          <p className="mb-2 leading-relaxed">
            We haven&apos;t modeled these schools yet. Use each school&apos;s official Net Price
            Calculator until we add them in the next release:
          </p>
          <ul className="space-y-1 list-disc pl-5">
            {data.uncovered.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-2">
        <Link
          href="/schools"
          className="inline-flex items-center gap-1.5 text-sm text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors"
        >
          Open School List
          <ArrowRight className="w-3.5 h-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
