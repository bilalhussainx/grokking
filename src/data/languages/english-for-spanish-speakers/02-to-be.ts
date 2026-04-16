// Module 2: "To Be" — English's One Verb for Ser AND Estar
// The #1 conceptual challenge for Spanish speakers:
// Spanish has ser + estar. English has ONE verb "to be" that does both.

import type { LanguageLesson } from "@/data/language-types";

export const toBeLessons: LanguageLesson[] = [
  // ── Lesson 1: Am / Is / Are — Present of "To Be" ────────────────────────
  {
    id: "en-es-2-1",
    slug: "am-is-are",
    title: "Am / Is / Are — El Presente de \"To Be\"",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m2",
    moduleTitle: "Module 2: To Be",
    order: 1,
    topicId: "en-es-2-1-am-is-are",
    content: `# Am / Is / Are — El Presente de "To Be"

<!-- voice: In Spanish you have two 'to be' verbs: ser and estar. In English there's only one — 'to be'. But it changes form based on the subject: I am, you are, he is. Let's master this critical verb. -->

\`\`\`concept
title: Ser + Estar = "To Be"
body: |
  Spanish uses TWO verbs where English uses ONE:
  - **Ser** → permanent/identity: soy médico, es alto, somos americanos
  - **Estar** → states/location: estoy cansado, está en casa, estamos bien

  English merges both into "**to be**" with one rule:
  - I **am** / You **are** / He-She-It **is** / We **are** / They **are**

  The good news: you only need to learn ONE conjugation table.
  The challenge: you must decide from context what Spanish verb would be used.
\`\`\`

## The Full "To Be" Table

| Spanish | English | Contraction |
|---------|---------|-------------|
| yo soy / estoy | I **am** | I**'m** |
| tú eres / estás | you **are** | you**'re** |
| él/ella es / está | he/she/it **is** | he**'s** / she**'s** / it**'s** |
| nosotros somos / estamos | we **are** | we**'re** |
| ellos/ellas son / están | they **are** | they**'re** |

**Note:** English doesn't have a vosotros form. "You" covers both tú and vosotros.

## Uses of "To Be"

\`\`\`steps
title: What "to be" replaces in English
steps:
  - step: "**Identity/profession (ser):** I am a teacher. She is a doctor. They are students."
  - step: "**Origin (ser):** I am from Mexico. He is American. We are Spanish."
  - step: "**Description/permanent (ser):** The sky is blue. She is tall. English is useful."
  - step: "**Feelings/states (estar):** I am tired. He is happy. We are hungry."
  - step: "**Location (estar):** The book is on the table. I am at home. She is in Madrid."
  - step: "**Weather (impersonal):** It is cold. It is sunny. It is hot today."
\`\`\`

## Negatives: "Not"

To make "to be" negative, simply add **not** after the verb:

| Positive | Negative | Contraction |
|----------|----------|-------------|
| I am tired. | I am **not** tired. | I**'m not** tired. |
| You are late. | You are **not** late. | You**'re not** / You **aren't** late. |
| He is Spanish. | He is **not** Spanish. | He**'s not** / He **isn't** Spanish. |
| We are ready. | We are **not** ready. | We**'re not** / We **aren't** ready. |

## Questions: Inversion

To ask a yes/no question with "to be", **move the verb before the subject**:

| Statement | Question |
|-----------|----------|
| You **are** from Spain. | **Are** you from Spain? |
| She **is** a teacher. | **Is** she a teacher? |
| It **is** cold. | **Is** it cold? |
| They **are** ready. | **Are** they ready? |

\`\`\`compare
left:
  label: "❌ Spanish-style errors"
  items:
    - "You are from Spain? (no inversion)"
    - "Is hot today. (missing 'It')"
    - "I not am tired. (wrong position of 'not')"
    - "Are you? (too short — missing context)"
right:
  label: "✅ Correct English"
  items:
    - "Are you from Spain? (verb first)"
    - "It is hot today. (mandatory 'It')"
    - "I am not tired. ('not' after 'am')"
    - "Are you tired? (full question)"
\`\`\`

## Short Answers

In English, we use short answers — not just "yes" or "no":

| Question | Yes answer | No answer |
|----------|-----------|-----------|
| Are you a student? | Yes, I am. | No, I'm not. |
| Is she from Mexico? | Yes, she is. | No, she isn't. |
| Are they ready? | Yes, they are. | No, they aren't. |

\`\`\`quiz
questions:
  - q: "Complete: '_____ she a doctor?'"
    options: ["Am", "Is", "Are", "Be"]
    answer: 1
    explanation: "He/she/it takes 'is'. So: Is she a doctor? For questions, put the verb before the subject."
  - q: "How do you say 'Estoy cansado' in English?"
    options: ["Am tired.", "I tired.", "I am tired.", "I is tired."]
    answer: 2
    explanation: "In English you MUST include 'I' and use 'am': I am tired. You can't drop the subject like in Spanish."
  - q: "Which is the correct negative form of 'She is happy'?"
    options: ["She not is happy.", "She is not happy.", "She no is happy.", "Not she is happy."]
    answer: 1
    explanation: "In English, 'not' comes AFTER 'to be': She is not happy. (or she isn't happy). Never put 'not' before the verb."
\`\`\`

\`\`\`takeaways
items:
  - "English has ONE 'to be' verb. It replaces BOTH ser AND estar."
  - "I am · You are · He/She/It is · We are · They are — memorize this table"
  - "Negative: add 'not' AFTER 'to be' — I am not, she is not, they are not"
  - "Questions: move 'to be' BEFORE the subject — Are you? Is she? Am I?"
  - "Always include the subject — never drop 'I', 'It', 'She', etc."
\`\`\``,
    vocabulary: [
      { word: "tired", translation: "cansado/a", pronunciation: "/ˈtaɪərd/", exampleSentence: "I am very tired today.", exampleTranslation: "Hoy estoy muy cansado.", partOfSpeech: "adjective" },
      { word: "hungry", translation: "hambriento/a (tener hambre)", pronunciation: "/ˈhʌŋɡri/", exampleSentence: "Are you hungry? Yes, I am!", exampleTranslation: "¿Tienes hambre? ¡Sí!", partOfSpeech: "adjective" },
      { word: "ready", translation: "listo/a / preparado/a", pronunciation: "/ˈrɛdi/", exampleSentence: "We are ready to start.", exampleTranslation: "Estamos listos para empezar.", partOfSpeech: "adjective" },
      { word: "happy", translation: "feliz / contento", pronunciation: "/ˈhæpi/", exampleSentence: "She is very happy today.", exampleTranslation: "Ella está muy contenta hoy.", partOfSpeech: "adjective" },
      { word: "from", translation: "de (origen)", pronunciation: "/frɒm/", exampleSentence: "I am from Mexico.", exampleTranslation: "Soy de México.", partOfSpeech: "preposition" },
    ],
    grammarPoints: [
      {
        title: "To Be: Present Tense",
        explanation: "The verb 'to be' is irregular and the most important verb in English. It replaces both 'ser' and 'estar' from Spanish. The three forms are: am (I), is (he/she/it), are (you/we/they).",
        examples: [
          { correct: "I am a student.", translation: "Soy estudiante.", note: "Identity (ser)" },
          { correct: "She is tired.", translation: "Está cansada.", note: "State (estar)" },
          { correct: "We are from Spain.", translation: "Somos de España.", note: "Origin (ser)" },
          { correct: "It is cold today.", translation: "Hoy hace frío.", note: "Weather — needs 'It'" },
        ],
        commonMistakes: [
          { incorrect: "I is from Mexico.", correction: "I am from Mexico.", explanation: "'Is' is only for he/she/it. Use 'am' with I." },
          { incorrect: "She not is ready.", correction: "She is not ready.", explanation: "'Not' comes AFTER 'to be', not before it." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "en-es-2-1-v1",
        title: "Meeting a New Classmate",
        situation: "First day of an English class. Meet another student and the teacher.",
        agentRole: "You are an English teacher on the first day of class. Ask students to introduce themselves: where they're from, what their job is, how they feel today. Correct 'to be' errors gently.",
        userGoal: "Introduce yourself using 'I am', say your origin, job, and current feeling",
        targetPhrases: ["I am [name]", "I am from [country]", "I am a [profession]", "I am [feeling] today"],
        successCriteria: ["Uses correct form of 'to be' (am/is/are)", "Includes subject pronouns", "Forms a question using inversion"],
        hints: ["Start: Hello, I am [name]. I am from [country].", "For job: I am a student / teacher / engineer", "For feeling: I am happy / nervous / excited to be here"],
      },
    ],
  },

  // ── Lesson 2: Was / Were — Past of "To Be" ──────────────────────────────
  {
    id: "en-es-2-2",
    slug: "was-were",
    title: "Was / Were — El Pasado de \"To Be\"",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m2",
    moduleTitle: "Module 2: To Be",
    order: 2,
    topicId: "en-es-2-2-was-were",
    content: `# Was / Were — El Pasado de "To Be"

<!-- voice: Now let's learn the past tense of 'to be'. In English, 'was' and 'were' replace BOTH 'era' and 'estaba' from Spanish. No imperfect vs preterite distinction at A1 level — just was and were. -->

\`\`\`concept
title: Was and Were replace Ser AND Estar in the past
body: |
  Spanish past: era/fue (ser) + estaba/estuvo (estar) = 4 forms to worry about.
  English past: **was** (singular) and **were** (plural) — just 2 forms.

  | Spanish | English |
  |---------|---------|
  | yo era / estaba / fui / estuve | I **was** |
  | tú eras / estabas | you **were** |
  | él era / estaba / fue / estuvo | he/she/it **was** |
  | nosotros éramos / estábamos | we **were** |
  | ellos eran / estaban | they **were** |
\`\`\`

## Was or Were? The Simple Rule

- **was** → I, he, she, it (singular)
- **were** → you, we, they (plural, and "you" singular too)

| English | Spanish equivalent |
|---------|------------------|
| I **was** tired yesterday. | Ayer estaba / estuve cansado. |
| She **was** a teacher. | Ella era / fue maestra. |
| We **were** in Madrid. | Estábamos / Estuvimos en Madrid. |
| They **were** happy. | Estaban / Estuvieron felices. |
| You **were** right! | ¡Tenías razón! / ¡Tenías razón! |

## Negative: Wasn't / Weren't

| Positive | Negative (full) | Negative (contraction) |
|----------|----------------|----------------------|
| I was there. | I was **not** there. | I **wasn't** there. |
| She was ready. | She was **not** ready. | She **wasn't** ready. |
| We were home. | We were **not** home. | We **weren't** home. |
| They were late. | They were **not** late. | They **weren't** late. |

## Questions: Was/Were Before the Subject

\`\`\`steps
title: Forming past questions with was/were
steps:
  - step: "Move was/were to the START: 'You were tired' → 'Were you tired?'"
  - step: "'She was at home' → 'Was she at home?'"
  - step: "'They were happy' → 'Were they happy?'"
  - step: "Short answers: Was she there? → Yes, she was. / No, she wasn't."
  - step: "Where question: 'Where were you yesterday?' — add a question word first"
\`\`\`

## Time Expressions for Past

These words signal past tense:

| English | Spanish | Example |
|---------|---------|---------|
| yesterday | ayer | I was sick **yesterday**. |
| last night | anoche | We were at a party **last night**. |
| last week | la semana pasada | **Last week** she was in New York. |
| ago | hace + tiempo | Two days **ago** (hace dos días). |
| in [year] | en [año] | In 2020, everything was different. |

\`\`\`compare
left:
  label: "❌ Common Spanish-speaker errors"
  items:
    - "I were at home. (wrong — I takes 'was')"
    - "Were not ready. (missing subject)"
    - "Yesterday I am at school. (present instead of past)"
    - "She was not there? (statement intonation for a question)"
right:
  label: "✅ Correct English"
  items:
    - "I was at home."
    - "We were not ready. / We weren't ready."
    - "Yesterday I was at school."
    - "Was she there? (invert for questions)"
\`\`\`

\`\`\`quiz
questions:
  - q: "Which is correct: 'Yesterday they ___ very happy'?"
    options: ["was", "were", "are", "am"]
    answer: 1
    explanation: "'They' uses 'were' (plural). Was = I/he/she/it. Were = you/we/they."
  - q: "How do you make 'She was at home' into a question?"
    options: ["She was at home?", "Was she at home?", "Did she was at home?", "She at home was?"]
    answer: 1
    explanation: "For questions with 'to be', move the verb before the subject: 'Was she at home?' Never use 'did' with 'to be'."
  - q: "Translate: 'Hace dos días estaba en Madrid.'"
    options: ["Two days ago I was in Madrid.", "Two days ago I am in Madrid.", "I was in Madrid two days before.", "I were in Madrid two days ago."]
    answer: 0
    explanation: "'Hace dos días' = 'Two days ago'. 'Estaba' = 'was'. Correct: 'Two days ago I was in Madrid.'"
\`\`\`

\`\`\`takeaways
items:
  - "Was = I, he, she, it (singular). Were = you, we, they (plural)"
  - "Was/Were replaces era/fue AND estaba/estuvo — no imperfect/preterite distinction needed at A1"
  - "Negative: wasn't / weren't — add 'not' after was/were"
  - "Questions: Was/Were goes BEFORE the subject — Was she? Were they?"
  - "Time signals: yesterday, last night, last week, ago, in [year]"
\`\`\``,
    vocabulary: [
      { word: "yesterday", translation: "ayer", pronunciation: "/ˈjɛstərdeɪ/", exampleSentence: "Yesterday I was very tired.", exampleTranslation: "Ayer estaba muy cansado.", partOfSpeech: "adverb" },
      { word: "last night", translation: "anoche", pronunciation: "/læst naɪt/", exampleSentence: "Last night we were at a restaurant.", exampleTranslation: "Anoche estuvimos en un restaurante.", partOfSpeech: "phrase" },
      { word: "ago", translation: "hace (tiempo)", pronunciation: "/əˈɡoʊ/", exampleSentence: "I was there two years ago.", exampleTranslation: "Estuve allí hace dos años.", partOfSpeech: "adverb" },
      { word: "late", translation: "tarde / con retraso", pronunciation: "/leɪt/", exampleSentence: "Sorry, I was late!", exampleTranslation: "¡Perdón, llegué tarde!", partOfSpeech: "adjective/adverb" },
      { word: "right", translation: "correcto / razón", pronunciation: "/raɪt/", exampleSentence: "You were right!", exampleTranslation: "¡Tenías razón!", partOfSpeech: "adjective" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-2-2-v1",
        title: "Talking About Your Weekend",
        situation: "Monday morning small talk — your English-speaking colleague asks about your weekend",
        agentRole: "You are a friendly English-speaking colleague. Ask about the student's weekend using 'were you...' and 'was it...'. Gently correct was/were errors. Keep the conversation casual.",
        userGoal: "Describe where you were and what it was like last weekend",
        targetPhrases: ["I was at...", "It was...", "We were...", "Yesterday I was..."],
        successCriteria: ["Correctly uses 'was' with I/he/she/it and 'were' with we/they", "Uses past tense consistently for past events", "Answers questions with short answers (Yes, it was / No, I wasn't)"],
        hints: ["Start: Last weekend I was at [place].", "To describe: It was [adjective] — great/fun/boring/interesting", "If asked who you were with: I was with my [friend/family]"],
      },
    ],
  },

  // ── Lesson 3: There is / There are + Contractions ────────────────────────
  {
    id: "en-es-2-3",
    slug: "there-is-there-are",
    title: "There is / There are — El Equivalente de \"Hay\"",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m2",
    moduleTitle: "Module 2: To Be",
    order: 3,
    topicId: "en-es-2-3-there-is-there-are",
    content: `# There is / There are — El Equivalente de "Hay"

<!-- voice: Spanish has one beautiful word: 'hay' — it means both 'there is' and 'there are'. English needs two: 'there is' for singular and 'there are' for plural. Plus contractions — the glue of spoken English. -->

\`\`\`concept
title: Hay = There is / There are
body: |
  Spanish: "**Hay** un libro." / "**Hay** dos libros." — same word for both.
  English: "**There is** a book." / "**There are** two books." — must match the noun.

  Rule:
  - **There is** (There's) → singular or uncountable: a book, some water, one problem
  - **There are** (There're) → plural: two books, many problems, some people

  The word "there" in this construction is NOT a place — don't translate it as "allí".
  "There is a problem" = "Hay un problema" (not "Allí hay un problema")
\`\`\`

## There is / There are in Action

| Spanish | English |
|---------|---------|
| Hay un problema. | **There is** a problem. / **There's** a problem. |
| Hay muchas personas. | **There are** many people. |
| ¿Hay un baño aquí? | **Is there** a bathroom here? |
| ¿Hay plátanos? | **Are there** any bananas? |
| No hay tiempo. | **There is no** time. / **There isn't** any time. |
| No hay preguntas. | **There are no** questions. / **There aren't** any questions. |

## Contractions — The Secret of Natural English

Spanish speakers often avoid contractions and sound too formal. In spoken English, contractions are **normal and expected**:

| Full form | Contraction | When to use |
|-----------|-------------|-------------|
| I am | **I'm** | Always in spoken English |
| You are | **You're** | Always in spoken English |
| He is / She is / It is | **He's / She's / It's** | Always in spoken English |
| We are | **We're** | Always in spoken English |
| They are | **They're** | Always in spoken English |
| There is | **There's** | Always in spoken English |
| is not | **isn't** | Very common |
| are not | **aren't** | Very common |
| was not | **wasn't** | Very common |
| were not | **weren't** | Very common |

\`\`\`steps
title: Contraction Practice — From Formal to Natural
steps:
  - step: "'I am happy' → natural speech: **I'm happy**"
  - step: "'There is a problem' → **There's a problem**"
  - step: "'It is not true' → **It isn't true** or **It's not true**"
  - step: "'They are not here' → **They aren't here** or **They're not here**"
  - step: "Warning: NEVER contract 'I am not' → write 'I'm not' (there is no 'amn't')"
\`\`\`

## How Much vs. How Many

Spanish uses "cuánto/cuánta" for uncountable and "cuántos/cuántas" for countable.
English separates these too:

| Countable (se puede contar) | Uncountable (no se puede contar) |
|----------------------------|----------------------------------|
| **How many** books are there? | **How much** water is there? |
| **How many** people? | **How much** money? |
| **How many** chairs? | **How much** time? |

\`\`\`compare
left:
  label: "❌ Common errors"
  items:
    - "There are a book on the table."
    - "There's many students."
    - "Is there bananas? (plural → 'are')"
    - "How many water? (uncountable → 'much')"
right:
  label: "✅ Correct English"
  items:
    - "There is a book on the table."
    - "There are many students."
    - "Are there any bananas?"
    - "How much water?"
\`\`\`

\`\`\`quiz
questions:
  - q: "_____ a bank near here?"
    options: ["Is there", "Are there", "There is", "There are"]
    answer: 0
    explanation: "'A bank' is singular, so use 'Is there'. Remember: for questions with there is/are, move 'is/are' before 'there'."
  - q: "How do you say 'No hay tiempo' in English?"
    options: ["There is no time.", "There are no time.", "There no is time.", "No there is time."]
    answer: 0
    explanation: "'Tiempo' (time) is uncountable → singular → 'There is no time.' Or: 'There isn't any time.'"
  - q: "Which contraction is WRONG?"
    options: ["I'm happy", "She's tired", "I amn't ready", "They're late"]
    answer: 2
    explanation: "'I amn't' does not exist in English. The correct form is 'I'm not ready'. You can never contract 'am not' into 'amn't'."
\`\`\`

\`\`\`takeaways
items:
  - "Hay = There is (singular) or There are (plural) — you must choose based on the noun"
  - "Questions: Is there a...? / Are there any...?"
  - "Negative: There isn't a... / There aren't any..."
  - "Contractions are NORMAL in English — use them in speech and informal writing"
  - "How much (uncountable: water, money, time) vs How many (countable: books, people, chairs)"
\`\`\``,
    vocabulary: [
      { word: "there is / there's", translation: "hay (singular)", pronunciation: "/ðɛr ɪz/ / /ðɛrz/", exampleSentence: "There's a great restaurant nearby.", exampleTranslation: "Hay un buen restaurante cerca.", partOfSpeech: "phrase" },
      { word: "there are", translation: "hay (plural)", pronunciation: "/ðɛr ɑːr/", exampleSentence: "There are many people here.", exampleTranslation: "Hay mucha gente aquí.", partOfSpeech: "phrase" },
      { word: "any", translation: "alguno/a, ninguno/a", pronunciation: "/ˈɛni/", exampleSentence: "Are there any questions?", exampleTranslation: "¿Hay alguna pregunta?", partOfSpeech: "determiner" },
      { word: "how much", translation: "cuánto/a (incontable)", pronunciation: "/haʊ mʌtʃ/", exampleSentence: "How much does it cost?", exampleTranslation: "¿Cuánto cuesta?", partOfSpeech: "phrase" },
      { word: "how many", translation: "cuántos/as (contable)", pronunciation: "/haʊ ˈmɛni/", exampleSentence: "How many people are there?", exampleTranslation: "¿Cuántas personas hay?", partOfSpeech: "phrase" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-2-3-v1",
        title: "Describing Your Neighborhood",
        situation: "A new English-speaking neighbor asks about the neighborhood",
        agentRole: "You are a new neighbor asking about the area. Ask questions using 'Is there a...?' and 'Are there any...?' and 'How many...?'. Correct there is/are errors naturally.",
        userGoal: "Describe what's in the neighborhood using 'there is' and 'there are'",
        targetPhrases: ["There is a...", "There are...", "There isn't a...", "There are no...", "Yes, there is", "No, there aren't"],
        successCriteria: ["Correctly uses there is vs there are based on number", "Uses contractions naturally (there's)", "Answers questions with short answers"],
        hints: ["There's a supermarket on the corner.", "There are three parks nearby.", "There isn't a cinema, but there's a theater."],
      },
    ],
  },
];
