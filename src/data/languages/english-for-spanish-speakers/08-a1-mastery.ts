// Module 8: A1 Mastery — Capstone + Next Steps
// Future plans with going to / will, connectors for discourse, A1 checklist

import type { LanguageLesson } from "@/data/language-types";

export const a1MasteryLessons: LanguageLesson[] = [
  // ── Lesson 1: Future Plans — Going To & Will ─────────────────────────────
  {
    id: "en-es-8-1",
    slug: "going-to-will",
    title: "El Futuro — Going To y Will",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m8",
    moduleTitle: "Module 8: A1 Mastery",
    order: 1,
    topicId: "en-es-8-1-going-to-will",
    content: `# El Futuro — Going To y Will

<!-- voice: Spanish future is simple: hablaré, comerás. English has two main future forms: 'going to' for planned things and 'will' for spontaneous decisions or predictions. At A1, you need both. -->

\`\`\`concept
title: Two futures in English — both very common
body: |
  Spanish: a single future tense. "Hablaré" covers most situations.
  English: two main future forms, each with a different "feel":

  **Going to** (be + going to + base verb):
  → Plans you've already decided, evidence-based predictions
  → "I **am going to** visit my family next week." (planned)
  → "Look at those clouds — it **is going to** rain." (evidence)

  **Will** (will + base verb):
  → Spontaneous decisions, promises, predictions without evidence
  → "I'**ll** help you with that!" (decided right now)
  → "I think it **will** be a great trip." (prediction/opinion)

  At A1, use GOING TO for plans and WILL for offers and predictions.
\`\`\`

## Going To — For Plans and Evidence

**Formula: am/is/are + going to + base verb**

| Spanish | English |
|---------|---------|
| Voy a estudiar esta noche. | I **am going to** study tonight. / I**'m going to** study tonight. |
| Ella va a visitar a su madre. | She **is going to** visit her mother. / She**'s going to**... |
| Van a abrir un nuevo restaurante. | They **are going to** open a new restaurant. |
| ¿Vas a venir mañana? | **Are you going to** come tomorrow? |
| No voy a llegar tarde. | I**'m not going to** be late. |

**Spoken English:** "going to" is often pronounced "**gonna**" in casual speech.
This is fine to understand, but don't write it in formal contexts.

## Will — For Spontaneous Decisions and Promises

**Formula: will + base verb (same for ALL subjects)**

| Spanish | English |
|---------|---------|
| Te ayudaré. | I**'ll** help you. |
| ¿Vendrás? | **Will** you come? |
| Creo que lloverá. | I think it **will** rain. |
| No lo haré. | I **won't** do it. |
| Ella no llegará tarde. | She **won't** be late. |

**Contractions:** will → **'ll** (I'll, you'll, he'll, she'll, we'll, they'll)
**Negative:** will not → **won't**

\`\`\`compare
left:
  label: "Going to (plans)"
  items:
    - "I'm going to buy a new phone next week. (already decided)"
    - "Are you going to come to the party? (asking about a plan)"
    - "Look — she's going to fall! (obvious from evidence)"
    - "We're going to study English every day. (plan/intention)"
right:
  label: "Will (spontaneous/predictions)"
  items:
    - "— The bag is too heavy. — I'll carry it for you! (decided now)"
    - "I think you'll love this film. (prediction/opinion)"
    - "— Do we have milk? — I'll go buy some. (spontaneous offer)"
    - "I promise I won't be late. (promise)"
\`\`\`

\`\`\`steps
title: How to form going to questions
steps:
  - step: "Move am/is/are to the front: 'You are going to come.' → 'Are you going to come?'"
  - step: "Add question word first: 'What are you going to do?' 'Where is she going to go?'"
  - step: "Negative: just add 'not': 'I'm not going to do that.' / 'He isn't going to come.'"
  - step: "For will questions: Will + subject + base verb: 'Will you help me?'"
  - step: "Negative will: won't = will not: 'I won't forget.' / 'She won't agree.'"
\`\`\`

\`\`\`quiz
questions:
  - q: "Your friend just dropped her bag. You want to help immediately. Which is more natural?"
    options: ["I'm going to help you.", "I'll help you!", "I help you.", "I am helping you."]
    answer: 1
    explanation: "'I'll help you!' is perfect for a spontaneous decision made RIGHT NOW. 'Going to' would mean you already planned it in advance. Spontaneous = will."
  - q: "She has bought tickets for next month. Which sentence is correct?"
    options: ["She will visit Paris next month.", "She is going to visit Paris next month.", "She visits Paris next month.", "She visiting Paris next month."]
    answer: 1
    explanation: "Having bought tickets shows this is a PLAN — use 'going to'. 'She is going to visit Paris next month.' Will is more for predictions or spontaneous decisions."
  - q: "What is the negative of 'will'?"
    options: ["willn't", "won't", "wouldn't", "will not to"]
    answer: 1
    explanation: "Will not contracts to WON'T (not 'willn't'). 'I won't be late.' 'She won't come.' 'They won't understand.'"
\`\`\`

\`\`\`takeaways
items:
  - "Going to = plans already made, evidence-based predictions: 'I'm going to start a new job'"
  - "Will = spontaneous decisions, promises, predictions/opinions: 'I'll call you later'"
  - "Formula: am/is/are + going to + BASE VERB. Will + BASE VERB (no 'to' after will)"
  - "Won't = will not. Much easier than Spanish future negatives!"
  - "'Gonna' is the casual pronunciation of 'going to' — you'll hear it constantly"
\`\`\``,
    vocabulary: [
      { word: "going to", translation: "ir a (futuro planeado)", pronunciation: "/ˈɡoʊɪŋ tuː/", exampleSentence: "I'm going to start a new course next month.", exampleTranslation: "Voy a empezar un nuevo curso el mes que viene.", partOfSpeech: "future form" },
      { word: "will / 'll", translation: "futuro espontáneo / predicciones", pronunciation: "/wɪl/", exampleSentence: "I'll call you tomorrow, I promise.", exampleTranslation: "Te llamaré mañana, lo prometo.", partOfSpeech: "modal verb (future)" },
      { word: "won't", translation: "no (futuro negativo)", pronunciation: "/woʊnt/", exampleSentence: "Don't worry, I won't forget.", exampleTranslation: "No te preocupes, no olvidaré.", partOfSpeech: "negative future" },
      { word: "next week", translation: "la semana que viene / próxima semana", pronunciation: "/nɛkst wiːk/", exampleSentence: "Are you going to study next week?", exampleTranslation: "¿Vas a estudiar la semana que viene?", partOfSpeech: "phrase" },
      { word: "probably", translation: "probablemente", pronunciation: "/ˈprɒbəbli/", exampleSentence: "I'll probably be a bit late.", exampleTranslation: "Probablemente llegue un poco tarde.", partOfSpeech: "adverb" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-8-1-v1",
        title: "Planning a Trip",
        situation: "You and an English-speaking friend are planning a trip together",
        agentRole: "You are an English-speaking friend planning a holiday. Ask 'Where are we going to go?' 'What will the weather be like?' 'What are you going to pack?' Mix spontaneous decisions ('I'll book the hotel now!') with plans ('We're going to fly on Friday').",
        userGoal: "Discuss travel plans using going to for decided plans and will for spontaneous ideas",
        targetPhrases: ["We're going to...", "I'll...", "Are you going to...?", "I won't forget to...", "I think it will be..."],
        successCriteria: ["Uses going to for plans (not will)", "Uses will for spontaneous decisions", "Forms going to questions correctly (Are you going to...?)"],
        hints: ["I'm going to visit Barcelona next month.", "I'll bring my camera — just decided!", "Are you going to stay in a hotel or an apartment?"],
      },
    ],
  },

  // ── Lesson 2: Connecting Ideas — Discourse Markers ───────────────────────
  {
    id: "en-es-8-2",
    slug: "connectors-discourse",
    title: "Conectores — Hablar en Párrafos, No en Frases Sueltas",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m8",
    moduleTitle: "Module 8: A1 Mastery",
    order: 2,
    topicId: "en-es-8-2-connectors-discourse",
    content: `# Conectores — Hablar en Párrafos, No en Frases Sueltas

<!-- voice: The difference between sounding A1 and B1 isn't just vocabulary — it's how you connect your ideas. Today we learn the connectors that let you link sentences and speak in longer, more natural paragraphs. -->

\`\`\`concept
title: Connectors transform broken English into flowing English
body: |
  Without connectors (sounds robotic):
  "I went to school. I studied English. I ate lunch. I went home. I watched TV."

  With connectors (sounds natural):
  "I went to school **and** studied English. **Then** I ate lunch **before** going home.
  **In the evening**, I watched TV **because** I wanted to relax."

  These same connectors work in BOTH English and Spanish — many are cognates:
  - and = y
  - but = pero
  - because = porque
  - however = sin embargo
  - therefore = por lo tanto
\`\`\`

## Addition & Contrast Connectors

| Connector | Use | Example |
|-----------|-----|---------|
| **and** | adding | I speak Spanish **and** English. |
| **also / too** | adding (softer) | She also speaks French. / She speaks French, too. |
| **but** | contrast | I like coffee, **but** I prefer tea. |
| **however** | contrast (more formal) | I like coffee. **However**, I prefer tea. |
| **although / even though** | contrast within sentence | **Although** it was cold, we went out. |
| **on the other hand** | showing another angle | It's expensive. **On the other hand**, it's very good. |

## Sequence & Time Connectors

| Connector | Use | Example |
|-----------|-----|---------|
| **first** | beginning | **First**, I wake up at 7. |
| **then / next** | following | **Then** I have breakfast. |
| **after that** | following | **After that**, I go to work. |
| **finally** | ending | **Finally**, I go to bed at 11. |
| **before** | earlier action | I always study **before** dinner. |
| **after** | later action | I relax **after** work. |
| **when** | at the same time | I listen to music **when** I drive. |

## Reason & Result

| Connector | Use | Example |
|-----------|-----|---------|
| **because** | reason | I study English **because** I love languages. |
| **so** | result/conclusion | I was tired, **so** I went to bed early. |
| **therefore** | formal result | It's raining. **Therefore**, we'll stay inside. |
| **that's why** | informal result | I love cooking. **That's why** I make my own food. |

\`\`\`steps
title: Transforming A1 sentences into natural English
steps:
  - step: "Instead of: 'I was tired. I went to bed.' → 'I was tired, **so** I went to bed.'"
  - step: "Instead of: 'I like Spanish. I like English.' → 'I like **both** Spanish **and** English.'"
  - step: "Instead of: 'I went. I ate. I came home.' → 'I went, ate, **and then** came home.'"
  - step: "Instead of two short sentences: use 'because' → 'I left early **because** I had a meeting.'"
  - step: "Start answers with a connector: 'Well, I think...' / 'Actually, ...' / 'To be honest,...'"
\`\`\`

## Discourse Fillers — Sound More Natural

These words give you thinking time and sound natural:

| Filler | Spanish equivalent | When to use |
|--------|--------------------|-------------|
| **Well,** | Bueno, / Pues, | Starting or hesitating |
| **Actually,** | En realidad, | Correcting or surprising |
| **I mean,** | O sea, / Es decir, | Clarifying |
| **You know?** | ¿Sabes? / ¿Entiendes? | Checking understanding |
| **So,** | Entonces, | Introducing a conclusion |
| **Right?** | ¿Verdad? / ¿No? | Checking agreement |
| **Basically,** | Básicamente, | Simplifying |

\`\`\`quiz
questions:
  - q: "Choose the best connector: 'I was hungry ___ I didn't have time to eat.'"
    options: ["so", "because", "but", "therefore"]
    answer: 2
    explanation: "'But' shows contrast between two opposing ideas: hungry VS no time. 'I was hungry but I didn't have time to eat.' (So = result. Because = reason.)"
  - q: "Which sentence sounds most natural?"
    options: ["I study. I work. I cook.", "I study, work, and also I cook.", "I study, work, and cook.", "I study and I work and I cook."]
    answer: 2
    explanation: "In English, when listing 3+ things, use commas + 'and' before the last: 'I study, work, and cook.' This is called the Oxford comma style."
  - q: "Complete: 'I love the city. ___, it's very expensive.'"
    options: ["Because", "So", "However", "And"]
    answer: 2
    explanation: "'However' introduces a contrast to what was just said. 'I love the city. However, it's very expensive.' = positive first, then contrasting negative. (But = less formal version)"
\`\`\`

\`\`\`takeaways
items:
  - "And/But/So/Because are your basic connectors — use them constantly"
  - "Sequence: First... Then... After that... Finally... — use for describing routines and events"
  - "Because = reason (I left because...). So = result (I was tired, so...)"
  - "However/Although are more formal versions of But — great for writing"
  - "Discourse fillers (Well, Actually, I mean) make you sound natural — use them"
\`\`\``,
    vocabulary: [
      { word: "however", translation: "sin embargo / no obstante", pronunciation: "/haʊˈɛvər/", exampleSentence: "I love English. However, it's not easy.", exampleTranslation: "Me encanta el inglés. Sin embargo, no es fácil.", partOfSpeech: "connector" },
      { word: "although", translation: "aunque", pronunciation: "/ɔːlˈðoʊ/", exampleSentence: "Although I was tired, I finished the work.", exampleTranslation: "Aunque estaba cansado, terminé el trabajo.", partOfSpeech: "connector" },
      { word: "therefore", translation: "por lo tanto", pronunciation: "/ˈðɛrfɔːr/", exampleSentence: "She studied hard. Therefore, she passed the exam.", exampleTranslation: "Estudió mucho. Por lo tanto, aprobó el examen.", partOfSpeech: "connector" },
      { word: "actually", translation: "en realidad / de hecho", pronunciation: "/ˈæktʃuəli/", exampleSentence: "Actually, I think you're right.", exampleTranslation: "En realidad, creo que tienes razón.", partOfSpeech: "discourse marker" },
      { word: "basically", translation: "básicamente", pronunciation: "/ˈbeɪsɪkli/", exampleSentence: "Basically, you need to practice every day.", exampleTranslation: "Básicamente, necesitas practicar todos los días.", partOfSpeech: "discourse marker" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-8-2-v1",
        title: "Telling Your Life Story",
        situation: "An English conversation partner asks you to tell them about yourself — your background, interests, and plans",
        agentRole: "You are an English conversation partner interested in the student's life. After each thing they say, ask a follow-up question. Listen for connector use and note when they could have connected two sentences. Compliment natural connector use.",
        userGoal: "Tell a 2-minute story about yourself using at least 6 different connectors",
        targetPhrases: ["First,", "Then,", "because", "but", "however", "so", "also", "and", "although"],
        successCriteria: ["Uses at least 5 different connectors naturally", "Connects sentences rather than listing them separately", "Uses at least one discourse filler (well, actually, basically)"],
        hints: ["Well, I'm from Madrid. I moved to London three years ago because I wanted to improve my English.", "I love the city, although it's quite expensive. However, the opportunities are amazing.", "I'm studying English and also going to evening classes. So I'm quite busy, but I enjoy it!"],
      },
    ],
  },

  // ── Lesson 3: A1 Capstone — Full Review + A2 Roadmap ────────────────────
  {
    id: "en-es-8-3",
    slug: "a1-capstone-review",
    title: "A1 Capstone — Revisión Completa y Hoja de Ruta para A2",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m8",
    moduleTitle: "Module 8: A1 Mastery",
    order: 3,
    topicId: "en-es-8-3-a1-capstone-review",
    content: `# A1 Capstone — Revisión Completa y Hoja de Ruta para A2

<!-- voice: Congratulations on reaching the final lesson! Today we review everything you've learned, celebrate your progress, and map out what comes next in your English journey. You've come a long way from lesson one. -->

\`\`\`concept
title: What you can do at A1
body: |
  At A1, you can:
  ✅ Introduce yourself and give basic personal information
  ✅ Understand simple questions and answer them
  ✅ Describe people, places, and things in basic sentences
  ✅ Talk about habits and routines (simple present)
  ✅ Say what's happening right now (present continuous)
  ✅ Talk about the past (simple past + was/were + did/didn't)
  ✅ Talk about plans and predictions (going to + will)
  ✅ Use can/could/would like for ability and requests
  ✅ Tell the time and talk about numbers
  ✅ Connect your ideas with basic connectors

  That's already real communicative ability!
\`\`\`

## The A1 Grammar Checklist — For Spanish Speakers

\`\`\`steps
title: Your Complete A1 Grammar Checklist
steps:
  - step: "✅ **To be (present)**: I am, you are, he/she/it is, we are, they are"
  - step: "✅ **To be (past)**: I was, you were, she was, we were, they were"
  - step: "✅ **There is / there are** (= hay): There's a problem. Are there any seats?"
  - step: "✅ **Articles**: a/an (indefinite, no gender), the (definite), zero article"
  - step: "✅ **Adjectives before noun**: a big red house (not 'a house big red')"
  - step: "✅ **Simple present + 3rd person -s**: she works, he studies, it goes"
  - step: "✅ **Do/Does for questions and negatives**: Do you? Does she? I don't. She doesn't."
  - step: "✅ **Present continuous**: I am working. She is sleeping. Are you coming?"
  - step: "✅ **Simple past -ed**: I worked, she studied, we stopped"
  - step: "✅ **Top 20 irregular past verbs**: went, came, had, made, saw, thought..."
  - step: "✅ **Did/Didn't**: Did you go? She didn't come. Where did they eat?"
  - step: "✅ **Going to**: I'm going to study. Are you going to come?"
  - step: "✅ **Will/Won't**: I'll help. She won't be late. Will you come?"
  - step: "✅ **Modal verbs**: can, could, should, would like — no -s, base verb after"
  - step: "✅ **Possessives**: my, your, his, her, its, our, their + 's for ownership"
  - step: "✅ **Frequency adverbs**: always before main verb, after 'to be'"
\`\`\`

## The Spanish→English Traps You've Conquered

\`\`\`compare
left:
  label: "Traps you've learned to avoid"
  items:
    - "Dropping subject pronouns (Am tired → I am tired)"
    - "H is silent in Spanish but NOT in English (hello, happy, house)"
    - "V and B are the same in Spanish — but DIFFERENT in English"
    - "Adding -s to he/she/it (she work → she works)"
    - "Using Spanish word order for questions (Speak you? → Do you speak?)"
    - "False friends (embarazada, librería, actualmente)"
    - "Adjective after noun (casa roja → red house)"
    - "Article gender (la mesa → the table)"
right:
  label: "What you do correctly now"
  items:
    - "I am tired. It is raining. She is happy."
    - "Hello, happy, house — audible H sound"
    - "V = top teeth on lower lip. B = both lips."
    - "He works, she studies, it goes"
    - "Do you speak? Does she live? Where did you go?"
    - "Embarrassed ≠ embarazada. Library ≠ librería. Actually ≠ actualmente."
    - "A red house. An interesting film. A beautiful woman."
    - "The table. The book. The house. (always 'the', no gender)"
\`\`\`

## What You Know vs What Comes at A2

| A1 (you have this) | A2 (what's coming next) |
|-------------------|------------------------|
| Simple present | Present perfect (I have lived, she has worked) |
| Simple past | Past continuous (I was working when...) |
| Going to / will | More conditional (would, if + present) |
| Basic adjectives | Comparatives (bigger, more expensive, the best) |
| Can/could/should | More modals: must, might, may, have to |
| There is/are | Quantifiers: some, any, much, many, a lot of, few |
| Basic connectors | More complex discourse markers |

## Your A2 Roadmap

\`\`\`steps
title: What to do next
steps:
  - step: "**Consolidate A1 first**: Can you introduce yourself smoothly? Tell a story? Make plans? Practice until it's automatic."
  - step: "**Learn 5 new words a day**: Vocabulary is the biggest factor in progress. Use flashcards or a word app."
  - step: "**Listen to English every day**: Podcasts for learners (BBC Learning English, 6 Minute English). 15 minutes daily compounds fast."
  - step: "**Speak with real people**: Language exchange apps (Tandem, HelloTalk) — find English speakers learning Spanish."
  - step: "**Focus on A2 priorities**: Present perfect (I have lived), comparatives (bigger, better), past continuous (I was sleeping)."
  - step: "**Don't be afraid of mistakes**: Every Spanish speaker who speaks English fluently went through A1. The only way forward is to use it."
\`\`\`

## A1 Graduation Speech — To You

You started Module 1 not knowing English pronunciation, learning why H isn't silent,
and struggling to remember that "I" can never be dropped.

Now you:
- Know the 5 biggest pronunciation traps and how to avoid them
- Use "to be" across present and past for both ser AND estar
- Can ask and answer questions in the present AND the past
- Know 20 irregular past verbs
- Can talk about plans, make requests, and give advice
- Know the false friends that would have embarrassed you

**That's not nothing. That's a foundation.**

The next step is talking to real people. Imperfectly. Every day.

\`\`\`quiz
questions:
  - q: "Complete this conversation: 'Hi, I'm Maria. Nice to meet you! ___ from Spain, but ___ living in London now.'"
    options: ["I'm / I'm", "Am / Am", "I / I", "I'm / I are"]
    answer: 0
    explanation: "'I'm from Spain, but I'm living in London now.' Both use 'I am' (contracted to I'm). 'Am from Spain' is wrong — you can never drop 'I'."
  - q: "Maria says: 'Yesterday I ___ to a great restaurant. I ___ pasta — it ___ delicious!'"
    options: ["go / eat / was", "went / ate / was", "went / ate / were", "go / ate / was"]
    answer: 1
    explanation: "All past: went (go→went, irregular), ate (eat→ate, irregular), was (be→was for 'it'). 'Yesterday I went to a great restaurant. I ate pasta — it was delicious!'"
  - q: "Which sentence correctly uses a future form?"
    options: ["I going to study tomorrow.", "I'll going to help you.", "I'm going to start a new course next week.", "I will to be there."]
    answer: 2
    explanation: "'I'm going to start a new course next week.' Correct: am + going to + base verb. Wrong: 'going to study' needs 'am/is/are'. Wrong: 'will + to + verb' — never use 'to' after will."
\`\`\`

\`\`\`takeaways
items:
  - "A1 complete: you can introduce yourself, talk about past/present/future, make requests"
  - "The Spanish→English traps you've conquered: pro-drop, H, V/B, 3rd person -s, false friends"
  - "Next steps: daily listening + speaking practice beats grammar study at A2"
  - "Present perfect is the biggest new thing at A2: 'I have lived in London for 3 years'"
  - "Celebrate this milestone — you have a real foundation. Now use it!"
\`\`\``,
    vocabulary: [
      { word: "fluent", translation: "fluido / con fluidez", pronunciation: "/ˈfluːənt/", exampleSentence: "I want to become fluent in English.", exampleTranslation: "Quiero llegar a hablar inglés con fluidez.", partOfSpeech: "adjective" },
      { word: "improve", translation: "mejorar", pronunciation: "/ɪmˈpruːv/", exampleSentence: "My English is improving every week!", exampleTranslation: "Mi inglés mejora cada semana.", partOfSpeech: "verb" },
      { word: "practice", translation: "practicar / práctica", pronunciation: "/ˈpræktɪs/", exampleSentence: "Practice makes perfect.", exampleTranslation: "La práctica hace al maestro.", partOfSpeech: "noun/verb" },
      { word: "confident", translation: "seguro/a de sí mismo", pronunciation: "/ˈkɒnfɪdənt/", exampleSentence: "I feel more confident speaking English now.", exampleTranslation: "Ahora me siento más seguro hablando inglés.", partOfSpeech: "adjective" },
      { word: "mistake", translation: "error / equivocación", pronunciation: "/mɪˈsteɪk/", exampleSentence: "Don't worry about mistakes — they help you learn.", exampleTranslation: "No te preocupes por los errores — te ayudan a aprender.", partOfSpeech: "noun" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-8-3-v1",
        title: "The A1 Graduation Conversation",
        situation: "A final, open conversation in English — show everything you've learned",
        agentRole: "You are an English conversation partner giving a friendly A1 assessment. Ask the student to: 1) introduce themselves, 2) describe their daily routine, 3) talk about something they did last weekend, 4) share a plan for next month, 5) ask YOU a question in English. After each section, give brief positive feedback on what went well.",
        userGoal: "Demonstrate A1 mastery across all areas: present, past, future, requests, and questions",
        targetPhrases: ["I am...", "I work/study/live...", "Last weekend I...", "Next month I'm going to...", "Do you...?"],
        successCriteria: ["Uses all four tenses (present, past, going to, will)", "Asks at least one question using do/did", "Uses at least 3 connectors to link ideas", "Maintains a conversation for at least 5 minutes"],
        hints: ["Hello, my name is... I'm from... I work as a... I live in...", "Last weekend I went to... and we ate... It was really good!", "Next month I'm going to start an English course. Do you have any recommendations?"],
      },
    ],
  },
];
