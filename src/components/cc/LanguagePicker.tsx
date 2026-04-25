"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export type LanguageOption = {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
  mode?: "voice" | "text-only";
};

export function LanguagePicker({
  options,
  value,
  onChange,
  className = "",
}: {
  options: LanguageOption[];
  value: string;
  onChange: (code: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const current = options.find((o) => o.code === value) ?? options[0];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 text-[12px] font-medium"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          padding: "8px 12px",
          color: "var(--kl-gold-app, #D4AF37)",
          fontFamily: "var(--kl-font-sans, Inter, sans-serif)",
        }}
      >
        <span aria-hidden>{current?.flag}</span>
        <span>{current?.nativeLabel}</span>
        <ChevronDown className="w-3 h-3" style={{ marginLeft: 2 }} aria-hidden />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 z-20 min-w-[180px] max-h-[280px] overflow-y-auto"
          style={{
            background: "var(--kl-app-card, #141414)",
            border: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
            borderRadius: 12,
            padding: 4,
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.code === value;
            return (
              <li key={opt.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.code);
                    setOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-[12px] rounded-md"
                  style={{
                    color: isSelected ? "var(--kl-gold-app,#D4AF37)" : "rgba(255,255,255,0.80)",
                    background: isSelected ? "rgba(212,175,55,0.08)" : "transparent",
                    fontFamily: "var(--kl-font-sans, Inter, sans-serif)",
                  }}
                >
                  <span aria-hidden>{opt.flag}</span>
                  <span className="flex-1">{opt.nativeLabel}</span>
                  <span className="text-[10px] text-white/40">{opt.label}</span>
                  {opt.mode === "text-only" && (
                    <span className="text-[9px] uppercase tracking-wide text-white/40 ml-1">Text</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
