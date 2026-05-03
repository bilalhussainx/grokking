// src/lib/cc/canada/grade-conversion.ts
// Province-aware grade conversion. Critical to fix the bug (Audit Prompt
// 4 Gap 5) where coach-prompt-builder runs Canadian percentages through
// Pakistani-FSc bands.
//
// All functions clamp output to [0, 4.0]. They produce a SINGLE
// approximate US 4.0 value for advisory use only — US universities
// receiving Canadian transcripts compute their own conversion.

export type CanadianProvince = "ON" | "BC" | "AB" | "QC" | "other";

function clamp(n: number): number {
  if (n < 0) return 0;
  if (n > 4) return 4;
  return n;
}

// Ontario top-6 senior-year average. Three-piece linear matching the
// Maclean's / WES rough mapping:
//   60% → 2.0, 80% → 3.3, 90% → 3.9, 95% → 4.0.
export function ontarioPercentageToUS(pct: number): number {
  if (pct >= 95) return 4.0;
  if (pct >= 90) return clamp(3.9 + (pct - 90) * 0.02);
  if (pct >= 80) return clamp(3.3 + (pct - 80) * 0.06);
  if (pct >= 60) return clamp(2.0 + (pct - 60) * (1.3 / 20));
  return clamp(pct / 30);
}

// BC cumulative grade-12 percentage. Slightly stricter than Ontario;
// 90% ≈ 3.8 (vs Ontario 3.9). Same anchor at 95%+ → 4.0.
export function bcPercentageToUS(pct: number): number {
  if (pct >= 95) return 4.0;
  if (pct >= 90) return clamp(3.8 + (pct - 90) * 0.04);
  if (pct >= 80) return clamp(3.2 + (pct - 80) * 0.06);
  if (pct >= 60) return clamp(2.0 + (pct - 60) * (1.2 / 20));
  return clamp(pct / 32);
}

// Alberta diploma exam scores (5 subjects). Use percentage average.
// Schools accept these at face value; convert linearly with the same
// slope as Ontario.
export function albertaDiplomaToUS(pct: number): number {
  return ontarioPercentageToUS(pct);
}

// Quebec cote R / R-score. Scale typically 15-50 with 30+ ≈ US 3.0+,
// 35+ ≈ US 4.0. Linear above 20.
export function quebecRScoreToUS(rScore: number): number {
  if (rScore >= 35) return 4.0;
  if (rScore < 20) return clamp((rScore / 20) * 1.5);
  return clamp(1.5 + (rScore - 20) * (2.5 / 15));
}
