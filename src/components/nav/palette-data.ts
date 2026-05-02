// src/components/nav/palette-data.ts
// Shared palette catalog for desktop CommandPalette and mobile
// MobileSearchSheet. Both surfaces consume `filterPalette(query)` for
// identical filter behavior.

import {
  Search, GraduationCap, Home, Calendar, FileText, Mail, BarChart3,
  MessageSquare, Hourglass, Activity, BookOpen, Compass, MapPin, Sun,
  Settings, Edit3, Building2, Globe,
} from "lucide-react";

export type IconName =
  | "home" | "calendar" | "fileText" | "mail" | "chartBar" | "msgSquare"
  | "hourglass" | "activity" | "bookOpen" | "compass" | "mapPin" | "sun"
  | "cap" | "settings" | "edit3" | "users" | "building" | "globe";

export const ICONS: Record<IconName, typeof Home> = {
  home: Home, calendar: Calendar, fileText: FileText, mail: Mail,
  chartBar: BarChart3, msgSquare: MessageSquare, hourglass: Hourglass,
  activity: Activity, bookOpen: BookOpen, compass: Compass, mapPin: MapPin,
  sun: Sun, cap: GraduationCap, settings: Settings, edit3: Edit3,
  users: BookOpen, // fallback
  building: Building2, globe: Globe,
};

// Suppress unused-warning while keeping the Search import handy if a
// future consumer wants it (we don't use it directly in this module).
export const _PALETTE_ICON_FALLBACK = Search;

export type PaletteItem = {
  id: string;
  icon: IconName;
  label: string;
  caption?: string;
  href?: string;
  onSelect?: () => void;
};

export const PAGES: PaletteItem[] = [
  { id: "home", icon: "home", label: "Your dashboard", caption: "Home", href: "/cc/dashboard" },
  { id: "tracker", icon: "calendar", label: "Application tracker", caption: "All apps in flight", href: "/applications" },
  { id: "supplements", icon: "fileText", label: "Supplements", caption: "Per-school essay studio", href: "/cc/essays/supplements" },
  { id: "recs", icon: "mail", label: "Recommenders", caption: "Status + brag sheets", href: "/cc/recommenders" },
  { id: "tests", icon: "chartBar", label: "Test strategy", caption: "SAT / ACT plan", href: "/cc/test-strategy" },
  { id: "interviews", icon: "msgSquare", label: "Interviews", caption: "Mock interview practice", href: "/cc/interview-prep" },
  { id: "waitlist", icon: "hourglass", label: "Waitlist", caption: "LOCI generator", href: "/cc/waitlist" },
  { id: "activities", icon: "activity", label: "Activities", caption: "Common App optimizer", href: "/cc/activities-optimizer" },
  { id: "rigor", icon: "bookOpen", label: "Course rigor", caption: "Schedule analyzer", href: "/cc/courses" },
  { id: "major", icon: "compass", label: "Major exploration", caption: "Interest quiz + suggestions", href: "/cc/majors" },
  { id: "visits", icon: "mapPin", label: "Visits", caption: "Demonstrated interest log", href: "/cc/visits" },
  { id: "summer", icon: "sun", label: "Summer experiences", caption: "Plan summers", href: "/cc/summer" },
  { id: "schools", icon: "building", label: "Schools", caption: "School list builder", href: "/schools" },
  { id: "settings", icon: "settings", label: "Settings", caption: "Account, notifications, parent access", href: "/account/settings" },
];

export const ACTIONS: PaletteItem[] = [
  { id: "open-coach", icon: "cap", label: "Open Coach Kairos", caption: "Drawer · ⌘+K then / for slash mode" },
  { id: "translate", icon: "globe", label: "Translate brag sheet for parent", caption: "Urdu · Hindi · Punjabi · Spanish · others", href: "/cc/recommenders" },
  { id: "loci", icon: "edit3", label: "Generate LOCI", caption: "Letter of continued interest", href: "/cc/waitlist" },
  { id: "rigor-run", icon: "chartBar", label: "Run rigor analysis", caption: "Score this year's schedule", href: "/cc/courses" },
];

export const PALETTE_DATA = { PAGES, ACTIONS };

export type Group = { label: string; items: PaletteItem[] };

export function filterPalette(query: string): { groups: Group[]; isSlashMode: boolean; slashText: string } {
  const q = (query ?? "").trim();
  const isSlash = q.startsWith("/");
  const slashText = isSlash ? q.slice(1).trim() : "";
  const term = isSlash ? slashText.toLowerCase() : q.toLowerCase();

  if (!q) {
    return {
      groups: [
        { label: "Pages", items: PAGES.slice(0, 6) },
        { label: "Actions", items: ACTIONS.slice(0, 3) },
      ],
      isSlashMode: false,
      slashText: "",
    };
  }
  if (isSlash) {
    return { groups: [], isSlashMode: true, slashText };
  }

  const search = (label: string, source: PaletteItem[]) => {
    const matched = source.filter(
      (it) =>
        it.label.toLowerCase().includes(term) ||
        (it.caption ?? "").toLowerCase().includes(term),
    );
    return matched.length ? { label, items: matched } : null;
  };

  const groups: Group[] = [];
  const p = search("Pages", PAGES); if (p) groups.push(p);
  const a = search("Actions", ACTIONS); if (a) groups.push(a);

  return { groups, isSlashMode: false, slashText: "" };
}
