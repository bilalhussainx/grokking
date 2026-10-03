// The school catalog (cc_schools.regular_deadline / early_deadline) stores
// deadlines without a year: "Feb 1", "Nov 15", "Rolling". This is the one
// place that turns such a string into a calendar day.
//
// An admissions cycle runs Aug 1 to Jul 31. A year-less date resolves to its
// occurrence inside the cycle that contains `todayIso`; if that day has
// already passed, it returns null rather than rolling into next year's cycle.
// String-only on purpose (no Date), so server and browser agree.
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CYCLE_START_MONTH = 8; // Aug 1

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const daysIn = (y: number, m: number) => [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
const pad = (n: number) => String(n).padStart(2, "0");

export function resolveCatalogDeadline(value: string | null | undefined, todayIso: string): string | null {
  const m = /^([A-Za-z]+)\.?\s+(\d{1,2})$/.exec((value ?? "").trim());
  const today = /^(\d{4})-(\d{2})-(\d{2})/.exec(todayIso);
  if (!m || !today) return null;
  const word = m[1].toLowerCase();
  const month = MONTHS.findIndex((name) => word === name || (word.length > 3 && name === word.slice(0, 3))) + 1;
  if (month === 0) return null;
  const day = Number(m[2]);

  const todayYear = Number(today[1]);
  const cycleStartYear = Number(today[2]) >= CYCLE_START_MONTH ? todayYear : todayYear - 1;
  const year = month >= CYCLE_START_MONTH ? cycleStartYear : cycleStartYear + 1;
  if (day < 1 || day > daysIn(year, month)) return null;

  const iso = `${year}-${pad(month)}-${pad(day)}`;
  return iso >= todayIso.slice(0, 10) ? iso : null;
}

// "2027-02-01" → "Feb 1". For catalog dates, whose year we inferred.
export function formatMonthDay(iso: string): string | null {
  const m = /^\d{4}-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  const month = Number(m[1]);
  if (month < 1 || month > 12) return null;
  return `${SHORT[month - 1]} ${Number(m[2])}`;
}
