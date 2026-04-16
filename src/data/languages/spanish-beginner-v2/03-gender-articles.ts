import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────────────
// MODULE 3: Gender & Articles (3 lessons)
// Spanish gender is simpler than French — most -o = masculine, -a = feminine.
// But the exceptions and article system need systematic treatment.
// ─────────────────────────────────────────────────────────────────

export const genderArticlesLessons: LanguageLesson[] = [
  // ── LESSON 8 ── Grammatical Gender ──────────────────────────
  {
    id: "es-l8",
    slug: "grammatical-gender",
    title: "Grammatical Gender — Every Noun Has a Side",
    content: `# Grammatical Gender — Every Noun Has a Side

Every Spanish noun is either **masculine** or **feminine**. Not because objects have biological sex — it's a grammatical category. The gender of a noun affects the articles (el/la) and adjectives that go with it. Here's the good news: Spanish gender has strong patterns that cover about 85% of nouns.

\`\`\`concept
{ "title": "Spanish Gender Is More Predictable Than French", "variant": "success", "content": "French gender is notoriously unpredictable — you largely have to memorize each word. Spanish has clearer patterns: most nouns ending in -o are masculine, most ending in -a are feminine. Learn the patterns here and you'll get gender right most of the time without memorizing each word." }
\`\`\`

## The Main Patterns

**Pattern 1 — -o → masculine (very reliable):**
- el libro (book), el perro (dog), el número (number), el banco (bank), el tiempo (weather/time)

**Pattern 2 — -a → feminine (very reliable):**
- la casa (house), la mesa (table), la silla (chair), la persona (person), la semana (week)

**Pattern 3 — -ción / -sión → always feminine:**
- la nación, la situación, la televisión, la lección, la comunicación

**Pattern 4 — -dad / -tad / -tud → always feminine:**
- la ciudad (city), la libertad (freedom), la universidad (university), la actitud

**Pattern 5 — -or, -ón → usually masculine:**
- el color, el actor, el calor, el dolor (pain), el camión (truck), el avión (airplane)

## The Tricky Exceptions — Memorize These

Some -a words are masculine (because they come from Greek):

| Word | Meaning | Gender |
|------|---------|--------|
| **el problema** | problem | masculine |
| **el programa** | program/show | masculine |
| **el sistema** | system | masculine |
| **el mapa** | map | masculine |
| **el día** | day | masculine |
| **el clima** | climate | masculine |

And some feminine words that look masculine:
- **la mano** (hand) — ends in -o but feminine!
- **la foto** (photo, short for fotografía) — feminine

\`\`\`compare
{ "title": "Spanish Gender vs French Gender — How Hard Is It?", "left": { "label": "Spanish gender (easier)", "items": ["-o → masculine (book, dog, number)", "-a → feminine (house, table, week)", "-ción/-sión → always feminine", "Exceptions are few and notable", "About 85% of words follow clear patterns"] }, "right": { "label": "French gender (harder)", "items": ["Much less predictable from endings", "Le/la must often be memorized per word", "'la mer' (sea) feminine, 'le soleil' (sun) masculine", "Many exceptions even to the few patterns", "French learners must memorize gender of every word"] } }
\`\`\`

\`\`\`quiz
{ "question": "What gender is 'el problema' (problem)?", "options": ["Feminine — it ends in -a", "Masculine — despite ending in -a, it comes from Greek and is masculine", "It varies depending on context", "Neutral — Spanish has a neutral gender"], "answer": 1, "explanation": "El problema is masculine despite ending in -a. This is because it comes from Greek (problema). The same applies to el programa, el sistema, el mapa, el clima, el día. These Greek-origin -ma words are all masculine. Spanish has no neutral gender — every noun is masculine or feminine." }
\`\`\`

\`\`\`takeaways
{ "points": ["Every Spanish noun is masculine or feminine — no neutral", "-o ending → almost always masculine: el libro, el banco, el perro", "-a ending → almost always feminine: la casa, la mesa, la silla", "-ción/-sión/-dad/-tad → always feminine: la nación, la ciudad", "Greek-origin -ma words are masculine despite -a ending: el problema, el sistema, el programa, el día", "la mano and la foto are feminine exceptions to the -o rule — memorize these"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m3",
    moduleTitle: "Gender & Articles",
    order: 1,
    topicId: "es-m3-l8-gender",
    vocabulary: [
      { word: "el libro", translation: "the book (m)", pronunciation: "ehl LEE-broh", exampleSentence: "El libro está en la mesa.", exampleTranslation: "The book is on the table.", partOfSpeech: "noun" },
      { word: "la mesa", translation: "the table (f)", pronunciation: "lah MEH-sah", exampleSentence: "La mesa es de madera.", exampleTranslation: "The table is made of wood.", partOfSpeech: "noun" },
      { word: "el problema", translation: "the problem (m — exception)", pronunciation: "ehl proh-BLEH-mah", exampleSentence: "No hay problema.", exampleTranslation: "There's no problem.", partOfSpeech: "noun" },
      { word: "la ciudad", translation: "the city (f — -dad pattern)", pronunciation: "lah syoo-DAHD", exampleSentence: "Es una ciudad muy grande.", exampleTranslation: "It's a very big city.", partOfSpeech: "noun" },
      { word: "la lección", translation: "the lesson (f — -ción pattern)", pronunciation: "lah lehk-SYOHN", exampleSentence: "La lección de hoy es importante.", exampleTranslation: "Today's lesson is important.", partOfSpeech: "noun" },
      { word: "la mano", translation: "the hand (f — exception)", pronunciation: "lah MAH-noh", exampleSentence: "Levanta la mano si tienes preguntas.", exampleTranslation: "Raise your hand if you have questions.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Gender Patterns in Spanish",
        explanation: "Spanish nouns are masculine or feminine. The ending usually signals the gender: -o = masculine, -a = feminine, -ción/-sión/-dad = feminine. Greek-origin -ma words are masculine exceptions.",
        examples: [
          { correct: "el libro (m)", translation: "the book", note: "-o → masculine" },
          { correct: "la nación (f)", translation: "the nation", note: "-ción → always feminine" },
          { correct: "el sistema (m)", translation: "the system", note: "-ma from Greek → masculine exception" },
        ],
        commonMistakes: [
          { incorrect: "la problema", correction: "el problema", explanation: "El problema is masculine despite ending in -a. Greek-origin -ma words (problema, sistema, programa, mapa, clima, día) are all masculine." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m3-l8-vs1",
        title: "Describing Your Home",
        situation: "A Spanish-speaking friend asks about your home.",
        agentRole: "You are a friendly Spanish speaker. Ask the student to describe their home — the rooms, furniture, objects. Gently correct any gender errors.",
        userGoal: "Describe your home using nouns with their correct articles (el/la). Mention at least 4 objects/rooms.",
        targetPhrases: ["el", "la", "hay", "mi casa tiene"],
        successCriteria: ["Correct masculine/feminine article assignment for common nouns", "Uses hay to describe what exists in the home"],
        hints: ["la cocina (kitchen), el baño (bathroom), la sala (living room), el dormitorio (bedroom)"],
      },
    ],
  },

  // ── LESSON 9 ── Articles ─────────────────────────────────────
  {
    id: "es-l9",
    slug: "articles",
    title: "Articles — El, La, Un, Una and Their Plurals",
    content: `# Articles — El, La, Un, Una and Their Plurals

Spanish has two types of articles: **definite** (the) and **indefinite** (a/an, some). They must match the gender and number of the noun they precede.

## Definite Articles — "The"

| | Singular | Plural |
|-|---------|--------|
| **Masculine** | **el** | **los** |
| **Feminine** | **la** | **las** |

- **el** libro → **los** libros (the book → the books)
- **la** casa → **las** casas (the house → the houses)

## Indefinite Articles — "A / An / Some"

| | Singular | Plural |
|-|---------|--------|
| **Masculine** | **un** | **unos** |
| **Feminine** | **una** | **unas** |

- **un** libro (a book) → **unos** libros (some books)
- **una** casa (a house) → **unas** casas (some houses)

## Two Essential Contractions

Spanish combines prepositions with **el** (never **la**):
- **a + el = al** — Never written as "a el"!
  - Voy **al** banco. (I'm going to the bank.)
  - Llamo **al** médico. (I call the doctor.)
- **de + el = del** — Never written as "de el"!
  - Vengo **del** trabajo. (I'm coming from work.)
  - El precio **del** libro. (The price of the book.)

Note: these contractions only happen with **el** (masculine singular definite article), not with **él** (he — which has an accent mark).

\`\`\`concept
{ "title": "When to Use Definite vs Indefinite Articles", "variant": "info", "content": "Indefinite (un/una/unos/unas): use when introducing something for the first time, or referring to one of many. 'Hay un banco aquí' (There is a bank here — any bank). Definite (el/la/los/las): use when the thing is already known, specific, or unique. 'El banco está cerrado' (The bank is closed — the specific one we mentioned). Spanish also uses the definite article for general statements about categories: 'Los gatos son independientes' (Cats in general are independent)." }
\`\`\`

## Special Cases — Spanish Uses Definite Articles Where English Doesn't

| Spanish | Literal | What it means |
|---------|---------|--------------|
| **Me duele la cabeza.** | My head hurts me. | My head hurts. |
| **Los lunes trabajo.** | The Mondays I work. | I work on Mondays. |
| **El café es delicioso.** | The coffee is delicious. | Coffee (in general) is delicious. |
| **El señor García** | The Mr. García | Mr. García *(formal reference)* |

\`\`\`compare
{ "title": "Definite Article Uses English Learners Miss", "left": { "label": "English (no article)", "items": ["I work on Mondays (no article)", "Coffee is expensive", "Mr. García called", "I broke my arm", "French is difficult"] }, "right": { "label": "Spanish (definite article required)", "items": ["Trabajo los lunes (with los)", "El café es caro (with el)", "Llamó el señor García (with el)", "Me rompí el brazo (with el)", "El francés es difícil (with el)"] } }
\`\`\`

\`\`\`quiz
{ "question": "Complete: 'Voy ___ supermercado.' (I'm going to the supermarket.)", "options": ["Voy a el supermercado.", "Voy al supermercado.", "Voy del supermercado.", "Voy el supermercado."], "answer": 1, "explanation": "When 'a' (to) precedes 'el' (the, masculine), they contract to 'al'. So 'a el supermercado' must be written and said as 'al supermercado'. This contraction is mandatory — 'a el' without contraction is a grammar error. The only exception: 'él' with an accent (the pronoun 'he') — 'Voy a él' (I'm going to him) does NOT contract." }
\`\`\`

\`\`\`takeaways
{ "points": ["Definite articles: el (m.sg), la (f.sg), los (m.pl), las (f.pl)", "Indefinite articles: un (m.sg), una (f.sg), unos (m.pl), unas (f.pl)", "Mandatory contractions: a + el = al, de + el = del (never write 'a el' or 'de el')", "Spanish uses definite articles for days of week, languages, titles, and body parts — places English uses no article", "Indefinite = first mention / one of many. Definite = known / specific / general category"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m3",
    moduleTitle: "Gender & Articles",
    order: 2,
    topicId: "es-m3-l9-articles",
    vocabulary: [
      { word: "el / la / los / las", translation: "the (definite articles)", pronunciation: "ehl / lah / lohs / lahs", exampleSentence: "El libro, la mesa, los libros, las mesas.", exampleTranslation: "The book, the table, the books, the tables.", partOfSpeech: "article" },
      { word: "un / una", translation: "a / an (indefinite articles)", pronunciation: "oon / OO-nah", exampleSentence: "Tengo un hermano y una hermana.", exampleTranslation: "I have a brother and a sister.", partOfSpeech: "article" },
      { word: "al", translation: "to the (a + el)", pronunciation: "ahl", exampleSentence: "Voy al trabajo.", exampleTranslation: "I'm going to work.", partOfSpeech: "contraction" },
      { word: "del", translation: "of the / from the (de + el)", pronunciation: "dehl", exampleSentence: "El precio del café es alto.", exampleTranslation: "The price of coffee is high.", partOfSpeech: "contraction" },
      { word: "los lunes", translation: "on Mondays", pronunciation: "lohs LOO-nehs", exampleSentence: "Los lunes tengo clase de español.", exampleTranslation: "On Mondays I have Spanish class.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Definite Article with Days, Languages, and Body Parts",
        explanation: "Spanish requires definite articles in contexts where English uses none: days of the week (los lunes = on Mondays), languages (el español), and body parts in place of possessives (me duele el brazo = my arm hurts).",
        examples: [
          { correct: "Trabajo los lunes.", translation: "I work on Mondays.", note: "Days of week take definite article in Spanish" },
          { correct: "El español es fácil.", translation: "Spanish is easy.", note: "Languages take el/la in general statements" },
          { correct: "Me duele la cabeza.", translation: "My head hurts.", note: "Body parts use definite article, not possessive" },
        ],
        commonMistakes: [
          { incorrect: "Voy a el mercado.", correction: "Voy al mercado.", explanation: "a + el must always contract to al. Writing 'a el' is a grammar error." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m3-l9-vs1",
        title: "Shopping List Discussion",
        situation: "You're planning a shopping trip with a Spanish-speaking flatmate.",
        agentRole: "You are a Spanish-speaking flatmate. Discuss what to buy at the supermarket, where to go, and when. Naturally use al/del and all four definite articles in context.",
        userGoal: "Talk about going to the supermarket (al supermercado), what's needed, and the price of things (el precio del...).",
        targetPhrases: ["al supermercado", "del", "el precio", "hay que comprar"],
        successCriteria: ["Uses al correctly (a + el contraction)", "Uses del correctly (de + el contraction)", "Uses correct definite/indefinite articles with nouns"],
        hints: ["Voy al supermercado. ¿Qué necesitamos?", "El precio del pan / de la leche..."],
      },
    ],
  },

  // ── LESSON 10 ── Adjective Agreement ────────────────────────
  {
    id: "es-l10",
    slug: "adjective-agreement",
    title: "Adjective Agreement — Words Must Match Their Noun",
    content: `# Adjective Agreement — Words Must Match Their Noun

In Spanish, adjectives must **agree** with the noun they describe in both **gender** (masculine/feminine) and **number** (singular/plural). This is different from English, where adjectives never change form.

## The -o/-a Pattern (Most Common)

Adjectives ending in **-o** change to **-a** for feminine nouns:

| Masculine singular | Feminine singular | Masculine plural | Feminine plural |
|-------------------|-----------------|-----------------|----------------|
| un libro **rojo** | una casa **roja** | unos libros **rojos** | unas casas **rojas** |
| un chico **alto** | una chica **alta** | unos chicos **altos** | unas chicas **altas** |
| un hombre **bueno** | una mujer **buena** | unos hombres **buenos** | unas mujeres **buenas** |

## Adjectives That Don't Change for Gender

Adjectives ending in **-e**, **-ista**, or most consonants stay the same for masculine and feminine. Only the plural changes.

| Adjective | M.sg | F.sg | M.pl | F.pl |
|-----------|------|------|------|------|
| **interesante** | interesante | interesante | interesantes | interesantes |
| **verde** | verde | verde | verdes | verdes |
| **azul** | azul | azul | azules | azules |
| **gris** | gris | gris | grises | grises |
| **optimista** | optimista | optimista | optimistas | optimistas |

## Nationality Adjectives — Special Case

Nationality adjectives ending in a consonant DO change for feminine:

| Nationality | Masculine | Feminine |
|-------------|-----------|---------|
| Spanish | español | española |
| English | inglés | inglesa |
| French | francés | francesa |
| German | alemán | alemana |
| Japanese | japonés | japonesa |

## Adjective Position — After the Noun (Usually)

Unlike French, Spanish mostly keeps adjectives **after** the noun:

- una casa **grande** (a big house — not una grande casa)
- un coche **rojo** (a red car)
- un estudiante **inteligente** (an intelligent student)

**Exceptions — a few common adjectives go BEFORE the noun:**
- **bueno/malo** (good/bad): un **buen** amigo (a good friend — note: bueno → buen before masculine singular)
- **grande** (big): before a noun → **gran** + meaning changes to "great": un **gran** hombre (a great man)
- Numbers and quantity words: **tres** libros, **muchos** estudiantes

\`\`\`concept
{ "title": "Bueno/Malo Shorten Before Masculine Singular Nouns", "variant": "warning", "content": "When bueno or malo come BEFORE a masculine singular noun, they shorten: bueno → buen, malo → mal. Un buen amigo (a good friend), un mal día (a bad day). Feminine forms do NOT shorten: una buena amiga, una mala idea. This only applies when the adjective comes before the noun." }
\`\`\`

\`\`\`compare
{ "title": "English vs Spanish Adjective Agreement", "left": { "label": "English (adjectives never change)", "items": ["a tall man / a tall woman", "two tall men / two tall women", "a red car / a red house", "an interesting book / interesting books"] }, "right": { "label": "Spanish (adjectives must agree)", "items": ["un hombre alto / una mujer alta", "dos hombres altos / dos mujeres altas", "un coche rojo / una casa roja", "un libro interesante / unos libros interesantes"] } }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'a Spanish girl' in Spanish?", "options": ["una chica español", "una chica española", "un chica española", "una chica espanol"], "answer": 1, "explanation": "Chica is feminine (una chica). The adjective español must agree: español → española (add -a for feminine). Accent drops: español → española (the accent on the o is no longer needed since the word ending changes the stress pattern)." }
\`\`\`

\`\`\`takeaways
{ "points": ["Adjectives agree with the noun in gender and number — this is mandatory, not optional", "-o/-a pattern: rojo/roja, alto/alta, bueno/buena — change final -o to -a for feminine", "Adjectives ending in -e or most consonants: same for masculine and feminine (interesante, verde, azul)", "Nationality adjectives ending in consonant DO change: español/española, inglés/inglesa", "Position: adjectives come AFTER the noun in Spanish (una casa blanca, not una blanca casa)", "Bueno → buen and malo → mal before masculine singular nouns only"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m3",
    moduleTitle: "Gender & Articles",
    order: 3,
    topicId: "es-m3-l10-adjective-agreement",
    vocabulary: [
      { word: "alto/a", translation: "tall", pronunciation: "AHL-toh/tah", exampleSentence: "Mi hermano es muy alto.", exampleTranslation: "My brother is very tall.", partOfSpeech: "adjective" },
      { word: "interesante", translation: "interesting (same m/f)", pronunciation: "een-teh-reh-SAHN-teh", exampleSentence: "Es una película muy interesante.", exampleTranslation: "It's a very interesting film.", partOfSpeech: "adjective" },
      { word: "español/española", translation: "Spanish (nationality adj)", pronunciation: "ehs-pah-NYOHL / ehs-pah-NYOH-lah", exampleSentence: "Mi profesora es española.", exampleTranslation: "My teacher is Spanish.", partOfSpeech: "adjective" },
      { word: "bueno/a → buen", translation: "good / good (before m.sg noun)", pronunciation: "BWEH-noh/nah / BWEHN", exampleSentence: "Es un buen libro. Es una buena idea.", exampleTranslation: "It's a good book. It's a good idea.", partOfSpeech: "adjective" },
      { word: "pequeño/a", translation: "small / little", pronunciation: "peh-KEH-nyoh/nyah", exampleSentence: "Tengo un apartamento pequeño.", exampleTranslation: "I have a small apartment.", partOfSpeech: "adjective" },
      { word: "nuevo/a", translation: "new", pronunciation: "NWEH-boh/bah", exampleSentence: "Tengo un coche nuevo.", exampleTranslation: "I have a new car.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Adjective Agreement — Gender and Number",
        explanation: "All Spanish adjectives agree with the noun in gender (masculine/feminine) and number (singular/plural). The -o/-a pattern is the most common. Some adjectives are invariable for gender (those ending in -e or consonants).",
        examples: [
          { correct: "un libro rojo / una casa roja", translation: "a red book / a red house", note: "-o changes to -a for feminine" },
          { correct: "un estudiante inteligente / una estudiante inteligente", translation: "an intelligent student (m/f)", note: "-e ending: same for both genders" },
          { correct: "un buen amigo / una buena amiga", translation: "a good male friend / a good female friend", note: "bueno → buen before masculine singular" },
        ],
        commonMistakes: [
          { incorrect: "una chica español", correction: "una chica española", explanation: "Adjectives must agree with the noun they describe. Chica is feminine, so español must become española." },
          { incorrect: "una grande ciudad", correction: "una gran ciudad or una ciudad grande", explanation: "Grande before a singular noun becomes gran and means 'great' (impressive), not 'big' (size)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m3-l10-vs1",
        title: "Describing People and Things",
        situation: "A Spanish friend asks you to describe your city, your home, and a family member.",
        agentRole: "You are a curious Spanish friend. Ask the student to describe their hometown, their home, and a family member. Gently point out any adjective agreement errors.",
        userGoal: "Describe at least 3 things using adjectives with correct gender and number agreement.",
        targetPhrases: ["es una ciudad", "es grande", "mi casa es", "mi hermano/hermana es"],
        successCriteria: ["Adjectives agree in gender with noun they modify", "Adjectives placed after noun (except bueno/malo/gran)"],
        hints: ["Mi ciudad es grande y moderna.", "Mi casa es pequeña pero cómoda.", "Mi hermana es alta y simpática."],
      },
    ],
  },
];
