// src/hooks/useVoicePreference.ts
// Boolean preference toggle backed by localStorage. Mirrors the pattern
// used by CoachKairosContext for `voiceEnabled` (key
// `coach_kairos_voice_enabled`) so feature-side voice toggles
// (BrainstormChat, future TTS output controls, etc.) survive remounts and
// page navigation without re-introducing the same localStorage plumbing
// in every component.
//
// Storage convention: the value is the literal string "true" or "false".
// We deliberately don't JSON.parse so corrupted/foreign values fall to
// `false` instead of throwing.
import { useEffect, useState, useCallback } from "react";

export function useVoicePreference(
  storageKey: string,
  defaultValue = false,
): [boolean, (next: boolean) => void] {
  const [on, setOnState] = useState(defaultValue);

  // Rehydrate after mount. Doing this in useEffect (not useState init) is
  // intentional: it prevents an SSR/CSR hydration mismatch when the
  // component renders server-side (Next.js App Router) where localStorage
  // is unavailable.
  useEffect(() => {
    if (typeof window === "undefined") return;
    setOnState(window.localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  const setOn = useCallback(
    (next: boolean) => {
      setOnState(next);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, String(next));
      }
    },
    [storageKey],
  );

  return [on, setOn];
}
