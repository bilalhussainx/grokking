// src/components/mobile/CoachFAB.tsx
"use client";
import { GraduationCap } from "lucide-react";

export default function CoachFAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Coach Kairos"
      className="fixed flex items-center justify-center rounded-full mobile-safe-bottom z-30"
      style={{
        right: 14,
        bottom: 78, // 60 (tab bar) + 18 gap
        width: 52,
        height: 52,
        background: "#d4af37",
        color: "#000",
        boxShadow: "0 12px 32px rgba(212,175,55,.30), 0 4px 12px rgba(0,0,0,.45)",
      }}
    >
      <GraduationCap className="w-6 h-6" strokeWidth={2} />
    </button>
  );
}
