// French Beginner Course Data
// CEFR A1 Level - Comprehensive beginner course (6 modules, 18 lessons)

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "french-beginner",
  slug: "french-beginner",
  title: "French Beginner - First Steps to Fluency",
  language: "fr",
  languageName: "French",
  proficiencyLevel: "A1" as const,
  description: "A comprehensive beginner French course covering greetings, daily life, getting around, food, basic tenses, and social interactions. Build a strong foundation with 18 structured lessons.",
  targetAudience: "Complete beginners who want a thorough A1 foundation before moving to intermediate French",
  estimatedHours: 60,
  icon: "🇫🇷",
  nextCourseSlug: "french-intermediate",
};

// ============================================
// Module 1: First Steps
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "fr-beginner-l1",
    slug: "bonjour-alphabet",
    title: "Bonjour! The French Alphabet & Sounds",
    content: `# Bonjour ! L'Alphabet Français

Welcome to French! Let's start with greetings and the sounds of the language.

## Essential Greetings

- **Bonjour** - Hello / Good morning
- **Bonsoir** - Good evening
- **Salut** - Hi / Bye (informal)
- **Au revoir** - Goodbye
- **Comment allez-vous ?** - How are you? (formal)
- **Ça va ?** - How's it going? (informal)

## The French Alphabet

The French alphabet has the same 26 letters as English, but they sound very different! Key differences:

| Letter | French Sound | Example |
|--------|-------------|---------|
| **e** | "uh" | le (the) |
| **g** | "zhay" | garage |
| **h** | "ahsh" (always silent) | hôtel |
| **j** | "zhee" | jour (day) |
| **r** | guttural, back of throat | rouge (red) |
| **u** | rounded "oo" (lips pursed) | tu (you) |

## Silent Letters

French has many silent letters, especially at the end of words:
- **s** at the end: *les ami**s*** (the friends)
- **t** at the end: *peti**t*** (small)
- **e** at the end: *tabl**e*** (table)
- **h** at the beginning: ***h**ôtel* (hotel)`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m1",
    moduleTitle: "First Steps",
    order: 1,
    topicId: "fr-beginner-bonjour-alphabet",
    vocabulary: [
      { word: "bonjour", translation: "hello / good morning", pronunciation: "bohn-ZHOOR", exampleSentence: "Bonjour, comment allez-vous ?", exampleTranslation: "Hello, how are you?", partOfSpeech: "interjection" },
      { word: "bonsoir", translation: "good evening", pronunciation: "bohn-SWAHR", exampleSentence: "Bonsoir, madame.", exampleTranslation: "Good evening, ma'am.", partOfSpeech: "interjection" },
      { word: "au revoir", translation: "goodbye", pronunciation: "oh ruh-VWAHR", exampleSentence: "Au revoir, à bientôt !", exampleTranslation: "Goodbye, see you soon!", partOfSpeech: "interjection" },
      { word: "ça va", translation: "it's going / how's it going", pronunciation: "sah VAH", exampleSentence: "Ça va bien, merci.", exampleTranslation: "I'm doing well, thanks.", partOfSpeech: "phrase" },
      { word: "merci", translation: "thank you", pronunciation: "mehr-SEE", exampleSentence: "Merci beaucoup !", exampleTranslation: "Thank you very much!", partOfSpeech: "interjection" },
    ],
    grammarPoints: [
      {
        title: "Formal vs. Informal (Vous vs. Tu)",
        explanation: "French has two words for 'you': **vous** (formal/plural) and **tu** (informal/singular). Use **vous** with strangers, elders, and in professional settings. Use **tu** with friends, family, and children.",
        examples: [
          { correct: "Comment allez-vous ?", translation: "How are you? (formal)" },
          { correct: "Comment vas-tu ?", translation: "How are you? (informal)" },
          { correct: "Ça va ?", translation: "How's it going? (very informal)" },
        ],
        commonMistakes: [
          { incorrect: "Comment vas-vous ?", correction: "Comment allez-vous ?", explanation: "'Vas' is the tu conjugation. With 'vous', always use 'allez'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-greeting-cafe",
        title: "Entering a Parisian Café",
        situation: "You walk into a café in the Marais district of Paris in the morning",
        agentRole: "You are Laurent, a polite Parisian café owner. Greet the student formally and ask how they are.",
        userGoal: "Greet Laurent, respond to his greeting, and use basic polite words",
        targetPhrases: ["Bonjour", "Ça va bien", "Merci", "Au revoir"],
        successCriteria: ["Uses an appropriate greeting", "Responds to 'how are you'", "Uses at least one polite word"],
        hints: ["Start with 'Bonjour'", "When asked 'Ça va ?', respond 'Ça va bien, merci'"],
      },
    ],
    culturalNotes: [
      {
        title: "La Bise — The French Cheek Kiss",
        content: "In France, close friends and family greet each other with **la bise** — light kisses on alternating cheeks. The number varies by region: two in Paris, three in Provence, even four in some areas! For professional or first-time meetings, a firm handshake is standard. When in doubt, follow the other person's lead.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-beginner-l2",
    slug: "pronunciation-accents",
    title: "Pronunciation Rules & Accents",
    content: `# La Prononciation et les Accents

Master French pronunciation and understand the accent marks.

## The Five French Accents

| Accent | Name | Effect | Example |
|--------|------|--------|---------|
| **é** | accent aigu | "ay" sound | café (coffee) |
| **è, ê** | accent grave / circonflexe | "eh" sound | mère (mother), fête (party) |
| **ë, ï** | tréma | separate vowels | Noël (Christmas) |
| **ç** | cédille | soft "s" sound | français (French) |
| **à, ù** | accent grave | distinguishes words | où (where) vs. ou (or) |

## Key Pronunciation Rules

### Nasal Vowels (uniquely French!)
- **-an / -en**: "ahn" — *enfant* (child), *en* (in)
- **-in / -ain**: "an" — *vin* (wine), *pain* (bread)
- **-on**: "ohn" — *bon* (good), *maison* (house)
- **-un**: "uhn" — *brun* (brown)

### Liaison
When a word ending in a consonant is followed by a word starting with a vowel, they link:
- *les‿amis* → "lay-zah-MEE" (the friends)
- *un‿homme* → "uh-NOHM" (a man)

### The French 'R'
Produced at the back of the throat, almost like gargling gently. Practice with: *rouge, rue, rare*.`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m1",
    moduleTitle: "First Steps",
    order: 2,
    topicId: "fr-beginner-pronunciation-accents",
    vocabulary: [
      { word: "français", translation: "French", pronunciation: "frahn-SEH", exampleSentence: "Je parle français.", exampleTranslation: "I speak French.", partOfSpeech: "adjective" },
      { word: "s'il vous plaît", translation: "please (formal)", pronunciation: "seel voo PLEH", exampleSentence: "Un café, s'il vous plaît.", exampleTranslation: "A coffee, please.", partOfSpeech: "phrase" },
      { word: "être", translation: "to be", pronunciation: "EH-truh", exampleSentence: "Je veux être prêt.", exampleTranslation: "I want to be ready.", partOfSpeech: "verb" },
      { word: "où", translation: "where", pronunciation: "oo", exampleSentence: "Où est la gare ?", exampleTranslation: "Where is the train station?", partOfSpeech: "adverb" },
    ],
    grammarPoints: [
      {
        title: "Why Accents Matter",
        explanation: "French accents are not decorative — they change meaning and pronunciation. Dropping them is a spelling error.\n\n- **ou** = or → **où** = where\n- **a** = has → **à** = to/at\n- **sur** = on → **sûr** = sure",
        examples: [
          { correct: "Où est le café ?", translation: "Where is the café?" },
          { correct: "Du thé ou du café ?", translation: "Tea or coffee?" },
        ],
        commonMistakes: [
          { incorrect: "Ou est le cafe ?", correction: "Où est le café ?", explanation: "Without the accent, 'ou' means 'or' instead of 'where', and 'cafe' loses its proper pronunciation." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-pronunciation-drill",
        title: "Pronunciation Practice with a Tutor",
        situation: "You are practicing French pronunciation with a patient tutor",
        agentRole: "You are Céline, a friendly French tutor. Say words slowly and ask the student to repeat. Gently correct pronunciation.",
        userGoal: "Practice pronouncing nasal vowels and the French 'r'",
        targetPhrases: ["bonjour", "français", "merci beaucoup", "au revoir"],
        successCriteria: ["Attempts French pronunciation", "Repeats after the tutor", "Tries nasal vowels"],
      },
    ],
    culturalNotes: [
      {
        title: "The Académie Française",
        content: "France has an official institution, the **Académie française** (founded in 1635), that guards the French language. They decide which words are officially French and resist anglicisms. Where English speakers say 'email', the Académie recommends **courriel**. This reflects how seriously the French take their language.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-beginner-l3",
    slug: "numbers-1-100",
    title: "Numbers 1-100",
    content: `# Les Nombres de 1 à 100

Master the numbers you'll use every day.

## Numbers 1-20

1. **un** / 2. **deux** / 3. **trois** / 4. **quatre** / 5. **cinq**
6. **six** / 7. **sept** / 8. **huit** / 9. **neuf** / 10. **dix**
11. **onze** / 12. **douze** / 13. **treize** / 14. **quatorze** / 15. **quinze**
16. **seize** / 17. **dix-sept** / 18. **dix-huit** / 19. **dix-neuf** / 20. **vingt**

## Numbers 21-69

Follow a pattern: tens + number (with hyphens):
- 21: **vingt et un** (note the "et" for 1s)
- 22: **vingt-deux** / 30: **trente** / 40: **quarante** / 50: **cinquante** / 60: **soixante**

## Numbers 70-100 (The Tricky Part!)

French uses a base-20 system for 70-99:
- 70: **soixante-dix** (60 + 10)
- 71: **soixante et onze** (60 + 11)
- 80: **quatre-vingts** (4 × 20)
- 81: **quatre-vingt-un** (4 × 20 + 1)
- 90: **quatre-vingt-dix** (4 × 20 + 10)
- 91: **quatre-vingt-onze** (4 × 20 + 11)
- 100: **cent**

> **Tip:** In Belgium and Switzerland, they say **septante** (70), **huitante/octante** (80), **nonante** (90) — much simpler!`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m1",
    moduleTitle: "First Steps",
    order: 3,
    topicId: "fr-beginner-numbers-1-100",
    vocabulary: [
      { word: "vingt", translation: "twenty", pronunciation: "van", exampleSentence: "J'ai vingt ans.", exampleTranslation: "I'm twenty years old.", partOfSpeech: "number" },
      { word: "cinquante", translation: "fifty", pronunciation: "san-KAHNT", exampleSentence: "Ça coûte cinquante euros.", exampleTranslation: "It costs fifty euros.", partOfSpeech: "number" },
      { word: "quatre-vingts", translation: "eighty", pronunciation: "KAH-truh VAN", exampleSentence: "Ma grand-mère a quatre-vingts ans.", exampleTranslation: "My grandmother is eighty years old.", partOfSpeech: "number" },
      { word: "cent", translation: "one hundred", pronunciation: "sahn", exampleSentence: "Il y a cent personnes ici.", exampleTranslation: "There are one hundred people here.", partOfSpeech: "number" },
    ],
    grammarPoints: [
      {
        title: "Un vs. Une (Gender with Numbers)",
        explanation: "The number 'one' changes based on noun gender: **un** (masculine) and **une** (feminine). All other numbers stay the same regardless of gender.",
        examples: [
          { correct: "un livre", translation: "one book (masculine)" },
          { correct: "une table", translation: "one table (feminine)" },
          { correct: "vingt et un garçons", translation: "twenty-one boys" },
          { correct: "vingt et une filles", translation: "twenty-one girls" },
        ],
      },
      {
        title: "Quatre-vingts vs. Quatre-vingt-un",
        explanation: "**Quatre-vingts** (80) takes an **-s** when it stands alone or at the end. But when followed by another number, the **-s** drops: quatre-vingt-un (81), quatre-vingt-deux (82).",
        examples: [
          { correct: "quatre-vingts euros", translation: "eighty euros" },
          { correct: "quatre-vingt-trois", translation: "eighty-three (no -s)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-market-numbers",
        title: "At the Market",
        situation: "You're buying fruit at a French market and need to understand prices",
        agentRole: "You are a market vendor in Nice. Ask the student how many items they want and tell them prices using numbers up to 100.",
        userGoal: "Say quantities, understand prices, and count items",
        targetPhrases: ["Je voudrais...", "Combien ?", "C'est combien ?"],
        successCriteria: ["Uses numbers correctly", "Understands a two-digit price", "Completes the transaction"],
      },
    ],
  },
];

// ============================================
// Module 2: Daily Life
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "fr-beginner-l4",
    slug: "family-describing-people",
    title: "Family & Describing People",
    content: `# La Famille et la Description

Talk about your family and describe people.

## Family Members

- **le père / papa** - father / dad
- **la mère / maman** - mother / mom
- **le frère** - brother
- **la sœur** - sister
- **le fils** - son
- **la fille** - daughter
- **le grand-père** - grandfather
- **la grand-mère** - grandmother
- **l'oncle (m.)** - uncle
- **la tante** - aunt
- **le cousin / la cousine** - cousin

## Describing People

### Physical Appearance
- **grand(e)** - tall
- **petit(e)** - short/small
- **mince** - thin
- **les cheveux blonds/bruns/noirs/roux** - blond/brown/black/red hair
- **les yeux bleus/verts/marron** - blue/green/brown eyes

### Personality
- **gentil(le)** - kind/nice
- **drôle** - funny
- **intelligent(e)** - intelligent
- **timide** - shy`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m2",
    moduleTitle: "Daily Life",
    order: 4,
    topicId: "fr-beginner-family-describing-people",
    vocabulary: [
      { word: "la mère", translation: "mother", pronunciation: "lah MEHR", exampleSentence: "Ma mère est très gentille.", exampleTranslation: "My mother is very kind.", partOfSpeech: "noun" },
      { word: "le frère", translation: "brother", pronunciation: "luh FREHR", exampleSentence: "J'ai un grand frère.", exampleTranslation: "I have an older brother.", partOfSpeech: "noun" },
      { word: "la sœur", translation: "sister", pronunciation: "lah SUHR", exampleSentence: "Ma sœur est drôle.", exampleTranslation: "My sister is funny.", partOfSpeech: "noun" },
      { word: "grand(e)", translation: "tall / big", pronunciation: "grahn(d)", exampleSentence: "Mon père est grand.", exampleTranslation: "My father is tall.", partOfSpeech: "adjective" },
      { word: "gentil(le)", translation: "kind / nice", pronunciation: "zhahn-TEE(yuh)", exampleSentence: "Elle est très gentille.", exampleTranslation: "She is very kind.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Possessive Adjectives (Mon, Ma, Mes / Ton, Ta, Tes / Son, Sa, Ses)",
        explanation: "French possessives match the **noun's** gender, not the speaker's. **Mon/ton/son** (masc.), **ma/ta/sa** (fem.), **mes/tes/ses** (plural). Before a feminine noun starting with a vowel, use **mon/ton/son** for easier pronunciation.",
        examples: [
          { correct: "mon père", translation: "my father (masculine noun)" },
          { correct: "ma mère", translation: "my mother (feminine noun)" },
          { correct: "mes parents", translation: "my parents (plural)" },
          { correct: "mon amie", translation: "my (female) friend (feminine, but vowel → mon)", note: "Uses 'mon' instead of 'ma' because 'amie' starts with a vowel" },
        ],
        commonMistakes: [
          { incorrect: "ma amie", correction: "mon amie", explanation: "Before a vowel sound, use 'mon' even for feminine nouns to avoid two vowels colliding." },
        ],
      },
      {
        title: "Adjective Agreement",
        explanation: "French adjectives must agree in gender and number with the noun. Most add **-e** for feminine and **-s** for plural.",
        examples: [
          { correct: "Il est grand.", translation: "He is tall." },
          { correct: "Elle est grande.", translation: "She is tall." },
          { correct: "Ils sont grands.", translation: "They (m.) are tall." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-family-chat",
        title: "Describing Your Family",
        situation: "Chatting with a new French friend over coffee",
        agentRole: "You are Camille, a friendly French student. Ask about the student's family — how many siblings, what they look like, their personalities.",
        userGoal: "Describe your family members using possessives and adjectives",
        targetPhrases: ["J'ai...", "Mon/Ma... est...", "Il/Elle est grand(e)"],
        successCriteria: ["Mentions at least two family members", "Uses possessive adjectives", "Describes someone's appearance or personality"],
      },
    ],
    culturalNotes: [
      {
        title: "French Family Traditions",
        content: "Family gatherings are central to French life. The **déjeuner du dimanche** (Sunday lunch) is a cherished tradition — a multi-course meal lasting two to three hours where extended family comes together. Children typically address parents' friends as **Monsieur/Madame** and use **vous** until invited to use **tu**.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-beginner-l5",
    slug: "home-rooms",
    title: "Home & Rooms",
    content: `# La Maison et les Pièces

Describe where you live.

## Types of Housing
- **un appartement** - an apartment
- **une maison** - a house
- **un studio** - a studio apartment
- **un immeuble** - an apartment building

## Rooms of the House
- **la cuisine** - the kitchen
- **le salon** - the living room
- **la chambre** - the bedroom
- **la salle de bains** - the bathroom
- **les toilettes** - the toilet/WC
- **la salle à manger** - the dining room
- **le bureau** - the office/study
- **le jardin** - the garden
- **le balcon** - the balcony

## Describing Your Home
- **J'habite dans...** - I live in...
- **Il y a...** - There is / There are...
- **C'est grand / petit** - It's big / small
- **Au premier étage** - On the first floor (second floor in US)`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m2",
    moduleTitle: "Daily Life",
    order: 5,
    topicId: "fr-beginner-home-rooms",
    vocabulary: [
      { word: "la maison", translation: "house", pronunciation: "lah meh-ZOHN", exampleSentence: "J'habite dans une grande maison.", exampleTranslation: "I live in a big house.", partOfSpeech: "noun" },
      { word: "la cuisine", translation: "kitchen", pronunciation: "lah kwee-ZEEN", exampleSentence: "La cuisine est moderne.", exampleTranslation: "The kitchen is modern.", partOfSpeech: "noun" },
      { word: "la chambre", translation: "bedroom", pronunciation: "lah SHAHM-bruh", exampleSentence: "Ma chambre est au deuxième étage.", exampleTranslation: "My bedroom is on the second floor.", partOfSpeech: "noun" },
      { word: "le salon", translation: "living room", pronunciation: "luh sah-LOHN", exampleSentence: "Le salon est très confortable.", exampleTranslation: "The living room is very comfortable.", partOfSpeech: "noun" },
      { word: "il y a", translation: "there is / there are", pronunciation: "eel ee AH", exampleSentence: "Il y a trois chambres.", exampleTranslation: "There are three bedrooms.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "'Il y a' — There Is / There Are",
        explanation: "**Il y a** is used for both singular and plural — it never changes form. In questions: **Est-ce qu'il y a... ?** or **Y a-t-il... ?** (formal).",
        examples: [
          { correct: "Il y a un jardin.", translation: "There is a garden." },
          { correct: "Il y a trois chambres.", translation: "There are three bedrooms." },
          { correct: "Est-ce qu'il y a un balcon ?", translation: "Is there a balcony?" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-apartment-tour",
        title: "Showing Your Apartment",
        situation: "A French friend is visiting your apartment for the first time",
        agentRole: "You are Thomas, visiting your friend's apartment. Ask questions about the rooms and comment on what you see.",
        userGoal: "Give a tour of your home, naming rooms and describing them",
        targetPhrases: ["Voici...", "Il y a...", "C'est la cuisine", "Ma chambre est..."],
        successCriteria: ["Names at least three rooms", "Uses 'il y a'", "Gives a basic description"],
      },
    ],
  },
  {
    id: "fr-beginner-l6",
    slug: "daily-routine-time",
    title: "Daily Routine & Telling Time",
    content: `# La Routine Quotidienne et l'Heure

Describe your day and tell time.

## Telling Time
- **Quelle heure est-il ?** - What time is it?
- **Il est huit heures.** - It's 8 o'clock.
- **Il est midi / minuit.** - It's noon / midnight.
- **et quart** - quarter past
- **et demie** - half past
- **moins le quart** - quarter to

## Reflexive Verbs (Daily Actions)

- **se réveiller** - to wake up → *Je me réveille à sept heures.*
- **se lever** - to get up → *Je me lève tout de suite.*
- **se laver** - to wash (oneself) → *Je me lave le visage.*
- **se brosser les dents** - to brush one's teeth
- **s'habiller** - to get dressed → *Je m'habille vite.*
- **se coucher** - to go to bed → *Je me couche à onze heures.*

## Daily Activities
- **prendre le petit-déjeuner** - to have breakfast
- **aller au travail / à l'école** - to go to work / school
- **déjeuner** - to have lunch
- **dîner** - to have dinner
- **rentrer à la maison** - to come home`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m2",
    moduleTitle: "Daily Life",
    order: 6,
    topicId: "fr-beginner-daily-routine-time",
    vocabulary: [
      { word: "se réveiller", translation: "to wake up", pronunciation: "suh ray-vay-YAY", exampleSentence: "Je me réveille à six heures.", exampleTranslation: "I wake up at six o'clock.", partOfSpeech: "verb" },
      { word: "se coucher", translation: "to go to bed", pronunciation: "suh koo-SHAY", exampleSentence: "Je me couche tard le samedi.", exampleTranslation: "I go to bed late on Saturdays.", partOfSpeech: "verb" },
      { word: "le petit-déjeuner", translation: "breakfast", pronunciation: "luh puh-TEE day-zhuh-NAY", exampleSentence: "Je prends le petit-déjeuner à huit heures.", exampleTranslation: "I have breakfast at eight o'clock.", partOfSpeech: "noun" },
      { word: "l'heure", translation: "hour / time", pronunciation: "luhr", exampleSentence: "Quelle heure est-il ?", exampleTranslation: "What time is it?", partOfSpeech: "noun" },
      { word: "et demie", translation: "half past", pronunciation: "ay duh-MEE", exampleSentence: "Il est trois heures et demie.", exampleTranslation: "It's half past three.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Reflexive Verbs (Les Verbes Pronominaux)",
        explanation: "Reflexive verbs describe actions you do to yourself. They use a reflexive pronoun that matches the subject: **me** (I), **te** (you), **se** (he/she), **nous** (we), **vous** (you formal/plural), **se** (they).",
        examples: [
          { correct: "Je me lève à sept heures.", translation: "I get up at seven o'clock." },
          { correct: "Tu te couches tard ?", translation: "Do you go to bed late?" },
          { correct: "Elle se brosse les dents.", translation: "She brushes her teeth." },
        ],
        commonMistakes: [
          { incorrect: "Je lève à sept heures.", correction: "Je me lève à sept heures.", explanation: "Don't forget the reflexive pronoun 'me' — without it, the sentence is incomplete." },
        ],
      },
      {
        title: "Telling Time with 'Il est'",
        explanation: "Always use **Il est...** to state the time. Use **heure** (singular) for 1:00 and **heures** (plural) for all other hours. France uses the 24-hour clock in official contexts.",
        examples: [
          { correct: "Il est une heure.", translation: "It's one o'clock." },
          { correct: "Il est quatorze heures trente.", translation: "It's 2:30 PM (14:30)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-daily-routine",
        title: "Describing Your Morning",
        situation: "A French colleague asks about your typical morning routine",
        agentRole: "You are Marc, a curious colleague at a French company. Ask what time the student wakes up, what they do in the morning, and when they leave for work.",
        userGoal: "Describe your morning routine using reflexive verbs and tell the time",
        targetPhrases: ["Je me réveille à...", "Je me lève...", "Il est... heures"],
        successCriteria: ["Uses at least two reflexive verbs", "States a time correctly", "Describes a morning sequence"],
      },
    ],
    culturalNotes: [
      {
        title: "French Meal Times",
        content: "French mealtimes are later than in many countries. **Le petit-déjeuner** (breakfast) is light — usually a croissant or tartine with coffee. **Le déjeuner** (lunch) is around 12:30-2:00 PM and was traditionally the main meal. **Le dîner** (dinner) is at 7:30-9:00 PM. Snacking between meals is frowned upon, though children have **le goûter** (afternoon snack) around 4 PM.",
        region: "France",
      },
    ],
  },
];

// ============================================
// Module 3: Getting Around
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "fr-beginner-l7",
    slug: "directions-city",
    title: "Directions & City Places",
    content: `# Les Directions et la Ville

Navigate a French city with confidence.

## Asking for Directions
- **Excusez-moi, où est... ?** - Excuse me, where is...?
- **C'est près d'ici** - It's nearby
- **C'est loin** - It's far
- **C'est à côté de...** - It's next to...
- **C'est en face de...** - It's across from...

## Direction Words
- **à droite** - to the right
- **à gauche** - to the left
- **tout droit** - straight ahead
- **tournez** - turn
- **continuez** - continue
- **au coin de** - at the corner of

## City Places
- **la gare** - train station
- **la pharmacie** - pharmacy
- **la boulangerie** - bakery
- **la bibliothèque** - library
- **l'hôpital (m.)** - hospital
- **le musée** - museum
- **la poste** - post office
- **la banque** - bank
- **l'église (f.)** - church
- **le parc** - park`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m3",
    moduleTitle: "Getting Around",
    order: 7,
    topicId: "fr-beginner-directions-city",
    vocabulary: [
      { word: "à droite", translation: "to the right", pronunciation: "ah DRWAHT", exampleSentence: "Tournez à droite après la banque.", exampleTranslation: "Turn right after the bank.", partOfSpeech: "phrase" },
      { word: "à gauche", translation: "to the left", pronunciation: "ah GOHSH", exampleSentence: "La pharmacie est à gauche.", exampleTranslation: "The pharmacy is on the left.", partOfSpeech: "phrase" },
      { word: "tout droit", translation: "straight ahead", pronunciation: "too DRWAH", exampleSentence: "Continuez tout droit pendant cinq minutes.", exampleTranslation: "Continue straight ahead for five minutes.", partOfSpeech: "phrase" },
      { word: "la boulangerie", translation: "bakery", pronunciation: "lah boo-lahnzh-REE", exampleSentence: "Il y a une boulangerie au coin de la rue.", exampleTranslation: "There's a bakery at the corner of the street.", partOfSpeech: "noun" },
      { word: "près de", translation: "near / close to", pronunciation: "preh duh", exampleSentence: "L'hôtel est près de la gare.", exampleTranslation: "The hotel is near the train station.", partOfSpeech: "preposition" },
    ],
    grammarPoints: [
      {
        title: "Prepositions of Place",
        explanation: "Use these to describe where things are located:\n- **à côté de** — next to\n- **en face de** — across from\n- **près de** — near\n- **loin de** — far from\n- **entre** — between\n- **devant** — in front of\n- **derrière** — behind",
        examples: [
          { correct: "La banque est à côté de la poste.", translation: "The bank is next to the post office." },
          { correct: "Le musée est en face de l'église.", translation: "The museum is across from the church." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-lost-tourist",
        title: "Lost in Lyon",
        situation: "You're lost in the old town of Lyon and need to find the train station",
        agentRole: "You are a friendly local in Lyon. Give clear, simple directions to the tourist using left, right, and straight.",
        userGoal: "Ask for directions to the train station and confirm you understand",
        targetPhrases: ["Excusez-moi", "Où est la gare ?", "À droite ?", "Merci beaucoup"],
        successCriteria: ["Politely asks for directions", "Names the destination", "Confirms understanding"],
      },
    ],
  },
  {
    id: "fr-beginner-l8",
    slug: "transport",
    title: "Transport & Getting Around",
    content: `# Les Transports

Use public transport and talk about how you travel.

## Modes of Transport
- **le métro** - the subway
- **le bus** - the bus
- **le train** - the train
- **le tramway** - the tram
- **le taxi** - the taxi
- **le vélo** - the bicycle
- **la voiture** - the car
- **à pied** - on foot

## Useful Phrases
- **Je voudrais un billet pour...** - I would like a ticket to...
- **Un aller simple** - A one-way ticket
- **Un aller-retour** - A round-trip ticket
- **À quelle heure part le train ?** - What time does the train leave?
- **Le prochain bus, c'est quand ?** - When is the next bus?
- **Quel quai ?** - Which platform?

## At the Ticket Counter
- **la gare** - train station
- **l'arrêt de bus** - bus stop
- **la station de métro** - subway station
- **le quai** - platform
- **la correspondance** - transfer/connection`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m3",
    moduleTitle: "Getting Around",
    order: 8,
    topicId: "fr-beginner-transport",
    vocabulary: [
      { word: "le métro", translation: "subway", pronunciation: "luh may-TROH", exampleSentence: "Je prends le métro tous les jours.", exampleTranslation: "I take the subway every day.", partOfSpeech: "noun" },
      { word: "un billet", translation: "a ticket", pronunciation: "uhn bee-YEH", exampleSentence: "Je voudrais un billet pour Paris.", exampleTranslation: "I would like a ticket to Paris.", partOfSpeech: "noun" },
      { word: "un aller-retour", translation: "a round-trip ticket", pronunciation: "uhn ah-LAY ruh-TOOR", exampleSentence: "Un aller-retour pour Lyon, s'il vous plaît.", exampleTranslation: "A round-trip ticket to Lyon, please.", partOfSpeech: "noun" },
      { word: "le quai", translation: "platform", pronunciation: "luh KAY", exampleSentence: "Le train part du quai numéro trois.", exampleTranslation: "The train leaves from platform number three.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Aller + Preposition (Getting to Places)",
        explanation: "The verb **aller** (to go) combines with different prepositions:\n- **aller à** + city: *Je vais à Paris.*\n- **aller en** + feminine country: *Je vais en France.*\n- **aller au** + masculine country: *Je vais au Canada.*\n- **aller aux** + plural: *Je vais aux États-Unis.*",
        examples: [
          { correct: "Je vais à la gare.", translation: "I'm going to the station." },
          { correct: "Nous allons en France.", translation: "We're going to France." },
          { correct: "Il va au bureau.", translation: "He's going to the office." },
        ],
        commonMistakes: [
          { incorrect: "Je vais à le bureau.", correction: "Je vais au bureau.", explanation: "'À + le' contracts to 'au'. Similarly, 'à + les' becomes 'aux'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-ticket-counter",
        title: "Buying a Train Ticket",
        situation: "You're at the ticket counter at Gare de Lyon, buying a ticket to Marseille",
        agentRole: "You are a ticket agent at Gare de Lyon. Ask the customer their destination, single or return, and what class.",
        userGoal: "Buy a round-trip train ticket, ask about the time and platform",
        targetPhrases: ["Je voudrais un billet pour...", "Un aller-retour", "À quelle heure... ?", "Quel quai ?"],
        successCriteria: ["States destination", "Specifies ticket type", "Asks about time or platform"],
      },
    ],
    culturalNotes: [
      {
        title: "The French Metro System",
        content: "Paris has one of the world's oldest and densest metro systems, with 16 lines and over 300 stations. A **carnet** (book of 10 tickets) is cheaper than single tickets. The newer **Navigo** pass works like a contactless card. In conversation, the French say **prendre le métro** (take the metro), never 'ride the metro'. Watch out for **correspondances** (transfers) — some stations have very long corridors between lines!",
        region: "Paris, France",
      },
    ],
  },
  {
    id: "fr-beginner-l9",
    slug: "cafe-ordering-shopping",
    title: "Café Ordering & Shopping Basics",
    content: `# Au Café et Faire du Shopping

Order like a local and handle basic shopping.

## At the Café
- **Je voudrais un café, s'il vous plaît.** - I'd like a coffee, please.
- **Un café crème** - Coffee with cream
- **Un café allongé** - An Americano
- **Un thé** - A tea
- **Un jus d'orange** - An orange juice
- **Un verre d'eau** - A glass of water
- **L'addition, s'il vous plaît.** - The check, please.

## Shopping Phrases
- **Combien ça coûte ?** - How much does it cost?
- **C'est combien ?** - How much is it?
- **C'est trop cher.** - It's too expensive.
- **Je cherche...** - I'm looking for...
- **Vous avez... ?** - Do you have...?
- **Quelle taille ?** - What size?
- **Je peux essayer ?** - Can I try it on?
- **Je le prends.** - I'll take it.

## Paying
- **en espèces** - in cash
- **par carte** - by card
- **la monnaie** - change`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m3",
    moduleTitle: "Getting Around",
    order: 9,
    topicId: "fr-beginner-cafe-ordering-shopping",
    vocabulary: [
      { word: "je voudrais", translation: "I would like", pronunciation: "zhuh voo-DREH", exampleSentence: "Je voudrais un café crème.", exampleTranslation: "I would like a coffee with cream.", partOfSpeech: "phrase" },
      { word: "l'addition", translation: "the check/bill", pronunciation: "lah-dee-SYOHN", exampleSentence: "L'addition, s'il vous plaît.", exampleTranslation: "The check, please.", partOfSpeech: "noun" },
      { word: "combien", translation: "how much / how many", pronunciation: "kohm-BYEHN", exampleSentence: "Combien ça coûte ?", exampleTranslation: "How much does it cost?", partOfSpeech: "adverb" },
      { word: "acheter", translation: "to buy", pronunciation: "ahsh-TAY", exampleSentence: "Je voudrais acheter un cadeau.", exampleTranslation: "I would like to buy a gift.", partOfSpeech: "verb" },
      { word: "la monnaie", translation: "change / coins", pronunciation: "lah moh-NEH", exampleSentence: "Vous avez la monnaie ?", exampleTranslation: "Do you have change?", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Partitive Articles (Du, De la, De l', Des)",
        explanation: "When talking about **some** of something (uncountable quantities), use partitive articles:\n- **du** + masculine noun: *du café* (some coffee)\n- **de la** + feminine noun: *de la confiture* (some jam)\n- **de l'** + vowel: *de l'eau* (some water)\n- **des** + plural: *des croissants* (some croissants)\n\nIn negative sentences, they all become **de/d'**: *Je ne veux pas **de** café.*",
        examples: [
          { correct: "Je voudrais du pain.", translation: "I would like some bread." },
          { correct: "Avez-vous de la limonade ?", translation: "Do you have lemonade?" },
          { correct: "Je ne prends pas de sucre.", translation: "I don't take sugar." },
        ],
        commonMistakes: [
          { incorrect: "Je veux le café.", correction: "Je veux du café.", explanation: "Use 'du' (some) not 'le' (the) when requesting an unspecified amount." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-cafe-order",
        title: "Morning at a Parisian Café",
        situation: "It's morning and you sit down at a terrace café near the Seine",
        agentRole: "You are a Parisian waiter. Greet the customer, take their order, and tell them the total.",
        userGoal: "Order a drink and a pastry, ask for the bill, and pay",
        targetPhrases: ["Bonjour", "Je voudrais...", "L'addition, s'il vous plaît", "Merci"],
        successCriteria: ["Greets the waiter", "Orders at least one item", "Asks for the check"],
        hints: ["Start with 'Bonjour'", "Use 'Je voudrais...' to order", "Say 'L'addition, s'il vous plaît' for the check"],
      },
    ],
    culturalNotes: [
      {
        title: "French Café Culture",
        content: "In France, a **café** is not just a place to grab coffee — it's a social institution. Sitting at a terrace and watching the world go by is a national pastime. Prices are often higher if you sit at a table (**en salle**) vs. standing at the bar (**au comptoir**). Tipping is included in the price (**service compris**), but leaving small change is a nice gesture. Never rush — the French café experience is meant to be savored.",
        region: "France",
      },
    ],
  },
];

// ============================================
// Module 4: Expanding Your World
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "fr-beginner-l10",
    slug: "food-meals-restaurant",
    title: "Food, Meals & Restaurant Ordering",
    content: `# La Nourriture et le Restaurant

Talk about food and navigate a French restaurant.

## Common Foods
- **le pain** - bread
- **le fromage** - cheese
- **le poulet** - chicken
- **le poisson** - fish
- **le riz** - rice
- **les pâtes** - pasta
- **les légumes** - vegetables
- **les fruits** - fruit
- **la salade** - salad
- **la soupe** - soup

## At the Restaurant
- **La carte, s'il vous plaît.** - The menu, please.
- **Qu'est-ce que vous recommandez ?** - What do you recommend?
- **Je suis allergique à...** - I'm allergic to...
- **C'est délicieux !** - It's delicious!
- **Comme entrée / plat / dessert...** - As a starter / main / dessert...

## French Meal Structure
1. **L'apéritif** - Pre-dinner drink
2. **L'entrée** - Starter
3. **Le plat principal** - Main course
4. **Le fromage** - Cheese course
5. **Le dessert** - Dessert
6. **Le café** - Coffee (after dessert, never during)`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m4",
    moduleTitle: "Expanding Your World",
    order: 10,
    topicId: "fr-beginner-food-meals-restaurant",
    vocabulary: [
      { word: "le fromage", translation: "cheese", pronunciation: "luh froh-MAHZH", exampleSentence: "La France a plus de 400 fromages.", exampleTranslation: "France has more than 400 cheeses.", partOfSpeech: "noun" },
      { word: "le plat principal", translation: "main course", pronunciation: "luh plah pran-see-PAHL", exampleSentence: "Comme plat principal, je prends le poulet.", exampleTranslation: "For the main course, I'll have the chicken.", partOfSpeech: "noun" },
      { word: "délicieux", translation: "delicious", pronunciation: "day-lee-SYUH", exampleSentence: "Ce gâteau est délicieux !", exampleTranslation: "This cake is delicious!", partOfSpeech: "adjective" },
      { word: "la carte", translation: "the menu", pronunciation: "lah KAHRT", exampleSentence: "La carte, s'il vous plaît.", exampleTranslation: "The menu, please.", partOfSpeech: "noun" },
      { word: "l'entrée", translation: "starter / appetizer", pronunciation: "lahn-TRAY", exampleSentence: "Comme entrée, je voudrais la soupe.", exampleTranslation: "As a starter, I'd like the soup.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Prendre (To Take / To Have — for food)",
        explanation: "**Prendre** is the standard verb for ordering food. It's irregular:\n- je **prends** / tu **prends** / il/elle **prend**\n- nous **prenons** / vous **prenez** / ils/elles **prennent**",
        examples: [
          { correct: "Je prends le menu du jour.", translation: "I'll have the daily special." },
          { correct: "Qu'est-ce que vous prenez ?", translation: "What will you have?" },
        ],
        commonMistakes: [
          { incorrect: "Je mange le poulet.", correction: "Je prends le poulet.", explanation: "When ordering, use 'prendre' (to take/have), not 'manger' (to eat). 'Manger' is for the physical act of eating." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-restaurant-order",
        title: "Dinner at a Bistro",
        situation: "You're having dinner at a traditional bistro in Bordeaux",
        agentRole: "You are a waiter at a bistro. Present the specials, take the order for starter, main, and dessert.",
        userGoal: "Order a full meal (starter, main, dessert) and ask about recommendations",
        targetPhrases: ["La carte, s'il vous plaît", "Qu'est-ce que vous recommandez ?", "Comme entrée...", "Comme plat..."],
        successCriteria: ["Asks for the menu or recommendations", "Orders at least two courses", "Uses polite forms"],
      },
    ],
    culturalNotes: [
      {
        title: "The Sacred French Meal",
        content: "In France, meals are events, not just fuel. A proper dinner can last two to three hours. The **formule** (fixed-price menu) at lunch is a great deal — usually two or three courses. Never ask for substitutions or modifications; it's seen as disrespectful to the chef. And remember: **le fromage** comes before dessert, and coffee comes after dessert, never with it!",
        region: "France",
      },
    ],
  },
  {
    id: "fr-beginner-l11",
    slug: "weather-hobbies",
    title: "Weather & Hobbies",
    content: `# Le Temps et les Loisirs

Talk about the weather and your free time.

## Weather Expressions
- **Quel temps fait-il ?** - What's the weather like?
- **Il fait beau.** - It's nice weather.
- **Il fait chaud.** - It's hot.
- **Il fait froid.** - It's cold.
- **Il fait mauvais.** - The weather is bad.
- **Il pleut.** - It's raining.
- **Il neige.** - It's snowing.
- **Il y a du vent.** - It's windy.
- **Il y a du soleil.** - It's sunny.

## Hobbies (Les Loisirs)
- **la lecture** - reading
- **le sport** - sports
- **la cuisine** - cooking
- **le cinéma** - cinema/movies
- **la musique** - music
- **le jardinage** - gardening
- **le voyage** - travel
- **la danse** - dance

## Talking About Hobbies
- **J'aime...** - I like...
- **J'adore...** - I love...
- **Je déteste...** - I hate...
- **Je préfère...** - I prefer...
- **Je fais du/de la...** - I do/play...`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m4",
    moduleTitle: "Expanding Your World",
    order: 11,
    topicId: "fr-beginner-weather-hobbies",
    vocabulary: [
      { word: "il fait beau", translation: "the weather is nice", pronunciation: "eel feh BOH", exampleSentence: "Il fait beau aujourd'hui.", exampleTranslation: "The weather is nice today.", partOfSpeech: "phrase" },
      { word: "il pleut", translation: "it's raining", pronunciation: "eel PLUH", exampleSentence: "Il pleut souvent en automne.", exampleTranslation: "It rains often in autumn.", partOfSpeech: "phrase" },
      { word: "j'aime", translation: "I like / I love", pronunciation: "zhehm", exampleSentence: "J'aime lire et voyager.", exampleTranslation: "I like reading and traveling.", partOfSpeech: "verb" },
      { word: "le cinéma", translation: "cinema / movies", pronunciation: "luh see-nay-MAH", exampleSentence: "J'adore aller au cinéma.", exampleTranslation: "I love going to the movies.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Aimer / Adorer / Détester + Infinitive",
        explanation: "To say you like/love/hate **doing** something, use the verb of preference + the infinitive:\n- **J'aime nager.** (I like swimming/to swim.)\n- **J'adore cuisiner.** (I love cooking.)\n- **Je déteste courir.** (I hate running.)",
        examples: [
          { correct: "J'aime lire.", translation: "I like to read." },
          { correct: "Elle adore danser.", translation: "She loves to dance." },
          { correct: "Nous détestons attendre.", translation: "We hate waiting." },
        ],
      },
      {
        title: "'Il fait' for Weather",
        explanation: "Most weather expressions use the impersonal **il fait** + adjective. Exceptions use other constructions:\n- **Il fait** + adjective: *Il fait chaud/froid/beau.*\n- **Il** + verb: *Il pleut. Il neige.*\n- **Il y a** + noun: *Il y a du vent. Il y a du soleil.*",
        examples: [
          { correct: "Il fait froid en hiver.", translation: "It's cold in winter." },
          { correct: "Il y a du soleil aujourd'hui.", translation: "It's sunny today." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-weather-weekend",
        title: "Planning a Weekend",
        situation: "You're chatting with a French friend about weekend plans and the weather",
        agentRole: "You are Sophie, a French friend planning the weekend. Discuss the weather forecast and suggest activities based on it.",
        userGoal: "Discuss the weather and talk about hobbies you enjoy",
        targetPhrases: ["Il fait...", "J'aime...", "J'adore...", "On peut..."],
        successCriteria: ["Describes the weather", "Mentions at least one hobby", "Responds to activity suggestions"],
      },
    ],
  },
  {
    id: "fr-beginner-l12",
    slug: "clothing",
    title: "Clothing & Getting Dressed",
    content: `# Les Vêtements

Talk about what you wear.

## Common Clothing
- **un pantalon** - pants/trousers
- **une chemise** - a shirt (button-down)
- **un tee-shirt** - a T-shirt
- **une robe** - a dress
- **une jupe** - a skirt
- **un pull** - a sweater/pullover
- **un manteau** - a coat
- **une veste** - a jacket
- **des chaussures (f.)** - shoes
- **des chaussettes (f.)** - socks
- **un chapeau** - a hat
- **une écharpe** - a scarf

## Colors (Les Couleurs)
- **rouge** - red / **bleu(e)** - blue / **vert(e)** - green
- **noir(e)** - black / **blanc(he)** - white / **jaune** - yellow
- **gris(e)** - grey / **marron** - brown / **rose** - pink

## Useful Phrases
- **Je porte...** - I'm wearing...
- **Je m'habille en...** - I dress in...
- **C'est à la mode.** - It's fashionable.
- **Ça te/vous va bien.** - That suits you.`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m4",
    moduleTitle: "Expanding Your World",
    order: 12,
    topicId: "fr-beginner-clothing",
    vocabulary: [
      { word: "une robe", translation: "a dress", pronunciation: "oon ROHB", exampleSentence: "Elle porte une robe bleue.", exampleTranslation: "She's wearing a blue dress.", partOfSpeech: "noun" },
      { word: "un manteau", translation: "a coat", pronunciation: "uhn mahn-TOH", exampleSentence: "Prends ton manteau, il fait froid.", exampleTranslation: "Take your coat, it's cold.", partOfSpeech: "noun" },
      { word: "des chaussures", translation: "shoes", pronunciation: "day shoh-SOOR", exampleSentence: "J'ai besoin de nouvelles chaussures.", exampleTranslation: "I need new shoes.", partOfSpeech: "noun" },
      { word: "rouge", translation: "red", pronunciation: "ROOZH", exampleSentence: "J'aime la couleur rouge.", exampleTranslation: "I like the color red.", partOfSpeech: "adjective" },
      { word: "je porte", translation: "I'm wearing", pronunciation: "zhuh POHRT", exampleSentence: "Aujourd'hui, je porte un pull noir.", exampleTranslation: "Today, I'm wearing a black sweater.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Color Adjective Agreement",
        explanation: "Most color adjectives agree in gender and number with the noun:\n- **noir → noire → noirs → noires**\n- **vert → verte → verts → vertes**\n\nExceptions that **never change**: **marron** and **orange**.\n- *des chaussures marron* (NOT ~~marronne~~)",
        examples: [
          { correct: "une chemise blanche", translation: "a white shirt" },
          { correct: "des chaussures noires", translation: "black shoes" },
          { correct: "une écharpe marron", translation: "a brown scarf (marron never changes)" },
        ],
        commonMistakes: [
          { incorrect: "une robe bleu", correction: "une robe bleue", explanation: "Robe is feminine, so the adjective must also be feminine: bleue." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-clothing-shop",
        title: "Shopping for Clothes",
        situation: "You're in a boutique on the Champs-Élysées looking for an outfit",
        agentRole: "You are a boutique shop assistant. Help the customer find the right size and color. Suggest items.",
        userGoal: "Ask about sizes, colors, and prices. Describe what you want to buy.",
        targetPhrases: ["Je cherche...", "Vous avez... en bleu ?", "Quelle taille ?", "Je le/la prends"],
        successCriteria: ["Describes what they want", "Mentions a color or size", "Makes a purchase decision"],
      },
    ],
  },
];

// ============================================
// Module 5: Past & Future
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "fr-beginner-l13",
    slug: "passe-compose",
    title: "Passé Composé — Talking About the Past",
    content: `# Le Passé Composé

Talk about what happened using the most common French past tense.

## How It Works

**Subject + avoir/être (present) + past participle**

### With Avoir (most verbs)
- **J'ai mangé** - I ate / I have eaten
- **Tu as parlé** - You spoke
- **Il a fini** - He finished
- **Nous avons vu** - We saw
- **Vous avez bu** - You drank
- **Ils ont pris** - They took

### Common Past Participles
| Infinitive | Past Participle | Meaning |
|-----------|----------------|---------|
| parler | parl**é** | spoken |
| finir | fin**i** | finished |
| prendre | pr**is** | taken |
| faire | f**ait** | done/made |
| voir | v**u** | seen |
| avoir | e**u** | had |
| être | ét**é** | been |

### With Être (movement/state verbs — "DR MRS VANDERTRAMP")
- **Je suis allé(e)** - I went
- **Elle est arrivée** - She arrived
- **Nous sommes partis** - We left
- **Ils sont venus** - They came

> **Key rule:** With être, the past participle agrees with the subject (add -e for feminine, -s for plural).`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m5",
    moduleTitle: "Past & Future",
    order: 13,
    topicId: "fr-beginner-passe-compose",
    vocabulary: [
      { word: "j'ai mangé", translation: "I ate", pronunciation: "zhay mahn-ZHAY", exampleSentence: "J'ai mangé une crêpe ce matin.", exampleTranslation: "I ate a crêpe this morning.", partOfSpeech: "verb" },
      { word: "je suis allé(e)", translation: "I went", pronunciation: "zhuh swee ah-LAY", exampleSentence: "Je suis allée au marché.", exampleTranslation: "I went to the market.", partOfSpeech: "verb" },
      { word: "hier", translation: "yesterday", pronunciation: "ee-EHR", exampleSentence: "Hier, j'ai visité le Louvre.", exampleTranslation: "Yesterday, I visited the Louvre.", partOfSpeech: "adverb" },
      { word: "la semaine dernière", translation: "last week", pronunciation: "lah suh-MEN dehr-NYEHR", exampleSentence: "La semaine dernière, nous sommes allés à Nice.", exampleTranslation: "Last week, we went to Nice.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Avoir vs. Être in Passé Composé",
        explanation: "Most verbs use **avoir** as the helper. A small group of verbs (mostly movement/state changes) use **être**. The classic mnemonic is **DR MRS VANDERTRAMP**:\n- **D**evenir, **R**evenir, **M**onter, **R**ester, **S**ortir, **V**enir, **A**ller, **N**aître, **D**escendre, **E**ntrer, **R**entrer, **T**omber, **R**etourner, **A**rriver, **M**ourir, **P**artir\n\nAll reflexive verbs also use être.",
        examples: [
          { correct: "J'ai regardé un film.", translation: "I watched a movie. (avoir)" },
          { correct: "Je suis parti à huit heures.", translation: "I left at eight o'clock. (être)" },
          { correct: "Elle est née en France.", translation: "She was born in France. (être + agreement)" },
        ],
        commonMistakes: [
          { incorrect: "J'ai allé au cinéma.", correction: "Je suis allé au cinéma.", explanation: "'Aller' uses être, not avoir, in the passé composé." },
          { incorrect: "Elle est allé.", correction: "Elle est allée.", explanation: "With être, the past participle must agree: add -e for feminine subjects." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-weekend-recap",
        title: "Monday Morning — What Did You Do?",
        situation: "It's Monday morning and your French colleague asks about your weekend",
        agentRole: "You are Julien, a colleague. Ask what the student did this weekend. React with interest and share what you did too.",
        userGoal: "Describe at least three things you did over the weekend using passé composé",
        targetPhrases: ["J'ai fait...", "Je suis allé(e)...", "J'ai mangé...", "C'était super"],
        successCriteria: ["Uses passé composé with avoir at least once", "Uses passé composé with être at least once", "Describes multiple activities"],
      },
    ],
  },
  {
    id: "fr-beginner-l14",
    slug: "imparfait-futur-proche",
    title: "Imparfait Intro & Futur Proche",
    content: `# L'Imparfait et le Futur Proche

Describe how things were, and what you're going to do.

## L'Imparfait (Imperfect — How Things Were)

Used for:
- **Descriptions in the past:** *Il faisait beau.* (The weather was nice.)
- **Habitual past actions:** *Quand j'étais petit, je jouais dehors.* (When I was little, I played outside.)
- **Background context:** *Il pleuvait quand je suis sorti.* (It was raining when I went out.)

### Formation: stem of nous form (present) + endings
| Subject | Ending | Example (parler) |
|---------|--------|-----------------|
| je | -ais | je parlais |
| tu | -ais | tu parlais |
| il/elle | -ait | il parlait |
| nous | -ions | nous parlions |
| vous | -iez | vous parliez |
| ils/elles | -aient | ils parlaient |

> **Exception:** être → j'étais, tu étais, il était...

## Le Futur Proche (Near Future — Going To)

**Subject + aller (present) + infinitive**

- **Je vais manger.** - I'm going to eat.
- **Tu vas partir ?** - Are you going to leave?
- **Nous allons voyager.** - We're going to travel.
- **Ils vont étudier.** - They're going to study.`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m5",
    moduleTitle: "Past & Future",
    order: 14,
    topicId: "fr-beginner-imparfait-futur-proche",
    vocabulary: [
      { word: "j'étais", translation: "I was", pronunciation: "zhay-TEH", exampleSentence: "Quand j'étais enfant, j'étais timide.", exampleTranslation: "When I was a child, I was shy.", partOfSpeech: "verb" },
      { word: "je vais", translation: "I'm going to", pronunciation: "zhuh VEH", exampleSentence: "Je vais voyager en été.", exampleTranslation: "I'm going to travel in summer.", partOfSpeech: "verb" },
      { word: "demain", translation: "tomorrow", pronunciation: "duh-MAN", exampleSentence: "Demain, je vais visiter le château.", exampleTranslation: "Tomorrow, I'm going to visit the castle.", partOfSpeech: "adverb" },
      { word: "quand", translation: "when", pronunciation: "kahn", exampleSentence: "Quand j'étais petit, j'aimais le chocolat.", exampleTranslation: "When I was little, I loved chocolate.", partOfSpeech: "conjunction" },
    ],
    grammarPoints: [
      {
        title: "Passé Composé vs. Imparfait",
        explanation: "These two past tenses work together:\n- **Passé composé** = completed actions (what happened): *J'ai vu un accident.*\n- **Imparfait** = background/description (what was happening): *Il pleuvait.*\n\nOften used together: *Je lisais (imparfait) quand le téléphone a sonné (passé composé).* — I was reading when the phone rang.",
        examples: [
          { correct: "Il faisait beau quand nous sommes partis.", translation: "The weather was nice when we left." },
          { correct: "Quand j'étais jeune, j'habitais à Lyon.", translation: "When I was young, I lived in Lyon." },
        ],
      },
      {
        title: "Le Futur Proche (aller + infinitive)",
        explanation: "The easiest way to express the future in French. Just conjugate **aller** in the present and add the infinitive of the action verb. This is used much more than the simple future in everyday French.",
        examples: [
          { correct: "Je vais manger à midi.", translation: "I'm going to eat at noon." },
          { correct: "Qu'est-ce que tu vas faire demain ?", translation: "What are you going to do tomorrow?" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-childhood-plans",
        title: "Childhood Memories & Future Plans",
        situation: "You're having a deep conversation with a French friend about the past and future",
        agentRole: "You are Amélie, a thoughtful French friend. Ask about the student's childhood and their plans for next year.",
        userGoal: "Talk about what you used to do as a child (imparfait) and your future plans (futur proche)",
        targetPhrases: ["Quand j'étais petit(e)...", "J'aimais...", "Je vais...", "L'année prochaine..."],
        successCriteria: ["Uses imparfait for past description", "Uses futur proche for plans", "Describes at least one childhood memory"],
      },
    ],
  },
  {
    id: "fr-beginner-l15",
    slug: "health-travel",
    title: "Health & Travel Essentials",
    content: `# La Santé et le Voyage

Handle health situations and travel like a pro.

## At the Pharmacy / Doctor
- **Je suis malade.** - I'm sick.
- **J'ai mal à la tête.** - I have a headache.
- **J'ai mal au ventre.** - I have a stomachache.
- **J'ai mal à la gorge.** - I have a sore throat.
- **J'ai de la fièvre.** - I have a fever.
- **Je tousse.** - I'm coughing.
- **J'ai besoin d'un médicament.** - I need medication.
- **la pharmacie** - pharmacy
- **le médecin** - doctor
- **l'hôpital (m.)** - hospital
- **une ordonnance** - a prescription

## Travel Vocabulary
- **le passeport** - passport
- **la valise** - suitcase
- **l'aéroport (m.)** - airport
- **l'avion (m.)** - airplane
- **la réservation** - reservation
- **l'hôtel (m.)** - hotel
- **la chambre d'hôtel** - hotel room

## Useful Travel Phrases
- **J'ai une réservation au nom de...** - I have a reservation under the name...
- **Pour combien de nuits ?** - For how many nights?
- **À quelle heure est le check-out ?** - What time is checkout?`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m5",
    moduleTitle: "Past & Future",
    order: 15,
    topicId: "fr-beginner-health-travel",
    vocabulary: [
      { word: "j'ai mal à", translation: "I have pain in / my ... hurts", pronunciation: "zhay MAHL ah", exampleSentence: "J'ai mal à la tête depuis ce matin.", exampleTranslation: "I've had a headache since this morning.", partOfSpeech: "phrase" },
      { word: "la pharmacie", translation: "pharmacy", pronunciation: "lah fahr-mah-SEE", exampleSentence: "Il y a une pharmacie près d'ici ?", exampleTranslation: "Is there a pharmacy nearby?", partOfSpeech: "noun" },
      { word: "le passeport", translation: "passport", pronunciation: "luh pahs-POHR", exampleSentence: "N'oubliez pas votre passeport !", exampleTranslation: "Don't forget your passport!", partOfSpeech: "noun" },
      { word: "la réservation", translation: "reservation", pronunciation: "lah ray-zehr-vah-SYOHN", exampleSentence: "J'ai une réservation pour deux nuits.", exampleTranslation: "I have a reservation for two nights.", partOfSpeech: "noun" },
      { word: "l'hôpital", translation: "hospital", pronunciation: "loh-pee-TAHL", exampleSentence: "Où est l'hôpital le plus proche ?", exampleTranslation: "Where is the nearest hospital?", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "'Avoir mal à' — Expressing Pain",
        explanation: "French uses **avoir mal à** + body part (with article) to express pain. The article contracts with **à**:\n- **à + le** → **au**: *J'ai mal au dos.* (My back hurts.)\n- **à + la** → **à la**: *J'ai mal à la tête.* (I have a headache.)\n- **à + les** → **aux**: *J'ai mal aux dents.* (My teeth hurt.)",
        examples: [
          { correct: "J'ai mal au ventre.", translation: "I have a stomachache." },
          { correct: "Elle a mal à la gorge.", translation: "She has a sore throat." },
          { correct: "Il a mal aux pieds.", translation: "His feet hurt." },
        ],
        commonMistakes: [
          { incorrect: "J'ai mal de tête.", correction: "J'ai mal à la tête.", explanation: "Use 'à la/au/aux' not 'de' with 'avoir mal'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-pharmacy-visit",
        title: "At the Pharmacy",
        situation: "You're not feeling well while traveling in France and visit a pharmacy",
        agentRole: "You are a French pharmacist. Ask the customer about their symptoms and recommend a treatment.",
        userGoal: "Describe your symptoms and understand the pharmacist's advice",
        targetPhrases: ["Je suis malade", "J'ai mal à...", "J'ai besoin de...", "Merci"],
        successCriteria: ["Describes at least one symptom", "Uses 'avoir mal à'", "Responds to treatment advice"],
        hints: ["Start by saying what hurts: 'J'ai mal à la tête'", "Ask for help: 'J'ai besoin d'un médicament'"],
      },
    ],
    culturalNotes: [
      {
        title: "Pharmacies in France",
        content: "French pharmacies (marked with a green neon cross) play a bigger role than in many countries. Pharmacists can diagnose minor ailments and recommend treatments without a doctor's visit. They can identify wild mushrooms you've picked! Many medications that require prescriptions elsewhere are available over the counter. Every neighborhood has a pharmacy, and there's always a **pharmacie de garde** (duty pharmacy) open on holidays and nights.",
        region: "France",
      },
    ],
  },
];

// ============================================
// Module 6: Connecting with Others
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "fr-beginner-l16",
    slug: "feelings-emotions",
    title: "Feelings & Emotions",
    content: `# Les Sentiments et les Émotions

Express how you feel.

## Common Emotions
- **content(e)** - happy/pleased
- **heureux/heureuse** - happy
- **triste** - sad
- **fatigué(e)** - tired
- **en colère** - angry
- **stressé(e)** - stressed
- **inquiet/inquiète** - worried
- **surpris(e)** - surprised
- **déçu(e)** - disappointed
- **fier/fière** - proud

## Expressing Feelings
- **Je suis content(e).** - I'm happy.
- **Je me sens bien/mal.** - I feel good/bad.
- **Ça me rend triste.** - That makes me sad.
- **J'ai peur de...** - I'm afraid of...
- **J'en ai marre !** - I'm fed up! (informal)
- **Ça m'énerve !** - That annoys me!

## Asking About Feelings
- **Comment tu te sens ?** - How are you feeling?
- **Qu'est-ce qui ne va pas ?** - What's wrong?
- **Tu vas bien ?** - Are you okay?`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m6",
    moduleTitle: "Connecting with Others",
    order: 16,
    topicId: "fr-beginner-feelings-emotions",
    vocabulary: [
      { word: "content(e)", translation: "happy / pleased", pronunciation: "kohn-TAHN(t)", exampleSentence: "Je suis très contente aujourd'hui.", exampleTranslation: "I'm very happy today.", partOfSpeech: "adjective" },
      { word: "fatigué(e)", translation: "tired", pronunciation: "fah-tee-GAY", exampleSentence: "Je suis fatigué après le travail.", exampleTranslation: "I'm tired after work.", partOfSpeech: "adjective" },
      { word: "inquiet/inquiète", translation: "worried", pronunciation: "an-KYEH / an-KYEHT", exampleSentence: "Elle est inquiète pour son examen.", exampleTranslation: "She's worried about her exam.", partOfSpeech: "adjective" },
      { word: "j'ai peur", translation: "I'm afraid", pronunciation: "zhay PUHR", exampleSentence: "J'ai peur du noir.", exampleTranslation: "I'm afraid of the dark.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Être vs. Avoir for Feelings",
        explanation: "Most emotions use **être**: *Je suis triste.* (I'm sad.)\nBut some use **avoir**: *J'ai peur.* (I'm scared.) / *J'ai honte.* (I'm ashamed.)\n\nThink of it as: être = you **are** the emotion; avoir = you **have** the feeling.",
        examples: [
          { correct: "Je suis heureux.", translation: "I'm happy. (être)" },
          { correct: "J'ai peur.", translation: "I'm afraid. (avoir — I have fear)" },
          { correct: "Elle est en colère.", translation: "She is angry. (être)" },
        ],
        commonMistakes: [
          { incorrect: "Je suis peur.", correction: "J'ai peur.", explanation: "Fear uses 'avoir' (to have), not 'être' (to be) — just like age." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-feelings-friend",
        title: "Comforting a Friend",
        situation: "Your French friend seems upset and you want to help",
        agentRole: "You are Léa, and you're having a bad day. Share your feelings when asked and appreciate the student's support.",
        userGoal: "Ask how Léa is feeling, express empathy, and share your own feelings",
        targetPhrases: ["Qu'est-ce qui ne va pas ?", "Je suis désolé(e)", "Je comprends", "Tu vas bien ?"],
        successCriteria: ["Asks about feelings", "Expresses empathy", "Shares own emotional state"],
      },
    ],
  },
  {
    id: "fr-beginner-l17",
    slug: "phone-calls-celebrations",
    title: "Phone Calls & Celebrations",
    content: `# Au Téléphone et les Fêtes

Handle phone calls and celebrate in French.

## Phone Conversations
- **Allô ?** - Hello? (phone only)
- **C'est... à l'appareil.** - It's... speaking.
- **Je voudrais parler à...** - I'd like to speak to...
- **Ne quittez pas.** - Hold on. (Don't hang up.)
- **Je rappellerai plus tard.** - I'll call back later.
- **Vous pouvez répéter ?** - Can you repeat that?
- **Je n'ai pas compris.** - I didn't understand.

## Celebrations & Holidays
- **Joyeux anniversaire !** - Happy birthday!
- **Joyeux Noël !** - Merry Christmas!
- **Bonne année !** - Happy New Year!
- **Félicitations !** - Congratulations!
- **Bonne fête !** - Happy name day!
- **Santé !** - Cheers! (when toasting)

## Party Vocabulary
- **un cadeau** - a gift
- **un gâteau** - a cake
- **une bougie** - a candle
- **une fête** - a party/celebration
- **une surprise** - a surprise
- **un feu d'artifice** - fireworks`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m6",
    moduleTitle: "Connecting with Others",
    order: 17,
    topicId: "fr-beginner-phone-calls-celebrations",
    vocabulary: [
      { word: "allô", translation: "hello (on the phone)", pronunciation: "ah-LOH", exampleSentence: "Allô ? C'est Marie à l'appareil.", exampleTranslation: "Hello? This is Marie speaking.", partOfSpeech: "interjection" },
      { word: "joyeux anniversaire", translation: "happy birthday", pronunciation: "zhwah-YUH ah-nee-vehr-SEHR", exampleSentence: "Joyeux anniversaire, mon ami !", exampleTranslation: "Happy birthday, my friend!", partOfSpeech: "phrase" },
      { word: "un cadeau", translation: "a gift", pronunciation: "uhn kah-DOH", exampleSentence: "J'ai un cadeau pour toi.", exampleTranslation: "I have a gift for you.", partOfSpeech: "noun" },
      { word: "félicitations", translation: "congratulations", pronunciation: "fay-lee-see-tah-SYOHN", exampleSentence: "Félicitations pour ton nouveau travail !", exampleTranslation: "Congratulations on your new job!", partOfSpeech: "interjection" },
      { word: "santé", translation: "cheers (toast) / health", pronunciation: "sahn-TAY", exampleSentence: "Santé ! À notre amitié !", exampleTranslation: "Cheers! To our friendship!", partOfSpeech: "interjection" },
    ],
    grammarPoints: [
      {
        title: "The Imperative (Giving Commands & Instructions)",
        explanation: "The imperative has three forms (tu, nous, vous) and drops the subject pronoun. For -er verbs, the **tu** form also drops the final **-s**:\n- **Parle !** (Speak! — to a friend)\n- **Parlons !** (Let's speak!)\n- **Parlez !** (Speak! — formal/plural)\n\nIrregulars: **être** → sois/soyons/soyez; **avoir** → aie/ayons/ayez",
        examples: [
          { correct: "Ne quittez pas !", translation: "Hold on! (Don't hang up!)" },
          { correct: "Répète, s'il te plaît.", translation: "Repeat, please. (informal)" },
          { correct: "Fêtons ensemble !", translation: "Let's celebrate together!" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-phone-call",
        title: "Making a Phone Call",
        situation: "You're calling a French restaurant to make a reservation",
        agentRole: "You are a restaurant receptionist. Answer the phone, ask for details: how many people, what date, what time, and under what name.",
        userGoal: "Make a dinner reservation by phone for this Saturday",
        targetPhrases: ["Allô", "Je voudrais réserver une table", "Pour samedi soir", "Pour deux personnes"],
        successCriteria: ["Greets appropriately on the phone", "States the purpose of the call", "Provides reservation details"],
      },
    ],
    culturalNotes: [
      {
        title: "La Fête Nationale — Bastille Day",
        content: "July 14th, **la Fête nationale** (often called Bastille Day in English), is France's biggest national celebration. It commemorates the storming of the Bastille in 1789. The day features a military parade on the Champs-Élysées, fireworks at the Eiffel Tower, and **bals des pompiers** (firemen's balls) — dances hosted at fire stations across the country. The French also celebrate **la Fête de la Musique** on June 21st, when free live music fills every street.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-beginner-l18",
    slug: "administrative-tasks",
    title: "Administrative Tasks & Polite Requests",
    content: `# Les Démarches Administratives

Handle everyday administrative situations politely.

## At the Post Office
- **Je voudrais envoyer une lettre.** - I'd like to send a letter.
- **Un timbre pour l'étranger.** - A stamp for abroad.
- **C'est un colis.** - It's a package.
- **Combien de temps pour la livraison ?** - How long for delivery?

## At the Bank / Official Places
- **Je voudrais ouvrir un compte.** - I'd like to open an account.
- **J'ai besoin d'un relevé bancaire.** - I need a bank statement.
- **Où est-ce que je signe ?** - Where do I sign?
- **Il me faut un justificatif de domicile.** - I need proof of address.

## Polite Request Structures
- **Pourriez-vous... ?** - Could you...? (very polite)
- **Est-ce que je pourrais... ?** - Could I...?
- **Auriez-vous... ?** - Would you have...?
- **Je souhaiterais...** - I would wish to... (very formal)

## Essential Admin Vocabulary
- **un formulaire** - a form
- **une pièce d'identité** - an ID document
- **un rendez-vous** - an appointment
- **un reçu** - a receipt
- **une signature** - a signature`,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-beginner-m6",
    moduleTitle: "Connecting with Others",
    order: 18,
    topicId: "fr-beginner-administrative-tasks",
    vocabulary: [
      { word: "un rendez-vous", translation: "an appointment", pronunciation: "uhn rahn-day-VOO", exampleSentence: "J'ai un rendez-vous à quatorze heures.", exampleTranslation: "I have an appointment at 2 PM.", partOfSpeech: "noun" },
      { word: "un formulaire", translation: "a form", pronunciation: "uhn fohr-moo-LEHR", exampleSentence: "Remplissez ce formulaire, s'il vous plaît.", exampleTranslation: "Fill out this form, please.", partOfSpeech: "noun" },
      { word: "une pièce d'identité", translation: "an ID document", pronunciation: "oon pyehs dee-dahn-tee-TAY", exampleSentence: "Vous avez une pièce d'identité ?", exampleTranslation: "Do you have an ID?", partOfSpeech: "noun" },
      { word: "pourriez-vous", translation: "could you (polite)", pronunciation: "poo-ree-AY voo", exampleSentence: "Pourriez-vous m'aider, s'il vous plaît ?", exampleTranslation: "Could you help me, please?", partOfSpeech: "phrase" },
      { word: "un reçu", translation: "a receipt", pronunciation: "uhn ruh-SOO", exampleSentence: "Je peux avoir un reçu ?", exampleTranslation: "Can I have a receipt?", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "The Conditional for Polite Requests",
        explanation: "The **conditional mood** (le conditionnel) makes requests much more polite than the present tense. Compare:\n- Present: *Je veux...* (I want...) — blunt\n- Conditional: *Je voudrais...* (I would like...) — polite\n- Even more polite: *Je souhaiterais...* (I would wish to...)\n\nFor asking others: **Pourriez-vous... ?** (Could you...?) is the gold standard of French politeness.",
        examples: [
          { correct: "Je voudrais un renseignement.", translation: "I would like some information." },
          { correct: "Pourriez-vous répéter ?", translation: "Could you repeat that?" },
          { correct: "Est-ce que je pourrais avoir un reçu ?", translation: "Could I have a receipt?" },
        ],
        commonMistakes: [
          { incorrect: "Je veux parler au directeur.", correction: "Je voudrais parler au directeur.", explanation: "'Je veux' (I want) sounds demanding. 'Je voudrais' (I would like) is much more polite and appropriate." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-beginner-post-office",
        title: "At the Post Office",
        situation: "You need to send a package back home from a French post office",
        agentRole: "You are a postal worker. Help the customer send their package — ask about destination, weight, and delivery speed. Be patient but efficient.",
        userGoal: "Send a package, ask about prices and delivery time, and get a receipt",
        targetPhrases: ["Je voudrais envoyer...", "C'est combien ?", "Combien de temps ?", "Un reçu, s'il vous plaît"],
        successCriteria: ["States what they want to send", "Asks about cost or delivery time", "Uses polite forms"],
      },
    ],
    culturalNotes: [
      {
        title: "French Bureaucracy — La Paperasse",
        content: "France is famous (and sometimes infamous) for its bureaucracy. Administrative tasks often require multiple documents: **pièce d'identité** (ID), **justificatif de domicile** (proof of address, like a utility bill less than 3 months old), and often a **photo d'identité** (passport photo). The word **paperasse** (paperwork, with a slightly negative connotation) is used often. Patience is essential — and being extremely polite using the conditional tense will smooth every interaction.",
        region: "France",
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  { id: "fr-beginner-m1", title: "Module 1: First Steps", description: "Greetings, alphabet, pronunciation, accents, and numbers 1-100", order: 1, lessons: module1Lessons },
  { id: "fr-beginner-m2", title: "Module 2: Daily Life", description: "Family, describing people, home and rooms, daily routine, and telling time", order: 2, lessons: module2Lessons },
  { id: "fr-beginner-m3", title: "Module 3: Getting Around", description: "Directions, city places, transport, café ordering, and shopping", order: 3, lessons: module3Lessons },
  { id: "fr-beginner-m4", title: "Module 4: Expanding Your World", description: "Food and restaurants, weather, hobbies, and clothing", order: 4, lessons: module4Lessons },
  { id: "fr-beginner-m5", title: "Module 5: Past & Future", description: "Passé composé, imparfait, futur proche, health, and travel", order: 5, lessons: module5Lessons },
  { id: "fr-beginner-m6", title: "Module 6: Connecting with Others", description: "Feelings, phone calls, celebrations, and administrative tasks", order: 6, lessons: module6Lessons },
];

export const frenchBeginnerCourse: LanguageCourse = { ...courseInfo, modules };

export function getFrenchBeginnerLessons() {
  return modules.flatMap((m) => m.lessons);
}

export function findFrenchBeginnerLesson(slug: string) {
  return getFrenchBeginnerLessons().find((l) => l.slug === slug);
}
