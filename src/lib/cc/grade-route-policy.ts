// Single source of truth for "which routes are gated by grade level."
// The middleware uses this to redirect grade-9 students away from senior-only
// routes. Page-level checks already exist on the standalone dashboards; this
// is defense in depth so a 14-year-old following a deep link can't open the
// senior tooling.

const GRADE_9_BLOCKED_PREFIXES = [
  "/cc/essays",
  "/applications",
  "/cc/test-strategy",
  "/cc/test-attempts",
  "/cc/interview-prep",
  "/cc/waitlist",
  "/cc/recommenders",
  "/cc/aid-offers",
] as const;

export function isGrade9BlockedPath(pathname: string): boolean {
  return GRADE_9_BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}
