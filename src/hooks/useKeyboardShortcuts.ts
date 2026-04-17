"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ShortcutOptions {
  courseSlug?: string;
  prevLessonSlug?: string | null;
  nextLessonSlug?: string | null;
  onToggleHint?: () => void;
}

/**
 * Global keyboard shortcuts for lesson navigation.
 * Only active when no input/textarea is focused.
 *
 * Shortcuts:
 * - N: Next lesson
 * - P: Previous lesson
 * - H: Toggle hint panel (Coach Kairos)
 * - ?: Show shortcuts help (dispatches event)
 */
export function useKeyboardShortcuts({
  courseSlug,
  prevLessonSlug,
  nextLessonSlug,
  onToggleHint,
}: ShortcutOptions) {
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest("[role='textbox']") ||
        target.closest(".monaco-editor")
      ) {
        return;
      }

      // Don't trigger with modifier keys (except for Ctrl+K which is handled by GlobalSearch)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "n":
          if (courseSlug && nextLessonSlug) {
            e.preventDefault();
            router.push(`/course/${courseSlug}/${nextLessonSlug}`);
          }
          break;

        case "p":
          if (courseSlug && prevLessonSlug) {
            e.preventDefault();
            router.push(`/course/${courseSlug}/${prevLessonSlug}`);
          }
          break;

        case "h":
          if (onToggleHint) {
            e.preventDefault();
            onToggleHint();
          }
          break;

        case "?":
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("show-shortcuts-help"));
          break;
      }
    },
    [courseSlug, prevLessonSlug, nextLessonSlug, onToggleHint, router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
