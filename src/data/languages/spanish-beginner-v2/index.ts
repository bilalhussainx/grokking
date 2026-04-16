// Spanish Beginner Course — Complete A1 Course for English Speakers (v2)
// 8 modules × 3-4 lessons = 26 lessons
// Designed specifically for English speakers learning Spanish from zero.
//
// Pedagogical philosophy:
// 1. Front-load phonetics (Module 1) — the great news: Spanish IS phonetic
// 2. Dedicate a full module to ser/estar (Module 2) — the #1 English-speaker stumbling block
// 3. Build verbs systematically: ser/estar/tener → -AR → -ER/-IR → key irregulars
// 4. Address English→Spanish traps head-on (tener for age/hunger, pro-drop, double negatives)
// 5. Use rich blocks (concept, compare, steps, quiz, takeaways) throughout
// 6. Every lesson has a voice scenario grounded in real Spanish cultural contexts

import type { LanguageCourse, LanguageModule } from "@/data/language-types";
import { soundSystemLessons } from "./01-sound-system";
import { buildingBlocksLessons } from "./02-building-blocks";
import { genderArticlesLessons } from "./03-gender-articles";
import { verbEngineLessons } from "./04-verb-engine";
import { numbersTimeDailyLessons } from "./05-numbers-time-daily";
import { foodPlacesShoppingLessons } from "./06-food-places-shopping";
import { preteriteLessons } from "./07-preterite";
import { a1MasteryLessons } from "./08-a1-mastery";

const courseInfo = {
  id: "spanish-beginner",
  slug: "spanish-beginner",
  title: "Spanish Beginner — The Complete A1 Course for English Speakers",
  language: "es",
  languageName: "Spanish",
  proficiencyLevel: "A1" as const,
  description:
    "A rigorous A1 Spanish course designed for native English speakers. 8 modules tackle the specific challenges English speakers face: Spanish phonetics (the good news — it IS phonetic!), the ser/estar distinction, grammatical gender, the 6-form verb conjugation system, reflexive verbs, the preterite past tense, and the near future. Rich visual explanations, real cultural context, and voice conversation scenarios throughout.",
  targetAudience:
    "Complete beginners who speak English natively. Addresses English→Spanish traps (tener for age, pro-drop, double negatives, ser/estar) that generic courses gloss over.",
  estimatedHours: 75,
  icon: "🇪🇸",
  nextCourseSlug: "spanish-intermediate",
};

const modules: LanguageModule[] = [
  {
    id: "es-m1",
    title: "Module 1: The Sound System",
    description:
      "Spanish phonetics for English speakers — the great news: Spanish IS phonetic. Once you learn the ~10 rules, you can pronounce any word correctly. Front-loaded because it gives immediate confidence and unlocks everything else.",
    order: 1,
    lessons: soundSystemLessons,
  },
  {
    id: "es-m2",
    title: "Module 2: Building Blocks — Ser, Estar, Tener",
    description:
      "The two 'to be' verbs (ser/estar) are THE defining challenge for English speakers — a full module is dedicated to understanding them. Plus tener for age and physical states, and hay for existence.",
    order: 2,
    lessons: buildingBlocksLessons,
  },
  {
    id: "es-m3",
    title: "Module 3: Gender & Articles",
    description:
      "Every Spanish noun is masculine or feminine. Patterns make this more predictable than French (-o = masculine, -a = feminine, with clear exceptions). Articles, adjective agreement, and the mandatory contractions al/del.",
    order: 3,
    lessons: genderArticlesLessons,
  },
  {
    id: "es-m4",
    title: "Module 4: The Verb Engine",
    description:
      "The 6-form conjugation system: regular -AR verbs (90% of all verbs), -ER and -IR verbs, negation with the mandatory double negative, yes/no questions, question words, and the four essential irregulars: ir, querer, poder, hacer.",
    order: 4,
    lessons: verbEngineLessons,
  },
  {
    id: "es-m5",
    title: "Module 5: Numbers, Time & Daily Life",
    description:
      "Spanish numbers 0–1,000 and their logical rules (hundreds agree in gender), telling time with son las / es la, days of the week and months, and reflexive verbs for the daily routine you'll use every day.",
    order: 5,
    lessons: numbersTimeDailyLessons,
  },
  {
    id: "es-m6",
    title: "Module 6: Food, Places & Shopping",
    description:
      "Survival Spanish for real life: ordering at a restaurant with quisiera, asking for directions and navigating a city, shopping for clothes and food with direct object pronouns (lo/la/los/las).",
    order: 6,
    lessons: foodPlacesShoppingLessons,
  },
  {
    id: "es-m7",
    title: "Module 7: The Preterite — Looking Back",
    description:
      "The past tense for completed events. Regular -AR preterite (hablé, hablaste, habló), -ER/-IR preterite (comí, comiste, comió), and the essential irregulars: fui (ir/ser), tuve (tener), hice (hacer), estuve (estar). Plus sequencing past events naturally.",
    order: 7,
    lessons: preteriteLessons,
  },
  {
    id: "es-m8",
    title: "Module 8: A1 Mastery",
    description:
      "Family vocabulary and the crucial conocer vs saber distinction, the near future with ir + a + infinitive, and a full A1 capstone review with a complete grammar checklist and A2 roadmap.",
    order: 8,
    lessons: a1MasteryLessons,
  },
];

export const spanishBeginnerCourse: LanguageCourse = { ...courseInfo, modules };

export function getSpanishBeginnerLessons() {
  return modules.flatMap((m) => m.lessons);
}

export function findSpanishBeginnerLesson(slugOrId: string) {
  return getSpanishBeginnerLessons().find(
    (l) => l.slug === slugOrId || l.id === slugOrId
  );
}
