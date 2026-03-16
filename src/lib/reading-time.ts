import type { Module } from "@/data/types";

/**
 * Estimate reading time for a markdown lesson in minutes.
 * Prose: 200 wpm, code blocks: 50 wpm.
 */
export function estimateReadingTime(markdown: string): number {
  // Extract code blocks
  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeBlocks = markdown.match(codeBlockRegex) || [];
  const codeText = codeBlocks.join(" ");
  const proseText = markdown.replace(codeBlockRegex, "");

  const proseWords = proseText.split(/\s+/).filter(Boolean).length;
  const codeWords = codeText.split(/\s+/).filter(Boolean).length;

  const minutes = proseWords / 200 + codeWords / 50;
  return Math.max(1, Math.ceil(minutes));
}

/**
 * Format minutes into a human-readable string.
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 60) {
    return `~${minutes} min read`;
  }
  const hours = minutes / 60;
  if (hours === Math.floor(hours)) {
    return `~${hours} hour${hours > 1 ? "s" : ""}`;
  }
  return `~${hours.toFixed(1)} hours`;
}

/**
 * Estimate total course time from its modules.
 */
export function estimateCourseTime(modules: Module[]): string {
  let totalMinutes = 0;
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      totalMinutes += estimateReadingTime(lesson.content);
    }
  }

  if (totalMinutes < 60) {
    return `~${totalMinutes} min`;
  }
  const hours = Math.round(totalMinutes / 60);
  return `~${hours} hour${hours > 1 ? "s" : ""}`;
}
