// Module 3: Articles & Word Order
// No gender in English articles. Adjective BEFORE noun. Plural -s is simple.

import type { LanguageLesson } from "@/data/language-types";

export const articlesWordOrderLessons: LanguageLesson[] = [
  // ── Lesson 1: A / An / The — No Gender! ─────────────────────────────────
  {
    id: "en-es-3-1",
    slug: "a-an-the",
    title: "A / An / The — ¡Sin Género!",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m3",
    moduleTitle: "Module 3: Articles & Word Order",
    order: 1,
    topicId: "en-es-3-1-a-an-the",
    content: `# A / An / The — ¡Sin Género!

<!-- voice: Great news for Spanish speakers: English articles have NO gender! No el/la/los/las. Just 'a', 'an', and 'the'. But there are rules about when to use each one — and some tricky cases. -->

\`\`\`concept
title: English articles have NO gender
body: |
  Spanish: el libro, la mesa, los libros, las mesas — 4 forms, must match gender.
  English: **the** book, **the** table, **the** books, **the** tables — ONE word, always "the".

  Spanish: un libro, una mesa — 2 forms.
  English: **a** book, **a** table — ONE word (with one exception: "an" before vowel sounds).

  The freedom: you never need to memorize whether a word is masculine or feminine.
  The challenge: knowing WHEN to use a, an, the, or nothing at all.
\`\`\`

## A vs. An — The Vowel Sound Rule

**a** is used before words starting with a **consonant sound**.
**an** is used before words starting with a **vowel sound** (a, e, i, o, u).

| Use "a" (consonant sound) | Use "an" (vowel sound) |
|--------------------------|------------------------|
| **a** book | **an** apple |
| **a** car | **an** orange |
| **a** dog | **an** egg |
| **a** university (/juː/ — sounds like "you") | **an** hour (/aʊ/ — H is silent!) |
| **a** European | **an** honest person (silent H) |

**Key insight:** It's the **SOUND**, not the letter, that matters.
- "university" starts with a vowel letter (U) but sounds like "YOU" → use **a**
- "hour" starts with a consonant letter (H) but the H is silent → use **an**

## A / An vs. The — The Rules

\`\`\`steps
title: When to use A/An vs THE
steps:
  - step: "**A/An** = first mention, or one of many: 'I saw **a** dog.' (not a specific dog)"
  - step: "**The** = specific, already mentioned, or unique: 'The dog was barking.' (we know which one)"
  - step: "**The** = only one exists: **the** sun, **the** moon, **the** internet, **the** president"
  - step: "**No article** = general statements, abstract nouns, most proper nouns"
  - step: "Cities/countries: I live in **Spain** (no article). But: **the** United States, **the** Philippines"
\`\`\`

## When to Use NO Article

This surprises Spanish speakers — English often uses NO article where Spanish uses one:

| Spanish (with article) | English (no article) |
|------------------------|---------------------|
| Me gusta **el** café. | I like coffee. |
| **La** vida es bella. | Life is beautiful. |
| Estudio **la** medicina. | I study medicine. |
| **El** amor es importante. | Love is important. |
| Voy a **la** escuela. | I go to school. |
| Voy al **hospital**. | I go to the hospital. ← article here! |

\`\`\`compare
left:
  label: "❌ Spanish-influenced article errors"
  items:
    - "The life is beautiful."
    - "I like the coffee."
    - "She is a doctor. She works in a hospital. (second mention should be 'the')"
    - "I go to the school every day."
right:
  label: "✅ Correct English"
  items:
    - "Life is beautiful. (abstract noun — no article)"
    - "I like coffee. (general preference — no article)"
    - "She is a doctor. She works in the hospital. (specific hospital now)"
    - "I go to school every day. (as a general activity — no article)"
\`\`\`

\`\`\`quiz
questions:
  - q: "I need ___ umbrella. It's raining!"
    options: ["a", "an", "the", "—"]
    answer: 1
    explanation: "'Umbrella' starts with a vowel sound /ʌ/, so use 'an'. 'An umbrella' — first mention, not specific."
  - q: "___ moon is very bright tonight."
    options: ["A", "An", "The", "—"]
    answer: 2
    explanation: "There is only one moon — it's unique. Use 'the' for unique things: the sun, the moon, the sky."
  - q: "I love ___ music."
    options: ["a", "an", "the", "—"]
    answer: 3
    explanation: "General statements about things you like use NO article in English: I love music, I like coffee, He enjoys sport."
\`\`\`

\`\`\`takeaways
items:
  - "English articles have NO gender — 'the' works for all nouns regardless of gender"
  - "A vs An: use 'an' before VOWEL SOUNDS (not just vowel letters) — an hour, a university"
  - "A/An = first mention or non-specific. The = specific or unique."
  - "General statements about things you like/do usually take NO article: I love music"
  - "Most countries: no article (Spain, Mexico). Some: the (the USA, the UK)"
\`\`\``,
    vocabulary: [
      { word: "article", translation: "artículo", pronunciation: "/ˈɑːrtɪkəl/", exampleSentence: "Use 'an' before a vowel sound.", exampleTranslation: "Usa 'an' antes de un sonido vocálico.", partOfSpeech: "noun" },
      { word: "umbrella", translation: "paraguas", pronunciation: "/ʌmˈbrɛlə/", exampleSentence: "I need an umbrella.", exampleTranslation: "Necesito un paraguas.", partOfSpeech: "noun" },
      { word: "hour", translation: "hora", pronunciation: "/ˈaʊər/", exampleSentence: "I'll be there in an hour.", exampleTranslation: "Estaré allí en una hora.", partOfSpeech: "noun" },
      { word: "unique", translation: "único/a", pronunciation: "/juːˈniːk/", exampleSentence: "The sun is unique.", exampleTranslation: "El sol es único.", partOfSpeech: "adjective" },
      { word: "specific", translation: "específico/a", pronunciation: "/spɪˈsɪfɪk/", exampleSentence: "Use 'the' when something is specific.", exampleTranslation: "Usa 'the' cuando algo es específico.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "A / An / The / Zero Article",
        explanation: "English has three choices: 'a/an' (indefinite), 'the' (definite), or no article at all. Unlike Spanish, there is no gender agreement — 'the' works for all nouns.",
        examples: [
          { correct: "I saw a dog.", translation: "Vi un perro.", note: "First mention, non-specific" },
          { correct: "The dog was big.", translation: "El perro era grande.", note: "Specific — we know which dog" },
          { correct: "Dogs are friendly.", translation: "Los perros son amigables.", note: "General — no article" },
          { correct: "I love music.", translation: "Me encanta la música.", note: "Abstract noun — no article in English" },
        ],
        commonMistakes: [
          { incorrect: "The life is short.", correction: "Life is short.", explanation: "Abstract nouns as general statements don't use 'the' in English" },
          { incorrect: "I need a umbrella.", correction: "I need an umbrella.", explanation: "Use 'an' before vowel sounds. Umbrella starts with /ʌ/." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "en-es-3-1-v1",
        title: "Talking About Your City",
        situation: "Tell an English-speaking tourist about your city",
        agentRole: "You are an English-speaking tourist asking about the city. Ask 'Is there a...?' and 'What's the...?' questions. Gently correct missing or incorrect articles.",
        userGoal: "Describe places in your city using correct articles",
        targetPhrases: ["There's a...", "The best restaurant is...", "There are many..."],
        successCriteria: ["Uses 'the' for specific places", "Uses 'a/an' for non-specific mentions", "Avoids adding article to general statements"],
        hints: ["The capital city is...", "There's a famous museum called...", "People here love [food/sport] (no article for general)"],
      },
    ],
  },

  // ── Lesson 2: Adjectives Before Nouns + Plurals ──────────────────────────
  {
    id: "en-es-3-2",
    slug: "adjectives-and-plurals",
    title: "Adjetivos ANTES del Sustantivo + Plurales Simples",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m3",
    moduleTitle: "Module 3: Articles & Word Order",
    order: 2,
    topicId: "en-es-3-2-adjectives-and-plurals",
    content: `# Adjetivos ANTES del Sustantivo + Plurales Simples

<!-- voice: In Spanish, adjectives usually come AFTER the noun: 'casa roja'. In English, they always come BEFORE: 'red house'. And plurals? Much simpler than Spanish — just add -s, and adjectives don't change! -->

\`\`\`concept
title: Two key differences from Spanish
body: |
  **1. Adjective position — reversed from Spanish:**
  - Spanish: casa **roja** (house red) — adjective AFTER noun
  - English: **red** house — adjective BEFORE noun

  **2. Adjectives never change form:**
  - Spanish: libro rojo, libros rojos, casa roja, casas rojas (4 forms!)
  - English: **red** book, **red** books, **red** house, **red** houses (always "red")

  No gender agreement. No plural agreement. One adjective form fits all.
\`\`\`

## Adjective Position — Always Before the Noun

| Spanish | English |
|---------|---------|
| una casa grande | a **big** house |
| un hombre alto | a **tall** man |
| una película interesante | an **interesting** movie |
| los zapatos negros | the **black** shoes |
| una mujer inteligente | an **intelligent** woman |

**Multiple adjectives:** When you have more than one adjective, English has an order:
Size → Age → Color → Origin → Material → Noun

- "A big old red Italian leather bag" ← English order
- Not: "A red Italian old big leather bag"

For A1, just remember: adjectives always **before** the noun, and **size comes before color**:
- a **big red** apple ✅ (not: a red big apple)
- a **small black** cat ✅

## Plurals — Simple! Just Add -s (Usually)

Spanish plurals: -o → -os, -a → -as, -e → -es (gender-based)
English plurals: almost always just add **-s** or **-es**. No gender.

\`\`\`steps
title: English Plural Rules
steps:
  - step: "Most nouns: add **-s** → book → books, car → cars, house → houses"
  - step: "Ends in -s, -sh, -ch, -x, -z: add **-es** → bus → bus**es**, watch → watch**es**"
  - step: "Ends in consonant + y: change y → i, add **-es** → city → cit**ies**, baby → bab**ies**"
  - step: "Ends in vowel + y: just add **-s** → day → days, key → keys"
  - step: "Irregular plurals (memorize these!): man → **men**, woman → **women**, child → **children**, person → **people**, foot → **feet**, tooth → **teeth**"
\`\`\`

## Key Irregular Plurals

| Singular | Plural | Spanish equivalent |
|----------|--------|--------------------|
| man | **men** | hombre → hombres |
| woman | **women** | mujer → mujeres |
| child | **children** | niño → niños |
| person | **people** | persona → personas |
| foot | **feet** | pie → pies |
| tooth | **teeth** | diente → dientes |

## Adjectives Don't Change for Plurals

This is simpler than Spanish:

| Spanish (agreement required) | English (no change) |
|------------------------------|---------------------|
| una casa roja | a **red** house |
| unas casas rojas | some **red** houses |
| un coche rojo | a **red** car |
| unos coches rojos | some **red** cars |

\`\`\`compare
left:
  label: "❌ Spanish word order applied to English"
  items:
    - "a house red"
    - "a car expensive"
    - "the days sunnies (trying to agree adjective)"
    - "two womans (wrong plural)"
right:
  label: "✅ Correct English"
  items:
    - "a red house"
    - "an expensive car"
    - "the sunny days (adjectives never change)"
    - "two women (irregular plural)"
\`\`\`

\`\`\`quiz
questions:
  - q: "How do you say 'una película interesante' in English?"
    options: ["A movie interesting", "An interesting movie", "A interesting movie", "An movie interesting"]
    answer: 1
    explanation: "Adjectives come BEFORE the noun in English: an interesting movie. Use 'an' because 'interesting' starts with a vowel sound."
  - q: "What is the plural of 'child'?"
    options: ["childs", "childes", "children", "childre"]
    answer: 2
    explanation: "'Children' is an irregular plural — one of the most important to memorize. Man→men, woman→women, child→children."
  - q: "In English, how do adjectives change for plural nouns?"
    options: ["Add -s like in Spanish (rojos → reds)", "Add -es at the end", "They don't change at all", "They move after the noun"]
    answer: 2
    explanation: "English adjectives NEVER change form. 'Red house' and 'red houses' — same adjective. No gender or number agreement."
\`\`\`

\`\`\`takeaways
items:
  - "Adjectives come BEFORE the noun: 'red house' not 'house red'"
  - "Adjectives NEVER change for gender or number — one form for all"
  - "Most plurals: just add -s. Special: -es after s/sh/ch/x/z"
  - "Key irregulars: man→men, woman→women, child→children, person→people"
  - "Multiple adjectives: Size before Color — 'big red apple' not 'red big apple'"
\`\`\``,
    vocabulary: [
      { word: "interesting", translation: "interesante", pronunciation: "/ˈɪntrəstɪŋ/", exampleSentence: "That's an interesting idea.", exampleTranslation: "Esa es una idea interesante.", partOfSpeech: "adjective" },
      { word: "expensive", translation: "caro/a", pronunciation: "/ɪkˈspɛnsɪv/", exampleSentence: "This is a very expensive car.", exampleTranslation: "Este es un coche muy caro.", partOfSpeech: "adjective" },
      { word: "children", translation: "niños / hijos", pronunciation: "/ˈtʃɪldrən/", exampleSentence: "There are three children in the park.", exampleTranslation: "Hay tres niños en el parque.", partOfSpeech: "noun (plural)" },
      { word: "people", translation: "personas / gente", pronunciation: "/ˈpiːpəl/", exampleSentence: "Many people live in this city.", exampleTranslation: "Mucha gente vive en esta ciudad.", partOfSpeech: "noun (plural)" },
      { word: "beautiful", translation: "hermoso/a / precioso/a", pronunciation: "/ˈbjuːtɪfəl/", exampleSentence: "What a beautiful day!", exampleTranslation: "¡Qué día tan hermoso!", partOfSpeech: "adjective" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-3-2-v1",
        title: "Describing People and Things",
        situation: "Describe family members or objects to your English tutor",
        agentRole: "You are an English tutor asking a Spanish speaker to describe their family and home. Ask 'What does your [family member] look like?' and 'What's your home like?' Correct adjective placement errors.",
        userGoal: "Describe at least 3 people or objects using adjectives correctly placed before nouns",
        targetPhrases: ["He/She is a [adjective] person", "I have a [adjective] [noun]", "My [family member] has [adjective] [noun]"],
        successCriteria: ["Places adjectives before nouns consistently", "Doesn't try to agree adjectives with gender", "Uses irregular plurals correctly (people, children)"],
        hints: ["My mother is a kind woman.", "I have a big comfortable house.", "My children are funny and intelligent."],
      },
    ],
  },

  // ── Lesson 3: Possessives + Basic Sentence Structure ─────────────────────
  {
    id: "en-es-3-3",
    slug: "possessives-sentence-structure",
    title: "Posesivos + La Estructura S-V-O del Inglés",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m3",
    moduleTitle: "Module 3: Articles & Word Order",
    order: 3,
    topicId: "en-es-3-3-possessives-sentence-structure",
    content: `# Posesivos + La Estructura S-V-O del Inglés

<!-- voice: English word order is strict: Subject first, then Verb, then Object — SVO. Spanish can be more flexible. English possessives also work differently from Spanish — no agreement needed, and there's an apostrophe-s for ownership. -->

\`\`\`concept
title: English is SVO — always. No flexibility.
body: |
  Spanish word order is flexible:
  - "Juan compró el coche." ✅
  - "El coche lo compró Juan." ✅
  - "Compró Juan el coche." ✅ (less common but valid)

  English is strict SVO (Subject → Verb → Object):
  - "Juan bought the car." ✅
  - "The car bought Juan." ❌ (now Juan is the thing being bought!)
  - "Bought Juan the car." ❌ (only Yoda speaks like this)

  In English, **position determines meaning**. Change the order, change the meaning.
\`\`\`

## Possessive Adjectives — No Gender Agreement

| Spanish (must agree with noun) | English (never changes) |
|-------------------------------|------------------------|
| mi libro / mi casa | **my** book / **my** house |
| tu libro / tu casa | **your** book / **your** house |
| su libro / su casa | **his/her/its** book / **his/her/its** house |
| nuestro libro / nuestra casa | **our** book / **our** house |
| su libro / su casa (ellos) | **their** book / **their** house |

**Key point:** In English, the possessive matches the **owner**, not the thing owned.
- "Juan's car" → **his** car (because Juan is male)
- "María's car" → **her** car (because María is female)
- "The dog's toy" → **its** toy (because the dog is an it)

## The Apostrophe -'s for Ownership

Spanish uses "de" to show possession: el coche **de** Juan.
English also uses "of" sometimes, but more commonly uses **'s** (apostrophe s):

| Spanish (de + noun) | English ('s) |
|---------------------|--------------|
| el coche de Juan | **Juan's** car |
| la casa de mi madre | **my mother's** house |
| el nombre del perro | **the dog's** name |
| los libros de los estudiantes | **the students'** books |

**Rules:**
- Singular owner: add **'s** → María**'s** bag
- Plural ending in -s: add only **'** → the students**'** books
- Irregular plural: add **'s** → the children**'s** toys

## Basic Sentence Structure: SVO

\`\`\`steps
title: Building English sentences in order
steps:
  - step: "**S → V → O**: 'I (S) eat (V) breakfast (O) every morning.'"
  - step: "**Negatives stay SVO**: 'I (S) don't eat (V) breakfast (O).' — 'don't' stays with the verb"
  - step: "**Time goes at the END (or beginning)**: 'I eat breakfast every morning.' OR 'Every morning, I eat breakfast.'"
  - step: "**Adverbs of frequency go BEFORE the main verb**: 'I always eat breakfast.' / 'She never drinks coffee.'"
  - step: "**Never split SVO**: you can't put the object before the verb: 'Breakfast I eat' ❌"
\`\`\`

## Frequency Adverbs — Position Trap for Spanish Speakers

Spanish can put frequency adverbs in many positions.
English frequency adverbs go **before the main verb** (but **after** 'to be'):

| Frequency | Before main verb | After 'to be' |
|-----------|-----------------|---------------|
| **always** | I **always** eat lunch. | She **is always** happy. |
| **usually** | He **usually** works late. | They **are usually** tired. |
| **often** | We **often** go there. | It **is often** cold. |
| **sometimes** | She **sometimes** cooks. | I **am sometimes** late. |
| **never** | I **never** drink alcohol. | He **is never** rude. |

\`\`\`compare
left:
  label: "❌ Common word order errors"
  items:
    - "I go always to school. (adverb in wrong place)"
    - "The car of Juan is red. (use 's not 'de')"
    - "My book is green. My is here. (can't use possessive alone)"
    - "Coffee I like. (Object before Subject)"
right:
  label: "✅ Correct English"
  items:
    - "I always go to school."
    - "Juan's car is red."
    - "My book is green. Mine is here. (use 'mine' not 'my' alone)"
    - "I like coffee."
\`\`\`

\`\`\`quiz
questions:
  - q: "How do you say 'el coche de María' in English?"
    options: ["The car of María", "María's car", "The María car", "Car of María"]
    answer: 1
    explanation: "English uses apostrophe-s ('s) to show possession: María's car. The 'car of María' form exists but sounds formal; 's is much more natural."
  - q: "Where does 'always' go in 'She ___ drinks coffee'?"
    options: ["She always drinks coffee.", "She drinks always coffee.", "Always she drinks coffee.", "She drinks coffee always."]
    answer: 0
    explanation: "Frequency adverbs like 'always' go BEFORE the main verb: 'She always drinks'. Exception: after 'to be' — 'She is always tired'."
  - q: "What's wrong with 'Coffee I like very much'?"
    options: ["'Very much' is wrong", "The object 'coffee' can't go before the subject/verb", "'Like' should be 'likes'", "Nothing is wrong"]
    answer: 1
    explanation: "English is strict SVO: Subject-Verb-Object. You can't put the object first: 'I like coffee very much' is correct."
\`\`\`

\`\`\`takeaways
items:
  - "English is strictly SVO — Subject comes first, then Verb, then Object. Don't rearrange."
  - "Possessive adjectives match the OWNER, not the thing: his car, her bag (not the car's gender)"
  - "Use 's for possession: Juan's car (not 'the car of Juan' in everyday speech)"
  - "Frequency adverbs (always/usually/often/never) go BEFORE the main verb"
  - "Frequency adverbs go AFTER 'to be': She is always happy, They are never late"
\`\`\``,
    vocabulary: [
      { word: "always", translation: "siempre", pronunciation: "/ˈɔːlweɪz/", exampleSentence: "I always drink coffee in the morning.", exampleTranslation: "Siempre tomo café por la mañana.", partOfSpeech: "adverb" },
      { word: "usually", translation: "normalmente / generalmente", pronunciation: "/ˈjuːʒuəli/", exampleSentence: "She usually wakes up at 7.", exampleTranslation: "Normalmente se despierta a las 7.", partOfSpeech: "adverb" },
      { word: "never", translation: "nunca / jamás", pronunciation: "/ˈnɛvər/", exampleSentence: "I never eat meat.", exampleTranslation: "Nunca como carne.", partOfSpeech: "adverb" },
      { word: "sometimes", translation: "a veces", pronunciation: "/ˈsʌmtaɪmz/", exampleSentence: "We sometimes go to the cinema.", exampleTranslation: "A veces vamos al cine.", partOfSpeech: "adverb" },
      { word: "whose", translation: "de quién / cuyo", pronunciation: "/huːz/", exampleSentence: "Whose bag is this?", exampleTranslation: "¿De quién es esta bolsa?", partOfSpeech: "determiner/pronoun" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-3-3-v1",
        title: "Talking About Your Daily Routine",
        situation: "Tell your English tutor about a typical day in your life",
        agentRole: "You are an English tutor asking about daily routines. Ask 'What do you usually do in the morning?' 'Do you always eat breakfast?' Correct word order and possessive errors.",
        userGoal: "Describe your daily routine using frequency adverbs and possessives correctly",
        targetPhrases: ["I always...", "I usually...", "I sometimes...", "My [family member]'s...", "I never..."],
        successCriteria: ["Puts frequency adverbs before main verbs", "Uses 's for possession correctly", "Maintains SVO word order"],
        hints: ["I always wake up at 7.", "I usually have my mother's coffee recipe.", "I sometimes go to the gym, but I never go on Sundays."],
      },
    ],
  },
];
