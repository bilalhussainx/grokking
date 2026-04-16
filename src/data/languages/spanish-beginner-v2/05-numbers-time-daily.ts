import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────────────
// MODULE 5: Numbers, Time & Daily Life (3 lessons)
// ─────────────────────────────────────────────────────────────────

export const numbersTimeDailyLessons: LanguageLesson[] = [
  // ── LESSON 15 ── Numbers 0–1,000 ────────────────────────────
  {
    id: "es-l15",
    slug: "numbers",
    title: "Numbers 0–1,000 — The Logic of Spanish Counting",
    content: `# Numbers 0–1,000 — The Logic of Spanish Counting

Spanish numbers are highly logical. Once you learn the core 30 words, you can produce every number up to 999 by combining them with simple rules.

## The Core Numbers

**0–15:** cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez, once, doce, trece, catorce, quince

**16–29 — Fused forms:** dieciséis, diecisiete, dieciocho, diecinueve, veinte, veintiuno, veintidós, veintitrés, veinticuatro, veinticinco, veintiséis, veintisiete, veintiocho, veintinueve

**Tens:** treinta (30), cuarenta (40), cincuenta (50), sesenta (60), setenta (70), ochenta (80), noventa (90)

**Hundreds:** cien (100, alone), ciento (100+), doscientos/doscientas (200), trescientos/trescientas (300), cuatrocientos (400), quinientos (500), seiscientos (600), setecientos (700), ochocientos (800), novecientos (900)

**1,000:** mil

## Building Numbers 31–99

From 31 onwards, use: **[tens] y [ones]** — with a space and the word **y** (and):

- 31 = treinta **y** uno
- 45 = cuarenta **y** cinco
- 67 = sesenta **y** siete
- 99 = noventa **y** nueve

**16–29 are written as one word** (dieciséis, veintiuno) — no **y**, no spaces.

\`\`\`concept
{ "title": "Uno Becomes Un/Una Before Nouns", "variant": "info", "content": "The number uno (1) shortens to 'un' before masculine nouns and to 'una' before feminine nouns. Un libro (1 book), una casa (1 house), veintiún días (21 days). This applies to any number ending in -uno: veintiuno → veintiún estudiantes. Note the accent mark on veintiún when followed by a masculine noun." }
\`\`\`

## Hundreds — Gender Agreement

The hundreds (200–900) agree in gender with the noun they modify. This is unique to hundreds — ones and tens don't change.

| Masculine | Feminine | |
|-----------|---------|--|
| doscientos libros | doscientas personas | 200 |
| trescientos euros | trescientas casas | 300 |
| quinientos años | quinientas páginas | 500 |

**Cien vs Ciento:**
- **Cien** = exactly 100 (alone, or before a larger number): Hay cien personas. Cien mil euros.
- **Ciento** = 100+ anything: Ciento uno (101), ciento cincuenta (150).

\`\`\`compare
{ "title": "Spanish vs English Number Logic", "left": { "label": "English (some fusion, some not)", "items": ["11-12: eleven, twelve (fused, opaque)", "13-19: thirteen, fourteen... (semi-transparent)", "21: twenty-one (hyphenated)", "100+: one hundred and one (with 'and')"] }, "right": { "label": "Spanish (logical once learned)", "items": ["11-15: once, doce... (must memorize)", "16-29: dieciséis, veintiuno (fused, no 'y')", "31+: treinta y uno (transparent 'y' pattern)", "100+: ciento uno (no 'y' between hundreds and tens)"] } }
\`\`\`

\`\`\`quiz
{ "question": "How do you say '525 female students' in Spanish?", "options": ["Quinientos veinticinco estudiantes", "Quinientas veinticinco estudiantes", "Quinientas y veinticinco estudiantes", "Quinientos y veinticinco estudiantes"], "answer": 1, "explanation": "Estudiantes (students) here refers to female students (feminine). The hundreds agree in gender: quinientos (m) → quinientas (f). The 25 part doesn't change: veinticinco. And importantly: no 'y' between hundreds and the next number — it's quinientas veinticinco, not quinientas y veinticinco." }
\`\`\`

\`\`\`takeaways
{ "points": ["0-15: memorize individually. 16-29: fused forms (dieciséis, veintiuno). 30+: transparent [tens] y [ones].", "No 'y' between hundreds and the next number: ciento cincuenta (not ciento y cincuenta)", "Uno → un (m) / una (f) before nouns: un libro, una casa, veintiún días", "Hundreds (200-900) agree in gender: doscientos libros / doscientas páginas", "Cien = exactly 100. Ciento = 101-199."] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m5",
    moduleTitle: "Numbers, Time & Daily Life",
    order: 1,
    topicId: "es-m5-l15-numbers",
    vocabulary: [
      { word: "cien / ciento", translation: "100 (alone) / 100+ (combined)", pronunciation: "SYEHN / SYEHN-toh", exampleSentence: "Hay cien personas en la sala.", exampleTranslation: "There are a hundred people in the room.", partOfSpeech: "number" },
      { word: "mil", translation: "one thousand", pronunciation: "meel", exampleSentence: "El coche cuesta doce mil euros.", exampleTranslation: "The car costs twelve thousand euros.", partOfSpeech: "number" },
      { word: "doscientos/as", translation: "two hundred (m/f)", pronunciation: "doh-SYEHN-tohs/tahs", exampleSentence: "Hay doscientas páginas en el libro.", exampleTranslation: "There are two hundred pages in the book.", partOfSpeech: "number" },
      { word: "¿cuánto cuesta?", translation: "how much does it cost?", pronunciation: "KWAHN-toh KWEHS-tah", exampleSentence: "¿Cuánto cuesta la entrada?", exampleTranslation: "How much does the ticket cost?", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Spanish Number Construction Rules",
        explanation: "31-99: tens + y + ones (treinta y uno). No y between hundreds and the rest (ciento veinte). Hundreds agree with noun gender (doscientos/doscientas). Uno shortens to un/una before nouns.",
        examples: [
          { correct: "Treinta y dos euros", translation: "Thirty-two euros", note: "y between tens and ones (31+)" },
          { correct: "Ciento cincuenta personas", translation: "One hundred and fifty people", note: "No y after ciento" },
          { correct: "Quinientas páginas", translation: "Five hundred pages", note: "Hundreds agree: quinientas (f)" },
        ],
        commonMistakes: [
          { incorrect: "Ciento y veinte", correction: "Ciento veinte", explanation: "No 'y' between hundreds and the following number. Only use y between tens and ones (31+)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m5-l15-vs1",
        title: "Prices and Quantities at a Market",
        situation: "You're at a local market in Mexico City asking about prices.",
        agentRole: "You are a friendly market vendor in Mexico City. Tell the customer the prices of various items, give them in pesos (use numbers 1-500). Ask how many they want.",
        userGoal: "Ask prices (¿Cuánto cuesta?), understand the numbers, and say what quantity you want.",
        targetPhrases: ["¿cuánto cuesta?", "cuesta", "quiero", "treinta pesos", "dos kilos"],
        successCriteria: ["Correctly understands and repeats prices in Spanish", "Uses correct number forms when ordering quantities"],
        hints: ["¿Cuánto cuesta el kilo de tomates? / Cuesta treinta pesos. / Quiero dos kilos, por favor."],
      },
    ],
  },

  // ── LESSON 16 ── Time, Days & Months ─────────────────────────
  {
    id: "es-l16",
    slug: "time-days-months",
    title: "Time, Days & Months — Talking About When",
    content: `# Time, Days & Months — Talking About When

## Telling the Time

**¿Qué hora es?** — What time is it?

The structure: **Es la una** (1 o'clock) / **Son las [number]** (all other times).

| Time | Spanish |
|------|---------|
| 1:00 | **Es la una.** *(es la — singular)* |
| 2:00 | **Son las dos.** *(son las — plural)* |
| 3:30 | Son las tres **y media.** |
| 4:15 | Son las cuatro **y cuarto.** |
| 4:45 | Son las **cinco menos cuarto.** *(five minus a quarter)* |
| 9:20 | Son las nueve **y veinte.** |
| 12:00 noon | Es el **mediodía.** |
| 12:00 midnight | Es la **medianoche.** |

**Additional phrases:**
- de la mañana — in the morning (a.m.)
- de la tarde — in the afternoon (p.m. until ~8pm)
- de la noche — at night (p.m. after ~8pm)
- Son las ocho **de la mañana.** — It's 8 in the morning.

\`\`\`concept
{ "title": "Es la vs Son las — The Singular/Plural Split", "variant": "info", "content": "1:00 uses 'Es la una' because it's one hour (singular). All other times use 'Son las...' because they refer to multiple hours (plural). Mediodía (noon) and medianoche (midnight) are used with 'es el' and 'es la' respectively — es el mediodía, es la medianoche." }
\`\`\`

## Days of the Week

Monday: **lunes** — Tuesday: **martes** — Wednesday: **miércoles** — Thursday: **jueves** — Friday: **viernes** — Saturday: **sábado** — Sunday: **domingo**

Key facts:
- Days are **not capitalised** in Spanish
- The week starts on **Monday** in Spanish calendars (not Sunday)
- To say "on Monday": **el lunes** (singular, this week) or **los lunes** (plural, every Monday)
- **el fin de semana** — the weekend

## Months and Seasons

**Months (not capitalised):** enero (Jan), febrero (Feb), marzo (Mar), abril (Apr), mayo (May), junio (Jun), julio (Jul), agosto (Aug), septiembre (Sep), octubre (Oct), noviembre (Nov), diciembre (Dec)

**Seasons:** la primavera (spring), el verano (summer), el otoño (autumn), el invierno (winter)

**Dates:**
- ¿Cuál es la fecha? / ¿Qué fecha es hoy? — What's today's date?
- Hoy es el **15 de marzo**. — Today is March 15th. (Spanish uses cardinal numbers for dates)
- Mi cumpleaños es el **tres de julio**. — My birthday is July 3rd.
- Nací en **1998** (mil novecientos noventa y ocho). — I was born in 1998.

\`\`\`compare
{ "title": "English Dates vs Spanish Dates", "left": { "label": "English date format", "items": ["March 15th (month first)", "Use ordinals: 1st, 2nd, 3rd", "September 1, 2025", "Capitalize months"] }, "right": { "label": "Spanish date format", "items": ["El 15 de marzo (day first)", "Use cardinals: el uno, el dos, el tres...", "El 1 de septiembre de 2025", "Months are lowercase"] } }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'It's 4:45' in Spanish?", "options": ["Son las cuatro y cuarenta y cinco.", "Son las cinco menos cuarto.", "Son las cuatro menos quince.", "Es la cuatro y cuarenta y cinco."], "answer": 1, "explanation": "4:45 = 'five minus a quarter' in Spanish: Son las cinco menos cuarto. Spanish speakers think of 4:45 as '15 minutes to 5'. You can also say 'Son las cuatro y cuarenta y cinco' — this is technically correct but much less natural. 'Es la cuatro' is wrong because 4 is plural → 'son las'." }
\`\`\`

\`\`\`takeaways
{ "points": ["¿Qué hora es? → Es la una (1:00) / Son las dos/tres/... (all others)", "Half past: y media. Quarter past: y cuarto. Quarter to: menos cuarto.", "Days: lunes, martes, miércoles, jueves, viernes, sábado, domingo — NOT capitalised", "El lunes = this Monday. Los lunes = every Monday.", "Dates: el + cardinal number + de + month (el 15 de octubre). NOT ordinals.", "Months NOT capitalised in Spanish"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m5",
    moduleTitle: "Numbers, Time & Daily Life",
    order: 2,
    topicId: "es-m5-l16-time-days-months",
    vocabulary: [
      { word: "¿qué hora es?", translation: "what time is it?", pronunciation: "keh OH-rah ehs", exampleSentence: "Perdona, ¿qué hora es?", exampleTranslation: "Excuse me, what time is it?", partOfSpeech: "phrase" },
      { word: "son las...", translation: "it's... o'clock (plural)", pronunciation: "sohn lahs", exampleSentence: "Son las tres y media.", exampleTranslation: "It's half past three.", partOfSpeech: "phrase" },
      { word: "el fin de semana", translation: "the weekend", pronunciation: "ehl feen deh seh-MAH-nah", exampleSentence: "¿Qué haces este fin de semana?", exampleTranslation: "What are you doing this weekend?", partOfSpeech: "noun phrase" },
      { word: "mañana", translation: "tomorrow / morning", pronunciation: "mah-NYAH-nah", exampleSentence: "La reunión es mañana a las diez de la mañana.", exampleTranslation: "The meeting is tomorrow at ten in the morning.", partOfSpeech: "adverb/noun" },
      { word: "¿cuál es la fecha?", translation: "what's the date?", pronunciation: "kwahl ehs lah FEH-chah", exampleSentence: "¿Cuál es la fecha de hoy?", exampleTranslation: "What is today's date?", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Telling Time — Es la vs Son las",
        explanation: "Use 'Es la una' for 1:00 (singular). Use 'Son las...' for all other times (plural, treating the hours as a plural noun). Time prepositions: de la mañana/tarde/noche.",
        examples: [
          { correct: "Es la una y cuarto.", translation: "It's quarter past one.", note: "Singular: only 1:00 uses 'es la'" },
          { correct: "Son las siete menos veinte.", translation: "It's twenty to seven.", note: "Plural: son las for 2:00 onward" },
          { correct: "Son las tres de la tarde.", translation: "It's three in the afternoon.", note: "de la tarde specifies PM" },
        ],
        commonMistakes: [
          { incorrect: "Es las dos.", correction: "Son las dos.", explanation: "Only 1:00 uses 'es la una'. All other times use 'son las + number'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m5-l16-vs1",
        title: "Making Plans — Time and Day",
        situation: "You're arranging to meet a Spanish friend for coffee.",
        agentRole: "You are a Spanish friend arranging a coffee meeting. Discuss what time, what day, and where to meet. Mention your schedule for the week.",
        userGoal: "Suggest a day and time for meeting. Ask and answer ¿Qué hora es? and ¿Cuándo quedamos?",
        targetPhrases: ["el lunes", "a las", "¿qué hora es?", "son las", "este fin de semana", "mañana"],
        successCriteria: ["Correct time-telling formula (son las / es la)", "Names days correctly without capitals", "Uses a + definite article for clock times"],
        hints: ["¿Quedamos el martes? A las cuatro de la tarde. / El sábado tengo..."],
      },
    ],
  },

  // ── LESSON 17 ── Reflexive Verbs & Daily Routines ────────────
  {
    id: "es-l17",
    slug: "reflexive-verbs-routines",
    title: "Reflexive Verbs & Daily Routines",
    content: `# Reflexive Verbs & Daily Routines

Reflexive verbs describe actions you do **to yourself**: waking up, getting dressed, showering, going to bed. They're essential for talking about daily routines and are a core feature of Spanish grammar.

## What Makes a Verb Reflexive?

A reflexive verb has a reflexive pronoun that refers back to the subject: "I wash **myself**", "she gets **herself** dressed". In Spanish, these pronouns are placed **before** the conjugated verb.

| Pronoun | Reflexive pronoun | Example |
|---------|-----------------|---------|
| yo | **me** | me levanto |
| tú | **te** | te levantas |
| él/ella/usted | **se** | se levanta |
| nosotros | **nos** | nos levantamos |
| vosotros | **os** | os levantáis |
| ellos/ustedes | **se** | se levantan |

\`\`\`concept
{ "title": "Reflexive Infinitives End in -se", "variant": "info", "content": "In dictionaries and vocabulary lists, reflexive verbs appear with -se attached to the infinitive: levantarse (to get up), ducharse (to shower), llamarse (to be called). When you conjugate, remove the -se, conjugate the main verb normally, then put the matching reflexive pronoun before it. levantarse → yo me levanto (not 'yo levantome')." }
\`\`\`

## Essential Daily Routine Reflexive Verbs

| Infinitive | Meaning | Yo form |
|------------|---------|---------|
| **despertarse** | to wake up | me despierto |
| **levantarse** | to get up | me levanto |
| **ducharse** | to shower | me ducho |
| **lavarse** | to wash (oneself) | me lavo |
| **vestirse** | to get dressed | me visto |
| **peinarse** | to comb/brush hair | me peino |
| **acostarse** | to go to bed | me acuesto |
| **dormirse** | to fall asleep | me duermo |
| **llamarse** | to be called (one's name) | me llamo |
| **quedarse** | to stay / remain | me quedo |

Note: **despertarse** (e→ie), **vestirse** (e→i), **acostarse** (o→ue), **dormirse** (o→ue) are stem-changing.

## A Day in Spanish

- Me **despierto** a las siete. — I wake up at seven.
- Me **levanto** a las siete y cuarto. — I get up at quarter past seven.
- Me **ducho** y me **visto** rápido. — I shower and get dressed quickly.
- Desayuno a las ocho. — I have breakfast at eight.
- Trabajo de nueve a cinco. — I work from nine to five.
- Como al mediodía. — I eat at noon.
- Me **acuesto** a las once. — I go to bed at eleven.

\`\`\`compare
{ "title": "Reflexive vs Non-Reflexive — Same Verb, Different Meaning", "left": { "label": "Non-reflexive (action on someone/something else)", "items": ["Lavo el coche. (I wash the car.)", "Levanto las cajas. (I lift the boxes.)", "Llamo a mi madre. (I call my mother.)", "Despierto al niño. (I wake the child up.)"] }, "right": { "label": "Reflexive (action on oneself)", "items": ["Me lavo. (I wash myself.)", "Me levanto. (I get up / I lift myself.)", "Me llamo Carlos. (I am called Carlos.)", "Me despierto. (I wake up.)"] } }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'She showers every morning' in Spanish?", "options": ["Ella ducha cada mañana.", "Ella se ducha cada mañana.", "Ella me ducha cada mañana.", "Se ella ducha cada mañana."], "answer": 1, "explanation": "Ducharse (to shower) is reflexive. For ella, the reflexive pronoun is 'se', placed BEFORE the conjugated verb. The verb form is ducha (third person -AR). So: ella se ducha. 'Ella ducha' (without se) would mean she is bathing someone else. 'Se ella ducha' is wrong word order — pronoun comes before, not between, subject and verb." }
\`\`\`

\`\`\`takeaways
{ "points": ["Reflexive verbs: reflexive pronoun (me/te/se/nos/os/se) goes BEFORE the conjugated verb", "Common daily routine reflexives: despertarse, levantarse, ducharse, vestirse, acostarse", "Dictionary form ends in -se (levantarse); conjugation removes -se and adds matching pronoun", "Non-reflexive vs reflexive changes meaning: lavar (to wash something) vs lavarse (to wash oneself)", "Stem-changing reflexives: despertarse (e→ie), acostarse (o→ue), vestirse (e→i), dormirse (o→ue)"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m5",
    moduleTitle: "Numbers, Time & Daily Life",
    order: 3,
    topicId: "es-m5-l17-reflexive-verbs",
    vocabulary: [
      { word: "levantarse", translation: "to get up", pronunciation: "leh-bahn-TAR-seh", exampleSentence: "Me levanto a las siete cada día.", exampleTranslation: "I get up at seven every day.", partOfSpeech: "verb (reflexive)" },
      { word: "ducharse", translation: "to shower", pronunciation: "doo-CHAR-seh", exampleSentence: "¿A qué hora te duchas?", exampleTranslation: "What time do you shower?", partOfSpeech: "verb (reflexive)" },
      { word: "acostarse", translation: "to go to bed", pronunciation: "ah-kohs-TAR-seh", exampleSentence: "Normalmente me acuesto a las once.", exampleTranslation: "I normally go to bed at eleven.", partOfSpeech: "verb (reflexive)" },
      { word: "despertarse", translation: "to wake up", pronunciation: "dehs-pehr-TAR-seh", exampleSentence: "Me despierto sin despertador.", exampleTranslation: "I wake up without an alarm clock.", partOfSpeech: "verb (reflexive)" },
      { word: "llamarse", translation: "to be called / one's name", pronunciation: "yah-MAR-seh", exampleSentence: "¿Cómo se llama usted?", exampleTranslation: "What is your name? (formal)", partOfSpeech: "verb (reflexive)" },
      { word: "vestirse", translation: "to get dressed", pronunciation: "behs-TEER-seh", exampleSentence: "Me visto rápido por la mañana.", exampleTranslation: "I get dressed quickly in the morning.", partOfSpeech: "verb (reflexive)" },
    ],
    grammarPoints: [
      {
        title: "Reflexive Verb Construction",
        explanation: "Reflexive verbs require a reflexive pronoun (me, te, se, nos, os, se) placed before the conjugated verb. The verb itself is conjugated normally. The pronoun matches the subject.",
        examples: [
          { correct: "Me levanto a las ocho.", translation: "I get up at eight.", note: "me (yo) + levanto (yo form of levantar)" },
          { correct: "¿A qué hora se acuesta ella?", translation: "What time does she go to bed?", note: "se (ella) + acuesta (ella form, o→ue stem change)" },
          { correct: "Nos duchamos juntos.", translation: "We shower together.", note: "nos (nosotros) + duchamos" },
        ],
        commonMistakes: [
          { incorrect: "Ella ducha cada mañana.", correction: "Ella se ducha cada mañana.", explanation: "Without the reflexive pronoun 'se', 'ella ducha' means she bathes someone else. Always include the reflexive pronoun for self-directed actions." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m5-l17-vs1",
        title: "Morning Routine",
        situation: "A Spanish friend asks about your typical morning routine.",
        agentRole: "You are a curious Spanish friend. Ask the student about their morning routine in detail — what time they get up, whether they shower in the morning or evening, when they eat breakfast, etc.",
        userGoal: "Describe your full morning routine using at least 4 reflexive verbs and clock times.",
        targetPhrases: ["me despierto", "me levanto", "me ducho", "me visto", "a las", "luego", "después"],
        successCriteria: ["Correct reflexive pronoun for yo (me)", "At least 3 different reflexive verbs", "Clock times included"],
        hints: ["Me despierto a las... / Me levanto a las... / Me ducho y me visto. / Desayuno a las..."],
      },
    ],
  },
];
