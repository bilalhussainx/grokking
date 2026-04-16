// French Beginner Course — Complete Rewrite (v2)
// 8 modules × 3-4 lessons = 28 lessons
// Designed specifically for English speakers learning French from zero.
//
// Pedagogical philosophy:
// 1. Front-load phonetics (Module 1) — French sounds are the first barrier
// 2. Dedicate a full module to grammatical gender (Module 3) — the #1 English-speaker stumbling block
// 3. Build verbs systematically: être/avoir → regular -ER → key irregulars → negation/questions
// 4. Address specific English→French traps head-on in concept blocks
// 5. Use rich blocks (concept, compare, steps, quiz, takeaways) throughout
// 6. Every lesson has a voice scenario grounded in real French cultural contexts

import type { LanguageCourse, LanguageModule } from "@/data/language-types";
import { soundMachineLessons } from "./01-sound-machine";
import { identityNumbersLessons } from "./02-identity-numbers";
import { genderProblemLessons } from "./03-gender-problem";
import { verbsEngineLessons } from "./04-verbs-engine";
import { dailyLifeLessons } from "./05-daily-life";
import { gettingAroundLessons } from "./06-getting-around";
import { pastTensesLessons } from "./07-past-tenses";
import { a1MasteryLessons } from "./08-a1-mastery";

const courseInfo = {
  id: "french-beginner",
  slug: "french-beginner",
  title: "French Beginner — The Complete A1 Course for English Speakers",
  language: "fr",
  languageName: "French",
  proficiencyLevel: "A1" as const,
  description:
    "A rigorous A1 French course designed for native English speakers. 8 modules tackle the unique challenges English speakers face: French pronunciation, grammatical gender, verb conjugation, partitive articles, and the passé composé vs imparfait distinction. Rich visual explanations, real cultural context, and voice conversation scenarios throughout.",
  targetAudience:
    "Complete beginners who speak English natively. Addresses English→French false friends, missing concepts, and common traps that generic courses ignore.",
  estimatedHours: 80,
  icon: "🇫🇷",
  nextCourseSlug: "french-intermediate",
};

const modules: LanguageModule[] = [
  {
    id: "fr-m1",
    title: "Module 1: The Sound Machine",
    description:
      "French phonetics for English speakers — the sounds, accents, liaison, and pronunciation rules that unlock everything else. Front-loaded because you can't progress without being able to make the sounds.",
    order: 1,
    lessons: soundMachineLessons,
  },
  {
    id: "fr-m2",
    title: "Module 2: Who Are You?",
    description:
      "Introducing yourself with être and avoir, numbers 0-100 and dates, countries and nationalities — your first encounter with gender agreement in a controlled context.",
    order: 2,
    lessons: identityNumbersLessons,
  },
  {
    id: "fr-m3",
    title: "Module 3: The Gender Problem",
    description:
      "The #1 stumbling block for English speakers gets a full module. Grammatical gender, articles (le/la/l'/les, un/une/des), adjective agreement, possessives and demonstratives — the system that underlies all of French.",
    order: 3,
    lessons: genderProblemLessons,
  },
  {
    id: "fr-m4",
    title: "Module 4: Verbs — The Engine",
    description:
      "Être and avoir in depth, regular -ER verbs (90% of all French verbs), essential irregular verbs (aller, faire, prendre, pouvoir, vouloir), negation (ne...pas) and all three question methods.",
    order: 4,
    lessons: verbsEngineLessons,
  },
  {
    id: "fr-m5",
    title: "Module 5: Daily Life",
    description:
      "Reflexive verbs for daily routines, time/days/months, home and family vocabulary, food and meals — including the partitive article (du/de la/de l'/des) which has no English equivalent.",
    order: 5,
    lessons: dailyLifeLessons,
  },
  {
    id: "fr-m6",
    title: "Module 6: Getting Around",
    description:
      "Directions and city places, transport vocabulary and the imperative mood, the near future (aller + infinitive) for making plans — all grounded in realistic Parisian scenarios.",
    order: 6,
    lessons: gettingAroundLessons,
  },
  {
    id: "fr-m7",
    title: "Module 7: Looking Back",
    description:
      "The hardest module: passé composé with avoir, passé composé with être (DR & MRS VANDERTRAMP), the imparfait, and crucially — when to use which. The passé composé vs imparfait distinction is unique to French.",
    order: 7,
    lessons: pastTensesLessons,
  },
  {
    id: "fr-m8",
    title: "Module 8: A1 Mastery",
    description:
      "Practical French for shopping and clothing, health vocabulary with avoir mal à, a complete A1 capstone review, and a roadmap to A2. Consolidates all 28 lessons into confident, real-world use.",
    order: 8,
    lessons: a1MasteryLessons,
  },
];

export const frenchBeginnerCourse: LanguageCourse = { ...courseInfo, modules };

export function getFrenchBeginnerLessons() {
  return modules.flatMap((m) => m.lessons);
}

export function findFrenchBeginnerLesson(slugOrId: string) {
  return getFrenchBeginnerLessons().find(
    (l) => l.slug === slugOrId || l.id === slugOrId
  );
}
