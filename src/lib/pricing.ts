// Single source of truth for plan prices and credit amounts (founder,
// 2026-09-25). Copy imports these; never hardcode a price in a component.
export const PRICING = {
  free: { signupCredits: 200 },
  pro: { monthlyUsd: 15, yearlyUsd: 99, trialDays: 7 },
} as const;

export const proMonthlyLabel = () => `$${PRICING.pro.monthlyUsd}/month`;
export const proYearlyLabel = () => `$${PRICING.pro.yearlyUsd}/year`;
// 12 × $15 = $180 vs $99 → 45% saved.
export const yearlySavingsPct = () =>
  Math.round((1 - PRICING.pro.yearlyUsd / (PRICING.pro.monthlyUsd * 12)) * 100);
