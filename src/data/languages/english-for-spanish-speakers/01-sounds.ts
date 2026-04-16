// Module 1: English Sounds for Spanish Speakers
// The sounds Spanish does NOT have — front-loaded because mispronunciation
// habits form fast. Fix the five big problems first.

import type { LanguageLesson } from "@/data/language-types";

export const soundsLessons: LanguageLesson[] = [
  // ── Lesson 1: The 5 Big Sound Problems ──────────────────────────────────
  {
    id: "en-es-1-1",
    slug: "five-big-sounds",
    title: "Los 5 Sonidos Más Difíciles para Hispanohablantes",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m1",
    moduleTitle: "Module 1: English Sounds",
    order: 1,
    topicId: "en-es-1-1-five-big-sounds",
    content: `# Los 5 Sonidos Más Difíciles para Hispanohablantes

<!-- voice: Welcome to English for Spanish speakers! Let's start with pronunciation — the five sounds Spanish doesn't have. Getting these right from day one will make everything easier. -->

\`\`\`concept
title: La Buena Noticia (The Good News)
body: |
  Spanish and English share the Latin alphabet and many cognates (similar words).
  But English has **6 sounds** that Spanish simply doesn't have.
  Master these first — everything else will feel easier.

  The 5 biggest problems for Spanish speakers:
  1. **TH** — two sounds: /θ/ (think) and /ð/ (the)
  2. **H** — NOT silent! "hotel" = /hoʊˈtɛl/, not "otel"
  3. **V** — a real V sound, not B. "Very" ≠ "Bery"
  4. **W** — lips forward, not like Spanish "gu". "Water", "work", "want"
  5. **Schwa /ə/** — the most common English vowel. "soFa", "aBOUT", "THE"
\`\`\`

## 1. TH — The Sound That Doesn't Exist in Spanish

English has **two** TH sounds:

| Sound | Symbol | Example words | Mouth position |
|-------|--------|---------------|----------------|
| Hard TH | /θ/ | **th**ink, **th**ree, **th**ank | Tongue tip between teeth, push air |
| Soft TH | /ð/ | **th**e, **th**is, **th**at | Same position, but voiced (vocal cords vibrate) |

\`\`\`compare
left:
  label: "❌ Spanish speakers often say"
  items:
    - "Sink" instead of "Think"
    - "Tree" instead of "Three"
    - "De" instead of "The"
    - "Dis" instead of "This"
right:
  label: "✅ Correct English"
  items:
    - "Think" — tongue touches upper teeth
    - "Three" — /θ/ + /r/
    - "The" — voiced /ð/, very soft
    - "This" — voiced /ð/ + short /ɪ/
\`\`\`

**Practice drill:** Say slowly: *"The thirty-three thinkers thought a lot."*

## 2. H — No Es Silente

En español, la H es silenciosa: "hotel" se dice "otel".
En inglés, la H **siempre se pronuncia** (con algunas excepciones).

| Word | Spanish mistake | Correct English |
|------|----------------|-----------------|
| **H**ello | "ello" | /hɛˈloʊ/ — strong H |
| **H**ungry | "ungry" | /ˈhʌŋɡri/ — breathe out the H |
| **H**ouse | "ouse" | /haʊs/ |

**Exception:** "hour" and "honest" — these DO have a silent H. ("An hour", not "a hour")

## 3. V vs. B — No Son Lo Mismo

In Spanish, V and B are the same sound (labial fricative).
In English, they are **completely different**:

- **B** → lips press together, release: "**b**oy", "**b**ig", "**b**uy"
- **V** → top teeth touch bottom lip, vibrate: "**v**ery", "**v**ote", "**v**ideo"

\`\`\`steps
title: How to make the English V
steps:
  - step: "Put your top front teeth on your lower lip"
  - step: "Push air through — you should feel a buzzing vibration"
  - step: "Practice: very, village, voice, victory, visit"
  - step: "Minimal pairs: berry/very · best/vest · boat/vote"
\`\`\`

## 4. W — Like a Kiss, Not a G

English W sounds like you're about to whistle: lips round forward, then open.
Spanish doesn't have this — speakers often substitute "gu" or "b/v".

- **W**ater → /ˈwɔːtər/ (not "gwater" or "vater")
- **W**ork → /wɜːrk/
- **W**ant → /wɒnt/
- **W**oman → /ˈwʊmən/

## 5. Schwa /ə/ — The Most Common Vowel in English

This is the biggest hidden key to sounding natural.
The schwa is a relaxed, neutral vowel — like a mumbled "uh".

Almost every unstressed syllable in English becomes a schwa:

| Written | What Spanish speakers say | Natural English |
|---------|--------------------------|-----------------|
| about | "a-BOUT" (both stressed) | /əˈbaʊt/ — first vowel is schwa |
| the | "the" (like "teh") | /ðə/ — schwa (before consonants) |
| sofa | "SO-fa" | /ˈsoʊfə/ — final -a is schwa |
| today | "to-DAY" | /təˈdeɪ/ — first vowel is schwa |

\`\`\`quiz
questions:
  - q: "The English H is always silent, like in Spanish."
    options: ["True", "False"]
    answer: 1
    explanation: "False. English H is pronounced in most words: hello, happy, house. Only a few words like 'hour' and 'honest' have a silent H."
  - q: "Which word has the /θ/ sound (tongue between teeth, no voice)?"
    options: ["The", "This", "Think", "That"]
    answer: 2
    explanation: "Think has the voiceless /θ/. 'The', 'this', 'that' all have the voiced /ð/."
  - q: "How do you make the English V sound?"
    options: ["Press both lips together like B", "Put top teeth on lower lip and vibrate", "Round your lips forward", "Touch tongue to upper teeth"]
    answer: 1
    explanation: "V = top teeth on lower lip, vibrating. This is completely different from B (both lips) and W (lips rounded)."
\`\`\`

\`\`\`takeaways
items:
  - "TH has TWO sounds: /θ/ (think) voiceless and /ð/ (the) voiced — tongue between teeth for both"
  - "H is NOT silent in English: say hello, happy, house with a clear H"
  - "V and B are different sounds — feel the top teeth on your lower lip for V"
  - "W sounds like a rounded 'oo' moving to the vowel — not 'gu' or 'v'"
  - "Schwa /ə/ is the most common vowel — relax unstressed syllables"
\`\`\``,
    vocabulary: [
      { word: "think", translation: "pensar", pronunciation: "/θɪŋk/", exampleSentence: "I think this is correct.", exampleTranslation: "Creo que esto es correcto.", partOfSpeech: "verb" },
      { word: "the", translation: "el / la / los / las", pronunciation: "/ðə/ or /ðiː/", exampleSentence: "The book is on the table.", exampleTranslation: "El libro está sobre la mesa.", partOfSpeech: "article" },
      { word: "very", translation: "muy", pronunciation: "/ˈvɛri/", exampleSentence: "This is very good.", exampleTranslation: "Esto es muy bueno.", partOfSpeech: "adverb" },
      { word: "water", translation: "agua", pronunciation: "/ˈwɔːtər/", exampleSentence: "Can I have some water?", exampleTranslation: "¿Me puede dar agua?", partOfSpeech: "noun" },
      { word: "hello", translation: "hola", pronunciation: "/hɛˈloʊ/", exampleSentence: "Hello! My name is Carlos.", exampleTranslation: "¡Hola! Me llamo Carlos.", partOfSpeech: "interjection" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-1-1-v1",
        title: "Pronunciation Drills",
        situation: "Practice the five difficult sounds with your English tutor",
        agentRole: "You are a friendly English pronunciation coach. The student is a Spanish speaker. Focus on TH, H, V, W, and schwa. Give encouragement and gentle corrections.",
        userGoal: "Say 5 target words correctly: think, hello, very, water, about",
        targetPhrases: ["think", "hello", "very", "water", "about", "the", "three"],
        successCriteria: ["Pronounces TH without substituting S/T/D", "Sounds the H in hello", "Differentiates V from B"],
        hints: ["Put your tongue between your teeth for TH", "For H, breathe out before the vowel", "For V, feel your top teeth on your lower lip"],
      },
    ],
  },

  // ── Lesson 2: Word Stress — English's Hidden Rhythm ─────────────────────
  {
    id: "en-es-1-2",
    slug: "word-stress",
    title: "El Acento de Palabras: El Ritmo del Inglés",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m1",
    moduleTitle: "Module 1: English Sounds",
    order: 2,
    topicId: "en-es-1-2-word-stress",
    content: `# El Acento de Palabras: El Ritmo del Inglés

<!-- voice: One of the biggest reasons Spanish speakers sound foreign in English isn't individual sounds — it's word stress. English is stress-timed, Spanish is syllable-timed. This changes everything about the rhythm. -->

\`\`\`concept
title: Syllable-Timed vs. Stress-Timed
body: |
  **Spanish** is syllable-timed: every syllable takes about the same time.
  "ca-sa-blan-ca" — four equal beats.

  **English** is stress-timed: stressed syllables are louder, longer, and higher.
  Unstressed syllables are SQUASHED — often reduced to schwa /ə/.

  This is why English sounds fast and "swallowed" to Spanish ears.
  And why Spanish-accented English sounds "choppy" to English ears.
\`\`\`

## How Stress Changes Meaning

In English, stress can change the **meaning** of the same word:

| Word | Stress | Meaning | Example |
|------|--------|---------|---------|
| **RE**cord | First syllable | Noun: a vinyl record | "Play that record." |
| re**CORD** | Second syllable | Verb: to record | "Can you record this?" |
| **PRE**sent | First syllable | Noun: a gift / Adj: here | "Here's your present." |
| pre**SENT** | Second syllable | Verb: to present | "I will present my work." |
| **CON**test | First syllable | Noun: a competition | "Enter the contest." |
| con**TEST** | Second syllable | Verb: to dispute | "I contest this result." |

## Rules for Finding Stress

English stress isn't random — there are patterns:

\`\`\`steps
title: Stress Rules (Most Common)
steps:
  - step: "Two-syllable nouns → stress the FIRST syllable: TAble, WINdow, CLASSroom, TEAcher"
  - step: "Two-syllable verbs → stress the SECOND syllable: deCIDE, reLAX, forGET, beGIN"
  - step: "-tion words → stress the syllable BEFORE -tion: inforMAtion, commuNIcation, educAtion"
  - step: "-ic words → stress the syllable BEFORE -ic: toMAto → toma TIC? No. acaDEmic, graMMATic"
  - step: "When in doubt, listen and copy. Use a dictionary — stress is marked with ˈ before the stressed syllable"
\`\`\`

## Cognates: Words That Look the Same, Stress Differently

Spanish and English share thousands of cognates. But the **stress is often different**:

| Spanish (syllable stress) | English (different stress) |
|--------------------------|---------------------------|
| hos-PI-tal | HOS-pi-tal |
| u-ni-ver-si-DAD | u-NI-ver-si-ty |
| te-le-FO-no | te-LE-phone |
| a-vi-ON | AIR-plane (different word!) |
| pro-BLE-ma | PROB-lem |

\`\`\`compare
left:
  label: "❌ Spanish rhythm applied to English"
  items:
    - "to-mor-row (three equal beats)"
    - "yes-ter-day (three equal beats)"
    - "in-ter-est-ing (four equal beats)"
right:
  label: "✅ English stress-timed rhythm"
  items:
    - "to-MOR-row (short-LONG-short)"
    - "YES-ter-day (LONG-short-short)"
    - "IN-trest-ing (only 3 syllables in natural speech!)"
\`\`\`

## The Most Common English Words — Stress Patterns

| Word | Stress | IPA |
|------|--------|-----|
| because | be**CAUSE** | /bɪˈkɔːz/ |
| today | to**DAY** | /təˈdeɪ/ |
| tomorrow | to**MOR**row | /təˈmɒroʊ/ |
| understand | un·der·**STAND** | /ˌʌndərˈstænd/ |
| important | im**POR**tant | /ɪmˈpɔːrtənt/ |
| beautiful | **BEAU**ti·ful | /ˈbjuːtɪfəl/ |

\`\`\`quiz
questions:
  - q: "Spanish is _____-timed and English is _____-timed."
    options: ["stress / syllable", "syllable / stress", "both stress-timed", "both syllable-timed"]
    answer: 1
    explanation: "Spanish gives equal time to each syllable. English stresses some syllables and squashes others — this creates the characteristic English rhythm."
  - q: "In the word 'information', which syllable is stressed?"
    options: ["in-", "-for-", "-ma-", "-tion"]
    answer: 2
    explanation: "in-for-MA-tion — the syllable before -tion is stressed. This is a reliable rule for -tion words."
  - q: "The word 'record' as a NOUN has stress on..."
    options: ["The second syllable: re-CORD", "The first syllable: RE-cord", "Both syllables equally", "Neither syllable"]
    answer: 1
    explanation: "RE-cord (noun) vs re-CORD (verb). Two-syllable nouns usually stress the first syllable."
\`\`\`

\`\`\`takeaways
items:
  - "English is STRESS-TIMED: some syllables are long and loud, others are short and weak"
  - "Spanish is SYLLABLE-TIMED: equal beats. This is why you must change your rhythm in English"
  - "Stress can change word meaning: REcord (noun) vs reCORD (verb)"
  - "Unstressed syllables become schwa /ə/ — this is normal and correct, not lazy"
  - "Cognates usually have different stress than their Spanish equivalents"
\`\`\``,
    vocabulary: [
      { word: "tomorrow", translation: "mañana", pronunciation: "/təˈmɒroʊ/", exampleSentence: "See you tomorrow!", exampleTranslation: "¡Hasta mañana!", partOfSpeech: "adverb" },
      { word: "important", translation: "importante", pronunciation: "/ɪmˈpɔːrtənt/", exampleSentence: "This is very important.", exampleTranslation: "Esto es muy importante.", partOfSpeech: "adjective" },
      { word: "understand", translation: "entender / comprender", pronunciation: "/ˌʌndərˈstænd/", exampleSentence: "I don't understand.", exampleTranslation: "No entiendo.", partOfSpeech: "verb" },
      { word: "beautiful", translation: "hermoso / bonito", pronunciation: "/ˈbjuːtɪfəl/", exampleSentence: "What a beautiful day!", exampleTranslation: "¡Qué día tan hermoso!", partOfSpeech: "adjective" },
      { word: "because", translation: "porque", pronunciation: "/bɪˈkɔːz/", exampleSentence: "I'm tired because I worked a lot.", exampleTranslation: "Estoy cansado porque trabajé mucho.", partOfSpeech: "conjunction" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-1-2-v1",
        title: "Stress Practice",
        situation: "Read sentences aloud with correct stress while your tutor listens",
        agentRole: "You are an English pronunciation coach for a Spanish speaker. Listen to their stress patterns. If they give equal stress to every syllable (Spanish rhythm), gently correct them. Model the English rhythm: loud-soft-soft.",
        userGoal: "Say 3 sentences with correct English stress patterns",
        targetPhrases: ["I understand", "That's important", "See you tomorrow", "Because I want to learn English"],
        successCriteria: ["Applies stress-timed rhythm (not equal syllable beats)", "Reduces unstressed syllables", "Sounds natural rather than mechanical"],
        hints: ["Try making the stressed syllable LONGER and LOUDER", "Almost swallow the unstressed syllables", "Think of English as having a drumbeat on stressed syllables"],
      },
    ],
  },

  // ── Lesson 3: English Vowels + First Phrases ────────────────────────────
  {
    id: "en-es-1-3",
    slug: "vowels-and-first-phrases",
    title: "Las Vocales del Inglés + Primeras Frases",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m1",
    moduleTitle: "Module 1: English Sounds",
    order: 3,
    topicId: "en-es-1-3-vowels-and-first-phrases",
    content: `# Las Vocales del Inglés + Primeras Frases

<!-- voice: Spanish has 5 pure vowels. English has about 12-15 vowel sounds! The same written letter can make many different sounds. Today we'll tackle the trickiest differences and learn your first real English phrases. -->

\`\`\`concept
title: Spanish has 5 vowels. English has 12-15.
body: |
  Spanish: a, e, i, o, u — always pronounced the same way. Reliable and consistent.

  English: the same 5 letters, but each can make MULTIPLE sounds depending on context.
  Plus, spelling doesn't always match pronunciation.

  Key rule: **In English, you must memorize pronunciation separately from spelling.**
  Use a dictionary with IPA symbols, or listen and copy.
\`\`\`

## The Most Confusing English Vowels for Spanish Speakers

### Short /ɪ/ vs Long /iː/

Spanish only has one "i" sound (like /iː/). English has both:

| Short /ɪ/ | Long /iː/ |
|-----------|-----------|
| s**i**t | s**ea**t |
| h**i**t | h**ea**t |
| l**i**ve (verb) | l**ea**ve |
| f**i**ll | f**ee**l |
| wh**i**p | wh**ee**p? (not a word — just for comparison!) |

**Practice:** Say "sit" and "seat" — your mouth shape changes.

### Short /æ/ — The "cat" vowel

Spanish doesn't have this sound. Your mouth should open wide, like you're at the dentist:

- **cat** /kæt/, **man** /mæn/, **bad** /bæd/, **hat** /hæt/, **can** /kæn/

\`\`\`compare
left:
  label: "Common Spanish errors with English vowels"
  items:
    - "beach → 'bitch' (wrong vowel length!)"
    - "sheet → wrong word (be careful!)"
    - "fool → 'full' (different vowel)"
    - "cat → 'cut' (wrong vowel)"
right:
  label: "Correct pronunciation"
  items:
    - "beach = /biːtʃ/ — long, sustained /iː/"
    - "sheet = /ʃiːt/ — also long /iː/, be careful with stress"
    - "fool = /fuːl/ (long), full = /fʊl/ (short)"
    - "cat = /kæt/ — open wide, tongue flat"
\`\`\`

## Your First English Phrases

These are the highest-frequency phrases you'll use every day:

\`\`\`steps
title: 10 Essential Survival Phrases
steps:
  - step: "**Hello / Hi** — Hola. 'Hi' is more casual, 'Hello' is neutral."
  - step: "**My name is ___** — Me llamo ___. (NOT: 'I am called ___' — that's too Spanish!)"
  - step: "**Nice to meet you** — Mucho gusto / Encantado. Standard introduction response."
  - step: "**Please** — Por favor. Always add this to requests."
  - step: "**Thank you / Thanks** — Gracias. 'Thank you' is more formal."
  - step: "**You're welcome** — De nada. Response to thank you."
  - step: "**Sorry / Excuse me** — Perdón. 'Sorry' = apology. 'Excuse me' = to get attention or pass."
  - step: "**I don't understand** — No entiendo. Critical phrase! Use it freely."
  - step: "**Can you repeat that, please?** — ¿Puede repetir eso, por favor?"
  - step: "**Do you speak Spanish?** — ¿Habla español? (Your emergency exit!)"
\`\`\`

## Two Things Spanish Speakers Forget

**1. "I" is always capitalized**
In English, the pronoun "I" (yo) is ALWAYS a capital letter, even in the middle of a sentence.
- ✅ "Yesterday **I** went to the store."
- ❌ "Yesterday **i** went to the store."

**2. Subjects are mandatory**
In Spanish, you can drop the subject pronoun: "Tengo hambre" (not "Yo tengo hambre").
In English, **you MUST include the subject**:
- ❌ "Am hungry." (Spanish-style drop)
- ✅ "**I** am hungry."
- ❌ "Is raining."
- ✅ "**It** is raining." (English needs "It" even though "it" means nothing!)

\`\`\`quiz
questions:
  - q: "Which sentence is correct English?"
    options: ["Am happy today.", "I am happy today.", "Happy today I am.", "Today happy am I."]
    answer: 1
    explanation: "English ALWAYS requires the subject pronoun. You can't drop 'I' like in Spanish. 'I am happy today' is correct."
  - q: "The word 'sit' has which vowel sound?"
    options: ["Long /iː/ like 'see'", "Short /ɪ/ like in 'bit'", "The /æ/ sound like 'cat'", "The schwa /ə/"]
    answer: 1
    explanation: "Sit has the short /ɪ/ sound. This is different from 'seat' which has the long /iː/. Sit/seat is a classic minimal pair for Spanish speakers."
  - q: "In English, when is 'it' used as a subject?"
    options: ["Only for animals", "Only for objects", "For weather, time, and situations with no real subject", "Never — you can drop it"]
    answer: 2
    explanation: "English uses 'It' for weather (it's raining), time (it's 3 o'clock), and impersonal sentences. You cannot drop it: 'Is raining' is wrong in English."
\`\`\`

\`\`\`takeaways
items:
  - "English has 12-15 vowel sounds — memorize pronunciation separately from spelling"
  - "Short /ɪ/ (sit) vs Long /iː/ (seat) — mouth shape and duration both change"
  - "The /æ/ vowel (cat, man, bad) doesn't exist in Spanish — open your mouth wide"
  - "NEVER drop subject pronouns in English: 'I am', 'It is raining', 'She works'"
  - "The pronoun 'I' is ALWAYS capitalized in written English"
\`\`\``,
    vocabulary: [
      { word: "nice to meet you", translation: "mucho gusto / encantado", pronunciation: "/naɪs tə miːt juː/", exampleSentence: "Hello! Nice to meet you.", exampleTranslation: "¡Hola! Mucho gusto.", partOfSpeech: "phrase" },
      { word: "excuse me", translation: "perdón / con permiso", pronunciation: "/ɪkˈskjuːz miː/", exampleSentence: "Excuse me, where is the bathroom?", exampleTranslation: "Perdón, ¿dónde está el baño?", partOfSpeech: "phrase" },
      { word: "please", translation: "por favor", pronunciation: "/pliːz/", exampleSentence: "Can I have water, please?", exampleTranslation: "¿Me puede dar agua, por favor?", partOfSpeech: "adverb" },
      { word: "sorry", translation: "lo siento / perdón", pronunciation: "/ˈsɒri/", exampleSentence: "Sorry, I don't understand.", exampleTranslation: "Perdón, no entiendo.", partOfSpeech: "interjection" },
      { word: "you're welcome", translation: "de nada", pronunciation: "/jɔːr ˈwɛlkəm/", exampleSentence: "— Thank you! — You're welcome!", exampleTranslation: "— ¡Gracias! — ¡De nada!", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Mandatory Subject Pronouns (Pro-Drop doesn't work in English)",
        explanation: "Spanish allows subject pronoun dropping (pro-drop). English **requires** the subject in every sentence. This is one of the most common Spanish-speaker errors in English.",
        examples: [
          { correct: "I am hungry.", translation: "Tengo hambre.", note: "Must say 'I' — cannot drop it" },
          { correct: "It is raining.", translation: "Está lloviendo.", note: "English needs 'It' even though 'it' has no real meaning" },
          { correct: "She works here.", translation: "Trabaja aquí.", note: "Must say 'She'" },
        ],
        commonMistakes: [
          { incorrect: "Am hungry.", correction: "I am hungry.", explanation: "You must include the subject pronoun 'I'" },
          { incorrect: "Is raining.", correction: "It is raining.", explanation: "Weather sentences need 'It' as the subject" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "en-es-1-3-v1",
        title: "First Meeting in English",
        situation: "You meet an English-speaking colleague for the first time at work",
        agentRole: "You are an English-speaking colleague meeting a Spanish speaker for the first time. Speak clearly and naturally. If they drop subject pronouns or mispronounce TH/H/V, gently model the correct version.",
        userGoal: "Introduce yourself, say where you're from, and respond to basic questions",
        targetPhrases: ["Hello, my name is...", "Nice to meet you", "I am from...", "I don't understand, can you repeat that?"],
        successCriteria: ["Uses 'I' as subject (doesn't drop it)", "Says 'hello' with audible H", "Responds naturally to 'nice to meet you'"],
        hints: ["Start with: Hello, my name is [your name]", "When asked where you're from, say: I am from [country]", "If stuck: I don't understand, can you repeat that please?"],
      },
    ],
  },
];
