"use client";

// Daybreak app frame (GATE D4.2): one navigation rail on desktop, Today /
// Coach / Schools / More on phones, a quiet top bar, and sheets for More, Find
// a page and Sign out. It replaces the navy TopNav and the gold Sidebar on
// every route in APP_FRAME_PREFIXES. Coach never opens by itself: each Coach
// entry is an explicit tap and carries the AI badge.
import "./app-frame.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Building2, CalendarDays, CircleUser, FileText, Leaf, LogOut, MessageCircle,
  MessageSquare, MoreHorizontal, School, Search, Settings, Sun, UserPlus,
  UserRound, Users, Wallet, type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCounselorRole } from "@/hooks/useCounselorRole";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import AiBadge from "./AiBadge";
import Sheet from "./Sheet";
import { openFamilyMode } from "./coach-actions";
import {
  isActiveHref, isDaybreakPage, searchEntries, staffPrimary, staffTabs, studentPlanning, studentPrimary,
  studentTabs, type MobileTab, type NavEntry, type NavIcon, type ShellStage,
} from "./app-nav";

const ICONS: Record<NavIcon, LucideIcon> = {
  today: Sun, coach: MessageSquare, schools: School, calendar: CalendarDays, essays: FileText,
  activities: Leaf, cost: Wallet, interview: MessageCircle, family: Users, profile: UserRound,
  students: Users, team: UserPlus, services: FileText, payouts: Wallet, setup: Building2,
  history: School, settings: Settings, more: MoreHorizontal,
};

type Panel = "more" | "search" | "signout" | null;

export default function AppFrame({
  stage,
  audience = "student",
  children,
}: {
  stage: ShellStage;
  audience?: "student" | "staff";
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const { user, loading: authLoading, signOut } = useAuth();
  const role = useCounselorRole();
  const coach = useCoachKairos();
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");

  // A link inside a sheet navigated: close the sheet.
  useEffect(() => { setPanel(null); }, [pathname]);

  const guest = !authLoading && !user;
  const staff = audience === "staff" || role.isCounselor;
  // While the role lookup runs, assume membership so a member's rail doesn't
  // flash "Workspace setup". Team still waits for isHead.
  const staffRole = { isMember: role.isMember || role.loading, isHead: role.isHead };
  const primary: NavEntry[] = staff ? staffPrimary(staffRole) : studentPrimary(stage);
  const planning: NavEntry[] = staff ? [] : studentPlanning(stage);
  const tabs: MobileTab[] = staff ? staffTabs(staffRole) : studentTabs();
  const moreEntries: NavEntry[] = staff ? primary : [...primary.filter((e) => e.id !== "today"), ...planning];
  const results = searchEntries([...primary, ...planning], query);
  const home = staff ? "/counselor/dashboard" : "/cc/dashboard";

  function runAction(id: "coach" | "family") {
    setPanel(null);
    if (id === "coach") coach.openWithDraft("");
    else openFamilyMode(coach);
  }

  function renderEntry(e: NavEntry, className?: string) {
    const Icon = ICONS[e.icon];
    if (e.kind === "action") {
      return (
        <button key={e.id} type="button" className={className} onClick={() => runAction(e.id)}>
          <Icon aria-hidden="true" />
          <span>
            {e.label}
            {e.id === "coach" && <>{" "}<AiBadge /></>}
          </span>
        </button>
      );
    }
    return (
      <Link
        key={e.id}
        href={e.href}
        className={className}
        aria-current={isActiveHref(pathname, e.href) ? "page" : undefined}
        onClick={() => setPanel(null)}
      >
        <Icon aria-hidden="true" />
        <span>{e.label}</span>
      </Link>
    );
  }

  const brand = (extra = "") => (
    <Link className={`af-brand ${extra}`} href={home}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/kairos-192.png" width={36} height={36} alt="" />
      KairosLearn
    </Link>
  );

  return (
    <div className="af-root">
      <a className="af-skip" href="#af-main">Skip to content</a>

      <aside className="af-rail af-db" aria-label="App">
        {brand()}
        {!guest && (
          <>
            <p className="af-rail-label">
              {staff ? (staffRole.isMember ? "COUNSELOR WORKSPACE" : "COUNSELOR ACCOUNT") : "YOUR SPACE"}
            </p>
            <nav aria-label="Primary">
              {primary.map((e) => renderEntry(e, "af-nav-item"))}
              {!staff && (
                <button type="button" className="af-nav-item" onClick={() => setPanel("more")}>
                  <MoreHorizontal aria-hidden="true" />
                  <span>More planning tools</span>
                </button>
              )}
            </nav>
            <div className="af-rail-bottom">
              <Link className="af-nav-item" href="/settings" aria-current={isActiveHref(pathname, "/settings") ? "page" : undefined}>
                <Settings aria-hidden="true" />
                <span>Settings</span>
              </Link>
              <button type="button" className="af-nav-item" onClick={() => setPanel("signout")}>
                <LogOut aria-hidden="true" />
                <span>Sign out</span>
              </button>
            </div>
          </>
        )}
      </aside>

      <div className="af-workspace">
        <header className="af-topbar af-db">
          {brand("af-brand--phone")}
          <span className="af-top-title">{staff ? "Your workspace" : "Your planning space"}</span>
          {guest ? (
            <div className="af-top-actions">
              <Link href="/login">Sign in</Link>
            </div>
          ) : (
            <div className="af-top-actions">
              <button type="button" aria-label="Find a page" onClick={() => { setQuery(""); setPanel("search"); }}>
                <Search aria-hidden="true" />
                <span className="af-desktop-only">Find a page</span>
              </button>
              <Link href="/settings" aria-label="Your account and settings">
                <CircleUser aria-hidden="true" />
                <span className="af-desktop-only">Your account</span>
              </Link>
            </div>
          )}
        </header>
        {/* Daybreak page bodies get the frame's element styles; legacy bodies
            keep their dark surface and are untouched by them (see app-frame.css). */}
        <main
          id="af-main"
          className={isDaybreakPage(pathname) ? "af-main af-db" : "af-main af-legacy kl-surface-app"}
          tabIndex={-1}
        >
          {children}
        </main>
        {!staff && <footer className="af-foot af-db">Your story stays yours. You write every essay.</footer>}
      </div>

      {!guest && (
        <nav className="af-tabs af-db" aria-label="Phone">
          {tabs.map((t) => {
            const Icon = ICONS[t.icon];
            if (t.kind === "link") {
              return (
                <Link key={t.id} href={t.href} aria-current={isActiveHref(pathname, t.href) ? "page" : undefined}>
                  <Icon aria-hidden="true" />
                  <span>{t.label}</span>
                </Link>
              );
            }
            return (
              <button key={t.id} type="button" onClick={() => (t.kind === "coach" ? runAction("coach") : setPanel("more"))}>
                <Icon aria-hidden="true" />
                <span>
                  {t.label}
                  {t.kind === "coach" && <>{" "}<AiBadge /></>}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {panel === "more" && (
        <Sheet title={staff ? "Your workspace" : "Your planning space"} onClose={() => setPanel(null)}>
          <div className="af-sheet-links">{moreEntries.map((e) => renderEntry(e))}</div>
          {!staff && stage === "g9" && (
            <section className="af-sheet-group">
              <h3>Application tools come later</h3>
              <p>Essays, applications and interview prep aren&apos;t available in grade 9.</p>
              <Link className="af-quiet" href="/cc/dashboard?blocked=grade9" onClick={() => setPanel(null)}>What can I use now?</Link>
            </section>
          )}
          <section className="af-sheet-group">
            <h3>Your account</h3>
            <div className="af-sheet-links">
              <Link href="/settings"><Settings aria-hidden="true" />Settings &amp; billing</Link>
              <button type="button" onClick={() => setPanel("signout")}><LogOut aria-hidden="true" />Sign out</button>
            </div>
          </section>
        </Sheet>
      )}

      {panel === "search" && (
        <Sheet title="Find a page" onClose={() => setPanel(null)} focusSelector="#af-search">
          <label htmlFor="af-search">Search your pages</label>
          <input
            id="af-search"
            className="af-search"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try essays, cost or profile"
          />
          {results.length > 0 ? (
            <div className="af-sheet-links">{results.map((e) => renderEntry(e))}</div>
          ) : (
            <p>No matching page. Try another word.</p>
          )}
        </Sheet>
      )}

      {panel === "signout" && (
        <Sheet title="Sign out of KairosLearn?" onClose={() => setPanel(null)}>
          <p>Your work stays in your account.</p>
          <div className="af-sheet-actions">
            <button type="button" className="af-primary" onClick={() => void signOut()}>Sign out</button>
            <button type="button" onClick={() => setPanel(null)}>Stay here</button>
          </div>
        </Sheet>
      )}
    </div>
  );
}
