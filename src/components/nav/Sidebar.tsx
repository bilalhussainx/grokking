"use client";

// Persistent left sidebar — variant-aware nav rail.
//
// Ports docs/superpowers/designs/handoff/src/sidebar.jsx into a TypeScript +
// Next.js component wired to:
//   - Real Next.js routing (each item has a real href)
//   - The app's Coach Kairos drawer (clicking the Tools → Coach row opens
//     the drawer in-place via CoachKairosContext, no navigation)
//   - localStorage persistence for the expanded/collapsed state
//   - The dashboard variant key (g9 / g10 / junior / senior_writing /
//     senior_post_submit / senior_decisions / transfer) — pulled from the
//     student's profile by the layout that hosts this component
//
// Active state is 3px gold left-border + gold icon + white label — never a
// fill. Section dividers stay visible on the collapsed rail as letter
// abbreviations (A / P / T). Apply section never disappears; on g9 it shows
// an italic "Unlocks junior year" caption.

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Calendar, FileText, Mail, BarChart3, MessageSquare, Hourglass,
  Activity, BookOpen, Compass, MapPin, Sun, GraduationCap, Settings,
  ChevronLeft, ChevronRight, Edit3, Users,
} from "lucide-react";
import { useCoachKairos } from "@/contexts/CoachKairosContext";

// Variant key — matches dashboard variants.ts. Senior phases collapse to a
// single sidebar shape since they share the same nav content; the design
// only distinguishes "senior-writing" vs "senior-decisions" for the
// waitlist-row pulse, which we drive via a separate `pulseWaitlist` prop.
export type SidebarGrade =
  | "g9" | "g10" | "junior"
  | "senior_writing" | "senior_post_submit" | "senior_decisions"
  | "transfer" | "unknown";

type IconName =
  | "home" | "calendar" | "fileText" | "mail" | "chartBar" | "msgSquare"
  | "hourglass" | "activity" | "bookOpen" | "compass" | "mapPin" | "sun"
  | "cap" | "settings" | "edit3" | "users";

const ICONS: Record<IconName, typeof Home> = {
  home: Home, calendar: Calendar, fileText: FileText, mail: Mail,
  chartBar: BarChart3, msgSquare: MessageSquare, hourglass: Hourglass,
  activity: Activity, bookOpen: BookOpen, compass: Compass, mapPin: MapPin,
  sun: Sun, cap: GraduationCap, settings: Settings, edit3: Edit3, users: Users,
};

type NavItem = {
  id: string;
  label: string;
  icon: IconName;
  href: string;
  // Which variant keys see this item. Senior phases share most items.
  grades: SidebarGrade[];
  // Optional override label/grades for transfer applicants.
  transferLabel?: string;
  transferGrades?: SidebarGrade[];
  // Tools/Coach row opens the drawer instead of navigating.
  drawer?: boolean;
  // Waitlist row pulses on first appearance for senior_decisions users.
  pulseOnAppear?: boolean;
};

type NavSection = {
  id: "apply" | "profile" | "tools";
  name: string;
  abbr: string;
  items: NavItem[];
  lockedFor?: SidebarGrade[];
  lockedCaption?: string;
};

const SENIOR_GRADES: SidebarGrade[] = [
  "senior_writing", "senior_post_submit", "senior_decisions",
];

const SECTIONS: NavSection[] = [
  {
    id: "apply", name: "Apply", abbr: "A",
    lockedFor: ["g9"], lockedCaption: "Unlocks junior year",
    items: [
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

function visibleFor(grade: SidebarGrade): NavSection[] {
  return SECTIONS.map((sec) => ({
    ...sec,
    items: sec.items.filter((it) =>
      it.grades.includes(grade) ||
      (it.transferGrades?.includes(grade) ?? false),
    ),
  }));
}

const STORAGE_KEY = "kairos_sidebar_mode";

export default function Sidebar({
  grade,
  pulseWaitlist = false,
}: {
  grade: SidebarGrade;
  pulseWaitlist?: boolean;
}) {
  const pathname = usePathname();
  const coach = useCoachKairos();
  // Default expanded — persisted across sessions.
  const [mode, setMode] = useState<"expanded" | "collapsed">("expanded");
  // Hydrate persisted mode after mount so SSR + first paint don't mismatch.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "collapsed") setMode("collapsed");
  }, []);
  const toggle = () => {
    setMode((prev) => {
      const next = prev === "expanded" ? "collapsed" : "expanded";
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  };

  const sections = visibleFor(grade);
  const W = mode === "expanded" ? 240 : 64;

  // Active row = whichever item's href matches the current pathname best.
  const isActive = (href: string): boolean => {
    if (href === "#coach") return false;
    if (pathname === "/cc/dashboard" && href === "#home") return true;
    if (href === pathname) return true;
    // Treat /cc/dashboard as home; anything starting with the href prefix matches.
    return href !== "/" && pathname.startsWith(href);
  };
  const isHome = pathname === "/cc/dashboard" || pathname === "/";

  return (
    <aside
      style={{
        width: W,
        background: "var(--kl-bg-deep, #05080d)",
        borderRight: "1px solid rgba(255,255,255,.06)",
        transition: "width .22s cubic-bezier(.65,0,.35,1)",
      }}
      className="hidden md:flex flex-col h-screen sticky top-0 shrink-0 overflow-hidden font-[Inter,sans-serif]"
      aria-label="Primary navigation"
    >
      {/* Brand row */}
      <div
        className="flex items-center"
        style={{
          height: 56,
          padding: mode === "expanded" ? "0 18px" : 0,
          justifyContent: mode === "expanded" ? "space-between" : "center",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          flexShrink: 0,
        }}
      >
        <Link href="/cc/dashboard" className="flex items-center" style={{ gap: mode === "expanded" ? 9 : 0 }}>
          <span
            className="inline-grid place-items-center font-medium"
            style={{
              width: 24, height: 24, background: "#d4af37", color: "#05080d",
              fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14,
            }}
          >
            k
          </span>
          {mode === "expanded" && (
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: "#f2ede3" }}>
              <em style={{ color: "#d4a84b", fontStyle: "italic" }}>Kairos</em>Learn
            </span>
          )}
        </Link>
        {mode === "expanded" && (
          <button
            onClick={toggle}
            title="Collapse"
            aria-label="Collapse sidebar"
            className="grid place-items-center cursor-pointer"
            style={{
              width: 24, height: 24, background: "transparent",
              border: "1px solid rgba(255,255,255,.10)", borderRadius: 6,
              color: "rgba(255,255,255,.55)",
            }}
          >
            <ChevronLeft size={12} />
          </button>
        )}
      </div>

      {/* Home — outside the section structure */}
      <div style={{ padding: "10px 8px 4px" }}>
        <NavRow
          mode={mode} icon="home" label="Your dashboard" href="/cc/dashboard"
          active={isHome}
        />
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-auto" style={{ padding: "4px 8px 12px" }}>
        {sections.map((sec) => (
          <NavSectionRender
            key={sec.id}
            mode={mode}
            section={sec}
            grade={grade}
            isActive={isActive}
            pulseWaitlist={pulseWaitlist}
            onCoach={() => coach.openWithVariant(grade)}
          />
        ))}
      </div>

      {/* Collapsed expand button at bottom */}
      {mode === "collapsed" && (
        <button
          onClick={toggle}
          title="Expand"
          aria-label="Expand sidebar"
          className="mx-auto cursor-pointer grid place-items-center"
          style={{
            margin: "10px auto 14px", width: 32, height: 32, background: "transparent",
            border: "1px solid rgba(255,255,255,.10)", borderRadius: 8,
            color: "rgba(255,255,255,.55)",
          }}
        >
          <ChevronRight size={12} strokeWidth={1.6} />
        </button>
      )}
    </aside>
  );
}

function NavSectionRender({
  mode, section, grade, isActive, pulseWaitlist, onCoach,
}: {
  mode: "expanded" | "collapsed";
  section: NavSection;
  grade: SidebarGrade;
  isActive: (href: string) => boolean;
  pulseWaitlist: boolean;
  onCoach: () => void;
}) {
  const locked = (section.lockedFor ?? []).includes(grade);
  const items = section.items;
  return (
    <div style={{ marginTop: 14 }}>
      {/* Divider header */}
      {mode === "expanded" ? (
        <div className="flex items-baseline justify-between" style={{ padding: "6px 10px 4px", gap: 8 }}>
          <span
            className="uppercase font-medium"
            style={{
              fontSize: 10, color: "rgba(255,255,255,.35)",
              letterSpacing: ".18em", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {section.name}
          </span>
          {locked && section.lockedCaption && (
            <span
              className="italic"
              style={{
                fontSize: 9.5, color: "rgba(212,175,55,.55)",
                letterSpacing: ".06em", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {section.lockedCaption}
            </span>
          )}
        </div>
      ) : (
        <div
          className="text-center"
          style={{
            padding: "6px 0 4px",
            fontSize: 10,
            color: locked ? "rgba(212,175,55,.45)" : "rgba(255,255,255,.30)",
            letterSpacing: ".04em", fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {section.abbr}
        </div>
      )}

      {locked && items.length === 0
        ? mode === "expanded" && (
            <div
              className="italic"
              style={{
                margin: "2px 10px 0", padding: "8px 10px",
                fontSize: 11, color: "rgba(255,255,255,.35)", lineHeight: 1.5,
              }}
            >
              Application tools appear when you&apos;re ready to apply.
            </div>
          )
        : items.length === 0
          ? mode === "expanded" && (
              <div
                className="italic"
                style={{
                  margin: "2px 10px 0", padding: "8px 10px",
                  fontSize: 11, color: "rgba(212,175,55,.55)", lineHeight: 1.5,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Finish the intake to unlock {section.name.toLowerCase()} tools.
              </div>
            )
          : items.map((it) => {
            const label = (grade === "transfer" && it.transferLabel) ? it.transferLabel : it.label;
            const active = it.drawer ? false : isActive(it.href);
            return (
              <NavRow
                key={it.id}
                mode={mode}
                icon={it.icon}
                label={label}
                href={it.href}
                active={active}
                dim={locked}
                pulse={Boolean(it.pulseOnAppear && pulseWaitlist)}
                drawer={it.drawer}
                onClick={it.drawer ? onCoach : undefined}
              />
            );
          })}
    </div>
  );
}

function NavRow({
  mode, icon, label, href, active, dim, pulse, drawer, onClick,
}: {
  mode: "expanded" | "collapsed";
  icon: IconName;
  label: string;
  href: string;
  active?: boolean;
  dim?: boolean;
  pulse?: boolean;
  drawer?: boolean;
  onClick?: () => void;
}) {
  const Ic = ICONS[icon] ?? Home;
  const sharedStyle: React.CSSProperties = {
    width: "100%", display: "flex", alignItems: "center",
    gap: mode === "expanded" ? 12 : 0,
    justifyContent: mode === "expanded" ? "flex-start" : "center",
    padding: mode === "expanded" ? "8px 10px 8px 13px" : "10px 0",
    background: "transparent",
    border: "none",
    borderLeft: active ? "3px solid #d4af37" : "3px solid transparent",
    color: active ? "#fff" : (dim ? "rgba(255,255,255,.30)" : "rgba(255,255,255,.65)"),
    cursor: dim ? "not-allowed" : "pointer",
    textAlign: "left",
    fontSize: 13, fontFamily: "'Inter', sans-serif",
    fontWeight: active ? 500 : 400,
    letterSpacing: "-.005em",
    transition: "background .12s ease, color .12s ease",
    position: "relative",
    textDecoration: "none",
  };
  const inner: ReactNode = (
    <>
      <span
        style={{
          color: active ? "#d4af37" : "inherit",
          width: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        <Ic size={16} strokeWidth={active ? 1.8 : 1.5} />
      </span>
      {mode === "expanded" && (
        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {label}
        </span>
      )}
      {mode === "expanded" && drawer && (
        <span
          className="uppercase"
          style={{
            fontSize: 9.5, color: "rgba(255,255,255,.35)",
            letterSpacing: ".10em", fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Drawer
        </span>
      )}
      {pulse && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            ...(mode === "expanded"
              ? { right: 12, top: "50%", transform: "translateY(-50%)" }
              : { right: 10, top: 8 }),
            width: 6, height: 6, borderRadius: 999,
            background: "#d4af37",
            boxShadow: "0 0 0 0 rgba(212,175,55,.6)",
            animation: "kairos-sb-pulse 1.6s infinite",
          }}
        />
      )}
    </>
  );

  // Drawer rows are buttons (no navigation). Otherwise Next.js Link.
  return (
    <div className="group/row relative">
      {drawer ? (
        <button type="button" onClick={onClick} style={sharedStyle} className="hover:bg-white/[.05]">
          {inner}
        </button>
      ) : (
        <Link href={href} style={sharedStyle} className="hover:bg-white/[.05]">
          {inner}
        </Link>
      )}
      {/* Tooltip on collapsed rail hover */}
      {mode === "collapsed" && (
        <span
          className="opacity-0 group-hover/row:opacity-100 pointer-events-none transition-opacity"
          style={{
            position: "absolute", left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)",
            background: "#0c1120", color: "#f2ede3",
            fontSize: 12, padding: "6px 10px", borderRadius: 6,
            border: "1px solid rgba(255,255,255,.10)", whiteSpace: "nowrap",
            zIndex: 10, fontFamily: "'Inter', sans-serif",
            boxShadow: "0 8px 20px rgba(0,0,0,.4)",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
