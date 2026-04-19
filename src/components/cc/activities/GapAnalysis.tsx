"use client";

import { AlertTriangle, Info, XCircle } from "lucide-react";

interface Gap {
  category: string;
  severity: string;
  suggestion: string;
}

interface Flag {
  type: string;
  position: number;
  message: string;
}

interface GapAnalysisProps {
  gaps: Gap[];
  flags: Flag[];
  overallStrength: number;
}

const SEVERITY_STYLES: Record<string, { icon: typeof Info; color: string }> = {
  info: { icon: Info, color: "text-blue-400 border-blue-500/20 bg-blue-500/5" },
  warning: { icon: AlertTriangle, color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
  critical: { icon: XCircle, color: "text-red-400 border-red-500/20 bg-red-500/5" },
};

export default function GapAnalysis({ gaps, flags, overallStrength }: GapAnalysisProps) {
  const strengthPct = Math.round(overallStrength * 100);
  const strengthColor =
    strengthPct >= 80 ? "text-green-400" : strengthPct >= 60 ? "text-amber-400" : "text-red-400";

  return (
    <div className="space-y-4">
      {/* Overall strength */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
        <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Overall Activities Strength</p>
        <span className={`text-3xl font-bold ${strengthColor}`}>{strengthPct}%</span>
        <div className="w-full h-2 rounded-full bg-white/10 mt-3">
          <div
            className={`h-full rounded-full transition-all ${
              strengthPct >= 80 ? "bg-green-400" : strengthPct >= 60 ? "bg-amber-400" : "bg-red-400"
            }`}
            style={{ width: `${strengthPct}%` }}
          />
        </div>
      </div>

      {/* Gaps */}
      {gaps.length > 0 && (
        <div>
          <h3 className="text-xs text-white/40 uppercase tracking-wide mb-2">Missing Categories</h3>
          <div className="space-y-2">
            {gaps.map((gap, i) => {
              const style = SEVERITY_STYLES[gap.severity] || SEVERITY_STYLES.info;
              const Icon = style.icon;
              return (
                <div key={i} className={`p-3 rounded-xl border ${style.color}`}>
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium">{gap.category}</p>
                      <p className="text-[11px] opacity-70 mt-0.5">{gap.suggestion}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Flags */}
      {flags.length > 0 && (
        <div>
          <h3 className="text-xs text-white/40 uppercase tracking-wide mb-2">Red Flags</h3>
          <div className="space-y-2">
            {flags.map((flag, i) => (
              <div key={i} className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-amber-300">
                      Activity #{flag.position} — {flag.type}
                    </p>
                    <p className="text-[11px] text-amber-400/70 mt-0.5">{flag.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gaps.length === 0 && flags.length === 0 && (
        <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-center">
          <p className="text-sm text-green-400">No gaps or red flags found — your list looks solid!</p>
        </div>
      )}
    </div>
  );
}
