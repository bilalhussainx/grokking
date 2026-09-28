// Navigation model for the Daybreak app frame (GATE D4.2). Pure data and pure
// functions: AppFrame renders it, unit tests read it, and
// src/components/nav/__tests__/nav-links.test.ts scans the href strings below
// to prove every destination is a real page. Grade-9 limits come only from
// src/lib/cc/grade-route-policy.ts; this file never keeps its own list.
import { isGrade9BlockedPath } from "@/lib/cc/grade-route-policy";
import { selectVariant, type VariantKey } from "@/app/cc/dashboard/variants";

export type ShellStage = VariantKey;

export type NavIcon =
  | "today" | "coach" | "schools" | "calendar" | "essays" | "activities" | "cost"
  | "interview" | "family" | "profile" | "students" | "team" | "services"
  | "payouts" | "setup" | "history" | "settings" | "more";

export type NavLink = { kind: "link"; id: string; label: string; href: string; icon: NavIcon; keywords?: string };
export type NavAction = { kind: "action"; id: "coach" | "family"; label: string; icon: NavIcon; keywords?: string };
export type NavEntry = NavLink | NavAction;

export type MobileTab =
  | { kind: "link"; id: string; label: string; icon: NavIcon; href: string }
  | { kind: "coach" | "more"; id: string; label: string; icon: NavIcon };

export type StaffRole = { isMember: boolean; isHead: boolean };

// Coach Kairos and Family mode are actions on the global Coach drawer, never
// routes (`/cc` is the public tools overview, not Coach).
const STUDENT_PRIMARY: NavEntry[] = [
  { kind: "link", id: "today", label: "Today", href: "/cc/dashboard", icon: "today", keywords: "home dashboard" },
  { kind: "action", id: "coach", label: "Coach Kairos", icon: "coach", keywords: "ai chat ask help" },
  { kind: "link", id: "schools", label: "School list", href: "/schools", icon: "schools", keywords: "colleges universities" },
  { kind: "link", id: "applications", label: "Applications & deadlines", href: "/applications", icon: "calendar", keywords: "dates tracker" },
  { kind: "link", id: "essays", label: "Essays", href: "/cc/essays", icon: "essays", keywords: "personal statement supplements writing" },
  { kind: "link", id: "activities", label: "Activities", href: "/cc/activities-optimizer", icon: "activities", keywords: "work family responsibilities" },
  { kind: "link", id: "aid", label: "Aid & net price", href: "/cc/net-price", icon: "cost", keywords: "cost money financial aid" },
  { kind: "link", id: "interview", label: "Interview prep", href: "/cc/interview-prep", icon: "interview", keywords: "practice" },
  { kind: "action", id: "family", label: "Family mode", icon: "family", keywords: "parents language" },
];

const STUDENT_PLANNING: NavLink[] = [
  { kind: "link", id: "profile", label: "Profile", href: "/profile", icon: "profile", keywords: "gpa name school" },
  { kind: "link", id: "coursework", label: "High-school coursework", href: "/cc/courses", icon: "essays", keywords: "classes rigor" },
  { kind: "link", id: "testing", label: "Testing", href: "/cc/test-strategy", icon: "calendar", keywords: "sat act" },
  { kind: "link", id: "majors", label: "Majors & interests", href: "/cc/majors", icon: "activities", keywords: "careers explore" },
  { kind: "link", id: "visits", label: "Visits", href: "/cc/visits", icon: "schools", keywords: "tours campus" },
  { kind: "link", id: "summer", label: "Summer experiences", href: "/cc/summer", icon: "today", keywords: "programs" },
  { kind: "link", id: "recommenders", label: "Recommenders", href: "/cc/recommenders", icon: "profile", keywords: "letters teachers" },
  { kind: "link", id: "waitlist", label: "Waitlist", href: "/cc/waitlist", icon: "calendar", keywords: "loci" },
];

const TRANSFER_COURSEWORK: NavLink = {
  kind: "link", id: "coursework", label: "Credits & coursework", href: "/cc/transfer-profile", icon: "essays", keywords: "transfer college credits",
};

const STAFF: NavLink[] = [
  { kind: "link", id: "students", label: "Students", href: "/counselor/students", icon: "students", keywords: "roster" },
  { kind: "link", id: "engagements", label: "Engagements", href: "/counselor/dashboard", icon: "calendar", keywords: "work bookings" },
  { kind: "link", id: "team", label: "Team & invites", href: "/counselor/team", icon: "team", keywords: "codes members" },
  { kind: "link", id: "services", label: "Services", href: "/counselor/services", icon: "services", keywords: "packages" },
  { kind: "link", id: "payouts", label: "Payouts", href: "/counselor/payouts", icon: "payouts", keywords: "money stripe" },
  { kind: "link", id: "public-profile", label: "Public profile", href: "/counselor/profile", icon: "profile", keywords: "bio" },
  { kind: "link", id: "admit-history", label: "Admit history", href: "/counselor/admit-history", icon: "history", keywords: "results" },
];

// A counselor with no agency lands on /counselor/dashboard, which hosts
// CreateWorkspaceCard; /counselor/students bounces non-members there anyway.
const WORKSPACE_SETUP: NavLink = {
  kind: "link", id: "setup", label: "Workspace setup", href: "/counselor/dashboard", icon: "setup", keywords: "create join agency",
};

export function isBlockedFor(stage: ShellStage, href: string): boolean {
  return stage === "g9" && isGrade9BlockedPath(href.split(/[?#]/)[0]);
}

export function studentPrimary(stage: ShellStage): NavEntry[] {
  return STUDENT_PRIMARY.filter((e) => e.kind === "action" || !isBlockedFor(stage, e.href));
}

export function studentPlanning(stage: ShellStage): NavLink[] {
  const list = stage === "transfer"
    ? STUDENT_PLANNING.map((l) => (l.id === "coursework" ? TRANSFER_COURSEWORK : l))
    : STUDENT_PLANNING;
  return list.filter((l) => !isBlockedFor(stage, l.href));
}

export function studentTabs(): MobileTab[] {
  return [
    { kind: "link", id: "today", label: "Today", icon: "today", href: "/cc/dashboard" },
    { kind: "coach", id: "coach", label: "Coach", icon: "coach" },
    { kind: "link", id: "schools", label: "Schools", icon: "schools", href: "/schools" },
    { kind: "more", id: "more", label: "More", icon: "more" },
  ];
}

export function staffPrimary(role: StaffRole): NavLink[] {
  if (!role.isMember) {
    // Marketplace tools stay; roster, engagements-as-home and team need a workspace.
    return [WORKSPACE_SETUP, ...STAFF.filter((l) => !["students", "engagements", "team"].includes(l.id))];
  }
  return STAFF.filter((l) => l.id !== "team" || role.isHead);
}

export function staffTabs(role: StaffRole): MobileTab[] {
  if (!role.isMember) {
    return [
      { kind: "link", id: "setup", label: "Setup", icon: "setup", href: "/counselor/dashboard" },
      { kind: "link", id: "profile", label: "Profile", icon: "profile", href: "/counselor/profile" },
      { kind: "link", id: "settings", label: "Settings", icon: "settings", href: "/settings" },
      { kind: "more", id: "more", label: "More", icon: "more" },
    ];
  }
  return [
    { kind: "link", id: "students", label: "Students", icon: "students", href: "/counselor/students" },
    { kind: "link", id: "work", label: "Work", icon: "calendar", href: "/counselor/dashboard" },
    role.isHead
      ? { kind: "link", id: "team", label: "Team", icon: "team", href: "/counselor/team" }
      : { kind: "link", id: "profile", label: "Profile", icon: "profile", href: "/counselor/profile" },
    { kind: "more", id: "more", label: "More", icon: "more" },
  ];
}

export function searchEntries<T extends NavEntry>(entries: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;
  return entries.filter((e) => `${e.label} ${e.keywords ?? ""}`.toLowerCase().includes(q));
}

export function isActiveHref(pathname: string, href: string): boolean {
  if (href === "/cc/dashboard") return pathname === "/cc/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Routes whose layout renders AppShell → AppFrame. providers.tsx skips the
// navy TopNav on exactly these, and a Task 4 test proves each has the layout.
export const APP_FRAME_PREFIXES = ["/cc", "/counselor", "/engagements", "/schools", "/applications", "/settings", "/profile"] as const;

export function usesAppFrame(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return APP_FRAME_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// Page bodies already built in Daybreak. Every other framed page keeps its
// legacy dark surface (and white text) inside the frame until its own D4.x
// gate. Without this, legacy white-on-transparent text would sit on cream.
export const DAYBREAK_PAGES = ["/cc/dashboard", "/settings"] as const;

export function isDaybreakPage(pathname: string): boolean {
  return (DAYBREAK_PAGES as readonly string[]).includes(pathname);
}

export function shellStageFor(
  profile: { grade_level: number | null; is_transfer_student: boolean | null } | null,
): ShellStage {
  // No school rows: grade 12 resolves to senior_writing, and the rail is the
  // same for every senior phase.
  return profile ? selectVariant(profile, []) : "unknown";
}
