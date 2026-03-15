// Spanish Beginner Course Data
// CEFR A1 Level - Complete Beginner to Elementary

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "spanish-beginner",
  slug: "spanish-beginner",
  title: "Spanish Beginner",
  language: "es",
  languageName: "Spanish",
  proficiencyLevel: "A1" as const,
  description: "Start your Spanish journey from zero. Learn greetings, introductions, family vocabulary, daily routines, food, shopping, directions, and basic past tense. Build a solid A1 foundation across 8 modules.",
  targetAudience: "Complete beginners to elementary Spanish learners",
  estimatedHours: 60,
  icon: "\u{1F1EA}\u{1F1F8}",
  nextCourseSlug: "spanish-intermediate",
};

// ============================================
// Module 1: Greetings & Introductions
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "es-beginner-l1",
    slug: "greetings-farewells",
    title: "Greetings & Farewells",
    content: `# Greetings & Farewells

Welcome to your Spanish journey! Let's start with the most essential phrases you'll use every day.

## Common Greetings

- **Hola** - Hello/Hi
- **Buenos d\u00edas** - Good morning
- **Buenas tardes** - Good afternoon
- **Buenas noches** - Good evening/night

## Farewells

- **Adi\u00f3s** - Goodbye
- **Hasta luego** - See you later
- **Hasta ma\u00f1ana** - See you tomorrow
- **Nos vemos** - See you around

## Informal Greetings

- **\u00bfQu\u00e9 tal?** - How's it going?
- **\u00bfQu\u00e9 pasa?** - What's up?
- **\u00bfC\u00f3mo andas?** - How are you doing?`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m1",
    moduleTitle: "Greetings & Introductions",
    order: 1,
    topicId: "es-beginner-greetings-farewells",
    vocabulary: [
      {
        word: "hola",
        translation: "hello",
        pronunciation: "OH-lah",
        exampleSentence: "Hola, \u00bfc\u00f3mo est\u00e1s?",
        exampleTranslation: "Hello, how are you?",
        partOfSpeech: "interjection",
      },
      {
        word: "adi\u00f3s",
        translation: "goodbye",
        pronunciation: "ah-DYOHSS",
        exampleSentence: "Adi\u00f3s, nos vemos ma\u00f1ana.",
        exampleTranslation: "Goodbye, see you tomorrow.",
        partOfSpeech: "interjection",
      },
      {
        word: "buenos d\u00edas",
        translation: "good morning",
        pronunciation: "BWEH-nohss DEE-ahss",
        exampleSentence: "Buenos d\u00edas, se\u00f1or Garc\u00eda.",
        exampleTranslation: "Good morning, Mr. Garc\u00eda.",
        partOfSpeech: "phrase",
      },
      {
        word: "hasta luego",
        translation: "see you later",
        pronunciation: "AH-stah LWEH-goh",
        exampleSentence: "Hasta luego, Mar\u00eda.",
        exampleTranslation: "See you later, Mar\u00eda.",
        partOfSpeech: "phrase",
      },
      {
        word: "\u00bfqu\u00e9 tal?",
        translation: "how's it going?",
        pronunciation: "keh TAHL",
        exampleSentence: "\u00a1Hola! \u00bfQu\u00e9 tal?",
        exampleTranslation: "Hi! How's it going?",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Formal vs. Informal Greetings",
        explanation: "Spanish distinguishes between formal and informal address. **Buenos d\u00edas / Buenas tardes / Buenas noches** work in any setting. **\u00bfQu\u00e9 tal?** and **\u00bfQu\u00e9 pasa?** are informal and best used with friends and peers.",
        examples: [
          { correct: "Buenos d\u00edas, se\u00f1or.", translation: "Good morning, sir. (formal)" },
          { correct: "\u00a1Hola! \u00bfQu\u00e9 tal?", translation: "Hi! How's it going? (informal)" },
        ],
        commonMistakes: [
          {
            incorrect: "Buenos noches",
            correction: "Buenas noches",
            explanation: "'Noches' is feminine, so use 'buenas' (not 'buenos').",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "greeting-neighbor",
        title: "Greeting Your Neighbor",
        situation: "You run into your neighbor in the hallway in the morning",
        agentRole: "You are Carmen, a cheerful neighbor. Greet the student and ask how they are doing.",
        userGoal: "Greet Carmen appropriately for the time of day and respond to her questions",
        targetPhrases: ["Buenos d\u00edas", "Hola", "\u00bfQu\u00e9 tal?", "Hasta luego"],
        successCriteria: ["Uses an appropriate greeting", "Responds to how-are-you question", "Says goodbye"],
      },
    ],
    culturalNotes: [
      {
        title: "Greeting Customs in Spain",
        content: "In Spain, it's common to give two kisses (one on each cheek) when greeting friends and family. In Latin America, customs vary: one kiss is common in many countries, while a handshake is standard in business settings. A simple 'Hola' is always safe.",
        region: "Spain & Latin America",
      },
    ],
  },
  {
    id: "es-beginner-l2",
    slug: "introductions",
    title: "Introducing Yourself",
    content: `# Introducing Yourself

Learn how to tell people who you are and ask about them.

## Key Phrases

- **Me llamo...** - My name is...
- **Soy...** - I am...
- **Mucho gusto** - Nice to meet you
- **Encantado/Encantada** - Pleased to meet you (m/f)
- **\u00bfY t\u00fa?** - And you? (informal)
- **\u00bfY usted?** - And you? (formal)

## Asking About Others

- **\u00bfC\u00f3mo te llamas?** - What's your name? (informal)
- **\u00bfC\u00f3mo se llama usted?** - What's your name? (formal)
- **\u00bfDe d\u00f3nde eres?** - Where are you from?`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m1",
    moduleTitle: "Greetings & Introductions",
    order: 2,
    topicId: "es-beginner-introductions",
    vocabulary: [
      {
        word: "me llamo",
        translation: "my name is",
        pronunciation: "meh YAH-moh",
        exampleSentence: "Me llamo Juan.",
        exampleTranslation: "My name is Juan.",
        partOfSpeech: "phrase",
      },
      {
        word: "mucho gusto",
        translation: "nice to meet you",
        pronunciation: "MOO-choh GOO-stoh",
        exampleSentence: "Mucho gusto, soy Ana.",
        exampleTranslation: "Nice to meet you, I'm Ana.",
        partOfSpeech: "phrase",
      },
      {
        word: "soy",
        translation: "I am",
        pronunciation: "soy",
        exampleSentence: "Soy de M\u00e9xico.",
        exampleTranslation: "I am from Mexico.",
        partOfSpeech: "verb",
      },
      {
        word: "\u00bfde d\u00f3nde eres?",
        translation: "where are you from?",
        pronunciation: "deh DOHN-deh EH-rehss",
        exampleSentence: "\u00bfDe d\u00f3nde eres? Soy de Espa\u00f1a.",
        exampleTranslation: "Where are you from? I'm from Spain.",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "The Verb 'Ser' - Present Tense (Soy/Eres/Es)",
        explanation: "'Ser' means 'to be' and is used for permanent characteristics: identity, origin, occupation. The key forms are: **soy** (I am), **eres** (you are, informal), **es** (he/she is, you are formal).",
        examples: [
          { correct: "Soy estudiante.", translation: "I am a student." },
          { correct: "Eres muy amable.", translation: "You are very kind." },
          { correct: "\u00c9l es profesor.", translation: "He is a teacher." },
        ],
        commonMistakes: [
          {
            incorrect: "Yo soy es Ana.",
            correction: "Yo soy Ana.",
            explanation: "Don't double-conjugate. 'Soy' already means 'I am'; you don't need 'es' after it.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "intro-party",
        title: "At a Party",
        situation: "You're at a social gathering meeting new people",
        agentRole: "You are Ana, a warm Colombian woman at a party. Introduce yourself and ask about the student.",
        userGoal: "Introduce yourself, say where you're from, and ask Ana about herself",
        targetPhrases: ["Me llamo...", "\u00bfDe d\u00f3nde eres?", "Mucho gusto", "Soy de..."],
        successCriteria: ["States their name", "Asks about origin", "Responds to questions appropriately"],
      },
    ],
  },
  {
    id: "es-beginner-l3",
    slug: "formal-informal",
    title: "Formal vs. Informal (T\u00fa & Usted)",
    content: `# Formal vs. Informal

Knowing when to use **t\u00fa** (informal) vs. **usted** (formal) is essential in Spanish.

## When to Use T\u00fa

- Friends and peers
- Family members
- Children
- People your age in casual settings

## When to Use Usted

- Elders you don't know well
- In business or professional settings
- Showing respect to strangers
- Customer service interactions

## Key Differences

| Informal (t\u00fa) | Formal (usted) |
|---|---|
| \u00bfC\u00f3mo est\u00e1s? | \u00bfC\u00f3mo est\u00e1? |
| \u00bfC\u00f3mo te llamas? | \u00bfC\u00f3mo se llama? |
| \u00bfDe d\u00f3nde eres? | \u00bfDe d\u00f3nde es? |`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m1",
    moduleTitle: "Greetings & Introductions",
    order: 3,
    topicId: "es-beginner-formal-informal",
    vocabulary: [
      {
        word: "t\u00fa",
        translation: "you (informal)",
        pronunciation: "too",
        exampleSentence: "T\u00fa eres mi amigo.",
        exampleTranslation: "You are my friend.",
        partOfSpeech: "pronoun",
      },
      {
        word: "usted",
        translation: "you (formal)",
        pronunciation: "oo-STEHD",
        exampleSentence: "\u00bfC\u00f3mo est\u00e1 usted?",
        exampleTranslation: "How are you? (formal)",
        partOfSpeech: "pronoun",
      },
      {
        word: "se\u00f1or",
        translation: "sir / Mr.",
        pronunciation: "seh-NYOHR",
        exampleSentence: "Buenos d\u00edas, se\u00f1or L\u00f3pez.",
        exampleTranslation: "Good morning, Mr. L\u00f3pez.",
        partOfSpeech: "noun",
      },
      {
        word: "se\u00f1ora",
        translation: "ma'am / Mrs.",
        pronunciation: "seh-NYOH-rah",
        exampleSentence: "Buenas tardes, se\u00f1ora.",
        exampleTranslation: "Good afternoon, ma'am.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "T\u00fa vs. Usted Verb Forms",
        explanation: "When you switch from **t\u00fa** to **usted**, the verb form changes. **T\u00fa** uses second-person endings, while **usted** uses third-person endings (same as \u00e9l/ella).",
        examples: [
          { correct: "\u00bfC\u00f3mo est\u00e1s?", translation: "How are you? (informal)", note: "T\u00fa form: est\u00e1s" },
          { correct: "\u00bfC\u00f3mo est\u00e1?", translation: "How are you? (formal)", note: "Usted form: est\u00e1" },
          { correct: "\u00bfHablas ingl\u00e9s?", translation: "Do you speak English? (informal)" },
          { correct: "\u00bfHabla ingl\u00e9s?", translation: "Do you speak English? (formal)" },
        ],
        commonMistakes: [
          {
            incorrect: "\u00bfC\u00f3mo est\u00e1s usted?",
            correction: "\u00bfC\u00f3mo est\u00e1 usted?",
            explanation: "With 'usted', use the third-person verb form 'est\u00e1', not the t\u00fa form 'est\u00e1s'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "formal-meeting",
        title: "Meeting a Professor",
        situation: "You're meeting your new Spanish professor for the first time",
        agentRole: "You are Profesor M\u00e9ndez, a university professor. Greet the student formally and ask about their background.",
        userGoal: "Introduce yourself using formal language (usted) throughout the conversation",
        targetPhrases: ["\u00bfC\u00f3mo est\u00e1 usted?", "Mucho gusto", "\u00bfC\u00f3mo se llama?"],
        successCriteria: ["Uses usted form consistently", "Introduces self politely", "Responds with appropriate formality"],
      },
    ],
    culturalNotes: [
      {
        title: "Voseo in Latin America",
        content: "In Argentina, Uruguay, and parts of Central America, people use **vos** instead of **t\u00fa** for informal address, with slightly different verb conjugations (e.g., 'Vos sos' instead of 'T\u00fa eres'). As a beginner, focus on t\u00fa/usted \u2014 you'll be understood everywhere.",
        region: "Latin America",
      },
    ],
  },
];

// ============================================
// Module 2: Personal Information
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "es-beginner-l4",
    slug: "nationality-origin",
    title: "Nationality & Origin",
    content: `# Nationality & Origin

Tell people where you're from and ask about their background.

## Nationalities

- **estadounidense** - American (USA)
- **mexicano/mexicana** - Mexican
- **espa\u00f1ol/espa\u00f1ola** - Spanish
- **colombiano/colombiana** - Colombian
- **argentino/argentina** - Argentinian
- **ingl\u00e9s/inglesa** - English/British

## Key Phrases

- **Soy de...** - I'm from...
- **\u00bfDe d\u00f3nde eres?** - Where are you from?
- **Soy estadounidense.** - I'm American.
- **Vivo en...** - I live in...`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m2",
    moduleTitle: "Personal Information",
    order: 4,
    topicId: "es-beginner-nationality-origin",
    vocabulary: [
      {
        word: "pa\u00eds",
        translation: "country",
        pronunciation: "pah-EES",
        exampleSentence: "\u00bfDe qu\u00e9 pa\u00eds eres?",
        exampleTranslation: "What country are you from?",
        partOfSpeech: "noun",
      },
      {
        word: "estadounidense",
        translation: "American (USA)",
        pronunciation: "ehs-tah-doh-oo-nee-DEHN-seh",
        exampleSentence: "Soy estadounidense.",
        exampleTranslation: "I'm American.",
        partOfSpeech: "adjective",
      },
      {
        word: "vivo en",
        translation: "I live in",
        pronunciation: "VEE-voh ehn",
        exampleSentence: "Vivo en Madrid.",
        exampleTranslation: "I live in Madrid.",
        partOfSpeech: "phrase",
      },
      {
        word: "ciudad",
        translation: "city",
        pronunciation: "syoo-DAHD",
        exampleSentence: "Mi ciudad es grande.",
        exampleTranslation: "My city is big.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Gender Agreement in Nationalities",
        explanation: "Nationalities ending in **-o/-a** change to match the speaker's gender. Those ending in **-e** or a consonant stay the same for both genders (though consonant-ending ones add -a for feminine in some cases).",
        examples: [
          { correct: "Soy mexicano.", translation: "I'm Mexican. (male)" },
          { correct: "Soy mexicana.", translation: "I'm Mexican. (female)" },
          { correct: "Soy estadounidense.", translation: "I'm American. (any gender)" },
          { correct: "Soy ingl\u00e9s / inglesa.", translation: "I'm English. (male / female)" },
        ],
        commonMistakes: [
          {
            incorrect: "Soy mexicano. (said by a woman)",
            correction: "Soy mexicana.",
            explanation: "Use the -a ending if you are female. Nationality adjectives agree with the speaker's gender.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "new-classmate",
        title: "Meeting a New Classmate",
        situation: "First day of a language exchange meetup",
        agentRole: "You are Diego from Colombia. Ask the student where they are from and tell them about yourself.",
        userGoal: "Tell Diego your nationality and where you live, and ask about his",
        targetPhrases: ["Soy de...", "\u00bfDe d\u00f3nde eres?", "Vivo en..."],
        successCriteria: ["States nationality or origin", "Asks about Diego's background", "Mentions where they live"],
      },
    ],
  },
  {
    id: "es-beginner-l5",
    slug: "age-numbers",
    title: "Age & Numbers 1\u2013100",
    content: `# Age & Numbers 1\u2013100

Learn to talk about age and master numbers up to 100.

## Talking About Age

- **\u00bfCu\u00e1ntos a\u00f1os tienes?** - How old are you?
- **Tengo... a\u00f1os** - I am... years old

## Numbers 1\u201330

1-10: uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez
11-15: once, doce, trece, catorce, quince
16-19: diecis\u00e9is, diecisiete, dieciocho, diecinueve
20: veinte
21-29: veintiuno, veintid\u00f3s, veintitr\u00e9s, veinticuatro, veinticinco, veintis\u00e9is, veintisiete, veintiocho, veintinueve
30: treinta

## Numbers 31\u2013100

31: treinta y uno
40: cuarenta | 50: cincuenta | 60: sesenta
70: setenta | 80: ochenta | 90: noventa | 100: cien`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m2",
    moduleTitle: "Personal Information",
    order: 5,
    topicId: "es-beginner-age-numbers",
    vocabulary: [
      {
        word: "a\u00f1os",
        translation: "years (old)",
        pronunciation: "AH-nyohss",
        exampleSentence: "Tengo veinticinco a\u00f1os.",
        exampleTranslation: "I'm twenty-five years old.",
        partOfSpeech: "noun",
      },
      {
        word: "treinta",
        translation: "thirty",
        pronunciation: "TRAYN-tah",
        exampleSentence: "Hay treinta estudiantes.",
        exampleTranslation: "There are thirty students.",
        partOfSpeech: "number",
      },
      {
        word: "cincuenta",
        translation: "fifty",
        pronunciation: "seen-KWEHN-tah",
        exampleSentence: "Mi madre tiene cincuenta a\u00f1os.",
        exampleTranslation: "My mother is fifty years old.",
        partOfSpeech: "number",
      },
      {
        word: "cien",
        translation: "one hundred",
        pronunciation: "syehn",
        exampleSentence: "Cuesta cien euros.",
        exampleTranslation: "It costs one hundred euros.",
        partOfSpeech: "number",
      },
    ],
    grammarPoints: [
      {
        title: "The Verb 'Tener' for Age",
        explanation: "In Spanish, you **have** years rather than **being** a certain age. Use **tener** (to have): **tengo** (I have), **tienes** (you have), **tiene** (he/she has).",
        examples: [
          { correct: "Tengo veinte a\u00f1os.", translation: "I am twenty years old. (lit. I have twenty years)" },
          { correct: "\u00bfCu\u00e1ntos a\u00f1os tienes?", translation: "How old are you?" },
          { correct: "Ella tiene treinta y dos a\u00f1os.", translation: "She is thirty-two years old." },
        ],
        commonMistakes: [
          {
            incorrect: "Soy veinte a\u00f1os.",
            correction: "Tengo veinte a\u00f1os.",
            explanation: "Use 'tengo' (I have), not 'soy' (I am). Spanish expresses age with 'tener', not 'ser'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "registration-form",
        title: "Filling Out a Registration",
        situation: "You're registering for a gym membership and the receptionist asks for your information",
        agentRole: "You are a gym receptionist. Ask the student their name, age, and phone number (use numbers).",
        userGoal: "Provide your name, age, and practice saying numbers",
        targetPhrases: ["Tengo... a\u00f1os", "Me llamo...", "Mi n\u00famero es..."],
        successCriteria: ["States age correctly", "Uses numbers", "Responds to all questions"],
      },
    ],
  },
  {
    id: "es-beginner-l6",
    slug: "occupation-interrogatives",
    title: "Occupations & Question Words",
    content: `# Occupations & Question Words

Talk about what you do and learn to ask all the key questions.

## Occupations

- **estudiante** - student
- **profesor/profesora** - teacher
- **m\u00e9dico/m\u00e9dica** - doctor
- **ingeniero/ingeniera** - engineer
- **abogado/abogada** - lawyer
- **enfermero/enfermera** - nurse

## Key Phrases

- **Soy...** - I am (a)...
- **Trabajo como...** - I work as...
- **Trabajo en...** - I work in/at...

## Question Words (Interrogatives)

- **\u00bfQu\u00e9?** - What?
- **\u00bfQui\u00e9n?** - Who?
- **\u00bfD\u00f3nde?** - Where?
- **\u00bfCu\u00e1ndo?** - When?
- **\u00bfPor qu\u00e9?** - Why?
- **\u00bfC\u00f3mo?** - How?
- **\u00bfCu\u00e1nto/a?** - How much?
- **\u00bfCu\u00e1ntos/as?** - How many?`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m2",
    moduleTitle: "Personal Information",
    order: 6,
    topicId: "es-beginner-occupation-interrogatives",
    vocabulary: [
      {
        word: "m\u00e9dico",
        translation: "doctor",
        pronunciation: "MEH-dee-koh",
        exampleSentence: "Soy m\u00e9dico en un hospital.",
        exampleTranslation: "I'm a doctor in a hospital.",
        partOfSpeech: "noun",
      },
      {
        word: "trabajo",
        translation: "work / job",
        pronunciation: "trah-BAH-hoh",
        exampleSentence: "Mi trabajo es interesante.",
        exampleTranslation: "My job is interesting.",
        partOfSpeech: "noun",
      },
      {
        word: "\u00bfqu\u00e9?",
        translation: "what?",
        pronunciation: "keh",
        exampleSentence: "\u00bfQu\u00e9 haces?",
        exampleTranslation: "What do you do?",
        partOfSpeech: "interrogative",
      },
      {
        word: "\u00bfd\u00f3nde?",
        translation: "where?",
        pronunciation: "DOHN-deh",
        exampleSentence: "\u00bfD\u00f3nde trabajas?",
        exampleTranslation: "Where do you work?",
        partOfSpeech: "interrogative",
      },
      {
        word: "\u00bfpor qu\u00e9?",
        translation: "why?",
        pronunciation: "pohr KEH",
        exampleSentence: "\u00bfPor qu\u00e9 estudias espa\u00f1ol?",
        exampleTranslation: "Why do you study Spanish?",
        partOfSpeech: "interrogative",
      },
    ],
    grammarPoints: [
      {
        title: "No Article Before Occupations with 'Ser'",
        explanation: "Unlike English, Spanish does not use an article (un/una) before occupations when using 'ser'. You say 'Soy profesor', NOT 'Soy un profesor' (unless you're adding an adjective).",
        examples: [
          { correct: "Soy estudiante.", translation: "I'm a student." },
          { correct: "Ella es m\u00e9dica.", translation: "She is a doctor." },
          { correct: "Soy un buen profesor.", translation: "I'm a good teacher. (adjective \u2192 article needed)" },
        ],
        commonMistakes: [
          {
            incorrect: "Soy un estudiante.",
            correction: "Soy estudiante.",
            explanation: "Drop the article 'un/una' before occupations with 'ser' unless adding a descriptive adjective.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "job-networking",
        title: "Networking Event",
        situation: "You're at a professional networking event in Barcelona",
        agentRole: "You are Luc\u00eda, an engineer from Madrid. Ask about the student's job and answer questions about yours.",
        userGoal: "Tell Luc\u00eda what you do and ask about her work using question words",
        targetPhrases: ["Soy...", "\u00bfD\u00f3nde trabajas?", "Trabajo en...", "\u00bfQu\u00e9 haces?"],
        successCriteria: ["States occupation", "Uses at least one question word", "Responds to follow-up questions"],
      },
    ],
  },
];

// ============================================
// Module 3: Family & Relationships
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "es-beginner-l7",
    slug: "family-vocabulary",
    title: "Family Vocabulary",
    content: `# Family Vocabulary

Talk about your family in Spanish.

## Immediate Family

- **madre / mam\u00e1** - mother / mom
- **padre / pap\u00e1** - father / dad
- **hermano / hermana** - brother / sister
- **hijo / hija** - son / daughter
- **esposo / esposa** - husband / wife

## Extended Family

- **abuelo / abuela** - grandfather / grandmother
- **t\u00edo / t\u00eda** - uncle / aunt
- **primo / prima** - cousin (m/f)
- **sobrino / sobrina** - nephew / niece
- **suegro / suegra** - father-in-law / mother-in-law

## Describing Family

- **Mi familia es grande/peque\u00f1a.** - My family is big/small.
- **Tengo dos hermanos.** - I have two siblings.
- **No tengo hijos.** - I don't have children.`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m3",
    moduleTitle: "Family & Relationships",
    order: 7,
    topicId: "es-beginner-family-vocabulary",
    vocabulary: [
      {
        word: "madre",
        translation: "mother",
        pronunciation: "MAH-dreh",
        exampleSentence: "Mi madre es doctora.",
        exampleTranslation: "My mother is a doctor.",
        partOfSpeech: "noun",
      },
      {
        word: "padre",
        translation: "father",
        pronunciation: "PAH-dreh",
        exampleSentence: "Mi padre trabaja mucho.",
        exampleTranslation: "My father works a lot.",
        partOfSpeech: "noun",
      },
      {
        word: "hermano",
        translation: "brother",
        pronunciation: "ehr-MAH-noh",
        exampleSentence: "Tengo un hermano mayor.",
        exampleTranslation: "I have an older brother.",
        partOfSpeech: "noun",
      },
      {
        word: "familia",
        translation: "family",
        pronunciation: "fah-MEE-lyah",
        exampleSentence: "Mi familia es muy grande.",
        exampleTranslation: "My family is very big.",
        partOfSpeech: "noun",
      },
      {
        word: "abuelo",
        translation: "grandfather",
        pronunciation: "ah-BWEH-loh",
        exampleSentence: "Mi abuelo tiene ochenta a\u00f1os.",
        exampleTranslation: "My grandfather is eighty years old.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Possessive Adjectives: mi, tu, su",
        explanation: "Possessive adjectives go before the noun and agree in number (singular/plural) but NOT gender.\n\n- **mi / mis** - my\n- **tu / tus** - your (informal)\n- **su / sus** - his/her/your (formal)/their",
        examples: [
          { correct: "mi madre", translation: "my mother" },
          { correct: "mis padres", translation: "my parents" },
          { correct: "tu hermano", translation: "your brother" },
          { correct: "sus hijos", translation: "his/her/their children" },
        ],
        commonMistakes: [
          {
            incorrect: "m\u00edo madre",
            correction: "mi madre",
            explanation: "Use 'mi' (short form) before a noun, not 'm\u00edo' (which goes after the noun or stands alone).",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "family-photo",
        title: "Showing a Family Photo",
        situation: "You're showing a friend a family photo on your phone",
        agentRole: "You are Carlos, a curious friend. Ask about each person in the student's family photo.",
        userGoal: "Describe your family members in the photo using possessives and family vocabulary",
        targetPhrases: ["Este es mi...", "Esta es mi...", "Tengo... hermanos", "Mi... es..."],
        successCriteria: ["Identifies at least 3 family members", "Uses possessive adjectives", "Provides basic details"],
      },
    ],
  },
  {
    id: "es-beginner-l8",
    slug: "tener-descriptions",
    title: "Tener & Describing People",
    content: `# Tener & Describing People

Use 'tener' beyond age and learn to describe your family.

## Tener (to have) - Full Present Tense

- **tengo** - I have
- **tienes** - you have (informal)
- **tiene** - he/she has, you have (formal)
- **tenemos** - we have
- **ten\u00e9is** - you all have (Spain)
- **tienen** - they have, you all have

## Expressions with Tener

- **tener hambre** - to be hungry (lit. to have hunger)
- **tener sed** - to be thirsty
- **tener fr\u00edo/calor** - to be cold/hot
- **tener sue\u00f1o** - to be sleepy
- **tener raz\u00f3n** - to be right

## Describing People

- **alto/a** - tall | **bajo/a** - short
- **joven** - young | **viejo/a** - old
- **guapo/a** - good-looking | **simpático/a** - nice/friendly`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m3",
    moduleTitle: "Family & Relationships",
    order: 8,
    topicId: "es-beginner-tener-descriptions",
    vocabulary: [
      {
        word: "tengo",
        translation: "I have",
        pronunciation: "TEHN-goh",
        exampleSentence: "Tengo dos gatos.",
        exampleTranslation: "I have two cats.",
        partOfSpeech: "verb",
      },
      {
        word: "hambre",
        translation: "hunger",
        pronunciation: "AHM-breh",
        exampleSentence: "Tengo mucha hambre.",
        exampleTranslation: "I'm very hungry.",
        partOfSpeech: "noun",
      },
      {
        word: "alto",
        translation: "tall",
        pronunciation: "AHL-toh",
        exampleSentence: "Mi hermano es alto.",
        exampleTranslation: "My brother is tall.",
        partOfSpeech: "adjective",
      },
      {
        word: "simp\u00e1tico",
        translation: "nice / friendly",
        pronunciation: "seem-PAH-tee-koh",
        exampleSentence: "Mi prima es muy simp\u00e1tica.",
        exampleTranslation: "My cousin is very nice.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "Adjective Agreement (Gender & Number)",
        explanation: "Adjectives must agree with the noun they describe in both **gender** (masculine/feminine) and **number** (singular/plural).\n\n- -o \u2192 -a (masc \u2192 fem): alto \u2192 alta\n- Add -s for plural: altos, altas\n- Adjectives ending in -e or consonant don't change gender: inteligente, joven",
        examples: [
          { correct: "Mi padre es alto.", translation: "My father is tall. (masc. sing.)" },
          { correct: "Mi madre es alta.", translation: "My mother is tall. (fem. sing.)" },
          { correct: "Mis hermanos son altos.", translation: "My brothers are tall. (masc. pl.)" },
          { correct: "Mi t\u00eda es inteligente.", translation: "My aunt is intelligent. (no gender change)" },
        ],
        commonMistakes: [
          {
            incorrect: "Mi madre es alto.",
            correction: "Mi madre es alta.",
            explanation: "The adjective must match the gender of the noun. 'Madre' is feminine, so use 'alta'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "describing-family",
        title: "Describing Your Family",
        situation: "You're talking with a new friend about your family members",
        agentRole: "You are Elena, a curious new friend. Ask the student to describe their family members' appearance and personality.",
        userGoal: "Describe at least two family members using adjectives and tener expressions",
        targetPhrases: ["Mi... es...", "Tiene... a\u00f1os", "Es alto/a", "Es simp\u00e1tico/a"],
        successCriteria: ["Uses adjectives with correct agreement", "Describes at least two people", "Uses tener correctly"],
      },
    ],
  },
  {
    id: "es-beginner-l9",
    slug: "relationships-marital",
    title: "Relationships & Marital Status",
    content: `# Relationships & Marital Status

Talk about relationships and ask about others.

## Marital Status

- **soltero/a** - single
- **casado/a** - married
- **divorciado/a** - divorced
- **novio/a** - boyfriend / girlfriend
- **pareja** - partner

## Relationship Phrases

- **Estoy casado/a.** - I'm married.
- **Estoy soltero/a.** - I'm single.
- **Tengo novio/novia.** - I have a boyfriend/girlfriend.
- **\u00bfTienes hermanos?** - Do you have siblings?
- **Somos tres hermanos.** - We are three siblings (there are three of us).

## Possessive Adjectives (continued)

- **nuestro/a** - our
- **vuestro/a** - your (plural, Spain)
- **su/sus** - their / your (formal)`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m3",
    moduleTitle: "Family & Relationships",
    order: 9,
    topicId: "es-beginner-relationships-marital",
    vocabulary: [
      {
        word: "casado",
        translation: "married",
        pronunciation: "kah-SAH-doh",
        exampleSentence: "Estoy casado desde hace cinco a\u00f1os.",
        exampleTranslation: "I've been married for five years.",
        partOfSpeech: "adjective",
      },
      {
        word: "soltero",
        translation: "single",
        pronunciation: "sohl-TEH-roh",
        exampleSentence: "Mi hermana est\u00e1 soltera.",
        exampleTranslation: "My sister is single.",
        partOfSpeech: "adjective",
      },
      {
        word: "novio",
        translation: "boyfriend",
        pronunciation: "NOH-vyoh",
        exampleSentence: "Mi novia se llama Laura.",
        exampleTranslation: "My girlfriend's name is Laura.",
        partOfSpeech: "noun",
      },
      {
        word: "nuestro",
        translation: "our",
        pronunciation: "NWEHS-troh",
        exampleSentence: "Nuestro abuelo vive en Sevilla.",
        exampleTranslation: "Our grandfather lives in Seville.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "Ser vs. Estar for Status",
        explanation: "Use **ser** for inherent identity (nationality, occupation) and **estar** for states/conditions that can change (marital status, emotions, location).\n\n- **Soy** profesor. (identity)\n- **Estoy** casado. (marital status \u2014 can change)",
        examples: [
          { correct: "Estoy casada.", translation: "I'm married. (female speaker)" },
          { correct: "Ella est\u00e1 soltera.", translation: "She is single." },
          { correct: "Soy colombiano.", translation: "I'm Colombian. (permanent identity)" },
        ],
        commonMistakes: [
          {
            incorrect: "Soy casado.",
            correction: "Estoy casado.",
            explanation: "Marital status uses 'estar' because it's a changeable state, not a permanent identity.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "getting-to-know",
        title: "Getting to Know Someone",
        situation: "You're chatting with a coworker during a coffee break",
        agentRole: "You are Pablo, a friendly coworker. Ask the student about their family and relationship status casually.",
        userGoal: "Share about your family situation and ask Pablo about his",
        targetPhrases: ["Estoy...", "\u00bfTienes hermanos?", "Tengo...", "\u00bfEst\u00e1s casado?"],
        successCriteria: ["Mentions marital status", "Asks about Pablo's family", "Uses estar correctly for status"],
      },
    ],
  },
];

// ============================================
// Module 4: Daily Routines
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "es-beginner-l10",
    slug: "present-tense-regular",
    title: "Present Tense: Regular Verbs",
    content: `# Present Tense: Regular Verbs

Spanish verbs end in **-ar**, **-er**, or **-ir**. Each type follows its own pattern.

## -AR Verbs (hablar - to speak)

| Pronoun | Ending | Example |
|---|---|---|
| yo | -o | hablo |
| t\u00fa | -as | hablas |
| \u00e9l/ella/usted | -a | habla |
| nosotros | -amos | hablamos |
| ellos/ustedes | -an | hablan |

## -ER Verbs (comer - to eat)

| Pronoun | Ending | Example |
|---|---|---|
| yo | -o | como |
| t\u00fa | -es | comes |
| \u00e9l/ella/usted | -e | come |
| nosotros | -emos | comemos |
| ellos/ustedes | -en | comen |

## -IR Verbs (vivir - to live)

| Pronoun | Ending | Example |
|---|---|---|
| yo | -o | vivo |
| t\u00fa | -es | vives |
| \u00e9l/ella/usted | -e | vive |
| nosotros | -imos | vivimos |
| ellos/ustedes | -en | viven |`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m4",
    moduleTitle: "Daily Routines",
    order: 10,
    topicId: "es-beginner-present-tense-regular",
    vocabulary: [
      {
        word: "hablar",
        translation: "to speak",
        pronunciation: "ah-BLAHR",
        exampleSentence: "Hablo espa\u00f1ol un poco.",
        exampleTranslation: "I speak a little Spanish.",
        partOfSpeech: "verb",
      },
      {
        word: "comer",
        translation: "to eat",
        pronunciation: "koh-MEHR",
        exampleSentence: "Comemos a las dos.",
        exampleTranslation: "We eat at two.",
        partOfSpeech: "verb",
      },
      {
        word: "vivir",
        translation: "to live",
        pronunciation: "vee-VEER",
        exampleSentence: "Vivo en una ciudad grande.",
        exampleTranslation: "I live in a big city.",
        partOfSpeech: "verb",
      },
      {
        word: "estudiar",
        translation: "to study",
        pronunciation: "ehs-too-DYAHR",
        exampleSentence: "Estudio espa\u00f1ol todos los d\u00edas.",
        exampleTranslation: "I study Spanish every day.",
        partOfSpeech: "verb",
      },
      {
        word: "escribir",
        translation: "to write",
        pronunciation: "ehs-kree-BEER",
        exampleSentence: "Escribo un correo electr\u00f3nico.",
        exampleTranslation: "I write an email.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Conjugating Regular Verbs in Present Tense",
        explanation: "Remove the infinitive ending (-ar, -er, -ir) to get the **stem**, then add the appropriate ending for the subject. The **yo** form always ends in **-o** for all three verb types.",
        examples: [
          { correct: "Hablo ingl\u00e9s y espa\u00f1ol.", translation: "I speak English and Spanish.", note: "hablar \u2192 habl- + -o" },
          { correct: "Ella come fruta.", translation: "She eats fruit.", note: "comer \u2192 com- + -e" },
          { correct: "Vivimos en Madrid.", translation: "We live in Madrid.", note: "vivir \u2192 viv- + -imos" },
        ],
        commonMistakes: [
          {
            incorrect: "Yo hablo, t\u00fa hablo tambi\u00e9n.",
            correction: "Yo hablo, t\u00fa hablas tambi\u00e9n.",
            explanation: "Each subject pronoun requires its own verb ending. T\u00fa uses -as (for -ar verbs).",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "daily-life-chat",
        title: "Talking About Your Day",
        situation: "You're having a conversation with a language partner about daily activities",
        agentRole: "You are Marta, a language exchange partner. Ask the student what they do every day using simple present tense verbs.",
        userGoal: "Describe your daily activities using at least three different regular verbs",
        targetPhrases: ["Hablo...", "Estudio...", "Como...", "Vivo en..."],
        successCriteria: ["Conjugates at least 3 regular verbs correctly", "Describes daily activities", "Responds to questions"],
      },
    ],
  },
  {
    id: "es-beginner-l11",
    slug: "reflexive-verbs",
    title: "Reflexive Verbs & Morning Routine",
    content: `# Reflexive Verbs & Morning Routine

Reflexive verbs describe actions you do to yourself. They use reflexive pronouns.

## Reflexive Pronouns

- **me** - myself (yo)
- **te** - yourself (t\u00fa)
- **se** - himself/herself/yourself formal (\u00e9l/ella/usted)
- **nos** - ourselves (nosotros)
- **se** - themselves/yourselves (ellos/ustedes)

## Common Reflexive Verbs

- **despertarse** - to wake up \u2192 Me despierto a las siete.
- **levantarse** - to get up \u2192 Me levanto temprano.
- **ducharse** - to shower \u2192 Me ducho por la ma\u00f1ana.
- **vestirse** - to get dressed \u2192 Me visto r\u00e1pido.
- **acostarse** - to go to bed \u2192 Me acuesto a las once.
- **lavarse** - to wash (oneself) \u2192 Me lavo las manos.`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m4",
    moduleTitle: "Daily Routines",
    order: 11,
    topicId: "es-beginner-reflexive-verbs",
    vocabulary: [
      {
        word: "despertarse",
        translation: "to wake up",
        pronunciation: "dehs-pehr-TAHR-seh",
        exampleSentence: "Me despierto a las seis.",
        exampleTranslation: "I wake up at six.",
        partOfSpeech: "verb",
      },
      {
        word: "levantarse",
        translation: "to get up",
        pronunciation: "leh-vahn-TAHR-seh",
        exampleSentence: "Me levanto temprano.",
        exampleTranslation: "I get up early.",
        partOfSpeech: "verb",
      },
      {
        word: "ducharse",
        translation: "to take a shower",
        pronunciation: "doo-CHAHR-seh",
        exampleSentence: "Me ducho despu\u00e9s de correr.",
        exampleTranslation: "I shower after running.",
        partOfSpeech: "verb",
      },
      {
        word: "acostarse",
        translation: "to go to bed",
        pronunciation: "ah-kohs-TAHR-seh",
        exampleSentence: "Me acuesto a las once de la noche.",
        exampleTranslation: "I go to bed at eleven at night.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Reflexive Verb Structure",
        explanation: "Reflexive verbs have **two parts**: a reflexive pronoun (me, te, se, nos, se) + the conjugated verb. The pronoun goes **before** the conjugated verb.",
        examples: [
          { correct: "Me levanto a las siete.", translation: "I get up at seven.", note: "me + levanto" },
          { correct: "Te duchas por la ma\u00f1ana.", translation: "You shower in the morning." },
          { correct: "Ella se viste r\u00e1pido.", translation: "She gets dressed quickly." },
        ],
        commonMistakes: [
          {
            incorrect: "Levanto me a las siete.",
            correction: "Me levanto a las siete.",
            explanation: "The reflexive pronoun goes BEFORE the conjugated verb, not after it.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "morning-routine",
        title: "Describing Your Morning",
        situation: "Your host family in Spain asks about your morning routine",
        agentRole: "You are Se\u00f1ora Mart\u00ednez, the host mother. Ask the student about their morning routine so you can plan breakfast.",
        userGoal: "Describe your morning routine step by step using reflexive verbs",
        targetPhrases: ["Me despierto...", "Me levanto...", "Me ducho...", "Me visto..."],
        successCriteria: ["Uses at least 3 reflexive verbs", "Mentions times", "Follows logical sequence"],
      },
    ],
  },
  {
    id: "es-beginner-l12",
    slug: "time-expressions",
    title: "Telling Time & Time Expressions",
    content: `# Telling Time & Time Expressions

## Asking & Telling Time

- **\u00bfQu\u00e9 hora es?** - What time is it?
- **Es la una.** - It's one o'clock.
- **Son las dos / tres / cuatro...** - It's two / three / four...
- **y cuarto** - quarter past
- **y media** - half past
- **menos cuarto** - quarter to

## Time Expressions for Daily Routines

- **por la ma\u00f1ana** - in the morning
- **por la tarde** - in the afternoon
- **por la noche** - in the evening/at night
- **todos los d\u00edas** - every day
- **siempre** - always
- **nunca** - never
- **a veces** - sometimes
- **temprano** - early
- **tarde** - late`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m4",
    moduleTitle: "Daily Routines",
    order: 12,
    topicId: "es-beginner-time-expressions",
    vocabulary: [
      {
        word: "hora",
        translation: "hour / time",
        pronunciation: "OH-rah",
        exampleSentence: "\u00bfQu\u00e9 hora es?",
        exampleTranslation: "What time is it?",
        partOfSpeech: "noun",
      },
      {
        word: "siempre",
        translation: "always",
        pronunciation: "SYEHM-preh",
        exampleSentence: "Siempre desayuno a las ocho.",
        exampleTranslation: "I always have breakfast at eight.",
        partOfSpeech: "adverb",
      },
      {
        word: "a veces",
        translation: "sometimes",
        pronunciation: "ah VEH-sess",
        exampleSentence: "A veces como en un restaurante.",
        exampleTranslation: "Sometimes I eat at a restaurant.",
        partOfSpeech: "phrase",
      },
      {
        word: "temprano",
        translation: "early",
        pronunciation: "tehm-PRAH-noh",
        exampleSentence: "Me levanto muy temprano.",
        exampleTranslation: "I get up very early.",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "'Es la' vs. 'Son las' for Time",
        explanation: "Use **Es la una** for 1:00 (singular). Use **Son las** + number for all other hours (plural). Minutes are added with **y** (and) or subtracted with **menos** (minus/less).",
        examples: [
          { correct: "Es la una y media.", translation: "It's 1:30." },
          { correct: "Son las tres y cuarto.", translation: "It's 3:15." },
          { correct: "Son las cinco menos diez.", translation: "It's 4:50 (ten to five)." },
        ],
        commonMistakes: [
          {
            incorrect: "Son la una.",
            correction: "Es la una.",
            explanation: "'La una' is singular, so use 'Es' not 'Son'. All other hours use 'Son las...'",
          },
        ],
      },
      {
        title: "Frequency Adverb Placement",
        explanation: "Frequency adverbs like **siempre** (always), **nunca** (never), and **a veces** (sometimes) usually go **before** the verb in Spanish.",
        examples: [
          { correct: "Siempre como a las dos.", translation: "I always eat at two." },
          { correct: "Nunca llego tarde.", translation: "I never arrive late." },
          { correct: "A veces estudio por la noche.", translation: "Sometimes I study at night." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "schedule-planning",
        title: "Planning Your Day",
        situation: "You're discussing your schedule with a Spanish-speaking friend",
        agentRole: "You are Javier, a friend making plans. Ask the student about their schedule today and suggest times to meet.",
        userGoal: "Tell Javier your schedule using times and frequency adverbs, and agree on a time to meet",
        targetPhrases: ["Son las...", "A las...", "Por la ma\u00f1ana...", "Siempre...", "A veces..."],
        successCriteria: ["Tells time correctly", "Uses at least one frequency adverb", "Agrees on a meeting time"],
      },
    ],
  },
];

// ============================================
// Module 5: Food & Dining
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "es-beginner-l13",
    slug: "food-vocabulary",
    title: "Food & Drink Vocabulary",
    content: `# Food & Drink Vocabulary

## Common Foods

- **pan** - bread
- **arroz** - rice
- **pollo** - chicken
- **carne** - meat
- **pescado** - fish
- **huevo** - egg
- **fruta** - fruit
- **verdura** - vegetable
- **ensalada** - salad
- **sopa** - soup

## Drinks

- **agua** - water
- **caf\u00e9** - coffee
- **t\u00e9** - tea
- **jugo / zumo** - juice (Latin America / Spain)
- **leche** - milk
- **cerveza** - beer
- **vino** - wine

## Meals

- **desayuno** - breakfast
- **almuerzo / comida** - lunch
- **cena** - dinner`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m5",
    moduleTitle: "Food & Dining",
    order: 13,
    topicId: "es-beginner-food-vocabulary",
    vocabulary: [
      {
        word: "agua",
        translation: "water",
        pronunciation: "AH-gwah",
        exampleSentence: "Un vaso de agua, por favor.",
        exampleTranslation: "A glass of water, please.",
        partOfSpeech: "noun",
      },
      {
        word: "caf\u00e9",
        translation: "coffee",
        pronunciation: "kah-FEH",
        exampleSentence: "Quiero un caf\u00e9 con leche.",
        exampleTranslation: "I want a coffee with milk.",
        partOfSpeech: "noun",
      },
      {
        word: "pollo",
        translation: "chicken",
        pronunciation: "POH-yoh",
        exampleSentence: "El pollo est\u00e1 delicioso.",
        exampleTranslation: "The chicken is delicious.",
        partOfSpeech: "noun",
      },
      {
        word: "desayuno",
        translation: "breakfast",
        pronunciation: "deh-sah-YOO-noh",
        exampleSentence: "\u00bfQu\u00e9 quieres para el desayuno?",
        exampleTranslation: "What do you want for breakfast?",
        partOfSpeech: "noun",
      },
      {
        word: "ensalada",
        translation: "salad",
        pronunciation: "ehn-sah-LAH-dah",
        exampleSentence: "Quiero una ensalada grande.",
        exampleTranslation: "I want a big salad.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "The Verb 'Gustar' (to like)",
        explanation: "**Gustar** works differently from English. It literally means 'to please'. The thing you like is the subject:\n\n- **Me gusta** + singular noun / infinitive\n- **Me gustan** + plural noun\n\nThe pattern: **indirect object pronoun + gusta/gustan + thing liked**",
        examples: [
          { correct: "Me gusta el caf\u00e9.", translation: "I like coffee. (Coffee pleases me.)" },
          { correct: "Me gustan las frutas.", translation: "I like fruits. (Fruits please me.)" },
          { correct: "Me gusta comer.", translation: "I like to eat." },
          { correct: "\u00bfTe gusta el pollo?", translation: "Do you like chicken?" },
        ],
        commonMistakes: [
          {
            incorrect: "Yo gusto el caf\u00e9.",
            correction: "Me gusta el caf\u00e9.",
            explanation: "Don't conjugate gustar like a normal verb. Use 'me gusta' (it pleases me), not 'yo gusto'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "food-preferences",
        title: "Talking About Food Preferences",
        situation: "A friend is cooking dinner and asks what you like and dislike",
        agentRole: "You are Rosa, preparing dinner for a group. Ask the student what foods they like and dislike to plan the menu.",
        userGoal: "Express your food preferences using gustar and food vocabulary",
        targetPhrases: ["Me gusta...", "No me gusta...", "Me gustan...", "Prefiero..."],
        successCriteria: ["Uses gustar correctly", "Names at least 3 foods", "Expresses both likes and dislikes"],
      },
    ],
    culturalNotes: [
      {
        title: "Tapas Culture in Spain",
        content: "In Spain, **tapas** are small dishes served with drinks at bars. In some cities like Granada, you get a free tapa with each drink! Tapas culture is about socializing \u2014 you hop between bars (**ir de tapas**), sharing small plates with friends. Common tapas include **patatas bravas** (spicy potatoes), **tortilla espa\u00f1ola** (potato omelette), and **jam\u00f3n serrano** (cured ham).",
        region: "Spain",
      },
    ],
  },
  {
    id: "es-beginner-l14",
    slug: "restaurant-ordering",
    title: "Ordering at a Restaurant",
    content: `# Ordering at a Restaurant

## Useful Phrases

- **Una mesa para dos, por favor.** - A table for two, please.
- **\u00bfTiene la carta?** - Do you have the menu?
- **Quiero... / Me gustar\u00eda...** - I want... / I would like...
- **Para m\u00ed...** - For me...
- **\u00bfQu\u00e9 recomienda?** - What do you recommend?
- **La cuenta, por favor.** - The check, please.
- **\u00bfEst\u00e1 incluida la propina?** - Is the tip included?

## Describing Food

- **delicioso** - delicious
- **rico** - tasty
- **caliente** - hot (temperature)
- **picante** - spicy
- **fr\u00edo** - cold`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m5",
    moduleTitle: "Food & Dining",
    order: 14,
    topicId: "es-beginner-restaurant-ordering",
    vocabulary: [
      {
        word: "la cuenta",
        translation: "the check / bill",
        pronunciation: "lah KWEHN-tah",
        exampleSentence: "La cuenta, por favor.",
        exampleTranslation: "The check, please.",
        partOfSpeech: "noun",
      },
      {
        word: "la carta",
        translation: "the menu",
        pronunciation: "lah KAHR-tah",
        exampleSentence: "\u00bfMe puede traer la carta?",
        exampleTranslation: "Can you bring me the menu?",
        partOfSpeech: "noun",
      },
      {
        word: "recomendar",
        translation: "to recommend",
        pronunciation: "reh-koh-mehn-DAHR",
        exampleSentence: "\u00bfQu\u00e9 recomienda?",
        exampleTranslation: "What do you recommend?",
        partOfSpeech: "verb",
      },
      {
        word: "delicioso",
        translation: "delicious",
        pronunciation: "deh-lee-SYOH-soh",
        exampleSentence: "\u00a1Esta paella est\u00e1 deliciosa!",
        exampleTranslation: "This paella is delicious!",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "Quiero vs. Me gustar\u00eda",
        explanation: "**Quiero** (I want) is direct and casual. **Me gustar\u00eda** (I would like) is more polite and preferred in formal settings like restaurants.",
        examples: [
          { correct: "Quiero un caf\u00e9.", translation: "I want a coffee. (casual)" },
          { correct: "Me gustar\u00eda un caf\u00e9, por favor.", translation: "I would like a coffee, please. (polite)" },
          { correct: "Me gustar\u00eda la sopa del d\u00eda.", translation: "I would like the soup of the day." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "restaurant-order",
        title: "Ordering at a Restaurant",
        situation: "You're at a restaurant in Madrid for lunch",
        agentRole: "You are a waiter at a traditional Madrid restaurant. Greet the customer, offer the menu, take their order, and bring the check.",
        userGoal: "Order a full meal (drink, main course, dessert) and ask for the bill",
        targetPhrases: ["Me gustar\u00eda...", "\u00bfQu\u00e9 recomienda?", "La cuenta, por favor", "Para m\u00ed..."],
        successCriteria: ["Orders at least two items", "Uses polite language", "Asks for the bill"],
      },
    ],
  },
  {
    id: "es-beginner-l15",
    slug: "likes-dislikes",
    title: "Likes, Dislikes & Preferences",
    content: `# Likes, Dislikes & Preferences

## Expressing Degrees of Liking

- **Me encanta(n)...** - I love...
- **Me gusta(n) mucho...** - I really like...
- **Me gusta(n)...** - I like...
- **No me gusta(n)...** - I don't like...
- **No me gusta(n) nada...** - I don't like... at all
- **Odio...** - I hate...

## Preferences

- **Prefiero...** - I prefer...
- **Me gusta m\u00e1s...** - I like... more
- **\u00bfQu\u00e9 prefieres?** - What do you prefer?
- **\u00bfCu\u00e1l te gusta m\u00e1s?** - Which one do you like more?

## All Indirect Object Pronouns with Gustar

- **me** gusta (I like) | **nos** gusta (we like)
- **te** gusta (you like) | **os** gusta (you all like - Spain)
- **le** gusta (he/she/you formal likes) | **les** gusta (they/you all like)`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m5",
    moduleTitle: "Food & Dining",
    order: 15,
    topicId: "es-beginner-likes-dislikes",
    vocabulary: [
      {
        word: "encantar",
        translation: "to love (something)",
        pronunciation: "ehn-kahn-TAHR",
        exampleSentence: "Me encanta la m\u00fasica.",
        exampleTranslation: "I love music.",
        partOfSpeech: "verb",
      },
      {
        word: "preferir",
        translation: "to prefer",
        pronunciation: "preh-feh-REER",
        exampleSentence: "Prefiero el t\u00e9 al caf\u00e9.",
        exampleTranslation: "I prefer tea to coffee.",
        partOfSpeech: "verb",
      },
      {
        word: "m\u00e1s",
        translation: "more",
        pronunciation: "mahss",
        exampleSentence: "Me gusta m\u00e1s el arroz.",
        exampleTranslation: "I like rice more.",
        partOfSpeech: "adverb",
      },
      {
        word: "nada",
        translation: "nothing / at all",
        pronunciation: "NAH-dah",
        exampleSentence: "No me gusta nada el pescado.",
        exampleTranslation: "I don't like fish at all.",
        partOfSpeech: "pronoun",
      },
    ],
    grammarPoints: [
      {
        title: "Gustar with Different Subjects",
        explanation: "To say who likes something, change the indirect object pronoun. To clarify or emphasize, add **a + person**: **A Mar\u00eda le gusta...**",
        examples: [
          { correct: "A m\u00ed me encanta bailar.", translation: "I love to dance. (emphatic)" },
          { correct: "A ella le gustan los gatos.", translation: "She likes cats." },
          { correct: "A nosotros nos gusta cocinar.", translation: "We like to cook." },
        ],
        commonMistakes: [
          {
            incorrect: "A m\u00ed me gusto la pizza.",
            correction: "A m\u00ed me gusta la pizza.",
            explanation: "Gustar agrees with the thing liked (la pizza = singular), not with the person. Use 'gusta' not 'gusto'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "food-debate",
        title: "Food Preferences Debate",
        situation: "You and a friend are deciding where to eat and comparing food preferences",
        agentRole: "You are Sof\u00eda. You love spicy food and hate fish. Discuss food preferences with the student and try to find a restaurant you both like.",
        userGoal: "Express your food preferences, find out Sof\u00eda's, and agree on a type of restaurant",
        targetPhrases: ["Me encanta...", "No me gusta...", "Prefiero...", "\u00bfTe gusta...?"],
        successCriteria: ["Expresses strong likes and dislikes", "Asks about Sof\u00eda's preferences", "Reaches a compromise"],
      },
    ],
  },
];

// ============================================
// Module 6: Shopping & Clothing
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "es-beginner-l16",
    slug: "clothing-colors",
    title: "Clothing & Colors",
    content: `# Clothing & Colors

## Clothing

- **camisa** - shirt
- **camiseta** - T-shirt
- **pantalones** - pants/trousers
- **falda** - skirt
- **vestido** - dress
- **zapatos** - shoes
- **chaqueta** - jacket
- **sombrero** - hat

## Colors

- **rojo/a** - red | **azul** - blue
- **verde** - green | **amarillo/a** - yellow
- **blanco/a** - white | **negro/a** - black
- **gris** - gray | **marr\u00f3n** - brown
- **rosa** - pink | **naranja** - orange

## Combining Them

- **la camisa azul** - the blue shirt
- **los zapatos negros** - the black shoes
- **un vestido rojo** - a red dress`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m6",
    moduleTitle: "Shopping & Clothing",
    order: 16,
    topicId: "es-beginner-clothing-colors",
    vocabulary: [
      {
        word: "camisa",
        translation: "shirt",
        pronunciation: "kah-MEE-sah",
        exampleSentence: "Llevo una camisa blanca.",
        exampleTranslation: "I'm wearing a white shirt.",
        partOfSpeech: "noun",
      },
      {
        word: "zapatos",
        translation: "shoes",
        pronunciation: "sah-PAH-tohss",
        exampleSentence: "Necesito zapatos nuevos.",
        exampleTranslation: "I need new shoes.",
        partOfSpeech: "noun",
      },
      {
        word: "rojo",
        translation: "red",
        pronunciation: "RROH-hoh",
        exampleSentence: "Me gusta el vestido rojo.",
        exampleTranslation: "I like the red dress.",
        partOfSpeech: "adjective",
      },
      {
        word: "azul",
        translation: "blue",
        pronunciation: "ah-SOOL",
        exampleSentence: "El cielo es azul.",
        exampleTranslation: "The sky is blue.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "Demonstrative Adjectives: este, ese, aquel",
        explanation: "Demonstratives indicate distance from the speaker:\n\n- **este/esta** (this) - near speaker\n- **ese/esa** (that) - near listener\n- **aquel/aquella** (that over there) - far from both\n\nPlural: estos/estas, esos/esas, aquellos/aquellas",
        examples: [
          { correct: "Esta camisa es bonita.", translation: "This shirt is pretty. (near me)" },
          { correct: "Ese vestido es caro.", translation: "That dress is expensive. (near you)" },
          { correct: "Aquellos zapatos son grandes.", translation: "Those shoes over there are big." },
        ],
        commonMistakes: [
          {
            incorrect: "Este falda es bonita.",
            correction: "Esta falda es bonita.",
            explanation: "'Falda' is feminine, so use 'esta' (not 'este').",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "clothing-store",
        title: "At a Clothing Store",
        situation: "You're shopping for clothes at a store in a Spanish-speaking city",
        agentRole: "You are a shop assistant. Help the customer find clothes in the right color and size.",
        userGoal: "Ask about specific clothing items, their colors, and sizes",
        targetPhrases: ["\u00bfTiene...?", "Esta camisa...", "En color...", "\u00bfCu\u00e1nto cuesta?"],
        successCriteria: ["Names clothing items", "Mentions colors", "Asks about availability or price"],
      },
    ],
  },
  {
    id: "es-beginner-l17",
    slug: "shopping-prices",
    title: "Shopping & Prices",
    content: `# Shopping & Prices

## Asking About Prices

- **\u00bfCu\u00e1nto cuesta?** - How much does it cost? (singular)
- **\u00bfCu\u00e1nto cuestan?** - How much do they cost? (plural)
- **Cuesta... euros/pesos.** - It costs... euros/pesos.
- **Es muy caro.** - It's very expensive.
- **Es barato.** - It's cheap.
- **\u00bfHay descuento?** - Is there a discount?

## Making Comparisons

- **m\u00e1s... que** - more... than
- **menos... que** - less... than
- **tan... como** - as... as
- **mejor** - better | **peor** - worse
- **m\u00e1s barato** - cheaper | **m\u00e1s caro** - more expensive

## Paying

- **\u00bfPuedo pagar con tarjeta?** - Can I pay by card?
- **En efectivo** - In cash
- **El cambio** - The change`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m6",
    moduleTitle: "Shopping & Clothing",
    order: 17,
    topicId: "es-beginner-shopping-prices",
    vocabulary: [
      {
        word: "cuesta",
        translation: "it costs",
        pronunciation: "KWEHS-tah",
        exampleSentence: "\u00bfCu\u00e1nto cuesta esto?",
        exampleTranslation: "How much does this cost?",
        partOfSpeech: "verb",
      },
      {
        word: "barato",
        translation: "cheap",
        pronunciation: "bah-RAH-toh",
        exampleSentence: "Esta camiseta es muy barata.",
        exampleTranslation: "This T-shirt is very cheap.",
        partOfSpeech: "adjective",
      },
      {
        word: "caro",
        translation: "expensive",
        pronunciation: "KAH-roh",
        exampleSentence: "Los zapatos son caros.",
        exampleTranslation: "The shoes are expensive.",
        partOfSpeech: "adjective",
      },
      {
        word: "tarjeta",
        translation: "card",
        pronunciation: "tahr-HEH-tah",
        exampleSentence: "\u00bfPuedo pagar con tarjeta?",
        exampleTranslation: "Can I pay by card?",
        partOfSpeech: "noun",
      },
      {
        word: "descuento",
        translation: "discount",
        pronunciation: "dehs-KWEHN-toh",
        exampleSentence: "\u00bfHay alg\u00fan descuento?",
        exampleTranslation: "Is there any discount?",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Comparatives: m\u00e1s/menos... que",
        explanation: "To compare two things, use **m\u00e1s + adjective + que** (more... than) or **menos + adjective + que** (less... than). Some adjectives have irregular comparatives: **mejor** (better), **peor** (worse), **mayor** (older), **menor** (younger).",
        examples: [
          { correct: "Esta camisa es m\u00e1s barata que esa.", translation: "This shirt is cheaper than that one." },
          { correct: "El vestido es menos bonito que la falda.", translation: "The dress is less pretty than the skirt." },
          { correct: "Este restaurante es mejor que aquel.", translation: "This restaurant is better than that one." },
        ],
        commonMistakes: [
          {
            incorrect: "Esta camisa es m\u00e1s buena que esa.",
            correction: "Esta camisa es mejor que esa.",
            explanation: "Use the irregular form 'mejor' (better), not 'm\u00e1s buena'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "market-haggling",
        title: "At the Market",
        situation: "You're at an outdoor market comparing prices of souvenirs",
        agentRole: "You are a market vendor selling handmade goods. Tell the customer prices and offer a small discount if they buy two.",
        userGoal: "Ask prices, compare items, and negotiate a deal",
        targetPhrases: ["\u00bfCu\u00e1nto cuesta?", "Es m\u00e1s caro que...", "\u00bfHay descuento?", "Quiero comprar..."],
        successCriteria: ["Asks about prices", "Makes a comparison", "Negotiates or decides to buy"],
      },
    ],
  },
  {
    id: "es-beginner-l18",
    slug: "money-transactions",
    title: "Money & Transactions",
    content: `# Money & Transactions

## Money Vocabulary

- **dinero** - money
- **efectivo** - cash
- **moneda** - coin
- **billete** - bill/banknote
- **precio** - price
- **gratis** - free (no cost)
- **propina** - tip

## Currencies

- **euro** (Spain) | **peso** (Mexico, Colombia, Argentina)
- **d\u00f3lar** (USA, Ecuador) | **sol** (Peru)

## Useful Transaction Phrases

- **\u00bfCu\u00e1nto es en total?** - How much is it in total?
- **\u00bfTiene cambio?** - Do you have change?
- **Gu\u00e1rdese el cambio.** - Keep the change.
- **Necesito un recibo.** - I need a receipt.
- **\u00bfAceptan tarjeta de cr\u00e9dito?** - Do you accept credit cards?`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m6",
    moduleTitle: "Shopping & Clothing",
    order: 18,
    topicId: "es-beginner-money-transactions",
    vocabulary: [
      {
        word: "dinero",
        translation: "money",
        pronunciation: "dee-NEH-roh",
        exampleSentence: "No tengo suficiente dinero.",
        exampleTranslation: "I don't have enough money.",
        partOfSpeech: "noun",
      },
      {
        word: "precio",
        translation: "price",
        pronunciation: "PREH-syoh",
        exampleSentence: "\u00bfCu\u00e1l es el precio?",
        exampleTranslation: "What is the price?",
        partOfSpeech: "noun",
      },
      {
        word: "gratis",
        translation: "free (no cost)",
        pronunciation: "GRAH-tees",
        exampleSentence: "La entrada es gratis.",
        exampleTranslation: "The entrance is free.",
        partOfSpeech: "adjective",
      },
      {
        word: "recibo",
        translation: "receipt",
        pronunciation: "reh-SEE-boh",
        exampleSentence: "Necesito un recibo, por favor.",
        exampleTranslation: "I need a receipt, please.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Numbers with Currency",
        explanation: "When stating prices, say the number followed by the currency. In most Spanish-speaking countries, a comma is used for decimals and a period for thousands (opposite of English).",
        examples: [
          { correct: "Cuesta veinte euros.", translation: "It costs twenty euros." },
          { correct: "Son cincuenta pesos.", translation: "That's fifty pesos." },
          { correct: "El total es 15,50 \u20ac.", translation: "The total is \u20ac15.50.", note: "Comma for decimals in Spanish" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "paying-bill",
        title: "Paying a Bill",
        situation: "You're at a restaurant finishing your meal and need to pay",
        agentRole: "You are a waiter. Bring the bill, explain the total, and process the payment.",
        userGoal: "Ask for the bill, understand the total, decide on payment method, and ask for a receipt",
        targetPhrases: ["La cuenta, por favor", "\u00bfCu\u00e1nto es?", "\u00bfPuedo pagar con tarjeta?", "Un recibo, por favor"],
        successCriteria: ["Asks for the bill", "Understands the total", "Chooses a payment method", "Requests receipt"],
      },
    ],
  },
];

// ============================================
// Module 7: Getting Around
// ============================================

const module7Lessons: LanguageLesson[] = [
  {
    id: "es-beginner-l19",
    slug: "directions-places",
    title: "Directions & City Places",
    content: `# Directions & City Places

## Asking for Directions

- **\u00bfD\u00f3nde est\u00e1...?** - Where is...?
- **\u00bfC\u00f3mo llego a...?** - How do I get to...?
- **Est\u00e1 cerca / lejos.** - It's near / far.

## Giving Directions

- **a la derecha** - to the right
- **a la izquierda** - to the left
- **todo recto / derecho** - straight ahead
- **al lado de** - next to
- **enfrente de** - in front of / across from
- **detr\u00e1s de** - behind
- **entre** - between

## City Places

- **la estaci\u00f3n** - the station
- **el hospital** - the hospital
- **la farmacia** - the pharmacy
- **el supermercado** - the supermarket
- **la plaza** - the square/plaza
- **el banco** - the bank
- **la iglesia** - the church
- **el parque** - the park`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m7",
    moduleTitle: "Getting Around",
    order: 19,
    topicId: "es-beginner-directions-places",
    vocabulary: [
      {
        word: "derecha",
        translation: "right",
        pronunciation: "deh-REH-chah",
        exampleSentence: "Gire a la derecha en la esquina.",
        exampleTranslation: "Turn right at the corner.",
        partOfSpeech: "noun",
      },
      {
        word: "izquierda",
        translation: "left",
        pronunciation: "ees-KYEHR-dah",
        exampleSentence: "La farmacia est\u00e1 a la izquierda.",
        exampleTranslation: "The pharmacy is on the left.",
        partOfSpeech: "noun",
      },
      {
        word: "cerca",
        translation: "near / close",
        pronunciation: "SEHR-kah",
        exampleSentence: "El parque est\u00e1 muy cerca.",
        exampleTranslation: "The park is very close.",
        partOfSpeech: "adverb",
      },
      {
        word: "calle",
        translation: "street",
        pronunciation: "KAH-yeh",
        exampleSentence: "Siga por esta calle.",
        exampleTranslation: "Continue on this street.",
        partOfSpeech: "noun",
      },
      {
        word: "esquina",
        translation: "corner",
        pronunciation: "ehs-KEE-nah",
        exampleSentence: "Est\u00e1 en la esquina.",
        exampleTranslation: "It's on the corner.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Prepositions of Place",
        explanation: "Spanish prepositions of place often use **de** after them: **al lado de** (next to), **enfrente de** (across from), **detr\u00e1s de** (behind), **cerca de** (near), **lejos de** (far from).",
        examples: [
          { correct: "El banco est\u00e1 al lado del supermercado.", translation: "The bank is next to the supermarket.", note: "de + el = del" },
          { correct: "La farmacia est\u00e1 enfrente de la plaza.", translation: "The pharmacy is across from the plaza." },
          { correct: "El parque est\u00e1 cerca de mi casa.", translation: "The park is near my house." },
        ],
        commonMistakes: [
          {
            incorrect: "al lado de el banco",
            correction: "al lado del banco",
            explanation: "'De' + 'el' always contracts to 'del'. This is mandatory, not optional.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "lost-tourist",
        title: "Lost Tourist",
        situation: "You're lost in a Spanish city and need to find your hotel",
        agentRole: "You are a friendly local. Give the student directions to their hotel using simple landmarks.",
        userGoal: "Ask for directions and confirm you understand them",
        targetPhrases: ["\u00bfD\u00f3nde est\u00e1...?", "A la derecha", "Todo recto", "\u00bfEst\u00e1 lejos?"],
        successCriteria: ["Asks for location", "Shows understanding of directions", "Confirms or asks for clarification"],
      },
    ],
  },
  {
    id: "es-beginner-l20",
    slug: "transport",
    title: "Transport & Getting Around",
    content: `# Transport & Getting Around

## Modes of Transport

- **el autob\u00fas** - the bus
- **el metro** - the subway
- **el tren** - the train
- **el taxi** - the taxi
- **el avi\u00f3n** - the airplane
- **el coche / carro** - the car (Spain / Latin America)
- **la bicicleta** - the bicycle
- **a pie** - on foot

## Useful Phrases

- **\u00bfD\u00f3nde est\u00e1 la parada de autob\u00fas?** - Where is the bus stop?
- **\u00bfCu\u00e1nto cuesta un billete?** - How much is a ticket?
- **Quiero ir a...** - I want to go to...
- **\u00bfA qu\u00e9 hora sale el tren?** - What time does the train leave?
- **\u00bfA qu\u00e9 hora llega?** - What time does it arrive?`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m7",
    moduleTitle: "Getting Around",
    order: 20,
    topicId: "es-beginner-transport",
    vocabulary: [
      {
        word: "autob\u00fas",
        translation: "bus",
        pronunciation: "ow-toh-BOOSS",
        exampleSentence: "El autob\u00fas llega en cinco minutos.",
        exampleTranslation: "The bus arrives in five minutes.",
        partOfSpeech: "noun",
      },
      {
        word: "tren",
        translation: "train",
        pronunciation: "trehn",
        exampleSentence: "Voy en tren a Barcelona.",
        exampleTranslation: "I go by train to Barcelona.",
        partOfSpeech: "noun",
      },
      {
        word: "billete",
        translation: "ticket",
        pronunciation: "bee-YEH-teh",
        exampleSentence: "Un billete de ida y vuelta, por favor.",
        exampleTranslation: "A round-trip ticket, please.",
        partOfSpeech: "noun",
      },
      {
        word: "parada",
        translation: "stop (bus/metro)",
        pronunciation: "pah-RAH-dah",
        exampleSentence: "La parada est\u00e1 en la esquina.",
        exampleTranslation: "The stop is on the corner.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Ir (to go) + a + Place / Infinitive",
        explanation: "The verb **ir** (to go) is irregular: **voy, vas, va, vamos, van**. Use **ir + a + place** for destinations or **ir + a + infinitive** for future plans.",
        examples: [
          { correct: "Voy a la estaci\u00f3n.", translation: "I'm going to the station." },
          { correct: "Vamos al parque.", translation: "We're going to the park.", note: "a + el = al" },
          { correct: "Voy a viajar ma\u00f1ana.", translation: "I'm going to travel tomorrow. (near future)" },
        ],
        commonMistakes: [
          {
            incorrect: "Yo vo a la tienda.",
            correction: "Yo voy a la tienda.",
            explanation: "The yo form of 'ir' is 'voy', not 'vo'. This is an irregular verb that must be memorized.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "train-station",
        title: "At the Train Station",
        situation: "You need to buy a train ticket to another city",
        agentRole: "You are a ticket agent at a Spanish train station. Help the customer buy a ticket and tell them the schedule.",
        userGoal: "Buy a train ticket, ask about departure time and price",
        targetPhrases: ["Quiero ir a...", "\u00bfCu\u00e1nto cuesta?", "\u00bfA qu\u00e9 hora sale?", "Un billete, por favor"],
        successCriteria: ["States destination", "Asks about price or schedule", "Completes the purchase"],
      },
    ],
  },
  {
    id: "es-beginner-l21",
    slug: "imperatives-basic",
    title: "Basic Commands & Instructions",
    content: `# Basic Commands & Instructions

## Common Imperative Forms (T\u00fa)

- **gira** - turn (girar)
- **sigue** - continue/follow (seguir)
- **ve** - go (ir)
- **mira** - look (mirar)
- **espera** - wait (esperar)
- **ven** - come (venir)
- **toma** - take (tomar)

## Polite Requests (Usted)

- **gire** - turn
- **siga** - continue
- **vaya** - go
- **mire** - look
- **espere** - wait

## Using Imperatives in Context

- **\u00a1Gira a la derecha!** - Turn right!
- **Sigue todo recto.** - Continue straight ahead.
- **Mira, est\u00e1 all\u00ed.** - Look, it's over there.
- **Espera un momento.** - Wait a moment.
- **Ven aqu\u00ed.** - Come here.`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m7",
    moduleTitle: "Getting Around",
    order: 21,
    topicId: "es-beginner-imperatives-basic",
    vocabulary: [
      {
        word: "gira",
        translation: "turn (command)",
        pronunciation: "HEE-rah",
        exampleSentence: "\u00a1Gira a la izquierda!",
        exampleTranslation: "Turn left!",
        partOfSpeech: "verb",
      },
      {
        word: "sigue",
        translation: "continue / follow (command)",
        pronunciation: "SEE-geh",
        exampleSentence: "Sigue todo recto.",
        exampleTranslation: "Continue straight ahead.",
        partOfSpeech: "verb",
      },
      {
        word: "espera",
        translation: "wait (command)",
        pronunciation: "ehs-PEH-rah",
        exampleSentence: "Espera un momento, por favor.",
        exampleTranslation: "Wait a moment, please.",
        partOfSpeech: "verb",
      },
      {
        word: "ven",
        translation: "come (command)",
        pronunciation: "vehn",
        exampleSentence: "\u00a1Ven aqu\u00ed r\u00e1pido!",
        exampleTranslation: "Come here quickly!",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Forming the T\u00fa Imperative",
        explanation: "For most verbs, the **t\u00fa** imperative is the same as the **\u00e9l/ella** present tense form.\n\n- **-AR:** habla, mira, gira, espera\n- **-ER:** come, bebe\n- **-IR:** escribe, vive\n\nSome common verbs are irregular: **ven** (venir), **ve** (ir), **di** (decir), **haz** (hacer), **pon** (poner).",
        examples: [
          { correct: "\u00a1Habla m\u00e1s despacio!", translation: "Speak more slowly!" },
          { correct: "Come tu fruta.", translation: "Eat your fruit." },
          { correct: "\u00a1Ven conmigo!", translation: "Come with me! (irregular)" },
        ],
        commonMistakes: [
          {
            incorrect: "\u00a1Vienes aqu\u00ed!",
            correction: "\u00a1Ven aqu\u00ed!",
            explanation: "Don't use the present indicative for commands. Use the imperative form: 'ven' (not 'vienes').",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "giving-directions",
        title: "Giving Directions to a Tourist",
        situation: "A tourist asks you for directions to the plaza",
        agentRole: "You are a lost tourist looking for the main plaza. Ask the student for help and follow their directions.",
        userGoal: "Give clear directions using imperative forms and prepositions of place",
        targetPhrases: ["Sigue todo recto", "Gira a la derecha", "Est\u00e1 al lado de...", "Mira, est\u00e1 all\u00ed"],
        successCriteria: ["Uses imperative forms", "Gives clear sequential directions", "Uses prepositions of place"],
      },
    ],
  },
];

// ============================================
// Module 8: Past Experiences
// ============================================

const module8Lessons: LanguageLesson[] = [
  {
    id: "es-beginner-l22",
    slug: "preterite-regular",
    title: "Preterite Tense: Regular Verbs",
    content: `# Preterite Tense: Regular Verbs

The preterite (pret\u00e9rito indefinido) describes completed past actions.

## -AR Verbs (hablar)

| Pronoun | Ending | Example |
|---|---|---|
| yo | -\u00e9 | habl\u00e9 |
| t\u00fa | -aste | hablaste |
| \u00e9l/ella/usted | -\u00f3 | habl\u00f3 |
| nosotros | -amos | hablamos |
| ellos/ustedes | -aron | hablaron |

## -ER/-IR Verbs (comer / vivir)

| Pronoun | Ending | Example |
|---|---|---|
| yo | -\u00ed | com\u00ed / viv\u00ed |
| t\u00fa | -iste | comiste / viviste |
| \u00e9l/ella/usted | -i\u00f3 | comi\u00f3 / vivi\u00f3 |
| nosotros | -imos | comimos / vivimos |
| ellos/ustedes | -ieron | comieron / vivieron |

## Time Markers for Past

- **ayer** - yesterday
- **anoche** - last night
- **la semana pasada** - last week
- **el a\u00f1o pasado** - last year
- **hace dos d\u00edas** - two days ago`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m8",
    moduleTitle: "Past Experiences",
    order: 22,
    topicId: "es-beginner-preterite-regular",
    vocabulary: [
      {
        word: "ayer",
        translation: "yesterday",
        pronunciation: "ah-YEHR",
        exampleSentence: "Ayer habl\u00e9 con mi madre.",
        exampleTranslation: "Yesterday I spoke with my mother.",
        partOfSpeech: "adverb",
      },
      {
        word: "anoche",
        translation: "last night",
        pronunciation: "ah-NOH-cheh",
        exampleSentence: "Anoche com\u00ed en un restaurante.",
        exampleTranslation: "Last night I ate at a restaurant.",
        partOfSpeech: "adverb",
      },
      {
        word: "la semana pasada",
        translation: "last week",
        pronunciation: "lah seh-MAH-nah pah-SAH-dah",
        exampleSentence: "La semana pasada viaj\u00e9 a Madrid.",
        exampleTranslation: "Last week I traveled to Madrid.",
        partOfSpeech: "phrase",
      },
      {
        word: "hace",
        translation: "ago",
        pronunciation: "AH-seh",
        exampleSentence: "Hace dos a\u00f1os viv\u00ed en M\u00e9xico.",
        exampleTranslation: "Two years ago I lived in Mexico.",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "Regular Preterite Conjugation",
        explanation: "To form the preterite, remove the infinitive ending and add preterite endings. Note: the **yo** and **\u00e9l/ella** forms carry accent marks (-\u00e9, -\u00f3 for -ar; -\u00ed, -i\u00f3 for -er/-ir). The **nosotros** form for -ar and -ir verbs is the same as present tense \u2014 context tells you which tense is meant.",
        examples: [
          { correct: "Habl\u00e9 con Juan ayer.", translation: "I spoke with Juan yesterday." },
          { correct: "Ella comi\u00f3 paella.", translation: "She ate paella." },
          { correct: "Vivimos en Barcelona dos a\u00f1os.", translation: "We lived in Barcelona for two years." },
        ],
        commonMistakes: [
          {
            incorrect: "Ayer yo hablo con mi amigo.",
            correction: "Ayer yo habl\u00e9 con mi amigo.",
            explanation: "Use preterite (habl\u00e9) for completed past actions, not present tense (hablo). The time marker 'ayer' signals past tense.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "weekend-recap",
        title: "What Did You Do This Weekend?",
        situation: "Monday morning, chatting with a friend about the weekend",
        agentRole: "You are Miguel, a friend asking about the student's weekend. Share what you did too.",
        userGoal: "Describe at least three activities you did over the weekend using the preterite",
        targetPhrases: ["Ayer...", "El fin de semana pasado...", "Com\u00ed...", "Habl\u00e9 con..."],
        successCriteria: ["Uses preterite tense correctly", "Mentions at least 3 past activities", "Uses time markers"],
      },
    ],
  },
  {
    id: "es-beginner-l23",
    slug: "preterite-irregular",
    title: "Preterite Tense: Key Irregular Verbs",
    content: `# Preterite Tense: Key Irregular Verbs

Some very common verbs have irregular preterite forms. These must be memorized.

## Ir (to go) & Ser (to be) \u2014 SAME forms!

| Pronoun | Form |
|---|---|
| yo | fui |
| t\u00fa | fuiste |
| \u00e9l/ella/usted | fue |
| nosotros | fuimos |
| ellos/ustedes | fueron |

Context tells you if it means "went" or "was."

## Hacer (to do/make)

| Pronoun | Form |
|---|---|
| yo | hice |
| t\u00fa | hiciste |
| \u00e9l/ella/usted | hizo |
| nosotros | hicimos |
| ellos/ustedes | hicieron |

## Tener (to have)

| Pronoun | Form |
|---|---|
| yo | tuve |
| t\u00fa | tuviste |
| \u00e9l/ella/usted | tuvo |
| nosotros | tuvimos |
| ellos/ustedes | tuvieron |`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m8",
    moduleTitle: "Past Experiences",
    order: 23,
    topicId: "es-beginner-preterite-irregular",
    vocabulary: [
      {
        word: "fui",
        translation: "I went / I was",
        pronunciation: "fwee",
        exampleSentence: "Fui al cine anoche.",
        exampleTranslation: "I went to the cinema last night.",
        partOfSpeech: "verb",
      },
      {
        word: "hice",
        translation: "I did / I made",
        pronunciation: "EE-seh",
        exampleSentence: "\u00bfQu\u00e9 hiciste ayer?",
        exampleTranslation: "What did you do yesterday?",
        partOfSpeech: "verb",
      },
      {
        word: "tuve",
        translation: "I had",
        pronunciation: "TOO-veh",
        exampleSentence: "Tuve un d\u00eda muy bueno.",
        exampleTranslation: "I had a very good day.",
        partOfSpeech: "verb",
      },
      {
        word: "fue",
        translation: "he/she went / it was",
        pronunciation: "fweh",
        exampleSentence: "La fiesta fue incre\u00edble.",
        exampleTranslation: "The party was incredible.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Ir and Ser Share the Same Preterite",
        explanation: "**Ir** (to go) and **ser** (to be) have identical preterite forms: fui, fuiste, fue, fuimos, fueron. Context always makes the meaning clear.",
        examples: [
          { correct: "Fui al supermercado.", translation: "I went to the supermarket. (ir)" },
          { correct: "Fue una buena pel\u00edcula.", translation: "It was a good movie. (ser)" },
          { correct: "Fuimos a la playa.", translation: "We went to the beach. (ir)" },
        ],
        commonMistakes: [
          {
            incorrect: "Yo ido al cine.",
            correction: "Yo fui al cine.",
            explanation: "The preterite of 'ir' is 'fui', not 'ido'. 'Ido' is the past participle, used with 'haber' (he ido).",
          },
        ],
      },
      {
        title: "Hacer in the Preterite",
        explanation: "**Hacer** has a stem change to **hic-** in the preterite. Note: the \u00e9l/ella form is **hizo** (c \u2192 z to keep the /s/ sound before -o).",
        examples: [
          { correct: "\u00bfQu\u00e9 hiciste el fin de semana?", translation: "What did you do on the weekend?" },
          { correct: "Hice la tarea.", translation: "I did the homework." },
          { correct: "Ella hizo una torta.", translation: "She made a cake." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vacation-story",
        title: "Telling a Vacation Story",
        situation: "A friend asks about your last vacation",
        agentRole: "You are Laura, a friend curious about the student's last trip. Ask follow-up questions about where they went and what they did.",
        userGoal: "Describe a past vacation using irregular preterite verbs (ir, hacer, tener)",
        targetPhrases: ["Fui a...", "Hice...", "Fue incre\u00edble", "Tuve..."],
        successCriteria: ["Uses at least 2 irregular preterite verbs", "Describes a past trip", "Answers follow-up questions"],
      },
    ],
  },
  {
    id: "es-beginner-l24",
    slug: "telling-stories",
    title: "Telling Stories About the Past",
    content: `# Telling Stories About the Past

Put it all together! Combine regular and irregular preterite to tell stories.

## Story Connectors

- **primero** - first
- **luego / despu\u00e9s** - then / afterwards
- **al final** - in the end
- **por eso** - that's why / because of that
- **pero** - but
- **y** - and
- **tambi\u00e9n** - also
- **porque** - because

## Example Story

Ayer fui al centro con mis amigos. Primero, comimos en un restaurante mexicano. Luego, caminamos por la plaza. Despu\u00e9s, fuimos al cine y vimos una pel\u00edcula espa\u00f1ola. Al final, tom\u00e9 un taxi a casa. \u00a1Fue un d\u00eda incre\u00edble!

## Asking About the Past

- **\u00bfQu\u00e9 hiciste?** - What did you do?
- **\u00bfAd\u00f3nde fuiste?** - Where did you go?
- **\u00bfC\u00f3mo fue?** - How was it?
- **\u00bfTe gust\u00f3?** - Did you like it?
- **\u00bfQu\u00e9 pas\u00f3?** - What happened?`,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-beginner-m8",
    moduleTitle: "Past Experiences",
    order: 24,
    topicId: "es-beginner-telling-stories",
    vocabulary: [
      {
        word: "primero",
        translation: "first",
        pronunciation: "pree-MEH-roh",
        exampleSentence: "Primero, desayun\u00e9 en casa.",
        exampleTranslation: "First, I had breakfast at home.",
        partOfSpeech: "adverb",
      },
      {
        word: "luego",
        translation: "then / later",
        pronunciation: "LWEH-goh",
        exampleSentence: "Luego fui al trabajo.",
        exampleTranslation: "Then I went to work.",
        partOfSpeech: "adverb",
      },
      {
        word: "despu\u00e9s",
        translation: "afterwards / after",
        pronunciation: "dehs-PWEHS",
        exampleSentence: "Despu\u00e9s comimos juntos.",
        exampleTranslation: "Afterwards we ate together.",
        partOfSpeech: "adverb",
      },
      {
        word: "porque",
        translation: "because",
        pronunciation: "POHR-keh",
        exampleSentence: "No fui porque estaba cansado.",
        exampleTranslation: "I didn't go because I was tired.",
        partOfSpeech: "conjunction",
      },
      {
        word: "incre\u00edble",
        translation: "incredible / amazing",
        pronunciation: "een-kreh-EE-bleh",
        exampleSentence: "\u00a1El viaje fue incre\u00edble!",
        exampleTranslation: "The trip was incredible!",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "Sequencing a Story with Connectors",
        explanation: "Use connectors to make your stories flow naturally. Start with **primero** (first), continue with **luego/despu\u00e9s** (then/afterwards), add reasons with **porque** (because), contrast with **pero** (but), and conclude with **al final** (in the end).",
        examples: [
          { correct: "Primero fui al mercado, luego cocin\u00e9.", translation: "First I went to the market, then I cooked." },
          { correct: "Fue divertido pero cansado.", translation: "It was fun but tiring." },
          { correct: "No sal\u00ed porque llovi\u00f3.", translation: "I didn't go out because it rained." },
        ],
        commonMistakes: [
          {
            incorrect: "Porque fui al cine, fue divertido.",
            correction: "Fui al cine. Fue divertido porque la pel\u00edcula fue buena.",
            explanation: "'Porque' means 'because' (gives a reason). Don't confuse it with '\u00bfpor qu\u00e9?' (why \u2014 asks a question, two words with accent).",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "storytelling-past",
        title: "Tell Me About Your Day",
        situation: "You're having dinner with a Spanish-speaking friend and recounting your day",
        agentRole: "You are Andr\u00e9s, a curious dinner companion. Ask the student to tell you about their day or a recent experience, and ask follow-up questions.",
        userGoal: "Tell a short story about your day or a recent experience using preterite, connectors, and time markers",
        targetPhrases: ["Primero...", "Luego...", "Fui a...", "Hice...", "Fue...", "Porque..."],
        successCriteria: ["Uses at least 3 preterite verbs", "Sequences events with connectors", "Responds to follow-up questions about the story"],
      },
    ],
    culturalNotes: [
      {
        title: "Storytelling Culture",
        content: "Spanish speakers tend to be expressive storytellers. Don't be afraid to use exclamations like **\u00a1Qu\u00e9 bien!** (How great!), **\u00a1No me digas!** (You don't say!), and **\u00a1Qu\u00e9 horror!** (How awful!) to react to stories. These reactions show you're engaged and make conversations more natural.",
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  {
    id: "es-beginner-m1",
    title: "Module 1: Greetings & Introductions",
    description: "Hola, adi\u00f3s, me llamo, ser (soy/eres/es), formal vs informal",
    order: 1,
    lessons: module1Lessons,
  },
  {
    id: "es-beginner-m2",
    title: "Module 2: Personal Information",
    description: "Nationality, age, numbers 1\u2013100, occupation, interrogatives",
    order: 2,
    lessons: module2Lessons,
  },
  {
    id: "es-beginner-m3",
    title: "Module 3: Family & Relationships",
    description: "Family vocabulary, possessives (mi/tu/su), tener, adjective agreement",
    order: 3,
    lessons: module3Lessons,
  },
  {
    id: "es-beginner-m4",
    title: "Module 4: Daily Routines",
    description: "Present tense -ar/-er/-ir verbs, reflexive verbs, time expressions",
    order: 4,
    lessons: module4Lessons,
  },
  {
    id: "es-beginner-m5",
    title: "Module 5: Food & Dining",
    description: "Gustar, restaurant ordering, likes/dislikes, tapas culture",
    order: 5,
    lessons: module5Lessons,
  },
  {
    id: "es-beginner-m6",
    title: "Module 6: Shopping & Clothing",
    description: "Demonstratives, comparatives, colors, money and prices",
    order: 6,
    lessons: module6Lessons,
  },
  {
    id: "es-beginner-m7",
    title: "Module 7: Getting Around",
    description: "Directions, transport, imperatives, city places, prepositions",
    order: 7,
    lessons: module7Lessons,
  },
  {
    id: "es-beginner-m8",
    title: "Module 8: Past Experiences",
    description: "Preterite tense regular + irregular (ir/ser/hacer), time markers, storytelling",
    order: 8,
    lessons: module8Lessons,
  },
];

export const spanishBeginnerCourse: LanguageCourse = {
  ...courseInfo,
  modules,
};

// Helper function to get all lessons
export function getSpanishBeginnerLessons() {
  return modules.flatMap((m) => m.lessons);
}

// Helper function to find a lesson by slug
export function findSpanishBeginnerLesson(slug: string) {
  return getSpanishBeginnerLessons().find((l) => l.slug === slug);
}
