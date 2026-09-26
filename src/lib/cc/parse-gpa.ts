// Onboarding collects GPA as free text ("3.50", "3.5/4.0", "3,65"). Take the leading
// number and accept only a plausible 4.x/5.0-scale GPA; anything else is
// ignored rather than stored as garbage.
export function parseGpa(raw: unknown): number | null {
  const text = (typeof raw === "number" ? String(raw) : typeof raw === "string" ? raw.trim() : "")
    // Decimal comma ("3,65"): otherwise "3" alone would be stored.
    .replace(/^(\d+),(\d+)/, "$1.$2");
  const match = text.match(/^\d+(?:\.\d+)?/);
  if (!match) return null;
  const value = Number(match[0]);
  if (!Number.isFinite(value) || value <= 0 || value > 5) return null;
  return Math.round(value * 100) / 100;
}
