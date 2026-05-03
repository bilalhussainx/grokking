"use client";
import { Menu, Search } from "lucide-react";

interface Props {
  onMenu: () => void;
  onSearch: () => void;
}

export default function MobileHeader({ onMenu, onSearch }: Props) {
  return (
    <header
      className="sticky top-0 z-30 mobile-safe-top"
      style={{
        background: "rgba(5,8,13,.92)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div className="flex items-center justify-between px-3" style={{ height: 52 }}>
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="flex items-center justify-center"
          style={{ width: 36, height: 36 }}
        >
          <Menu className="w-5 h-5 text-white/80" />
        </button>
        <span
          className="text-[15px] tracking-tight font-semibold"
          aria-label="KairosLearn"
        >
          <span style={{ color: "#f2ede3" }}>Kairos</span>
          <em
            style={{
              color: "#d4a84b",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontStyle: "italic",
            }}
          >
            .ai
          </em>
        </span>
        <button
          type="button"
          onClick={onSearch}
          aria-label="Open search"
          className="flex items-center justify-center"
          style={{ width: 36, height: 36 }}
        >
          <Search className="w-5 h-5 text-white/80" />
        </button>
      </div>
    </header>
  );
}
