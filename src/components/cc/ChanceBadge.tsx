export type ChanceTier = "reach" | "match" | "safety" | "unknown";

const LABELS: Record<ChanceTier, string> = {
  reach: "Reach",
  match: "Match",
  safety: "Safety",
  unknown: "—",
};

/**
 * Infer a chance tier from an admit probability (0–1).
 * < 0.20 → reach, 0.20–0.60 → match, > 0.60 → safety.
 * Returns "unknown" for null/undefined/NaN.
 */
export function tierFromProbability(p: number | null | undefined): ChanceTier {
  if (p === null || p === undefined || Number.isNaN(p)) return "unknown";
  if (p < 0.2) return "reach";
  if (p <= 0.6) return "match";
  return "safety";
}

/**
 * Map existing chancing_band strings from cc_student_schools to a ChanceTier.
 * Accepts: "reach", "match", "safety", "hard_reach", "far_reach", etc.
 */
export function tierFromBand(band: string | null | undefined): ChanceTier {
  if (!band) return "unknown";
  const b = band.toLowerCase();
  if (b.includes("safety")) return "safety";
  if (b.includes("match")) return "match";
  if (b.includes("reach")) return "reach";
  return "unknown";
}

export function ChanceBadge({
  tier,
  className = "",
}: {
  tier: ChanceTier;
  className?: string;
}) {
  return (
    <span
      className={`kl-chance kl-chance-${tier} ${className}`.trim()}
      aria-label={`Chance tier: ${LABELS[tier]}`}
    >
      {LABELS[tier]}
    </span>
  );
}
