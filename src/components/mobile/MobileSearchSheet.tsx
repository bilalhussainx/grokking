"use client";

// MobileSearchSheet — full-viewport overlay for mobile search.
//
// Reuses palette catalog from src/components/nav/palette-data.ts so
// search results stay in sync with the desktop CommandPalette. Behaviour:
//   - autoFocus the input on open (mobile keyboards stay reliable when
//     focus happens on a real <input>, not a programmatically focused div).
//   - iOS visualViewport listener resizes the container to the visible
//     viewport so the keyboard doesn't hide the footer hint.
//   - Leading "/" flips into Coach Kairos mode — Enter calls
//     onSlashCommand(slashText) and closes the sheet, parent decides what
//     to do with the question (typically: open the coach drawer).
//   - Escape closes.

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, ChevronRight } from "lucide-react";
import { ICONS, filterPalette, type PaletteItem } from "@/components/nav/palette-data";

interface Props {
  open: boolean;
  onClose: () => void;
  onSlashCommand: (q: string) => void;
}

const SLASH_SUGGESTIONS = [
  "Why is my reach list so heavy?",
  "How do I balance my school list?",
  "What should I do this week?",
];

export default function MobileSearchSheet({ open, onClose, onSlashCommand }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus the real input on mount.
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // iOS visual viewport handling — keep the sheet sized to the visible
  // viewport so the keyboard doesn't hide the footer hint.
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const vv = window.visualViewport;
    const onResize = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${vv.height}px`;
      }
    };
    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, []);

  // Reset query when closing.
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const result = useMemo(() => filterPalette(query), [query]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "Enter" && result.isSlashMode) {
      e.preventDefault();
      onSlashCommand(result.slashText);
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={containerRef}
          role="dialog"
          aria-label="Search"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col mobile-safe-top"
          style={{ background: "#05080d" }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.28, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* Header row: back button + input */}
          <div className="flex items-center gap-2 px-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="flex items-center justify-center"
              style={{ width: 36, height: 36 }}
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </button>
            <div
              className="flex-1 flex items-center gap-2 px-3"
              style={{
                height: 42,
                background: "rgba(255,255,255,.04)",
                borderRadius: 10,
                border: result.isSlashMode
                  ? "1px solid rgba(212,175,55,.30)"
                  : "1px solid rgba(255,255,255,.08)",
              }}
            >
              <Search className="w-4 h-4 text-white/45" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search or type / to ask Coach Kairos"
                className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder:text-white/30"
                aria-label="Search input"
              />
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto pb-12">
            {result.isSlashMode ? (
              <div className="p-4">
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{
                    background: "rgba(212,175,55,.06)",
                    border: "1px solid rgba(212,175,55,.30)",
                  }}
                >
                  <p className="text-[10px] uppercase tracking-[0.16em] font-semibold mb-2" style={{ color: "#d4af37" }}>
                    Asking Coach Kairos
                  </p>
                  <p
                    className="text-[17px] italic"
                    style={{ color: "#f2ede3", fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {result.slashText || "Type your question…"}
                  </p>
                  <p className="text-[12px] text-white/55 mt-2">Tap Send to open the coach drawer.</p>
                </div>
                <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-white/45 px-2 mb-2">
                  Suggested follow-ups
                </p>
                {SLASH_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      onSlashCommand(s);
                      onClose();
                    }}
                    className="w-full text-left px-4 py-3 text-[14px] text-white/80 hover:bg-white/[0.04] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                {result.groups.map((group) => (
                  <div key={group.label}>
                    <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-white/45 px-4 pt-4 pb-2">
                      {group.label}
                    </p>
                    {group.items.map((item) => (
                      <SearchRow key={item.id} item={item} onSelect={onClose} />
                    ))}
                  </div>
                ))}
                {result.groups.length === 0 && !result.isSlashMode && query && (
                  <p className="px-4 py-8 text-center text-[14px] text-white/45">
                    No results. Try typing <span className="text-white/70">/</span> to ask Coach Kairos.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div
            className="mobile-safe-bottom px-4 py-2 text-center text-[11px] text-white/35"
            style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}
          >
            Type <span className="text-white/55">/</span> to ask Coach Kairos
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SearchRow({ item, onSelect }: { item: PaletteItem; onSelect: () => void }) {
  const Icon = ICONS[item.icon];
  const inner = (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors">
      <span
        className="inline-flex items-center justify-center rounded-md shrink-0"
        style={{ width: 36, height: 36, background: "rgba(255,255,255,.04)" }}
      >
        <Icon className="w-4 h-4 text-white/55" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-white truncate">{item.label}</p>
        {item.caption && <p className="text-[11px] text-white/45 truncate">{item.caption}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-white/30" />
    </div>
  );
  if (item.href) {
    return (
      <Link href={item.href} onClick={onSelect} className="block">
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        item.onSelect?.();
        onSelect();
      }}
      className="block w-full text-left"
    >
      {inner}
    </button>
  );
}
