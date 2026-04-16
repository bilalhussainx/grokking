// Module 6: Past Tense — Simple Past + Did/Didn't
// Regular -ed + 20 essential irregular verbs + did/didn't for questions

import type { LanguageLesson } from "@/data/language-types";

export const pastTenseLessons: LanguageLesson[] = [
  // ── Lesson 1: Regular Past -ed + Spelling ───────────────────────────────
  {
    id: "en-es-6-1",
    slug: "regular-past-ed",
    title: "El Pasado Regular — La Terminación -ed",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m6",
    moduleTitle: "Module 6: Past Tense",
    order: 1,
    topicId: "en-es-6-1-regular-past-ed",
    content: `# El Pasado Regular — La Terminación -ed

<!-- voice: English past tense is simpler than Spanish. No imperfect versus preterite distinction at A1 level. Just add -ed to most verbs — one form for ALL persons. No yo/tú/él endings. Let's master it. -->

\`\`\`concept
title: One past form for everyone — no personal endings
body: |
  Spanish past (pretérito): hablé, hablaste, habló, hablamos, hablaron — 5 forms.
  Spanish imperfect: hablaba, hablabas, hablaba, hablábamos, hablaban — 5 more forms.

  English simple past: **talked** — the SAME for everyone.
  - I talked, you talked, he talked, we talked, they talked — all the same!

  This is a major simplification. One form fits all subjects.
  The tradeoff: you must remember which verbs are irregular (about 200,
  but the top 20 cover 90% of conversation).
\`\`\`

## Adding -ed: The Rules

\`\`\`steps
title: How to form the regular past
steps:
  - step: "Most verbs: add **-ed** → work → work**ed**, play → play**ed**, talk → talk**ed**"
  - step: "Ends in silent -e: add only **-d** → live → liv**ed**, love → lov**ed**, use → us**ed**"
  - step: "Ends in consonant + y: change y → i + **-ed** → study → studi**ed**, try → tri**ed**"
  - step: "Ends in vowel + y: just add **-ed** → play → play**ed**, stay → stay**ed**"
  - step: "Short vowel + single consonant: double consonant + **-ed** → stop → stop**p**ed, plan → plan**n**ed"
\`\`\`

## Three Pronunciations of -ed

The -ed ending is pronounced THREE different ways:

| After voiceless consonants (p, k, f, s, sh, ch) | After voiced consonants/vowels | After -t or -d |
|---------------------------------------------------|-------------------------------|----------------|
| /t/ sound | /d/ sound | /ɪd/ sound (extra syllable) |
| work**ed** = /wɜːrkt/ | play**ed** = /pleɪd/ | want**ed** = /ˈwɒntɪd/ |
| talk**ed** = /tɔːkt/ | live**d** = /lɪvd/ | start**ed** = /ˈstɑːrtɪd/ |
| stop**ped** = /stɒpt/ | love**d** = /lʌvd/ | need**ed** = /ˈniːdɪd/ |

**Important:** "wanted", "started", "needed" have an extra syllable — /ɪd/.
Don't say "want-d" — say "want-**id**".

## Common Regular Verbs + Their Past Forms

| Base form | Past form | Spanish |
|-----------|-----------|---------|
| work | work**ed** | trabajé / trabajó |
| play | play**ed** | jugué / jugó |
| study | studi**ed** | estudié / estudió |
| live | liv**ed** | viví / vivió |
| talk | talk**ed** | hablé / habló |
| walk | walk**ed** | caminé / caminó |
| start | start**ed** | empecé / empezó |
| finish | finish**ed** | terminé / terminó |
| visit | visit**ed** | visité / visitó |
| want | want**ed** | quise / quería |
| need | need**ed** | necesité / necesitaba |
| love | lov**ed** | amé / amaba |
| cook | cook**ed** | cociné / cocinó |
| clean | clean**ed** | limpié / limpió |
| travel | travel**led** | viajé / viajó |

\`\`\`compare
left:
  label: "❌ Common errors with -ed"
  items:
    - "Yesterday I work. (forgot -ed)"
    - "She study yesterday. (should be studied)"
    - "We stoped at the store. (wrong: double p needed)"
    - "I want-id to go. (can say 'wanted' but sometimes forget the syllable)"
right:
  label: "✅ Correct past forms"
  items:
    - "Yesterday I worked."
    - "She studied yesterday."
    - "We stopped at the store."
    - "I wanted to go. (= /ˈwɒntɪd/ — with the -id syllable)"
\`\`\`

\`\`\`quiz
questions:
  - q: "What is the past of 'study'?"
    options: ["studyed", "studied", "studeid", "studded"]
    answer: 1
    explanation: "When a verb ends in consonant + y, change y → i and add -ed: study → studied. (Same rule: try → tried, carry → carried)"
  - q: "How do you pronounce the -ed in 'worked'?"
    options: ["/wɜːrkɪd/ — extra syllable", "/wɜːrkt/ — sounds like a T", "/wɜːrkd/ — sounds like a D", "/wɜːrkɛd/ — say both e and d"]
    answer: 1
    explanation: "'Work' ends in a voiceless consonant (/k/). After voiceless consonants, -ed sounds like /t/: worked = /wɜːrkt/. No extra syllable."
  - q: "Which sentence is in the past tense AND correct?"
    options: ["Yesterday she plays tennis.", "Yesterday she played tennis.", "Yesterday she plaied tennis.", "Yesterday she playing tennis."]
    answer: 1
    explanation: "'Played' is the correct past of 'play' — regular verb, just add -d (since it ends in -y that's preceded by a vowel: play → played). Note: 'yesterday' is the signal word for past."
\`\`\`

\`\`\`takeaways
items:
  - "Regular past: add -ed to most verbs. Same form for ALL subjects — no personal endings!"
  - "Spelling: consonant+y → -ied (studied). Short vowel+consonant → double+ed (stopped)"
  - "-ed has 3 sounds: /t/ after voiceless (worked), /d/ after voiced (played), /ɪd/ after t/d (wanted)"
  - "The /ɪd/ pronunciation adds an extra syllable: want-ed, start-ed, need-ed"
  - "Time signals: yesterday, last week, last year, ago, in [year]"
\`\`\``,
    vocabulary: [
      { word: "worked", translation: "trabajé / trabajó / trabajaste", pronunciation: "/wɜːrkt/", exampleSentence: "I worked until 8 last night.", exampleTranslation: "Anoche trabajé hasta las 8.", partOfSpeech: "verb (past)" },
      { word: "studied", translation: "estudié / estudió", pronunciation: "/ˈstʌdid/", exampleSentence: "She studied for three hours.", exampleTranslation: "Estudió durante tres horas.", partOfSpeech: "verb (past)" },
      { word: "visited", translation: "visité / visitó", pronunciation: "/ˈvɪzɪtɪd/", exampleSentence: "We visited the museum yesterday.", exampleTranslation: "Visitamos el museo ayer.", partOfSpeech: "verb (past)" },
      { word: "finished", translation: "terminé / terminó", pronunciation: "/ˈfɪnɪʃt/", exampleSentence: "I finished work at 6.", exampleTranslation: "Terminé de trabajar a las 6.", partOfSpeech: "verb (past)" },
      { word: "stopped", translation: "paré / paró", pronunciation: "/stɒpt/", exampleSentence: "The rain stopped at noon.", exampleTranslation: "La lluvia paró al mediodía.", partOfSpeech: "verb (past)" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-6-1-v1",
        title: "What Did You Do Last Weekend?",
        situation: "Monday morning, a colleague asks about your weekend",
        agentRole: "You are an English-speaking colleague on Monday morning. Ask 'What did you do last weekend?' and follow-up questions. Listen for missing -ed and gently echo correct forms. Also listen for pronunciation of -ed endings.",
        userGoal: "Describe 3-4 things you did last weekend using regular past -ed verbs",
        targetPhrases: ["I worked...", "I visited...", "I watched...", "I cooked...", "I walked..."],
        successCriteria: ["Uses -ed consistently for regular past verbs", "Uses correct time words (yesterday, last weekend, on Saturday)", "Produces at least 3 correct past tense sentences"],
        hints: ["Last weekend I visited my family.", "On Saturday I cooked paella.", "On Sunday morning I walked in the park."],
      },
    ],
  },

  // ── Lesson 2: Irregular Past Verbs — The 20 Essentials ──────────────────
  {
    id: "en-es-6-2",
    slug: "irregular-past-verbs",
    title: "Los 20 Verbos Irregulares Esenciales",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m6",
    moduleTitle: "Module 6: Past Tense",
    order: 2,
    topicId: "en-es-6-2-irregular-past-verbs",
    content: `# Los 20 Verbos Irregulares Esenciales

<!-- voice: About 200 English verbs are irregular — they don't add -ed. But the top 20 cover 90% of everyday conversation. Today we're going to learn all 20. They just have to be memorized, but patterns help. -->

\`\`\`concept
title: Irregular verbs must be memorized — but patterns help
body: |
  Irregular verbs don't follow the -ed rule. Each has its own past form.
  The good news: there are patterns.

  Pattern 1 — vowel change (most common):
  go → **went**, run → **ran**, begin → **began**, drink → **drank**

  Pattern 2 — same form as base:
  put → **put**, cut → **cut**, let → **let**, hit → **hit**

  Pattern 3 — completely different:
  go → **went**, be → **was/were**, have → **had**, make → **made**

  Focus on the top 20 — they appear in almost every conversation.
\`\`\`

## The 20 Essential Irregular Verbs

| Base | Past | Spanish equivalent |
|------|------|--------------------|
| **go** | **went** | ir → fui/fue |
| **come** | **came** | venir → vine/vino |
| **have** | **had** | tener → tuve/tuvo |
| **get** | **got** | obtener/llegar → conseguí |
| **make** | **made** | hacer → hice/hizo |
| **take** | **took** | tomar/llevar → tomé/llevé |
| **give** | **gave** | dar → di/dio |
| **see** | **saw** | ver → vi/vio |
| **know** | **knew** | saber/conocer → supe/supo |
| **think** | **thought** | pensar → pensé/pensó |
| **say** | **said** | decir → dije/dijo |
| **tell** | **told** | decir/contar → dije/contó |
| **find** | **found** | encontrar → encontré/encontró |
| **feel** | **felt** | sentir → sentí/sintió |
| **leave** | **left** | salir/dejar → salí/dejé |
| **put** | **put** | poner → puse/puso (same form!) |
| **buy** | **bought** | comprar → compré/compró |
| **bring** | **brought** | traer → traje/trajo |
| **eat** | **ate** | comer → comí/comió |
| **drink** | **drank** | beber → bebí/bebió |

## Grouping Them to Help Memory

\`\`\`steps
title: Memory groups for irregular verbs
steps:
  - step: "**Go family** → go/went, come/came (basic movement)"
  - step: "**Think family** → think/thought, bring/brought, buy/bought (same /ɔːt/ sound)"
  - step: "**Same form** → put/put, cut/cut, let/let, hit/hit, set/set"
  - step: "**Vowel shortening** → eat/ate, see/saw, give/gave, make/made"
  - step: "**The big four** → be/was-were, have/had, do/did, say/said"
\`\`\`

## Using Irregular Verbs in Sentences

| English (with irregular past) | Spanish |
|-------------------------------|---------|
| Yesterday **I went** to the market. | Ayer fui al mercado. |
| She **had** a meeting at 10. | Tuvo una reunión a las 10. |
| **I saw** Carlos last week. | Vi a Carlos la semana pasada. |
| **He gave** me a great book. | Me dio un libro genial. |
| **We ate** at a restaurant. | Comimos en un restaurante. |
| **I thought** it was Monday. | Pensé que era lunes. |
| **She left** early yesterday. | Salió temprano ayer. |
| **They bought** a new car. | Compraron un coche nuevo. |

\`\`\`compare
left:
  label: "❌ Applying -ed to irregular verbs"
  items:
    - "Yesterday I goed to the store."
    - "She maked a cake."
    - "He thinked it was wrong."
    - "I buyed a new phone."
right:
  label: "✅ Correct irregular forms"
  items:
    - "Yesterday I went to the store."
    - "She made a cake."
    - "He thought it was wrong."
    - "I bought a new phone."
\`\`\`

\`\`\`quiz
questions:
  - q: "What is the past form of 'go'?"
    options: ["goed", "gone", "went", "go"]
    answer: 2
    explanation: "Go is completely irregular: go → went. 'Goed' doesn't exist. ('Gone' is the past participle, used with 'have': 'I have gone', but not for simple past.)"
  - q: "Which sentence uses the past correctly?"
    options: ["Yesterday she buyed a book.", "Yesterday she bought a book.", "Yesterday she buys a book.", "Yesterday she has bought a book."]
    answer: 1
    explanation: "Buy → bought (irregular). 'Yesterday she bought a book.' 'Buyed' doesn't exist. 'Has bought' is present perfect, not simple past."
  - q: "'He _____ me the truth.' (decir) What fits in the blank?"
    options: ["said", "told", "telled", "sayed"]
    answer: 1
    explanation: "'Tell' is used when you tell SOMEONE something: tell me, tell him, tell the truth. Past of tell = told. 'Told me the truth.' (Say is used without an indirect object: He said the truth / He said that...)"
\`\`\`

\`\`\`takeaways
items:
  - "The top 20 irregular verbs cover 90% of conversation — memorize these first"
  - "Key pattern: think/thought, bring/brought, buy/bought all end in -ought (/ɔːt/)"
  - "Same-form verbs: put/put, cut/cut, let/let — the past looks identical to the base"
  - "go → went (completely irregular — there's no logic, just memorize it)"
  - "say/said tells information. tell/told = tell someone. 'He said hello' / 'She told me the news'"
\`\`\``,
    vocabulary: [
      { word: "went", translation: "fui / fue / fuimos", pronunciation: "/wɛnt/", exampleSentence: "I went to the doctor yesterday.", exampleTranslation: "Ayer fui al médico.", partOfSpeech: "verb (past of go)" },
      { word: "bought", translation: "compré / compró", pronunciation: "/bɔːt/", exampleSentence: "She bought a new dress.", exampleTranslation: "Ella compró un vestido nuevo.", partOfSpeech: "verb (past of buy)" },
      { word: "thought", translation: "pensé / pensó", pronunciation: "/θɔːt/", exampleSentence: "I thought it was Thursday!", exampleTranslation: "¡Pensé que era jueves!", partOfSpeech: "verb (past of think)" },
      { word: "felt", translation: "sentí / sintió", pronunciation: "/fɛlt/", exampleSentence: "I felt nervous before the interview.", exampleTranslation: "Me sentí nervioso antes de la entrevista.", partOfSpeech: "verb (past of feel)" },
      { word: "told", translation: "dije / dijo (a alguien)", pronunciation: "/toʊld/", exampleSentence: "She told me the news.", exampleTranslation: "Ella me contó la noticia.", partOfSpeech: "verb (past of tell)" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-6-2-v1",
        title: "Telling a Story",
        situation: "Tell your English friend about something that happened to you recently",
        agentRole: "You are an English friend listening to a story. Ask follow-up questions: 'Then what happened?' 'How did you feel?' 'Where did you go?' If the student uses 'goed', 'maked', etc., gently say the correct form once and continue the conversation.",
        userGoal: "Tell a short story (5+ sentences) using at least 4 irregular past verbs",
        targetPhrases: ["I went to...", "I thought...", "I felt...", "She told me...", "We ate..."],
        successCriteria: ["Uses at least 4 irregular past forms correctly", "Tells a coherent narrative with beginning, middle, and end", "Uses time words to sequence events"],
        hints: ["Last Saturday I went to a party. I felt nervous at first.", "I saw my friend Carlos there. He told me a funny story.", "We ate amazing food and drank good wine."],
      },
    ],
  },

  // ── Lesson 3: Did / Didn't — Questions and Negatives in the Past ─────────
  {
    id: "en-es-6-3",
    slug: "did-didnt-past-questions",
    title: "Did / Didn't — Preguntas y Negaciones en Pasado",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m6",
    moduleTitle: "Module 6: Past Tense",
    order: 3,
    topicId: "en-es-6-3-did-didnt-past-questions",
    content: `# Did / Didn't — Preguntas y Negaciones en Pasado

<!-- voice: Just like the present uses do/does for questions and negatives, the past uses DID. One form for all subjects — did you? did she? did they? And the main verb goes back to its base form. -->

\`\`\`concept
title: DID — the past helper for all subjects
body: |
  Present: Do you work? / Does she work?
  Past:    **Did** you work? / **Did** she work? — DID for everyone, no did/dids distinction.

  This is simpler than the present!
  - No "did" vs "dids" split — just DID for all subjects.
  - Main verb goes back to BASE form (no -ed, no irregular form).

  Negative: didn't (did not) + base verb.
  - I didn't work yesterday. (NOT: I didn't worked)
  - She didn't go. (NOT: She didn't went)
\`\`\`

## Building Past Questions with Did

| Statement | Question |
|-----------|----------|
| You worked yesterday. | **Did** you work yesterday? |
| She went to the store. | **Did** she go to the store? |
| They ate at home. | **Did** they eat at home? |
| He bought a new phone. | **Did** he buy a new phone? |

**Critical rule:** The main verb returns to base form after DID.
- She went → Did she **go**? (not "Did she went?")
- He bought → Did he **buy**? (not "Did he bought?")

## Past Negatives with Didn't

| Positive | Negative |
|----------|----------|
| I worked last night. | I **didn't** work last night. |
| She went to school. | She **didn't** go to school. |
| We ate lunch together. | We **didn't** eat lunch together. |
| He bought a coffee. | He **didn't** buy a coffee. |

\`\`\`steps
title: Formula for past questions and negatives
steps:
  - step: "Question: **Did** + subject + BASE VERB + rest? → 'Did you go to the party?'"
  - step: "Negative: subject + **didn't** + BASE VERB + rest → 'I didn't go to the party.'"
  - step: "Question words before did: 'Where did you go?' 'What did she eat?' 'Why did he leave?'"
  - step: "Short answers: Did you work? → Yes, I **did**. / No, I **didn't**."
  - step: "Remember: NEVER use -ed or irregular form after did/didn't — always base form"
\`\`\`

## Short Answers in the Past

| Question | Yes | No |
|----------|-----|-----|
| Did you eat breakfast? | Yes, I did. | No, I didn't. |
| Did she come to the meeting? | Yes, she did. | No, she didn't. |
| Did they finish on time? | Yes, they did. | No, they didn't. |

\`\`\`compare
left:
  label: "❌ Most common past question errors"
  items:
    - "Did she went to the party? (-ed after did)"
    - "Did you worked yesterday? (-ed after did)"
    - "She didn't went home. (-ed after didn't)"
    - "Where you went? (forgot 'did')"
right:
  label: "✅ Correct past questions"
  items:
    - "Did she go to the party?"
    - "Did you work yesterday?"
    - "She didn't go home."
    - "Where did you go?"
\`\`\`

\`\`\`quiz
questions:
  - q: "___ she call you last night?"
    options: ["Was", "Did", "Does", "Had"]
    answer: 1
    explanation: "For past questions about actions, use DID: 'Did she call you?' DID is the same for all subjects in the past. (Was/Were are for 'to be' questions only.)"
  - q: "I _____ eat breakfast this morning."
    options: ["didn't", "don't", "wasn't", "not"]
    answer: 0
    explanation: "'Didn't' = did not — used for all subjects in the negative simple past. 'I didn't eat breakfast.' The verb after didn't stays in base form."
  - q: "Which question is CORRECT?"
    options: ["Where did you went?", "Where you did go?", "Where did you go?", "Where did you goes?"]
    answer: 2
    explanation: "Question word + did + subject + BASE VERB: 'Where did you go?' The main verb is always in base form after did — never 'went', 'goes', or 'going'."
\`\`\`

\`\`\`takeaways
items:
  - "DID is the past helper for ALL subjects — no did/dids distinction (simpler than do/does!)"
  - "After DID or DIDN'T, use the BASE FORM — never -ed or irregular: 'Did she go?' not 'Did she went?'"
  - "Negative: I didn't work, she didn't eat, they didn't come"
  - "Questions: Did you + base verb? Where did they go? What did she eat?"
  - "Short answers: Yes, I did. / No, she didn't. — don't just say yes or no"
\`\`\``,
    vocabulary: [
      { word: "did", translation: "auxiliar de pasado", pronunciation: "/dɪd/", exampleSentence: "Did you call me yesterday?", exampleTranslation: "¿Me llamaste ayer?", partOfSpeech: "auxiliary verb (past)" },
      { word: "didn't", translation: "no (pasado negativo)", pronunciation: "/ˈdɪdənt/", exampleSentence: "I didn't understand the question.", exampleTranslation: "No entendí la pregunta.", partOfSpeech: "negative auxiliary (past)" },
      { word: "call", translation: "llamar", pronunciation: "/kɔːl/", exampleSentence: "Did you call the doctor?", exampleTranslation: "¿Llamaste al médico?", partOfSpeech: "verb" },
      { word: "arrive", translation: "llegar", pronunciation: "/əˈraɪv/", exampleSentence: "What time did you arrive?", exampleTranslation: "¿A qué hora llegaste?", partOfSpeech: "verb" },
      { word: "forget", translation: "olvidar", pronunciation: "/fərˈɡɛt/", exampleSentence: "I didn't forget — I just arrived late!", exampleTranslation: "¡No olvidé — solo llegué tarde!", partOfSpeech: "verb" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-6-3-v1",
        title: "Detective Interview",
        situation: "An English-speaking detective asks you questions about what you did last night",
        agentRole: "You are a friendly English-speaking detective asking about someone's alibi for last night. Ask 'Did you...?' questions and follow up with 'Where did you go?' 'What time did you arrive?' 'Who did you talk to?' Correct did+irregular verb combinations.",
        userGoal: "Answer past questions correctly using did/didn't and base verb forms",
        targetPhrases: ["Yes, I did.", "No, I didn't.", "I went to...", "I didn't go to...", "I arrived at..."],
        successCriteria: ["Uses base form after did/didn't correctly", "Short answers with did/didn't", "Forms at least one question using 'Did you...?'"],
        hints: ["Yes, I did. I went to the cinema.", "No, I didn't go to that restaurant.", "I arrived home at about 11 o'clock."],
      },
    ],
  },
];
