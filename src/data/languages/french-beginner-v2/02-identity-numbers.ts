import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────
// MODULE 2: Who Are You? (3 lessons)
// Identity, numbers, nationalities — the first real sentences
// ─────────────────────────────────────────────────────────

export const identityNumbersLessons: LanguageLesson[] = [
  // ── LESSON 5 ── Introducing Yourself ─────────────────────
  {
    id: "fr-l5",
    slug: "introducing-yourself",
    title: "Introducing Yourself — Être, Avoir & First Sentences",
    content: `# Introducing Yourself in French

To talk about who you are, you need two verbs above all others: **être** (to be) and **avoir** (to have). These are the most irregular and most important verbs in French — nearly every sentence uses one of them.

\`\`\`concept
{ "title": "Être and Avoir: Why These Two Come First", "variant": "info", "content": "Être (to be) and avoir (to have) are called auxiliary verbs — they help form compound tenses, passive voice, and dozens of set expressions. They're also the most irregular: their conjugations look nothing like their infinitives. Learn these by heart BEFORE learning regular verbs — you'll use them every single day." }
\`\`\`

## Être (to be) — Full Present Tense

| Pronoun | French | Pronunciation | English |
|---------|--------|--------------|---------|
| je | **suis** | SWEE | I am |
| tu | **es** | EH | you are (informal) |
| il / elle / on | **est** | EH | he/she/one is |
| nous | **sommes** | SOM | we are |
| vous | **êtes** | EHT | you are (formal/plural) |
| ils / elles | **sont** | SON (nasal) | they are |

\`\`\`concept
{ "title": "On — The Secret Third Person Singular", "variant": "analogy", "content": "'On' is one of the most used words in spoken French. Officially it means 'one' (as in 'one does not simply...'), but in everyday spoken French, 'on' almost always means 'we'. Spoken French: 'On va au cinéma ?' (Shall we go to the cinema?). Written French: 'Nous allons au cinéma.' They mean the same thing. You'll hear 'on' constantly — understand it as 'we' in most contexts." }
\`\`\`

## Avoir (to have) — Full Present Tense

| Pronoun | French | Pronunciation | English |
|---------|--------|--------------|---------|
| je | **ai** | EH | I have |
| tu | **as** | AH | you have |
| il / elle / on | **a** | AH | he/she has |
| nous | **avons** | ah-VON | we have |
| vous | **avez** | ah-VAY | you have |
| ils / elles | **ont** | ON (nasal) | they have |

## Avoir for Age — A Key Difference from English

French uses **avoir** (to have) for age, while English uses "to be":

| English | French (wrong!) | French (correct!) |
|---------|----------------|-------------------|
| I AM 25 years old | ~~Je suis 25 ans~~ | **J'ai 25 ans** |
| He IS 40 | ~~Il est 40 ans~~ | **Il a 40 ans** |
| She IS 8 | ~~Elle est 8 ans~~ | **Elle a 8 ans** |

\`\`\`concept
{ "title": "Expressions with AVOIR That Use 'Be' in English", "variant": "warning", "content": "Many physical and emotional states use AVOIR (have) in French where English uses 'to be':\\n• J'ai faim = I AM hungry (lit. I have hunger)\\n• J'ai soif = I AM thirsty (lit. I have thirst)\\n• J'ai chaud = I AM hot (lit. I have heat)\\n• J'ai froid = I AM cold (lit. I have cold)\\n• J'ai peur = I AM afraid (lit. I have fear)\\n• J'ai raison = I AM right (lit. I have reason)\\n• J'ai tort = I AM wrong (lit. I have wrong)\\nThis is a permanent trap for English speakers. Remember: hunger, thirst, temperature, fear → avoir." }
\`\`\`

## Building Your First Introduction

Using être + avoir, you can introduce yourself completely:

\`\`\`
Je m'appelle Sophie.          My name is Sophie.
Je suis française.            I am French (female).
J'ai trente ans.              I am thirty years old.
Je suis professeure.          I am a teacher.
Je suis de Lyon.              I am from Lyon.
J'ai un chien.                I have a dog.
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'I am 28 years old' in French?", "options": ["Je suis 28 ans.", "J'ai 28 ans.", "Je suis 28.", "J'ai 28 années."], "answer": 1, "explanation": "French uses AVOIR (to have) for age: 'j'ai 28 ans' (I have 28 years). Using 'je suis' for age is a classic English-speaker error. Also: 'années' is used for duration ('for 3 years'), but for age it's always 'ans'." }
\`\`\`

\`\`\`quiz
{ "question": "Which sentence correctly says 'We are from Paris'?", "options": ["On est de Paris.", "On sont de Paris.", "Nous sommes à Paris.", "Nous êtes de Paris."], "answer": 0, "explanation": "'On est de Paris' is correct — 'on' takes the same verb form as il/elle (third person singular), so 'on est'. 'Nous sommes de Paris' is also correct formal French. Note: 'nous êtes' is wrong — 'êtes' goes with 'vous', not 'nous'." }
\`\`\`

\`\`\`takeaways
{ "points": ["Être: suis, es, est, sommes, êtes, sont — memorise this as a unit", "Avoir: ai, as, a, avons, avez, ont — equally essential", "'On' = informal 'we' in spoken French — used more often than 'nous' in conversation", "French uses AVOIR for age, hunger, thirst, temperature, fear — NOT être", "J'ai X ans = I am X years old (lit. I have X years)"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m2",
    moduleTitle: "Who Are You?",
    order: 1,
    topicId: "fr-m2-l5-intro",
    vocabulary: [
      { word: "être", translation: "to be", pronunciation: "EH-truh", exampleSentence: "Je suis étudiant.", exampleTranslation: "I am a student.", partOfSpeech: "verb" },
      { word: "avoir", translation: "to have", pronunciation: "ah-VWAHR", exampleSentence: "J'ai faim.", exampleTranslation: "I am hungry.", partOfSpeech: "verb" },
      { word: "j'ai ... ans", translation: "I am ... years old", pronunciation: "zhay ... ahn", exampleSentence: "J'ai vingt-cinq ans.", exampleTranslation: "I am 25 years old.", partOfSpeech: "phrase" },
      { word: "je suis de", translation: "I am from", pronunciation: "zhuh swee duh", exampleSentence: "Je suis de Londres.", exampleTranslation: "I am from London.", partOfSpeech: "phrase" },
      { word: "j'ai faim", translation: "I am hungry", pronunciation: "zhay FAN", exampleSentence: "J'ai très faim.", exampleTranslation: "I am very hungry.", partOfSpeech: "phrase" },
      { word: "j'ai soif", translation: "I am thirsty", pronunciation: "zhay SWAHF", exampleSentence: "J'ai soif. Avez-vous de l'eau ?", exampleTranslation: "I'm thirsty. Do you have water?", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Subject Pronouns — The Complete Set",
        explanation: "French has 9 subject pronouns. Key differences from English: (1) French has 2 'you' forms (tu/vous). (2) 'Il' and 'elle' refer to things too, not just people — everything has gender. (3) 'On' is used as 'we' in speech. (4) 'Ils' is used for mixed-gender groups.",
        examples: [
          { correct: "Il est grand. (talking about a man OR a table)", translation: "He is tall / It is tall. — 'table' is feminine so would be 'elle'" },
          { correct: "Ils sont français. (one man + one woman)", translation: "They are French — mixed group uses masculine plural 'ils'" },
          { correct: "On va manger.", translation: "We're going to eat. — informal, spoken French" },
        ],
        commonMistakes: [
          { incorrect: "Je ai faim.", correction: "J'ai faim.", explanation: "'Je' becomes 'j'' before a vowel (elision). Je + ai → j'ai. This is mandatory." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m2-l5-voice",
        title: "Speed Dating Introductions",
        situation: "A French-themed speed introduction event — 90 seconds to introduce yourself",
        agentRole: "You are Olivier, the event host. Ask each participant their name, age, where they're from, and what they do for work.",
        userGoal: "Give a complete introduction: name, age, origin, and profession",
        targetPhrases: ["Je m'appelle", "J'ai ... ans", "Je suis de", "Je suis / Je travaille comme"],
        successCriteria: ["States name", "Gives age with avoir", "States origin", "Mentions a profession or activity"],
        hints: ["For age: 'J'ai [number] ans'", "For profession: 'Je suis étudiant(e)/professeur/médecin'"],
      },
    ],
    culturalNotes: [
      {
        title: "Don't Ask 'What Do You Do?' Too Early",
        content: "In France, asking 'Qu'est-ce que vous faites dans la vie ?' (What do you do for a living?) within the first minutes of meeting someone can feel intrusive — especially in social (non-networking) contexts. The French tend to build up to personal details more slowly than Americans or Australians. Start with where you're from, why you're in France, and let professional topics emerge naturally.",
        region: "France",
      },
    ],
  },

  // ── LESSON 6 ── Numbers, Dates & Time ────────────────────
  {
    id: "fr-l6",
    slug: "numbers-dates",
    title: "Numbers 0–100, Dates & Telling the Time",
    content: `# Numbers, Dates & Time in French

French numbers are mostly logical — but with a few famous traps that catch every English speaker: **soixante-dix** (70 = sixty-ten), **quatre-vingts** (80 = four-twenties), and **quatre-vingt-dix** (90 = four-twenty-ten). These are remnants of the old vigesimal (base-20) counting system.

\`\`\`concept
{ "title": "Why 70, 80, 90 Are So Weird", "variant": "analogy", "content": "Old French counted in base 20 (like the Mayans). Modern French preserved this for 70-99. Belgium and Switzerland solved this by inventing their own words: 'septante' (70), 'huitante/octante' (80), 'nonante' (90). If you think French 70-99 is irrational, you're right — but only if you live in France. Belgium and Switzerland are saner." }
\`\`\`

## Numbers 0–20

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| zéro | un/une | deux | trois | quatre | cinq | six | sept | huit | neuf | dix |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|----|----|----|----|----|----|----|----|----|-----|
| onze | douze | treize | quatorze | quinze | seize | dix-sept | dix-huit | dix-neuf | vingt |

## Numbers 21–69 — Regular Pattern

21 = vingt et un, 22 = vingt-deux ... 29 = vingt-neuf
30 = trente, 40 = quarante, 50 = cinquante, 60 = soixante

**Note:** Only multiples + "et un" use "et" (and): vingt **et** un, trente **et** un. But: 22 = vingt-**deux** (no "et").

## The Famous Traps: 70–99

| Number | French | Logic |
|--------|--------|-------|
| 70 | **soixante-dix** | 60 + 10 |
| 71 | **soixante et onze** | 60 + 11 |
| 72 | **soixante-douze** | 60 + 12 |
| 79 | **soixante-dix-neuf** | 60 + 19 |
| 80 | **quatre-vingts** | 4 × 20 (note the S!) |
| 81 | **quatre-vingt-un** | 4×20 + 1 (no S when followed by more!) |
| 90 | **quatre-vingt-dix** | 4×20 + 10 |
| 99 | **quatre-vingt-dix-neuf** | 4×20 + 19 |
| 100 | **cent** | straightforward |

\`\`\`concept
{ "title": "The Rule for Quatre-vingts (80)", "variant": "warning", "content": "'Quatre-vingts' has an S when it stands alone (80), but LOSES the S when followed by more digits:\\n• 80 = quatre-vingtS (stands alone — has S)\\n• 81 = quatre-vingt-un (followed by 'un' — no S)\\n• 85 = quatre-vingt-cinq (no S)\\nSame rule applies to 'cents' (hundreds): deux cents (200, alone) but deux cent dix (210, no S)." }
\`\`\`

## Dates in French

| Element | French | Example |
|---------|--------|---------|
| Days | lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche | lundi = Monday |
| Months | janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre | |
| Date format | le + cardinal number + month + year | **le 14 juillet 1789** |
| Exception | 1st = le **premier** (not "le un") | le 1er janvier |

**Full date: Le lundi 14 juillet** (Monday the 14th of July) — no capitals for days or months in French.

## Telling the Time

| Time | French | Notes |
|------|--------|-------|
| 1:00 | Il est une heure. | singular: une heure |
| 2:00 | Il est deux heures. | |
| 2:15 | Il est deux heures et quart. | + quarter past |
| 2:30 | Il est deux heures et demie. | + half (demie adds -e for feminine heure) |
| 2:45 | Il est trois heures moins le quart. | 3 hours minus quarter |
| 12:00 | Il est midi. / Il est minuit. | noon / midnight |

\`\`\`quiz
{ "question": "How do you say the number 87 in French?", "options": ["huitante-sept", "quatre-vingt-sept", "quatre-vingts-sept", "soixante-vingt-sept"], "answer": 1, "explanation": "'Quatre-vingt-sept' = 4×20 + 7 = 87. Note: NO S on 'vingt' because it's followed by 'sept' (only standalone 80 gets the S). 'Huitante-sept' is the Belgian/Swiss version, not used in France." }
\`\`\`

\`\`\`quiz
{ "question": "You need to say 'Today is Tuesday, March 1st' in French. Which is correct?", "options": ["Aujourd'hui est mardi, mars premier.", "Aujourd'hui c'est mardi le premier mars.", "Aujourd'hui est le mardi 1 mars.", "C'est le Mardi le premier Mars."], "answer": 1, "explanation": "The correct form is 'Aujourd'hui c'est mardi le premier mars.' Key rules: (1) days and months are lowercase in French; (2) Use 'premier' for the 1st, not 'un'; (3) 'c'est' not 'est' for 'it is today'." }
\`\`\`

\`\`\`takeaways
{ "points": ["0-69 follow a mostly logical pattern; 70-99 use base-20 arithmetic (60+10, 4×20)", "80 = quatre-vingtS but 81+ = quatre-vingt-X (no S when followed by more digits)", "Dates use cardinal numbers (14 juillet) except the 1st (le premier)", "Days and months are lowercase in French — no capitals", "Time: Il est + number + heure(s) + quart / demie / moins le quart"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m2",
    moduleTitle: "Who Are You?",
    order: 2,
    topicId: "fr-m2-l6-numbers",
    vocabulary: [
      { word: "soixante-dix", translation: "seventy (lit. sixty-ten)", pronunciation: "swah-SAHNT-DEES", exampleSentence: "Ma grand-mère a soixante-dix ans.", exampleTranslation: "My grandmother is seventy years old.", partOfSpeech: "number" },
      { word: "quatre-vingts", translation: "eighty (lit. four-twenties)", pronunciation: "KAT-ruh-VAN", exampleSentence: "Il y a quatre-vingts élèves.", exampleTranslation: "There are eighty students.", partOfSpeech: "number" },
      { word: "aujourd'hui", translation: "today", pronunciation: "oh-zhoor-DWEE", exampleSentence: "Aujourd'hui c'est lundi.", exampleTranslation: "Today is Monday.", partOfSpeech: "adverb" },
      { word: "demain", translation: "tomorrow", pronunciation: "duh-MAN", exampleSentence: "La réunion est demain.", exampleTranslation: "The meeting is tomorrow.", partOfSpeech: "adverb" },
      { word: "il est ... heures", translation: "it is ... o'clock", pronunciation: "eel-eh...UHR", exampleSentence: "Il est trois heures et demie.", exampleTranslation: "It is half past three.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Asking the Time and Date",
        explanation: "To ask the time: **Quelle heure est-il ?** or informal **Il est quelle heure ?** To ask the date: **Quelle est la date d'aujourd'hui ?** or **On est le combien aujourd'hui ?** To ask what day: **Quel jour sommes-nous ?** or **C'est quel jour ?**",
        examples: [
          { correct: "Il est quelle heure ? — Il est dix heures vingt.", translation: "What time is it? — It is 10:20." },
          { correct: "On est le combien ? — On est le quinze.", translation: "What's the date? — It's the 15th." },
          { correct: "C'est quel jour ? — C'est mercredi.", translation: "What day is it? — It's Wednesday." },
        ],
        commonMistakes: [
          { incorrect: "Il est dix heure.", correction: "Il est dix heures. (plural — add S)", explanation: "Hours are always plural (heures) when the number is 2 or more. Exception: il est une heure (singular)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m2-l6-voice",
        title: "Making a Restaurant Reservation by Phone",
        situation: "You call a Parisian restaurant to make a reservation",
        agentRole: "You are the restaurant host Céline. Ask how many people, what date, and what time they'd like the reservation.",
        userGoal: "Book a table for 2 people on Saturday at 8pm",
        targetPhrases: ["Je voudrais réserver", "pour deux personnes", "le samedi", "à vingt heures"],
        successCriteria: ["States number of people", "States the day correctly", "States the time using French hours"],
        hints: ["'Je voudrais réserver une table' = I'd like to reserve a table", "'à vingt heures' = at 8pm (French uses 24-hour time formally)"],
      },
    ],
    culturalNotes: [
      {
        title: "The 24-Hour Clock in French Life",
        content: "France uses the 24-hour clock in all official contexts: train schedules, restaurant reservations, TV listings, work hours. A dinner reservation at '20h30' means 8:30pm. Saying 'huit heures du soir' (8pm) is understood conversationally, but writing '8h' in a formal context would be ambiguous. On digital displays and written schedules, '20h30' is always what you'll see.",
        region: "France",
      },
    ],
  },

  // ── LESSON 7 ── Nationalities & Languages ────────────────
  {
    id: "fr-l7",
    slug: "nationalities-languages",
    title: "Countries, Nationalities & Languages — Your First Gender Agreement",
    content: `# Countries, Nationalities & Languages

This lesson introduces a concept that has no equivalent in English: **gender agreement**. In French, adjectives (including nationality adjectives) must agree in gender and number with the noun they describe. This lesson is your first controlled encounter with that system before we tackle it fully in Module 3.

\`\`\`concept
{ "title": "Nationality Words: Adjective or Noun?", "variant": "info", "content": "In English, 'French' is both adjective and noun: 'a French person' / 'the French'. In French, nationality words work differently:\\n\\n• As ADJECTIVE (describing a person/thing): lowercase, agrees in gender\\n  → 'Il est français.' / 'Elle est française.'\\n\\n• As NOUN (naming a group/person): capitalised\\n  → 'Un Français' (a French person, masc) / 'Une Française' (fem)\\n\\n• The LANGUAGE is always lowercase masculine:\\n  → 'Je parle français.' (I speak French — no article needed)" }
\`\`\`

## How Gender Agreement Works for Nationalities

The basic pattern — masculine adjective + feminine ending:

| Masculine | Feminine | Rule | Example |
|-----------|----------|------|---------|
| français | français**e** | add -e | Elle est française. |
| américain | américain**e** | add -e | Elle est américaine. |
| espagnol | espagnol**e** | add -e | Elle est espagnole. |
| allemand | allemand**e** | add -e | Elle est allemande. |
| japonais | japonais**e** | add -e | Elle est japonaise. |
| brésilien | brésilienN**e** | double n + e | Elle est brésilienne. |
| australien | australienN**e** | double n + e | Elle est australienne. |
| chinois | chinois**e** | add -e | Elle est chinoise. |

Some nationalities don't change at all (they end in -e already):
- **belge** → il est belge / elle est belge
- **suisse** → il est suisse / elle est suisse

\`\`\`compare
{ "title": "English vs French: Describing Nationality", "left": { "label": "English (no agreement)", "items": ["He is French.", "She is French.", "They are French.", "One word fits all — no changes"] }, "right": { "label": "French (must agree)", "items": ["Il est français. (masc)", "Elle est française. (fem, add -e)", "Ils sont français. (masc plural)", "Elles sont françaises. (fem plural, add -es)"] } }
\`\`\`

## Countries — Gender Matters for Prepositions

Countries in French have grammatical gender, and this affects which preposition you use:

| Country Gender | Preposition for 'in/to' | Preposition for 'from' | Examples |
|----------------|------------------------|----------------------|---------|
| Feminine (most countries ending in -e) | **en** | **de/d'** | en France, de France |
| Masculine | **au** | **du** | au Japon, du Japon |
| Plural | **aux** | **des** | aux États-Unis, des États-Unis |

\`\`\`steps
{ "title": "How to Identify Country Gender", "steps": [ { "title": "Ending in -e = probably feminine", "description": "la France, la Chine, l'Angleterre, l'Allemagne, l'Italie, l'Espagne, la Russie. Use 'en' for in/to." }, { "title": "Not ending in -e = usually masculine", "description": "le Japon, le Canada, le Portugal, le Maroc, le Mexique (exception! ends in -e but masc). Use 'au' for in/to." }, { "title": "Plural countries", "description": "les États-Unis (USA), les Pays-Bas (Netherlands). Use 'aux' for in/to, 'des' for from." }, { "title": "Island exceptions", "description": "Many islands use 'à': à Cuba, à Chypre, à Madagascar — regardless of gender." } ] }
\`\`\`

## Common Countries & Nationalities

| Country | Nationality (m/f) | Language |
|---------|------------------|---------|
| la France | français / française | le français |
| le Royaume-Uni | britannique / britannique | l'anglais |
| les États-Unis | américain / américaine | l'anglais |
| l'Espagne | espagnol / espagnole | l'espagnol |
| l'Allemagne | allemand / allemande | l'allemand |
| le Japon | japonais / japonaise | le japonais |
| la Chine | chinois / chinoise | le chinois |
| le Brésil | brésilien / brésilienne | le portugais |
| l'Inde | indien / indienne | le hindi |

\`\`\`quiz
{ "question": "Maria is from Spain. How would she say 'I am Spanish' in French?", "options": ["Je suis espagnol.", "Je suis espagnole.", "Je suis espagnole.", "Je suis Espagnole."], "answer": 1, "explanation": "Maria is female, so she uses the FEMININE form: 'espagnol' + e = 'espagnole'. The adjective is lowercase (not a proper noun when used with 'je suis'). So: 'Je suis espagnole.'" }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'I live in Japan' in French?", "options": ["Je vis en Japon.", "Je vis dans le Japon.", "Je vis au Japon.", "Je vis à Japon."], "answer": 2, "explanation": "'Japon' is masculine (doesn't end in -e), so you use 'au' (= à + le) for 'in/to'. Feminine countries use 'en': 'je vis en France'. Never use 'dans le' for countries." }
\`\`\`

\`\`\`takeaways
{ "points": ["Nationality adjectives agree in gender: add -e for feminine, -es for feminine plural", "Nationality adjectives = lowercase; nationality nouns (referring to the person) = capitalised", "Languages are always masculine and lowercase, and don't take an article after 'parler': 'je parle français'", "Feminine countries (ending in -e): use 'en' (in/to) and 'de' (from) — en France, de France", "Masculine countries: use 'au' (in/to) and 'du' (from) — au Japon, du Japon"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m2",
    moduleTitle: "Who Are You?",
    order: 3,
    topicId: "fr-m2-l7-nationalities",
    vocabulary: [
      { word: "anglais / anglaise", translation: "English (masc/fem)", pronunciation: "ahn-GLEH / ahn-GLEHZ", exampleSentence: "Je suis anglais et je parle anglais.", exampleTranslation: "I am English and I speak English.", partOfSpeech: "adjective" },
      { word: "je parle", translation: "I speak", pronunciation: "zhuh PAHRL", exampleSentence: "Je parle français et anglais.", exampleTranslation: "I speak French and English.", partOfSpeech: "verb phrase" },
      { word: "j'habite à / en / au", translation: "I live in", pronunciation: "zhah-BEET ah/ahn/oh", exampleSentence: "J'habite à Londres.", exampleTranslation: "I live in London.", partOfSpeech: "phrase" },
      { word: "je viens de", translation: "I come from", pronunciation: "zhuh VYEN duh", exampleSentence: "Je viens des États-Unis.", exampleTranslation: "I come from the United States.", partOfSpeech: "phrase" },
      { word: "quelle est ta nationalité ?", translation: "what is your nationality? (informal)", pronunciation: "KEHL eh tah nah-syoh-nah-lee-TAY", exampleSentence: "Quelle est ta nationalité ? Je suis canadien.", exampleTranslation: "What's your nationality? I'm Canadian.", partOfSpeech: "question" },
    ],
    grammarPoints: [
      {
        title: "Parler + Language — No Article Needed",
        explanation: "After the verb **parler** (to speak), languages are used WITHOUT any article. This is an exception to the usual rule that nouns need articles. Also: 'en français' (in French) — preposition 'en' + language, no article.",
        examples: [
          { correct: "Je parle français.", translation: "I speak French. (no 'le' before français)" },
          { correct: "Il apprend l'espagnol.", translation: "He is learning Spanish. (learning takes 'l'' article)" },
          { correct: "Dis-le en anglais.", translation: "Say it in English. (en + language, no article)" },
        ],
        commonMistakes: [
          { incorrect: "Je parle le français.", correction: "Je parle français.", explanation: "After 'parler', no article. But after other verbs like 'apprendre', 'aimer', you DO use the article: 'j'aime le français'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m2-l7-voice",
        title: "International Coffee Chat",
        situation: "You are at a Parisian café talking to fellow language learners from around the world",
        agentRole: "You are Priya, an Indian woman learning French. Ask the student where they're from, what languages they speak, and why they chose to learn French.",
        userGoal: "Discuss your nationality, the languages you speak, and why you're learning French",
        targetPhrases: ["Je suis", "je viens de", "je parle", "j'apprends le français"],
        successCriteria: ["Correctly states nationality with gender agreement", "Names at least one language spoken", "Explains motivation for learning French"],
        hints: ["'J'apprends le français parce que...' = I'm learning French because...", "For nationalities: add -e if you're female"],
      },
    ],
    culturalNotes: [
      {
        title: "La Francophonie — French Beyond France",
        content: "French is spoken by 321 million people across 5 continents — not just France. The term **Francophonie** refers to the community of French-speaking nations. French is the official language of 29 countries: Belgium, Switzerland, Canada (Quebec), Senegal, Côte d'Ivoire, Morocco, Tunisia, Madagascar, Haiti and many more. Each has its own accent, slang, and cultural flavour. Parisian French is just one variety — and often not the most globally spoken or economically significant variety.",
        region: "Global",
      },
    ],
  },
];
