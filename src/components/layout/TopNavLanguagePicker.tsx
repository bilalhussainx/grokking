"use client";

import { useState, useSyncExternalStore } from "react";
import { LanguagePicker, type LanguageOption } from "@/components/cc/LanguagePicker";
import { COACH_LANGUAGES } from "@/lib/cc/coach-languages";

const LANG_OPTIONS: LanguageOption[] = COACH_LANGUAGES.map((l) => ({
  code: l.code,
  label: l.name,
  nativeLabel: l.nativeName,
  flag: l.flag,
  mode: l.mode,
}));

const STORAGE_KEY = "coach-language";

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
  return localStorage.getItem(STORAGE_KEY) || localStorage.getItem("coach_kairos_language") || "en";
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
      localStorage.setItem("coach_kairos_language", code);
    } catch {
      /* ignore quota or sandboxed storage */
    }
    window.dispatchEvent(new CustomEvent("coach-language-change", { detail: code }));
    fetch("/api/cc/profile/voice", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: code }),
    }).catch(() => {
      /* non-fatal */
    });
  };

  return (
    <LanguagePicker
      options={LANG_OPTIONS}
      value={value}
      onChange={handleChange}
      className={className}
    />
  );
}
