"use client";

import {
  Sparkles, ChevronRight, CheckCircle2, AlertTriangle, MessageSquareQuote,
  ArrowLeft, ArrowRight, Loader2,
} from "lucide-react";

interface ReviewComment {
  paragraphIndex: number;
  type: string;
  text: string;
  severity: string;
}

interface ScoreBreakdown {
  promptFit: number;
  voiceAuthenticity: number;
  specificity: number;
  reflectionDepth: number;
  structuralCraft: number;
  applicationFit: number;
}

type NextStep = "polish" | "restructure" | "re-brainstorm" | "ready";

interface ReviewData {
  comments: ReviewComment[];
  overallNotes: string;
  wordCount: number;
  promptFitScore: number;
  overallScore?: number;
  scoreBreakdown?: ScoreBreakdown;
  strengths?: string[];
  suggestedNextStep?: NextStep;
  nextStepReason?: string;
}

interface RevisionPanelProps {
  review: ReviewData | null;
  loading: boolean;
  onNavigatePhase?: (phase: "brainstorm" | "outline" | "draft" | "revise") => void;
}

const AXIS_LABELS: Record<keyof ScoreBreakdown, string> = {
  promptFit: "Prompt fit",
  voiceAuthenticity: "Voice",
  specificity: "Specificity",
  reflectionDepth: "Reflection",
  structuralCraft: "Structure",
  applicationFit: "Application fit",
};

function scoreColor(score: number): string {
  if (score >= 85) return "var(--kl-state-match, #4ade80)";
  if (score >= 70) return "var(--kl-gold-app, #D4AF37)";
  if (score >= 55) return "#fcd34d";
  return "var(--kl-state-reach, #f87171)";
}

function overallScoreBand(score: number): { label: string; tone: "excellent" | "strong" | "solid" | "work" | "rethink" } {
  if (score >= 95) return { label: "Exceptional", tone: "excellent" };
  if (score >= 85) return { label: "Strong", tone: "strong" };
  if (score >= 70) return { label: "Solid bones", tone: "solid" };
  if (score >= 55) return { label: "Needs another pass", tone: "work" };
  return { label: "Rethink the angle", tone: "rethink" };
}

const NEXT_STEP_COPY: Record<NextStep, {
  title: string;
  cta: string;
  icon: "polish" | "restructure" | "re-brainstorm" | "ready";
  tone: "gold" | "amber" | "red" | "green";
  targetPhase: "draft" | "outline" | "brainstorm" | "revise";
}> = {
  polish: {
    title: "Polish the draft",
    cta: "Back to draft",
    icon: "polish",
    tone: "gold",
    targetPhase: "draft",
  },
  restructure: {
    title: "Try a different outline",
    cta: "Back to outline",
    icon: "restructure",
    tone: "amber",
    targetPhase: "outline",
  },
  "re-brainstorm": {
    title: "Re-brainstorm the angle",
    cta: "Back to brainstorm",
    icon: "re-brainstorm",
    tone: "red",
    targetPhase: "brainstorm",
  },
  ready: {
    title: "Ready to ship",
    cta: "Stay and polish",
    icon: "ready",
    tone: "green",
    targetPhase: "revise",
  },
};

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === "positive") return <CheckCircle2 className="w-3.5 h-3.5 text-[var(--kl-state-match,#4ade80)]" />;
  if (severity === "issue") return <AlertTriangle className="w-3.5 h-3.5 text-[var(--kl-state-reach,#f87171)]" />;
  return <MessageSquareQuote className="w-3.5 h-3.5 text-[var(--kl-gold-app,#D4AF37)]" />;
}

export default function RevisionPanel({ review, loading, onNavigatePhase }: RevisionPanelProps) {
  if (loading) {
    return (
      <div
        className="kl-rail flex items-center justify-center"
        style={{ height: "100%", minHeight: 400 }}
      >
        <div className="text-center">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--kl-gold-app,#D4AF37)] mx-auto mb-3" />
          <p className="text-xs text-white/50">Reading your draft…</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="kl-rail">
        <div className="kl-rail-card">
          <p className="text-[13px] text-white/45 text-center py-6">
            No review yet. Head back to the draft and press <strong className="text-white/75 font-medium">Request review</strong>.
          </p>
        </div>
      </div>
    );
  }

  const overall = review.overallScore ?? Math.round((review.promptFitScore ?? 0) * 100);
  const band = overallScoreBand(overall);
  const breakdown = review.scoreBreakdown;
  const strengths = review.strengths ?? [];
  const nextStep = review.suggestedNextStep ?? "polish";
  const stepCfg = NEXT_STEP_COPY[nextStep];

  // Group comments by severity for readability.
  const positives = review.comments.filter((c) => c.severity === "positive");
  const suggestions = review.comments.filter((c) => c.severity === "suggestion");
  const issues = review.comments.filter((c) => c.severity === "issue");

  const bandColor =
    band.tone === "excellent" ? "var(--kl-state-match,#4ade80)"
    : band.tone === "strong" ? "var(--kl-gold-app,#D4AF37)"
    : band.tone === "solid" ? "#fcd34d"
    : band.tone === "work" ? "#fb923c"
    : "var(--kl-state-reach,#f87171)";

  const stepToneColor =
    stepCfg.tone === "green" ? "var(--kl-state-match,#4ade80)"
    : stepCfg.tone === "amber" ? "#fcd34d"
    : stepCfg.tone === "red" ? "var(--kl-state-reach,#f87171)"
    : "var(--kl-gold-app,#D4AF37)";

  return (
    <div className="kl-rail">
      {/* Overall score card */}
      <div
        className="kl-rail-card"
        style={{
          borderColor: "var(--kl-app-gold-edge, rgba(212,175,55,0.22))",
          background: "rgba(212,175,55,0.04)",
        }}
      >
        <div className="kl-rail-eyebrow">
          <Sparkles className="w-3 h-3" />
          Holistic read
        </div>
        <div className="flex items-baseline gap-3 mb-2">
          <span
            className="font-display"
            style={{
              fontFamily: "var(--kl-font-display, Georgia, serif)",
              fontSize: 56,
              fontWeight: 300,
              lineHeight: 1,
              color: bandColor,
              letterSpacing: "-0.02em",
            }}
          >
            {overall}
          </span>
          <span className="text-[12px] uppercase tracking-[0.18em] text-white/50" style={{ fontFamily: "var(--kl-font-mono, 'JetBrains Mono', monospace)" }}>
            / 100
          </span>
          <span
            className="ml-auto text-[11.5px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: bandColor }}
          >
            {band.label}
          </span>
        </div>
        <p className="text-[12.5px] text-white/70 leading-relaxed">{review.overallNotes}</p>
      </div>

      {/* Score breakdown */}
      {breakdown && (
        <div className="kl-rail-card">
          <div className="kl-rail-eyebrow">
            <Sparkles className="w-3 h-3" />
            Score breakdown
          </div>
          <div className="flex flex-col gap-2.5 mt-1">
            {(Object.keys(AXIS_LABELS) as (keyof ScoreBreakdown)[]).map((k) => {
              const v = breakdown[k];
              if (typeof v !== "number") return null;
              return (
                <div key={k}>
                  <div className="flex items-center justify-between text-[11.5px] mb-1">
                    <span className="text-white/70">{AXIS_LABELS[k]}</span>
                    <span className="tabular-nums font-mono" style={{ color: scoreColor(v) }}>
                      {v}
                    </span>
                  </div>
                  <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.max(4, v)}%`, background: scoreColor(v) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <div
          className="kl-rail-card"
          style={{
            borderColor: "rgba(74,222,128,0.22)",
            background: "rgba(74,222,128,0.04)",
          }}
        >
          <div className="kl-rail-eyebrow" style={{ color: "var(--kl-state-match,#4ade80)" }}>
            <CheckCircle2 className="w-3 h-3" />
            What&rsquo;s already working
          </div>
          <ul className="flex flex-col gap-2 mt-1">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[12.5px] text-white/78 leading-relaxed">
                <span
                  aria-hidden
                  className="inline-block flex-shrink-0"
                  style={{
                    width: 5, height: 5, borderRadius: 999,
                    background: "var(--kl-state-match,#4ade80)",
                    marginTop: 7,
                  }}
                />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next step CTA */}
      <div
        className="kl-rail-card"
        style={{
          borderColor: stepToneColor + "55",
          background: `linear-gradient(180deg, ${stepToneColor}0f, transparent 70%)`,
        }}
      >
        <div className="kl-rail-eyebrow" style={{ color: stepToneColor }}>
          <ArrowRight className="w-3 h-3" />
          Suggested next step
        </div>
        <div className="text-[15px] font-semibold text-white mb-1">{stepCfg.title}</div>
        {review.nextStepReason && (
          <p className="text-[12.5px] text-white/65 leading-relaxed mb-3">{review.nextStepReason}</p>
        )}
        {onNavigatePhase && stepCfg.targetPhase !== "revise" && (
          <button
            type="button"
            onClick={() => onNavigatePhase(stepCfg.targetPhase)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
            style={{
              background: stepToneColor,
              color: "#000",
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {stepCfg.cta}
          </button>
        )}
      </div>

      {/* Comments (variable count, grouped by severity) */}
      {review.comments.length > 0 && (
        <div className="kl-rail-card">
          <div className="kl-rail-eyebrow">
            <MessageSquareQuote className="w-3 h-3" />
            Line-level notes · {review.comments.length}
          </div>
          <div className="flex flex-col gap-2.5 mt-1">
            {[
              ...issues.map((c, i) => ({ c, key: `i${i}` })),
              ...suggestions.map((c, i) => ({ c, key: `s${i}` })),
              ...positives.map((c, i) => ({ c, key: `p${i}` })),
            ].map(({ c, key }) => (
              <div
                key={key}
                className="flex items-start gap-2.5 rounded-lg"
                style={{
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
                  borderLeftWidth: 2,
                  borderLeftColor: c.severity === "positive"
                    ? "var(--kl-state-match,#4ade80)"
                    : c.severity === "issue"
                      ? "var(--kl-state-reach,#f87171)"
                      : "var(--kl-app-gold-edge-2, rgba(212,175,55,0.40))",
                }}
              >
                <SeverityIcon severity={c.severity} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                      style={{
                        color: "var(--kl-gold-app,#D4AF37)",
                        fontFamily: "var(--kl-font-mono, 'JetBrains Mono', monospace)",
                      }}
                    >
                      {c.type}
                    </span>
                    <span className="text-[10px] text-white/35 font-mono">
                      P{c.paragraphIndex + 1}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-white/72 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase jump helpers */}
      {onNavigatePhase && (
        <div className="kl-rail-card">
          <div className="kl-rail-eyebrow">
            <ChevronRight className="w-3 h-3" />
            Jump back
          </div>
          <div className="text-[11.5px] text-white/55 mb-2.5">
            Your brainstorm, outline, and draft are all saved. Nothing&rsquo;s lost when you jump back.
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onNavigatePhase("brainstorm")}
              className="kl-chip"
              style={{ padding: "5px 10px", fontSize: 11 }}
            >
              Brainstorm
            </button>
            <button
              type="button"
              onClick={() => onNavigatePhase("outline")}
              className="kl-chip"
              style={{ padding: "5px 10px", fontSize: 11 }}
            >
              Outline
            </button>
            <button
              type="button"
              onClick={() => onNavigatePhase("draft")}
              className="kl-chip"
              style={{ padding: "5px 10px", fontSize: 11 }}
            >
              Draft
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
