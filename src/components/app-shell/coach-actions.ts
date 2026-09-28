import { FAMILY_MODE_LANGUAGES } from "@/lib/cc/family-mode-strings";

type FamilyCapableCoach = { language: string; open: () => void; toggleFamilyMode: (on?: boolean) => void };

// Family mode is a Coach action, not a route. When the current Coach language
// has no family mode, open Coach instead: its header explains why the
// hand-to-parent button is unavailable.
export function openFamilyMode(coach: FamilyCapableCoach): void {
  if ((FAMILY_MODE_LANGUAGES as readonly string[]).includes(coach.language)) coach.toggleFamilyMode(true);
  else coach.open();
}
