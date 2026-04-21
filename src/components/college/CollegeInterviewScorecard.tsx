"use client";

// College admissions interview scorecard.
// Spec: docs/superpowers/specs/2026-04-07-college-admissions-interviews-design.md
//
// Renders the 5-dimension college rubric + overall recommendation +
// the killer "what they would write in the report" mock paragraph.
// Auto-translated to user's chosen feedback language by the score API.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, RotateCcw, FileText, AlertCircle, Star } from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import { useAuth } from "@/contexts/AuthContext";
import SignupPrompt from "@/components/auth/SignupPrompt";

interface DimensionScore {
  score: number;
  feedback: string;
  specificMoments?: string[];
}

interface CollegeScorecardData {
  overallRecommendation: number;
  recommendationLabel: string;
  dimensions: {
    communication: DimensionScore;
    intellectualCuriosity: DimensionScore;
    authenticity: DimensionScore;
    schoolFit: DimensionScore;
    maturity: DimensionScore;
  };
  strengths: string[];
  improvements: string[];
  whatTheyWouldWriteInTheReport: string;
  _englishOriginal?: CollegeScorecardData;
}

function DimensionRow({ label, dim }: { label: string; dim: DimensionScore }) {
  const pct = (dim.score / 10) * 100;
  const color = dim.score >= 7 ? "bg-emerald-500" : dim.score >= 4 ? "bg-amber-500" : "bg-red-500";
  const textColor = dim.score >= 7 ? "text-emerald-400" : dim.score >= 4 ? "text-amber-400" : "text-red-400";

  return (
    <div className="border-b border-white/[0.05] py-4 last:border-b-0">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm text-white/80 font-medium w-44 shrink-0">{label}</span>
        <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-sm font-bold w-10 text-right ${textColor}`}>{dim.score}/10</span>
      </div>
      <p className="text-xs text-white/60 leading-relaxed pl-0 sm:pl-44">{dim.feedback}</p>
      {dim.specificMoments && dim.specificMoments.length > 0 && (
        <ul className="mt-2 pl-0 sm:pl-44 space-y-1">
          {dim.specificMoments.map((m, i) => (
            <li key={i} className="text-[11px] text-white/40 italic before:content-['→_'] before:text-white/20">
              {m}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CollegeInterviewScorecard() {
  const router = useRouter();
  const {
    transcript, questionPlan, interviewType, scorecard, setScorecard,
    collegePersonaId, applicantProfile, feedbackLanguage,
  } = useInterview();
  const { user } = useAuth();
  const [loading, setLoading] = useState(!scorecard);
  const [error, setError] = useState("");
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  const sc = scorecard as CollegeScorecardData | null;

  useEffect(() => {
    if (!user && transcript.length > 0) {
      const timer = setTimeout(() => setShowSignupPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [user, transcript.length]);

  const fetchScore = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/interviews/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          questionPlan,
          interviewType: "behavioral",
          category: "college",
          collegePersonaId,
          feedbackLanguage,
          preset: collegePersonaId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Scoring failed");
      }
      const result = await res.json();
      setScorecard(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scoring failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!scorecard && transcript.length > 0) {
      fetchScore();
    } else if (transcript.length === 0) {
      setLoading(false);
      setError("No interview transcript found.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Writing your alumni report...</p>
          <p className="text-white/20 text-xs mt-1">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error || !sc) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-white/70 text-sm mb-4">{error || "No scorecard available"}</p>
          <button
            onClick={() => router.push("/college-interviews")}
            className="text-[#D4AF37] hover:text-[#E4BF47] text-sm underline"
          >
            Start a new interview
          </button>
        </div>
      </div>
    );
  }

  const recommendationStars = Math.round(sc.overallRecommendation || 3);
  const recommendationColor =
    sc.overallRecommendation >= 4 ? "text-emerald-400" :
    sc.overallRecommendation >= 3 ? "text-amber-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push("/college-interviews")}
            className="p-2 rounded-lg hover:bg-white/5 transition"
            title="Back to setup"
          >
            <ArrowLeft className="w-4 h-4 text-white/40" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Your alumni report</h1>
            <p className="text-xs text-white/40">
              {sc._englishOriginal ? "Translated from English" : "Generated by your AI alumni interviewer"}
            </p>
          </div>
        </div>

        {/* Overall recommendation */}
        <div className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-xs uppercase tracking-wider text-white/40 mb-2">Overall recommendation</div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${i <= recommendationStars ? "fill-amber-400 text-amber-400" : "text-white/15"}`}
                />
              ))}
            </div>
            <span className={`text-2xl font-bold ${recommendationColor}`}>
              {sc.overallRecommendation}/5
            </span>
          </div>
          <p className={`text-sm font-semibold ${recommendationColor}`}>{sc.recommendationLabel}</p>
        </div>

        {/* Dimensions */}
        <div className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">Five dimensions</h2>
          <DimensionRow label="Communication" dim={sc.dimensions.communication} />
          <DimensionRow label="Intellectual curiosity" dim={sc.dimensions.intellectualCuriosity} />
          <DimensionRow label="Authenticity" dim={sc.dimensions.authenticity} />
          <DimensionRow label="School fit" dim={sc.dimensions.schoolFit} />
          <DimensionRow label="Maturity" dim={sc.dimensions.maturity} />
        </div>

        {/* Strengths and improvements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/[0.12]">
            <h3 className="text-xs uppercase tracking-wider text-emerald-300/80 mb-3">Strengths</h3>
            <ul className="space-y-2">
              {sc.strengths.map((s, i) => (
                <li key={i} className="text-sm text-white/80 leading-snug flex gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/[0.12]">
            <h3 className="text-xs uppercase tracking-wider text-amber-300/80 mb-3">Work on this</h3>
            <ul className="space-y-2">
              {sc.improvements.map((s, i) => (
                <li key={i} className="text-sm text-white/80 leading-snug flex gap-2">
                  <span className="text-amber-400 shrink-0">→</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The killer feature: what they would write */}
        <div className="mb-8 p-6 rounded-2xl bg-[#D4AF37]/[0.06] border border-[#D4AF37]/[0.18]">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs uppercase tracking-wider text-[#D4AF37]">What they would write in the report</h3>
          </div>
          <p className="text-sm text-white/85 leading-relaxed italic">
            {sc.whatTheyWouldWriteInTheReport}
          </p>
          <p className="text-[10px] text-white/30 mt-3">
            Real alumni reports are private. This is a mock that captures what an alum is most likely to write based on your interview.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/college-interviews")}
            className="flex-1 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C4A030] text-black text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Practice another interview
          </button>
        </div>

        {/* Signup prompt for guests */}
        {!user && (
          <div className="mt-6">
            <SignupPrompt show={showSignupPrompt} onDismiss={() => setShowSignupPrompt(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
