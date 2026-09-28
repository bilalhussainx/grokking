// "2026-11-01" or "2026-11-01T…" → "Nov 1, 2026". String-only on purpose: it
// never constructs a Date, so the server (UTC) and every browser render the
// same text. Timezone-shifted rendering of stored dates, plus clock-dependent
// text, is what React #418 hydration mismatches are made of. Returns null for
// anything that isn't a calendar date.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatIsoDate(value: string | null | undefined): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
  if (!m) return null;
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${MONTHS[month - 1]} ${day}, ${m[1]}`;
}
