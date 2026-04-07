// Daily missions auto-completion helpers.
// Per audit 2026-04-07: "Missions not interactive: Daily missions can't be
// marked complete from home page." This module gives any component a
// one-line way to mark a mission complete when the actual action happens.
//
// Each mission is tracked in localStorage so it works for guests and the
// reset logic stays in DailyMissions.tsx.

const STORAGE_KEY = "daily-missions";
const STORAGE_DATE_KEY = "daily-missions-date";

export type MissionId = "mock-interview" | "voice-tutor" | "lesson-complete";

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * Mark a mission complete. Safe to call from anywhere — will:
 *   - reset on a new day
 *   - dedupe (idempotent)
 *   - dispatch a custom event so any mounted DailyMissions widget refreshes
 *
 * @returns true if newly marked complete, false if already complete or SSR
 */
export function markMissionComplete(missionId: MissionId): boolean {
  if (typeof window === "undefined") return false;
  try {
    const today = todayString();
    const storedDate = localStorage.getItem(STORAGE_DATE_KEY);
    if (storedDate !== today) {
      localStorage.setItem(STORAGE_DATE_KEY, today);
      localStorage.setItem(STORAGE_KEY, "[]");
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    let completed: string[] = [];
    try {
      completed = stored ? JSON.parse(stored) : [];
    } catch {}
    if (completed.includes(missionId)) return false;
    completed.push(missionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    // Notify any mounted DailyMissions widget to re-read state
    window.dispatchEvent(new CustomEvent("daily-mission-complete", { detail: { missionId } }));
    return true;
  } catch {
    return false;
  }
}
