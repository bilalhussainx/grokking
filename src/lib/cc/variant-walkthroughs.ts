// Per-variant opening message for Coach Kairos. When the user opens the
// drawer from the adaptive dashboard, we seed a single SHORT assistant
// turn that asks ONE intake question — the kind of opening a real
// counselor would lead with. The full step-by-step path then unfolds
// turn by turn, in the student's chosen language, driven by the LLM.
//
// History: this file used to ship 5-bullet "here's your whole roadmap"
// walls of text per variant. The dashboard variant didn't matter — the
// student just saw a paragraph dump in English and didn't know where to
// start. Replaced 2026-05-04 with a single-question opening per variant
// after user feedback ("should communicate step by step and not have a
// message initially listing everything at once").
//
// Use {name} as a placeholder — substitution happens client-side in
// CoachKairosContext using the authenticated user's first name. If the
// student has no name on file, the greeting drops the salutation and
// leads with the question.

import type { VariantKey } from "@/app/cc/dashboard/variants";

export type WalkthroughSeed = {
  // Mode the coach should switch into. Used downstream by the
  // coach-mode-detector so the system prompt matches.
  mode: string;
  // One assistant message rendered as the opening turn. Plain text. Use
  // {name} once at the start; runtime substitutes it (or strips it).
  greeting: string;
};

const G9: WalkthroughSeed = {
  mode: "general",
  greeting:
    "Hi {name} — let's start with your courses. What classes are you taking this semester?",
};

const G10: WalkthroughSeed = {
  mode: "general",
  greeting:
    "Hi {name} — let's start with your test plan. Have you taken the PSAT yet?",
};

const JUNIOR: WalkthroughSeed = {
  mode: "school-builder",
  greeting:
    "Hi {name} — let's start with your GPA. What's your unweighted GPA on the 4.0 scale?",
};

const SENIOR_WRITING: WalkthroughSeed = {
  mode: "intake",
  greeting:
    "Hi {name} — let's start with your GPA. What's your unweighted GPA on the 4.0 scale?",
};

const SENIOR_POST_SUBMIT: WalkthroughSeed = {
  mode: "general",
  greeting:
    "Hi {name} — your apps are in. Which decision are you most anxious about right now?",
};

const SENIOR_DECISIONS: WalkthroughSeed = {
  mode: "general",
  greeting:
    "Hi {name} — decisions are rolling in. Which schools have you heard back from so far?",
};

const TRANSFER: WalkthroughSeed = {
  mode: "intake",
  greeting:
    "Hi {name} — let's start with your transfer profile. What's your current school and target transfer term?",
};

const UNKNOWN: WalkthroughSeed = {
  mode: "intake",
  greeting:
    "Hi {name} — let's get a quick read on your situation. What grade are you in?",
};

export function getWalkthroughSeed(variant: VariantKey): WalkthroughSeed {
  switch (variant) {
    case "g9":
      return G9;
    case "g10":
      return G10;
    case "junior":
      return JUNIOR;
    case "senior_writing":
      return SENIOR_WRITING;
    case "senior_post_submit":
      return SENIOR_POST_SUBMIT;
    case "senior_decisions":
      return SENIOR_DECISIONS;
    case "transfer":
      return TRANSFER;
    case "unknown":
    default:
      return UNKNOWN;
  }
}

/**
 * Substitute {name} into the greeting template. Falls back to a name-less
 * variant if the student has no first name on file (e.g., signed up via
 * email-only and never set their full name).
 */
export function fillGreeting(template: string, firstName: string | null | undefined): string {
  const name = (firstName ?? "").trim();
  if (!name) {
    // Strip "Hi {name} — " prefix entirely; lead with the question.
    return template
      .replace(/^Hi \{name\} — /, "")
      // Capitalize the first letter of what's now the leading sentence.
      .replace(/^([a-z])/, (m) => m.toUpperCase());
  }
  return template.replace(/\{name\}/g, name);
}
