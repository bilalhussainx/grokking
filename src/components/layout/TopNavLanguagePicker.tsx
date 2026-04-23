"use client";

import { useState, useSyncExternalStore } from "react";
import { LanguagePicker, type LanguageOption } from "@/components/cc/LanguagePicker";

const COACH_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English",    nativeLabel: "English",    flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "es", label: "Spanish",    nativeLabel: "Español",    flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "fr", label: "French",     nativeLabel: "Français",   flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "de", label: "German",     nativeLabel: "Deutsch",    flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "it", label: "Italian",    nativeLabel: "Italiano",   flag: "\u{1F1EE}\u{1F1F9}" },
  { code: "nl", label: "Dutch",      nativeLabel: "Nederlands", flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "ja", label: "Japanese",   nativeLabel: "日本語",      flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "hi", label: "Hindi",      nativeLabel: "हिन्दी",      flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "pa", label: "Punjabi",    nativeLabel: "ਪੰਜਾਬੀ",       flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "ur", label: "Urdu",       nativeLabel: "اردو",        flag: "\u{1F1F5}\u{1F1F0}" },
];

const STORAGE_KEY = "coach-language";

// Server-safe read of the stored coach language. Renders "en" on the server and
// first client tick, then flips to the localStorage value once hydrated —
// useSyncExternalStore handles the SSR/client snapshot split without useEffect.
function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener("coach-language-change", handler as EventListener);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("coach-language-change", handler as EventListener);
  };
}
function getSnapshot(): string {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem(STORAGE_KEY) || "en";
}
function getServerSnapshot(): string {
  return "en";
}

export default function TopNavLanguagePicker({ className = "" }: { className?: string }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [override, setOverride] = useState<string | null>(null);
  const value = override ?? stored;

  const handleChange = (code: string) => {
    setOverride(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore quota or sandboxed storage */
    }
    // Notify any listeners (Coach Kairos, Sarvam routes) without a full reload.
    window.dispatchEvent(new CustomEvent("coach-language-change", { detail: code }));
  };

  return (
    <LanguagePicker
      options={COACH_LANGUAGES}
      value={value}
      onChange={handleChange}
      className={className}
    />
  );
}
