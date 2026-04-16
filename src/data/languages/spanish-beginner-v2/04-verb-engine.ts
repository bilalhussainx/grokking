import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────────────
// MODULE 4: The Verb Engine (4 lessons)
// Regular -AR/-ER/-IR conjugation + negation + essential irregulars.
// The 6-form paradigm (vs English's 2) is the core cognitive shift.
// ─────────────────────────────────────────────────────────────────

export const verbEngineLessons: LanguageLesson[] = [
  // ── LESSON 11 ── -AR Verbs ───────────────────────────────────
  {
    id: "es-l11",
    slug: "ar-verbs",
    title: "-AR Verbs — The Backbone of Spanish",
    content: `# -AR Verbs — The Backbone of Spanish

About 90% of regular Spanish verbs end in **-AR**. Master the conjugation pattern once and it applies to hundreds of verbs. The pattern: remove **-AR**, add the ending for each person.

## The -AR Conjugation Pattern (hablar — to speak)

| Pronoun | Ending | Full form | English |
|---------|--------|----------|---------|
| yo | **-o** | habl**o** | I speak |
| tú | **-as** | habl**as** | you speak |
| él/ella/usted | **-a** | habl**a** | he/she speaks |
| nosotros | **-amos** | habl**amos** | we speak |
| vosotros | **-áis** | habl**áis** | you all speak (Spain) |
| ellos/ustedes | **-an** | habl**an** | they speak / you all speak |

\`\`\`concept
{ "title": "Pro-Drop — Subject Pronouns Are Optional in Spanish", "variant": "info", "content": "In English, you MUST say the subject: 'I speak', 'she speaks'. Dropping the pronoun ('Speak' instead of 'I speak') is grammatically wrong. Spanish is a 'pro-drop' language — the verb ending already tells you who is doing the action. 'Hablo' already means 'I speak'. 'Hablas' means 'you speak'. The pronoun 'yo', 'tú', etc. is added only for EMPHASIS or to avoid ambiguity." }
\`\`\`

## Key -AR Verbs to Know

| Infinitive | Meaning | Yo form |
|------------|---------|---------|
| **hablar** | to speak | hablo |
| **trabajar** | to work | trabajo |
| **estudiar** | to study | estudio |
| **escuchar** | to listen | escucho |
| **caminar** | to walk | camino |
| **comprar** | to buy | compro |
| **usar** | to use | uso |
| **necesitar** | to need | necesito |
| **llamar** | to call | llamo |
| **mirar** | to look / to watch | miro |
| **tomar** | to take / to drink | tomo |
| **ayudar** | to help | ayudo |

## Spelling-Change Verbs — Watch the Yo Form

Some -AR verbs change spelling in the yo form to preserve the sound:

- **buscar** (to search) → yo **busco** *(c stays c before o — no change needed here)*
- **llegar** (to arrive) → yo **llego** *(g stays g before o)*
- **pagar** (to pay) → yo **pago**
- **empezar** (to start) → yo **empiezo** *(stem-change: e → ie — this is a different pattern, covered in Module 4)*

## Pro-Drop in Practice

| Spanish | English (explicit) | Note |
|---------|-------------------|------|
| Hablo español. | I speak Spanish. | Pronoun dropped — most natural |
| **Yo** hablo español. | **I** speak Spanish. | Pronoun added for emphasis |
| ¿Hablas inglés? | Do you speak English? | No pronoun needed |
| Ella habla francés. | She speaks French. | Pronoun added to clarify gender |

\`\`\`compare
{ "title": "English (2 verb forms) vs Spanish (6 verb forms)", "left": { "label": "English — minimal conjugation", "items": ["I speak", "you speak", "he/she speaks (only change: +s)", "we speak", "you (all) speak", "they speak"] }, "right": { "label": "Spanish — 6 distinct forms", "items": ["yo hablo (-o)", "tú hablas (-as)", "él/ella/usted habla (-a)", "nosotros hablamos (-amos)", "vosotros habláis (-áis)", "ellos/ustedes hablan (-an)"] } }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'We work on Mondays' in Spanish?", "options": ["Yo trabajo los lunes.", "Trabajamos los lunes.", "Ellos trabajan los lunes.", "Trabajo los lunes nosotros."], "answer": 1, "explanation": "We = nosotros. The -AR nosotros ending is -amos. Trabaj- (stem from trabajar) + -amos = trabajamos. The subject pronoun 'nosotros' is dropped because the -amos ending already signals 'we'. And remember: days of the week use the definite article 'los' in Spanish (los lunes = on Mondays)." }
\`\`\`

\`\`\`takeaways
{ "points": ["Remove -AR from infinitive, add: -o, -as, -a, -amos, -áis, -an for yo/tú/él/nosotros/vosotros/ellos", "Spanish is pro-drop: the verb ending tells you who does it, so the pronoun is usually omitted", "Add the pronoun only for emphasis (Yo hablo, no tú) or to clarify gender (ella vs él)", "Key -AR verbs: hablar, trabajar, estudiar, comprar, necesitar, llamar, escuchar, caminar", "Nosotros form (-amos) has an accent-free -a- stress pattern; vosotros form (-áis) has an accent mark"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m4",
    moduleTitle: "The Verb Engine",
    order: 1,
    topicId: "es-m4-l11-ar-verbs",
    vocabulary: [
      { word: "hablar", translation: "to speak", pronunciation: "ah-BLAR", exampleSentence: "Hablo español todos los días.", exampleTranslation: "I speak Spanish every day.", partOfSpeech: "verb" },
      { word: "trabajar", translation: "to work", pronunciation: "trah-bah-KHAR", exampleSentence: "Trabajo en una oficina.", exampleTranslation: "I work in an office.", partOfSpeech: "verb" },
      { word: "estudiar", translation: "to study", pronunciation: "ehs-too-DYAR", exampleSentence: "Estudiamos juntos.", exampleTranslation: "We study together.", partOfSpeech: "verb" },
      { word: "necesitar", translation: "to need", pronunciation: "neh-seh-see-TAR", exampleSentence: "Necesito más tiempo.", exampleTranslation: "I need more time.", partOfSpeech: "verb" },
      { word: "comprar", translation: "to buy", pronunciation: "kohm-PRAR", exampleSentence: "Voy a comprar pan.", exampleTranslation: "I'm going to buy bread.", partOfSpeech: "verb" },
      { word: "escuchar", translation: "to listen", pronunciation: "ehs-koo-CHAR", exampleSentence: "Escucha bien.", exampleTranslation: "Listen carefully.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "-AR Verb Conjugation",
        explanation: "Remove -AR from the infinitive and add the personal endings: -o (yo), -as (tú), -a (él/ella/usted), -amos (nosotros), -áis (vosotros), -an (ellos/ustedes).",
        examples: [
          { correct: "Hablo español. / Hablas inglés.", translation: "I speak Spanish. / You speak English.", note: "Yo = -o, tú = -as" },
          { correct: "Trabajamos aquí.", translation: "We work here.", note: "Nosotros = -amos" },
          { correct: "Estudian mucho.", translation: "They study a lot.", note: "Ellos/ustedes = -an" },
        ],
        commonMistakes: [
          { incorrect: "Yo hablas / Tú hablo", correction: "Yo hablo / Tú hablas", explanation: "The endings are person-specific. -o = yo, -as = tú. Swapping them is a serious error." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m4-l11-vs1",
        title: "Daily Routine — What Do You Do?",
        situation: "A new Spanish acquaintance asks about your daily life and work.",
        agentRole: "You are a friendly Spanish speaker. Ask about the student's daily routine: do they work or study, where, what languages they speak, what they buy, etc.",
        userGoal: "Describe your daily routine using at least 4 different -AR verbs.",
        targetPhrases: ["trabajo", "estudio", "hablo", "compro", "necesito", "escucho"],
        successCriteria: ["Correct -AR verb endings for each person", "At least 4 different -AR verbs used"],
        hints: ["Trabajo en... / Estudio en... / Hablo... / Compro... en el supermercado."],
      },
    ],
  },

  // ── LESSON 12 ── -ER and -IR Verbs ──────────────────────────
  {
    id: "es-l12",
    slug: "er-ir-verbs",
    title: "-ER and -IR Verbs — Completing the Set",
    content: `# -ER and -IR Verbs — Completing the Set

Spanish has three infinitive endings: -AR (90% of verbs), **-ER**, and **-IR**. The -ER and -IR patterns are very similar to each other — they only differ in two forms (nosotros and vosotros).

## The -ER Pattern (comer — to eat)

| Pronoun | Ending | Full form | English |
|---------|--------|----------|---------|
| yo | **-o** | com**o** | I eat |
| tú | **-es** | com**es** | you eat |
| él/ella/usted | **-e** | com**e** | he/she eats |
| nosotros | **-emos** | com**emos** | we eat |
| vosotros | **-éis** | com**éis** | you all eat |
| ellos/ustedes | **-en** | com**en** | they eat |

## The -IR Pattern (vivir — to live)

| Pronoun | Ending | Full form | English |
|---------|--------|----------|---------|
| yo | **-o** | viv**o** | I live |
| tú | **-es** | viv**es** | you live |
| él/ella/usted | **-e** | viv**e** | he/she lives |
| nosotros | **-imos** | viv**imos** | we live |
| vosotros | **-ís** | viv**ís** | you all live |
| ellos/ustedes | **-en** | viv**en** | they live |

\`\`\`concept
{ "title": "-ER vs -IR — Only Two Forms Differ", "variant": "info", "content": "The -ER and -IR patterns are nearly identical. The only difference: nosotros (-emos vs -imos) and vosotros (-éis vs -ís). For yo, tú, él, ellos — the endings are the same: -o, -es, -e, -en. So once you know -ER, you essentially know -IR too." }
\`\`\`

## Key -ER Verbs

| Infinitive | Meaning | Note |
|------------|---------|------|
| **comer** | to eat | comemos, comen |
| **beber** | to drink | bebemos, beben |
| **leer** | to read | lees, lee (double vowel) |
| **correr** | to run | corremos, corren |
| **vender** | to sell | vendo, vendes |
| **entender** | to understand | *stem-changing e→ie (Mod 5)* |
| **ver** | to see | *irregular: yo veo* |

## Key -IR Verbs

| Infinitive | Meaning | Note |
|------------|---------|------|
| **vivir** | to live | vivimos, viven |
| **escribir** | to write | escribo, escribe |
| **abrir** | to open | abro, abrimos |
| **recibir** | to receive | recibo, recibes |
| **subir** | to go up / upload | subo, sube |
| **pedir** | to order / ask for | *stem-changing e→i (Mod 5)* |

## Comparing All Three Patterns

| | -AR (hablar) | -ER (comer) | -IR (vivir) |
|-|-------------|------------|------------|
| yo | hablo | como | vivo |
| tú | hablas | comes | vives |
| él | habla | come | vive |
| nosotros | hablamos | comemos | vivimos |
| vosotros | habláis | coméis | vivís |
| ellos | hablan | comen | viven |

Notice: yo always ends in **-o** for all regular verbs.

\`\`\`quiz
{ "question": "Your Spanish friend says '¿Bebes café o té?' — What are they asking?", "options": ["Do you sell coffee or tea?", "Do you drink coffee or tea?", "Do you like coffee or tea?", "Do you bring coffee or tea?"], "answer": 1, "explanation": "Beber (to drink) → bebes (tú form: -ER + -es = beb + es). So '¿Bebes café o té?' = 'Do you drink coffee or tea?' It is NOT 'sell' (vender → vendes) or 'bring' (traer → traes). The -ER tú ending -es is the same as the -IR tú ending." }
\`\`\`

\`\`\`takeaways
{ "points": ["-ER endings: -o, -es, -e, -emos, -éis, -en (yo como, tú comes, nosotros comemos)", "-IR endings: -o, -es, -e, -imos, -ís, -en (yo vivo, nosotros vivimos — only difference from -ER)", "Yo form is always -o for ALL regular verbs regardless of infinitive type", "Key -ER verbs: comer, beber, leer, correr, vender, ver (irregular yo: veo)", "Key -IR verbs: vivir, escribir, abrir, recibir, subir"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m4",
    moduleTitle: "The Verb Engine",
    order: 2,
    topicId: "es-m4-l12-er-ir-verbs",
    vocabulary: [
      { word: "comer", translation: "to eat", pronunciation: "koh-MEHR", exampleSentence: "Comemos a las dos.", exampleTranslation: "We eat at two o'clock.", partOfSpeech: "verb" },
      { word: "beber", translation: "to drink", pronunciation: "beh-BEHR", exampleSentence: "¿Qué bebes por la mañana?", exampleTranslation: "What do you drink in the morning?", partOfSpeech: "verb" },
      { word: "vivir", translation: "to live", pronunciation: "bee-BEER", exampleSentence: "Vivo en Madrid desde hace dos años.", exampleTranslation: "I've lived in Madrid for two years.", partOfSpeech: "verb" },
      { word: "escribir", translation: "to write", pronunciation: "ehs-kree-BEER", exampleSentence: "Escribo en mi diario todos los días.", exampleTranslation: "I write in my diary every day.", partOfSpeech: "verb" },
      { word: "leer", translation: "to read", pronunciation: "leh-EHR", exampleSentence: "Leo mucho por la noche.", exampleTranslation: "I read a lot at night.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "-ER and -IR Verb Conjugation",
        explanation: "Both -ER and -IR remove the infinitive ending and add personal endings. The key difference is nosotros (-emos vs -imos) and vosotros (-éis vs -ís). All other forms use the same endings.",
        examples: [
          { correct: "Como, comes, come, comemos, coméis, comen", translation: "I eat, you eat, he/she eats...", note: "-ER pattern with comer" },
          { correct: "Vivo, vives, vive, vivimos, vivís, viven", translation: "I live, you live, he/she lives...", note: "-IR pattern with vivir" },
        ],
        commonMistakes: [
          { incorrect: "Yo comas / Tú como", correction: "Yo como / Tú comes", explanation: "The -o ending is always yo. Tú takes -as (-AR) or -es (-ER/-IR). Never swap them." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m4-l12-vs1",
        title: "Talking About Habits and Where You Live",
        situation: "A Spanish acquaintance asks about your daily habits — eating, reading, where you live.",
        agentRole: "You are a Spanish speaker chatting with the student about their habits. Ask what they eat, drink, read, and where they live. Ask follow-up questions.",
        userGoal: "Answer questions using -ER and -IR verbs: comer, beber, leer, vivir, escribir.",
        targetPhrases: ["como", "bebo", "leo", "vivo en", "escribo"],
        successCriteria: ["Correct -ER and -IR verb endings", "Natural use of yo forms and tú/él forms"],
        hints: ["Como... / Bebo... / Vivo en... / Leo libros de..."],
      },
    ],
  },

  // ── LESSON 13 ── Negation & Questions ───────────────────────
  {
    id: "es-l13",
    slug: "negation-questions",
    title: "Negation & Questions — No and ¿Qué?",
    content: `# Negation & Questions — No and ¿Qué?

Spanish negation is elegant: just put **no** before the verb. Questions are equally simple: add ¿? marks and raise your intonation. But Spanish also has a double-negative rule that English avoids — and it's mandatory.

## Negation — No Before the Verb

| Positive | Negative |
|----------|---------|
| Hablo español. | **No** hablo español. |
| Tengo un coche. | **No** tengo un coche. |
| Está aquí. | **No** está aquí. |
| Es inteligente. | **No** es inteligente. |

No other changes. No auxiliary verbs (no "do/does/don't/doesn't"). Just **no** before the main verb.

\`\`\`concept
{ "title": "Double Negation — Required in Spanish", "variant": "warning", "content": "In English: 'I don't see anything.' (single negative — correct). 'I don't see nothing.' (double negative — grammatically wrong in standard English). In Spanish, double negatives are REQUIRED. 'No veo nada.' = literally 'I don't see nothing.' Both 'no' AND 'nada' are used together. This is the rule, not an error." }
\`\`\`

## Negative Words — Always Pair with No

| Negative word | Meaning | Example |
|--------------|---------|---------|
| **nada** | nothing | No sé nada. (I know nothing.) |
| **nadie** | nobody | No hay nadie aquí. (Nobody is here.) |
| **nunca** | never | No trabajo nunca los domingos. (I never work Sundays.) |
| **tampoco** | neither / not either | No tengo hambre. — Yo tampoco. (I'm not hungry. — Me neither.) |
| **ningún/ninguna** | no / none | No tengo ningún problema. (I have no problem.) |

Exception: if the negative word comes **before** the verb, drop the "no":
- **Nunca** trabajo los domingos. (I never work Sundays.) ← no "no" needed
- **Nadie** está aquí. ← no "no" needed

## Questions — Yes/No Questions

For yes/no questions, Spanish just adds ¿? marks and raises intonation. Word order can be inverted (verb before subject) but doesn't have to be:

- ¿**Hablas** español? — Do you speak Spanish?
- ¿**Tiene** usted reserva? — Do you have a reservation?
- ¿**Está** Juan en casa? — Is Juan at home?

No "do/does" needed — the ¿? marks do the work.

## Questions — Question Words

| Word | Meaning | Example |
|------|---------|---------|
| **¿Qué?** | What? | ¿Qué quieres? |
| **¿Quién?** | Who? | ¿Quién eres tú? |
| **¿Dónde?** | Where? | ¿Dónde está el hotel? |
| **¿Cuándo?** | When? | ¿Cuándo llegas? |
| **¿Por qué?** | Why? | ¿Por qué estudias español? |
| **¿Cómo?** | How? | ¿Cómo estás? |
| **¿Cuánto/a?** | How much? | ¿Cuánto cuesta? |
| **¿Cuántos/as?** | How many? | ¿Cuántos años tienes? |
| **¿Cuál/Cuáles?** | Which? / What? | ¿Cuál es tu nombre? |

\`\`\`compare
{ "title": "English Questions Need Auxiliaries — Spanish Doesn't", "left": { "label": "English (needs do/does/did)", "items": ["Do you speak Spanish?", "Does she live here?", "Did they eat already?", "Can't invert without auxiliary"] }, "right": { "label": "Spanish (just ¿? and intonation)", "items": ["¿Hablas español?", "¿Vive ella aquí?", "¿Ya comieron?", "Invert verb-subject freely"] } }
\`\`\`

\`\`\`quiz
{ "question": "How do you correctly say 'I never eat meat' in Spanish?", "options": ["Nunca como carne.", "No como nunca carne.", "No como nada carne.", "Nunca no como carne."], "answer": 0, "explanation": "Both 'Nunca como carne' and 'No como nunca carne' are grammatically correct. When 'nunca' comes BEFORE the verb, no 'no' is needed. When 'nunca' comes AFTER the verb, 'no' must come before the verb: 'No como nunca carne.' Both are natural Spanish. Option A is cleaner and more common." }
\`\`\`

\`\`\`takeaways
{ "points": ["Negation: put 'no' before the verb — no auxiliaries needed: No hablo francés.", "Double negatives are mandatory in Spanish: No sé nada. (I don't know anything.)", "Negative words before the verb → drop 'no': Nunca trabajo. / Nadie está.", "Yes/no questions: add ¿? and raise intonation — no 'do/does' auxiliary needed", "Question words all carry accent marks: ¿Qué?, ¿Quién?, ¿Dónde?, ¿Cuándo?, ¿Por qué?, ¿Cómo?"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m4",
    moduleTitle: "The Verb Engine",
    order: 3,
    topicId: "es-m4-l13-negation-questions",
    vocabulary: [
      { word: "no", translation: "no / not", pronunciation: "noh", exampleSentence: "No entiendo.", exampleTranslation: "I don't understand.", partOfSpeech: "negation" },
      { word: "nada", translation: "nothing / anything (in negatives)", pronunciation: "NAH-dah", exampleSentence: "No tengo nada.", exampleTranslation: "I have nothing.", partOfSpeech: "pronoun" },
      { word: "nunca", translation: "never", pronunciation: "NOON-kah", exampleSentence: "Nunca como pescado.", exampleTranslation: "I never eat fish.", partOfSpeech: "adverb" },
      { word: "nadie", translation: "nobody / no one", pronunciation: "NAH-dyeh", exampleSentence: "No hay nadie en casa.", exampleTranslation: "There is nobody at home.", partOfSpeech: "pronoun" },
      { word: "¿por qué?", translation: "why?", pronunciation: "pohr KEH", exampleSentence: "¿Por qué estudias español?", exampleTranslation: "Why do you study Spanish?", partOfSpeech: "question word" },
      { word: "¿cuánto?", translation: "how much?", pronunciation: "KWAHN-toh", exampleSentence: "¿Cuánto cuesta el billete?", exampleTranslation: "How much does the ticket cost?", partOfSpeech: "question word" },
    ],
    grammarPoints: [
      {
        title: "Spanish Double Negation — Required, Not Wrong",
        explanation: "When a negative word (nada, nadie, nunca, tampoco) follows the verb, 'no' must also precede the verb. This double negation is grammatically required in Spanish, unlike in standard English.",
        examples: [
          { correct: "No veo nada.", translation: "I don't see anything.", note: "No + verb + nada (double negative = correct)" },
          { correct: "No viene nadie.", translation: "Nobody is coming.", note: "No + verb + nadie" },
          { correct: "Nunca como aquí.", translation: "I never eat here.", note: "Nunca before verb → no 'no' needed" },
        ],
        commonMistakes: [
          { incorrect: "No veo algo.", correction: "No veo nada.", explanation: "After 'no', use the negative form: nada (not algo), nadie (not alguien), nunca (not siempre)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m4-l13-vs1",
        title: "Refusing Food and Asking About the Menu",
        situation: "You're at a tapas bar in Seville. The server offers various items.",
        agentRole: "You are a friendly server at a tapas bar in Seville. Offer various food and drink items. Some things the student dislikes or has dietary needs around.",
        userGoal: "Politely decline some items using no + verb and double negatives (no tengo nada, no como nunca...). Ask what is available (¿Tienen...? / ¿Hay...?).",
        targetPhrases: ["no como", "no tengo", "nunca", "no hay nada", "¿tienen?", "¿qué hay?"],
        successCriteria: ["Uses no correctly before verb for negation", "Uses double negatives correctly", "Asks questions using question words"],
        hints: ["No como carne. / No bebo alcohol. / Nunca como... / ¿Tienen algo vegetariano?"],
      },
    ],
  },

  // ── LESSON 14 ── Essential Irregular Verbs ───────────────────
  {
    id: "es-l14",
    slug: "essential-irregulars",
    title: "Essential Irregulars — Ir, Querer, Poder, Hacer",
    content: `# Essential Irregulars — Ir, Querer, Poder, Hacer

The four most useful verbs after ser/estar/tener are all irregular: **ir** (to go), **querer** (to want), **poder** (can), **hacer** (to do/make). Learn them by heart — you'll use them every day.

## Ir — To Go

| | ir |
|-|----|
| yo | **voy** |
| tú | **vas** |
| él/ella/usted | **va** |
| nosotros | **vamos** |
| vosotros | **vais** |
| ellos/ustedes | **van** |

Ir is used for going somewhere AND for the near future: **ir + a + infinitive** = going to do something.
- Voy **al** banco. — I'm going to the bank.
- Vamos **a comer**. — We're going to eat. / Let's eat!
- ¿Qué vas **a hacer** hoy? — What are you going to do today?

## Querer — To Want (Stem-Changing: e → ie)

| | querer |
|-|--------|
| yo | **quiero** |
| tú | **quieres** |
| él/ella/usted | **quiere** |
| nosotros | **queremos** |
| vosotros | **queréis** |
| ellos/ustedes | **quieren** |

Note: the stem change e→ie affects all forms **except** nosotros and vosotros. This is the most common irregular pattern in Spanish.

- Quiero un café, por favor. — I want a coffee, please.
- ¿Qué quieres hacer? — What do you want to do?
- No queremos ir. — We don't want to go.

## Poder — Can / To Be Able (Stem-Changing: o → ue)

| | poder |
|-|-------|
| yo | **puedo** |
| tú | **puedes** |
| él/ella/usted | **puede** |
| nosotros | **podemos** |
| vosotros | **podéis** |
| ellos/ustedes | **pueden** |

- ¿Puedes ayudarme? — Can you help me?
- No puedo dormir. — I can't sleep.
- ¿Se puede fumar aquí? — Can you smoke here? (Is smoking allowed here?)

## Hacer — To Do / To Make

| | hacer |
|-|-------|
| yo | **hago** |
| tú | **haces** |
| él/ella/usted | **hace** |
| nosotros | **hacemos** |
| vosotros | **hacéis** |
| ellos/ustedes | **hacen** |

Note: only the **yo form is irregular** (hago). All other forms are regular -ER.

- ¿Qué **haces**? — What are you doing?
- **Hago** deporte. — I exercise. (lit: I do sport)
- ¿Qué tiempo **hace**? — What's the weather like?
- **Hace** calor. — It's hot. / **Hace** frío. — It's cold.

\`\`\`concept
{ "title": "The Yo-Go Irregulars — A Useful Pattern", "variant": "info", "content": "Several common Spanish verbs are irregular ONLY in the yo (I) form — all other forms are regular. The yo form ends in -go. This is called the 'yo-go' pattern. Hacer → yo hago. Tener → yo tengo. Salir → yo salgo. Poner → yo pongo. Venir → yo vengo. Decir → yo digo. Once you know this pattern, each new yo-go verb is easy to add." }
\`\`\`

\`\`\`compare
{ "title": "Querer vs Poder — Want vs Can", "left": { "label": "Querer (want to)", "items": ["Quiero comer. (I want to eat.)", "¿Quieres ir? (Do you want to go?)", "No queremos esperar. (We don't want to wait.)", "Querer = desire, wish"] }, "right": { "label": "Poder (can, am able to)", "items": ["Puedo comer ahora. (I can eat now.)", "¿Puedes ir? (Can you go?)", "No podemos esperar. (We can't wait.)", "Poder = ability, permission, possibility"] } }
\`\`\`

\`\`\`quiz
{ "question": "Which sentence correctly uses 'ir + a + infinitive' for the near future?", "options": ["Voy comer mañana.", "Voy a comer mañana.", "Voy de comer mañana.", "Voy para comer mañana."], "answer": 1, "explanation": "The near future construction is: ir (conjugated) + A + infinitive. Voy A comer mañana = I'm going to eat tomorrow. The preposition 'a' is required. 'Voy comer' (missing 'a') is wrong. 'Voy de/para comer' use the wrong prepositions." }
\`\`\`

\`\`\`takeaways
{ "points": ["Ir: voy, vas, va, vamos, vais, van — highly irregular, must memorize", "Ir + a + infinitive = near future: Voy a estudiar. Vamos a comer.", "Querer (e→ie stem change): quiero, quieres, quiere, queremos, queréis, quieren", "Poder (o→ue stem change): puedo, puedes, puede, podemos, podéis, pueden", "Hacer: yo hago (irregular), all other forms regular: haces, hace, hacemos, hacéis, hacen", "Hacer + weather: Hace calor / Hace frío / Hace sol — all with hacer, not with ser or estar"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m4",
    moduleTitle: "The Verb Engine",
    order: 4,
    topicId: "es-m4-l14-irregulars",
    vocabulary: [
      { word: "ir", translation: "to go", pronunciation: "eer", exampleSentence: "¿Adónde vas?", exampleTranslation: "Where are you going?", partOfSpeech: "verb" },
      { word: "voy a + infinitive", translation: "I'm going to... (near future)", pronunciation: "BOY ah", exampleSentence: "Voy a estudiar esta noche.", exampleTranslation: "I'm going to study tonight.", partOfSpeech: "phrase" },
      { word: "quiero", translation: "I want", pronunciation: "KYEH-roh", exampleSentence: "Quiero aprender español.", exampleTranslation: "I want to learn Spanish.", partOfSpeech: "verb" },
      { word: "puedo", translation: "I can", pronunciation: "PWEH-doh", exampleSentence: "¿Puedo ayudarte?", exampleTranslation: "Can I help you?", partOfSpeech: "verb" },
      { word: "hago", translation: "I do / I make", pronunciation: "AH-goh", exampleSentence: "Hago ejercicio cada mañana.", exampleTranslation: "I exercise every morning.", partOfSpeech: "verb" },
      { word: "hace calor/frío", translation: "it's hot/cold (weather)", pronunciation: "AH-seh kah-LOHR / FREE-oh", exampleSentence: "Hoy hace mucho calor.", exampleTranslation: "Today it's very hot.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Ir + A + Infinitive — The Near Future",
        explanation: "The most common way to express future plans in Spanish at A1 level. Conjugate ir, add 'a', then the infinitive of the action verb. Equivalent to English 'going to'.",
        examples: [
          { correct: "Voy a comer.", translation: "I'm going to eat.", note: "Ir (voy) + a + infinitive (comer)" },
          { correct: "¿Vas a estudiar hoy?", translation: "Are you going to study today?", note: "Question uses the same structure" },
          { correct: "Vamos a hablar.", translation: "We're going to talk. / Let's talk.", note: "Vamos a + infinitive = Let's..." },
        ],
        commonMistakes: [
          { incorrect: "Voy comer / Voy de comer", correction: "Voy a comer", explanation: "The preposition 'a' is required between ir and the infinitive. It cannot be omitted or replaced with de/para." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m4-l14-vs1",
        title: "Planning the Weekend",
        situation: "You and a Spanish friend are planning what to do this weekend.",
        agentRole: "You are a Spanish friend making weekend plans. Suggest activities, ask what the student wants to do, whether they can come to things. Use ir, querer, poder, hacer.",
        userGoal: "Discuss weekend plans using voy a, quiero, puedo/no puedo, and ¿qué hacemos?",
        targetPhrases: ["voy a", "quiero", "puedo", "no puedo", "¿qué hacemos?", "¿puedes?"],
        successCriteria: ["Uses ir + a + infinitive for future plans", "Uses quiero and puedo with infinitives correctly"],
        hints: ["Voy a... el sábado. / Quiero ir a... / No puedo el domingo porque... / ¿Hacemos...?"],
      },
    ],
  },
];
