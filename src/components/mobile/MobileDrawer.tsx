"use client";

// MobileDrawer — slide-from-left primary navigation for the mobile shell.
//
// Reuses the same IA the persistent Sidebar consumes (visibleFor + ICONS
// from src/components/nav/sidebar-data.ts) so adding/removing/relabeling
// nav items only happens in one place. Behaviour:
//   - Scrim click or swipe-left past 100px dismisses the drawer.
//   - Tools → Coach row routes through CoachKairosContext.openWithVariant
//     instead of navigating, mirroring Sidebar.
//   - Active row gets the same 3px gold left-border treatment.
//   - Apply section locked-state (g9) shows the "Unlocks junior year"
//     caption but no items, matching Sidebar.

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import {
  ICONS,
  visibleFor,
  type SidebarGrade,
  type NavItem,
  type NavSection,
} from "@/components/nav/sidebar-data";
import { useCoachKairos } from "@/contexts/CoachKairosContext";

interface Props {
  open: boolean;
  grade: SidebarGrade;
  onClose: () => void;
  pulseWaitlist?: boolean;
}

export default function MobileDrawer({ open, grade, onClose, pulseWaitlist = false }: Props) {
  const pathname = usePathname();
  const coach = useCoachKairos();
  const sections = visibleFor(grade);

  const handleItemClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.drawer) {
      e.preventDefault();
      coach.openWithVariant(grade);
      onClose();
      return;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            data-testid="mobile-drawer-scrim"
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(0,0,0,.55)",
              backdropFilter: "blur(4px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.aside
            role="complementary"
            aria-label="Navigation"
            className="fixed top-0 bottom-0 left-0 mobile-safe-top z-50 flex flex-col"
            style={{
              width: "84vw",
              maxWidth: 320,
              background: "#05080d",
              boxShadow: "6px 0 30px rgba(0,0,0,.5)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: [0.65, 0, 0.35, 1] }}
            drag="x"
            dragConstraints={{ left: -320, right: 0 }}
            dragElastic={0}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) onClose();
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4" style={{ minHeight: 60 }}>
              <span className="text-lg font-semibold tracking-tight">
                <span style={{ color: "#f2ede3" }}>Kairos</span>
                <em
                  style={{
                    color: "#d4a84b",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 400,
                  }}
                >
                  .ai
                </em>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 -mr-2"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Scrollable section list */}
            <nav className="flex-1 overflow-y-auto py-2">
              {sections.map((section) => (
                <DrawerSection
                  key={section.id}
                  section={section}
                  grade={grade}
                  pathname={pathname}
                  pulseWaitlist={pulseWaitlist}
                  onItemClick={handleItemClick}
                />
              ))}
            </nav>

            {/* Footer */}
            <div
              className="mobile-safe-bottom px-4 py-3 border-t border-white/5 flex items-center justify-between text-[12px]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span className="text-white/35">v1.0.0</span>
              <Link href="/account/sign-out" className="text-white/55 hover:text-white">
                Sign out
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerSection({
  section,
  grade,
  pathname,
  pulseWaitlist,
  onItemClick,
}: {
  section: NavSection;
  grade: SidebarGrade;
  pathname: string | null;
  pulseWaitlist: boolean;
  onItemClick: (item: NavItem, e: React.MouseEvent) => void;
}) {
  const isLocked = section.lockedFor?.includes(grade) ?? false;
  return (
    <div className="px-2 py-3">
      <div className="px-3 mb-2 flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex items-center justify-center rounded-full text-[10px] font-semibold"
          style={{
            width: 18,
            height: 18,
            background: "rgba(212,175,55,.15)",
            color: "#d4af37",
          }}
        >
          {section.abbr}
        </span>
        <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-white/55">
          {section.name}
        </span>
      </div>

      {isLocked && section.lockedCaption && (
        <>
          <p className="px-3 text-[12px] italic" style={{ color: "#d4af37" }}>
            {section.lockedCaption}
          </p>
          <p className="px-3 mt-1 text-[12px] italic text-white/35">
            Application tools appear when you&apos;re ready to apply.
          </p>
        </>
      )}

      {!isLocked && section.items.length === 0 && (
        <p className="px-3 text-[12px] italic text-white/35">
          Nothing here yet for your stage.
        </p>
      )}

      {!isLocked &&
        section.items.map((item) => {
          const Icon = ICONS[item.icon];
          const label =
            grade === "transfer" && item.transferLabel ? item.transferLabel : item.label;
          const active = pathname === item.href;
          const isPulse = item.pulseOnAppear && pulseWaitlist;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => onItemClick(item, e)}
              className="flex items-center gap-3 px-3 py-2.5 transition-colors"
              style={{
                borderLeft: active ? "3px solid #d4af37" : "3px solid transparent",
                background: active ? "rgba(255,255,255,.04)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,.70)",
                fontWeight: active ? 500 : 400,
              }}
            >
              <span
                className="inline-flex items-center justify-center"
                style={{
                  width: 18,
                  height: 18,
                  color: active ? "#d4af37" : "rgba(255,255,255,.55)",
                  animation: isPulse ? "sb-pulse 1.6s infinite" : undefined,
                  borderRadius: isPulse ? "50%" : undefined,
                }}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2 : 1.6} />
              </span>
              <span className="text-[14px]">{label}</span>
            </Link>
          );
        })}
    </div>
  );
}
