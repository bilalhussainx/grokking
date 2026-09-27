"use client";

// Cmd+K command palette. Modal overlay + grouped search across pages,
// schools, essays, recommenders, actions. Leading "/" flips into "Ask Coach
// Kairos" mode — Enter opens the coach drawer with the typed question
// pre-loaded.
//
// Ports docs/superpowers/designs/handoff/src/palette.jsx into a TypeScript
// component wired to:
//   - Real Next.js navigation for Pages results
//   - CoachKairosContext for slash-mode question handoff
//   - Global Cmd+K / Ctrl+K listener (registered once at the layout level)
//
// Active row uses the same gold-left-border + light-gold-bg treatment as
// the Sidebar, keeping the visual language consistent.

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Search, GraduationCap, Home, CornerDownLeft } from "lucide-react";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import {
  ICONS,
  filterPalette,
  type PaletteItem,
} from "./palette-data";

export default function CommandPalette() {
  const router = useRouter();
  const coach = useCoachKairos();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Global Cmd+K / Ctrl+K toggle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    // The TopNav search button asks for the palette with this event.
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-global-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-global-search", onOpen);
    };
  }, [open]);

  // Reset state on close + autofocus on open.
  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      setQuery("");
      // Defer focus until after render.
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const { groups, isSlashMode, slashText } = useMemo(() => filterPalette(query), [query]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  // Bound activeIndex so out-of-bounds doesn't render highlight.
  const activeIdx = flat.length === 0 ? -1 : Math.min(activeIndex, flat.length - 1);

  const select = (item: PaletteItem) => {
    setOpen(false);
    if (item.id === "open-coach") {
      coach.open();
      return;
    }
    if (item.onSelect) {
      item.onSelect();
      return;
    }
    if (item.href) {
      router.push(item.href);
    }
  };

  const submitSlash = () => {
    setOpen(false);
    coach.open();
    if (slashText.trim()) {
      // Hand the typed question to the coach via sendMessage on next tick
      // (so the drawer is visibly open before the bubble lands).
      setTimeout(() => coach.sendMessage(slashText.trim(), { sourceEvent: "manual" }), 50);
    }
  };

  // Arrow-key + Enter handling.
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (isSlashMode) {
      if (e.key === "Enter") {
        e.preventDefault();
        submitSlash();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (flat.length === 0 ? 0 : (i + 1) % flat.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (flat.length === 0 ? 0 : (i - 1 + flat.length) % flat.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[activeIdx];
      if (item) select(item);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[10000] flex items-start justify-center"
      style={{
        background: "rgba(0,0,0,.65)",
        backdropFilter: "blur(8px)",
        paddingTop: 120,
        fontFamily: "'Inter', sans-serif",
      }}
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col"
        style={{
          width: 620, maxHeight: 560, maxWidth: "calc(100vw - 32px)",
          background: "#0c1120",
          border: "1px solid rgba(255,255,255,.10)",
          borderRadius: 14,
          boxShadow: "0 30px 80px -20px rgba(0,0,0,.7), 0 0 0 1px rgba(212,175,55,.10)",
          overflow: "hidden",
        }}
      >
        {/* Search input */}
        <div
          className="flex items-center"
          style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,.08)", gap: 12 }}
        >
          <span style={{ color: isSlashMode ? "#d4a84b" : "rgba(255,255,255,.40)" }}>
            {isSlashMode ? <GraduationCap size={16} /> : <Search size={16} />}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
            onKeyDown={onKey}
            placeholder="Search pages, schools, essays, actions… or / to ask Coach"
            className="flex-1 bg-transparent outline-none border-0 text-white placeholder-white/40"
            style={{ fontSize: 16, fontWeight: 300 }}
            aria-label="Search command palette"
          />
          <kbd
            className="uppercase"
            style={{
              fontSize: 10, padding: "3px 6px", borderRadius: 4,
              background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.10)",
              color: "rgba(255,255,255,.55)", fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: ".06em",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Slash-mode helper */}
        {isSlashMode && (
          <div
            style={{
              padding: "14px 18px",
              background: "rgba(212,175,55,.04)",
              borderBottom: "1px solid rgba(212,175,55,.15)",
              fontSize: 13, color: "#f2ede3", lineHeight: 1.5,
            }}
          >
            <div
              className="uppercase"
              style={{
                fontSize: 10.5, color: "#d4a84b", letterSpacing: ".18em",
                marginBottom: 6, fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Asking Coach Kairos
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 18,
                fontStyle: "italic", color: "#d4a84b", lineHeight: 1.4,
              }}
            >
              {slashText ? `"${slashText}"` : "Type your question…"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", marginTop: 8 }}>
              Press{" "}
              <kbd
                style={{
                  padding: "1px 5px", borderRadius: 3,
                  background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.10)",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                }}
              >
                ↵
              </kbd>{" "}
              to open the coach drawer with this question pre-loaded.
            </div>
          </div>
        )}

        {/* Results */}
        {!isSlashMode && (
          <div className="flex-1 overflow-auto" style={{ padding: "8px 0" }}>
            {groups.length === 0 ? (
              <div
                className="text-center"
                style={{ padding: "40px 18px", color: "rgba(255,255,255,.45)", fontSize: 13 }}
              >
                No matches. Try a school name, essay phase, or &ldquo;LOCI&rdquo;.
              </div>
            ) : (
              groups.map((g) => (
                <div key={g.label} style={{ padding: "4px 0" }}>
                  <div
                    className="uppercase"
                    style={{
                      padding: "8px 18px 4px", fontSize: 10,
                      color: "rgba(255,255,255,.40)",
                      letterSpacing: ".18em",
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    }}
                  >
                    {g.label}
                  </div>
                  {g.items.map((it) => {
                    const flatIdx = flat.findIndex((f) => f.id === it.id);
                    const isActive = flatIdx === activeIdx;
                    return (
                      <PaletteRow
                        key={`${g.label}-${it.id}`}
                        item={it}
                        active={isActive}
                        onClick={() => select(it)}
                        onHover={() => setActiveIndex(flatIdx)}
                      />
                    );
                  })}
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "10px 18px", borderTop: "1px solid rgba(255,255,255,.08)",
            fontSize: 11, color: "rgba(255,255,255,.50)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <div className="flex items-center" style={{ gap: 14 }}>
            <span className="inline-flex items-center" style={{ gap: 5 }}>
              <Kbd>↑↓</Kbd> navigate
            </span>
            <span className="inline-flex items-center" style={{ gap: 5 }}>
              <Kbd>↵</Kbd> select
            </span>
          </div>
          <div className="inline-flex items-center" style={{ gap: 6, color: "#d4a84b" }}>
            Press{" "}
            <Kbd gold>/</Kbd> to ask Coach Kairos instead
          </div>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children, gold }: { children: ReactNode; gold?: boolean }) {
  return (
    <kbd
      style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
        padding: "2px 5px", borderRadius: 3,
        background: gold ? "rgba(212,175,55,.08)" : "rgba(255,255,255,.05)",
        border: "1px solid " + (gold ? "rgba(212,175,55,.30)" : "rgba(255,255,255,.10)"),
        color: gold ? "#d4a84b" : "rgba(255,255,255,.65)",
      }}
    >
      {children}
    </kbd>
  );
}

function PaletteRow({
  item, active, onClick, onHover,
}: {
  item: PaletteItem;
  active: boolean;
  onClick: () => void;
  onHover: () => void;
}) {
  const Ic = ICONS[item.icon] ?? Home;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      className="w-full flex items-center text-left cursor-pointer"
      style={{
        gap: 12, padding: "8px 18px 8px 15px",
        borderLeft: active ? "3px solid #d4af37" : "3px solid transparent",
        background: active ? "rgba(212,175,55,.06)" : "transparent",
        transition: "background .12s ease",
        border: "none",
        borderLeftWidth: 3,
        borderLeftStyle: "solid",
        borderLeftColor: active ? "#d4af37" : "transparent",
      }}
    >
      <span
        className="grid place-items-center shrink-0"
        style={{
          width: 28, height: 28, borderRadius: 7,
          background: active ? "rgba(212,175,55,.10)" : "rgba(255,255,255,.04)",
          border: "1px solid " + (active ? "rgba(212,175,55,.30)" : "rgba(255,255,255,.06)"),
          color: active ? "#d4a84b" : "rgba(255,255,255,.65)",
        }}
      >
        <Ic size={14} strokeWidth={active ? 1.8 : 1.5} />
      </span>
      <span className="flex-1 min-w-0">
        <span
          className="block truncate"
          style={{
            fontSize: 13.5, color: active ? "#fff" : "#f2ede3",
            fontWeight: active ? 500 : 400, letterSpacing: "-.005em",
          }}
        >
          {item.label}
        </span>
        {item.caption && (
          <span
            className="block truncate"
            style={{ fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 1 }}
          >
            {item.caption}
          </span>
        )}
      </span>
      {active && (
        <span style={{ color: "rgba(255,255,255,.45)" }}>
          <CornerDownLeft size={12} />
        </span>
      )}
    </button>
  );
}
