// English for Spanish Speakers — A1 Course
// Designed specifically for native Spanish speakers learning English from scratch.
// Every lesson addresses Spanish→English transfer issues head-on.
//
// Pedagogical philosophy:
// 1. Front-load the 5 pronunciation traps (H, TH, V, W, schwa) — Module 1
// 2. Dedicate a full module to "to be" replacing BOTH ser AND estar — Module 2
// 3. Address the pro-drop habit: English ALWAYS needs a subject pronoun
// 4. Tackle false friends before they cause embarrassing situations — Module 5
// 5. Simplify the past: one -ed form for all subjects (no imperfect/preterite split at A1)
// 6. Build modal verbs (can/could/would) for immediate practical use — Module 7
// 7. Every lesson references Spanish equivalents so learners build bridges, not walls

import type { LanguageCourse, LanguageModule } from "@/data/language-types";
import { soundsLessons } from "./01-sounds";
import { toBeLessons } from "./02-to-be";
import { articlesWordOrderLessons } from "./03-articles-word-order";
import { presentTenseLessons } from "./04-present-tense";
import { falseFriendsLessons } from "./05-false-friends";
import { pastTenseLessons } from "./06-past-tense";
import { numbersTimeDailyLessons } from "./07-numbers-time-daily";
import { a1MasteryLessons } from "./08-a1-mastery";

const courseInfo = {
  id: "english-for-spanish-speakers",
  slug: "english-for-spanish-speakers",
  title: "English for Spanish Speakers — Inglés para Hispanohablantes A1",
  language: "en",
  languageName: "English",
  proficiencyLevel: "A1" as const,
  description:
    "A complete A1 English course designed exclusively for native Spanish speakers. Every lesson explains English through the lens of Spanish — tackling the pro-drop habit, false friends (embarazada ≠ embarrassed), the two TH sounds Spanish doesn't have, the he/she/it -s trap, do/does questions, and more. All explanations reference Spanish equivalents so you build bridges rather than starting from zero.",
  targetAudience:
    "Native Spanish speakers with zero to minimal English knowledge. All grammar is explained by comparing to Spanish — no generic ESL approach.",
  estimatedHours: 70,
  icon: "🇬🇧",
  nextCourseSlug: "english-intermediate",
};

const modules: LanguageModule[] = [
  {
    id: "en-es-m1",
    title: "Module 1: English Sounds for Spanish Speakers",
    description:
      "The 5 sounds Spanish doesn't have: TH (/θ/ and /ð/), H (not silent!), V (not B), W, and the schwa /ə/. Plus English word stress — stress-timed rhythm vs Spanish syllable-timed rhythm. Front-loaded because pronunciation habits form fast.",
    order: 1,
    lessons: soundsLessons,
  },
  {
    id: "en-es-m2",
    title: "Module 2: 'To Be' — One Verb Replaces Ser AND Estar",
    description:
      "The biggest conceptual leap for Spanish speakers: English 'to be' (am/is/are + was/were) replaces both ser AND estar. Plus there is/there are replacing 'hay', and the essential contractions of spoken English.",
    order: 2,
    lessons: toBeLessons,
  },
  {
    id: "en-es-m3",
    title: "Module 3: Articles & Word Order",
    description:
      "English articles have NO gender — 'the' works for all nouns. Adjectives always go BEFORE the noun (red house, not house red). Plurals are simpler than Spanish. Plus possessives and the strict SVO word order.",
    order: 3,
    lessons: articlesWordOrderLessons,
  },
  {
    id: "en-es-m4",
    title: "Module 4: Present Tense — The -s Trap & Do/Does",
    description:
      "The #1 grammar mistake for Spanish speakers: the he/she/it -s (she works, not she work). Do/does for questions and negatives — completely different from Spanish question formation. Present continuous vs simple present.",
    order: 4,
    lessons: presentTenseLessons,
  },
  {
    id: "en-es-m5",
    title: "Module 5: False Friends & Essential Vocabulary",
    description:
      "The most dangerous words for Spanish speakers: embarazada ≠ embarrassed, librería ≠ library, actualmente ≠ actually, largo ≠ large, sensible ≠ sensitive. Plus 200 core everyday vocabulary words and survival phrases.",
    order: 5,
    lessons: falseFriendsLessons,
  },
  {
    id: "en-es-m6",
    title: "Module 6: Past Tense — -ed, Irregulars, and Did/Didn't",
    description:
      "Regular past -ed (one form for ALL subjects — no personal endings!), the 20 essential irregular verbs, and did/didn't for past questions and negatives. No imperfect vs preterite distinction needed at A1.",
    order: 6,
    lessons: pastTenseLessons,
  },
  {
    id: "en-es-m7",
    title: "Module 7: Numbers, Time & Modal Verbs",
    description:
      "English numbers (11 = eleven, 12 = twelve — not like Spanish), telling time with past/to/o'clock/half, and the essential modal verbs: can/can't for ability, could for polite requests, would like for polite ordering, should for advice.",
    order: 7,
    lessons: numbersTimeDailyLessons,
  },
  {
    id: "en-es-m8",
    title: "Module 8: A1 Mastery",
    description:
      "Future with going to (plans) vs will (spontaneous/predictions), connectors for natural-sounding speech, and a complete A1 capstone review covering all the Spanish→English traps conquered. Plus the A2 roadmap.",
    order: 8,
    lessons: a1MasteryLessons,
  },
];

export const englishForSpanishSpeakersCourse: LanguageCourse = { ...courseInfo, modules };

export function getEnglishForSpanishSpeakersLessons() {
  return modules.flatMap((m) => m.lessons);
}

export function findEnglishForSpanishSpeakersLesson(slugOrId: string) {
  return getEnglishForSpanishSpeakersLessons().find(
    (l) => l.slug === slugOrId || l.id === slugOrId
  );
}
