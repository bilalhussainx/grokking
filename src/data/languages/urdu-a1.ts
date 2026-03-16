// Urdu A1 Course Data
// CEFR Beginner Level - First Words, Basic Communication
// All content includes both Urdu script AND Roman transliteration

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "urdu-a1",
  slug: "urdu-a1",
  title: "Urdu A1 - Beginner",
  language: "ur",
  languageName: "Urdu",
  proficiencyLevel: "A1" as const,
  description: "Master the basics of Urdu. Learn greetings, introductions, numbers, and everyday expressions with both Urdu script and Roman transliteration.",
  targetAudience: "Complete beginners with no prior Urdu experience",
  estimatedHours: 45,
  icon: "\u{1F1F5}\u{1F1F0}",
};

// ============================================
// Module 1: First Words
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "ur-a1-l1",
    slug: "greetings",
    topicId: "ur-a1-greetings",
    title: "Greetings & Farewells",
    content: `# \u0633\u0644\u0627\u0645 \u0627\u0648\u0631 \u0627\u0644\u0648\u062F\u0627\u0639 (Salam aur Alvida)

Welcome to your Urdu journey! Let's start with the most essential phrases.

## Common Greetings

- **\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u06CC\u06A9\u0645** (Assalam-o-Alaikum) - Peace be upon you (universal greeting)
- **\u0648\u0639\u0644\u06CC\u06A9\u0645 \u0627\u0644\u0633\u0644\u0627\u0645** (Walaikum Assalam) - And upon you peace (response)
- **\u0622\u062F\u0627\u0628** (Aadaab) - Greetings (formal, secular)
- **\u06A9\u06CC\u0633\u06D2 \u06C1\u06CC\u06BA \u0622\u067E\u061F** (Kaise hain aap?) - How are you? (formal)

## Polite Words

- **\u0634\u06A9\u0631\u06CC\u06C1** (Shukriya) - Thank you
- **\u0628\u0631\u0627\u0626\u06D2 \u0645\u06C1\u0631\u0628\u0627\u0646\u06CC** (Baraaye meharbani) - Please
- **\u0645\u0639\u0627\u0641 \u06A9\u06CC\u062C\u06CC\u06D2** (Maaf keejiye) - Excuse me / Sorry

## Farewells

- **\u062E\u062F\u0627 \u062D\u0627\u0641\u0638** (Khuda Hafiz) - Goodbye (God protect you)
- **\u0627\u0644\u0644\u06C1 \u062D\u0627\u0641\u0638** (Allah Hafiz) - Goodbye (Allah protect you)
- **\u067E\u06BE\u0631 \u0645\u0644\u06CC\u06BA \u06AF\u06D2** (Phir milein ge) - See you again`,
    targetLanguage: "ur",
    proficiencyLevel: "A1",
    moduleId: "ur-a1-m1",
    moduleTitle: "First Words",
    order: 1,
    vocabulary: [
      { word: "\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u06CC\u06A9\u0645 (Assalam-o-Alaikum)", translation: "peace be upon you", pronunciation: "as-sa-LAAM-o-a-LAI-kum", exampleSentence: "\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u06CC\u06A9\u0645\u060C \u06A9\u06CC\u0633\u06D2 \u06C1\u06CC\u06BA\u061F", exampleTranslation: "Hello, how are you?", partOfSpeech: "phrase" },
      { word: "\u0634\u06A9\u0631\u06CC\u06C1 (Shukriya)", translation: "thank you", pronunciation: "shoo-KREE-yah", exampleSentence: "\u0628\u06C1\u062A \u0634\u06A9\u0631\u06CC\u06C1!", exampleTranslation: "Thank you very much!", partOfSpeech: "interjection" },
      { word: "\u062E\u062F\u0627 \u062D\u0627\u0641\u0638 (Khuda Hafiz)", translation: "goodbye", pronunciation: "khoo-DAA HAA-fiz", exampleSentence: "\u0627\u0686\u06BE\u0627\u060C \u062E\u062F\u0627 \u062D\u0627\u0641\u0638!", exampleTranslation: "OK, goodbye!", partOfSpeech: "phrase" },
      { word: "\u0628\u0631\u0627\u0626\u06D2 \u0645\u06C1\u0631\u0628\u0627\u0646\u06CC (Baraaye meharbani)", translation: "please", pronunciation: "ba-RAA-ay meh-har-BAA-nee", exampleSentence: "\u0628\u0631\u0627\u0626\u06D2 \u0645\u06C1\u0631\u0628\u0627\u0646\u06CC\u060C \u067E\u0627\u0646\u06CC \u062F\u06CC\u062C\u06CC\u06D2\u06D4", exampleTranslation: "Please give me water.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Formal vs. Informal Address",
        explanation: "Urdu has three levels of formality: **\u0622\u067E** (aap - formal/respectful), **\u062A\u0645** (tum - informal/friendly), and **\u062A\u0648** (tu - very intimate/disrespectful to strangers). Always use \u0622\u067E with elders and strangers.",
        examples: [
          { correct: "\u0622\u067E \u06A9\u06CC\u0633\u06D2 \u06C1\u06CC\u06BA\u061F (Aap kaise hain?)", translation: "How are you? (respectful)" },
          { correct: "\u062A\u0645 \u06A9\u06CC\u0633\u06D2 \u06C1\u0648\u061F (Tum kaise ho?)", translation: "How are you? (informal)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ur-greeting-meeting",
        title: "Meeting an Elder",
        situation: "You meet an older family friend at a gathering",
        agentRole: "You are Ustaad Rashid, a respected elder. Greet the student with Salam and ask how they are.",
        userGoal: "Greet with Salam, respond about your wellbeing, use respectful language",
        targetPhrases: ["Assalam-o-Alaikum", "Walaikum Assalam", "Shukriya"],
        successCriteria: ["Uses Salam greeting", "Responds appropriately", "Uses respectful aap form"],
      },
    ],
    culturalNotes: [
      {
        title: "The Salam Greeting",
        content: "Salam (\u0633\u0644\u0627\u0645) is the universal greeting among Urdu speakers. It's always appropriate. The full form 'Assalam-o-Alaikum' is responded to with 'Walaikum Assalam'. When greeting elders, younger people initiate the Salam first as a sign of respect.",
        region: "Pakistan / South Asia",
      },
    ],
  },
  {
    id: "ur-a1-l2",
    slug: "introductions",
    topicId: "ur-a1-introductions",
    title: "Introducing Yourself",
    content: `# \u0627\u067E\u0646\u0627 \u062A\u0639\u0627\u0631\u0641 (Apna Taaruf)

Learn to tell people who you are.

## Key Phrases

- **\u0645\u06CC\u0631\u0627 \u0646\u0627\u0645... \u06C1\u06D2** (Mera naam... hai) - My name is...
- **\u0645\u06CC\u06BA... \u0633\u06D2 \u06C1\u0648\u06BA** (Main... se hoon) - I am from...
- **\u0622\u067E \u0633\u06D2 \u0645\u0644 \u06A9\u0631 \u062E\u0648\u0634\u06CC \u06C1\u0648\u0626\u06CC** (Aap se mil kar khushi hui) - Nice to meet you
- **\u0622\u067E \u06A9\u0627 \u0646\u0627\u0645 \u06A9\u06CC\u0627 \u06C1\u06D2\u061F** (Aap ka naam kya hai?) - What is your name?
- **\u0622\u067E \u06A9\u06C1\u0627\u06BA \u0633\u06D2 \u06C1\u06CC\u06BA\u061F** (Aap kahan se hain?) - Where are you from?`,
    targetLanguage: "ur",
    proficiencyLevel: "A1",
    moduleId: "ur-a1-m1",
    moduleTitle: "First Words",
    order: 2,
    vocabulary: [
      { word: "\u0645\u06CC\u0631\u0627 \u0646\u0627\u0645 (Mera naam)", translation: "my name", pronunciation: "MEH-rah NAAM", exampleSentence: "\u0645\u06CC\u0631\u0627 \u0646\u0627\u0645 \u0639\u0644\u06CC \u06C1\u06D2\u06D4", exampleTranslation: "My name is Ali.", partOfSpeech: "phrase" },
      { word: "\u06A9\u06CC\u0627 (Kya)", translation: "what", pronunciation: "KYAA", exampleSentence: "\u0622\u067E \u06A9\u0627 \u0646\u0627\u0645 \u06A9\u06CC\u0627 \u06C1\u06D2\u061F", exampleTranslation: "What is your name?", partOfSpeech: "pronoun" },
      { word: "\u06A9\u06C1\u0627\u06BA (Kahan)", translation: "where", pronunciation: "ka-HAAN", exampleSentence: "\u0622\u067E \u06A9\u06C1\u0627\u06BA \u0633\u06D2 \u06C1\u06CC\u06BA\u061F", exampleTranslation: "Where are you from?", partOfSpeech: "adverb" },
    ],
    grammarPoints: [
      {
        title: "The Verb '\u06C1\u0648\u0646\u0627' (Hona - To Be)",
        explanation: "'\u06C1\u0648\u0646\u0627' changes based on formality: **\u06C1\u06D2** (hai - is), **\u06C1\u06CC\u06BA** (hain - are, formal), **\u06C1\u0648** (ho - are, informal), **\u06C1\u0648\u06BA** (hoon - am).",
        examples: [
          { correct: "\u0645\u06CC\u06BA \u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06C1\u0648\u06BA (Main talib-e-ilm hoon)", translation: "I am a student" },
          { correct: "\u0622\u067E \u06A9\u06C1\u0627\u06BA \u0633\u06D2 \u06C1\u06CC\u06BA\u061F (Aap kahan se hain?)", translation: "Where are you from? (formal)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ur-intro-gathering",
        title: "At a Family Gathering",
        situation: "You're meeting relatives at an Eid celebration",
        agentRole: "You are Ayesha from Karachi. Introduce yourself warmly and ask about the student.",
        userGoal: "Introduce yourself and ask where Ayesha is from",
        targetPhrases: ["Mera naam... hai", "Aap ka naam kya hai?", "Aap se mil kar khushi hui"],
        successCriteria: ["States name", "Asks about other person", "Uses respectful form"],
      },
    ],
  },
  {
    id: "ur-a1-l3",
    slug: "numbers-1-20",
    topicId: "ur-a1-numbers-1-20",
    title: "Numbers 1-20",
    content: `# \u0646\u0645\u0628\u0631 \u06F1 \u0633\u06D2 \u06F2\u06F0 (Numbers 1-20)

## Numbers 1-10
1. **\u0627\u06CC\u06A9** (Ek)
2. **\u062F\u0648** (Do)
3. **\u062A\u06CC\u0646** (Teen)
4. **\u0686\u0627\u0631** (Char)
5. **\u067E\u0627\u0646\u0686** (Panch)
6. **\u0686\u06BE** (Chhe)
7. **\u0633\u0627\u062A** (Saat)
8. **\u0622\u0679\u06BE** (Aath)
9. **\u0646\u0648** (Nau)
10. **\u062F\u0633** (Das)

## Numbers 11-20
11. **\u06AF\u06CC\u0627\u0631\u06C1** (Gyaarah)
12. **\u0628\u0627\u0631\u06C1** (Baarah)
13. **\u062A\u06CC\u0631\u06C1** (Terah)
14. **\u0686\u0648\u062F\u06C1** (Chaudah)
15. **\u067E\u0646\u062F\u0631\u06C1** (Pandrah)
16. **\u0633\u0648\u0644\u06C1** (Solah)
17. **\u0633\u062A\u0631\u06C1** (Satrah)
18. **\u0627\u0679\u06BE\u0627\u0631\u06C1** (Athaarah)
19. **\u0627\u0646\u06CC\u0633** (Unees)
20. **\u0628\u06CC\u0633** (Bees)`,
    targetLanguage: "ur",
    proficiencyLevel: "A1",
    moduleId: "ur-a1-m1",
    moduleTitle: "First Words",
    order: 3,
    vocabulary: [
      { word: "\u0627\u06CC\u06A9 (Ek)", translation: "one", pronunciation: "ek", exampleSentence: "\u0627\u06CC\u06A9 \u0686\u0627\u0626\u06D2 \u062F\u06CC\u062C\u06CC\u06D2\u06D4", exampleTranslation: "Give me one tea.", partOfSpeech: "number" },
      { word: "\u067E\u0627\u0646\u0686 (Panch)", translation: "five", pronunciation: "paanch", exampleSentence: "\u067E\u0627\u0646\u0686 \u0645\u0646\u0679 \u0631\u06A9\u06CC\u06D2\u06D4", exampleTranslation: "Wait five minutes.", partOfSpeech: "number" },
      { word: "\u062F\u0633 (Das)", translation: "ten", pronunciation: "das", exampleSentence: "\u062F\u0633 \u0631\u0648\u067E\u06D2\u06D4", exampleTranslation: "Ten rupees.", partOfSpeech: "number" },
      { word: "\u0628\u06CC\u0633 (Bees)", translation: "twenty", pronunciation: "bees", exampleSentence: "\u0645\u06CC\u0631\u06CC \u0639\u0645\u0631 \u0628\u06CC\u0633 \u0633\u0627\u0644 \u06C1\u06D2\u06D4", exampleTranslation: "I am twenty years old.", partOfSpeech: "number" },
    ],
    grammarPoints: [
      {
        title: "Numbers Don't Change for Gender",
        explanation: "Unlike Hindi, Urdu numbers stay the same regardless of the noun's gender. However, the word after the number may change.",
        examples: [
          { correct: "\u0627\u06CC\u06A9 \u0644\u0691\u06A9\u0627 (Ek larka)", translation: "one boy" },
          { correct: "\u0627\u06CC\u06A9 \u0644\u0691\u06A9\u06CC (Ek larki)", translation: "one girl" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ur-bazaar-numbers",
        title: "At the Bazaar",
        situation: "You're buying mangoes at a fruit stall",
        agentRole: "You are a friendly fruit vendor in Lahore bazaar. Ask the student how many mangoes they want.",
        userGoal: "Say how many items you want and ask the price",
        targetPhrases: ["Ek, do, teen...", "Kitnay ka hai?", "Shukriya"],
        successCriteria: ["Uses numbers", "Asks about quantity/price", "Completes interaction"],
      },
    ],
  },
];

// ============================================
// Module 2: About Me
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "ur-a1-l4",
    slug: "personal-info",
    topicId: "ur-a1-personal-info",
    title: "Personal Information",
    content: `# \u0630\u0627\u062A\u06CC \u0645\u0639\u0644\u0648\u0645\u0627\u062A (Zaati Maloomaat)

## Talking About Age
- **\u0645\u06CC\u0631\u06CC \u0639\u0645\u0631... \u0633\u0627\u0644 \u06C1\u06D2** (Meri umar... saal hai) - I am... years old
- **\u0622\u067E \u06A9\u06CC \u0639\u0645\u0631 \u06A9\u06CC\u0627 \u06C1\u06D2\u061F** (Aap ki umar kya hai?) - How old are you?

## Where You're From
- **\u0645\u06CC\u06BA \u067E\u0627\u06A9\u0633\u062A\u0627\u0646 \u0633\u06D2 \u06C1\u0648\u06BA** (Main Pakistan se hoon) - I'm from Pakistan
- **\u0645\u06CC\u06BA \u0627\u0645\u0631\u06CC\u06A9\u06C1 \u0633\u06D2 \u06C1\u0648\u06BA** (Main America se hoon) - I'm from America

## Occupation
- **\u0645\u06CC\u06BA \u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06C1\u0648\u06BA** (Main talib-e-ilm hoon) - I'm a student
- **\u0645\u06CC\u06BA \u0627\u0633\u062A\u0627\u062F \u06C1\u0648\u06BA** (Main ustaad hoon) - I'm a teacher
- **\u0645\u06CC\u06BA \u06A9\u0627\u0645 \u06A9\u0631\u062A\u0627/\u06A9\u0631\u062A\u06CC \u06C1\u0648\u06BA** (Main kaam karta/karti hoon) - I work`,
    targetLanguage: "ur",
    proficiencyLevel: "A1",
    moduleId: "ur-a1-m2",
    moduleTitle: "About Me",
    order: 4,
    vocabulary: [
      { word: "\u0639\u0645\u0631 (Umar)", translation: "age", pronunciation: "OO-mar", exampleSentence: "\u0645\u06CC\u0631\u06CC \u0639\u0645\u0631 \u067E\u0686\u06CC\u0633 \u0633\u0627\u0644 \u06C1\u06D2\u06D4", exampleTranslation: "I am twenty-five years old.", partOfSpeech: "noun" },
      { word: "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 (Talib-e-ilm)", translation: "student", pronunciation: "TAA-lib eh ILM", exampleSentence: "\u0645\u06CC\u06BA \u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06C1\u0648\u06BA\u06D4", exampleTranslation: "I am a student.", partOfSpeech: "noun" },
      { word: "\u06A9\u0627\u0645 (Kaam)", translation: "work", pronunciation: "kaam", exampleSentence: "\u0645\u06CC\u06BA \u062F\u0641\u062A\u0631 \u0645\u06CC\u06BA \u06A9\u0627\u0645 \u06A9\u0631\u062A\u0627 \u06C1\u0648\u06BA\u06D4", exampleTranslation: "I work in an office.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Gender in Verbs (\u06A9\u0631\u062A\u0627 vs \u06A9\u0631\u062A\u06CC)",
        explanation: "Urdu verbs change endings based on the speaker's gender: **-\u062A\u0627** (-ta) for males, **-\u062A\u06CC** (-ti) for females.",
        examples: [
          { correct: "\u0645\u06CC\u06BA \u06A9\u0627\u0645 \u06A9\u0631\u062A\u0627 \u06C1\u0648\u06BA (Main kaam karta hoon)", translation: "I work (male speaker)" },
          { correct: "\u0645\u06CC\u06BA \u06A9\u0627\u0645 \u06A9\u0631\u062A\u06CC \u06C1\u0648\u06BA (Main kaam karti hoon)", translation: "I work (female speaker)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ur-personal-intro",
        title: "Complete Introduction",
        situation: "Meeting new colleagues at work",
        agentRole: "You are Ustaad Rashid. Ask the student to introduce themselves with name, age, and where they're from.",
        userGoal: "Give a complete personal introduction in Urdu",
        targetPhrases: ["Mera naam... hai", "Meri umar... saal hai", "Main... se hoon"],
        successCriteria: ["Says name", "States age", "Mentions origin"],
      },
    ],
  },
  {
    id: "ur-a1-l5",
    slug: "family-members",
    topicId: "ur-a1-family-members",
    title: "Family Members",
    content: `# \u062E\u0627\u0646\u062F\u0627\u0646 (Khandaan)

## Immediate Family
- **\u0627\u0645\u06CC / \u0627\u0645\u0627\u06BA** (Ammi / Amaan) - mother/mom
- **\u0627\u0628\u0648 / \u0627\u0628\u0627** (Abu / Abba) - father/dad
- **\u0628\u06BE\u0627\u0626\u06CC** (Bhai) - brother
- **\u0628\u06C1\u0646** (Behan) - sister
- **\u0628\u06CC\u0679\u0627** (Beta) - son
- **\u0628\u06CC\u0679\u06CC** (Beti) - daughter

## Extended Family
- **\u062F\u0627\u062F\u0627 / \u062F\u0627\u062F\u06CC** (Daada / Daadi) - paternal grandfather/grandmother
- **\u0646\u0627\u0646\u0627 / \u0646\u0627\u0646\u06CC** (Naana / Naani) - maternal grandfather/grandmother
- **\u0686\u0627\u0686\u0627 / \u0686\u0627\u0686\u06CC** (Chacha / Chachi) - paternal uncle/aunt
- **\u0645\u0627\u0645\u0648\u06BA / \u062E\u0627\u0644\u06C1** (Mamoon / Khala) - maternal uncle/aunt`,
    targetLanguage: "ur",
    proficiencyLevel: "A1",
    moduleId: "ur-a1-m2",
    moduleTitle: "About Me",
    order: 5,
    vocabulary: [
      { word: "\u0627\u0645\u06CC (Ammi)", translation: "mother", pronunciation: "AM-mee", exampleSentence: "\u0645\u06CC\u0631\u06CC \u0627\u0645\u06CC \u0688\u0627\u06A9\u0679\u0631 \u06C1\u06CC\u06BA\u06D4", exampleTranslation: "My mother is a doctor.", partOfSpeech: "noun" },
      { word: "\u0627\u0628\u0648 (Abu)", translation: "father", pronunciation: "AB-boo", exampleSentence: "\u0645\u06CC\u0631\u06D2 \u0627\u0628\u0648 \u0628\u06C1\u062A \u06A9\u0627\u0645 \u06A9\u0631\u062A\u06D2 \u06C1\u06CC\u06BA\u06D4", exampleTranslation: "My father works a lot.", partOfSpeech: "noun" },
      { word: "\u0628\u06BE\u0627\u0626\u06CC (Bhai)", translation: "brother", pronunciation: "BHAAI", exampleSentence: "\u0645\u06CC\u0631\u0627 \u0627\u06CC\u06A9 \u0628\u0691\u0627 \u0628\u06BE\u0627\u0626\u06CC \u06C1\u06D2\u06D4", exampleTranslation: "I have one older brother.", partOfSpeech: "noun" },
      { word: "\u062E\u0627\u0646\u062F\u0627\u0646 (Khandaan)", translation: "family", pronunciation: "khan-DAAN", exampleSentence: "\u0645\u06CC\u0631\u0627 \u062E\u0627\u0646\u062F\u0627\u0646 \u0628\u0691\u0627 \u06C1\u06D2\u06D4", exampleTranslation: "My family is big.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Possessives: \u0645\u06CC\u0631\u0627/\u0645\u06CC\u0631\u06CC/\u0645\u06CC\u0631\u06D2",
        explanation: "Possessives change for gender and number: **\u0645\u06CC\u0631\u0627** (mera - my, masc. singular), **\u0645\u06CC\u0631\u06CC** (meri - my, fem.), **\u0645\u06CC\u0631\u06D2** (mere - my, plural/respectful).",
        examples: [
          { correct: "\u0645\u06CC\u0631\u0627 \u0628\u06BE\u0627\u0626\u06CC (Mera bhai)", translation: "my brother (masculine)" },
          { correct: "\u0645\u06CC\u0631\u06CC \u0628\u06C1\u0646 (Meri behan)", translation: "my sister (feminine)" },
          { correct: "\u0645\u06CC\u0631\u06D2 \u0648\u0627\u0644\u062F\u06CC\u0646 (Mere walidain)", translation: "my parents (plural/respectful)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ur-family-chat",
        title: "Talking About Family",
        situation: "Having chai with a new friend",
        agentRole: "You are Nani Amira. Ask the student about their family warmly and share stories.",
        userGoal: "Describe your family members in Urdu",
        targetPhrases: ["Mera/Meri...", "... hai/hain", "Khandaan"],
        successCriteria: ["Mentions family members", "Uses correct possessives", "Provides some details"],
      },
    ],
    culturalNotes: [
      {
        title: "Family Respect in Pakistani Culture",
        content: "In Pakistani culture, elders are always addressed with respect. You never call elders by their first name - use titles like Bhai (brother), Baji (elder sister), Uncle, Aunty. Family bonds are extremely important, and extended family often lives together or very close by.",
        region: "Pakistan",
      },
    ],
  },
];

// ============================================
// Module 3: Daily Life
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "ur-a1-l6",
    slug: "food-drink",
    topicId: "ur-a1-food-drink",
    title: "Food & Drink",
    content: `# \u06A9\u06BE\u0627\u0646\u0627 \u0627\u0648\u0631 \u0645\u0634\u0631\u0648\u0628\u0627\u062A (Khaana aur Mashroobaat)

## Common Foods
- **\u0631\u0648\u0679\u06CC** (Roti) - bread/flatbread
- **\u0686\u0627\u0648\u0644** (Chaawal) - rice
- **\u062F\u0627\u0644** (Daal) - lentils
- **\u0633\u0628\u0632\u06CC** (Sabzi) - vegetables
- **\u06AF\u0648\u0634\u062A** (Gosht) - meat

## Drinks
- **\u067E\u0627\u0646\u06CC** (Paani) - water
- **\u0686\u0627\u0626\u06D2** (Chai) - tea
- **\u062F\u0648\u062F\u06BE** (Doodh) - milk
- **\u0644\u0633\u06CC** (Lassi) - yogurt drink

## At a Restaurant
- **\u0645\u062C\u06BE\u06D2... \u0686\u0627\u06C1\u06CC\u06D2** (Mujhe... chahiye) - I need/want...
- **\u0628\u0644 \u062F\u06CC\u062C\u06CC\u06D2** (Bill deejiye) - Give me the bill
- **\u06A9\u06CC\u0627 \u0622\u067E \u06A9\u06D2 \u067E\u0627\u0633... \u06C1\u06D2\u061F** (Kya aap ke paas... hai?) - Do you have...?`,
    targetLanguage: "ur",
    proficiencyLevel: "A1",
    moduleId: "ur-a1-m3",
    moduleTitle: "Daily Life",
    order: 6,
    vocabulary: [
      { word: "\u067E\u0627\u0646\u06CC (Paani)", translation: "water", pronunciation: "PAA-nee", exampleSentence: "\u0627\u06CC\u06A9 \u06AF\u0644\u0627\u0633 \u067E\u0627\u0646\u06CC \u062F\u06CC\u062C\u06CC\u06D2\u06D4", exampleTranslation: "Give me a glass of water.", partOfSpeech: "noun" },
      { word: "\u0631\u0648\u0679\u06CC (Roti)", translation: "bread", pronunciation: "ROH-tee", exampleSentence: "\u0631\u0648\u0679\u06CC \u06AF\u0631\u0645 \u06C1\u06D2\u06D4", exampleTranslation: "The bread is hot.", partOfSpeech: "noun" },
      { word: "\u0686\u0627\u0626\u06D2 (Chai)", translation: "tea", pronunciation: "chaai", exampleSentence: "\u0627\u06CC\u06A9 \u06A9\u067E \u0686\u0627\u0626\u06D2 \u0686\u0627\u06C1\u06CC\u06D2\u06D4", exampleTranslation: "I want a cup of tea.", partOfSpeech: "noun" },
      { word: "\u0686\u0627\u06C1\u06CC\u06D2 (Chahiye)", translation: "need/want", pronunciation: "CHAA-hee-yeh", exampleSentence: "\u0645\u062C\u06BE\u06D2 \u0631\u0648\u0679\u06CC \u0686\u0627\u06C1\u06CC\u06D2\u06D4", exampleTranslation: "I need bread.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Using '\u0686\u0627\u06C1\u06CC\u06D2' (Chahiye - Need/Want)",
        explanation: "'\u0686\u0627\u06C1\u06CC\u06D2' is used with '\u0645\u062C\u06BE\u06D2' (mujhe - to me) to express wants and needs. It doesn't change for gender.",
        examples: [
          { correct: "\u0645\u062C\u06BE\u06D2 \u067E\u0627\u0646\u06CC \u0686\u0627\u06C1\u06CC\u06D2 (Mujhe paani chahiye)", translation: "I need water" },
          { correct: "\u0645\u062C\u06BE\u06D2 \u0686\u0627\u0626\u06D2 \u0686\u0627\u06C1\u06CC\u06D2 (Mujhe chai chahiye)", translation: "I want tea" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ur-dhaba-order",
        title: "Ordering at a Dhaba",
        situation: "You're at a roadside dhaba in Lahore",
        agentRole: "You are a dhaba waiter. Ask the customer what they want and suggest popular items.",
        userGoal: "Order food and drinks",
        targetPhrases: ["Mujhe... chahiye", "Kitne ka hai?", "Shukriya"],
        successCriteria: ["Orders food/drink", "Uses chahiye correctly", "Asks about price"],
      },
    ],
    culturalNotes: [
      {
        title: "Chai Culture",
        content: "Chai (\u0686\u0627\u0626\u06D2) is not just a drink in Pakistan - it's a way of life. Refusing chai when offered is considered rude. 'Chai piyein ge?' (Will you have tea?) is the universal icebreaker. Pakistani chai is made by boiling tea leaves in milk with sugar and cardamom.",
        region: "Pakistan",
      },
    ],
  },
  {
    id: "ur-a1-l7",
    slug: "telling-time",
    topicId: "ur-a1-telling-time",
    title: "Telling Time",
    content: `# \u0648\u0642\u062A \u0628\u062A\u0627\u0646\u0627 (Waqt Bataana)

## Basic Time
- **\u06A9\u062A\u0646\u06D2 \u0628\u062C\u06D2 \u06C1\u06CC\u06BA\u061F** (Kitnay bajay hain?) - What time is it?
- **\u0627\u06CC\u06A9 \u0628\u062C\u0627 \u06C1\u06D2** (Ek baja hai) - It's one o'clock
- **\u062F\u0648 \u0628\u062C\u06D2 \u06C1\u06CC\u06BA** (Do bajay hain) - It's two o'clock

## Quarter/Half
- **\u0633\u0648\u0627** (Sawa) - quarter past
- **\u0633\u0627\u0691\u06BE\u06D2** (Saarhay) - half past
- **\u067E\u0648\u0646\u06D2** (Paunay) - quarter to`,
    targetLanguage: "ur",
    proficiencyLevel: "A1",
    moduleId: "ur-a1-m3",
    moduleTitle: "Daily Life",
    order: 7,
    vocabulary: [
      { word: "\u0628\u062C\u06D2 (Bajay)", translation: "o'clock", pronunciation: "BA-jay", exampleSentence: "\u06A9\u062A\u0646\u06D2 \u0628\u062C\u06D2 \u06C1\u06CC\u06BA\u061F", exampleTranslation: "What time is it?", partOfSpeech: "noun" },
      { word: "\u0633\u0648\u0627 (Sawa)", translation: "quarter past", pronunciation: "SA-waa", exampleSentence: "\u0633\u0648\u0627 \u062A\u06CC\u0646 \u0628\u062C\u06D2 \u06C1\u06CC\u06BA\u06D4", exampleTranslation: "It's quarter past three.", partOfSpeech: "adjective" },
      { word: "\u0648\u0642\u062A (Waqt)", translation: "time", pronunciation: "waqt", exampleSentence: "\u0648\u0642\u062A \u06A9\u06CC\u0627 \u06C1\u0648\u0627 \u06C1\u06D2\u061F", exampleTranslation: "What's the time?", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "\u0628\u062C\u0627 vs \u0628\u062C\u06D2 for Time",
        explanation: "Use '\u0628\u062C\u0627 \u06C1\u06D2' (baja hai) for 1:00 (singular) and '\u0628\u062C\u06D2 \u06C1\u06CC\u06BA' (bajay hain) for all other hours (plural).",
        examples: [
          { correct: "\u0627\u06CC\u06A9 \u0628\u062C\u0627 \u06C1\u06D2 (Ek baja hai)", translation: "It's one o'clock" },
          { correct: "\u062A\u06CC\u0646 \u0628\u062C\u06D2 \u06C1\u06CC\u06BA (Teen bajay hain)", translation: "It's three o'clock" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ur-asking-time",
        title: "Catching a Bus",
        situation: "You need to catch a bus and want to know the time",
        agentRole: "You are a passerby. Tell the student the current time.",
        userGoal: "Ask for the time and understand the response",
        targetPhrases: ["Kitnay bajay hain?", "Shukriya", "Kitne bajay...?"],
        successCriteria: ["Asks for time", "Acknowledges response", "Thanks"],
      },
    ],
  },
];

// ============================================
// Module 4: Getting Around
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "ur-a1-l8",
    slug: "directions",
    topicId: "ur-a1-directions",
    title: "Asking for Directions",
    content: `# \u0631\u0627\u0633\u062A\u06C1 \u067E\u0648\u0686\u06BE\u0646\u0627 (Raasta Poochhna)

## Key Phrases
- **... \u06A9\u06C1\u0627\u06BA \u06C1\u06D2\u061F** (... kahan hai?) - Where is...?
- **\u0642\u0631\u06CC\u0628 / \u062F\u0648\u0631** (Qareeb / Door) - Near / Far
- **\u062F\u0627\u0626\u06CC\u06BA** (Dayen) - Right
- **\u0628\u0627\u0626\u06CC\u06BA** (Bayen) - Left
- **\u0633\u06CC\u062F\u06BE\u0627** (Seedha) - Straight

## Common Locations
- **\u0627\u0633\u0679\u06CC\u0634\u0646** (Station) - station
- **\u0628\u0627\u0632\u0627\u0631** (Bazaar) - market
- **\u06C1\u0633\u067E\u062A\u0627\u0644** (Hospital) - hospital
- **\u0645\u0633\u062C\u062F** (Masjid) - mosque`,
    targetLanguage: "ur",
    proficiencyLevel: "A1",
    moduleId: "ur-a1-m4",
    moduleTitle: "Getting Around",
    order: 8,
    vocabulary: [
      { word: "\u062F\u0627\u0626\u06CC\u06BA (Dayen)", translation: "right", pronunciation: "DAA-yehn", exampleSentence: "\u062F\u0627\u0626\u06CC\u06BA \u0645\u0691\u06CC\u06D2\u06D4", exampleTranslation: "Turn right.", partOfSpeech: "adverb" },
      { word: "\u0628\u0627\u0626\u06CC\u06BA (Bayen)", translation: "left", pronunciation: "BAA-yehn", exampleSentence: "\u0628\u0627\u0626\u06CC\u06BA \u0637\u0631\u0641\u06D4", exampleTranslation: "To the left.", partOfSpeech: "adverb" },
      { word: "\u0633\u06CC\u062F\u06BE\u0627 (Seedha)", translation: "straight", pronunciation: "SEE-dhaa", exampleSentence: "\u0633\u06CC\u062F\u06BE\u0627 \u062C\u0627\u0626\u06CC\u06D2\u06D4", exampleTranslation: "Go straight.", partOfSpeech: "adverb" },
      { word: "\u0642\u0631\u06CC\u0628 (Qareeb)", translation: "near", pronunciation: "qa-REEB", exampleSentence: "\u0628\u06C1\u062A \u0642\u0631\u06CC\u0628 \u06C1\u06D2\u06D4", exampleTranslation: "It's very near.", partOfSpeech: "adverb" },
    ],
    grammarPoints: [
      {
        title: "Postpositions (After the Noun)",
        explanation: "Unlike English prepositions, Urdu uses postpositions that come AFTER the noun: '\u0645\u06CC\u06BA' (mein - in), '\u067E\u0631' (par - on), '\u06A9\u06D2 \u067E\u0627\u0633' (ke paas - near).",
        examples: [
          { correct: "\u06C1\u0633\u067E\u062A\u0627\u0644 \u06A9\u06D2 \u067E\u0627\u0633 (Hospital ke paas)", translation: "Near the hospital" },
          { correct: "\u0628\u0627\u0632\u0627\u0631 \u0645\u06CC\u06BA (Bazaar mein)", translation: "In the market" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ur-lost-city",
        title: "Finding the Bazaar",
        situation: "You're trying to find Anarkali Bazaar in Lahore",
        agentRole: "You are a friendly rickshaw driver. Give directions and offer a ride.",
        userGoal: "Ask for directions and understand the response",
        targetPhrases: ["... kahan hai?", "Dayen/Bayen", "Shukriya"],
        successCriteria: ["Asks for location", "Understands directions", "Thanks"],
      },
    ],
  },
  {
    id: "ur-a1-l9",
    slug: "shopping",
    topicId: "ur-a1-shopping",
    title: "Shopping at the Bazaar",
    content: `# \u0628\u0627\u0632\u0627\u0631 \u0645\u06CC\u06BA \u062E\u0631\u06CC\u062F\u0627\u0631\u06CC (Bazaar mein Kharidaari)

## Essential Phrases
- **\u06A9\u062A\u0646\u06D2 \u06A9\u0627 \u06C1\u06D2\u061F** (Kitnay ka hai?) - How much is it?
- **\u0628\u06C1\u062A \u0645\u06C1\u0646\u06AF\u0627 \u06C1\u06D2** (Bohat mehnga hai) - It's very expensive
- **\u06A9\u0686\u06BE \u06A9\u0645 \u06A9\u0631\u06CC\u06BA** (Kuchh kam karein) - Please reduce the price
- **\u0645\u062C\u06BE\u06D2... \u062E\u0631\u06CC\u062F\u0646\u0627 \u06C1\u06D2** (Mujhe... khareedna hai) - I want to buy...

## Shopping Words
- **\u062F\u06A9\u0627\u0646** (Dukaan) - shop
- **\u0642\u06CC\u0645\u062A** (Qeemat) - price
- **\u067E\u06CC\u0633\u06D2** (Paise) - money
- **\u0631\u0648\u067E\u06D2** (Rupay) - rupees`,
    targetLanguage: "ur",
    proficiencyLevel: "A1",
    moduleId: "ur-a1-m4",
    moduleTitle: "Getting Around",
    order: 9,
    vocabulary: [
      { word: "\u06A9\u062A\u0646\u06D2 (Kitnay)", translation: "how much/many", pronunciation: "KIT-nay", exampleSentence: "\u06CC\u06C1 \u06A9\u062A\u0646\u06D2 \u06A9\u0627 \u06C1\u06D2\u061F", exampleTranslation: "How much is this?", partOfSpeech: "pronoun" },
      { word: "\u0645\u06C1\u0646\u06AF\u0627 (Mehnga)", translation: "expensive", pronunciation: "MEHN-gaa", exampleSentence: "\u06CC\u06C1 \u0628\u06C1\u062A \u0645\u06C1\u0646\u06AF\u0627 \u06C1\u06D2\u06D4", exampleTranslation: "This is very expensive.", partOfSpeech: "adjective" },
      { word: "\u0633\u0633\u062A\u0627 (Sasta)", translation: "cheap", pronunciation: "SAS-taa", exampleSentence: "\u06A9\u0648\u0626\u06CC \u0633\u0633\u062A\u0627 \u062F\u06A9\u06BE\u0627\u0626\u06CC\u06D2\u06D4", exampleTranslation: "Show me something cheaper.", partOfSpeech: "adjective" },
      { word: "\u062F\u06A9\u0627\u0646 (Dukaan)", translation: "shop", pronunciation: "doo-KAAN", exampleSentence: "\u06CC\u06C1 \u062F\u06A9\u0627\u0646 \u0627\u0686\u06BE\u06CC \u06C1\u06D2\u06D4", exampleTranslation: "This shop is good.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Bargaining Language",
        explanation: "Bargaining is expected in Pakistani bazaars. Use '\u06A9\u0645 \u06A9\u0631\u06CC\u06BA' (kam karein - reduce) and always counter-offer at 50-60% of the asking price.",
        examples: [
          { correct: "\u06A9\u0686\u06BE \u06A9\u0645 \u06A9\u0631\u06CC\u06BA (Kuchh kam karein)", translation: "Please reduce a bit" },
          { correct: "\u0622\u062E\u0631\u06CC \u0642\u06CC\u0645\u062A \u06A9\u06CC\u0627 \u06C1\u06D2\u061F (Aakhri qeemat kya hai?)", translation: "What's the final price?" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ur-bazaar-shopping",
        title: "Bargaining for Clothes",
        situation: "You're at a clothing stall in a Pakistani bazaar",
        agentRole: "You are a bazaar shopkeeper. Quote high prices and expect the student to bargain.",
        userGoal: "Ask prices, bargain, and make a purchase",
        targetPhrases: ["Kitnay ka hai?", "Bohat mehnga hai", "Kuchh kam karein"],
        successCriteria: ["Asks price", "Attempts to bargain", "Completes transaction"],
      },
    ],
    culturalNotes: [
      {
        title: "Bazaar Bargaining",
        content: "In Pakistani bazaars, the first price quoted is almost never the real price. Bargaining is a social art. Start by offering 40-50% of the asking price and work towards the middle. It's friendly and expected - don't feel bad about negotiating!",
        region: "Pakistan",
      },
    ],
  },
];

// ============================================
// Module 5: A1 Assessment
// ============================================

const assessmentLesson: LanguageLesson = {
  id: "ur-a1-assessment",
  slug: "a1-assessment",
  title: "A1 Level Assessment",
  content: `# \u0627\u06CC \u06F1 \u0627\u0645\u062A\u062D\u0627\u0646 (A1 Imtihaan)

Congratulations on completing A1! This assessment tests your Urdu knowledge.

## What to Expect

- 5 text questions (vocabulary, grammar)
- 5 voice scenarios (conversation practice)
- You need 7/10 correct to pass.

## Review Key Topics

- Greetings (Salam, Aadaab)
- Introductions (Mera naam, Main... se hoon)
- Numbers 1-20
- Family vocabulary
- Food and restaurant phrases
- Asking for directions
- Bargaining at the bazaar

Kamyaabi ki dua! (Good luck!)`,
  targetLanguage: "ur",
  proficiencyLevel: "A1",
  moduleId: "ur-a1-m5",
  moduleTitle: "A1 Assessment",
  order: 10,
  isAssessment: true,
  vocabulary: [],
  grammarPoints: [],
  voiceScenarios: [],
  assessmentQuestions: [
    { id: "uq1", type: "text", prompt: "How do you say 'Hello, my name is...' in Urdu?", targetPhrases: ["assalam", "mera naam"], successCriteria: ["Uses Salam greeting and self-introduction"] },
    { id: "uq2", type: "text", prompt: "Count from 1 to 5 in Urdu.", targetPhrases: ["ek", "do", "teen", "char", "panch"], successCriteria: ["Correctly lists numbers 1-5"] },
    { id: "uq3", type: "voice", prompt: "Introduce yourself: Say your name, where you're from, and your age.", targetPhrases: ["mera naam", "main", "se hoon", "umar"], successCriteria: ["States name", "Mentions origin", "States age"] },
    { id: "uq4", type: "voice", prompt: "You're at a dhaba. Order chai and roti.", targetPhrases: ["mujhe", "chahiye", "chai", "roti"], successCriteria: ["Orders items", "Uses chahiye", "Polite form"] },
    { id: "uq5", type: "voice", prompt: "You're at a bazaar. Ask the price and try to bargain.", targetPhrases: ["kitnay", "mehnga", "kam karein"], successCriteria: ["Asks price", "Attempts bargaining"] },
  ],
};

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  { id: "ur-a1-m1", title: "Module 1: First Words", description: "Greetings, introductions, and numbers", order: 1, lessons: module1Lessons },
  { id: "ur-a1-m2", title: "Module 2: About Me", description: "Personal information and family", order: 2, lessons: module2Lessons },
  { id: "ur-a1-m3", title: "Module 3: Daily Life", description: "Food, drink, and telling time", order: 3, lessons: module3Lessons },
  { id: "ur-a1-m4", title: "Module 4: Getting Around", description: "Directions and shopping", order: 4, lessons: module4Lessons },
  { id: "ur-a1-m5", title: "Module 5: A1 Assessment", description: "Test your A1 knowledge", order: 5, isAssessment: true, lessons: [assessmentLesson] },
];

export const urduA1Course: LanguageCourse = { ...courseInfo, modules };

export function getUrduA1Lessons() {
  return modules.flatMap((m) => m.lessons);
}

export function findUrduA1Lesson(slug: string) {
  return getUrduA1Lessons().find((l) => l.slug === slug);
}
