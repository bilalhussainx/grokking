// src/components/nav/sidebar-data.ts
// Shared data + types for the persistent sidebar AND the mobile drawer.
// Lifted out of Sidebar.tsx so both surfaces consume the same IA without
// duplication. Sidebar.tsx and MobileDrawer.tsx both import from here.

import {
  Home, Calendar, FileText, Mail, BarChart3, MessageSquare, Hourglass,
  Activity, BookOpen, Compass, MapPin, Sun, GraduationCap, Settings,
  Edit3, Users, Building2,
} from "lucide-react";

export type SidebarGrade =
  | "g9" | "g10" | "junior"
  | "senior_writing" | "senior_post_submit" | "senior_decisions"
  | "transfer" | "unknown";

export type IconName =
  | "home" | "calendar" | "fileText" | "mail" | "chartBar" | "msgSquare"
  | "hourglass" | "activity" | "bookOpen" | "compass" | "mapPin" | "sun"
  | "cap" | "settings" | "edit3" | "users" | "building";

export const ICONS: Record<IconName, typeof Home> = {
  home: Home, calendar: Calendar, fileText: FileText, mail: Mail,
  chartBar: BarChart3, msgSquare: MessageSquare, hourglass: Hourglass,
  activity: Activity, bookOpen: BookOpen, compass: Compass, mapPin: MapPin,
  sun: Sun, cap: GraduationCap, settings: Settings, edit3: Edit3, users: Users,
  building: Building2,
};

export type NavItem = {
  id: string;
  label: string;
  icon: IconName;
  href: string;
  grades: SidebarGrade[];
  transferLabel?: string;
  transferGrades?: SidebarGrade[];
  drawer?: boolean;
  pulseOnAppear?: boolean;
};

export type NavSection = {
  id: "apply" | "profile" | "tools";
  name: string;
  abbr: string;
  items: NavItem[];
  lockedFor?: SidebarGrade[];
  lockedCaption?: string;
};

export const SENIOR_GRADES: SidebarGrade[] = [
  "senior_writing", "senior_post_submit", "senior_decisions",
];

export const SECTIONS: NavSection[] = [
  {
    id: "apply", name: "Apply", abbr: "A",
    lockedFor: ["g9"], lockedCaption: "Unlocks junior year",
    items: [
      // School list shows up for g10 and above. g10 is on the early side,
      // but the variant guidance lets g10 students "preview" the list view
      // without locking them into a final list — the dashboard widgets and
      // coach still tell them not to commit yet. Kept ABOVE the application
      // tracker so it reads as the natural starting point of the apply flow:
      // build the list -> track applications against it.
      { id: "schools", label: "School list", icon: "building", href: "/schools",
        grades: ["g10", "junior", ...SENIOR_GRADES, "transfer"] },
      { id: "tracker", label: "Application tracker", icon: "calendar", href: "/applications",
        grades: ["junior", ...SENIOR_GRADES, "transfer"] },
      { id: "whyTransfer", label: "Why-transfer essay", icon: "edit3", href: "/cc/essays?type=transfer",
        grades: ["transfer"] },
      { id: "supplements", label: "Supplements", icon: "fileText", href: "/cc/essays/supplements",
        grades: ["junior", ...SENIOR_GRADES] },
      { id: "recs", label: "Recommenders", icon: "mail", href: "/cc/recommenders",
        grades: ["junior", ...SENIOR_GRADES],
        transferLabel: "Professor recs", transferGrades: ["transfer"] },
      { id: "tests", label: "Test strategy", icon: "chartBar", href: "/cc/test-strategy",
        grades: ["g10", "junior", "senior_writing"] },
      { id: "interviews", label: "Interviews", icon: "msgSquare", href: "/cc/interview-prep",
        grades: SENIOR_GRADES },
      { id: "waitlist", label: "Waitlist", icon: "hourglass", href: "/cc/waitlist",
        grades: ["senior_decisions"], pulseOnAppear: true },
    ],
  },
  {
    id: "profile", name: "Profile", abbr: "P",
    items: [
      { id: "activities", label: "Activities", icon: "activity", href: "/cc/activities-optimizer",
        grades: ["g9", "g10", "junior", ...SENIOR_GRADES, "transfer"] },
      { id: "rigor", label: "Course rigor", icon: "bookOpen", href: "/cc/courses",
        grades: ["g9", "g10", "junior", ...SENIOR_GRADES, "transfer"] },
      { id: "major", label: "Major exploration", icon: "compass", href: "/cc/majors",
        grades: ["g9", "g10", "junior", ...SENIOR_GRADES, "transfer"] },
      { id: "visits", label: "Visits", icon: "mapPin", href: "/cc/visits",
        grades: ["g9", "g10", "junior", ...SENIOR_GRADES, "transfer"] },
      { id: "summer", label: "Summer experiences", icon: "sun", href: "/cc/summer",
        grades: ["g9", "g10", "junior", ...SENIOR_GRADES] },
    ],
  },
  {
    id: "tools", name: "Tools", abbr: "T",
    items: [
      { id: "coach", label: "Coach Kairos", icon: "cap", href: "#coach",
        grades: ["g9", "g10", "junior", ...SENIOR_GRADES, "transfer"], drawer: true },
      { id: "settings", label: "Settings", icon: "settings", href: "/account/settings",
        grades: ["g9", "g10", "junior", ...SENIOR_GRADES, "transfer"] },
    ],
  },
];

// Alias for the plan's preferred name.
export const ALL_ITEMS = SECTIONS;

export function visibleFor(grade: SidebarGrade): NavSection[] {
  return SECTIONS.map((sec) => ({
    ...sec,
    items: sec.items.filter((it) =>
      it.grades.includes(grade) ||
      (it.transferGrades?.includes(grade) ?? false),
    ),
  }));
}
