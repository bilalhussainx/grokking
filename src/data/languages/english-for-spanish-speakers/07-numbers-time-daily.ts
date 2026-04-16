// Module 7: Numbers, Time & Daily Life in English
// English numbers, telling time, dates, and common daily expressions

import type { LanguageLesson } from "@/data/language-types";

export const numbersTimeDailyLessons: LanguageLesson[] = [
  // ── Lesson 1: Numbers + English-Specific Number Quirks ─────────────────
  {
    id: "en-es-7-1",
    slug: "numbers-english",
    title: "Los Números en Inglés — Las Peculiaridades",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m7",
    moduleTitle: "Module 7: Numbers, Time & Daily Life",
    order: 1,
    topicId: "en-es-7-1-numbers-english",
    content: `# Los Números en Inglés — Las Peculiaridades

<!-- voice: English numbers are generally logical, but there are some tricky points: the teens from 11-19 don't follow a pattern like Spanish does, large numbers use commas differently, and there are ordinal numbers for dates. Let's cover them all. -->

\`\`\`concept
title: Spanish vs English number systems
body: |
  Spanish numbers 16-19 follow a clear pattern: diez y seis, diez y siete, etc.
  English 11-19 are irregular and must be memorized:
  11=eleven, 12=twelve, 13=thirteen, 14=fourteen, 15=fifteen...
  (then 16=sixteen, 17=seventeen, 18=eighteen, 19=nineteen — those are logical)

  Another difference: large number punctuation:
  - English: 1,000 (comma for thousands) and 1.5 (period for decimals)
  - Spanish: 1.000 (period for thousands) and 1,5 (comma for decimals)
  — completely opposite!
\`\`\`

## 0 to 20 — The Tricky Part

| Number | English | Note |
|--------|---------|------|
| 0 | zero | Or "oh" in phone numbers: 020 = "oh two oh" |
| 1 | one | |
| 2 | two | Pronounced /tuː/ |
| 3 | three | TH sound! /θriː/ |
| 4 | four | |
| 5 | five | |
| 6 | six | |
| 7 | seven | |
| 8 | eight | Pronounced /eɪt/ (silent GH) |
| 9 | nine | |
| 10 | ten | |
| 11 | **eleven** | Irregular! (not "one-teen") |
| 12 | **twelve** | Irregular! (not "two-teen") |
| 13 | thirteen | -teen pattern starts here |
| 14 | fourteen | |
| 15 | **fifteen** | (not "fiveteen") |
| 16 | sixteen | |
| 17 | seventeen | |
| 18 | **eighteen** | (not "eightteen") |
| 19 | nineteen | |
| 20 | twenty | |

## 21 to 1,000

| Number | English | Pattern |
|--------|---------|---------|
| 21 | twenty-**one** | twenty + hyphen + unit |
| 35 | thirty-five | thirty + hyphen + unit |
| 48 | forty-eight | Note: "forty" not "fourty" |
| 100 | a hundred / one hundred | |
| 150 | a hundred and fifty | Add "and" before the last part |
| 200 | two hundred | No -s on hundred: "two hundred" not "two hundreds" |
| 1,000 | a thousand / one thousand | |

\`\`\`steps
title: Key number pronunciation rules
steps:
  - step: "**Thirteen vs thirty** — often confused! thirTEEN (stress on -teen) vs THIRty (stress on first)"
  - step: "**Fifteen vs fifty** — fifTEEN vs FIFty. Teens are stressed at the end."
  - step: "**No -s on hundred/thousand**: 'two hundred' ✅, 'two hundreds' ❌"
  - step: "**'And' in British English**: 150 = 'a hundred AND fifty'. American: sometimes no 'and'."
  - step: "**Commas = thousands separator**: 1,500 = one thousand five hundred"
\`\`\`

## Ordinal Numbers (for Dates)

| Cardinal | Ordinal | For dates |
|----------|---------|-----------|
| 1 | **1st** = first | January **1st** |
| 2 | **2nd** = second | March **2nd** |
| 3 | **3rd** = third | May **3rd** |
| 4 | **4th** = fourth | July **4th** |
| 5 | **5th** = fifth | September **5th** |
| 11 | **11th** = eleventh | November **11th** |
| 20 | **20th** = twentieth | December **20th** |
| 21 | **21st** = twenty-first | February **21st** |

\`\`\`quiz
questions:
  - q: "How do you say '15' in English?"
    options: ["Five-teen", "Fifteen", "Fiveteen", "Fiften"]
    answer: 1
    explanation: "Five changes to 'fif' in fifteen: fif-teen. Similarly, eight → eigh-teen (not 'eightteen'). These must be memorized."
  - q: "How do you write 1,500 in words?"
    options: ["One thousand fives hundred", "One thousand and five hundred", "Fifteen hundred / One thousand five hundred", "One thousands five hundreds"]
    answer: 2
    explanation: "1,500 = 'fifteen hundred' OR 'one thousand five hundred'. Never add -s: not 'thousands' or 'hundreds' when used as part of a number."
  - q: "If today is the 3rd of June, what do you say in English?"
    options: ["The three of June", "June three", "June third", "Three June"]
    answer: 2
    explanation: "Dates use ordinal numbers: June third (= June 3rd). In British English: 'the third of June'. In American: 'June third'. Both are correct."
\`\`\`

\`\`\`takeaways
items:
  - "11 = eleven, 12 = twelve — these two are completely irregular, must be memorized"
  - "Teens (13-19) are stressed at the END: thirTEEN, fifTEEN. Tens (30, 40, 50) stress the START: THIRty, FIFty"
  - "No -s: 'two hundred', 'five thousand' — never 'hundreds' or 'thousands' mid-number"
  - "Ordinals for dates: 1st, 2nd, 3rd, 4th... first, second, third, fourth"
  - "Commas and periods are OPPOSITE to Spanish: 1,000 = one thousand; 1.5 = one point five"
\`\`\``,
    vocabulary: [
      { word: "eleven", translation: "once", pronunciation: "/ɪˈlɛvən/", exampleSentence: "There are eleven players on a football team.", exampleTranslation: "Hay once jugadores en un equipo de fútbol.", partOfSpeech: "number" },
      { word: "twelve", translation: "doce", pronunciation: "/twɛlv/", exampleSentence: "The meeting is at twelve o'clock.", exampleTranslation: "La reunión es a las doce.", partOfSpeech: "number" },
      { word: "hundred", translation: "cien / ciento", pronunciation: "/ˈhʌndrəd/", exampleSentence: "It costs three hundred dollars.", exampleTranslation: "Cuesta trescientos dólares.", partOfSpeech: "number" },
      { word: "first", translation: "primero/a (1st)", pronunciation: "/fɜːrst/", exampleSentence: "My birthday is on the first of March.", exampleTranslation: "Mi cumpleaños es el primero de marzo.", partOfSpeech: "ordinal number" },
      { word: "thousand", translation: "mil", pronunciation: "/ˈθaʊzənd/", exampleSentence: "It costs two thousand euros.", exampleTranslation: "Cuesta dos mil euros.", partOfSpeech: "number" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-7-1-v1",
        title: "Exchanging Personal Information",
        situation: "A new acquaintance asks for your contact details and some personal information",
        agentRole: "You are a new friend exchanging details. Ask for phone number, address (street number), age, and birthday. Have them practice saying numbers aloud.",
        userGoal: "Say your phone number, age, and date of birth correctly in English",
        targetPhrases: ["My number is...", "I am ___ years old.", "My birthday is on the ___ of ___", "It costs about..."],
        successCriteria: ["Pronounces eleven and twelve correctly", "Uses ordinal for birthday date (first, second, third)", "Correctly says a 10-digit phone number"],
        hints: ["My number is 07 nine-double-eight, three-four-five six-seven.", "I'm twenty-eight years old.", "My birthday is on the fifteenth of June."],
      },
    ],
  },

  // ── Lesson 2: Telling the Time ───────────────────────────────────────────
  {
    id: "en-es-7-2",
    slug: "telling-time",
    title: "Decir la Hora en Inglés",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m7",
    moduleTitle: "Module 7: Numbers, Time & Daily Life",
    order: 2,
    topicId: "en-es-7-2-telling-time",
    content: `# Decir la Hora en Inglés

<!-- voice: Telling the time in English has some unique features — past and to, o'clock, AM and PM, and the 12-hour vs 24-hour system. Spanish speakers often use the 24-hour clock while English speakers almost always use 12-hour. -->

\`\`\`concept
title: English time vs Spanish time
body: |
  Spanish: "Son las tres y media." (It's three and a half.)
  English: "It's half past three." (past = after, to = before)

  Spanish uses the 24-hour clock naturally: "Son las 15:00"
  English speakers typically use 12-hour + AM/PM:
  "It's 3 PM" not "It's 15:00" (except in formal/military contexts)

  Key vocabulary:
  - **o'clock** = en punto (It's 3 o'clock = Son las 3 en punto)
  - **past** = y (It's 10 past 3 = Son las 3 y 10)
  - **to** = menos (It's 10 to 4 = Son las 4 menos 10)
  - **half past** = y media (It's half past 3 = Son las 3 y media)
  - **quarter past** = y cuarto (It's quarter past 3 = Son las 3 y cuarto)
  - **quarter to** = menos cuarto (It's quarter to 4 = Son las 4 menos cuarto)
\`\`\`

## Telling Time — The Full System

| Time | English (formal) | English (informal) |
|------|------------------|--------------------|
| 3:00 | It's three o'clock | It's three |
| 3:05 | It's five past three | It's three oh five |
| 3:15 | It's quarter past three | It's three fifteen |
| 3:30 | It's half past three | It's three thirty |
| 3:45 | It's quarter to four | It's three forty-five |
| 3:50 | It's ten to four | It's three fifty |

## AM and PM

| Spanish | English |
|---------|---------|
| 7 de la mañana | 7 **AM** (or "7 in the morning") |
| 3 de la tarde | 3 **PM** (or "3 in the afternoon") |
| 8 de la noche | 8 **PM** (or "8 in the evening") |
| 12 del mediodía | **noon** or **12 noon** |
| 12 de la medianoche | **midnight** or **12 midnight** |

\`\`\`steps
title: How to ask and answer about time
steps:
  - step: "**Question**: 'What time is it?' or 'What's the time?' (¿Qué hora es?)"
  - step: "**Answer**: 'It's [time]' — always start with 'It's'"
  - step: "**At what time?**: 'The train leaves at half past nine.' (a las nueve y media)"
  - step: "**Morning/afternoon**: Add AM/PM or 'in the morning/afternoon/evening'"
  - step: "**Informal**: Just say the numbers — 'It's three forty-five' works fine too"
\`\`\`

## Useful Time Expressions

| English | Spanish | Example |
|---------|---------|---------|
| on time | a tiempo | The bus arrived on time. |
| early | temprano | She arrived early. |
| late | tarde | I'm running late! |
| at noon | al mediodía | We eat at noon. |
| at midnight | a medianoche | The party ends at midnight. |
| in the morning | por la mañana | I exercise in the morning. |
| in the afternoon | por la tarde | I study in the afternoon. |
| in the evening | por la tarde-noche | We eat in the evening. |
| at night | de noche | I sleep at night. |

\`\`\`compare
left:
  label: "❌ Spanish time habits in English"
  items:
    - "'It's the three.' (adding 'the')"
    - "'Are the eight.' (missing 'It's')"
    - "'At the 15:00.' (24-hour clock in casual speech)"
    - "'At seven and a half.' (direct translation)"
right:
  label: "✅ Natural English time expressions"
  items:
    - "'It's three o'clock.' (no 'the')"
    - "'It's eight.' (always 'It's')"
    - "'At three o'clock.' or 'At 3 PM.' (12-hour system)"
    - "'At half past seven.' or 'At seven thirty.'"
\`\`\`

\`\`\`quiz
questions:
  - q: "How do you say '3:45' in formal English?"
    options: ["It's three and forty-five.", "It's quarter to four.", "It's three quarters.", "It's fifteen to four."]
    answer: 1
    explanation: "3:45 is 15 minutes before 4, so it's 'quarter to four'. You count backwards: 3:50 = ten to four, 3:45 = quarter to four, 3:40 = twenty to four."
  - q: "What does 'half past seven' mean?"
    options: ["7:15", "7:30", "7:45", "6:30"]
    answer: 1
    explanation: "'Half past seven' = 7:30. 'Half past' means 30 minutes have passed after the hour. Half past seven = siete y media."
  - q: "How do you ask someone what time it is?"
    options: ["Which time it is?", "What time is it?", "How much time is?", "It is what time?"]
    answer: 1
    explanation: "'What time is it?' is the standard way to ask the time. 'What's the time?' is also correct and common. 'Excuse me, do you have the time?' is very polite."
\`\`\`

\`\`\`takeaways
items:
  - "Always start time with 'It's': 'It's three o'clock', 'It's half past seven'"
  - "Past = after the hour (5 past 3 = 3:05). To = before the next hour (5 to 4 = 3:55)"
  - "Quarter = 15 minutes. Half = 30 minutes. O'clock = exactly on the hour"
  - "English uses 12-hour + AM/PM in casual speech (not 24-hour like Spanish often does)"
  - "Noon = 12 del mediodía. Midnight = 12 de la medianoche"
\`\`\``,
    vocabulary: [
      { word: "o'clock", translation: "en punto", pronunciation: "/əˈklɒk/", exampleSentence: "The meeting starts at ten o'clock.", exampleTranslation: "La reunión empieza a las diez en punto.", partOfSpeech: "phrase" },
      { word: "half past", translation: "y media", pronunciation: "/hɑːf pɑːst/", exampleSentence: "It's half past two — time for lunch!", exampleTranslation: "Son las dos y media, ¡hora de comer!", partOfSpeech: "phrase" },
      { word: "quarter to", translation: "menos cuarto", pronunciation: "/ˈkwɔːrtər tuː/", exampleSentence: "The train leaves at quarter to nine.", exampleTranslation: "El tren sale a las nueve menos cuarto.", partOfSpeech: "phrase" },
      { word: "noon", translation: "mediodía", pronunciation: "/nuːn/", exampleSentence: "We have lunch at noon.", exampleTranslation: "Comemos al mediodía.", partOfSpeech: "noun" },
      { word: "on time", translation: "a tiempo / puntual", pronunciation: "/ɒn taɪm/", exampleSentence: "The bus arrived on time today.", exampleTranslation: "El autobús llegó a tiempo hoy.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-7-2-v1",
        title: "Making Plans",
        situation: "You and an English-speaking friend are planning to meet up",
        agentRole: "You are an English-speaking friend making plans to meet. Suggest different times, ask about availability, and confirm a time. Practice 'What time...?', 'How about...?', 'Is three o'clock OK?'",
        userGoal: "Discuss times, say what time things happen, and agree on a meeting time",
        targetPhrases: ["What time...?", "At half past...", "At quarter to...", "Is ___ o'clock OK?", "In the morning/afternoon"],
        successCriteria: ["Says times correctly using past/to/half/quarter/o'clock", "Uses AM/PM or morning/afternoon/evening appropriately", "Understands and responds to time questions"],
        hints: ["How about half past two in the afternoon?", "That works. I'll meet you at the café at two thirty.", "Actually, is three o'clock better? I need to finish work first."],
      },
    ],
  },

  // ── Lesson 3: Can / Can't + Modal Verbs for Daily Life ───────────────────
  {
    id: "en-es-7-3",
    slug: "can-cant-modals",
    title: "Can / Can't — Habilidades y Permisos",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m7",
    moduleTitle: "Module 7: Numbers, Time & Daily Life",
    order: 3,
    topicId: "en-es-7-3-can-cant-modals",
    content: `# Can / Can't — Habilidades y Permisos

<!-- voice: 'Can' is one of the most useful words in English. It replaces 'poder' for ability AND 'saber' in some cases. Plus 'would like' for polite requests. These modal verbs give you enormous conversational power at A1. -->

\`\`\`concept
title: Modal verbs — no conjugation needed!
body: |
  English has a group of verbs called "modal verbs":
  can, could, will, would, should, must, may, might

  The great news: modals NEVER change form.
  - I can, you can, he can, she can, we can, they can — always "can"!
  - No "she cans" or "he coulds" — modal verbs are identical for all subjects.

  Also: after a modal, the main verb is ALWAYS in base form.
  - She can **speak** English. (not "she can speaks")
  - He would **like** coffee. (not "he would likes")
\`\`\`

## Can — Ability and Permission

**Can = poder (ability)** and also some uses of **saber**

| Spanish | English |
|---------|---------|
| Puedo hablar inglés. | I **can** speak English. |
| ¿Puedes ayudarme? | **Can** you help me? |
| Ella sabe nadar. | She **can** swim. |
| No puedo venir mañana. | I **can't** come tomorrow. |
| ¿Se puede fumar aquí? | **Can** you smoke here? / Is smoking allowed? |

## Can for Requests — Polite Forms

\`\`\`steps
title: Using can / could for polite requests
steps:
  - step: "**Can you...?** → ¿Puedes...? (direct but polite enough for most situations)"
  - step: "**Could you...?** → ¿Podrías...? (more polite — use with strangers or formal situations)"
  - step: "**Can I...?** → ¿Puedo...? (asking permission)"
  - step: "**Could I...?** → ¿Podría...? (more polite permission)"
  - step: "Examples: 'Can you help me?' / 'Could you speak more slowly, please?'"
\`\`\`

## Would Like — Polite Requests and Offers

**Would like = quisiera / me gustaría**

| Spanish | English |
|---------|---------|
| Quisiera un café. | I **would like** a coffee. / I'd like a coffee. |
| ¿Le gustaría algo más? | **Would** you **like** anything else? |
| Me gustaría ir. | I **would like** to go. / I'd like to go. |
| ¿Querría acompañarme? | **Would** you **like** to come with me? |

**Contraction:** would like → **I'd like** (this is the everyday spoken form)

## Should — Advice

**Should = debería** (for giving and asking advice)

| Spanish | English |
|---------|---------|
| Deberías estudiar más. | You **should** study more. |
| ¿Qué debería hacer? | What **should** I do? |
| No deberías llegar tarde. | You **shouldn't** be late. |
| Deberías hablar con tu jefe. | You **should** talk to your boss. |

\`\`\`compare
left:
  label: "❌ Modal verb errors"
  items:
    - "She cans speak French. (modals don't add -s)"
    - "I can to swim. ('to' not needed after can)"
    - "Can you to help me? ('to' not needed)"
    - "He would likes a coffee. (base form after would)"
right:
  label: "✅ Correct modal usage"
  items:
    - "She can speak French."
    - "I can swim. (no 'to')"
    - "Can you help me?"
    - "He would like a coffee."
\`\`\`

\`\`\`quiz
questions:
  - q: "She ___ speak three languages."
    options: ["cans", "can", "can to", "could to"]
    answer: 1
    explanation: "Modal verbs NEVER add -s: 'She can' (not 'She cans'). After can, use base form: 'She can speak' (not 'She can to speak')."
  - q: "How do you politely ask a stranger to repeat themselves?"
    options: ["Repeat please.", "Can you repeat?", "Could you repeat that, please?", "I need you repeat."]
    answer: 2
    explanation: "'Could you repeat that, please?' is the most polite form. 'Can you repeat that?' is also fine. 'Repeat please' sounds very abrupt."
  - q: "What is the contraction of 'I would like'?"
    options: ["I'would like", "I'd like", "I will like", "I'm like"]
    answer: 1
    explanation: "Would contracts to 'd: I would like → I'd like. This is the standard spoken form: 'I'd like a coffee, please.' Also: he'd like, she'd like, they'd like."
\`\`\`

\`\`\`takeaways
items:
  - "Modal verbs (can, could, would, should) NEVER change — no -s, always base verb after them"
  - "Can = poder (ability) + some uses of saber. I can swim, she can speak French."
  - "Could = more polite version of can. Use with strangers: 'Could you help me?'"
  - "Would like = quisiera. I'd like a coffee. Would you like some tea? Always use 'd like in speech."
  - "Should = debería. You should try this! What should I do?"
\`\`\``,
    vocabulary: [
      { word: "can", translation: "poder / saber (habilidad)", pronunciation: "/kæn/", exampleSentence: "I can speak a little English.", exampleTranslation: "Puedo/Sé hablar un poco de inglés.", partOfSpeech: "modal verb" },
      { word: "can't", translation: "no puedo / no sé", pronunciation: "/kɑːnt/", exampleSentence: "I can't find my keys!", exampleTranslation: "¡No encuentro mis llaves!", partOfSpeech: "modal verb (negative)" },
      { word: "could", translation: "podría / podrías", pronunciation: "/kʊd/", exampleSentence: "Could you speak more slowly, please?", exampleTranslation: "¿Podría hablar más despacio, por favor?", partOfSpeech: "modal verb" },
      { word: "should", translation: "debería", pronunciation: "/ʃʊd/", exampleSentence: "You should eat more vegetables.", exampleTranslation: "Deberías comer más verduras.", partOfSpeech: "modal verb" },
      { word: "I'd like", translation: "me gustaría / quisiera", pronunciation: "/aɪd laɪk/", exampleSentence: "I'd like to book a table for two.", exampleTranslation: "Quisiera reservar una mesa para dos.", partOfSpeech: "phrase (modal contraction)" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-7-3-v1",
        title: "At the Hotel Reception",
        situation: "You arrive at an English-speaking hotel and need to check in and ask for things",
        agentRole: "You are a hotel receptionist. Ask for name, check the booking, ask about needs. Practice can/could/would like with the student. If they say 'I want', model 'I'd like'. If they say 'she cans', model 'she can'.",
        userGoal: "Check in to a hotel, ask for things using can/could/would like",
        targetPhrases: ["I'd like to check in.", "Could you help me?", "Can I have...?", "I can't find...", "I would like..."],
        successCriteria: ["Uses can/could/would like without adding -s or 'to' after them", "Uses I'd like for polite requests", "Asks at least one question using 'Can I' or 'Could I'"],
        hints: ["I'd like to check in. My name is...", "Could you tell me where the lift is?", "Can I have an extra pillow, please?"],
      },
    ],
  },
];
