import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────────────
// MODULE 7: The Preterite — Looking Back (3 lessons)
// The past tense for completed, specific events. At A1 this is
// sufficient — imperfect (background past) is A2 territory.
// ─────────────────────────────────────────────────────────────────

export const preteriteLessons: LanguageLesson[] = [
  // ── LESSON 21 ── Preterite -AR Verbs ────────────────────────
  {
    id: "es-l21",
    slug: "preterite-ar-verbs",
    title: "The Preterite — Regular -AR Verbs",
    content: `# The Preterite — Regular -AR Verbs

The **preterite** (pretérito indefinido) is the past tense for specific, completed events. Something happened, it finished, it's done. It is the first past tense you need to learn.

\`\`\`concept
{ "title": "The Preterite — Completed, Specific Events", "variant": "info", "content": "The preterite answers the question: 'What happened?' It describes events with a clear beginning and end: Yesterday I ate. Last week she worked. They arrived at 3pm. It is NOT used for ongoing past states or habitual past actions (those use the imperfect, an A2 topic). At A1, all you need is the preterite — it covers the vast majority of past-tense situations you'll encounter." }
\`\`\`

## -AR Preterite Endings

Remove -AR, then add:

| Pronoun | Ending | Hablar example |
|---------|--------|---------------|
| yo | **-é** | habl**é** |
| tú | **-aste** | habl**aste** |
| él/ella/usted | **-ó** | habl**ó** |
| nosotros | **-amos** | habl**amos** |
| vosotros | **-asteis** | habl**asteis** |
| ellos/ustedes | **-aron** | habl**aron** |

Note the accent marks: **hablé** (yo) and **habló** (él/ella) must have accents to distinguish from present tense **hablo** (yo) and he/she is from **habla** (present).

## Spelling-Change Verbs — Yo Form Only

Some -AR verbs change spelling in the yo preterite to preserve the original sound:

| Verb | Problem | Solution | Yo form |
|------|---------|----------|---------|
| **buscar** (to search) | -qué sounds like -ké | c → qu before é | **busqué** |
| **llegar** (to arrive) | -gé is soft G | g → gu before é | **llegué** |
| **empezar** (to start) | -zé sounds like -ché | z → c before é | **empecé** |
| **pagar** (to pay) | -gé is soft G | g → gu before é | **pagué** |

Only the yo form changes — all other preterite forms are regular.

## In Action

- Ayer **hablé** con mi madre. — Yesterday I spoke with my mother.
- **¿Trabajaste** el fin de semana? — Did you work the weekend?
- Ella **llegó** tarde. — She arrived late.
- **Compramos** mucho en el mercado. — We bought a lot at the market.
- ¿Cuándo **empezaron** las clases? — When did the classes start?

## Time Expressions for the Preterite

| Spanish | English |
|---------|---------|
| **ayer** | yesterday |
| **anteayer** | the day before yesterday |
| **la semana pasada** | last week |
| **el mes pasado** | last month |
| **el año pasado** | last year |
| **hace un rato** | a little while ago |
| **hace dos días** | two days ago |
| **esta mañana** | this morning *(if it's past)* |
| **en 2020** | in 2020 |

\`\`\`compare
{ "title": "Present vs Preterite — The Accent Marks Matter", "left": { "label": "Present tense", "items": ["yo hablo (I speak)", "él habla (he speaks)", "Similar form — NO accent marks", "Ongoing/habitual action"] }, "right": { "label": "Preterite tense", "items": ["yo hablé (I spoke)", "él habló (he spoke)", "Accent marks on yo and él forms", "Completed, specific past action"] } }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'Last week, she worked every day' in Spanish?", "options": ["La semana pasada, ella trabaja todos los días.", "La semana pasada, ella trabajó todos los días.", "La semana pasada, ella trabajaba todos los días.", "La semana pasada, ella trabajaste todos los días."], "answer": 1, "explanation": "The preterite is used for completed past events. 'Trabajó' is the ella preterite form of trabajar (-AR: remove -ar, add -ó with accent). 'Trabaja' is present tense. 'Trabajaba' is imperfect (A2, for habitual/background past). 'Trabajaste' is the tú form, wrong for ella." }
\`\`\`

\`\`\`takeaways
{ "points": ["Preterite -AR endings: -é, -aste, -ó, -amos, -asteis, -aron", "Accent marks required on yo (-é) and él/ella (-ó) — distinguishes from present tense", "Spelling changes in yo form only: buscar→busqué, llegar→llegué, empezar→empecé, pagar→pagué", "Time words that signal preterite: ayer, anteayer, la semana pasada, el año pasado, hace + time", "Nosotros preterite = nosotros present for -AR verbs: hablamos (both)"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m7",
    moduleTitle: "The Preterite — Looking Back",
    order: 1,
    topicId: "es-m7-l21-preterite-ar",
    vocabulary: [
      { word: "hablé", translation: "I spoke", pronunciation: "ah-BLEH", exampleSentence: "Ayer hablé con mi profesor.", exampleTranslation: "Yesterday I spoke with my teacher.", partOfSpeech: "verb (preterite)" },
      { word: "llegué", translation: "I arrived", pronunciation: "yeh-GEH", exampleSentence: "Llegué tarde a la reunión.", exampleTranslation: "I arrived late to the meeting.", partOfSpeech: "verb (preterite)" },
      { word: "ayer", translation: "yesterday", pronunciation: "ah-YEHR", exampleSentence: "Ayer trabajé todo el día.", exampleTranslation: "Yesterday I worked all day.", partOfSpeech: "adverb" },
      { word: "la semana pasada", translation: "last week", pronunciation: "lah seh-MAH-nah pah-SAH-dah", exampleSentence: "La semana pasada viajé a Barcelona.", exampleTranslation: "Last week I travelled to Barcelona.", partOfSpeech: "phrase" },
      { word: "hace + time", translation: "ago", pronunciation: "AH-seh", exampleSentence: "Llegué hace dos horas.", exampleTranslation: "I arrived two hours ago.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "-AR Preterite Conjugation",
        explanation: "Remove -AR, add: -é (yo), -aste (tú), -ó (él/ella/usted), -amos (nosotros), -asteis (vosotros), -aron (ellos/ustedes). Yo and él/ella require accent marks.",
        examples: [
          { correct: "Hablé con ella ayer.", translation: "I spoke with her yesterday.", note: "yo hablé — accent mark required" },
          { correct: "¿Llegaste a tiempo?", translation: "Did you arrive on time?", note: "tú llegaste — no accent mark" },
          { correct: "Compraron mucho.", translation: "They bought a lot.", note: "ellos compraron" },
        ],
        commonMistakes: [
          { incorrect: "Yo hablo ayer.", correction: "Yo hablé ayer.", explanation: "Past events use the preterite. 'Hablo' is present tense. 'Hablé' has the accent mark that signals preterite." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m7-l21-vs1",
        title: "What Did You Do Last Weekend?",
        situation: "A Spanish colleague asks about your weekend.",
        agentRole: "You are a Spanish colleague on Monday morning. Ask what the student did last weekend. Ask follow-up questions about specific activities — did they eat out, go somewhere, work?",
        userGoal: "Describe last weekend using preterite -AR verbs: comprar, caminar, llamar, trabajar, hablar, llegar, escuchar, etc.",
        targetPhrases: ["el fin de semana pasado", "ayer", "hablé", "trabajé", "caminé", "compré", "llegué"],
        successCriteria: ["Consistent use of -AR preterite forms", "Correct accent marks conveyed in speech", "Uses past time expressions"],
        hints: ["El fin de semana pasado, yo... / El sábado compré... / El domingo hablé con..."],
      },
    ],
  },

  // ── LESSON 22 ── Preterite -ER/-IR + Key Irregulars ─────────
  {
    id: "es-l22",
    slug: "preterite-er-ir-irregulars",
    title: "Preterite -ER/-IR Verbs & Key Irregulars",
    content: `# Preterite -ER/-IR Verbs & Key Irregulars

## -ER and -IR Preterite Endings

Both -ER and -IR verbs use the same preterite endings:

| Pronoun | Ending | Comer | Vivir |
|---------|--------|-------|-------|
| yo | **-í** | com**í** | viv**í** |
| tú | **-iste** | com**iste** | viv**iste** |
| él/ella/usted | **-ió** | com**ió** | viv**ió** |
| nosotros | **-imos** | com**imos** | viv**imos** |
| vosotros | **-isteis** | com**isteis** | viv**isteis** |
| ellos/ustedes | **-ieron** | com**ieron** | viv**ieron** |

- Comí en un restaurante increíble. — I ate at an incredible restaurant.
- ¿Bebiste mucho anoche? — Did you drink a lot last night?
- Vivió en París dos años. — He lived in Paris for two years.
- ¿Dónde comieron? — Where did they eat?

## Key Irregular Preterites — Must Memorize

These irregulars don't follow any pattern — they must be learned by heart. No accent marks on any irregular preterite form.

**Ir and Ser — Identical in the Preterite:**

| | ir / ser |
|-|---------|
| yo | **fui** |
| tú | **fuiste** |
| él/ella | **fue** |
| nosotros | **fuimos** |
| vosotros | **fuisteis** |
| ellos | **fueron** |

Context determines whether **fue** means "he went" or "he was". This ambiguity is usually resolved by context.
- Fui al banco ayer. — I went to the bank yesterday. *(ir)*
- Fue un buen día. — It was a good day. *(ser)*

**Tener → tuve** pattern (u-irregulars):

| | tener | estar | poder | saber |
|-|-------|-------|-------|-------|
| yo | **tuve** | **estuve** | **pude** | **supe** |
| tú | **tuviste** | **estuviste** | **pudiste** | **supiste** |
| él | **tuvo** | **estuvo** | **pudo** | **supo** |
| nosotros | **tuvimos** | **estuvimos** | **pudimos** | **supimos** |
| ellos | **tuvieron** | **estuvieron** | **pudieron** | **supieron** |

**Hacer → hice** (spelling change only in él form: hizo, not hicea):

| | hacer |
|-|-------|
| yo | **hice** |
| tú | **hiciste** |
| él/ella | **hizo** *(c→z to preserve sound)* |
| nosotros | **hicimos** |
| ellos | **hicieron** |

\`\`\`concept
{ "title": "No Accent Marks on Irregular Preterites", "variant": "warning", "content": "Regular preterites need accent marks on yo and él forms (hablé, habló) to distinguish them from present tense. Irregular preterites are so different from the present that there's no ambiguity — so they have NO accent marks. Fui, fue, hice, hizo, tuve, tuvo — none of these get accent marks. This is one of the easier spelling rules in Spanish." }
\`\`\`

\`\`\`compare
{ "title": "Ir vs Ser in the Preterite — Identical Forms, Context Resolves", "left": { "label": "Ir (to go) — motion context", "items": ["Fui al trabajo. (I went to work.)", "Fue al médico. (He went to the doctor.)", "Fuimos a la playa. (We went to the beach.)", "Motion verb: destination is mentioned"] }, "right": { "label": "Ser (to be) — description context", "items": ["Fue una fiesta increíble. (It was an incredible party.)", "Fue el primer día. (It was the first day.)", "Fuimos muy jóvenes. (We were very young.)", "Description: adjective/noun follows"] } }
\`\`\`

\`\`\`quiz
{ "question": "Choose the correct preterite: 'Last night I ___ very tired.' (estar)", "options": ["estaba muy cansado", "estuve muy cansado", "fui muy cansado", "esté muy cansado"], "answer": 1, "explanation": "Estar in the preterite uses the -uv- irregular: estuve. So 'Last night I was very tired' = 'Anoche estuve muy cansado.' Note: 'estaba' (option A) IS correct Spanish but it's the imperfect tense (A2), which describes ongoing past states. 'Anoche estuve' (preterite) treats the tiredness as a completed event. Both can be correct, but estuve is the preterite answer." }
\`\`\`

\`\`\`takeaways
{ "points": ["-ER/-IR preterite: -í, -iste, -ió, -imos, -isteis, -ieron (same endings for both)", "Ir and Ser have IDENTICAL preterite forms: fui, fuiste, fue, fuimos, fuisteis, fueron — context resolves", "Tener→tuve, estar→estuve, poder→pude, saber→supe (u-irregulars)", "Hacer→hice (yo), hizo (él) — note c→z spelling change in él form", "No accent marks on ANY irregular preterite form"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m7",
    moduleTitle: "The Preterite — Looking Back",
    order: 2,
    topicId: "es-m7-l22-preterite-er-ir-irregulars",
    vocabulary: [
      { word: "fui", translation: "I went / I was (preterite ir/ser)", pronunciation: "FWEE", exampleSentence: "Ayer fui al mercado.", exampleTranslation: "Yesterday I went to the market.", partOfSpeech: "verb (preterite)" },
      { word: "fue", translation: "he/she went / was (preterite ir/ser)", pronunciation: "FWEH", exampleSentence: "Fue una experiencia increíble.", exampleTranslation: "It was an incredible experience.", partOfSpeech: "verb (preterite)" },
      { word: "tuve", translation: "I had (preterite tener)", pronunciation: "TOO-beh", exampleSentence: "Tuve un problema con el coche.", exampleTranslation: "I had a problem with the car.", partOfSpeech: "verb (preterite)" },
      { word: "hice", translation: "I did / I made (preterite hacer)", pronunciation: "EE-seh", exampleSentence: "¿Qué hiciste ayer?", exampleTranslation: "What did you do yesterday?", partOfSpeech: "verb (preterite)" },
      { word: "comí", translation: "I ate (preterite comer)", pronunciation: "koh-MEE", exampleSentence: "Comí demasiado en la cena.", exampleTranslation: "I ate too much at dinner.", partOfSpeech: "verb (preterite)" },
    ],
    grammarPoints: [
      {
        title: "Irregular Preterites — No Accent Marks",
        explanation: "Truly irregular preterite stems (fui, tuve, hice, estuve, pude, supe) use personal endings with NO accent marks: fui, fuiste, fue, fuimos, fuisteis, fueron.",
        examples: [
          { correct: "Fui al banco. / Fue una buena idea.", translation: "I went to the bank. / It was a good idea.", note: "Fui/fue = ir or ser — context determines" },
          { correct: "Hice todo lo posible.", translation: "I did everything possible.", note: "hice = yo form of hacer (irregular)" },
          { correct: "Tuvimos que esperar.", translation: "We had to wait.", note: "tuvimos = nosotros of tener (preterite)" },
        ],
        commonMistakes: [
          { incorrect: "Hice → él hice", correction: "Él hizo (not hice)", explanation: "The él/ella form of hacer is hizo (c→z to keep the 's' sound before 'o'). All other irregular preterite forms of hacer follow the pattern normally." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m7-l22-vs1",
        title: "Telling a Story About Yesterday",
        situation: "A Spanish friend asks you to tell them about an interesting thing that happened yesterday.",
        agentRole: "You are an engaged Spanish friend listening to the student's story. Ask follow-up questions using preterite verbs: ¿Qué hiciste?, ¿Dónde fuiste?, ¿Con quién estuviste?, ¿Qué comiste?",
        userGoal: "Tell a short story about yesterday using a mix of preterite verbs including irregulars: fui, hice, tuve, comí, bebí.",
        targetPhrases: ["fui", "hice", "tuve", "comí", "estuve", "fue"],
        successCriteria: ["Uses irregular preterites correctly", "Correctly distinguished ir/ser fui in context"],
        hints: ["Ayer fui a... / Tuve que... / Hice... / Fue muy interesante."],
      },
    ],
  },

  // ── LESSON 23 ── Preterite in Context ───────────────────────
  {
    id: "es-l23",
    slug: "preterite-in-context",
    title: "The Preterite in Context — Sequences and Stories",
    content: `# The Preterite in Context — Sequences and Stories

You know the preterite forms. Now: how do you use them naturally to tell what happened in sequence? This lesson puts it all together with connecting words and real conversational patterns.

## Sequencing Past Events

Spanish uses these words to connect preterite events in order:

| Spanish | English | Position |
|---------|---------|---------|
| **primero** | first | sentence start |
| **luego / después** | then / afterwards | mid-sentence |
| **más tarde** | later | mid-sentence |
| **al final** | in the end / finally | sentence end |
| **al mismo tiempo** | at the same time | mid-sentence |
| **de repente** | suddenly | mid-sentence |
| **en ese momento** | at that moment | mid-sentence |
| **por la mañana/tarde/noche** | in the morning/afternoon/evening | time setting |

## Telling a Story — The Preterite Flow

Example: A bad day in Madrid
- **Primero**, me levanté tarde — el despertador no funcionó.
- **Luego**, tomé el metro pero el metro se paró.
- **Llegué** al trabajo con cuarenta minutos de retraso.
- Mi jefa me **llamó** a su oficina. **Tuve** una conversación difícil.
- **Después**, **comí** solo en el parque y **pensé** mucho.
- **Al final**, **volví** a casa, **hice** ejercicio y **dormí** bien.

*(First, I got up late — the alarm didn't work. Then I took the metro but the metro stopped. I arrived at work forty minutes late. My boss called me to her office. I had a difficult conversation. Afterwards, I ate alone in the park and thought a lot. In the end, I went home, exercised, and slept well.)*

## How Long Ago — Hace + Time + Que / Hace + Time

**Hace** + time is used to say how long ago something happened:
- **Hace tres días** fui al médico. — Three days ago I went to the doctor.
- Llegué **hace dos horas**. — I arrived two hours ago.
- ¿**Cuánto tiempo hace que** llegaste? — How long ago did you arrive?

**Contrast: hace + time + que + present = duration (still ongoing):**
- Hace tres años **que** vivo aquí. — I have been living here for three years.

\`\`\`concept
{ "title": "A Taste of the Imperfect — For Your A2 Journey", "variant": "callout", "content": "The preterite covers completed events. But Spanish also has the imperfect (imperfecto) for background descriptions and habitual past. At A2, you'll learn: 'Cuando era niño, vivía en Madrid' (When I was a child, I used to live in Madrid) — the imperfect sets the scene while the preterite describes the events that happen within it. For now, the preterite alone gets you very far." }
\`\`\`

\`\`\`steps
{ "title": "Building a Past-Tense Story in Spanish", "steps": ["Set the time frame: Ayer por la mañana... / El sábado pasado...", "Use primero for the first action (preterite verb)", "Use luego / después for the next actions", "Use de repente for a surprise or turning point", "Close with al final to wrap up", "Add hace + time or time expressions for specificity"] }
\`\`\`

\`\`\`quiz
{ "question": "Which sentence correctly uses 'hace' to mean 'two years ago'?", "options": ["Hace dos años vivía en Londres.", "Hace dos años que viví en Londres.", "Hace dos años viví en Londres.", "Viví en Londres dos años hace."], "answer": 2, "explanation": "Hace + time + preterite = time ago. 'Hace dos años viví en Londres' = I lived in London two years ago (completed event, now finished). Compare: 'Hace dos años que vivo en Londres' = I have been living in London for two years (still living there now, uses present tense). Option A uses imperfect (vivía) which is also possible but describes a habitual state, not the hace construction." }
\`\`\`

\`\`\`takeaways
{ "points": ["Sequence words: primero, luego/después, más tarde, de repente, al final — connect preterite events naturally", "Hace + time + preterite = time ago: Hace dos días fui al banco.", "Hace + time + que + present = ongoing duration: Hace dos años que vivo aquí.", "The preterite is sufficient for all A1 past-tense needs — imperfect is an A2 skill", "Practice narrating a sequence: set time, list events in order, close with al final"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m7",
    moduleTitle: "The Preterite — Looking Back",
    order: 3,
    topicId: "es-m7-l23-preterite-context",
    vocabulary: [
      { word: "primero", translation: "first", pronunciation: "pree-MEH-roh", exampleSentence: "Primero fui al banco, luego al supermercado.", exampleTranslation: "First I went to the bank, then to the supermarket.", partOfSpeech: "adverb" },
      { word: "luego / después", translation: "then / afterwards", pronunciation: "LWEH-goh / dehs-PWEHS", exampleSentence: "Comí, y luego salí a caminar.", exampleTranslation: "I ate, and then I went for a walk.", partOfSpeech: "adverb" },
      { word: "de repente", translation: "suddenly", pronunciation: "deh reh-PEHN-teh", exampleSentence: "De repente, empezó a llover.", exampleTranslation: "Suddenly, it started to rain.", partOfSpeech: "adverb" },
      { word: "al final", translation: "in the end / finally", pronunciation: "ahl fee-NAHL", exampleSentence: "Al final, todo salió bien.", exampleTranslation: "In the end, everything turned out well.", partOfSpeech: "adverb" },
      { word: "hace + time", translation: "... ago", pronunciation: "AH-seh", exampleSentence: "Hace una hora llegaron.", exampleTranslation: "They arrived an hour ago.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Hace + Time — Ago vs Duration",
        explanation: "Hace + time + preterite = time ago (finished). Hace + time + que + present = ongoing duration (still true now).",
        examples: [
          { correct: "Hace dos días llegué.", translation: "I arrived two days ago.", note: "Preterite after hace = time ago" },
          { correct: "Hace dos años que estudio español.", translation: "I have been studying Spanish for two years.", note: "Present after hace + que = duration" },
        ],
        commonMistakes: [
          { incorrect: "Hace dos años estudié español. (meaning: I've been studying for 2 years)", correction: "Hace dos años que estudio español.", explanation: "For ongoing actions started in the past, use hace + time + que + present tense. Hace + preterite means the action finished that long ago." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m7-l23-vs1",
        title: "Telling a Travel Story",
        situation: "You've just returned from a trip and a Spanish friend wants to hear all about it.",
        agentRole: "You are an enthusiastic Spanish friend who loves travel stories. Ask the student to tell you what happened on their trip, using follow-up questions: ¿Y luego qué hiciste? ¿Cuándo llegaste? ¿Qué fue lo mejor?",
        userGoal: "Tell a mini travel story with at least 5 preterite verbs, using sequence words (primero, luego, de repente, al final) and hace + time.",
        targetPhrases: ["primero", "luego", "de repente", "al final", "hace", "fui", "comí", "fue"],
        successCriteria: ["Coherent sequence of events using preterite", "At least 2 sequence connectors used", "Story has a beginning, middle, and end"],
        hints: ["Primero, fui a... / Luego visité... / De repente... / Al final, volví a casa hace tres días."],
      },
    ],
  },
];
