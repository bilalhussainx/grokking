"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Loader2, Target } from "lucide-react";
import { useCoachKairos } from "@/contexts/CoachKairosContext";

interface School {
  id: string;
  school_id: string;
  chancing_band: string | null;
  application_status: string;
  cc_schools: {
    id: string;
    name: string;
    city: string;
    state: string;
    acceptance_rate: number | null;
  };
}

interface ChanceResult {
  band: "reach" | "match" | "safety" | "extreme-reach";
  probability: number;
  rationale: string;
  strengths: string[];
  weaknesses: string[];
  missingPieces: string[];
  academicFit: "below" | "at" | "above";
  essayStrength: "weak" | "average" | "strong" | "unknown";
  activitiesStrength: "weak" | "average" | "strong" | "unknown";
  interviewSignal: "negative" | "neutral" | "positive" | "none";
}

interface Gate {
  hasEssayReviewed: boolean;
  hasActivitiesOptimized: boolean;
  hasSchools: boolean;
}

const BAND_STYLES: Record<string, { label: string; bg: string; border: string; text: string; dot: string }> = {
  "extreme-reach": { label: "Extreme Reach", bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-300", dot: "bg-rose-500" },
  reach: { label: "Reach", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300", dot: "bg-amber-500" },
  match: { label: "Match", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", dot: "bg-emerald-500" },
  safety: { label: "Safety", bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-300", dot: "bg-sky-500" },
};

const FIT_STYLES: Record<string, string> = {
  below: "text-rose-300",
  at: "text-amber-300",
  above: "text-emerald-300",
};

const STRENGTH_STYLES: Record<string, string> = {
  weak: "text-rose-300",
  average: "text-amber-300",
  strong: "text-emerald-300",
  unknown: "text-white/40",
  negative: "text-rose-300",
  neutral: "text-white/50",
  positive: "text-emerald-300",
  none: "text-white/40",
};

export default function ChancesPage() {
  const coach = useCoachKairos();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [gate, setGate] = useState<Gate>({ hasEssayReviewed: false, hasActivitiesOptimized: false, hasSchools: false });
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [result, setResult] = useState<ChanceResult | null>(null);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [schoolsRes, statusRes] = await Promise.all([
        fetch("/api/cc/school-list").then((r) => r.json()),
        fetch("/api/cc/setup-status").then((r) => r.json()),
      ]);
      setSchools(schoolsRes.schools || []);
      setGate({
        hasEssayReviewed: !!statusRes.hasEssayReviewed,
        hasActivitiesOptimized: !!statusRes.hasActivitiesOptimized,
        hasSchools: !!statusRes.hasSchools,
      });
    } catch {
      setError("Couldn't load your data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const computeChance = async (schoolId: string) => {
    setComputing(true);
    setError(null);
    setResult(null);
    setSelectedSchoolId(schoolId);
    try {
      const res = await fetch(`/api/cc/chances/${schoolId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to compute chance");
        return;
      }
      setResult(data.result);
    } catch {
      setError("Network error");
    } finally {
      setComputing(false);
    }
  };

  const canCompute = gate.hasEssayReviewed && gate.hasActivitiesOptimized && gate.hasSchools;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/cc/dashboard" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
            <Target className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admissions Chances</h1>
            <p className="text-sm text-white/50">Holistic per-school assessment from your full application</p>
          </div>
        </div>

        {!canCompute && (
          <div className="mt-6 p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-200">Finish these first for an accurate read</p>
                <ul className="mt-3 space-y-2 text-xs">
                  <li className="flex items-center gap-2">
                    {gate.hasSchools ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5 rounded-full border border-white/30" />}
                    <span className={gate.hasSchools ? "text-white/50 line-through" : "text-white/80"}>Add schools to your list</span>
                    {!gate.hasSchools && <Link href="/schools" className="text-[#D4AF37] hover:underline ml-auto">Browse schools →</Link>}
                  </li>
                  <li className="flex items-center gap-2">
                    {gate.hasEssayReviewed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5 rounded-full border border-white/30" />}
                    <span className={gate.hasEssayReviewed ? "text-white/50 line-through" : "text-white/80"}>Get your Common App essay reviewed</span>
                    {!gate.hasEssayReviewed && <Link href="/cc/essays" className="text-[#D4AF37] hover:underline ml-auto">Essay Studio →</Link>}
                  </li>
                  <li className="flex items-center gap-2">
                    {gate.hasActivitiesOptimized ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5 rounded-full border border-white/30" />}
                    <span className={gate.hasActivitiesOptimized ? "text-white/50 line-through" : "text-white/80"}>Run the activity optimizer</span>
                    {!gate.hasActivitiesOptimized && <Link href="/cc/activities-optimizer" className="text-[#D4AF37] hover:underline ml-auto">Optimizer →</Link>}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {canCompute && (
          <div className="mt-6">
            <h2 className="text-xs uppercase tracking-wide text-white/40 mb-3">Your schools</h2>
            <div className="grid gap-2">
              {schools.map((s) => {
                const isSelected = selectedSchoolId === s.school_id;
                return (
                  <button
                    key={s.id}
                    onClick={() => computeChance(s.school_id)}
                    disabled={computing}
                    className={`text-left p-4 rounded-xl border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSelected
                        ? "bg-[#D4AF37]/5 border-[#D4AF37]/40"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">{s.cc_schools.name}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {s.cc_schools.city}, {s.cc_schools.state}
                          {s.cc_schools.acceptance_rate !== null && (
                            <span className="ml-2">· {Math.round((s.cc_schools.acceptance_rate || 0) * 100)}% accept rate</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && computing && <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />}
                        {s.chancing_band && !isSelected && (
                          <span className="text-[11px] text-white/40 uppercase tracking-wide">
                            Last: {s.chancing_band}
                          </span>
                        )}
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-6 space-y-4">
                <ChanceCard result={result} />

                <button
                  onClick={() => {
                    coach.open();
                    const schoolName = schools.find((s) => s.school_id === selectedSchoolId)?.cc_schools.name || "this school";
                    coach.sendMessage(
                      `My chance at ${schoolName} came back as ${result.band} (${result.probability}%). What should I focus on to strengthen my application?`
                    );
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/15 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm font-medium text-[#D4AF37]">Ask Coach Kairos how to strengthen this</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ChanceCard({ result }: { result: ChanceResult }) {
  const band = BAND_STYLES[result.band] || BAND_STYLES.reach;

  return (
    <div className={`rounded-2xl border ${band.border} ${band.bg} p-6`}>
      <div className="flex items-start justify-between gap-6 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${band.dot}`} />
            <span className={`text-xs uppercase tracking-wide font-medium ${band.text}`}>{band.label}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-semibold ${band.text}`}>{result.probability}%</span>
            <span className="text-xs text-white/40">estimated admit chance</span>
          </div>
        </div>
        <TrendingUp className={`w-5 h-5 ${band.text} opacity-60`} />
      </div>

      <p className="text-sm text-white/70 leading-relaxed">{result.rationale}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/5">
        <Metric label="Academic fit" value={result.academicFit} className={FIT_STYLES[result.academicFit]} />
        <Metric label="Essay" value={result.essayStrength} className={STRENGTH_STYLES[result.essayStrength]} />
        <Metric label="Activities" value={result.activitiesStrength} className={STRENGTH_STYLES[result.activitiesStrength]} />
        <Metric label="Interview" value={result.interviewSignal} className={STRENGTH_STYLES[result.interviewSignal]} />
      </div>

      {result.strengths.length > 0 && (
        <Section label="Strengths" items={result.strengths} dotColor="bg-emerald-400" />
      )}
      {result.weaknesses.length > 0 && (
        <Section label="Where you're weakest" items={result.weaknesses} dotColor="bg-amber-400" />
      )}
      {result.missingPieces.length > 0 && (
        <Section label="Missing pieces" items={result.missingPieces} dotColor="bg-rose-400" />
      )}
    </div>
  );
}

function Metric({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-white/40 mb-1">{label}</p>
      <p className={`text-xs font-medium capitalize ${className}`}>{value.replace("-", " ")}</p>
    </div>
  );
}

function Section({ label, items, dotColor }: { label: string; items: string[]; dotColor: string }) {
  return (
    <div className="mt-5 pt-5 border-t border-white/5">
      <p className="text-[10px] uppercase tracking-wide text-white/40 mb-2">{label}</p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-white/70 leading-relaxed">
            <span className={`w-1 h-1 rounded-full ${dotColor} mt-1.5 shrink-0`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
