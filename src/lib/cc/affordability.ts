export const AFFORDABILITY_OPTIONS = [
  {
    value: "zero",
    label: "$0 — I need full financial aid",
    sublabel: "I cannot pay anything. I need schools that meet 100% of demonstrated need.",
    maxAnnual: 0,
  },
  {
    value: "under_10k",
    label: "Under $10,000/year",
    sublabel: "My family can contribute a small amount annually",
    maxAnnual: 10000,
  },
  {
    value: "10k_20k",
    label: "$10,000–$20,000/year",
    maxAnnual: 20000,
  },
  {
    value: "20k_30k",
    label: "$20,000–$30,000/year",
    maxAnnual: 30000,
  },
  {
    value: "30k_50k",
    label: "$30,000–$50,000/year",
    maxAnnual: 50000,
  },
  {
    value: "50k_plus",
    label: "$50,000+/year",
    sublabel: "Cost is not my primary concern",
    maxAnnual: 999999,
  },
] as const;

export type AffordabilityValue = typeof AFFORDABILITY_OPTIONS[number]["value"];
export type FinancialNeedDerived = "essential" | "important" | "nice-to-have" | "not-a-concern";

export function financialNeedFromAffordability(v: AffordabilityValue): FinancialNeedDerived {
  if (v === "zero" || v === "under_10k") return "essential";
  if (v === "10k_20k" || v === "20k_30k") return "important";
  if (v === "30k_50k") return "nice-to-have";
  return "not-a-concern";
}

export const NEED_BLIND_INTERNATIONAL_IPEDS: ReadonlySet<number> = new Set([
  166027, // Harvard
  166683, // MIT
  130794, // Yale
  186131, // Princeton
  182670, // Dartmouth
  164465, // Amherst
  168342, // Williams
  160977, // Bowdoin
]);
