// Module 4: Present Tense — The -s Trap & Do/Does Questions
// The he/she/it +s rule, do/does auxiliary, don't/doesn't negatives

import type { LanguageLesson } from "@/data/language-types";

export const presentTenseLessons: LanguageLesson[] = [
  // ── Lesson 1: Simple Present + The -s Trap ──────────────────────────────
  {
    id: "en-es-4-1",
    slug: "simple-present-s-trap",
    title: "El Presente Simple — La Trampa de la -s",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m4",
    moduleTitle: "Module 4: Present Tense",
    order: 1,
    topicId: "en-es-4-1-simple-present-s-trap",
    content: `# El Presente Simple — La Trampa de la -s

<!-- voice: English present tense looks simple — almost no conjugation. But there's one trap that Spanish speakers fall into constantly: the -s on he, she, it. 'He work' is wrong. 'He works' is right. Let's master this. -->

\`\`\`concept
title: English conjugation vs Spanish conjugation
body: |
  Spanish: hablo, hablas, habla, hablamos, habláis, hablan — 6 different endings.
  English: I speak, you speak, he speak**s**, we speak, they speak — only ONE change!

  The only change: add **-s** (or -es) for he, she, it.
  This is called "third person singular" — and forgetting it is the #1 grammar mistake
  for Spanish speakers in English.

  Ironically, Spanish speakers learn this rule but still forget it in speech because
  Spanish has no equivalent — every person has its own ending, so there's no
  "special case" to remember.
\`\`\`

## The Full Simple Present Table

| Spanish | English | Note |
|---------|---------|------|
| yo hablo | I **speak** | No ending |
| tú hablas | you **speak** | No ending |
| él/ella habla | he/she/it **speak**s | ADD -s! |
| nosotros hablamos | we **speak** | No ending |
| ellos/ellas hablan | they **speak** | No ending |

## The -s / -es Rule

For he/she/it, the spelling of the -s ending follows these rules:

\`\`\`steps
title: When to add -s vs -es
steps:
  - step: "Most verbs: just add **-s** → work → work**s**, eat → eat**s**, play → play**s**"
  - step: "Ends in -s, -sh, -ch, -x, -z: add **-es** → wash → wash**es**, watch → watch**es**"
  - step: "Ends in consonant + y: change y → i + **-es** → study → stud**ies**, carry → carr**ies**"
  - step: "Ends in vowel + y: just add **-s** → play → plays, say → says"
  - step: "Irregular: have → **has**, do → **does**, go → **goes**, be → **is**"
\`\`\`

## Common Verbs — Third Person Forms

| Base form | He/She/It form | Example |
|-----------|---------------|---------|
| work | work**s** | She works at a hospital. |
| eat | eat**s** | He eats breakfast at 8. |
| study | stud**ies** | She studies every night. |
| go | go**es** | He goes to school by bus. |
| have | **has** | She has two brothers. |
| do | **does** | He does his homework. |
| watch | watch**es** | She watches TV at night. |

## Uses of the Simple Present

\`\`\`steps
title: When to use the Simple Present
steps:
  - step: "**Habits/routines:** I eat breakfast every day. She goes to the gym on Mondays."
  - step: "**Permanent facts/truths:** Water boils at 100°C. The Earth orbits the sun."
  - step: "**General preferences:** I like coffee. She loves music. We prefer tea."
  - step: "**Scheduled future (timetables):** The train leaves at 9. The class starts at 8."
  - step: "**NOT for right now:** Use present continuous (I am eating) for actions happening now."
\`\`\`

\`\`\`compare
left:
  label: "❌ Missing the -s (most common error)"
  items:
    - "She work every day."
    - "He eat at 7."
    - "My mother go to the market."
    - "The dog bark all night."
right:
  label: "✅ With correct -s"
  items:
    - "She work**s** every day."
    - "He eat**s** at 7."
    - "My mother go**es** to the market."
    - "The dog bark**s** all night."
\`\`\`

\`\`\`quiz
questions:
  - q: "She ___ to work by bus every day."
    options: ["go", "goes", "gos", "is go"]
    answer: 1
    explanation: "'She' is third person singular (he/she/it), so you must add -s/-es. Go → goes (irregular, add -es not just -s)."
  - q: "My brother ___ three languages."
    options: ["speak", "speaks", "speakes", "is speak"]
    answer: 1
    explanation: "'My brother' = he = third person singular → speaks. 'Speak' + s = 'speaks' (regular verb)."
  - q: "Which sentence is WRONG?"
    options: ["I work at a bank.", "They study every night.", "She studys medicine.", "He watches TV."]
    answer: 2
    explanation: "'Studys' is wrong. When a verb ends in consonant + y, change y → i + es: study → studies. NOT 'studys'."
\`\`\`

\`\`\`takeaways
items:
  - "The ONLY change in English present tense: add -s (or -es) for he/she/it"
  - "Irregular: have → has, do → does, go → goes"
  - "Consonant + y: change to -ies (study → studies, carry → carries)"
  - "Use simple present for habits, facts, and preferences — NOT for what's happening right now"
  - "This -s is the #1 error for Spanish speakers — practice it every day until automatic"
\`\`\``,
    vocabulary: [
      { word: "works", translation: "trabaja (he/she)", pronunciation: "/wɜːrks/", exampleSentence: "She works at a hospital.", exampleTranslation: "Ella trabaja en un hospital.", partOfSpeech: "verb" },
      { word: "studies", translation: "estudia (he/she)", pronunciation: "/ˈstʌdiz/", exampleSentence: "He studies English every day.", exampleTranslation: "Él estudia inglés todos los días.", partOfSpeech: "verb" },
      { word: "has", translation: "tiene (he/she)", pronunciation: "/hæz/", exampleSentence: "She has two children.", exampleTranslation: "Ella tiene dos hijos.", partOfSpeech: "verb" },
      { word: "every day", translation: "todos los días", pronunciation: "/ˈɛvri deɪ/", exampleSentence: "I exercise every day.", exampleTranslation: "Hago ejercicio todos los días.", partOfSpeech: "phrase" },
      { word: "usually", translation: "normalmente", pronunciation: "/ˈjuːʒuəli/", exampleSentence: "He usually arrives early.", exampleTranslation: "Normalmente llega temprano.", partOfSpeech: "adverb" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-4-1-v1",
        title: "Describing a Family Member's Routine",
        situation: "Tell your English-speaking friend about your sibling or parent's daily life",
        agentRole: "You are an English-speaking friend curious about the student's family. Ask 'What does your [family member] do?' and 'Where does he/she work?' Listen for missing third-person -s and correct it gently.",
        userGoal: "Describe a family member's daily routine using correct third-person -s",
        targetPhrases: ["He/She works...", "He/She studies...", "He/She has...", "He/She goes..."],
        successCriteria: ["Adds -s/-es to third person singular verbs consistently", "Uses 'has' (not 'have') for he/she", "Describes a routine using simple present"],
        hints: ["My brother works at a bank.", "He wakes up at 6 and goes to work by train.", "My sister studies medicine at the university."],
      },
    ],
  },

  // ── Lesson 2: Do / Does — Questions and Negatives ───────────────────────
  {
    id: "en-es-4-2",
    slug: "do-does-questions-negatives",
    title: "Do / Does — Preguntas y Negaciones (¡Diferente al Español!)",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m4",
    moduleTitle: "Module 4: Present Tense",
    order: 2,
    topicId: "en-es-4-2-do-does-questions-negatives",
    content: `# Do / Does — Preguntas y Negaciones

<!-- voice: This is a major difference from Spanish. To ask a question in Spanish, you invert the verb: '¿Hablas inglés?' But in English, you can't do that with most verbs — you need the helper verb 'do' or 'does'. -->

\`\`\`concept
title: English questions need DO or DOES
body: |
  Spanish questions: invert verb + subject
  - ¿**Hablas** tú inglés? (verb moves forward)
  - ¿**Trabaja** ella aquí? (verb moves forward)

  English questions: add DO (or DOES) before the subject
  - **Do** you speak English? (NOT: Speak you English?)
  - **Does** she work here? (NOT: Works she here?)

  This is called an "auxiliary verb" or "helping verb".
  English uses it for questions AND negatives.
\`\`\`

## The Do / Does Pattern

| | Questions | Negatives |
|-|-----------|-----------|
| I / You / We / They | **Do** you speak English? | I **don't** speak French. |
| He / She / It | **Does** she work here? | She **doesn't** eat meat. |

**Critical rule:** When you use do/does, the MAIN verb returns to its base form (no -s!):
- She work**s** every day. ✅ (statement)
- Does she work every day? ✅ (question — 'works' → 'work', -s moves to 'does')
- She does**n't** work on weekends. ✅ (negative)

## Building Questions with Do/Does

\`\`\`steps
title: How to form a Do/Does question
steps:
  - step: "Start with the statement: 'You speak Spanish.'"
  - step: "Add DO/DOES at the beginning: 'Do you speak Spanish?'"
  - step: "The main verb loses its -s: 'She speaks' → 'Does she **speak**?' (NOT: Does she speaks?)"
  - step: "Add a question mark and use rising intonation at the end"
  - step: "Question words go BEFORE do/does: 'Where do you live?' 'What does she do?'"
\`\`\`

## Question Words + Do/Does

| English | Spanish | Example |
|---------|---------|---------|
| What **do** you...? | ¿Qué...? | What do you eat for breakfast? |
| Where **do** you...? | ¿Dónde...? | Where do you work? |
| When **does** she...? | ¿Cuándo...? | When does the class start? |
| Why **do** they...? | ¿Por qué...? | Why do they leave early? |
| How **do** you...? | ¿Cómo...? | How do you say this in English? |

## Short Answers

| Question | Yes | No |
|----------|-----|-----|
| Do you speak English? | Yes, I **do**. | No, I **don't**. |
| Does she live here? | Yes, she **does**. | No, she **doesn't**. |
| Do they work together? | Yes, they **do**. | No, they **don't**. |

\`\`\`compare
left:
  label: "❌ Spanish-style questions in English"
  items:
    - "Speak you English? (no DO)"
    - "Does she speaks English? (extra -s on main verb)"
    - "You live where? (question word at the end)"
    - "I don't to want coffee. (extra 'to')"
right:
  label: "✅ Correct English"
  items:
    - "Do you speak English?"
    - "Does she speak English? (main verb has no -s)"
    - "Where do you live? (question word first)"
    - "I don't want coffee."
\`\`\`

\`\`\`quiz
questions:
  - q: "___ she live in Madrid?"
    options: ["Do", "Does", "Is", "Have"]
    answer: 1
    explanation: "'She' is third person singular → use 'Does'. Do = I/you/we/they. Does = he/she/it."
  - q: "Which question is CORRECT?"
    options: ["Does he works here?", "Do he work here?", "Does he work here?", "He does work here?"]
    answer: 2
    explanation: "'He' → Does. The main verb loses its -s: 'works' → 'work'. Correct: 'Does he work here?'"
  - q: "How do you say '¿Por qué estudia ella inglés?' in English?"
    options: ["Why she studies English?", "Why does she study English?", "Why does she studies English?", "Does she study why English?"]
    answer: 1
    explanation: "Question word (Why) + Does + subject (she) + base verb (study, no -s). 'Why does she study English?'"
\`\`\`

\`\`\`takeaways
items:
  - "Use DO (I/you/we/they) and DOES (he/she/it) to form questions and negatives"
  - "With DO/DOES, the main verb goes back to its BASE form — no -s: Does she speak? (not speaks)"
  - "Negative: don't (do not) and doesn't (does not) — main verb stays in base form"
  - "Question words go BEFORE do/does: Where do you live? What does she eat?"
  - "Short answers: Yes, I do. / No, she doesn't. — never just 'Yes' or 'No' alone"
\`\`\``,
    vocabulary: [
      { word: "do / does", translation: "auxiliar de presente", pronunciation: "/duː/ /dʌz/", exampleSentence: "Do you speak English? Does she work here?", exampleTranslation: "¿Hablas inglés? ¿Trabaja ella aquí?", partOfSpeech: "auxiliary verb" },
      { word: "don't / doesn't", translation: "no (negación)", pronunciation: "/doʊnt/ /ˈdʌzənt/", exampleSentence: "I don't understand. She doesn't eat meat.", exampleTranslation: "No entiendo. Ella no come carne.", partOfSpeech: "negative auxiliary" },
      { word: "live", translation: "vivir", pronunciation: "/lɪv/", exampleSentence: "Where do you live?", exampleTranslation: "¿Dónde vives?", partOfSpeech: "verb" },
      { word: "speak", translation: "hablar", pronunciation: "/spiːk/", exampleSentence: "Do you speak Spanish?", exampleTranslation: "¿Hablas español?", partOfSpeech: "verb" },
      { word: "work", translation: "trabajar", pronunciation: "/wɜːrk/", exampleSentence: "Does he work on weekends?", exampleTranslation: "¿Trabaja él los fines de semana?", partOfSpeech: "verb" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-4-2-v1",
        title: "Getting to Know Someone",
        situation: "You're at a social event talking to an English speaker you've just met",
        agentRole: "You are a friendly English speaker at a social event. Ask questions using 'do you' and 'does your [family member]'. If the student forms questions without DO or puts -s on the main verb after DOES, gently model the correct form.",
        userGoal: "Ask and answer 5 questions using do/does correctly",
        targetPhrases: ["Do you...?", "Does he/she...?", "Where do you...?", "What do you do?", "I don't...", "She doesn't..."],
        successCriteria: ["Uses do/does to form questions (not inversion)", "Main verb is in base form after do/does", "Answers with short answers (Yes, I do / No, she doesn't)"],
        hints: ["What do you do? (= ¿A qué te dedicas?)", "Where do you live?", "Do you have any brothers or sisters?"],
      },
    ],
  },

  // ── Lesson 3: Present Continuous — What's Happening NOW ──────────────────
  {
    id: "en-es-4-3",
    slug: "present-continuous",
    title: "El Presente Continuo — Lo Que Pasa AHORA",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m4",
    moduleTitle: "Module 4: Present Tense",
    order: 3,
    topicId: "en-es-4-3-present-continuous",
    content: `# El Presente Continuo — Lo Que Pasa AHORA

<!-- voice: Spanish uses the present tense for both habits AND what's happening right now. English separates these: simple present for habits, present continuous for right now. 'I eat breakfast' versus 'I am eating breakfast'. -->

\`\`\`concept
title: Two presents in English — Spanish speakers often confuse them
body: |
  Spanish present covers BOTH:
  - "Como" = I eat (habit) AND I am eating (right now)

  English separates them:
  - **Simple present**: "I eat breakfast every day." (HABIT)
  - **Present continuous**: "I am eating breakfast right now." (HAPPENING NOW)

  Key signal words:
  - Simple present: every day, always, usually, often, never
  - Present continuous: now, right now, at the moment, currently, look! (he's running!)
\`\`\`

## Forming the Present Continuous

**Formula: am/is/are + verb + -ing**

| Subject | Form | Example |
|---------|------|---------|
| I | am + -ing | I **am working** right now. |
| You | are + -ing | You **are reading** this lesson. |
| He/She/It | is + -ing | She **is sleeping**. |
| We | are + -ing | We **are studying**. |
| They | are + -ing | They **are talking**. |

## Spelling Rules for -ing

\`\`\`steps
title: Adding -ing to verbs
steps:
  - step: "Most verbs: just add **-ing** → work → work**ing**, eat → eat**ing**, study → study**ing**"
  - step: "Ends in silent -e: drop the e, add **-ing** → write → writ**ing**, make → mak**ing**"
  - step: "Short vowel + single consonant: double the consonant → run → runn**ing**, swim → swimm**ing**, sit → sitt**ing**"
  - step: "Ends in -ie: change to -y + **ing** → lie → ly**ing**, die → dy**ing**"
\`\`\`

## Simple Present vs Present Continuous

| Simple Present (habit) | Present Continuous (now) |
|-----------------------|--------------------------|
| I eat lunch at 1. | I am eating lunch right now. |
| She works at a bank. | She is working from home today. |
| He usually reads at night. | He is reading a book at the moment. |
| They play football on Sundays. | Look! They are playing football! |

## Stative Verbs — Don't Use -ing with These!

Some verbs describe **states**, not actions. You don't use -ing with them:

| State verb | Wrong | Correct |
|------------|-------|---------|
| love | ~~I am loving this!~~ | I **love** this! |
| like | ~~I am liking coffee.~~ | I **like** coffee. |
| know | ~~I am knowing the answer.~~ | I **know** the answer. |
| want | ~~I am wanting water.~~ | I **want** water. |
| understand | ~~I am understanding.~~ | I **understand**. |
| need | ~~I am needing help.~~ | I **need** help. |

\`\`\`compare
left:
  label: "❌ Mixing up the two presents"
  items:
    - "I work right now. (should be continuous)"
    - "She is working every day. (should be simple)"
    - "Look, he runs! (should be continuous)"
    - "I am wanting a coffee. (state verb — no -ing)"
right:
  label: "✅ Correct forms"
  items:
    - "I am working right now."
    - "She works every day."
    - "Look, he is running!"
    - "I want a coffee."
\`\`\`

\`\`\`quiz
questions:
  - q: "Look! Maria ___ to school."
    options: ["walks", "is walking", "walk", "does walk"]
    answer: 1
    explanation: "'Look!' signals something happening right now → present continuous. 'Maria is walking to school.' The signal word 'look!' always means use -ing form."
  - q: "I ___ English every day after work."
    options: ["am studying", "study", "studies", "is studying"]
    answer: 1
    explanation: "'Every day' signals a habit → simple present. 'I study English every day.' Use continuous only for right now, not regular habits."
  - q: "Which sentence is WRONG?"
    options: ["She is sleeping right now.", "I am knowing the answer.", "They are playing football.", "We are having lunch."]
    answer: 1
    explanation: "'Know' is a stative verb — it describes a state, not an action. Never use: 'I am knowing'. Always: 'I know'. Other stative verbs: love, want, like, understand, need."
\`\`\`

\`\`\`takeaways
items:
  - "Simple present = habits and facts (every day, always, usually)"
  - "Present continuous = right now, at this moment (am/is/are + verb-ing)"
  - "Spelling: drop silent -e before -ing (write→writing), double consonant for short vowel (run→running)"
  - "Stative verbs (know, love, want, need, like, understand) never use -ing form"
  - "Signal words: 'right now / look / at the moment' → continuous. 'every day / always' → simple"
\`\`\``,
    vocabulary: [
      { word: "right now", translation: "ahora mismo", pronunciation: "/raɪt naʊ/", exampleSentence: "I am studying right now.", exampleTranslation: "Ahora mismo estoy estudiando.", partOfSpeech: "phrase" },
      { word: "at the moment", translation: "en este momento", pronunciation: "/æt ðə ˈmoʊmənt/", exampleSentence: "She is cooking at the moment.", exampleTranslation: "En este momento está cocinando.", partOfSpeech: "phrase" },
      { word: "running", translation: "corriendo", pronunciation: "/ˈrʌnɪŋ/", exampleSentence: "He is running in the park.", exampleTranslation: "Él está corriendo en el parque.", partOfSpeech: "verb (-ing)" },
      { word: "watching", translation: "viendo / mirando", pronunciation: "/ˈwɒtʃɪŋ/", exampleSentence: "They are watching a movie.", exampleTranslation: "Están viendo una película.", partOfSpeech: "verb (-ing)" },
      { word: "sleeping", translation: "durmiendo", pronunciation: "/ˈsliːpɪŋ/", exampleSentence: "The baby is sleeping.", exampleTranslation: "El bebé está durmiendo.", partOfSpeech: "verb (-ing)" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-4-3-v1",
        title: "Video Call Check-In",
        situation: "A family member calls you on video — describe what you and others around you are doing",
        agentRole: "You are a family member calling on video chat. Ask 'What are you doing right now?' and 'What is [name] doing?' Correct simple present vs continuous confusion and stative verb errors.",
        userGoal: "Describe what's happening around you right now using present continuous",
        targetPhrases: ["I am...-ing", "She/He is...-ing", "We are...-ing", "I want (not 'am wanting')", "I know (not 'am knowing')"],
        successCriteria: ["Uses present continuous for what's happening now", "Avoids -ing with stative verbs", "Correctly forms negative (I'm not studying, she isn't sleeping)"],
        hints: ["I am sitting at my desk.", "My sister is watching TV in the other room.", "I am studying English — I want to improve my speaking!"],
      },
    ],
  },
];
