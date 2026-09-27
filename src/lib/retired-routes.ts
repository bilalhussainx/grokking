// The study-courses product was retired on 2026-09-26: KairosLearn is an
// admissions counselor only. Every learning URL goes to the nearest admissions
// surface. "/" already sends sessions to their dashboard and visitors to the
// homepage. Temporary (307) for the first release; make permanent after 30 days.
const HOME = "/";
const INTERVIEWS = "/cc/interview-prep";

const MAP: Array<[string, string]> = [
  ["/course", HOME], ["/courses", HOME], ["/learn", HOME], ["/pathways", HOME],
  ["/talk", HOME], ["/placement", HOME], ["/practice", HOME],
  ["/classrooms", HOME], ["/sessions", HOME],
  ["/leaderboard", HOME], ["/achievements", HOME],
  ["/credentials", HOME], ["/verify", HOME],
  ["/blog", HOME], ["/comparison", HOME], ["/tools", HOME],
  ["/interviews", INTERVIEWS], ["/career", INTERVIEWS],
  ["/dashboard", "/cc/dashboard"],
  ["/onboarding/language", "/onboarding"],
  ["/admin/courses", "/admin/survey"],
];

export const RETIRED_ROUTE_REDIRECTS: { source: string; destination: string; permanent: false }[] = [
  // "/admin" itself only: /admin/survey stays.
  { source: "/admin", destination: "/admin/survey", permanent: false },
  ...MAP.flatMap(([base, destination]) => [
    { source: base, destination, permanent: false as const },
    { source: `${base}/:path*`, destination, permanent: false as const },
  ]),
];

export function retiredDestination(pathname: string): string | null {
  if (pathname === "/admin") return "/admin/survey";
  for (const [base, destination] of MAP) {
    if (pathname === base || pathname.startsWith(`${base}/`)) return destination;
  }
  return null;
}
