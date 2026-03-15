// Spanish Intermediate (B1) Course Data
// CEFR B1 Level - Narrating, Opinions, Workplace, Hypotheticals

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "spanish-intermediate",
  slug: "spanish-intermediate",
  title: "Spanish Intermediate - B1",
  language: "es",
  languageName: "Spanish",
  proficiencyLevel: "B1" as const,
  description: "Develop fluency in Spanish through past narration, subjunctive mood, workplace communication, and hypothetical reasoning. Designed for learners ready to move beyond basics.",
  targetAudience: "Learners who have completed Spanish Beginner (A2) and can handle everyday conversations",
  estimatedHours: 80,
  icon: "🇪🇸",
  prerequisiteCourseSlug: "spanish-beginner",
  nextCourseSlug: "spanish-advanced",
};

// ============================================
// Module 1: Narrating the Past
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "es-int-l1",
    slug: "preterite-vs-imperfect",
    title: "Preterite vs. Imperfect",
    content: `# Preterite vs. Imperfect

One of the trickiest aspects of Spanish: choosing between the preterite and the imperfect when talking about the past.

## When to Use the Preterite

The preterite describes **completed actions** with a clear beginning or end:
- **Ayer comí paella.** - Yesterday I ate paella.
- **Llegaron a las ocho.** - They arrived at eight.

## When to Use the Imperfect

The imperfect describes **ongoing states, habitual actions, or background descriptions**:
- **Cuando era niño, jugaba en el parque.** - When I was a child, I used to play in the park.
- **Hacía sol y los pájaros cantaban.** - It was sunny and the birds were singing.

## Using Both Together

Often you'll use both in the same sentence — the imperfect sets the scene, the preterite interrupts it:
- **Mientras dormía, sonó el teléfono.** - While I was sleeping, the phone rang.
- **Llovía cuando salimos del cine.** - It was raining when we left the cinema.`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m1",
    moduleTitle: "Narrating the Past",
    order: 1,
    topicId: "es-intermediate-preterite-vs-imperfect",
    vocabulary: [
      { word: "mientras", translation: "while", pronunciation: "MYEHN-trahs", exampleSentence: "Mientras estudiaba, escuchaba música.", exampleTranslation: "While I was studying, I listened to music.", partOfSpeech: "conjunction" },
      { word: "de repente", translation: "suddenly", pronunciation: "deh reh-PEHN-teh", exampleSentence: "De repente, alguien llamó a la puerta.", exampleTranslation: "Suddenly, someone knocked on the door.", partOfSpeech: "adverb" },
      { word: "en aquel entonces", translation: "back then", pronunciation: "ehn ah-KEHL ehn-TOHN-sehs", exampleSentence: "En aquel entonces, vivíamos en Madrid.", exampleTranslation: "Back then, we lived in Madrid.", partOfSpeech: "phrase" },
      { word: "soler", translation: "to usually do", pronunciation: "soh-LEHR", exampleSentence: "Solía correr por las mañanas.", exampleTranslation: "I used to run in the mornings.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Preterite vs. Imperfect: Decision Framework",
        explanation: `Ask yourself: **Was the action completed (with a clear endpoint)?** Use preterite. **Was it ongoing, habitual, or descriptive?** Use imperfect. When both appear in one sentence, the imperfect is the "background" and the preterite is the "event."`,
        examples: [
          { correct: "Ayer llovió todo el día.", translation: "Yesterday it rained all day. (completed event)", note: "Preterite: the rain is treated as a bounded event" },
          { correct: "Cuando era joven, llovía mucho en mi pueblo.", translation: "When I was young, it rained a lot in my town.", note: "Imperfect: habitual/background" },
          { correct: "Caminaba por la calle cuando vi a María.", translation: "I was walking down the street when I saw María.", note: "Imperfect (background) + preterite (interruption)" },
        ],
        commonMistakes: [
          { incorrect: "Ayer llovía todo el día.", correction: "Ayer llovió todo el día.", explanation: "'Ayer' signals a completed, bounded time frame — use preterite." },
          { incorrect: "Cuando era niño, fui al parque cada día.", correction: "Cuando era niño, iba al parque cada día.", explanation: "Habitual past actions require the imperfect, not the preterite." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "childhood-story",
        title: "Sharing a Childhood Memory",
        situation: "You're chatting with a friend about what life was like growing up",
        agentRole: "You are Marta, a Spanish friend sharing childhood memories. Ask the student about their childhood and share your own stories. Gently correct preterite/imperfect mistakes.",
        userGoal: "Describe what your life was like as a child and tell a specific story from your past",
        targetPhrases: ["Cuando era niño/a...", "Solía...", "Un día...", "Mientras..."],
        successCriteria: ["Uses imperfect for habitual/background descriptions", "Uses preterite for specific events", "Combines both tenses in at least one sentence"],
        hints: ["Use imperfect for 'used to' and descriptions", "Switch to preterite when something specific happened"],
      },
    ],
    culturalNotes: [
      {
        title: "Storytelling in Spanish Culture",
        content: "Spaniards love telling long, detailed stories (anécdotas). It's common to set the scene extensively with the imperfect before getting to the main event. Don't rush to the point — the journey is part of the story.",
        region: "Spain",
      },
    ],
  },
  {
    id: "es-int-l2",
    slug: "pluperfect-tense",
    title: "The Pluperfect Tense",
    content: `# The Pluperfect Tense (Pretérito Pluscuamperfecto)

The pluperfect lets you talk about what **had happened** before another past event.

## Formation

**había / habías / había / habíamos / habíais / habían** + past participle

## Examples

- **Cuando llegué, ya habían comido.** - When I arrived, they had already eaten.
- **No sabía que habías vivido en Argentina.** - I didn't know you had lived in Argentina.
- **Nunca había visto algo así.** - I had never seen anything like that.

## Common Time Markers

- **ya** - already
- **nunca** - never (before that point)
- **todavía no** - not yet
- **antes de que** - before`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m1",
    moduleTitle: "Narrating the Past",
    order: 2,
    topicId: "es-intermediate-pluperfect-tense",
    vocabulary: [
      { word: "ya", translation: "already", pronunciation: "yah", exampleSentence: "Ya habíamos terminado cuando llamaste.", exampleTranslation: "We had already finished when you called.", partOfSpeech: "adverb" },
      { word: "todavía no", translation: "not yet", pronunciation: "toh-dah-VEE-ah noh", exampleSentence: "Todavía no había llegado el tren.", exampleTranslation: "The train hadn't arrived yet.", partOfSpeech: "phrase" },
      { word: "anteriormente", translation: "previously", pronunciation: "ahn-teh-ree-ohr-MEHN-teh", exampleSentence: "Anteriormente había trabajado como profesor.", exampleTranslation: "Previously he had worked as a teacher.", partOfSpeech: "adverb" },
      { word: "darse cuenta", translation: "to realize", pronunciation: "DAHR-seh KWEHN-tah", exampleSentence: "Me di cuenta de que había olvidado las llaves.", exampleTranslation: "I realized I had forgotten the keys.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Forming the Pluperfect",
        explanation: "Conjugate 'haber' in the imperfect (había, habías, había, habíamos, habíais, habían) and add the past participle (-ado for -ar verbs, -ido for -er/-ir verbs). Remember irregular participles: hecho (hacer), dicho (decir), escrito (escribir), visto (ver), puesto (poner), vuelto (volver).",
        examples: [
          { correct: "Había comido antes de salir.", translation: "I had eaten before going out." },
          { correct: "¿Habías visto esa película?", translation: "Had you seen that movie?" },
          { correct: "Nunca habíamos hecho algo así.", translation: "We had never done something like that." },
        ],
        commonMistakes: [
          { incorrect: "Había comiendo cuando llegaste.", correction: "Estaba comiendo cuando llegaste.", explanation: "Don't confuse the pluperfect (había + participle) with the past progressive (estaba + gerund)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "travel-mishap",
        title: "A Travel Mishap",
        situation: "You're telling a friend about a trip where things went wrong",
        agentRole: "You are Luis, listening to your friend's travel story. Ask follow-up questions about what had happened before the main incident.",
        userGoal: "Narrate a travel story using the pluperfect to explain what had already happened before the main event",
        targetPhrases: ["Había reservado...", "Ya habíamos...", "Nunca había...", "Todavía no..."],
        successCriteria: ["Uses pluperfect to sequence past events", "Correctly forms past participles", "Sequences events logically"],
      },
    ],
  },
  {
    id: "es-int-l3",
    slug: "storytelling-connectors",
    title: "Storytelling Connectors",
    content: `# Storytelling Connectors

Make your narratives flow naturally with these linking words and phrases.

## Sequencing

- **primero** - first
- **luego / después** - then / after
- **al final** - in the end
- **por último** - lastly

## Adding Detail

- **además** - moreover / besides
- **sin embargo** - however
- **por eso** - that's why / therefore
- **en cambio** - on the other hand

## Cause and Effect

- **como** - since / as
- **porque** - because
- **así que** - so / therefore
- **gracias a** - thanks to
- **a pesar de** - despite

## Temporal Connectors

- **al principio** - at the beginning
- **en aquel momento** - at that moment
- **mientras tanto** - meanwhile
- **a partir de entonces** - from then on`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m1",
    moduleTitle: "Narrating the Past",
    order: 3,
    topicId: "es-intermediate-storytelling-connectors",
    vocabulary: [
      { word: "sin embargo", translation: "however", pronunciation: "seen ehm-BAHR-goh", exampleSentence: "Llovía mucho; sin embargo, salimos a pasear.", exampleTranslation: "It was raining a lot; however, we went out for a walk.", partOfSpeech: "conjunction" },
      { word: "por eso", translation: "that's why", pronunciation: "pohr EH-soh", exampleSentence: "Estaba cansado, por eso me fui temprano.", exampleTranslation: "I was tired, that's why I left early.", partOfSpeech: "conjunction" },
      { word: "a pesar de", translation: "despite", pronunciation: "ah peh-SAHR deh", exampleSentence: "A pesar de la lluvia, disfrutamos del viaje.", exampleTranslation: "Despite the rain, we enjoyed the trip.", partOfSpeech: "preposition" },
      { word: "mientras tanto", translation: "meanwhile", pronunciation: "MYEHN-trahs TAHN-toh", exampleSentence: "Yo cocinaba; mientras tanto, él ponía la mesa.", exampleTranslation: "I was cooking; meanwhile, he was setting the table.", partOfSpeech: "adverb" },
      { word: "así que", translation: "so / therefore", pronunciation: "ah-SEE keh", exampleSentence: "Perdimos el autobús, así que tomamos un taxi.", exampleTranslation: "We missed the bus, so we took a taxi.", partOfSpeech: "conjunction" },
    ],
    grammarPoints: [
      {
        title: "Connector Placement and Punctuation",
        explanation: "Most connectors appear at the start of a clause, often preceded by a semicolon or period. 'Sin embargo' and 'además' typically follow a semicolon. 'Porque' and 'como' join clauses directly. 'Como' (since) always starts the sentence.",
        examples: [
          { correct: "Como llovía, nos quedamos en casa.", translation: "Since it was raining, we stayed home.", note: "'Como' (since) always leads the sentence" },
          { correct: "No teníamos paraguas; por eso nos mojamos.", translation: "We didn't have umbrellas; that's why we got wet." },
          { correct: "Además, el hotel era muy bonito.", translation: "Moreover, the hotel was very beautiful." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "weekend-story",
        title: "Tell Me About Your Weekend",
        situation: "A colleague asks what you did over the weekend",
        agentRole: "You are Claudia, a colleague at work on Monday morning. Ask about the student's weekend and react with interest. Encourage them to use connectors.",
        userGoal: "Narrate your weekend using at least four different connectors to link events",
        targetPhrases: ["Primero...", "Luego...", "Sin embargo...", "Al final..."],
        successCriteria: ["Uses at least 3 different connectors", "Events are logically sequenced", "Combines preterite and imperfect appropriately"],
      },
    ],
  },
];

// ============================================
// Module 2: Opinions & Arguments
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "es-int-l4",
    slug: "subjunctive-intro",
    title: "Introduction to the Subjunctive",
    content: `# Introduction to the Subjunctive (El Subjuntivo)

The subjunctive is a mood (not a tense) used to express wishes, emotions, doubts, and hypotheticals.

## When to Use It

The subjunctive appears after verbs or expressions of:
- **Desire:** querer que, esperar que, desear que
- **Emotion:** alegrarse de que, tener miedo de que
- **Hope:** ojalá (que)

## Present Subjunctive Formation

For **-ar** verbs: change to -e endings (hable, hables, hable, hablemos, habléis, hablen)
For **-er/-ir** verbs: change to -a endings (coma, comas, coma, comamos, comáis, coman)

## Key Examples

- **Espero que tengas un buen día.** - I hope you have a good day.
- **Quiero que vengas a la fiesta.** - I want you to come to the party.
- **Ojalá haga buen tiempo mañana.** - I hope the weather is good tomorrow.

## Important Rule

The subjunctive requires **two different subjects**:
- Quiero **que tú** vengas. (I want you to come.) -- subjunctive
- Quiero venir. (I want to come.) -- infinitive (same subject)`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m2",
    moduleTitle: "Opinions & Arguments",
    order: 4,
    topicId: "es-intermediate-subjunctive-intro",
    vocabulary: [
      { word: "esperar", translation: "to hope / to wait", pronunciation: "ehs-peh-RAHR", exampleSentence: "Espero que todo salga bien.", exampleTranslation: "I hope everything goes well.", partOfSpeech: "verb" },
      { word: "ojalá", translation: "I hope / if only", pronunciation: "oh-hah-LAH", exampleSentence: "Ojalá llueva pronto.", exampleTranslation: "I hope it rains soon.", partOfSpeech: "interjection" },
      { word: "desear", translation: "to wish", pronunciation: "deh-seh-AHR", exampleSentence: "Deseo que seas feliz.", exampleTranslation: "I wish you to be happy.", partOfSpeech: "verb" },
      { word: "temer", translation: "to fear", pronunciation: "teh-MEHR", exampleSentence: "Temo que no lleguen a tiempo.", exampleTranslation: "I fear they won't arrive on time.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Present Subjunctive Formation",
        explanation: "Start with the 'yo' form of the present indicative, drop the -o, and add opposite endings: -ar verbs get -e/-es/-e/-emos/-éis/-en; -er/-ir verbs get -a/-as/-a/-amos/-áis/-an. Irregulars: sea (ser), haya (haber), vaya (ir), sepa (saber), dé (dar), esté (estar).",
        examples: [
          { correct: "Espero que hables con ella.", translation: "I hope you talk to her.", note: "hablar → hable (ar → e)" },
          { correct: "Quiero que escribas la carta.", translation: "I want you to write the letter.", note: "escribir → escriba (ir → a)" },
          { correct: "Ojalá sea verdad.", translation: "I hope it's true.", note: "ser → sea (irregular)" },
        ],
        commonMistakes: [
          { incorrect: "Espero que tienes un buen día.", correction: "Espero que tengas un buen día.", explanation: "After 'espero que' you must use the subjunctive (tengas), not the indicative (tienes)." },
          { incorrect: "Quiero que tú vienes.", correction: "Quiero que tú vengas.", explanation: "Querer que triggers the subjunctive." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "wishes-hopes",
        title: "Sharing Hopes and Wishes",
        situation: "You're talking with a friend about New Year's resolutions and hopes for the future",
        agentRole: "You are Andrés, discussing hopes for the coming year. Share your wishes and ask the student about theirs. Gently prompt subjunctive usage.",
        userGoal: "Express at least three hopes or wishes using the subjunctive",
        targetPhrases: ["Espero que...", "Ojalá...", "Quiero que...", "Deseo que..."],
        successCriteria: ["Uses subjunctive after wish/hope triggers", "Correctly conjugates at least 2 subjunctive verbs", "Expresses personal desires"],
      },
    ],
  },
  {
    id: "es-int-l5",
    slug: "opinion-phrases",
    title: "Expressing & Defending Opinions",
    content: `# Expressing & Defending Opinions

Learn to share your views and engage in civil debate.

## Giving Opinions

- **Creo que...** - I think that... (indicative follows)
- **Me parece que...** - It seems to me that...
- **En mi opinión...** - In my opinion...
- **Desde mi punto de vista...** - From my point of view...

## Disagreeing

- **No creo que...** - I don't think that... (subjunctive follows!)
- **No estoy de acuerdo con...** - I don't agree with...
- **Respeto tu opinión, pero...** - I respect your opinion, but...

## Agreeing

- **Estoy de acuerdo** - I agree
- **Tienes razón** - You're right
- **Exactamente / Exacto** - Exactly

## Important Grammar Note

**Creo que** + indicative: *Creo que tiene razón.*
**No creo que** + subjunctive: *No creo que tenga razón.*`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m2",
    moduleTitle: "Opinions & Arguments",
    order: 5,
    topicId: "es-intermediate-opinion-phrases",
    vocabulary: [
      { word: "opinar", translation: "to think / to hold an opinion", pronunciation: "oh-pee-NAHR", exampleSentence: "¿Qué opinas sobre este tema?", exampleTranslation: "What do you think about this topic?", partOfSpeech: "verb" },
      { word: "estar de acuerdo", translation: "to agree", pronunciation: "ehs-TAHR deh ah-KWEHR-doh", exampleSentence: "Estoy totalmente de acuerdo contigo.", exampleTranslation: "I totally agree with you.", partOfSpeech: "phrase" },
      { word: "en cambio", translation: "on the other hand", pronunciation: "ehn KAHM-byoh", exampleSentence: "A mí me gusta el café; en cambio, ella prefiere el té.", exampleTranslation: "I like coffee; on the other hand, she prefers tea.", partOfSpeech: "phrase" },
      { word: "punto de vista", translation: "point of view", pronunciation: "POON-toh deh VEES-tah", exampleSentence: "Desde mi punto de vista, es una buena idea.", exampleTranslation: "From my point of view, it's a good idea.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Indicative vs. Subjunctive with Opinion Verbs",
        explanation: "Affirmative opinion verbs (creo que, pienso que, me parece que) take the **indicative** because you're asserting a belief. Negative opinion verbs (no creo que, no pienso que) take the **subjunctive** because you're denying or doubting.",
        examples: [
          { correct: "Creo que es importante.", translation: "I think it's important. (indicative)" },
          { correct: "No creo que sea importante.", translation: "I don't think it's important. (subjunctive)" },
          { correct: "Me parece que tienen razón.", translation: "It seems to me they're right. (indicative)" },
        ],
        commonMistakes: [
          { incorrect: "No creo que es verdad.", correction: "No creo que sea verdad.", explanation: "After 'no creo que', always use the subjunctive." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "friendly-debate",
        title: "A Friendly Debate",
        situation: "You and a friend are debating whether remote work is better than office work",
        agentRole: "You are Sofía, who prefers working in an office. Present your arguments and challenge the student's views politely. Use opinion phrases naturally.",
        userGoal: "Defend your position on remote vs. office work using opinion phrases and at least one subjunctive construction",
        targetPhrases: ["Creo que...", "No estoy de acuerdo...", "Desde mi punto de vista...", "No creo que..."],
        successCriteria: ["Gives clear opinions", "Responds to counterarguments", "Uses at least one subjunctive after negative opinion verb"],
      },
    ],
  },
  {
    id: "es-int-l6",
    slug: "debate-and-persuasion",
    title: "Debate & Persuasion",
    content: `# Debate & Persuasion

Structure your arguments and persuade others.

## Building an Argument

- **En primer lugar...** - In the first place...
- **Por un lado... por otro lado...** - On one hand... on the other hand...
- **Hay que tener en cuenta que...** - We must take into account that...
- **Es evidente que...** - It's evident that... (indicative)
- **No es cierto que...** - It's not true that... (subjunctive)

## Persuasion Phrases

- **Es importante que...** - It's important that... (subjunctive)
- **Es necesario que...** - It's necessary that... (subjunctive)
- **Te recomiendo que...** - I recommend that you... (subjunctive)
- **Es mejor que...** - It's better that... (subjunctive)

## Conceding a Point

- **Tienes razón en que...** - You're right that...
- **Es cierto que..., pero...** - It's true that..., but...
- **Aunque tengas razón...** - Even if you're right... (subjunctive)`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m2",
    moduleTitle: "Opinions & Arguments",
    order: 6,
    topicId: "es-intermediate-debate-and-persuasion",
    vocabulary: [
      { word: "argumento", translation: "argument (reasoning)", pronunciation: "ahr-goo-MEHN-toh", exampleSentence: "Tu argumento es muy convincente.", exampleTranslation: "Your argument is very convincing.", partOfSpeech: "noun" },
      { word: "convencer", translation: "to convince", pronunciation: "kohn-vehn-SEHR", exampleSentence: "No me vas a convencer fácilmente.", exampleTranslation: "You're not going to convince me easily.", partOfSpeech: "verb" },
      { word: "tener en cuenta", translation: "to take into account", pronunciation: "teh-NEHR ehn KWEHN-tah", exampleSentence: "Hay que tener en cuenta los costes.", exampleTranslation: "We must take the costs into account.", partOfSpeech: "phrase" },
      { word: "aunque", translation: "although / even if", pronunciation: "ahn-OON-keh", exampleSentence: "Aunque llueva, iremos a la playa.", exampleTranslation: "Even if it rains, we'll go to the beach.", partOfSpeech: "conjunction" },
    ],
    grammarPoints: [
      {
        title: "Impersonal Expressions + Subjunctive",
        explanation: "Impersonal expressions (es + adjective + que) trigger the subjunctive when they express necessity, importance, or value judgment: es importante que, es necesario que, es mejor que, es posible que. Expressions of certainty use indicative: es cierto que, es evidente que. Their negatives flip: no es cierto que + subjunctive.",
        examples: [
          { correct: "Es importante que estudies.", translation: "It's important that you study. (subjunctive)" },
          { correct: "Es cierto que habla bien.", translation: "It's true that she speaks well. (indicative)" },
          { correct: "No es cierto que sea fácil.", translation: "It's not true that it's easy. (subjunctive)" },
        ],
      },
      {
        title: "'Aunque' with Indicative vs. Subjunctive",
        explanation: "'Aunque' + indicative states a known fact: 'Aunque llueve, salgo' (Although it IS raining, I'm going out). 'Aunque' + subjunctive expresses a hypothetical: 'Aunque llueva, saldré' (Even if it rains, I'll go out).",
        examples: [
          { correct: "Aunque está lejos, voy caminando.", translation: "Although it's far, I walk. (known fact)" },
          { correct: "Aunque esté lejos, iré caminando.", translation: "Even if it's far, I'll walk. (hypothetical)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "city-debate",
        title: "City vs. Countryside Living",
        situation: "You're in a group discussion about the pros and cons of city vs. countryside living",
        agentRole: "You are Pablo, moderating a debate. Present arguments for countryside living and ask the student to argue for city life. Push back on their points.",
        userGoal: "Build a structured argument for city living using persuasion phrases and connectors",
        targetPhrases: ["En primer lugar...", "Es importante que...", "Por un lado...", "Aunque..."],
        successCriteria: ["Uses structured argument phrases", "Employs subjunctive with impersonal expressions", "Concedes at least one point before countering"],
      },
    ],
    culturalNotes: [
      {
        title: "Debate Culture in Spain",
        content: "In Spain, lively debate (even among friends) is a normal part of social life. Raised voices and passionate disagreement don't mean anger -- they signal engagement. It's common to interrupt each other, and nobody takes it personally. The key phrase 'hombre, pero...' (come on, but...) is a classic way to push back warmly.",
        region: "Spain",
      },
    ],
  },
];

// ============================================
// Module 3: Workplace & Career
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "es-int-l7",
    slug: "formal-register",
    title: "Formal Register & Usted",
    content: `# Formal Register & Usted

Navigate professional settings with the appropriate level of formality.

## Formal vs. Informal

| Informal (tú) | Formal (usted) |
|---|---|
| ¿Cómo estás? | ¿Cómo está usted? |
| ¿Puedes ayudarme? | ¿Podría ayudarme? |
| Siéntate | Siéntese, por favor |
| Dime | Dígame |

## Formal Email Phrases

- **Estimado/a Sr./Sra....** - Dear Mr./Mrs....
- **Le escribo para...** - I am writing to you to...
- **Le agradecería que...** - I would be grateful if you... (+ subjunctive)
- **Atentamente** - Sincerely
- **Quedo a su disposición** - I remain at your disposal

## At the Office

- **¿Podría usted...?** - Could you...?
- **Con su permiso** - With your permission
- **Le presento a...** - Allow me to introduce you to...
- **Encantado/a de conocerle** - Pleased to meet you (formal)`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m3",
    moduleTitle: "Workplace & Career",
    order: 7,
    topicId: "es-intermediate-formal-register",
    vocabulary: [
      { word: "estimado/a", translation: "dear (formal)", pronunciation: "ehs-tee-MAH-doh/dah", exampleSentence: "Estimada Sra. López, le escribo para...", exampleTranslation: "Dear Mrs. López, I am writing to you to...", partOfSpeech: "adjective" },
      { word: "atentamente", translation: "sincerely", pronunciation: "ah-tehn-tah-MEHN-teh", exampleSentence: "Atentamente, Juan Martínez.", exampleTranslation: "Sincerely, Juan Martínez.", partOfSpeech: "adverb" },
      { word: "disponibilidad", translation: "availability", pronunciation: "dees-poh-nee-bee-lee-DAHD", exampleSentence: "¿Cuál es su disponibilidad esta semana?", exampleTranslation: "What is your availability this week?", partOfSpeech: "noun" },
      { word: "agradecer", translation: "to be grateful / to thank", pronunciation: "ah-grah-deh-SEHR", exampleSentence: "Le agradezco su tiempo.", exampleTranslation: "I appreciate your time.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Usted Conjugation",
        explanation: "Usted uses third-person singular conjugation (same as él/ella). Ustedes uses third-person plural. Object pronouns change too: te → le/lo/la, tu → su. In formal writing, Usted is often abbreviated Ud. or Vd.",
        examples: [
          { correct: "¿Podría usted enviarme el informe?", translation: "Could you send me the report?" },
          { correct: "Le informo de que su solicitud ha sido recibida.", translation: "I inform you that your application has been received." },
        ],
        commonMistakes: [
          { incorrect: "Usted puedes...", correction: "Usted puede...", explanation: "Usted takes third-person verb forms, not second-person." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "job-meeting",
        title: "Meeting a New Boss",
        situation: "It's your first day at a new job and you're meeting your manager",
        agentRole: "You are Directora García, the department head. Welcome the new employee formally, ask about their background, and explain office procedures.",
        userGoal: "Introduce yourself formally, ask polite questions about your new role, and respond to instructions",
        targetPhrases: ["Encantado/a de conocerle", "¿Podría usted...?", "Le agradezco...", "Con su permiso"],
        successCriteria: ["Maintains formal register throughout", "Uses usted consistently", "Asks polite questions"],
      },
    ],
  },
  {
    id: "es-int-l8",
    slug: "conditional-polite",
    title: "The Conditional for Polite Requests",
    content: `# The Conditional for Polite Requests

The conditional tense softens requests and makes them more professional.

## Formation

Infinitive + **-ía, -ías, -ía, -íamos, -íais, -ían**

## Polite Request Patterns

- **¿Podría (usted)...?** - Could you...?
- **¿Sería posible...?** - Would it be possible to...?
- **Me gustaría...** - I would like to...
- **¿Le importaría...?** - Would you mind...?
- **Querría saber si...** - I'd like to know if...

## Workplace Examples

- **¿Podría enviarme los datos?** - Could you send me the data?
- **Me gustaría programar una reunión.** - I'd like to schedule a meeting.
- **¿Sería posible cambiar la fecha?** - Would it be possible to change the date?
- **Necesitaría más tiempo para terminarlo.** - I would need more time to finish it.

## Irregular Stems

- poder → podr-ía | saber → sabr-ía | tener → tendr-ía
- querer → querr-ía | haber → habr-ía | hacer → har-ía
- venir → vendr-ía | salir → saldr-ía | decir → dir-ía`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m3",
    moduleTitle: "Workplace & Career",
    order: 8,
    topicId: "es-intermediate-conditional-polite",
    vocabulary: [
      { word: "reunión", translation: "meeting", pronunciation: "reh-oo-NYOHN", exampleSentence: "¿Podríamos programar una reunión para el martes?", exampleTranslation: "Could we schedule a meeting for Tuesday?", partOfSpeech: "noun" },
      { word: "plazo", translation: "deadline", pronunciation: "PLAH-soh", exampleSentence: "¿Sería posible extender el plazo?", exampleTranslation: "Would it be possible to extend the deadline?", partOfSpeech: "noun" },
      { word: "solicitud", translation: "application / request", pronunciation: "soh-lee-see-TOOD", exampleSentence: "Me gustaría presentar mi solicitud.", exampleTranslation: "I would like to submit my application.", partOfSpeech: "noun" },
      { word: "propuesta", translation: "proposal", pronunciation: "proh-PWEHS-tah", exampleSentence: "Querría presentar una propuesta nueva.", exampleTranslation: "I'd like to present a new proposal.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Conditional Formation and Irregular Stems",
        explanation: "The conditional uses the full infinitive as the stem (not the root) plus imperfect -er/-ir endings: -ía, -ías, -ía, -íamos, -íais, -ían. The 12 irregular stems are the same as the future tense irregulars. The conditional is never used with 'si' in the same clause -- it goes in the result clause.",
        examples: [
          { correct: "¿Podría repetir eso, por favor?", translation: "Could you repeat that, please?" },
          { correct: "Me gustaría trabajar en ese proyecto.", translation: "I would like to work on that project." },
          { correct: "¿Le importaría cerrar la puerta?", translation: "Would you mind closing the door?" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "office-requests",
        title: "Making Workplace Requests",
        situation: "You need to ask your colleagues for various things during a busy workday",
        agentRole: "You are Carmen, a colleague. Respond to the student's requests, sometimes saying yes and sometimes suggesting alternatives. Keep a professional tone.",
        userGoal: "Make at least three polite workplace requests using the conditional",
        targetPhrases: ["¿Podría...?", "Me gustaría...", "¿Sería posible...?", "Necesitaría..."],
        successCriteria: ["Uses conditional for politeness", "Varies request structures", "Responds professionally to both acceptances and alternatives"],
      },
    ],
  },
  {
    id: "es-int-l9",
    slug: "job-vocabulary",
    title: "Job & Career Vocabulary",
    content: `# Job & Career Vocabulary

Talk about your profession, career goals, and workplace.

## Job Titles

- **abogado/a** - lawyer
- **ingeniero/a** - engineer
- **contador/a** - accountant
- **diseñador/a** - designer
- **gerente** - manager
- **empresario/a** - entrepreneur

## Career Concepts

- **currículum (vitae)** - CV / resume
- **entrevista de trabajo** - job interview
- **sueldo / salario** - salary
- **jornada completa / parcial** - full-time / part-time
- **experiencia laboral** - work experience
- **puesto de trabajo** - job position

## Talking About Your Career

- **Trabajo como...** - I work as...
- **Me dedico a...** - I work in / I'm in the field of...
- **Llevo... años trabajando en...** - I've been working in... for... years
- **Mi objetivo profesional es...** - My professional goal is...`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m3",
    moduleTitle: "Workplace & Career",
    order: 9,
    topicId: "es-intermediate-job-vocabulary",
    vocabulary: [
      { word: "entrevista de trabajo", translation: "job interview", pronunciation: "ehn-treh-VEES-tah deh trah-BAH-hoh", exampleSentence: "Tengo una entrevista de trabajo mañana.", exampleTranslation: "I have a job interview tomorrow.", partOfSpeech: "noun" },
      { word: "sueldo", translation: "salary", pronunciation: "SWEHL-doh", exampleSentence: "¿Cuál es el sueldo para este puesto?", exampleTranslation: "What is the salary for this position?", partOfSpeech: "noun" },
      { word: "experiencia laboral", translation: "work experience", pronunciation: "ehks-peh-RYEHN-syah lah-boh-RAHL", exampleSentence: "Tengo cinco años de experiencia laboral.", exampleTranslation: "I have five years of work experience.", partOfSpeech: "noun" },
      { word: "dedicarse a", translation: "to work in / to be in the field of", pronunciation: "deh-dee-KAHR-seh ah", exampleSentence: "Me dedico al marketing digital.", exampleTranslation: "I work in digital marketing.", partOfSpeech: "verb" },
      { word: "ascenso", translation: "promotion", pronunciation: "ahs-SEHN-soh", exampleSentence: "Espero conseguir un ascenso este año.", exampleTranslation: "I hope to get a promotion this year.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "'Llevar' + Time + Gerund",
        explanation: "To express duration ('I've been doing X for Y time'), Spanish uses 'llevar' + time period + gerund. This replaces the English present perfect continuous.",
        examples: [
          { correct: "Llevo tres años trabajando aquí.", translation: "I've been working here for three years." },
          { correct: "¿Cuánto tiempo llevas estudiando español?", translation: "How long have you been studying Spanish?" },
          { correct: "Lleva seis meses buscando empleo.", translation: "He/She has been looking for a job for six months." },
        ],
        commonMistakes: [
          { incorrect: "He estado trabajando aquí por tres años.", correction: "Llevo tres años trabajando aquí.", explanation: "While understood, 'llevar + gerund' is much more natural in Spanish for ongoing duration." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "job-interview",
        title: "A Job Interview",
        situation: "You're being interviewed for a position at a Spanish company",
        agentRole: "You are Sr. Navarro, the hiring manager at a tech company in Barcelona. Conduct a professional interview: ask about experience, skills, and career goals.",
        userGoal: "Present your work experience and career goals professionally, answer interview questions",
        targetPhrases: ["Me dedico a...", "Llevo... años...", "Mi objetivo es...", "Me gustaría..."],
        successCriteria: ["Describes work experience using 'llevar' construction", "States career goals", "Maintains formal register", "Asks at least one question about the role"],
      },
    ],
    culturalNotes: [
      {
        title: "Work Culture in Spain vs. Latin America",
        content: "Spain's work culture values long lunches (2+ hours historically, though this is changing) and late work hours (ending at 7-8 PM). In Latin America, 'la palanca' (connections) and personal relationships often matter as much as qualifications. In both regions, building rapport before getting down to business is considered essential.",
      },
    ],
  },
];

// ============================================
// Module 4: Technology & Modern Life
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "es-int-l10",
    slug: "tech-vocabulary",
    title: "Technology Vocabulary",
    content: `# Technology Vocabulary

Navigate the digital world in Spanish.

## Devices & Hardware

- **el ordenador / la computadora** - computer (Spain / LatAm)
- **el portátil** - laptop
- **el móvil / el celular** - mobile phone (Spain / LatAm)
- **la pantalla** - screen
- **el teclado** - keyboard
- **el ratón** - mouse

## Internet & Software

- **la red** - the network / the web
- **el navegador** - browser
- **la contraseña** - password
- **descargar** - to download
- **subir / cargar** - to upload
- **la aplicación (la app)** - application / app
- **el enlace** - link
- **las redes sociales** - social media

## Common Tech Actions

- **Hacer clic en...** - To click on...
- **Iniciar sesión** - To log in
- **Cerrar sesión** - To log out
- **Actualizar** - To update
- **Compartir** - To share`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m4",
    moduleTitle: "Technology & Modern Life",
    order: 10,
    topicId: "es-intermediate-tech-vocabulary",
    vocabulary: [
      { word: "contraseña", translation: "password", pronunciation: "kohn-trah-SEH-nyah", exampleSentence: "He olvidado mi contraseña.", exampleTranslation: "I've forgotten my password.", partOfSpeech: "noun" },
      { word: "descargar", translation: "to download", pronunciation: "dehs-kahr-GAHR", exampleSentence: "¿Puedes descargar esta aplicación?", exampleTranslation: "Can you download this app?", partOfSpeech: "verb" },
      { word: "redes sociales", translation: "social media", pronunciation: "RREH-dehs soh-SYAH-lehs", exampleSentence: "Paso demasiado tiempo en las redes sociales.", exampleTranslation: "I spend too much time on social media.", partOfSpeech: "noun" },
      { word: "actualizar", translation: "to update", pronunciation: "ahk-twah-lee-SAHR", exampleSentence: "Necesitas actualizar el sistema operativo.", exampleTranslation: "You need to update the operating system.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Regional Tech Vocabulary",
        explanation: "Technology terms vary significantly between Spain and Latin America. Spain often adapts English words differently from Latin America. Both are correct -- knowing the differences helps you communicate across regions.",
        examples: [
          { correct: "el ordenador (Spain) / la computadora (LatAm)", translation: "computer", note: "Both are widely understood" },
          { correct: "el móvil (Spain) / el celular (LatAm)", translation: "mobile phone" },
          { correct: "hacer clic (universal) / cliquear (informal LatAm)", translation: "to click" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "tech-support",
        title: "Calling Tech Support",
        situation: "Your internet is down and you're calling your provider's support line",
        agentRole: "You are a tech support agent for an internet provider. Ask the customer to describe the problem and walk them through basic troubleshooting steps.",
        userGoal: "Describe a technical problem and follow troubleshooting instructions",
        targetPhrases: ["No funciona...", "He intentado...", "La pantalla muestra...", "¿Podría...?"],
        successCriteria: ["Describes the problem clearly", "Follows instructions", "Uses tech vocabulary accurately"],
      },
    ],
  },
  {
    id: "es-int-l11",
    slug: "subjunctive-impersonal",
    title: "Subjunctive with Impersonal Expressions",
    content: `# Subjunctive with Impersonal Expressions

Use the subjunctive to talk about what's needed, possible, or surprising in the modern world.

## Impersonal Expressions + Subjunctive

These trigger the subjunctive because they express judgment, not fact:
- **Es posible que...** - It's possible that...
- **Es probable que...** - It's probable that...
- **Es increíble que...** - It's incredible that...
- **Es una lástima que...** - It's a shame that...
- **Es normal que...** - It's normal that...
- **Es raro que...** - It's strange that...
- **Hace falta que...** - It's necessary that...

## Talking About Technology

- **Es increíble que la tecnología avance tan rápido.** - It's incredible that technology advances so fast.
- **Es posible que la inteligencia artificial cambie nuestras vidas.** - It's possible that AI changes our lives.
- **Es una lástima que muchas personas no tengan acceso a internet.** - It's a shame that many people don't have internet access.

## Certainty = Indicative

- **Es verdad que la tecnología mejora nuestras vidas.** - It's true that technology improves our lives. (indicative)
- **Es obvio que necesitamos reglas.** - It's obvious that we need rules. (indicative)`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m4",
    moduleTitle: "Technology & Modern Life",
    order: 11,
    topicId: "es-intermediate-subjunctive-impersonal",
    vocabulary: [
      { word: "inteligencia artificial", translation: "artificial intelligence", pronunciation: "een-teh-lee-HEHN-syah ahr-tee-fee-SYAHL", exampleSentence: "Es posible que la inteligencia artificial transforme la educación.", exampleTranslation: "It's possible that AI transforms education.", partOfSpeech: "noun" },
      { word: "privacidad", translation: "privacy", pronunciation: "pree-vah-see-DAHD", exampleSentence: "Es importante que protejamos nuestra privacidad.", exampleTranslation: "It's important that we protect our privacy.", partOfSpeech: "noun" },
      { word: "avanzar", translation: "to advance / to progress", pronunciation: "ah-vahn-SAHR", exampleSentence: "Es increíble que la ciencia avance tan rápido.", exampleTranslation: "It's incredible that science advances so quickly.", partOfSpeech: "verb" },
      { word: "una lástima", translation: "a shame / a pity", pronunciation: "OO-nah LAHS-tee-mah", exampleSentence: "Es una lástima que no vengas a la reunión.", exampleTranslation: "It's a shame you're not coming to the meeting.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Impersonal Expression Categories",
        explanation: "Group impersonal expressions by what they convey: **Possibility/Probability** (es posible que, es probable que) -- subjunctive. **Judgment/Emotion** (es increíble que, es una lástima que, es raro que) -- subjunctive. **Necessity** (es necesario que, hace falta que) -- subjunctive. **Certainty** (es verdad que, es cierto que, es obvio que) -- indicative. Negate a certainty expression and it flips to subjunctive: no es verdad que + subjunctive.",
        examples: [
          { correct: "Es probable que llueva mañana.", translation: "It's likely that it will rain tomorrow. (subjunctive)" },
          { correct: "Es verdad que hace calor.", translation: "It's true that it's hot. (indicative)" },
          { correct: "No es verdad que haga tanto calor.", translation: "It's not true that it's so hot. (subjunctive)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "tech-debate",
        title: "Social Media: Good or Bad?",
        situation: "You're discussing the impact of social media on society",
        agentRole: "You are Elena, a journalist writing about technology's impact. Interview the student about their views on social media, asking them to elaborate with examples.",
        userGoal: "Express opinions about social media using impersonal expressions with the subjunctive",
        targetPhrases: ["Es posible que...", "Es increíble que...", "Es una lástima que...", "Es importante que..."],
        successCriteria: ["Uses at least 3 impersonal expressions correctly", "Triggers subjunctive after each expression", "Provides reasoning for opinions"],
      },
    ],
  },
  {
    id: "es-int-l12",
    slug: "modern-life-challenges",
    title: "Modern Life Challenges",
    content: `# Modern Life Challenges

Discuss the challenges and conveniences of contemporary life.

## Work-Life Balance

- **el estrés** - stress
- **el agotamiento** - burnout
- **el equilibrio** - balance
- **la jornada laboral** - workday
- **el teletrabajo** - remote work / teleworking
- **desconectar** - to disconnect / to switch off

## Digital Life

- **la adicción al móvil** - phone addiction
- **la brecha digital** - digital divide
- **las noticias falsas** - fake news
- **la desinformación** - misinformation

## Expressing Concern

- **Me preocupa que...** - It worries me that... (+ subjunctive)
- **Me molesta que...** - It bothers me that... (+ subjunctive)
- **Me sorprende que...** - It surprises me that... (+ subjunctive)
- **Me alegra que...** - I'm glad that... (+ subjunctive)`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m4",
    moduleTitle: "Technology & Modern Life",
    order: 12,
    topicId: "es-intermediate-modern-life-challenges",
    vocabulary: [
      { word: "estrés", translation: "stress", pronunciation: "ehs-TREHS", exampleSentence: "El estrés laboral afecta a millones de personas.", exampleTranslation: "Work stress affects millions of people.", partOfSpeech: "noun" },
      { word: "equilibrio", translation: "balance", pronunciation: "eh-kee-LEE-bryoh", exampleSentence: "Es difícil encontrar el equilibrio entre trabajo y vida personal.", exampleTranslation: "It's hard to find work-life balance.", partOfSpeech: "noun" },
      { word: "desconectar", translation: "to disconnect", pronunciation: "dehs-koh-nehk-TAHR", exampleSentence: "Es necesario que desconectemos del trabajo los fines de semana.", exampleTranslation: "It's necessary that we disconnect from work on weekends.", partOfSpeech: "verb" },
      { word: "desinformación", translation: "misinformation", pronunciation: "dehs-een-fohr-mah-SYOHN", exampleSentence: "Me preocupa que haya tanta desinformación en internet.", exampleTranslation: "It worries me that there's so much misinformation online.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Emotion Verbs + Subjunctive",
        explanation: "Verbs expressing emotional reactions (me preocupa, me molesta, me sorprende, me alegra, me encanta, me da miedo) trigger the subjunctive in the subordinate clause when there are two different subjects. Structure: Me + emotion verb + que + subjunctive.",
        examples: [
          { correct: "Me preocupa que trabajes tanto.", translation: "It worries me that you work so much." },
          { correct: "Me alegra que hayas encontrado trabajo.", translation: "I'm glad you've found a job." },
          { correct: "Me molesta que la gente no respete la privacidad.", translation: "It bothers me that people don't respect privacy." },
        ],
        commonMistakes: [
          { incorrect: "Me preocupa que trabajas tanto.", correction: "Me preocupa que trabajes tanto.", explanation: "Emotion verbs require the subjunctive in the que-clause." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "modern-challenges",
        title: "Discussing Modern Challenges",
        situation: "You're having coffee with a friend and talking about the pressures of modern life",
        agentRole: "You are Diego, complaining about work stress and phone addiction. Ask the student if they face similar challenges and what they do to cope.",
        userGoal: "Discuss modern life challenges using emotion verbs with the subjunctive",
        targetPhrases: ["Me preocupa que...", "Me molesta que...", "Es necesario que...", "Es importante que..."],
        successCriteria: ["Identifies specific modern challenges", "Uses emotion verbs + subjunctive", "Suggests solutions or coping strategies"],
      },
    ],
  },
];

// ============================================
// Module 5: Environment & Nature
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "es-int-l13",
    slug: "subjunctive-doubt-denial",
    title: "Subjunctive with Doubt & Denial",
    content: `# Subjunctive with Doubt & Denial

Express uncertainty, denial, and skepticism.

## Doubt Triggers

- **Dudo que...** - I doubt that... (+ subjunctive)
- **No creo que...** - I don't think that... (+ subjunctive)
- **No es seguro que...** - It's not certain that... (+ subjunctive)
- **Es dudoso que...** - It's doubtful that... (+ subjunctive)

## Denial Triggers

- **Niego que...** - I deny that... (+ subjunctive)
- **No es verdad que...** - It's not true that... (+ subjunctive)
- **No es cierto que...** - It's not certain that... (+ subjunctive)

## Certainty = Indicative (Contrast)

- **Creo que...** - I think that... (+ indicative)
- **Estoy seguro/a de que...** - I'm sure that... (+ indicative)
- **Es evidente que...** - It's evident that... (+ indicative)

## Environmental Context

- **Dudo que el gobierno haga lo suficiente.** - I doubt the government does enough.
- **No creo que la situación mejore pronto.** - I don't think the situation will improve soon.
- **Es evidente que el clima está cambiando.** - It's evident that the climate is changing.`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m5",
    moduleTitle: "Environment & Nature",
    order: 13,
    topicId: "es-intermediate-subjunctive-doubt-denial",
    vocabulary: [
      { word: "dudar", translation: "to doubt", pronunciation: "doo-DAHR", exampleSentence: "Dudo que encontremos una solución fácil.", exampleTranslation: "I doubt we'll find an easy solution.", partOfSpeech: "verb" },
      { word: "negar", translation: "to deny", pronunciation: "neh-GAHR", exampleSentence: "Algunos niegan que exista el problema.", exampleTranslation: "Some deny that the problem exists.", partOfSpeech: "verb" },
      { word: "medio ambiente", translation: "environment", pronunciation: "MEH-dyoh ahm-BYEHN-teh", exampleSentence: "Es urgente que protejamos el medio ambiente.", exampleTranslation: "It's urgent that we protect the environment.", partOfSpeech: "noun" },
      { word: "cambio climático", translation: "climate change", pronunciation: "KAHM-byoh klee-MAH-tee-koh", exampleSentence: "No creo que el cambio climático sea reversible fácilmente.", exampleTranslation: "I don't think climate change is easily reversible.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "The Doubt/Certainty Toggle",
        explanation: "Think of it as a switch: certainty (creo, estoy seguro, es verdad) = indicative. Doubt or negation of certainty (dudo, no creo, no es verdad) = subjunctive. Negating a doubt verb flips back: 'No dudo que es verdad' (indicative, because you're affirming certainty).",
        examples: [
          { correct: "Creo que tienen razón.", translation: "I think they're right. (indicative)" },
          { correct: "Dudo que tengan razón.", translation: "I doubt they're right. (subjunctive)" },
          { correct: "No dudo que tienen razón.", translation: "I don't doubt they're right. (indicative -- double negative = certainty)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "environment-discussion",
        title: "Discussing Environmental Issues",
        situation: "You're at a community meeting discussing local environmental problems",
        agentRole: "You are Rosa, an environmental activist. Present facts about local pollution and ask the student what they think. Challenge overly optimistic claims.",
        userGoal: "Express doubt and certainty about environmental issues using the correct mood",
        targetPhrases: ["Dudo que...", "No creo que...", "Es evidente que...", "Estoy seguro/a de que..."],
        successCriteria: ["Uses subjunctive after doubt expressions", "Uses indicative after certainty expressions", "Distinguishes between the two correctly"],
      },
    ],
  },
  {
    id: "es-int-l14",
    slug: "passive-voice",
    title: "Passive Voice & Impersonal 'Se'",
    content: `# Passive Voice & Impersonal 'Se'

Talk about actions without specifying who does them -- essential for discussing processes and policies.

## Passive with 'Ser'

**ser + past participle** (formal, written style):
- **El bosque fue destruido por el incendio.** - The forest was destroyed by the fire.
- **La ley fue aprobada el año pasado.** - The law was passed last year.

## Passive 'Se' (Much More Common)

**se + 3rd person verb** (everyday usage):
- **Se reciclan millones de botellas cada año.** - Millions of bottles are recycled every year.
- **Se necesitan voluntarios.** - Volunteers are needed.
- **Se prohíbe fumar.** - Smoking is prohibited.

## Impersonal 'Se'

**se + 3rd person singular** (generic "one/people/they"):
- **Se dice que...** - They say / It is said that...
- **Se puede reciclar el vidrio.** - Glass can be recycled.
- **¿Cómo se dice...?** - How do you say...?

## Environment Context

- **Se talan miles de árboles cada día.** - Thousands of trees are cut down every day.
- **Se debería invertir más en energías renovables.** - More should be invested in renewable energy.`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m5",
    moduleTitle: "Environment & Nature",
    order: 14,
    topicId: "es-intermediate-passive-voice",
    vocabulary: [
      { word: "reciclar", translation: "to recycle", pronunciation: "reh-see-KLAHR", exampleSentence: "Se pueden reciclar la mayoría de los plásticos.", exampleTranslation: "Most plastics can be recycled.", partOfSpeech: "verb" },
      { word: "renovable", translation: "renewable", pronunciation: "reh-noh-VAH-bleh", exampleSentence: "Se necesitan más fuentes de energía renovable.", exampleTranslation: "More renewable energy sources are needed.", partOfSpeech: "adjective" },
      { word: "contaminar", translation: "to pollute / to contaminate", pronunciation: "kohn-tah-mee-NAHR", exampleSentence: "Se contamina el aire con las emisiones de los coches.", exampleTranslation: "The air is polluted by car emissions.", partOfSpeech: "verb" },
      { word: "sostenible", translation: "sustainable", pronunciation: "sohs-teh-NEE-bleh", exampleSentence: "Se buscan soluciones más sostenibles.", exampleTranslation: "More sustainable solutions are being sought.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Passive 'Se' vs. Impersonal 'Se'",
        explanation: "**Passive se**: the verb agrees with the subject (se reciclan botellas = bottles are recycled). **Impersonal se**: always 3rd person singular, no identifiable subject (se vive bien aquí = one lives well here). Test: if you can identify a grammatical subject the verb agrees with, it's passive se. If not, it's impersonal se.",
        examples: [
          { correct: "Se venden pisos.", translation: "Apartments are sold. (passive: pisos is the subject, verb is plural)", note: "Passive se" },
          { correct: "Se vive bien en España.", translation: "One lives well in Spain. (no subject, always singular)", note: "Impersonal se" },
          { correct: "Se necesita experiencia.", translation: "Experience is needed. (passive: experiencia is the subject)" },
        ],
        commonMistakes: [
          { incorrect: "Se vende pisos.", correction: "Se venden pisos.", explanation: "With passive se, the verb must agree with the subject (pisos = plural)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "sustainability-plan",
        title: "Proposing Sustainability Measures",
        situation: "You're at a neighborhood meeting proposing eco-friendly changes",
        agentRole: "You are the neighborhood president. Listen to proposals about making the area more sustainable and ask clarifying questions.",
        userGoal: "Propose at least three sustainability measures using passive and impersonal 'se' constructions",
        targetPhrases: ["Se debería...", "Se puede...", "Se necesitan...", "Se reciclan..."],
        successCriteria: ["Uses passive se with correct agreement", "Uses impersonal se appropriately", "Proposes concrete measures"],
      },
    ],
  },
  {
    id: "es-int-l15",
    slug: "sustainability-vocabulary",
    title: "Sustainability & Nature",
    content: `# Sustainability & Nature

Discuss environmental issues and solutions.

## Nature Vocabulary

- **el bosque** - forest
- **el río** - river
- **la montaña** - mountain
- **la selva** - jungle / rainforest
- **la costa** - coast
- **la especie** - species

## Environmental Issues

- **la contaminación** - pollution
- **la deforestación** - deforestation
- **el calentamiento global** - global warming
- **las emisiones de carbono** - carbon emissions
- **la sequía** - drought
- **la inundación** - flood

## Solutions & Actions

- **la energía solar / eólica** - solar / wind energy
- **reducir, reutilizar, reciclar** - reduce, reuse, recycle
- **el transporte público** - public transport
- **la huella de carbono** - carbon footprint
- **proteger** - to protect
- **conservar** - to conserve`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m5",
    moduleTitle: "Environment & Nature",
    order: 15,
    topicId: "es-intermediate-sustainability-vocabulary",
    vocabulary: [
      { word: "deforestación", translation: "deforestation", pronunciation: "deh-foh-rehs-tah-SYOHN", exampleSentence: "La deforestación del Amazonas es un problema grave.", exampleTranslation: "Amazon deforestation is a serious problem.", partOfSpeech: "noun" },
      { word: "huella de carbono", translation: "carbon footprint", pronunciation: "WEH-yah deh kahr-BOH-noh", exampleSentence: "Debemos reducir nuestra huella de carbono.", exampleTranslation: "We must reduce our carbon footprint.", partOfSpeech: "noun" },
      { word: "proteger", translation: "to protect", pronunciation: "proh-teh-HEHR", exampleSentence: "Es necesario que protejamos las especies en peligro.", exampleTranslation: "It's necessary that we protect endangered species.", partOfSpeech: "verb" },
      { word: "sequía", translation: "drought", pronunciation: "seh-KEE-ah", exampleSentence: "La sequía afecta a muchas regiones del sur.", exampleTranslation: "The drought affects many regions in the south.", partOfSpeech: "noun" },
      { word: "energía eólica", translation: "wind energy", pronunciation: "eh-nehr-HEE-ah eh-OH-lee-kah", exampleSentence: "España invierte mucho en energía eólica.", exampleTranslation: "Spain invests heavily in wind energy.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Expressing Obligation: 'Deber', 'Tener que', 'Hay que'",
        explanation: "Three ways to say 'must/have to': **Deber** (moral obligation, softer): Debemos reciclar. **Tener que** (personal necessity): Tengo que ir al punto limpio. **Hay que** (impersonal, general): Hay que reducir las emisiones. The conditional 'debería' softens to 'should'.",
        examples: [
          { correct: "Debemos proteger los bosques.", translation: "We must protect the forests. (moral duty)" },
          { correct: "Hay que consumir menos plástico.", translation: "One must consume less plastic. (general)" },
          { correct: "Deberíamos usar más transporte público.", translation: "We should use more public transport. (softened suggestion)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "eco-presentation",
        title: "An Environmental Presentation",
        situation: "You're giving a short presentation about an environmental issue and proposing solutions",
        agentRole: "You are Profesora Méndez, listening to student presentations on the environment. Ask follow-up questions and challenge weak arguments.",
        userGoal: "Present one environmental problem, explain its causes, and propose two solutions",
        targetPhrases: ["Es necesario que...", "Se debería...", "Dudo que...", "Hay que..."],
        successCriteria: ["Identifies a clear environmental issue", "Explains causes using appropriate vocabulary", "Proposes solutions using obligation structures"],
      },
    ],
    culturalNotes: [
      {
        title: "Environmental Awareness in the Spanish-Speaking World",
        content: "Spain is a European leader in wind energy (energía eólica). Costa Rica runs almost entirely on renewable energy. Ecuador was the first country to grant constitutional rights to nature (los derechos de la naturaleza). The Amazon, shared by several Latin American countries, is a central topic in regional environmental discussions.",
      },
    ],
  },
];

// ============================================
// Module 6: Culture & Entertainment
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "es-int-l16",
    slug: "subjunctive-time-clauses",
    title: "Subjunctive in Time Clauses",
    content: `# Subjunctive in Time Clauses

When referring to future events after time conjunctions, Spanish uses the subjunctive.

## Time Conjunctions + Subjunctive (Future Reference)

- **cuando** - when
- **en cuanto / tan pronto como** - as soon as
- **hasta que** - until
- **antes de que** - before (always subjunctive!)
- **después de que** - after

## The Rule

If the action **hasn't happened yet** (future), use subjunctive. If it's **habitual or past**, use indicative.

## Examples

- **Cuando llegue a casa, te llamaré.** - When I get home, I'll call you. (future → subjunctive)
- **Cuando llego a casa, siempre como.** - When I get home, I always eat. (habitual → indicative)
- **Te avisaré en cuanto sepa algo.** - I'll let you know as soon as I find out. (future)
- **Antes de que empiece la película...** - Before the movie starts... (always subjunctive)
- **Esperaré hasta que termine el concierto.** - I'll wait until the concert ends. (future)`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m6",
    moduleTitle: "Culture & Entertainment",
    order: 16,
    topicId: "es-intermediate-subjunctive-time-clauses",
    vocabulary: [
      { word: "en cuanto", translation: "as soon as", pronunciation: "ehn KWAHN-toh", exampleSentence: "En cuanto termine el trabajo, iré al cine.", exampleTranslation: "As soon as I finish work, I'll go to the cinema.", partOfSpeech: "conjunction" },
      { word: "hasta que", translation: "until", pronunciation: "AHS-tah keh", exampleSentence: "No me iré hasta que acabe la obra.", exampleTranslation: "I won't leave until the play is over.", partOfSpeech: "conjunction" },
      { word: "estreno", translation: "premiere / new release", pronunciation: "ehs-TREH-noh", exampleSentence: "Cuando se estrene la película, iremos a verla.", exampleTranslation: "When the movie premieres, we'll go see it.", partOfSpeech: "noun" },
      { word: "espectáculo", translation: "show / performance", pronunciation: "ehs-pehk-TAH-koo-loh", exampleSentence: "Antes de que empiece el espectáculo, vamos a cenar.", exampleTranslation: "Before the show starts, let's have dinner.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Future vs. Habitual in Time Clauses",
        explanation: "The key test: **Is this a one-time future event or a general habit?** Future one-time = subjunctive after cuando/en cuanto/hasta que. Habitual/past = indicative. Exception: 'antes de que' ALWAYS takes subjunctive regardless of time reference.",
        examples: [
          { correct: "Cuando venga Juan, empezaremos.", translation: "When Juan comes (future), we'll start. (subjunctive)" },
          { correct: "Cuando viene Juan, siempre trae comida.", translation: "When Juan comes (habitual), he always brings food. (indicative)" },
          { correct: "Antes de que llegara, preparé todo.", translation: "Before he arrived, I prepared everything. (always subjunctive)" },
        ],
        commonMistakes: [
          { incorrect: "Cuando llegaré a casa, te llamaré.", correction: "Cuando llegue a casa, te llamaré.", explanation: "Never use future tense after 'cuando' -- use subjunctive for future reference." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "planning-night-out",
        title: "Planning a Night Out",
        situation: "You're coordinating an evening of cultural activities with a friend",
        agentRole: "You are Lucía, planning a night out with the student. Discuss going to a concert, a gallery, or a movie. Negotiate timing and plans.",
        userGoal: "Make plans using time clauses with the subjunctive to discuss future events",
        targetPhrases: ["Cuando termine...", "En cuanto lleguemos...", "Antes de que empiece...", "Hasta que..."],
        successCriteria: ["Uses at least 3 time conjunctions with subjunctive", "Correctly distinguishes future from habitual", "Coordinates plans naturally"],
      },
    ],
  },
  {
    id: "es-int-l17",
    slug: "reviews-recommendations",
    title: "Writing Reviews & Recommendations",
    content: `# Writing Reviews & Recommendations

Share your opinions on movies, books, music, and restaurants.

## Rating Expressions

- **Es una obra maestra.** - It's a masterpiece.
- **Me encantó / Me decepcionó.** - I loved it / It disappointed me.
- **Vale la pena verla.** - It's worth seeing.
- **No vale la pena.** - It's not worth it.
- **Le doy un 8 de 10.** - I give it an 8 out of 10.

## Recommending

- **Te recomiendo que veas...** - I recommend you watch... (+ subjunctive)
- **Te sugiero que leas...** - I suggest you read... (+ subjunctive)
- **Merece la pena que vayas.** - It's worth you going.
- **Si te gusta..., te encantará...** - If you like..., you'll love...

## Describing Entertainment

- **la trama / el argumento** - the plot
- **el personaje** - the character
- **la actuación** - the performance/acting
- **la banda sonora** - the soundtrack
- **el desenlace** - the ending/conclusion`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m6",
    moduleTitle: "Culture & Entertainment",
    order: 17,
    topicId: "es-intermediate-reviews-recommendations",
    vocabulary: [
      { word: "obra maestra", translation: "masterpiece", pronunciation: "OH-brah mah-EHS-trah", exampleSentence: "Esta novela es una verdadera obra maestra.", exampleTranslation: "This novel is a true masterpiece.", partOfSpeech: "noun" },
      { word: "trama", translation: "plot", pronunciation: "TRAH-mah", exampleSentence: "La trama es muy interesante pero algo predecible.", exampleTranslation: "The plot is very interesting but somewhat predictable.", partOfSpeech: "noun" },
      { word: "decepcionar", translation: "to disappoint", pronunciation: "deh-sehp-syoh-NAHR", exampleSentence: "La película me decepcionó bastante.", exampleTranslation: "The movie disappointed me quite a bit.", partOfSpeech: "verb" },
      { word: "valer la pena", translation: "to be worth it", pronunciation: "vah-LEHR lah PEH-nah", exampleSentence: "Vale la pena leer este libro.", exampleTranslation: "It's worth reading this book.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Recommendation Verbs + Subjunctive",
        explanation: "Verbs of recommendation (recomendar, sugerir, aconsejar, proponer) trigger the subjunctive in the que-clause because you're influencing someone else's actions. Without 'que', use the infinitive: 'Te recomiendo ver esa película' (same subject implied).",
        examples: [
          { correct: "Te recomiendo que veas esa película.", translation: "I recommend you see that movie." },
          { correct: "Te sugiero que leas el libro primero.", translation: "I suggest you read the book first." },
          { correct: "Te recomiendo leer el libro.", translation: "I recommend reading the book. (infinitive, no 'que')" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "movie-review",
        title: "Recommending a Movie",
        situation: "A friend asks you what to watch this weekend",
        agentRole: "You are Marcos, looking for something to watch. Ask the student for recommendations and ask detailed questions about plot, acting, and whether it's really worth watching.",
        userGoal: "Recommend a movie or show, describing its qualities and using recommendation structures",
        targetPhrases: ["Te recomiendo que...", "La trama...", "Vale la pena...", "Me encantó porque..."],
        successCriteria: ["Uses recommendation verbs with subjunctive", "Describes plot and characters", "Gives a clear rating or opinion"],
      },
    ],
  },
  {
    id: "es-int-l18",
    slug: "arts-culture-vocabulary",
    title: "Arts & Culture Vocabulary",
    content: `# Arts & Culture Vocabulary

Engage with the rich cultural world of Spanish-speaking countries.

## Visual Arts

- **el museo** - museum
- **la exposición** - exhibition
- **el cuadro / la pintura** - painting
- **la escultura** - sculpture
- **el/la artista** - artist

## Performing Arts

- **el teatro** - theater
- **la obra de teatro** - play
- **el concierto** - concert
- **el baile / la danza** - dance
- **el/la director/a** - director

## Literature

- **la novela** - novel
- **el cuento** - short story
- **el/la escritor/a** - writer
- **el poema** - poem
- **la poesía** - poetry

## Music

- **la canción** - song
- **el/la cantante** - singer
- **la letra** - lyrics
- **el género** - genre
- **el ritmo** - rhythm`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m6",
    moduleTitle: "Culture & Entertainment",
    order: 18,
    topicId: "es-intermediate-arts-culture-vocabulary",
    vocabulary: [
      { word: "exposición", translation: "exhibition", pronunciation: "ehks-poh-see-SYOHN", exampleSentence: "Hay una exposición de Frida Kahlo en el museo.", exampleTranslation: "There's a Frida Kahlo exhibition at the museum.", partOfSpeech: "noun" },
      { word: "obra de teatro", translation: "play (theater)", pronunciation: "OH-brah deh teh-AH-troh", exampleSentence: "Cuando estrenen la nueva obra de teatro, iremos a verla.", exampleTranslation: "When they premiere the new play, we'll go see it.", partOfSpeech: "noun" },
      { word: "género", translation: "genre", pronunciation: "HEH-neh-roh", exampleSentence: "¿Qué género de música prefieres?", exampleTranslation: "What genre of music do you prefer?", partOfSpeech: "noun" },
      { word: "letra", translation: "lyrics", pronunciation: "LEH-trah", exampleSentence: "La letra de esa canción es muy poética.", exampleTranslation: "The lyrics of that song are very poetic.", partOfSpeech: "noun" },
      { word: "ritmo", translation: "rhythm", pronunciation: "RREET-moh", exampleSentence: "La salsa tiene un ritmo muy alegre.", exampleTranslation: "Salsa has a very cheerful rhythm.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Using 'Gustar'-type Verbs for Preferences",
        explanation: "Beyond 'gustar', use these verbs to express cultural preferences: encantar (to love), fascinar (to fascinate), apasionar (to be passionate about), interesar (to be interested in), aburrir (to bore). All follow the same structure: indirect object pronoun + verb + subject.",
        examples: [
          { correct: "Me fascina el arte moderno.", translation: "Modern art fascinates me." },
          { correct: "Nos apasiona el flamenco.", translation: "Flamenco is our passion." },
          { correct: "¿Te interesan los museos?", translation: "Are you interested in museums?" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "museum-visit",
        title: "At an Art Museum",
        situation: "You're visiting a museum and discussing the art with a companion",
        agentRole: "You are Isabel, a Spanish art student showing a friend around the Prado museum. Describe paintings, ask for reactions, and share opinions.",
        userGoal: "Discuss artworks using cultural vocabulary and express preferences",
        targetPhrases: ["Me fascina...", "Este cuadro...", "El/La artista...", "Me parece que..."],
        successCriteria: ["Uses arts vocabulary accurately", "Expresses preferences using gustar-type verbs", "Gives opinions on specific works"],
      },
    ],
    culturalNotes: [
      {
        title: "Must-Know Cultural References",
        content: "Every Spanish learner should know: Picasso's Guernica (el Guernica), Gabriel García Márquez's 'Cien años de soledad' (One Hundred Years of Solitude), flamenco (from Andalusia), and the films of Pedro Almodóvar. In Latin America, muralism (Rivera, Orozco, Siqueiros), magical realism in literature, and reggaeton/cumbia/salsa in music are cultural touchstones.",
      },
    ],
  },
];

// ============================================
// Module 7: News & Current Events
// ============================================

const module7Lessons: LanguageLesson[] = [
  {
    id: "es-int-l19",
    slug: "reported-speech",
    title: "Reported Speech",
    content: `# Reported Speech (El Estilo Indirecto)

Report what others have said -- essential for discussing news.

## Basic Transformation

Direct: "Estoy cansado." → Reported: Dijo que **estaba** cansado.

## Tense Shifts

| Direct Speech | Reported Speech |
|---|---|
| Present → | Imperfect |
| Preterite → | Pluperfect |
| Future → | Conditional |
| Present subjunctive → | Imperfect subjunctive |

## Reporting Verbs

- **decir que...** - to say that...
- **explicar que...** - to explain that...
- **afirmar que...** - to state/affirm that...
- **asegurar que...** - to assure that...
- **comentar que...** - to comment that...
- **preguntar si/qué/cuándo...** - to ask if/what/when...

## Examples

- **"Voy al cine."** → Dijo que **iba** al cine.
- **"He terminado."** → Dijo que **había terminado**.
- **"Vendré mañana."** → Dijo que **vendría** al día siguiente.
- **"¿Tienes hambre?"** → Me preguntó **si tenía** hambre.`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m7",
    moduleTitle: "News & Current Events",
    order: 19,
    topicId: "es-intermediate-reported-speech",
    vocabulary: [
      { word: "afirmar", translation: "to state / to affirm", pronunciation: "ah-feer-MAHR", exampleSentence: "El presidente afirmó que habría cambios.", exampleTranslation: "The president stated there would be changes.", partOfSpeech: "verb" },
      { word: "según", translation: "according to", pronunciation: "seh-GOON", exampleSentence: "Según el informe, la economía ha mejorado.", exampleTranslation: "According to the report, the economy has improved.", partOfSpeech: "preposition" },
      { word: "fuentes", translation: "sources", pronunciation: "FWEHN-tehs", exampleSentence: "Según fuentes oficiales, el acuerdo se firmará mañana.", exampleTranslation: "According to official sources, the agreement will be signed tomorrow.", partOfSpeech: "noun" },
      { word: "portavoz", translation: "spokesperson", pronunciation: "pohr-tah-VOHS", exampleSentence: "La portavoz explicó que se tomarían medidas.", exampleTranslation: "The spokesperson explained that measures would be taken.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Tense Backshifting in Reported Speech",
        explanation: "When the reporting verb is in the past (dijo, explicó, comentó), tenses shift back: present → imperfect, preterite → pluperfect, future → conditional. Time expressions also change: hoy → ese día, mañana → al día siguiente, ayer → el día anterior, aquí → allí.",
        examples: [
          { correct: "Dijo: 'Estoy ocupado.' → Dijo que estaba ocupado.", translation: "He said he was busy." },
          { correct: "Dijo: 'Lo haré mañana.' → Dijo que lo haría al día siguiente.", translation: "He said he would do it the next day." },
          { correct: "Preguntó: '¿Dónde vives?' → Preguntó dónde vivía.", translation: "She asked where I lived." },
        ],
        commonMistakes: [
          { incorrect: "Dijo que está ocupado.", correction: "Dijo que estaba ocupado.", explanation: "When the reporting verb is past tense, backshift the reported verb too." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "news-report",
        title: "Sharing the News",
        situation: "You're telling a friend about a news story you heard",
        agentRole: "You are Javier, curious about current events. Ask the student to tell you about something they saw in the news. Ask follow-up questions about what specific people said.",
        userGoal: "Report a news story using reported speech, quoting what different people said",
        targetPhrases: ["El presidente dijo que...", "Según...", "Afirmaron que...", "Preguntaron si..."],
        successCriteria: ["Uses reported speech with correct tense backshifting", "Attributes quotes to speakers", "Reports at least one question"],
      },
    ],
  },
  {
    id: "es-int-l20",
    slug: "future-perfect",
    title: "The Future Perfect",
    content: `# The Future Perfect (Futuro Perfecto)

Talk about what will have happened by a certain point, and speculate about the past.

## Formation

**habré / habrás / habrá / habremos / habréis / habrán** + past participle

## Future Completion

- **Para julio, habré terminado el curso.** - By July, I will have finished the course.
- **Cuando llegues, ya habremos cenado.** - When you arrive, we will have already eaten dinner.
- **En diez años, habrán construido la nueva línea de metro.** - In ten years, they will have built the new metro line.

## Speculation About the Past (Very Common!)

The future perfect is often used to guess about what has already happened:
- **¿Habrá llegado ya?** - Will he have arrived already? / I wonder if he's arrived.
- **Se habrán perdido.** - They must have gotten lost.
- **Habrá tenido un problema.** - He must have had a problem.`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m7",
    moduleTitle: "News & Current Events",
    order: 20,
    topicId: "es-intermediate-future-perfect",
    vocabulary: [
      { word: "para entonces", translation: "by then", pronunciation: "PAH-rah ehn-TOHN-sehs", exampleSentence: "Para entonces, ya habrán anunciado los resultados.", exampleTranslation: "By then, they will have already announced the results.", partOfSpeech: "phrase" },
      { word: "suponer", translation: "to suppose / to assume", pronunciation: "soo-poh-NEHR", exampleSentence: "Supongo que ya habrán recibido la noticia.", exampleTranslation: "I suppose they will have already received the news.", partOfSpeech: "verb" },
      { word: "a estas alturas", translation: "at this point / by now", pronunciation: "ah EHS-tahs ahl-TOO-rahs", exampleSentence: "A estas alturas, ya habrán tomado una decisión.", exampleTranslation: "At this point, they will have already made a decision.", partOfSpeech: "phrase" },
      { word: "sin duda", translation: "without a doubt", pronunciation: "seen DOO-dah", exampleSentence: "Sin duda habrá sido una decisión difícil.", exampleTranslation: "It must have been a difficult decision.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Future Perfect: Completion vs. Speculation",
        explanation: "Two uses: (1) **Completion by a deadline**: 'Para las 8, habré terminado' (By 8, I'll have finished). (2) **Speculation about past/present**: 'Habrá tenido problemas' (He must have had problems). Context tells you which. Speculation use is extremely common in spoken Spanish.",
        examples: [
          { correct: "Para el viernes, habré leído el informe.", translation: "By Friday, I will have read the report. (completion)" },
          { correct: "¿Habrán cancelado el vuelo?", translation: "Could they have cancelled the flight? (speculation)" },
          { correct: "Habrá costado una fortuna.", translation: "It must have cost a fortune. (speculation)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "speculation-game",
        title: "Speculating About Events",
        situation: "You and a friend are watching the news and speculating about behind-the-scenes events",
        agentRole: "You are Patricia, watching the news with a friend. Discuss stories and speculate about what must have happened. Encourage the student to make guesses using the future perfect.",
        userGoal: "Speculate about at least three news situations using the future perfect of probability",
        targetPhrases: ["Habrá sido...", "Habrán decidido...", "¿Habrá pasado...?", "Sin duda habrá..."],
        successCriteria: ["Uses future perfect for speculation", "Correctly forms compound tenses", "Engages in speculative discussion naturally"],
      },
    ],
  },
  {
    id: "es-int-l21",
    slug: "media-vocabulary",
    title: "Media & News Vocabulary",
    content: `# Media & News Vocabulary

Understand and discuss the news in Spanish.

## Media Types

- **el periódico / el diario** - newspaper
- **la revista** - magazine
- **las noticias** - news
- **el telediario / el noticiero** - TV news
- **la prensa** - the press
- **el/la periodista** - journalist

## News Sections

- **política** - politics
- **economía** - economy
- **sociedad** - society
- **internacional** - international
- **deportes** - sports
- **cultura** - culture

## Discussing News

- **¿Has visto/leído que...?** - Have you seen/read that...?
- **Según las últimas noticias...** - According to the latest news...
- **Al parecer...** - Apparently...
- **Se rumorea que...** - It's rumored that...
- **Están informando de que...** - They're reporting that...

## Key News Verbs

- **informar** - to report
- **investigar** - to investigate
- **denunciar** - to denounce / to report (a crime)
- **manifestarse** - to protest / to demonstrate
- **votar** - to vote`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m7",
    moduleTitle: "News & Current Events",
    order: 21,
    topicId: "es-intermediate-media-vocabulary",
    vocabulary: [
      { word: "periodista", translation: "journalist", pronunciation: "peh-ryoh-DEES-tah", exampleSentence: "La periodista investigó el caso durante meses.", exampleTranslation: "The journalist investigated the case for months.", partOfSpeech: "noun" },
      { word: "manifestarse", translation: "to protest / to demonstrate", pronunciation: "mah-nee-fehs-TAHR-seh", exampleSentence: "Miles de personas se manifestaron en la capital.", exampleTranslation: "Thousands of people protested in the capital.", partOfSpeech: "verb" },
      { word: "al parecer", translation: "apparently", pronunciation: "ahl pah-reh-SEHR", exampleSentence: "Al parecer, el acuerdo no se firmará.", exampleTranslation: "Apparently, the agreement won't be signed.", partOfSpeech: "phrase" },
      { word: "rumorear", translation: "to rumor", pronunciation: "rroo-moh-reh-AHR", exampleSentence: "Se rumorea que habrá elecciones anticipadas.", exampleTranslation: "It's rumored there will be early elections.", partOfSpeech: "verb" },
      { word: "denunciar", translation: "to denounce / to report", pronunciation: "deh-noon-SYAHR", exampleSentence: "Denunciaron la corrupción en el gobierno.", exampleTranslation: "They denounced corruption in the government.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Reporting Uncertainty: Indicative vs. Subjunctive in News",
        explanation: "News language uses specific structures to signal certainty levels. Confirmed facts use indicative: 'Se ha confirmado que hay acuerdo.' Unconfirmed reports use subjunctive: 'Se rumorea que haya cambios.' 'Al parecer' and 'según' take indicative because they report what a source claims as fact.",
        examples: [
          { correct: "Se ha confirmado que el ministro dimitirá.", translation: "It has been confirmed that the minister will resign. (indicative)" },
          { correct: "Se rumorea que haya cambios en el gobierno.", translation: "It's rumored there may be changes in government. (subjunctive)" },
          { correct: "Al parecer, la economía mejora.", translation: "Apparently, the economy is improving. (indicative)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "news-discussion",
        title: "Discussing Current Events",
        situation: "You're having a conversation about recent news over coffee",
        agentRole: "You are Roberto, a politically engaged friend. Bring up a recent news topic and discuss it. Use reported speech and news vocabulary. Ask for the student's opinion.",
        userGoal: "Discuss a current event using news vocabulary, reported speech, and opinion expressions",
        targetPhrases: ["Según...", "Al parecer...", "Dijo que...", "No creo que..."],
        successCriteria: ["Uses news vocabulary naturally", "Reports information using reported speech", "Expresses opinions about current events"],
      },
    ],
  },
];

// ============================================
// Module 8: Conditional & Hypothetical
// ============================================

const module8Lessons: LanguageLesson[] = [
  {
    id: "es-int-l22",
    slug: "imperfect-subjunctive",
    title: "The Imperfect Subjunctive",
    content: `# The Imperfect Subjunctive (Imperfecto de Subjuntivo)

The gateway to hypothetical and unreal statements.

## Formation

Take the **ellos** form of the preterite, drop **-ron**, add:
- **-ra, -ras, -ra, -ramos, -rais, -ran** (more common)
- **-se, -ses, -se, -semos, -seis, -sen** (literary/formal)

## Examples of Formation

- hablar → habla**ron** → habla**ra**
- comer → comie**ron** → comie**ra**
- tener → tuvie**ron** → tuvie**ra**
- ser/ir → fue**ron** → fue**ra**
- poder → pudie**ron** → pudie**ra**

## When to Use It

1. **After past-tense triggers that require subjunctive:**
   - Quería que vinieras. (I wanted you to come.)
   - Me pidió que le ayudara. (She asked me to help her.)

2. **In hypothetical 'si' clauses:**
   - Si tuviera dinero, viajaría. (If I had money, I'd travel.)

3. **With 'ojalá' for unlikely wishes:**
   - Ojalá pudiera volar. (I wish I could fly.)`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m8",
    moduleTitle: "Conditional & Hypothetical",
    order: 22,
    topicId: "es-intermediate-imperfect-subjunctive",
    vocabulary: [
      { word: "si pudiera", translation: "if I could", pronunciation: "see poo-DYEH-rah", exampleSentence: "Si pudiera, viviría en la playa.", exampleTranslation: "If I could, I'd live at the beach.", partOfSpeech: "phrase" },
      { word: "ojalá", translation: "I wish / if only", pronunciation: "oh-hah-LAH", exampleSentence: "Ojalá tuviera más tiempo libre.", exampleTranslation: "I wish I had more free time.", partOfSpeech: "interjection" },
      { word: "en ese caso", translation: "in that case", pronunciation: "ehn EH-seh KAH-soh", exampleSentence: "En ese caso, tendríamos que buscar otra solución.", exampleTranslation: "In that case, we would have to find another solution.", partOfSpeech: "phrase" },
      { word: "imaginar", translation: "to imagine", pronunciation: "ee-mah-hee-NAHR", exampleSentence: "Imagina que pudieras vivir en cualquier país.", exampleTranslation: "Imagine you could live in any country.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Forming the Imperfect Subjunctive",
        explanation: "The trick is: go to the 'ellos' preterite form first. Since preterite irregulars are already baked in (tuvieron, pudieron, fueron, hicieron), the imperfect subjunctive automatically inherits them. The -ra forms are overwhelmingly preferred in speech; -se forms appear in formal writing.",
        examples: [
          { correct: "hablar → hablaron → hablara", translation: "that I spoke / were to speak" },
          { correct: "tener → tuvieron → tuviera", translation: "that I had / were to have" },
          { correct: "ir/ser → fueron → fuera", translation: "that I went/were" },
        ],
        commonMistakes: [
          { incorrect: "Si tendría dinero, viajaría.", correction: "Si tuviera dinero, viajaría.", explanation: "Never use the conditional in the 'si' clause. Use imperfect subjunctive: si + imperfect subjunctive, + conditional." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "what-if",
        title: "What If...?",
        situation: "You're playing a hypothetical game with friends",
        agentRole: "You are Miguel, playing a 'what if' game. Ask hypothetical questions (What would you do if you won the lottery? If you could travel anywhere?) and share your own answers.",
        userGoal: "Answer and pose hypothetical questions using the imperfect subjunctive + conditional pattern",
        targetPhrases: ["Si pudiera...", "Si tuviera...", "Si fuera...", "Ojalá..."],
        successCriteria: ["Correctly forms the imperfect subjunctive", "Pairs si-clause with conditional result", "Engages in creative hypothetical discussion"],
      },
    ],
  },
  {
    id: "es-int-l23",
    slug: "conditional-sentences",
    title: "Conditional Sentences (Si Clauses)",
    content: `# Conditional Sentences (Oraciones Condicionales)

Master the three main types of 'if' sentences in Spanish.

## Type 1: Real/Possible (Present/Future)

**Si + present indicative, + present/future/imperative**
- **Si llueve, me quedo en casa.** - If it rains, I stay home.
- **Si estudias, aprobarás.** - If you study, you'll pass.

## Type 2: Hypothetical/Unlikely (Present)

**Si + imperfect subjunctive, + conditional**
- **Si tuviera tiempo, aprendería japonés.** - If I had time, I'd learn Japanese.
- **Si fuera presidente, cambiaría las leyes.** - If I were president, I'd change the laws.

## Type 3: Impossible/Past Regret

**Si + pluperfect subjunctive, + conditional perfect**
- **Si hubiera estudiado más, habría aprobado.** - If I had studied more, I would have passed.
- **Si hubiéramos salido antes, habríamos llegado a tiempo.** - If we had left earlier, we would have arrived on time.

## Common Mistakes to Avoid

- NEVER use conditional in the si-clause
- NEVER use present subjunctive after si (use indicative or imperfect subjunctive)`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m8",
    moduleTitle: "Conditional & Hypothetical",
    order: 23,
    topicId: "es-intermediate-conditional-sentences",
    vocabulary: [
      { word: "en lugar de", translation: "instead of", pronunciation: "ehn loo-GAHR deh", exampleSentence: "Si hubiera ido en coche en lugar de en tren, habría llegado antes.", exampleTranslation: "If I had gone by car instead of train, I would have arrived sooner.", partOfSpeech: "phrase" },
      { word: "de haber sabido", translation: "had I known", pronunciation: "deh ah-BEHR sah-BEE-doh", exampleSentence: "De haber sabido, no habría venido.", exampleTranslation: "Had I known, I wouldn't have come.", partOfSpeech: "phrase" },
      { word: "arrepentirse", translation: "to regret", pronunciation: "ah-rreh-pehn-TEER-seh", exampleSentence: "Me arrepiento de no haber viajado más de joven.", exampleTranslation: "I regret not having traveled more when I was young.", partOfSpeech: "verb" },
      { word: "resultado", translation: "result / outcome", pronunciation: "reh-sool-TAH-doh", exampleSentence: "Si hubiéramos actuado antes, el resultado habría sido diferente.", exampleTranslation: "If we had acted sooner, the outcome would have been different.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "The Three Conditional Types",
        explanation: "Type 1 (real): si + present + future/present. Type 2 (hypothetical now): si + imperfect subjunctive + conditional. Type 3 (impossible past): si + pluperfect subjunctive + conditional perfect. A shortcut for Type 3: 'de + haber + participle' can replace 'si hubiera + participle': 'De haberlo sabido, no habría ido.'",
        examples: [
          { correct: "Si tengo tiempo, iré.", translation: "If I have time, I'll go. (Type 1: real)" },
          { correct: "Si tuviera tiempo, iría.", translation: "If I had time, I'd go. (Type 2: hypothetical)" },
          { correct: "Si hubiera tenido tiempo, habría ido.", translation: "If I had had time, I would have gone. (Type 3: past regret)" },
        ],
        commonMistakes: [
          { incorrect: "Si tendría tiempo, iría.", correction: "Si tuviera tiempo, iría.", explanation: "The conditional NEVER goes in the si-clause. Only indicative or subjunctive." },
          { incorrect: "Si tenga tiempo, iré.", correction: "Si tengo tiempo, iré.", explanation: "Present subjunctive is not used after 'si'. Use present indicative for real conditions." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "life-choices",
        title: "Different Life Choices",
        situation: "You're reflecting on past decisions and alternative paths with a friend",
        agentRole: "You are Carmen, reflecting on life choices over dinner. Discuss what you would have done differently and ask the student about their past decisions and current hypotheticals.",
        userGoal: "Use all three conditional types naturally in conversation about life choices",
        targetPhrases: ["Si hubiera..., habría...", "Si tuviera..., haría...", "Si tengo..., haré..."],
        successCriteria: ["Uses Type 2 conditional correctly", "Attempts Type 3 conditional for past regrets", "Distinguishes between real and hypothetical conditions"],
      },
    ],
  },
  {
    id: "es-int-l24",
    slug: "expressing-regrets",
    title: "Expressing Regrets & Wishes",
    content: `# Expressing Regrets & Wishes

Talk about what you wish were different and what you regret.

## Regrets About the Past

- **Ojalá hubiera estudiado más.** - I wish I had studied more.
- **Ojalá no hubiera dicho eso.** - I wish I hadn't said that.
- **Me arrepiento de no haber viajado.** - I regret not having traveled.
- **Debería haber llamado antes.** - I should have called earlier.
- **Tendría que haber sido más valiente.** - I should have been braver.

## Wishes About the Present

- **Ojalá tuviera más tiempo.** - I wish I had more time.
- **Ojalá pudiera hablar mejor español.** - I wish I could speak better Spanish.
- **Me gustaría que las cosas fueran diferentes.** - I'd like things to be different.

## Offering Comfort

- **No te preocupes, lo hecho, hecho está.** - Don't worry, what's done is done.
- **No podías haber sabido.** - You couldn't have known.
- **Fue lo mejor en ese momento.** - It was the best thing at the time.
- **Ya no tiene remedio.** - There's nothing to be done about it now.

## Reflecting

- **Si pudiera volver atrás...** - If I could go back...
- **Mirando hacia atrás...** - Looking back...
- **Con lo que sé ahora...** - With what I know now...`,
    targetLanguage: "es",
    proficiencyLevel: "B1",
    moduleId: "es-int-m8",
    moduleTitle: "Conditional & Hypothetical",
    order: 24,
    topicId: "es-intermediate-expressing-regrets",
    vocabulary: [
      { word: "arrepentirse", translation: "to regret", pronunciation: "ah-rreh-pehn-TEER-seh", exampleSentence: "No me arrepiento de nada.", exampleTranslation: "I don't regret anything.", partOfSpeech: "verb" },
      { word: "volver atrás", translation: "to go back (in time)", pronunciation: "vohl-VEHR ah-TRAHS", exampleSentence: "Si pudiera volver atrás, haría las cosas de otra manera.", exampleTranslation: "If I could go back, I'd do things differently.", partOfSpeech: "phrase" },
      { word: "lo hecho, hecho está", translation: "what's done is done", pronunciation: "loh EH-choh EH-choh ehs-TAH", exampleSentence: "Lo hecho, hecho está. Hay que mirar hacia adelante.", exampleTranslation: "What's done is done. We have to look forward.", partOfSpeech: "phrase" },
      { word: "lamentar", translation: "to lament / to be sorry about", pronunciation: "lah-mehn-TAHR", exampleSentence: "Lamento no haber podido asistir.", exampleTranslation: "I'm sorry I wasn't able to attend.", partOfSpeech: "verb" },
      { word: "valiente", translation: "brave", pronunciation: "vah-LYEHN-teh", exampleSentence: "Debería haber sido más valiente en ese momento.", exampleTranslation: "I should have been braver at that moment.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "'Ojalá' Across Time Frames",
        explanation: "'Ojalá' changes meaning based on the subjunctive tense that follows: **Ojalá + present subjunctive** = hope for something possible (Ojalá llueva = I hope it rains). **Ojalá + imperfect subjunctive** = wish for something unlikely now (Ojalá tuviera = I wish I had). **Ojalá + pluperfect subjunctive** = regret about the past (Ojalá hubiera ido = I wish I had gone).",
        examples: [
          { correct: "Ojalá apruebe el examen.", translation: "I hope I pass the exam. (possible future)" },
          { correct: "Ojalá tuviera un coche.", translation: "I wish I had a car. (unlikely present)" },
          { correct: "Ojalá hubiera ido a la universidad.", translation: "I wish I had gone to university. (past regret)" },
        ],
      },
      {
        title: "'Debería haber' + Past Participle",
        explanation: "To express 'should have done' (past regret about an action), use: debería/tendría que + haber + past participle. This is the conditional perfect of obligation.",
        examples: [
          { correct: "Debería haber llamado antes.", translation: "I should have called earlier." },
          { correct: "Tendríamos que haber reservado.", translation: "We should have made a reservation." },
          { correct: "No deberías haber dicho eso.", translation: "You shouldn't have said that." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "life-reflections",
        title: "Late-Night Reflections",
        situation: "It's late at night and you're having a deep conversation with a close friend about life",
        agentRole: "You are Alejandro, sharing regrets and wishes over a late dinner. Be thoughtful and open. Ask the student about things they would change or wish were different.",
        userGoal: "Express regrets about the past and wishes about the present using advanced subjunctive structures",
        targetPhrases: ["Ojalá hubiera...", "Si pudiera volver atrás...", "Debería haber...", "Me arrepiento de..."],
        successCriteria: ["Uses ojalá with correct subjunctive tense for each time frame", "Expresses past regrets with pluperfect subjunctive", "Offers comfort using fixed expressions"],
      },
    ],
    culturalNotes: [
      {
        title: "Philosophical Conversations in Spanish Culture",
        content: "Late-night deep conversations (sobremesa extended into madrugada) are a cherished tradition in Spanish culture. Topics like life regrets, philosophy, and 'what could have been' are common after a long dinner. The expression 'las cosas de la vida' (that's life) captures the Spanish acceptance of fate, while 'echar de menos' (to miss) is a key emotional verb for these moments.",
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  {
    id: "es-int-m1",
    title: "Module 1: Narrating the Past",
    description: "Preterite vs. imperfect contrast, pluperfect, storytelling connectors",
    order: 1,
    lessons: module1Lessons,
  },
  {
    id: "es-int-m2",
    title: "Module 2: Opinions & Arguments",
    description: "Subjunctive introduction, opinion phrases, debate and persuasion",
    order: 2,
    lessons: module2Lessons,
  },
  {
    id: "es-int-m3",
    title: "Module 3: Workplace & Career",
    description: "Formal register, conditional for polite requests, job vocabulary",
    order: 3,
    lessons: module3Lessons,
  },
  {
    id: "es-int-m4",
    title: "Module 4: Technology & Modern Life",
    description: "Subjunctive with impersonal expressions, tech and modern life vocabulary",
    order: 4,
    lessons: module4Lessons,
  },
  {
    id: "es-int-m5",
    title: "Module 5: Environment & Nature",
    description: "Subjunctive with doubt and denial, passive voice, sustainability",
    order: 5,
    lessons: module5Lessons,
  },
  {
    id: "es-int-m6",
    title: "Module 6: Culture & Entertainment",
    description: "Subjunctive in time clauses, reviews, arts vocabulary",
    order: 6,
    lessons: module6Lessons,
  },
  {
    id: "es-int-m7",
    title: "Module 7: News & Current Events",
    description: "Reported speech, future perfect, media vocabulary",
    order: 7,
    lessons: module7Lessons,
  },
  {
    id: "es-int-m8",
    title: "Module 8: Conditional & Hypothetical",
    description: "Imperfect subjunctive, si-clauses, expressing regrets",
    order: 8,
    lessons: module8Lessons,
  },
];

export const spanishIntermediateCourse: LanguageCourse = {
  ...courseInfo,
  modules,
};

// Helper function to get all lessons
export function getSpanishIntermediateLessons() {
  return modules.flatMap((m) => m.lessons);
}

// Helper function to find a lesson by slug
export function findSpanishIntermediateLesson(slug: string) {
  return getSpanishIntermediateLessons().find((l) => l.slug === slug);
}
