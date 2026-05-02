"use client";
import { Home, GraduationCap, Search, MessageSquare, User, Lock } from "lucide-react";
import type { VariantKey } from "@/app/cc/dashboard/variants";

export type TabId = "home" | "apply" | "search" | "coach" | "profile";

interface TabSpec {
  id: TabId;
  label: string;
  icon: typeof Home;
  locked?: boolean;
  lockedCaption?: string;
}

// Grade-aware Apply tab. Source: handoff `tabsFor()` in
// docs/superpowers/designs/mobile/dashboard/g11.html lines ~1276-1330.
function tabsFor(grade: VariantKey): TabSpec[] {
  const home: TabSpec = { id: "home", label: "Home", icon: Home };
  const search: TabSpec = { id: "search", label: "Search", icon: Search };
  const coach: TabSpec = { id: "coach", label: "Coach", icon: MessageSquare };
  const profile: TabSpec = { id: "profile", label: "Profile", icon: User };

  let apply: TabSpec;
  if (grade === "g9") {
    apply = { id: "apply", label: "Apply", icon: GraduationCap, locked: true, lockedCaption: "Unlocks junior year" };
  } else if (grade === "g10") {
    apply = { id: "apply", label: "Tests", icon: GraduationCap };
  } else if (grade === "transfer") {
    apply = { id: "apply", label: "Why-Transfer", icon: GraduationCap };
  } else {
    apply = { id: "apply", label: "Apply", icon: GraduationCap };
  }

  return [home, apply, search, coach, profile];
}

export default function BottomTabBar({
  grade,
  active,
  onTab,
}: {
  grade: VariantKey;
  active: TabId;
  onTab: (tab: TabId) => void;
}) {
  const tabs = tabsFor(grade);
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 mobile-safe-bottom z-40"
      style={{
        background: "rgba(5,8,13,.92)",
        backdropFilter: "blur(18px)",
        borderTop: "1px solid rgba(255,255,255,.08)",
      }}
      role="navigation"
      aria-label="Primary"
    >
      <div className="grid grid-cols-5 items-stretch" style={{ height: 60 }}>
        {tabs.map((t) => {
          const isActive = active === t.id;
          const disabled = t.locked === true;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              aria-label={t.locked ? `${t.label} (locked) — ${t.lockedCaption ?? ""}` : t.label}
              aria-disabled={disabled}
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                if (disabled) return;
                onTab(t.id);
              }}
              className={`relative flex flex-col items-center justify-center gap-1 ${
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              style={{
                color: isActive ? "#d4af37" : "rgba(255,255,255,.55)",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {isActive && (
                <span
                  aria-hidden
                  className="absolute top-0 rounded-b"
                  style={{ width: 24, height: 2, background: "#d4af37" }}
                />
              )}
              <span className="relative">
                <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 1.9 : 1.6} />
                {disabled && (
                  <span
                    aria-hidden
                    className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full"
                    style={{ width: 11, height: 11, background: "#0a0e16", border: "1px solid rgba(212,175,55,.4)" }}
                  >
                    <Lock className="w-[7px] h-[7px] text-[#d4af37]" />
                  </span>
                )}
              </span>
              <span className="text-[10.5px]">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
