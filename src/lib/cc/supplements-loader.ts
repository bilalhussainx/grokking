// Single source of truth for supplement prompt seeds.
//
// Previously each /api/cc/supplements/* route re-imported the US-only JSON
// directly. When the Canadian seed shipped (3018c29) it was never wired up
// because no route knew to load it. Centralizing here means new regions
// (currently CA + US, UK PS lives elsewhere because it's structurally
// different) merge in one place and every consumer gets them automatically.

import usSeed from "@/data/supplement-prompts-2026.json";
import caSeed from "@/data/canadian/ca-supplement-prompts-2026.json";

export interface SupplementPrompt {
  type: string;
  text: string;
  word_limit: number;
  required: boolean;
}

export interface SupplementSeedEntry {
  school_name: string;
  prompts: SupplementPrompt[];
  region: "US" | "CA";
}

const US_ENTRIES: SupplementSeedEntry[] = (usSeed as Omit<SupplementSeedEntry, "region">[]).map(
  (e) => ({ ...e, region: "US" as const }),
);
const CA_ENTRIES: SupplementSeedEntry[] = (caSeed as Omit<SupplementSeedEntry, "region">[]).map(
  (e) => ({ ...e, region: "CA" as const }),
);

const ALL_ENTRIES: SupplementSeedEntry[] = [...US_ENTRIES, ...CA_ENTRIES];

// Returns every seeded school across all supported regions.
export function getAllSupplementSeeds(): SupplementSeedEntry[] {
  return ALL_ENTRIES;
}

// Case-insensitive lookup by school name. Returns null if no seed exists.
// Both regions are searched — the LLM and UI don't have to know whether a
// school is US or CA, just whether we have prompts for it.
export function findSupplementSeed(schoolName: string): SupplementSeedEntry | null {
  const needle = schoolName.toLowerCase().trim();
  return ALL_ENTRIES.find((e) => e.school_name.toLowerCase() === needle) ?? null;
}
