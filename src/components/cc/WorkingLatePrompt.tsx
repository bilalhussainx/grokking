"use client";

import { COACH_LANGUAGE_COUNT } from "@/lib/coach-language-claim";
import { useEffect, useState } from "react";
import { Moon, X } from "lucide-react";

const NAMED_LANGUAGES = ["English", "Hindi", "Punjabi", "Spanish", "French", "German", "Italian", "Dutch", "Japanese"];

const STORAGE_KEY = "kl-working-late-dismissed-date";
const LATE_HOUR_START = 22; // 10pm
const LATE_HOUR_END = 4;    // 4am

function isLateNight(d: Date): boolean {
  const h = d.getHours();
  return h >= LATE_HOUR_START || h < LATE_HOUR_END;
}

function todayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Feature 1B — gentle "we're here at 11pm" reminder shown once per night when
 * a student opens the platform after 10pm. The Pakistani family pays for the
 * counselor who picks up at midnight; this prompt makes that promise visible.
 *
 * Auto-dismisses after 12s; remembers dismissal per calendar date so reload
 * doesn't re-trigger the same evening.
 */
export default function WorkingLatePrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const now = new Date();
    if (!isLateNight(now)) return;
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === todayKey(now)) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 12000);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, todayKey(new Date()));
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 92,
        right: 24,
        zIndex: 9998,
        maxWidth: 320,
        background: "rgba(5,8,13,0.95)",
        border: "1px solid rgba(212,168,75,0.30)",
        backdropFilter: "blur(12px)",
        color: "#f2ede3",
        borderRadius: 14,
        padding: "14px 16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
      }}
    >
      <div className="flex items-start gap-3">
        <Moon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#d4a84b" }} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium leading-snug">
            Working late? Coach Kairos is here whenever you need.
          </p>
          <p className="text-[11.5px] mt-1 text-white/55">
            {NAMED_LANGUAGES.join(", ")} — and {COACH_LANGUAGE_COUNT - NAMED_LANGUAGES.length} more.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-white/40 hover:text-white/70 -mt-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
