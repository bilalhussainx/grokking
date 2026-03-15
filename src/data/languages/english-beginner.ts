// English Beginner (ESL) Course Data
// CEFR A1 Level - For Non-Native Speakers

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

// ============================================
// L1-Aware Pronunciation & Grammar Predictions
// ============================================

export const PRONUNCIATION_FOCUS: Record<string, { prioritySounds: string[]; commonErrors: string[] }> = {
  es: { prioritySounds: ['/b/ vs /v/', '/ʃ/ (sh)', 'schwa /ə/'], commonErrors: ['"Espain" for "Spain"', 'Missing vowel reduction'] },
  fr: { prioritySounds: ['/h/ (often dropped)', '/θ/ and /ð/ (th)'], commonErrors: ['"I \'ave" for "I have"', 'Syllable-timed rhythm'] },
  hi: { prioritySounds: ['/w/ vs /v/', 'Aspirated stops'], commonErrors: ['"Wery" for "Very"', 'Vowel confusion /æ/ vs /ɛ/'] },
  zh: { prioritySounds: ['/l/ vs /r/', 'Consonant clusters', 'Final consonants'], commonErrors: ['"Fried" → "Fry"', 'Dropped word-final sounds'] },
  ar: { prioritySounds: ['/p/ vs /b/', '/v/ sound'], commonErrors: ['"Bark" for "Park"', 'Missing /v/ sound'] },
};

export const GRAMMAR_ERROR_PREDICTION: Record<string, string[]> = {
  es: ['Article gender transfer', 'Adjective placement after noun'],
  fr: ['False friends (actually ≠ actuellement)', 'Article overuse'],
  hi: ['Article omission', 'SOV word order transfer'],
  zh: ['Article omission', 'Tense marker omission', 'No plural markers'],
  ar: ['Verb agreement errors', 'Redundant pronoun usage'],
};

// ============================================
// Course Info
// ============================================

const courseInfo = {
  id: "english-beginner",
  slug: "english-beginner",
  title: "English Beginner (ESL) - A1",
  language: "en",
  languageName: "English",
  proficiencyLevel: "A1" as const,
  description: "Master everyday English from scratch. Learn greetings, introductions, daily routines, shopping, directions, and basic grammar. Designed for non-native speakers at the CEFR A1 level.",
  targetAudience: "Non-native speakers with little or no English experience",
  estimatedHours: 60,
  nextCourseSlug: "english-intermediate",
  icon: "🇬🇧",
};

// ============================================
// Module 1: First Steps
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "en-beginner-l1",
    slug: "alphabet-and-phonics",
    title: "The Alphabet & Basic Phonics",
    content: `# The Alphabet & Basic Phonics

Welcome to English! Let's start with the 26 letters and their sounds.

## The English Alphabet

A B C D E F G H I J K L M N O P Q R S T U V W X Y Z

## Vowels vs. Consonants

English has **5 vowels**: A, E, I, O, U — and **21 consonants**.

Vowels are special because they can make different sounds:
- **A** → /æ/ as in "cat", /eɪ/ as in "cake"
- **E** → /ɛ/ as in "bed", /iː/ as in "see"
- **I** → /ɪ/ as in "sit", /aɪ/ as in "like"
- **O** → /ɒ/ as in "hot", /oʊ/ as in "go"
- **U** → /ʌ/ as in "bus", /uː/ as in "blue"

## Common Consonant Sounds

- **TH** → /θ/ as in "think" and /ð/ as in "this"
- **SH** → /ʃ/ as in "shop"
- **CH** → /tʃ/ as in "check"

## Spelling Your Name

Use "My name is spelled..." to spell your name aloud:
- "M-A-R-I-A"`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m1",
    moduleTitle: "First Steps",
    order: 1,
    topicId: "en-beginner-alphabet-and-phonics",
    vocabulary: [
      { word: "letter", translation: "letter (of the alphabet)", pronunciation: "/ˈlɛtər/", exampleSentence: "There are 26 letters in English.", exampleTranslation: "There are 26 letters in English.", partOfSpeech: "noun" },
      { word: "spell", translation: "to say or write letters in order", pronunciation: "/spɛl/", exampleSentence: "Can you spell your name?", exampleTranslation: "Can you spell your name?", partOfSpeech: "verb" },
      { word: "vowel", translation: "A, E, I, O, U", pronunciation: "/ˈvaʊəl/", exampleSentence: "A, E, I, O, U are vowels.", exampleTranslation: "A, E, I, O, U are vowels.", partOfSpeech: "noun" },
      { word: "sound", translation: "noise a letter makes", pronunciation: "/saʊnd/", exampleSentence: "What sound does this letter make?", exampleTranslation: "What sound does this letter make?", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Capital Letters",
        explanation: "English uses capital (big) letters at the start of a sentence and for names of people, places, and days.",
        examples: [
          { correct: "My name is Ana.", translation: "My name is Ana.", note: "Capital M starts the sentence, capital A for the name" },
          { correct: "I live in London.", translation: "I live in London.", note: "Capital I (always), capital L for the city" },
        ],
        commonMistakes: [
          { incorrect: "my name is ana.", correction: "My name is Ana.", explanation: "Always capitalize the first word and proper nouns." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "spell-your-name",
        title: "Spelling Your Name",
        situation: "You are registering at a hotel and the receptionist needs your name.",
        agentRole: "You are a hotel receptionist. Ask the guest for their name and ask them to spell it.",
        userGoal: "Say your name and spell it letter by letter.",
        targetPhrases: ["My name is...", "It's spelled..."],
        successCriteria: ["States their name", "Spells the name using English letters"],
      },
    ],
    culturalNotes: [
      {
        title: "English Around the World",
        content: "English is spoken as a first language in the UK, USA, Canada, Australia, New Zealand, and Ireland. Each country has its own accent and some different vocabulary, but they can all understand each other.",
      },
    ],
  },
  {
    id: "en-beginner-l2",
    slug: "greetings",
    title: "Hello! Greetings & Farewells",
    content: `# Hello! Greetings & Farewells

Learn the most common ways to say hello and goodbye.

## Greetings

- **Hello / Hi** — General greeting (any time)
- **Good morning** — Before noon
- **Good afternoon** — Noon to ~5 PM
- **Good evening** — After ~5 PM

## Farewells

- **Goodbye / Bye** — Standard farewell
- **See you later** — Casual, you will meet again
- **Good night** — Said when going to bed or leaving late at night
- **Have a nice day** — Polite farewell (shops, offices)

## How Are You?

- **How are you?** — Standard question
- **I'm fine, thanks. And you?** — Standard reply
- **Not bad.** — Casual reply
- **I'm great!** — Positive reply`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m1",
    moduleTitle: "First Steps",
    order: 2,
    topicId: "en-beginner-greetings",
    vocabulary: [
      { word: "hello", translation: "general greeting", pronunciation: "/həˈloʊ/", exampleSentence: "Hello! How are you?", exampleTranslation: "Hello! How are you?", partOfSpeech: "interjection" },
      { word: "goodbye", translation: "farewell", pronunciation: "/ɡʊdˈbaɪ/", exampleSentence: "Goodbye! See you tomorrow.", exampleTranslation: "Goodbye! See you tomorrow.", partOfSpeech: "interjection" },
      { word: "morning", translation: "early part of the day", pronunciation: "/ˈmɔːrnɪŋ/", exampleSentence: "Good morning, teacher!", exampleTranslation: "Good morning, teacher!", partOfSpeech: "noun" },
      { word: "fine", translation: "good, okay", pronunciation: "/faɪn/", exampleSentence: "I'm fine, thank you.", exampleTranslation: "I'm fine, thank you.", partOfSpeech: "adjective" },
      { word: "please", translation: "polite request word", pronunciation: "/pliːz/", exampleSentence: "A coffee, please.", exampleTranslation: "A coffee, please.", partOfSpeech: "adverb" },
      { word: "thank you", translation: "expression of gratitude", pronunciation: "/θæŋk juː/", exampleSentence: "Thank you very much!", exampleTranslation: "Thank you very much!", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Subject Pronoun 'I'",
        explanation: "In English, 'I' (meaning 'me' as the subject) is ALWAYS written with a capital letter, even in the middle of a sentence.",
        examples: [
          { correct: "I am fine.", translation: "I am fine." },
          { correct: "My friend and I are happy.", translation: "My friend and I are happy." },
        ],
        commonMistakes: [
          { incorrect: "i am fine.", correction: "I am fine.", explanation: "The pronoun 'I' is always capitalized." },
        ],
      },
      {
        title: "Contractions with 'am'",
        explanation: "In spoken English and casual writing, 'I am' becomes 'I'm'.",
        examples: [
          { correct: "I'm fine.", translation: "I am fine." },
          { correct: "I'm from Brazil.", translation: "I am from Brazil." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "meeting-neighbor",
        title: "Meeting a Neighbor",
        situation: "You just moved to a new apartment. A neighbor says hello in the hallway.",
        agentRole: "You are a friendly neighbor named Tom. Greet the student, ask how they are, and say goodbye.",
        userGoal: "Greet Tom, respond to 'How are you?', and say goodbye.",
        targetPhrases: ["Hello", "I'm fine, thanks", "Goodbye", "Nice to meet you"],
        successCriteria: ["Uses a greeting", "Responds to How are you?", "Says farewell"],
      },
    ],
    culturalNotes: [
      {
        title: "Small Talk is Important",
        content: "In English-speaking countries, people often ask 'How are you?' as a greeting — they don't always expect a long answer. 'I'm fine, thanks' or 'Good, and you?' is enough. It's a social custom, not a medical question!",
      },
    ],
  },
  {
    id: "en-beginner-l3",
    slug: "numbers-and-introductions",
    title: "My Name Is... & Numbers 1-100",
    content: `# My Name Is... & Numbers 1-100

Introduce yourself and master numbers.

## Introducing Yourself

- **My name is...** / **I'm...** — Stating your name
- **Nice to meet you.** — Said when meeting someone for the first time
- **Where are you from?** — Asking about origin
- **I'm from...** — Answering about origin

## Numbers 1-20

1-one, 2-two, 3-three, 4-four, 5-five, 6-six, 7-seven, 8-eight, 9-nine, 10-ten, 11-eleven, 12-twelve, 13-thirteen, 14-fourteen, 15-fifteen, 16-sixteen, 17-seventeen, 18-eighteen, 19-nineteen, 20-twenty

## Tens: 20-100

20-twenty, 30-thirty, 40-forty, 50-fifty, 60-sixty, 70-seventy, 80-eighty, 90-ninety, 100-one hundred

## Combining

- **twenty-one** (21), **thirty-five** (35), **ninety-nine** (99)

## Giving Your Phone Number

Say each digit: 555-0123 = "five-five-five, zero-one-two-three"`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m1",
    moduleTitle: "First Steps",
    order: 3,
    topicId: "en-beginner-numbers-and-introductions",
    vocabulary: [
      { word: "name", translation: "what someone is called", pronunciation: "/neɪm/", exampleSentence: "My name is Sara.", exampleTranslation: "My name is Sara.", partOfSpeech: "noun" },
      { word: "from", translation: "indicates origin", pronunciation: "/frʌm/", exampleSentence: "I'm from Japan.", exampleTranslation: "I'm from Japan.", partOfSpeech: "preposition" },
      { word: "number", translation: "a figure like 1, 2, 3", pronunciation: "/ˈnʌmbər/", exampleSentence: "What is your phone number?", exampleTranslation: "What is your phone number?", partOfSpeech: "noun" },
      { word: "nice", translation: "pleasant, good", pronunciation: "/naɪs/", exampleSentence: "Nice to meet you!", exampleTranslation: "Nice to meet you!", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "To Be: am / is / are",
        explanation: "The verb 'to be' is the most important verb in English. At A1, learn these three forms: I am, you are, he/she/it is.",
        examples: [
          { correct: "I am a student.", translation: "I am a student.", note: "I + am" },
          { correct: "You are from Mexico.", translation: "You are from Mexico.", note: "You + are" },
          { correct: "She is my teacher.", translation: "She is my teacher.", note: "She + is" },
        ],
        commonMistakes: [
          { incorrect: "I is a student.", correction: "I am a student.", explanation: "'I' always goes with 'am', never 'is'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "first-day-class",
        title: "First Day of Class",
        situation: "It's your first day at an English school. The teacher asks you to introduce yourself.",
        agentRole: "You are an English teacher named Mrs. Brown. Ask the new student their name, where they are from, and their phone number.",
        userGoal: "Introduce yourself with name, country, and give your phone number.",
        targetPhrases: ["My name is...", "I'm from...", "My number is..."],
        successCriteria: ["States name", "Says country of origin", "Gives a phone number using English digits"],
      },
    ],
  },
];

// ============================================
// Module 2: About Me
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "en-beginner-l4",
    slug: "personal-info-and-countries",
    title: "Personal Info & Countries",
    content: `# Personal Info & Countries

Tell people about yourself: your age, nationality, and job.

## Talking About Age

- **How old are you?** — Asking someone's age
- **I am 25 years old.** / **I'm 25.** — Stating your age

## Countries & Nationalities

| Country | Nationality |
|---------|------------|
| Japan | Japanese |
| Brazil | Brazilian |
| China | Chinese |
| France | French |
| Spain | Spanish |
| Turkey | Turkish |
| Egypt | Egyptian |
| India | Indian |

## Jobs / Occupations

- **I'm a student.** / **I'm a teacher.** / **I'm a doctor.**
- **I work in a hospital.** / **I work at a school.**
- **What do you do?** — Asking about someone's job`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m2",
    moduleTitle: "About Me",
    order: 4,
    topicId: "en-beginner-personal-info-and-countries",
    vocabulary: [
      { word: "country", translation: "a nation", pronunciation: "/ˈkʌntri/", exampleSentence: "What country are you from?", exampleTranslation: "What country are you from?", partOfSpeech: "noun" },
      { word: "old", translation: "age-related", pronunciation: "/oʊld/", exampleSentence: "I am 30 years old.", exampleTranslation: "I am 30 years old.", partOfSpeech: "adjective" },
      { word: "student", translation: "a person who studies", pronunciation: "/ˈstuːdənt/", exampleSentence: "I'm a student at the university.", exampleTranslation: "I'm a student at the university.", partOfSpeech: "noun" },
      { word: "work", translation: "to have a job", pronunciation: "/wɜːrk/", exampleSentence: "I work in an office.", exampleTranslation: "I work in an office.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Articles: a / an",
        explanation: "Use 'a' before consonant sounds and 'an' before vowel sounds. These are used with singular, countable nouns.",
        examples: [
          { correct: "I'm a teacher.", translation: "I'm a teacher.", note: "'teacher' starts with a consonant sound" },
          { correct: "She's an engineer.", translation: "She's an engineer.", note: "'engineer' starts with a vowel sound" },
        ],
        commonMistakes: [
          { incorrect: "I'm teacher.", correction: "I'm a teacher.", explanation: "Jobs need 'a' or 'an' before them in English." },
          { incorrect: "He's a engineer.", correction: "He's an engineer.", explanation: "Use 'an' before vowel sounds (e, a, i, o, u)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "immigration-form",
        title: "At the Airport",
        situation: "You arrive at a UK airport and the immigration officer asks you questions.",
        agentRole: "You are an immigration officer at Heathrow Airport. Ask the traveler their name, nationality, age, and occupation politely.",
        userGoal: "Answer all questions about yourself clearly.",
        targetPhrases: ["I'm from...", "I'm ... years old", "I'm a..."],
        successCriteria: ["States nationality", "Gives age", "Mentions occupation"],
      },
    ],
    culturalNotes: [
      {
        title: "Asking About Age",
        content: "In many English-speaking countries, it can be considered rude to ask an adult's age, especially in formal or work settings. Among friends, it's usually fine. If unsure, don't ask — wait until they mention it.",
      },
    ],
  },
  {
    id: "en-beginner-l5",
    slug: "family",
    title: "My Family",
    content: `# My Family

Talk about the people closest to you.

## Family Members

- **mother / mom** — **father / dad**
- **sister** — **brother**
- **daughter** — **son**
- **grandmother / grandma** — **grandfather / grandpa**
- **wife** — **husband**
- **aunt** — **uncle**
- **cousin** — (same word for male and female)

## Describing Family

- **I have two brothers.**
- **My sister is older than me.**
- **My parents live in Tokyo.**

## Possessives

- **my** mother, **your** father, **his** brother, **her** sister
- **our** family, **their** children`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m2",
    moduleTitle: "About Me",
    order: 5,
    topicId: "en-beginner-family",
    vocabulary: [
      { word: "mother", translation: "female parent", pronunciation: "/ˈmʌðər/", exampleSentence: "My mother is a nurse.", exampleTranslation: "My mother is a nurse.", partOfSpeech: "noun" },
      { word: "father", translation: "male parent", pronunciation: "/ˈfɑːðər/", exampleSentence: "My father works in a bank.", exampleTranslation: "My father works in a bank.", partOfSpeech: "noun" },
      { word: "brother", translation: "male sibling", pronunciation: "/ˈbrʌðər/", exampleSentence: "I have one brother.", exampleTranslation: "I have one brother.", partOfSpeech: "noun" },
      { word: "sister", translation: "female sibling", pronunciation: "/ˈsɪstər/", exampleSentence: "My sister is 12 years old.", exampleTranslation: "My sister is 12 years old.", partOfSpeech: "noun" },
      { word: "parents", translation: "mother and father", pronunciation: "/ˈpɛrənts/", exampleSentence: "My parents live in Seoul.", exampleTranslation: "My parents live in Seoul.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Possessive Adjectives",
        explanation: "Possessive adjectives show who something belongs to. They come before the noun.",
        examples: [
          { correct: "This is my brother.", translation: "This is my brother." },
          { correct: "Her name is Maria.", translation: "Her name is Maria." },
          { correct: "Their house is big.", translation: "Their house is big." },
        ],
        commonMistakes: [
          { incorrect: "This is me brother.", correction: "This is my brother.", explanation: "'me' is an object pronoun, 'my' is possessive." },
        ],
      },
      {
        title: "Have / Has",
        explanation: "Use 'have' with I/you/we/they. Use 'has' with he/she/it.",
        examples: [
          { correct: "I have two sisters.", translation: "I have two sisters." },
          { correct: "She has one brother.", translation: "She has one brother." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "show-family-photo",
        title: "Showing a Family Photo",
        situation: "Your classmate asks about your family. You show them a photo on your phone.",
        agentRole: "You are a classmate named Lisa. Ask about the student's family members in the photo.",
        userGoal: "Describe your family members using possessives and basic descriptions.",
        targetPhrases: ["This is my...", "I have...", "He/She is..."],
        successCriteria: ["Names at least 3 family members", "Uses possessive adjectives", "Gives a simple description"],
      },
    ],
  },
  {
    id: "en-beginner-l6",
    slug: "describing-people",
    title: "Describing People",
    content: `# Describing People

Learn to describe how people look and their personality.

## Appearance

- **tall / short** — height
- **young / old** — age
- **He has brown hair.** / **She has blue eyes.**
- **He wears glasses.**

## Personality

- **friendly** — nice to others
- **funny** — makes people laugh
- **quiet** — doesn't talk much
- **smart** — intelligent

## Asking About People

- **What does she look like?** — Asking about appearance
- **What is he like?** — Asking about personality
- **Who is that?** — Asking about identity`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m2",
    moduleTitle: "About Me",
    order: 6,
    topicId: "en-beginner-describing-people",
    vocabulary: [
      { word: "tall", translation: "having great height", pronunciation: "/tɔːl/", exampleSentence: "My brother is very tall.", exampleTranslation: "My brother is very tall.", partOfSpeech: "adjective" },
      { word: "hair", translation: "grows on your head", pronunciation: "/hɛr/", exampleSentence: "She has long black hair.", exampleTranslation: "She has long black hair.", partOfSpeech: "noun" },
      { word: "friendly", translation: "kind and nice", pronunciation: "/ˈfrɛndli/", exampleSentence: "My teacher is very friendly.", exampleTranslation: "My teacher is very friendly.", partOfSpeech: "adjective" },
      { word: "funny", translation: "makes people laugh", pronunciation: "/ˈfʌni/", exampleSentence: "He is really funny.", exampleTranslation: "He is really funny.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Adjective Order (Basics)",
        explanation: "In English, adjectives come BEFORE the noun, not after. This is different from many languages.",
        examples: [
          { correct: "a tall man", translation: "a tall man", note: "Adjective before noun" },
          { correct: "a friendly teacher", translation: "a friendly teacher" },
        ],
        commonMistakes: [
          { incorrect: "a man tall", correction: "a tall man", explanation: "In English, the adjective goes before the noun." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "describe-friend",
        title: "Describing a Friend",
        situation: "You are meeting someone at the airport. You describe your friend so they can find them.",
        agentRole: "You are picking someone up at the airport. Ask what their friend looks like.",
        userGoal: "Describe your friend's appearance so the driver can recognize them.",
        targetPhrases: ["He/She is...", "He/She has... hair", "He/She is wearing..."],
        successCriteria: ["Describes height or build", "Mentions hair or eye color", "Mentions clothing or accessories"],
      },
    ],
  },
];

// ============================================
// Module 3: Daily Life
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "en-beginner-l7",
    slug: "telling-time",
    title: "Telling the Time",
    content: `# Telling the Time

Master how to ask and tell the time in English.

## Asking the Time

- **What time is it?**
- **Excuse me, do you have the time?**

## Telling the Time

- **It's three o'clock.** (3:00)
- **It's half past seven.** (7:30)
- **It's quarter past nine.** (9:15)
- **It's quarter to six.** (5:45)
- **It's ten past two.** (2:10)
- **It's twenty to eight.** (7:40)

## AM / PM

- **AM** = midnight to noon (morning)
- **PM** = noon to midnight (afternoon/evening)
- "I wake up at 7 AM." / "The class is at 3 PM."

## Digital Time

You can also just say the numbers: "It's seven thirty" (7:30).`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m3",
    moduleTitle: "Daily Life",
    order: 7,
    topicId: "en-beginner-telling-time",
    vocabulary: [
      { word: "time", translation: "what a clock shows", pronunciation: "/taɪm/", exampleSentence: "What time is it?", exampleTranslation: "What time is it?", partOfSpeech: "noun" },
      { word: "o'clock", translation: "exactly on the hour", pronunciation: "/əˈklɒk/", exampleSentence: "It's 3 o'clock.", exampleTranslation: "It's 3 o'clock.", partOfSpeech: "adverb" },
      { word: "half", translation: "30 minutes", pronunciation: "/hæf/", exampleSentence: "It's half past two.", exampleTranslation: "It's half past two.", partOfSpeech: "noun" },
      { word: "quarter", translation: "15 minutes", pronunciation: "/ˈkwɔːrtər/", exampleSentence: "It's quarter to five.", exampleTranslation: "It's quarter to five.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Prepositions of Time: at / in / on",
        explanation: "Use 'at' for specific times, 'in' for months/years/parts of the day, 'on' for days and dates.",
        examples: [
          { correct: "I wake up at 7 AM.", translation: "I wake up at 7 AM.", note: "'at' + specific time" },
          { correct: "I study in the morning.", translation: "I study in the morning.", note: "'in' + part of day" },
          { correct: "I have class on Monday.", translation: "I have class on Monday.", note: "'on' + day" },
        ],
        commonMistakes: [
          { incorrect: "I wake up in 7 AM.", correction: "I wake up at 7 AM.", explanation: "Use 'at' for clock times, not 'in'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ask-the-time",
        title: "Asking a Stranger for the Time",
        situation: "You are waiting for a bus and your phone is dead.",
        agentRole: "You are a person waiting at the bus stop. The student asks you for the time. Tell them it's 3:45 PM.",
        userGoal: "Politely ask for the time and confirm you understood.",
        targetPhrases: ["Excuse me", "What time is it?", "Thank you"],
        successCriteria: ["Uses a polite opener", "Asks for the time", "Acknowledges the answer"],
      },
    ],
  },
  {
    id: "en-beginner-l8",
    slug: "daily-routines",
    title: "Daily Routines",
    content: `# Daily Routines

Describe what you do every day.

## Common Daily Actions

- **wake up** — open your eyes, get out of bed
- **get dressed** — put on clothes
- **have breakfast** — eat the first meal
- **go to work / school** — travel there
- **have lunch** — eat midday meal
- **come home** — return to your house
- **have dinner** — eat the evening meal
- **go to bed** — go to sleep

## Example Routine

"I wake up at 7 AM. I have breakfast at 7:30. I go to work at 8:30. I have lunch at 1 PM. I come home at 6 PM. I have dinner at 7:30. I go to bed at 11 PM."

## Adverbs of Frequency

- **always** (100%) → I always have breakfast.
- **usually** (80%) → I usually walk to work.
- **sometimes** (50%) → I sometimes watch TV.
- **never** (0%) → I never drink coffee.`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m3",
    moduleTitle: "Daily Life",
    order: 8,
    topicId: "en-beginner-daily-routines",
    vocabulary: [
      { word: "wake up", translation: "to stop sleeping", pronunciation: "/weɪk ʌp/", exampleSentence: "I wake up at 6 o'clock.", exampleTranslation: "I wake up at 6 o'clock.", partOfSpeech: "phrasal verb" },
      { word: "breakfast", translation: "first meal of the day", pronunciation: "/ˈbrɛkfəst/", exampleSentence: "I have breakfast at 7 AM.", exampleTranslation: "I have breakfast at 7 AM.", partOfSpeech: "noun" },
      { word: "usually", translation: "most of the time", pronunciation: "/ˈjuːʒuəli/", exampleSentence: "I usually take the bus.", exampleTranslation: "I usually take the bus.", partOfSpeech: "adverb" },
      { word: "sometimes", translation: "occasionally", pronunciation: "/ˈsʌmtaɪmz/", exampleSentence: "I sometimes go to the gym.", exampleTranslation: "I sometimes go to the gym.", partOfSpeech: "adverb" },
      { word: "always", translation: "every time", pronunciation: "/ˈɔːlweɪz/", exampleSentence: "I always brush my teeth.", exampleTranslation: "I always brush my teeth.", partOfSpeech: "adverb" },
    ],
    grammarPoints: [
      {
        title: "Present Simple: Daily Habits",
        explanation: "Use the present simple to talk about things you do regularly. With I/you/we/they, use the base form. With he/she/it, add -s.",
        examples: [
          { correct: "I wake up at 7.", translation: "I wake up at 7." },
          { correct: "She wakes up at 8.", translation: "She wakes up at 8.", note: "Add -s for he/she/it" },
          { correct: "They go to school at 9.", translation: "They go to school at 9." },
        ],
        commonMistakes: [
          { incorrect: "She wake up at 8.", correction: "She wakes up at 8.", explanation: "Add -s to the verb for he/she/it." },
        ],
      },
      {
        title: "Position of Frequency Adverbs",
        explanation: "Frequency adverbs (always, usually, sometimes, never) go BEFORE the main verb but AFTER 'be'.",
        examples: [
          { correct: "I always eat breakfast.", translation: "I always eat breakfast.", note: "Before 'eat'" },
          { correct: "She is usually happy.", translation: "She is usually happy.", note: "After 'is'" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "describe-your-day",
        title: "Describing Your Day",
        situation: "Your language partner asks you about your typical day.",
        agentRole: "You are a language exchange partner named Alex. Ask about the student's daily routine: when they wake up, what they eat, and what they do in the evening.",
        userGoal: "Describe at least 5 activities in your daily routine with times.",
        targetPhrases: ["I wake up at...", "I usually...", "I have... at..."],
        successCriteria: ["Mentions at least 5 daily activities", "Uses times", "Uses at least one frequency adverb"],
      },
    ],
  },
  {
    id: "en-beginner-l9",
    slug: "jobs-and-workplaces",
    title: "Jobs & Workplaces",
    content: `# Jobs & Workplaces

Talk about what you and others do for a living.

## Common Jobs

- **teacher** — works in a school
- **doctor** — works in a hospital
- **nurse** — works in a hospital
- **engineer** — designs and builds things
- **shop assistant** — works in a store
- **driver** — drives a bus, taxi, truck
- **chef / cook** — prepares food
- **police officer** — keeps people safe

## Workplaces

- **office** / **hospital** / **school** / **restaurant** / **shop** / **factory**

## Talking About Jobs

- **What do you do?** — Asking about someone's job
- **I'm a nurse.** — Stating your job
- **I work in a hospital.** — Stating your workplace
- **I work from home.** — Remote work`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m3",
    moduleTitle: "Daily Life",
    order: 9,
    topicId: "en-beginner-jobs-and-workplaces",
    vocabulary: [
      { word: "teacher", translation: "person who teaches", pronunciation: "/ˈtiːtʃər/", exampleSentence: "My mother is a teacher.", exampleTranslation: "My mother is a teacher.", partOfSpeech: "noun" },
      { word: "doctor", translation: "medical professional", pronunciation: "/ˈdɒktər/", exampleSentence: "I want to be a doctor.", exampleTranslation: "I want to be a doctor.", partOfSpeech: "noun" },
      { word: "office", translation: "place where people work at desks", pronunciation: "/ˈɒfɪs/", exampleSentence: "She works in an office.", exampleTranslation: "She works in an office.", partOfSpeech: "noun" },
      { word: "hospital", translation: "place for sick people", pronunciation: "/ˈhɒspɪtəl/", exampleSentence: "The hospital is near my house.", exampleTranslation: "The hospital is near my house.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Present Simple: Negative & Questions",
        explanation: "To make negatives, use 'don't' (I/you/we/they) or 'doesn't' (he/she/it). For questions, use 'Do you...?' or 'Does he...?'.",
        examples: [
          { correct: "I don't work on Sundays.", translation: "I don't work on Sundays." },
          { correct: "She doesn't like her job.", translation: "She doesn't like her job.", note: "doesn't + base verb (no -s)" },
          { correct: "Do you work here?", translation: "Do you work here?" },
          { correct: "Does she work at night?", translation: "Does she work at night?" },
        ],
        commonMistakes: [
          { incorrect: "She doesn't works.", correction: "She doesn't work.", explanation: "After 'doesn't', use the base form (no -s)." },
          { incorrect: "Do she work?", correction: "Does she work?", explanation: "Use 'Does' with he/she/it, not 'Do'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "job-interview-basic",
        title: "Simple Job Conversation",
        situation: "You meet someone at a party and talk about your jobs.",
        agentRole: "You are David, an engineer. Ask the student what they do and where they work. Share your own job too.",
        userGoal: "Tell David about your job and workplace, and ask about his.",
        targetPhrases: ["I'm a...", "I work in...", "What do you do?"],
        successCriteria: ["States their job", "Mentions workplace", "Asks about the other person's job"],
      },
    ],
    culturalNotes: [
      {
        title: "'What Do You Do?' at Parties",
        content: "In English-speaking countries, asking 'What do you do?' (meaning your job) is one of the most common conversation starters. It's not considered too personal at A1-level social events. However, some people prefer to ask 'What are you interested in?' instead.",
      },
    ],
  },
];

// ============================================
// Module 4: Home & Food
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "en-beginner-l10",
    slug: "rooms-and-furniture",
    title: "Rooms & Furniture",
    content: `# Rooms & Furniture

Describe your home.

## Rooms

- **kitchen** — where you cook
- **bedroom** — where you sleep
- **bathroom** — where you shower/bathe
- **living room** — where you relax, watch TV
- **dining room** — where you eat

## Furniture

- **bed** / **chair** / **table** / **sofa** / **desk**
- **fridge** / **cooker (stove)** / **cupboard** / **shelf**

## Describing Your Home

- "My flat has two bedrooms."
- "There is a big kitchen."
- "The bathroom is next to the bedroom."

## Prepositions of Place

- **in** the kitchen / **on** the table / **under** the bed / **next to** the door / **between** the chairs`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m4",
    moduleTitle: "Home & Food",
    order: 10,
    topicId: "en-beginner-rooms-and-furniture",
    vocabulary: [
      { word: "kitchen", translation: "room for cooking", pronunciation: "/ˈkɪtʃɪn/", exampleSentence: "I cook dinner in the kitchen.", exampleTranslation: "I cook dinner in the kitchen.", partOfSpeech: "noun" },
      { word: "bedroom", translation: "room for sleeping", pronunciation: "/ˈbɛdruːm/", exampleSentence: "My bedroom is small.", exampleTranslation: "My bedroom is small.", partOfSpeech: "noun" },
      { word: "table", translation: "furniture with a flat top", pronunciation: "/ˈteɪbəl/", exampleSentence: "The book is on the table.", exampleTranslation: "The book is on the table.", partOfSpeech: "noun" },
      { word: "next to", translation: "beside", pronunciation: "/nɛkst tuː/", exampleSentence: "The bank is next to the shop.", exampleTranslation: "The bank is next to the shop.", partOfSpeech: "preposition" },
    ],
    grammarPoints: [
      {
        title: "There is / There are",
        explanation: "Use 'There is' for singular nouns and 'There are' for plural nouns to say something exists.",
        examples: [
          { correct: "There is a sofa in the living room.", translation: "There is a sofa in the living room." },
          { correct: "There are two chairs in the kitchen.", translation: "There are two chairs in the kitchen." },
        ],
        commonMistakes: [
          { incorrect: "There is two chairs.", correction: "There are two chairs.", explanation: "Use 'there are' for plural nouns." },
          { incorrect: "Have a sofa in the room.", correction: "There is a sofa in the room.", explanation: "In English, use 'there is/are' to describe what a place contains." },
        ],
      },
      {
        title: "Prepositions of Place",
        explanation: "Use prepositions to say WHERE something is: in, on, under, next to, between, behind, in front of.",
        examples: [
          { correct: "The cat is under the table.", translation: "The cat is under the table." },
          { correct: "The lamp is on the desk.", translation: "The lamp is on the desk." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "describe-your-home",
        title: "Describing Your Home",
        situation: "A new friend asks about your home.",
        agentRole: "You are Emma, a new classmate. Ask about the student's home: how many rooms, what furniture they have, and their favorite room.",
        userGoal: "Describe your home using There is/are and prepositions.",
        targetPhrases: ["There is...", "There are...", "My favorite room is...", "next to / in / on"],
        successCriteria: ["Describes at least 3 rooms", "Uses There is/are", "Uses at least one preposition of place"],
      },
    ],
  },
  {
    id: "en-beginner-l11",
    slug: "food-and-meals",
    title: "Food & Meals",
    content: `# Food & Meals

Talk about what you eat and drink.

## Common Foods

- **bread** / **rice** / **pasta** / **chicken** / **fish** / **egg**
- **cheese** / **butter** / **milk** / **yogurt**
- **apple** / **banana** / **orange** / **tomato**
- **potato** / **onion** / **carrot**

## Drinks

- **water** / **tea** / **coffee** / **juice** / **milk**

## Meals

- **breakfast** (morning) / **lunch** (midday) / **dinner** (evening)
- **snack** — small meal between main meals

## Likes and Dislikes

- **I like pizza.** / **I don't like fish.**
- **I love chocolate!** / **I hate onions.**
- **Do you like rice?** — **Yes, I do.** / **No, I don't.**`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m4",
    moduleTitle: "Home & Food",
    order: 11,
    topicId: "en-beginner-food-and-meals",
    vocabulary: [
      { word: "food", translation: "things you eat", pronunciation: "/fuːd/", exampleSentence: "I love Italian food.", exampleTranslation: "I love Italian food.", partOfSpeech: "noun" },
      { word: "water", translation: "clear liquid you drink", pronunciation: "/ˈwɔːtər/", exampleSentence: "Can I have some water, please?", exampleTranslation: "Can I have some water, please?", partOfSpeech: "noun" },
      { word: "rice", translation: "white/brown grain", pronunciation: "/raɪs/", exampleSentence: "I eat rice every day.", exampleTranslation: "I eat rice every day.", partOfSpeech: "noun" },
      { word: "like", translation: "to enjoy", pronunciation: "/laɪk/", exampleSentence: "I like chocolate.", exampleTranslation: "I like chocolate.", partOfSpeech: "verb" },
      { word: "hungry", translation: "wanting food", pronunciation: "/ˈhʌŋɡri/", exampleSentence: "I'm hungry. Let's eat!", exampleTranslation: "I'm hungry. Let's eat!", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Countable vs. Uncountable Nouns",
        explanation: "Countable nouns have plural forms (apple → apples). Uncountable nouns don't have plurals (rice, water, bread). Use 'some' with uncountable nouns and 'a/an' with singular countable nouns.",
        examples: [
          { correct: "I want an apple.", translation: "I want an apple.", note: "Countable: use a/an" },
          { correct: "I want some rice.", translation: "I want some rice.", note: "Uncountable: use some" },
          { correct: "I want two bananas.", translation: "I want two bananas.", note: "Countable plural: add -s" },
        ],
        commonMistakes: [
          { incorrect: "I want a rice.", correction: "I want some rice.", explanation: "Rice is uncountable — you can't use 'a'. Use 'some' instead." },
          { incorrect: "I want two breads.", correction: "I want two pieces of bread.", explanation: "'Bread' is uncountable. Use 'pieces of' or 'slices of'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ordering-food",
        title: "Ordering at a Cafe",
        situation: "You are at a small cafe and want to order lunch.",
        agentRole: "You are a waiter at a London cafe. Greet the customer, share the specials (sandwich, soup, salad), and take their order.",
        userGoal: "Order food and a drink, ask about options, and say thank you.",
        targetPhrases: ["Can I have...", "I'd like...", "Do you have...?", "Thank you"],
        successCriteria: ["Orders food", "Orders a drink", "Uses polite language"],
      },
    ],
    culturalNotes: [
      {
        title: "Tea Culture in the UK",
        content: "The British love tea! 'Fancy a cuppa?' means 'Would you like a cup of tea?' Tea with milk is the most common way to drink it in the UK. If someone offers you tea, it's a sign of hospitality.",
      },
    ],
  },
  {
    id: "en-beginner-l12",
    slug: "cooking-and-quantities",
    title: "Cooking & Quantities",
    content: `# Cooking & Quantities

Talk about how much food you need and basic cooking.

## Quantities

- **a bottle of** water / **a cup of** tea / **a glass of** juice
- **a piece of** cake / **a slice of** bread / **a bowl of** soup
- **a kilo of** apples / **a bag of** rice

## How Much / How Many

- **How much** water do you need? — for uncountable
- **How many** eggs do you need? — for countable
- **a lot of** / **some** / **a little** (uncountable) / **a few** (countable)

## Simple Cooking Words

- **cook** / **boil** / **fry** / **bake** / **cut** / **mix**
- "First, cut the onion. Then, fry it in oil."`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m4",
    moduleTitle: "Home & Food",
    order: 12,
    topicId: "en-beginner-cooking-and-quantities",
    vocabulary: [
      { word: "bottle", translation: "container for liquids", pronunciation: "/ˈbɒtəl/", exampleSentence: "A bottle of water, please.", exampleTranslation: "A bottle of water, please.", partOfSpeech: "noun" },
      { word: "cup", translation: "small container for drinks", pronunciation: "/kʌp/", exampleSentence: "I drink three cups of coffee a day.", exampleTranslation: "I drink three cups of coffee a day.", partOfSpeech: "noun" },
      { word: "cook", translation: "to prepare food with heat", pronunciation: "/kʊk/", exampleSentence: "I cook dinner every evening.", exampleTranslation: "I cook dinner every evening.", partOfSpeech: "verb" },
      { word: "cut", translation: "to divide with a knife", pronunciation: "/kʌt/", exampleSentence: "Cut the tomato into pieces.", exampleTranslation: "Cut the tomato into pieces.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "How much vs. How many",
        explanation: "'How much' is for uncountable nouns (water, rice, money). 'How many' is for countable nouns (apples, eggs, cups).",
        examples: [
          { correct: "How much milk do we need?", translation: "How much milk do we need?", note: "Milk is uncountable" },
          { correct: "How many eggs do we need?", translation: "How many eggs do we need?", note: "Eggs are countable" },
        ],
        commonMistakes: [
          { incorrect: "How many rice do we need?", correction: "How much rice do we need?", explanation: "Rice is uncountable, so use 'How much'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "grocery-shopping",
        title: "At the Grocery Store",
        situation: "You are shopping for ingredients to cook dinner.",
        agentRole: "You are a shop assistant. Help the customer find what they need and tell them prices.",
        userGoal: "Ask for quantities of food items and confirm prices.",
        targetPhrases: ["Can I have...?", "How much is...?", "I need a kilo of..."],
        successCriteria: ["Requests at least 3 items", "Uses quantity expressions", "Asks about price"],
      },
    ],
  },
];

// ============================================
// Module 5: Shopping & Money
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "en-beginner-l13",
    slug: "clothes-and-colors",
    title: "Clothes & Colors",
    content: `# Clothes & Colors

Talk about what you're wearing and what you want to buy.

## Clothes

- **shirt** / **T-shirt** / **blouse** — tops
- **trousers (UK) / pants (US)** / **jeans** / **shorts**
- **dress** / **skirt** / **jacket** / **coat**
- **shoes** / **boots** / **trainers (UK) / sneakers (US)**
- **hat** / **scarf** / **gloves**

## Colors

- **red** / **blue** / **green** / **yellow** / **black** / **white**
- **brown** / **grey (UK) / gray (US)** / **pink** / **orange** / **purple**

## Describing Clothes

- "I'm wearing a blue shirt."
- "She has a red dress."
- "These black shoes are nice."`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m5",
    moduleTitle: "Shopping & Money",
    order: 13,
    topicId: "en-beginner-clothes-and-colors",
    vocabulary: [
      { word: "shirt", translation: "top with buttons", pronunciation: "/ʃɜːrt/", exampleSentence: "He is wearing a white shirt.", exampleTranslation: "He is wearing a white shirt.", partOfSpeech: "noun" },
      { word: "shoes", translation: "worn on your feet", pronunciation: "/ʃuːz/", exampleSentence: "I need new shoes.", exampleTranslation: "I need new shoes.", partOfSpeech: "noun" },
      { word: "blue", translation: "color of the sky", pronunciation: "/bluː/", exampleSentence: "The sky is blue today.", exampleTranslation: "The sky is blue today.", partOfSpeech: "adjective" },
      { word: "wear", translation: "to have clothes on", pronunciation: "/wɛr/", exampleSentence: "I wear a jacket in winter.", exampleTranslation: "I wear a jacket in winter.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Demonstratives: this / that / these / those",
        explanation: "Use 'this/these' for things near you, and 'that/those' for things far away. 'This/that' = singular, 'these/those' = plural.",
        examples: [
          { correct: "This shirt is nice.", translation: "This shirt is nice.", note: "One shirt, near you" },
          { correct: "Those shoes are expensive.", translation: "Those shoes are expensive.", note: "Multiple shoes, far away" },
        ],
        commonMistakes: [
          { incorrect: "This shoes are nice.", correction: "These shoes are nice.", explanation: "'shoes' is plural, so use 'these' (not 'this')." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "clothes-shopping",
        title: "Shopping for Clothes",
        situation: "You are in a clothing store looking for a new outfit.",
        agentRole: "You are a shop assistant. Ask the customer what they are looking for, suggest items, and offer different colors and sizes.",
        userGoal: "Ask about items, colors, and sizes. Choose something to buy.",
        targetPhrases: ["Do you have this in...?", "I'm looking for...", "Can I try this on?"],
        successCriteria: ["Asks about an item", "Mentions a color or size", "Makes a decision"],
      },
    ],
  },
  {
    id: "en-beginner-l14",
    slug: "shopping-and-prices",
    title: "Shopping & Prices",
    content: `# Shopping & Prices

Buy things and understand prices.

## Asking About Prices

- **How much is this?** — singular
- **How much are these?** — plural
- **How much does it cost?**

## Money Words

- **pound (£)** — UK currency
- **dollar ($)** — US currency
- **euro (€)** — European currency
- **change** — coins you get back
- **receipt** — paper showing what you paid

## Useful Shopping Phrases

- "Can I pay by card?"
- "Do you take cash?"
- "Can I have a receipt, please?"
- "That's too expensive."
- "Is there a discount?"
- "I'll take it." — I want to buy it`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m5",
    moduleTitle: "Shopping & Money",
    order: 14,
    topicId: "en-beginner-shopping-and-prices",
    vocabulary: [
      { word: "price", translation: "how much something costs", pronunciation: "/praɪs/", exampleSentence: "What is the price?", exampleTranslation: "What is the price?", partOfSpeech: "noun" },
      { word: "cheap", translation: "low price", pronunciation: "/tʃiːp/", exampleSentence: "This bag is very cheap.", exampleTranslation: "This bag is very cheap.", partOfSpeech: "adjective" },
      { word: "expensive", translation: "high price", pronunciation: "/ɪkˈspɛnsɪv/", exampleSentence: "These shoes are too expensive.", exampleTranslation: "These shoes are too expensive.", partOfSpeech: "adjective" },
      { word: "buy", translation: "to pay for something", pronunciation: "/baɪ/", exampleSentence: "I want to buy a gift.", exampleTranslation: "I want to buy a gift.", partOfSpeech: "verb" },
      { word: "pay", translation: "to give money for something", pronunciation: "/peɪ/", exampleSentence: "Can I pay by card?", exampleTranslation: "Can I pay by card?", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Object Pronouns: me, you, him, her, it, us, them",
        explanation: "Object pronouns replace nouns that receive the action. They come after the verb.",
        examples: [
          { correct: "I like it.", translation: "I like it.", note: "'it' replaces the object (e.g., this shirt)" },
          { correct: "Give me the receipt.", translation: "Give me the receipt." },
          { correct: "Can you help us?", translation: "Can you help us?" },
        ],
        commonMistakes: [
          { incorrect: "I like she.", correction: "I like her.", explanation: "'she' is a subject pronoun. After a verb, use the object pronoun 'her'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "market-shopping",
        title: "At the Market",
        situation: "You are at an outdoor market and want to buy some souvenirs.",
        agentRole: "You are a market vendor. Greet the customer, tell them prices, and offer deals.",
        userGoal: "Ask prices, negotiate or comment on prices, and buy something.",
        targetPhrases: ["How much is this?", "That's too expensive.", "I'll take it."],
        successCriteria: ["Asks a price", "Reacts to the price", "Completes a purchase"],
      },
    ],
    culturalNotes: [
      {
        title: "Bargaining in English-Speaking Countries",
        content: "In the UK and US, prices in shops are fixed — you don't negotiate. However, at car-boot sales (UK), garage sales (US), and flea markets, friendly bargaining is common. You might say 'Would you take five pounds for this?'",
      },
    ],
  },
  {
    id: "en-beginner-l15",
    slug: "sizes-and-preferences",
    title: "Sizes & Preferences",
    content: `# Sizes & Preferences

Express what you want and choose the right size.

## Sizes

- **small (S)** / **medium (M)** / **large (L)** / **extra large (XL)**
- "Do you have this in a medium?"
- "It's too big / too small."

## Expressing Preferences

- "I prefer the blue one."
- "I like this one better."
- "Which one do you recommend?"
- "I think the red one is nicer."

## Comparing

- "This one is **cheaper** than that one."
- "The blue dress is **more expensive** than the green one."
- "This is the **best** shop in town."`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m5",
    moduleTitle: "Shopping & Money",
    order: 15,
    topicId: "en-beginner-sizes-and-preferences",
    vocabulary: [
      { word: "small", translation: "little in size", pronunciation: "/smɔːl/", exampleSentence: "This is too small for me.", exampleTranslation: "This is too small for me.", partOfSpeech: "adjective" },
      { word: "big", translation: "large in size", pronunciation: "/bɪɡ/", exampleSentence: "I need a bigger size.", exampleTranslation: "I need a bigger size.", partOfSpeech: "adjective" },
      { word: "prefer", translation: "to like more", pronunciation: "/prɪˈfɜːr/", exampleSentence: "I prefer the black one.", exampleTranslation: "I prefer the black one.", partOfSpeech: "verb" },
      { word: "better", translation: "more good", pronunciation: "/ˈbɛtər/", exampleSentence: "This one is better.", exampleTranslation: "This one is better.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Basic Comparatives: -er / more",
        explanation: "Short adjectives add '-er' (cheap → cheaper). Long adjectives use 'more' (expensive → more expensive). 'Good' becomes 'better'.",
        examples: [
          { correct: "This shirt is cheaper.", translation: "This shirt is cheaper." },
          { correct: "That dress is more beautiful.", translation: "That dress is more beautiful." },
          { correct: "This one is better.", translation: "This one is better.", note: "Irregular: good → better" },
        ],
        commonMistakes: [
          { incorrect: "This is more cheap.", correction: "This is cheaper.", explanation: "'cheap' is a short adjective — add -er, don't use 'more'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "choosing-a-gift",
        title: "Choosing a Gift",
        situation: "You want to buy a gift for a friend and need help choosing.",
        agentRole: "You are a helpful shop assistant. Show the customer different options and help them choose a gift.",
        userGoal: "Compare items, express preferences, and choose one to buy.",
        targetPhrases: ["I prefer...", "This one is...-er than...", "I'll take this one"],
        successCriteria: ["Compares at least 2 items", "Expresses a preference", "Makes a final choice"],
      },
    ],
  },
];

// ============================================
// Module 6: Getting Around
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "en-beginner-l16",
    slug: "transport",
    title: "Transport & Getting Around",
    content: `# Transport & Getting Around

Learn how to talk about buses, trains, and getting places.

## Types of Transport

- **bus** / **train** / **taxi** / **car** / **bicycle (bike)**
- **plane** / **boat** / **underground (UK) / subway (US)**
- **on foot** — walking

## Useful Phrases

- "I take the bus to work."
- "How do I get to the station?"
- "Where is the bus stop?"
- "Is it far from here?"
- "It takes about 20 minutes."

## Buying Tickets

- "A single/return ticket to London, please."
- "Which platform for the 9:15 train?"
- "What time does the next bus leave?"`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m6",
    moduleTitle: "Getting Around",
    order: 16,
    topicId: "en-beginner-transport",
    vocabulary: [
      { word: "bus", translation: "large vehicle for passengers", pronunciation: "/bʌs/", exampleSentence: "I take the bus to school.", exampleTranslation: "I take the bus to school.", partOfSpeech: "noun" },
      { word: "train", translation: "runs on tracks", pronunciation: "/treɪn/", exampleSentence: "The train leaves at 9 AM.", exampleTranslation: "The train leaves at 9 AM.", partOfSpeech: "noun" },
      { word: "station", translation: "where trains/buses stop", pronunciation: "/ˈsteɪʃən/", exampleSentence: "The station is near here.", exampleTranslation: "The station is near here.", partOfSpeech: "noun" },
      { word: "ticket", translation: "paper/card to travel", pronunciation: "/ˈtɪkɪt/", exampleSentence: "One ticket, please.", exampleTranslation: "One ticket, please.", partOfSpeech: "noun" },
      { word: "far", translation: "a long distance", pronunciation: "/fɑːr/", exampleSentence: "Is it far from here?", exampleTranslation: "Is it far from here?", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Can / Can't for Ability and Possibility",
        explanation: "'Can' expresses ability or possibility. 'Can't' is the negative. The verb after 'can' has no -s, no 'to'.",
        examples: [
          { correct: "I can swim.", translation: "I can swim." },
          { correct: "She can't drive.", translation: "She can't drive." },
          { correct: "Can you help me?", translation: "Can you help me?" },
        ],
        commonMistakes: [
          { incorrect: "She can drives.", correction: "She can drive.", explanation: "After 'can', use the base form — no -s, no -ing." },
          { incorrect: "I can to swim.", correction: "I can swim.", explanation: "Don't use 'to' after 'can'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "buying-a-ticket",
        title: "Buying a Train Ticket",
        situation: "You are at a train station and need to buy a ticket.",
        agentRole: "You are a ticket office clerk. Help the passenger buy a ticket: ask where they want to go, single or return, and tell them the price and platform.",
        userGoal: "Buy a ticket to a destination, ask about times and platforms.",
        targetPhrases: ["A ticket to... please", "What time does it leave?", "Which platform?"],
        successCriteria: ["Requests a ticket", "Asks about departure time or platform", "Completes the transaction"],
      },
    ],
    culturalNotes: [
      {
        title: "Queuing in Britain",
        content: "British people take queuing (standing in line) very seriously. At bus stops and ticket offices, always join the back of the queue. Pushing in front is considered extremely rude!",
      },
    ],
  },
  {
    id: "en-beginner-l17",
    slug: "directions",
    title: "Asking for & Giving Directions",
    content: `# Asking for & Giving Directions

Find your way around.

## Asking for Directions

- "Excuse me, where is the bank?"
- "How do I get to the hospital?"
- "Is there a supermarket near here?"

## Giving Directions

- **Go straight.** / **Go straight ahead.**
- **Turn left.** / **Turn right.**
- **Go past the church.** — Continue beyond it
- **It's on your left / right.**
- **It's on the corner.**
- **It's opposite the park.** — Across from it
- **Take the first / second left.**

## City Places

- **bank** / **post office** / **supermarket** / **pharmacy (chemist)**
- **park** / **library** / **museum** / **church**
- **police station** / **hospital** / **school**`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m6",
    moduleTitle: "Getting Around",
    order: 17,
    topicId: "en-beginner-directions",
    vocabulary: [
      { word: "left", translation: "opposite of right", pronunciation: "/lɛft/", exampleSentence: "Turn left at the traffic lights.", exampleTranslation: "Turn left at the traffic lights.", partOfSpeech: "noun" },
      { word: "right", translation: "opposite of left", pronunciation: "/raɪt/", exampleSentence: "The bank is on your right.", exampleTranslation: "The bank is on your right.", partOfSpeech: "noun" },
      { word: "straight", translation: "in a direct line", pronunciation: "/streɪt/", exampleSentence: "Go straight for 200 meters.", exampleTranslation: "Go straight for 200 meters.", partOfSpeech: "adverb" },
      { word: "opposite", translation: "on the other side", pronunciation: "/ˈɒpəzɪt/", exampleSentence: "The cafe is opposite the park.", exampleTranslation: "The cafe is opposite the park.", partOfSpeech: "preposition" },
    ],
    grammarPoints: [
      {
        title: "Imperatives: Giving Instructions",
        explanation: "Imperatives are commands or instructions. Use the base form of the verb with no subject.",
        examples: [
          { correct: "Turn left.", translation: "Turn left." },
          { correct: "Go straight ahead.", translation: "Go straight ahead." },
          { correct: "Don't turn right.", translation: "Don't turn right.", note: "Negative: Don't + base verb" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "lost-in-city",
        title: "Lost in the City",
        situation: "You are a tourist and you can't find the museum.",
        agentRole: "You are a local. The tourist asks for directions to the museum. Give clear, simple directions: go straight, turn left at the church, it's on the right.",
        userGoal: "Ask for directions and show you understand them.",
        targetPhrases: ["Excuse me, where is...?", "Turn left?", "Thank you very much"],
        successCriteria: ["Asks for directions politely", "Confirms or clarifies instructions", "Thanks the helper"],
      },
    ],
  },
  {
    id: "en-beginner-l18",
    slug: "places-and-abilities",
    title: "City Places & What You Can Do",
    content: `# City Places & What You Can Do

Talk about what you can do in different places.

## Places and Activities

- "You can **borrow books** at the **library**."
- "You can **buy medicine** at the **pharmacy**."
- "You can **send letters** at the **post office**."
- "You can **change money** at the **bank**."
- "You can **see art** at the **museum**."

## Permission: Can I...?

- "**Can I** park here?" — Asking if it's allowed
- "**Can I** take photos?" — Asking permission
- "Yes, you can." / "No, you can't."

## There is / There are (Review)

- "Is there a pharmacy near here?" — "Yes, there is. / No, there isn't."
- "Are there any restaurants on this street?" — "Yes, there are two."`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m6",
    moduleTitle: "Getting Around",
    order: 18,
    topicId: "en-beginner-places-and-abilities",
    vocabulary: [
      { word: "library", translation: "place to borrow books", pronunciation: "/ˈlaɪbrəri/", exampleSentence: "The library is closed on Sundays.", exampleTranslation: "The library is closed on Sundays.", partOfSpeech: "noun" },
      { word: "pharmacy", translation: "shop for medicine", pronunciation: "/ˈfɑːrməsi/", exampleSentence: "Is there a pharmacy near here?", exampleTranslation: "Is there a pharmacy near here?", partOfSpeech: "noun" },
      { word: "museum", translation: "place to see art/history", pronunciation: "/mjuˈziːəm/", exampleSentence: "The museum opens at 10 AM.", exampleTranslation: "The museum opens at 10 AM.", partOfSpeech: "noun" },
      { word: "near", translation: "close to", pronunciation: "/nɪr/", exampleSentence: "The bank is near the station.", exampleTranslation: "The bank is near the station.", partOfSpeech: "preposition" },
    ],
    grammarPoints: [
      {
        title: "Can for Permission",
        explanation: "'Can I...?' is used to ask for permission. It's polite and common at A1 level.",
        examples: [
          { correct: "Can I sit here?", translation: "Can I sit here?" },
          { correct: "Can I use your phone?", translation: "Can I use your phone?" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "tourist-info",
        title: "At the Tourist Information",
        situation: "You are a tourist visiting a new city. You go to the tourist information center.",
        agentRole: "You are a tourist information worker. Help the tourist find places: the museum, a good restaurant, and the nearest pharmacy.",
        userGoal: "Ask about places in the city and what you can do there.",
        targetPhrases: ["Is there a... near here?", "Can I...?", "Where is the...?"],
        successCriteria: ["Asks about at least 2 places", "Asks what they can do somewhere", "Thanks the worker"],
      },
    ],
  },
];

// ============================================
// Module 7: Past Experiences
// ============================================

const module7Lessons: LanguageLesson[] = [
  {
    id: "en-beginner-l19",
    slug: "past-simple-regular",
    title: "Past Simple: Regular Verbs",
    content: `# Past Simple: Regular Verbs

Talk about what happened in the past.

## Forming the Past Simple (Regular)

Add **-ed** to the base verb:
- **work** → **worked** / **play** → **played** / **watch** → **watched**
- **live** → **lived** (just add -d if verb ends in -e)
- **study** → **studied** (consonant + y → -ied)
- **stop** → **stopped** (double consonant + -ed for short verbs)

## Pronunciation of -ed

- **/t/** after voiceless sounds: work**ed**, watch**ed**, walk**ed**
- **/d/** after voiced sounds: play**ed**, live**d**, listen**ed**
- **/ɪd/** after t/d sounds: want**ed**, need**ed**, visit**ed**

## Example Sentences

- "I **worked** yesterday."
- "She **played** tennis last weekend."
- "We **visited** London last year."
- "They **watched** a film last night."`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m7",
    moduleTitle: "Past Experiences",
    order: 19,
    topicId: "en-beginner-past-simple-regular",
    vocabulary: [
      { word: "yesterday", translation: "the day before today", pronunciation: "/ˈjɛstərdeɪ/", exampleSentence: "I worked yesterday.", exampleTranslation: "I worked yesterday.", partOfSpeech: "adverb" },
      { word: "last", translation: "most recent", pronunciation: "/lɑːst/", exampleSentence: "I visited Paris last year.", exampleTranslation: "I visited Paris last year.", partOfSpeech: "adjective" },
      { word: "ago", translation: "before now", pronunciation: "/əˈɡoʊ/", exampleSentence: "I started two years ago.", exampleTranslation: "I started two years ago.", partOfSpeech: "adverb" },
      { word: "visit", translation: "to go and see a place/person", pronunciation: "/ˈvɪzɪt/", exampleSentence: "We visited the museum.", exampleTranslation: "We visited the museum.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Past Simple: Regular Verbs (+ed)",
        explanation: "To talk about finished actions in the past, add -ed to regular verbs. The form is the same for all subjects (I/you/he/she/we/they).",
        examples: [
          { correct: "I walked to school.", translation: "I walked to school." },
          { correct: "She cooked dinner last night.", translation: "She cooked dinner last night." },
          { correct: "They played football yesterday.", translation: "They played football yesterday." },
        ],
        commonMistakes: [
          { incorrect: "I walk to school yesterday.", correction: "I walked to school yesterday.", explanation: "Use past simple (-ed) for finished past actions." },
        ],
      },
      {
        title: "Time Expressions for the Past",
        explanation: "Common words used with the past simple: yesterday, last (week/month/year), ago, in (2020).",
        examples: [
          { correct: "I started this job two years ago.", translation: "I started this job two years ago." },
          { correct: "She moved here last month.", translation: "She moved here last month." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "weekend-recap",
        title: "What Did You Do Last Weekend?",
        situation: "It's Monday morning. A colleague asks about your weekend.",
        agentRole: "You are a colleague named Sam. Ask the student about their weekend: what they did, where they went, who they saw.",
        userGoal: "Describe 3-4 things you did last weekend using past simple.",
        targetPhrases: ["I played...", "I watched...", "I visited...", "I cooked..."],
        successCriteria: ["Uses past simple correctly", "Mentions at least 3 activities", "Uses time expressions (yesterday, last...)"],
      },
    ],
  },
  {
    id: "en-beginner-l20",
    slug: "past-simple-irregular",
    title: "Past Simple: Irregular Verbs & was/were",
    content: `# Past Simple: Irregular Verbs & Was/Were

Some very common verbs don't follow the -ed rule.

## Was / Were (Past of 'be')

| Subject | Past of 'be' |
|---------|-------------|
| I / he / she / it | **was** |
| you / we / they | **were** |

- "I **was** tired." / "She **was** happy."
- "They **were** at home." / "We **were** late."
- Negative: "I **wasn't** there." / "They **weren't** ready."

## Common Irregular Verbs

| Base | Past | Example |
|------|------|---------|
| go | **went** | I went to the park. |
| have | **had** | She had breakfast at 8. |
| eat | **ate** | We ate pizza. |
| drink | **drank** | He drank coffee. |
| see | **saw** | I saw a good film. |
| come | **came** | They came home late. |
| buy | **bought** | She bought a dress. |
| make | **made** | I made dinner. |
| get | **got** | He got a new job. |
| take | **took** | We took the bus. |`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m7",
    moduleTitle: "Past Experiences",
    order: 20,
    topicId: "en-beginner-past-simple-irregular",
    vocabulary: [
      { word: "went", translation: "past of 'go'", pronunciation: "/wɛnt/", exampleSentence: "I went to the cinema last night.", exampleTranslation: "I went to the cinema last night.", partOfSpeech: "verb" },
      { word: "ate", translation: "past of 'eat'", pronunciation: "/eɪt/", exampleSentence: "We ate sushi for lunch.", exampleTranslation: "We ate sushi for lunch.", partOfSpeech: "verb" },
      { word: "saw", translation: "past of 'see'", pronunciation: "/sɔː/", exampleSentence: "I saw my friend at the shop.", exampleTranslation: "I saw my friend at the shop.", partOfSpeech: "verb" },
      { word: "bought", translation: "past of 'buy'", pronunciation: "/bɔːt/", exampleSentence: "She bought new shoes.", exampleTranslation: "She bought new shoes.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Was / Were",
        explanation: "'Was' and 'were' are the past tense of 'be'. Use 'was' with I/he/she/it and 'were' with you/we/they.",
        examples: [
          { correct: "I was tired yesterday.", translation: "I was tired yesterday." },
          { correct: "They were at the party.", translation: "They were at the party." },
          { correct: "It was a good day.", translation: "It was a good day." },
        ],
        commonMistakes: [
          { incorrect: "I were tired.", correction: "I was tired.", explanation: "Use 'was' with I/he/she/it." },
          { incorrect: "They was late.", correction: "They were late.", explanation: "Use 'were' with you/we/they." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "holiday-story",
        title: "Telling a Holiday Story",
        situation: "Your friend asks about your last holiday.",
        agentRole: "You are a friend named Mia. Ask where the student went on holiday, what they did, what they ate, and if they enjoyed it.",
        userGoal: "Tell a short story about a past trip using irregular past tense verbs.",
        targetPhrases: ["I went to...", "I saw...", "I ate...", "It was..."],
        successCriteria: ["Uses was/were correctly", "Uses at least 3 irregular past verbs", "Tells a coherent short story"],
      },
    ],
  },
  {
    id: "en-beginner-l21",
    slug: "past-questions-and-negatives",
    title: "Past Questions & Negatives",
    content: `# Past Questions & Negatives

Ask and answer questions about the past.

## Negative Past Simple

Use **didn't** + base verb (NOT past form):
- "I **didn't go** to work." (NOT: I didn't went)
- "She **didn't eat** breakfast."
- "They **didn't see** the film."

## Questions in Past Simple

Use **Did** + subject + base verb:
- "**Did you go** to the party?" — "Yes, I did." / "No, I didn't."
- "**Did she like** the food?" — "Yes, she did."
- "**What did you do** yesterday?"
- "**Where did you go** last weekend?"

## Questions with Was/Were

- "**Were** you at home?" — "Yes, I was." / "No, I wasn't."
- "**Was** it good?" — "Yes, it was great!"
- "**Where were** you yesterday?"`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m7",
    moduleTitle: "Past Experiences",
    order: 21,
    topicId: "en-beginner-past-questions-and-negatives",
    vocabulary: [
      { word: "did", translation: "past helper for questions/negatives", pronunciation: "/dɪd/", exampleSentence: "Did you enjoy the film?", exampleTranslation: "Did you enjoy the film?", partOfSpeech: "auxiliary verb" },
      { word: "enjoy", translation: "to like doing something", pronunciation: "/ɪnˈdʒɔɪ/", exampleSentence: "I enjoyed the party.", exampleTranslation: "I enjoyed the party.", partOfSpeech: "verb" },
      { word: "forget", translation: "to not remember", pronunciation: "/fərˈɡɛt/", exampleSentence: "I forgot my keys!", exampleTranslation: "I forgot my keys!", partOfSpeech: "verb" },
      { word: "remember", translation: "to keep in your mind", pronunciation: "/rɪˈmɛmbər/", exampleSentence: "Do you remember her name?", exampleTranslation: "Do you remember her name?", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Past Simple: Negatives with 'didn't'",
        explanation: "To make a past simple sentence negative, use 'didn't' + the BASE form of the verb (not the past form).",
        examples: [
          { correct: "I didn't go to the party.", translation: "I didn't go to the party." },
          { correct: "She didn't eat lunch.", translation: "She didn't eat lunch." },
        ],
        commonMistakes: [
          { incorrect: "I didn't went.", correction: "I didn't go.", explanation: "After 'didn't', always use the base form, not the past form." },
          { incorrect: "I not went to school.", correction: "I didn't go to school.", explanation: "Use 'didn't' + base verb for negatives, not 'not' alone." },
        ],
      },
      {
        title: "Past Simple: Questions with 'Did'",
        explanation: "To ask a yes/no question, use: Did + subject + base verb? For Wh- questions: Wh- + did + subject + base verb?",
        examples: [
          { correct: "Did you like the film?", translation: "Did you like the film?" },
          { correct: "What did you eat?", translation: "What did you eat?" },
          { correct: "Where did they go?", translation: "Where did they go?" },
        ],
        commonMistakes: [
          { incorrect: "Did you went?", correction: "Did you go?", explanation: "After 'did', use the base form (go), not the past form (went)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "detective-game",
        title: "The Weekend Detective",
        situation: "You and a friend are asking each other about last weekend to find out what each person did.",
        agentRole: "You are a friend named Jake. Answer the student's questions about your weekend (you went to a restaurant, saw a movie, didn't go to the gym). Then ask the student questions.",
        userGoal: "Ask at least 3 questions about Jake's weekend and answer his questions.",
        targetPhrases: ["Did you...?", "What did you...?", "I didn't...", "Yes, I did / No, I didn't"],
        successCriteria: ["Asks past simple questions", "Answers questions about own weekend", "Uses didn't for negatives"],
      },
    ],
    culturalNotes: [
      {
        title: "Talking About the Weather (Past & Present)",
        content: "British people famously love to talk about the weather! 'Lovely day, isn't it?' or 'Terrible weather yesterday!' are very common conversation starters. It's the safest small talk topic in the UK.",
      },
    ],
  },
];

// ============================================
// Module 8: Future Plans & Health
// ============================================

const module8Lessons: LanguageLesson[] = [
  {
    id: "en-beginner-l22",
    slug: "future-plans",
    title: "Future Plans: Going to & Present Continuous",
    content: `# Future Plans: Going to & Present Continuous

Talk about your plans and what you will do.

## 'Going to' for Plans

Use **am/is/are + going to + verb** for planned future actions:
- "I **am going to visit** my family next week."
- "She **is going to start** a new job."
- "We **are going to travel** to Spain."

## Present Continuous for Arrangements

Use **am/is/are + verb-ing** for fixed arrangements:
- "I **am meeting** my friend at 3 PM." (already arranged)
- "We **are flying** to London tomorrow." (tickets bought)

## Common Time Words for Future

- **tomorrow** / **next week** / **next month** / **next year**
- **tonight** / **this weekend** / **soon** / **later**

## Questions About Plans

- "**What are you going to do** this weekend?"
- "**Are you going to** study tonight?"
- "**Where are you going** on holiday?"`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m8",
    moduleTitle: "Future Plans & Health",
    order: 22,
    topicId: "en-beginner-future-plans",
    vocabulary: [
      { word: "tomorrow", translation: "the day after today", pronunciation: "/təˈmɒroʊ/", exampleSentence: "I'm going to the dentist tomorrow.", exampleTranslation: "I'm going to the dentist tomorrow.", partOfSpeech: "adverb" },
      { word: "plan", translation: "something you intend to do", pronunciation: "/plæn/", exampleSentence: "What are your plans for the weekend?", exampleTranslation: "What are your plans for the weekend?", partOfSpeech: "noun" },
      { word: "soon", translation: "in a short time", pronunciation: "/suːn/", exampleSentence: "The bus is coming soon.", exampleTranslation: "The bus is coming soon.", partOfSpeech: "adverb" },
      { word: "holiday", translation: "vacation, time off", pronunciation: "/ˈhɒlɪdeɪ/", exampleSentence: "We're going on holiday next month.", exampleTranslation: "We're going on holiday next month.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Going to + Verb (Future Plans)",
        explanation: "Use 'be + going to + base verb' to talk about plans you've already decided.",
        examples: [
          { correct: "I'm going to study English tonight.", translation: "I'm going to study English tonight." },
          { correct: "They are going to move to a new house.", translation: "They are going to move to a new house." },
          { correct: "She isn't going to come.", translation: "She isn't going to come." },
        ],
        commonMistakes: [
          { incorrect: "I going to study.", correction: "I'm going to study.", explanation: "Don't forget the 'be' verb (am/is/are) before 'going to'." },
        ],
      },
      {
        title: "Present Continuous for Future Arrangements",
        explanation: "When something is already arranged (booked, confirmed), you can use the present continuous for future meaning.",
        examples: [
          { correct: "I'm meeting Sara at 6 PM.", translation: "I'm meeting Sara at 6 PM.", note: "Already arranged" },
          { correct: "We're leaving on Friday.", translation: "We're leaving on Friday." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "weekend-plans",
        title: "Making Weekend Plans",
        situation: "A friend asks what you are doing this weekend and suggests doing something together.",
        agentRole: "You are a friend named Chris. Ask about the student's weekend plans and suggest going to a new restaurant together on Saturday.",
        userGoal: "Describe your plans and respond to Chris's suggestion.",
        targetPhrases: ["I'm going to...", "I'm ... -ing on Saturday", "That sounds good!"],
        successCriteria: ["Describes at least 2 future plans", "Uses 'going to' or present continuous", "Responds to the suggestion"],
      },
    ],
  },
  {
    id: "en-beginner-l23",
    slug: "weather",
    title: "Weather & Seasons",
    content: `# Weather & Seasons

Talk about the weather — the most British topic of all!

## Weather Words

- **sunny** / **cloudy** / **rainy** / **windy** / **snowy**
- **hot** / **warm** / **cool** / **cold** / **freezing**
- "It's sunny today."
- "It's raining." (happening now)
- "It was cold yesterday."

## Seasons

- **spring** (March-May) — flowers, mild
- **summer** (June-August) — hot, sunny
- **autumn / fall** (September-November) — leaves fall, cool
- **winter** (December-February) — cold, dark

## Talking About Weather

- "What's the weather like today?" — "It's warm and sunny."
- "What's the weather going to be like tomorrow?" — "It's going to rain."
- "I like summer because it's warm."`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m8",
    moduleTitle: "Future Plans & Health",
    order: 23,
    topicId: "en-beginner-weather",
    vocabulary: [
      { word: "weather", translation: "sun, rain, wind, etc.", pronunciation: "/ˈwɛðər/", exampleSentence: "The weather is nice today.", exampleTranslation: "The weather is nice today.", partOfSpeech: "noun" },
      { word: "sunny", translation: "bright with sun", pronunciation: "/ˈsʌni/", exampleSentence: "It's sunny and warm.", exampleTranslation: "It's sunny and warm.", partOfSpeech: "adjective" },
      { word: "cold", translation: "low temperature", pronunciation: "/koʊld/", exampleSentence: "It's very cold in winter.", exampleTranslation: "It's very cold in winter.", partOfSpeech: "adjective" },
      { word: "rain", translation: "water falling from the sky", pronunciation: "/reɪn/", exampleSentence: "It's going to rain tomorrow.", exampleTranslation: "It's going to rain tomorrow.", partOfSpeech: "noun/verb" },
    ],
    grammarPoints: [
      {
        title: "'It' for Weather",
        explanation: "In English, we always use 'it' as the subject when talking about weather. There is no real subject — 'it' is just a grammar requirement.",
        examples: [
          { correct: "It's raining.", translation: "It's raining." },
          { correct: "It was cold yesterday.", translation: "It was cold yesterday." },
          { correct: "It's going to snow.", translation: "It's going to snow." },
        ],
        commonMistakes: [
          { incorrect: "Is raining.", correction: "It's raining.", explanation: "English always needs a subject. Use 'It' for weather." },
          { incorrect: "Today is sunny.", correction: "It's sunny today.", explanation: "Use 'It' as the subject, not 'Today'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "weather-chat",
        title: "Chatting About the Weather",
        situation: "You're waiting at a bus stop with a stranger. You start a conversation about the weather.",
        agentRole: "You are a local who loves to chat about the weather. Comment on today's weather and ask the student about weather in their country.",
        userGoal: "Talk about today's weather and compare it with your home country's weather.",
        targetPhrases: ["It's... today", "In my country, it's...", "I like/don't like..."],
        successCriteria: ["Describes today's weather", "Compares with home country", "Expresses a preference about weather"],
      },
    ],
    culturalNotes: [
      {
        title: "British Weather Small Talk",
        content: "The British talk about the weather more than almost any other nation. 'Lovely day, isn't it?' or 'Awful weather we're having!' are conversation starters you'll hear every day. It's never wrong to comment on the weather in the UK — it's the universal icebreaker.",
      },
    ],
  },
  {
    id: "en-beginner-l24",
    slug: "health-and-body",
    title: "Health, Body Parts & Advice with 'Should'",
    content: `# Health, Body Parts & Advice with 'Should'

Talk about how you feel and get advice.

## Body Parts

- **head** / **eye** / **ear** / **nose** / **mouth** / **tooth (teeth)**
- **arm** / **hand** / **finger** / **leg** / **foot (feet)** / **back**
- **stomach** / **throat** / **chest**

## Feeling Unwell

- "I have a **headache**." (head hurts)
- "I have a **stomachache**." (stomach hurts)
- "I have a **cold**." (sneezing, runny nose)
- "I have a **fever**." (high temperature)
- "I have a **sore throat**." (throat hurts)
- "My back **hurts**."

## Advice with 'Should'

- "You **should** see a doctor."
- "You **should** rest."
- "You **should** drink water."
- "You **shouldn't** go to work."
- "You **shouldn't** eat too much sugar."

## At the Doctor

- "What's the matter?" / "What's wrong?"
- "I feel sick / tired / dizzy."
- "How long have you felt like this?"
- "Take this medicine twice a day."`,
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-beginner-m8",
    moduleTitle: "Future Plans & Health",
    order: 24,
    topicId: "en-beginner-health-and-body",
    vocabulary: [
      { word: "head", translation: "top part of your body", pronunciation: "/hɛd/", exampleSentence: "My head hurts.", exampleTranslation: "My head hurts.", partOfSpeech: "noun" },
      { word: "stomach", translation: "body part for digestion", pronunciation: "/ˈstʌmək/", exampleSentence: "I have a stomachache.", exampleTranslation: "I have a stomachache.", partOfSpeech: "noun" },
      { word: "medicine", translation: "drug to treat illness", pronunciation: "/ˈmɛdɪsɪn/", exampleSentence: "Take this medicine after meals.", exampleTranslation: "Take this medicine after meals.", partOfSpeech: "noun" },
      { word: "sick", translation: "not feeling well", pronunciation: "/sɪk/", exampleSentence: "I feel sick today.", exampleTranslation: "I feel sick today.", partOfSpeech: "adjective" },
      { word: "rest", translation: "to relax, stop working", pronunciation: "/rɛst/", exampleSentence: "You should rest at home.", exampleTranslation: "You should rest at home.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Should / Shouldn't for Advice",
        explanation: "'Should' gives advice or recommendations. 'Shouldn't' advises against something. The verb after should/shouldn't is always the base form.",
        examples: [
          { correct: "You should drink more water.", translation: "You should drink more water." },
          { correct: "She should see a doctor.", translation: "She should see a doctor." },
          { correct: "You shouldn't eat that.", translation: "You shouldn't eat that." },
        ],
        commonMistakes: [
          { incorrect: "You should to rest.", correction: "You should rest.", explanation: "Don't use 'to' after 'should'. Use the base form directly." },
          { incorrect: "You should resting.", correction: "You should rest.", explanation: "After 'should', use the base form — not -ing." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "at-the-doctor",
        title: "Visiting the Doctor",
        situation: "You are feeling unwell and visit a doctor.",
        agentRole: "You are Dr. Smith. Ask the patient what's wrong, how long they've felt this way, and give them advice (rest, drink fluids, take medicine).",
        userGoal: "Describe your symptoms and understand the doctor's advice.",
        targetPhrases: ["I have a...", "My... hurts", "Should I...?"],
        successCriteria: ["Describes at least 2 symptoms", "Uses body part vocabulary", "Responds to doctor's advice"],
      },
    ],
    culturalNotes: [
      {
        title: "The NHS in the UK",
        content: "The UK has the National Health Service (NHS), which provides free healthcare to everyone. If you're visiting the UK, you can call 111 for non-emergency medical advice, or 999 for emergencies. In the US, healthcare works differently — most people need health insurance.",
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  {
    id: "en-beginner-m1",
    title: "Module 1: First Steps",
    description: "The alphabet, basic phonics, greetings, introductions, and numbers 1-100",
    order: 1,
    lessons: module1Lessons,
  },
  {
    id: "en-beginner-m2",
    title: "Module 2: About Me",
    description: "Personal information, countries, nationalities, family, and describing people",
    order: 2,
    lessons: module2Lessons,
  },
  {
    id: "en-beginner-m3",
    title: "Module 3: Daily Life",
    description: "Telling time, daily routines, jobs, present simple, and adverbs of frequency",
    order: 3,
    lessons: module3Lessons,
  },
  {
    id: "en-beginner-m4",
    title: "Module 4: Home & Food",
    description: "Rooms, furniture, there is/are, prepositions, food, and countable/uncountable nouns",
    order: 4,
    lessons: module4Lessons,
  },
  {
    id: "en-beginner-m5",
    title: "Module 5: Shopping & Money",
    description: "Clothes, colors, prices, demonstratives, object pronouns, and comparatives",
    order: 5,
    lessons: module5Lessons,
  },
  {
    id: "en-beginner-m6",
    title: "Module 6: Getting Around",
    description: "Transport, directions, imperatives, can/can't, and city places",
    order: 6,
    lessons: module6Lessons,
  },
  {
    id: "en-beginner-m7",
    title: "Module 7: Past Experiences",
    description: "Past simple regular and irregular verbs, was/were, questions and negatives",
    order: 7,
    lessons: module7Lessons,
  },
  {
    id: "en-beginner-m8",
    title: "Module 8: Future Plans & Health",
    description: "Going to, present continuous for plans, weather, body parts, and should/shouldn't",
    order: 8,
    lessons: module8Lessons,
  },
];

export const englishBeginnerCourse: LanguageCourse = {
  ...courseInfo,
  modules,
};

// Helper function to get all lessons
export function getEnglishBeginnerLessons() {
  return modules.flatMap((m) => m.lessons);
}

// Helper function to find a lesson by slug
export function findEnglishBeginnerLesson(slug: string) {
  return getEnglishBeginnerLessons().find((l) => l.slug === slug);
}
