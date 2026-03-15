// Spanish Advanced Course Data
// CEFR C1 Level - Advanced Subjunctive, Idioms, Academic, Literary, Dialectology, Business, Creative Writing, Native Fluency

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "spanish-advanced",
  slug: "spanish-advanced",
  title: "Spanish Advanced - C1",
  language: "es",
  languageName: "Spanish",
  proficiencyLevel: "C1" as const,
  description: "Achieve near-native fluency in Spanish. Master complex subjunctive constructions, idiomatic expressions, academic and literary language, regional dialectology, business Spanish, and rhetorical devices.",
  targetAudience: "Upper-intermediate learners ready to reach advanced proficiency",
  estimatedHours: 100,
  icon: "🇪🇸",
  prerequisiteCourseSlug: "spanish-intermediate",
};

// ============================================
// Module 1: Advanced Subjunctive
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "es-adv-l1",
    slug: "pluperfect-subjunctive",
    title: "Pluperfect Subjunctive",
    content: `# Pluperfect Subjunctive (Pluscuamperfecto de subjuntivo)

The pluperfect subjunctive expresses hypothetical or unreal actions in the past. It is formed with the imperfect subjunctive of *haber* + past participle.

## Formation

| Subject | Haber (imperfect subj.) | + Past Participle |
|---------|------------------------|-------------------|
| yo | hubiera / hubiese | hablado, comido, vivido |
| tú | hubieras / hubieses | |
| él/ella | hubiera / hubiese | |
| nosotros | hubiéramos / hubiésemos | |
| ellos | hubieran / hubiesen | |

## Key Uses

- **Unreal past conditions**: Si hubiera sabido, habría ido.
- **Wishes about the past**: Ojalá hubiera estudiado más.
- **After "como si"**: Hablaba como si hubiera vivido allí toda su vida.
- **Expressions of emotion about past events**: Me sorprendió que no hubieran llegado.`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m1",
    moduleTitle: "Advanced Subjunctive",
    order: 1,
    topicId: "es-advanced-pluperfect-subjunctive",
    vocabulary: [
      {
        word: "hubiera sabido",
        translation: "had known (subjunctive)",
        pronunciation: "oo-BYEH-rah sah-BEE-doh",
        exampleSentence: "Si hubiera sabido la verdad, no habría actuado así.",
        exampleTranslation: "If I had known the truth, I wouldn't have acted that way.",
        partOfSpeech: "verb phrase",
      },
      {
        word: "ojalá",
        translation: "if only / I wish",
        pronunciation: "oh-hah-LAH",
        exampleSentence: "Ojalá hubiéramos tenido más tiempo.",
        exampleTranslation: "If only we had had more time.",
        partOfSpeech: "interjection",
      },
      {
        word: "hubiese",
        translation: "had (subjunctive, alternate form)",
        pronunciation: "oo-BYEH-seh",
        exampleSentence: "No creía que hubiese terminado tan pronto.",
        exampleTranslation: "I didn't believe he had finished so soon.",
        partOfSpeech: "verb",
      },
      {
        word: "de haber sabido",
        translation: "had I known",
        pronunciation: "deh ah-BEHR sah-BEE-doh",
        exampleSentence: "De haber sabido, habría venido antes.",
        exampleTranslation: "Had I known, I would have come sooner.",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Hubiera vs. Hubiese",
        explanation: "Both forms are grammatically interchangeable. *Hubiera* is more common in Latin America and everyday speech; *hubiese* is more frequent in formal writing and in Spain.",
        examples: [
          { correct: "Si hubiera llovido, no habríamos salido.", translation: "If it had rained, we wouldn't have gone out." },
          { correct: "Si hubiese llovido, no habríamos salido.", translation: "If it had rained, we wouldn't have gone out. (same meaning, alternate form)" },
        ],
        commonMistakes: [
          {
            incorrect: "Si habría sabido...",
            correction: "Si hubiera sabido...",
            explanation: "Never use the conditional ('habría') in the 'si' clause. The subjunctive is required after 'si' in counterfactual conditions.",
          },
        ],
      },
      {
        title: "De + infinitive compound as conditional shortcut",
        explanation: "'De haber + past participle' can replace 'si hubiera + past participle' in more literary or formal registers.",
        examples: [
          { correct: "De haberlo sabido, no habría ido.", translation: "Had I known, I wouldn't have gone.", note: "Equivalent to 'Si lo hubiera sabido...'" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "regret-conversation",
        title: "Discussing Regrets",
        situation: "You and a friend are reflecting on past decisions you wish you'd made differently.",
        agentRole: "You are Marta, a reflective friend. Share a regret using pluperfect subjunctive and ask the student about theirs.",
        userGoal: "Express at least two regrets about past decisions using pluperfect subjunctive constructions.",
        targetPhrases: ["Si hubiera...", "Ojalá hubiera...", "De haber sabido..."],
        successCriteria: ["Uses pluperfect subjunctive correctly", "Expresses counterfactual past", "Maintains conversation flow"],
      },
    ],
    culturalNotes: [
      {
        title: "The Weight of 'Ojalá'",
        content: "'Ojalá' comes from Arabic *inshallah* (God willing), a remnant of 800 years of Moorish presence in Spain. When combined with the pluperfect subjunctive, it carries deep emotional weight — expressing impossible wishes about a past that cannot be changed.",
      },
    ],
  },
  {
    id: "es-adv-l2",
    slug: "como-si-constructions",
    title: "Como Si & Irrealis Constructions",
    content: `# Como Si & Irrealis Constructions

*Como si* (as if) always triggers the subjunctive — either imperfect or pluperfect, depending on time reference.

## Rules

- **Present/habitual unreal** → como si + imperfect subjunctive
- **Past unreal** → como si + pluperfect subjunctive
- *Como si* NEVER takes the indicative or the present subjunctive.

## Examples

- Habla como si **fuera** nativo. (He speaks as if he were a native.)
- Actuó como si no **hubiera pasado** nada. (She acted as if nothing had happened.)
- Gasta dinero como si **tuviera** millones. (He spends money as if he had millions.)`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m1",
    moduleTitle: "Advanced Subjunctive",
    order: 2,
    topicId: "es-advanced-como-si-constructions",
    vocabulary: [
      {
        word: "como si",
        translation: "as if / as though",
        pronunciation: "KOH-moh see",
        exampleSentence: "Me miró como si estuviera loco.",
        exampleTranslation: "He looked at me as if I were crazy.",
        partOfSpeech: "conjunction",
      },
      {
        word: "aparentar",
        translation: "to appear / to pretend",
        pronunciation: "ah-pah-rehn-TAHR",
        exampleSentence: "Aparentaba como si nada le importara.",
        exampleTranslation: "She pretended as if nothing mattered to her.",
        partOfSpeech: "verb",
      },
      {
        word: "fingir",
        translation: "to pretend / to feign",
        pronunciation: "feen-HEER",
        exampleSentence: "Fingía como si supiera la respuesta.",
        exampleTranslation: "He pretended as if he knew the answer.",
        partOfSpeech: "verb",
      },
      {
        word: "ni que",
        translation: "as if (emphatic/dismissive)",
        pronunciation: "nee keh",
        exampleSentence: "¡Ni que fueras el jefe!",
        exampleTranslation: "As if you were the boss!",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Como si + Subjunctive Tense Selection",
        explanation: "The tense after *como si* depends on the time relationship. Use imperfect subjunctive for simultaneous or present unreality; use pluperfect subjunctive for prior unreality.",
        examples: [
          { correct: "Habla como si fuera español.", translation: "He speaks as if he were Spanish. (present unreal)" },
          { correct: "Reaccionó como si hubiera visto un fantasma.", translation: "She reacted as if she had seen a ghost. (past unreal)" },
        ],
        commonMistakes: [
          {
            incorrect: "Habla como si es español.",
            correction: "Habla como si fuera español.",
            explanation: "'Como si' always requires the subjunctive, never the indicative.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "describing-behavior",
        title: "Describing Odd Behavior",
        situation: "You and a colleague are discussing a mutual acquaintance's strange behavior at a recent event.",
        agentRole: "You are Diego, a gossipy colleague. Describe someone's odd behavior using 'como si' and prompt the student to do the same.",
        userGoal: "Use 'como si' constructions to describe at least three behaviors or situations.",
        targetPhrases: ["como si fuera...", "como si hubiera...", "ni que fuera..."],
        successCriteria: ["Correctly uses como si + imperfect subjunctive", "Correctly uses como si + pluperfect subjunctive", "Natural conversational tone"],
      },
    ],
  },
  {
    id: "es-adv-l3",
    slug: "complex-hypotheticals",
    title: "Complex Hypotheticals & Mixed Conditionals",
    content: `# Complex Hypotheticals & Mixed Conditionals

At C1, you need to handle hypothetical chains that mix time frames and layer multiple conditions.

## Mixed Conditionals

- **Past condition → Present result**: Si hubiera estudiado medicina, ahora sería doctor.
- **Present condition → Past result**: Si fuera más valiente, habría hablado en la reunión.

## Layered Hypotheticals

- Si no me hubieran despedido, no habría montado mi empresa, y hoy no sería millonario.

## Alternative Conditional Structures

- **De + infinitive**: De ser posible, lo haría. (If it were possible, I'd do it.)
- **Con que + subjunctive**: Con que llegues a tiempo, será suficiente.
- **A menos que**: A menos que hubiera cambiado de opinión... (Unless he had changed his mind...)`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m1",
    moduleTitle: "Advanced Subjunctive",
    order: 3,
    topicId: "es-advanced-complex-hypotheticals",
    vocabulary: [
      {
        word: "de ser posible",
        translation: "if it were possible",
        pronunciation: "deh sehr poh-SEE-bleh",
        exampleSentence: "De ser posible, preferiría quedarme en casa.",
        exampleTranslation: "If it were possible, I'd prefer to stay home.",
        partOfSpeech: "phrase",
      },
      {
        word: "a menos que",
        translation: "unless",
        pronunciation: "ah MEH-nohss keh",
        exampleSentence: "No iré a menos que me inviten formalmente.",
        exampleTranslation: "I won't go unless they formally invite me.",
        partOfSpeech: "conjunction",
      },
      {
        word: "con tal de que",
        translation: "provided that / as long as",
        pronunciation: "kohn tahl deh keh",
        exampleSentence: "Acepto con tal de que respeten mis condiciones.",
        exampleTranslation: "I accept provided that they respect my conditions.",
        partOfSpeech: "conjunction",
      },
      {
        word: "en caso de que",
        translation: "in case / in the event that",
        pronunciation: "ehn KAH-soh deh keh",
        exampleSentence: "Lleva paraguas en caso de que llueva.",
        exampleTranslation: "Take an umbrella in case it rains.",
        partOfSpeech: "conjunction",
      },
      {
        word: "supongamos que",
        translation: "let's suppose that",
        pronunciation: "soo-pohng-GAH-mohss keh",
        exampleSentence: "Supongamos que tuvieras un millón de euros.",
        exampleTranslation: "Let's suppose you had a million euros.",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Mixed Conditionals: Crossing Time Frames",
        explanation: "Mixed conditionals combine different time frames between the 'si' clause and the result clause. The subjunctive tense in the 'si' clause and the conditional tense in the result clause must each independently reflect their own time reference.",
        examples: [
          { correct: "Si hubiera ahorrado más, ahora tendría una casa.", translation: "If I had saved more, I would now have a house. (past → present)", note: "Pluperfect subjunctive + simple conditional" },
          { correct: "Si fuera más decidido, habría aceptado la oferta ayer.", translation: "If he were more decisive, he would have accepted the offer yesterday. (present → past)", note: "Imperfect subjunctive + conditional perfect" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "life-choices-debate",
        title: "Life Choices Debate",
        situation: "A philosophical discussion about how different life choices would have led to different outcomes.",
        agentRole: "You are Professor Alonso, leading a thought experiment. Pose hypothetical scenarios mixing past and present and ask the student to construct complex conditional responses.",
        userGoal: "Construct at least two mixed conditionals and one layered hypothetical chain.",
        targetPhrases: ["Si hubiera..., ahora...", "De haber..., habría...", "A menos que..."],
        successCriteria: ["Produces a past→present mixed conditional", "Produces a layered hypothetical", "Uses alternative conditional structures"],
      },
    ],
  },
];

// ============================================
// Module 2: Idiomatic & Colloquial Spanish
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "es-adv-l4",
    slug: "common-idioms",
    title: "Essential Spanish Idioms",
    content: `# Essential Spanish Idioms

Mastering idioms is the gateway to sounding natural. These expressions rarely translate literally.

## Body-Related Idioms

- **Meter la pata** — To put one's foot in it / make a blunder
- **No tener pelos en la lengua** — To not mince words / be blunt
- **Tomar el pelo** — To pull someone's leg / tease
- **Dar en el clavo** — To hit the nail on the head

## Situation Idioms

- **Estar en las nubes** — To have one's head in the clouds
- **Ir al grano** — To get to the point
- **No dar pie con bola** — To not get anything right
- **Costar un ojo de la cara** — To cost an arm and a leg`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m2",
    moduleTitle: "Idiomatic & Colloquial Spanish",
    order: 4,
    topicId: "es-advanced-common-idioms",
    vocabulary: [
      {
        word: "meter la pata",
        translation: "to put one's foot in it / blunder",
        pronunciation: "meh-TEHR lah PAH-tah",
        exampleSentence: "Metí la pata al mencionar su ex en la cena.",
        exampleTranslation: "I put my foot in it by mentioning his ex at dinner.",
        partOfSpeech: "idiom",
      },
      {
        word: "dar en el clavo",
        translation: "to hit the nail on the head",
        pronunciation: "dahr ehn ehl KLAH-voh",
        exampleSentence: "Con ese análisis, diste en el clavo.",
        exampleTranslation: "With that analysis, you hit the nail on the head.",
        partOfSpeech: "idiom",
      },
      {
        word: "tomar el pelo",
        translation: "to pull someone's leg / tease",
        pronunciation: "toh-MAHR ehl PEH-loh",
        exampleSentence: "¿Me estás tomando el pelo?",
        exampleTranslation: "Are you pulling my leg?",
        partOfSpeech: "idiom",
      },
      {
        word: "ir al grano",
        translation: "to get to the point",
        pronunciation: "eer ahl GRAH-noh",
        exampleSentence: "Deja de rodeos y ve al grano.",
        exampleTranslation: "Stop beating around the bush and get to the point.",
        partOfSpeech: "idiom",
      },
      {
        word: "costar un ojo de la cara",
        translation: "to cost an arm and a leg",
        pronunciation: "kohs-TAHR oon OH-hoh deh lah KAH-rah",
        exampleSentence: "Ese coche le costó un ojo de la cara.",
        exampleTranslation: "That car cost him an arm and a leg.",
        partOfSpeech: "idiom",
      },
    ],
    grammarPoints: [
      {
        title: "Idiom Conjugation Patterns",
        explanation: "Many Spanish idioms are built around infinitive verb phrases. When conjugated, only the main verb changes; the rest of the idiom stays fixed.",
        examples: [
          { correct: "Siempre meto la pata.", translation: "I always put my foot in it." },
          { correct: "Ayer metiste la pata.", translation: "Yesterday you put your foot in it." },
          { correct: "No me tomes el pelo.", translation: "Don't pull my leg.", note: "Negative imperative form" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "idiom-storytelling",
        title: "Storytelling with Idioms",
        situation: "You are telling a friend about a disastrous but funny day using as many idioms as possible.",
        agentRole: "You are Lucía, an animated friend who loves stories. React with your own idioms and ask for details.",
        userGoal: "Narrate a short anecdote using at least four different idioms naturally.",
        targetPhrases: ["meter la pata", "dar en el clavo", "ir al grano", "costar un ojo de la cara"],
        successCriteria: ["Uses 4+ idioms correctly in context", "Idioms flow naturally in narrative", "Responds to follow-up questions"],
      },
    ],
  },
  {
    id: "es-adv-l5",
    slug: "slang-register",
    title: "Slang & Register Shifting",
    content: `# Slang & Register Shifting

Understanding colloquial speech and knowing when to shift registers is a hallmark of C1 proficiency.

## Common Slang (Spain)

- **molar** — to be cool (Eso mola.)
- **flipar** — to freak out / be amazed (¡Estoy flipando!)
- **currar** — to work (Tengo que currar mañana.)
- **tío/tía** — dude / mate (¡Oye, tío!)
- **quedarse en blanco** — to draw a blank

## Common Slang (Latin America)

- **chido/chévere/copado** — cool (regional variants)
- **pana/parcero** — buddy (Venezuela/Colombia)
- **órale** — wow / come on (Mexico)
- **plata** — money (widespread LatAm)

## Register Awareness

Knowing WHEN to use slang is as important as knowing HOW. Shifting between formal, neutral, and colloquial registers marks true fluency.`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m2",
    moduleTitle: "Idiomatic & Colloquial Spanish",
    order: 5,
    topicId: "es-advanced-slang-register",
    vocabulary: [
      {
        word: "molar",
        translation: "to be cool (Spain slang)",
        pronunciation: "moh-LAHR",
        exampleSentence: "¡Esa peli mola mucho!",
        exampleTranslation: "That movie is really cool!",
        partOfSpeech: "verb",
      },
      {
        word: "flipar",
        translation: "to freak out / to be amazed",
        pronunciation: "flee-PAHR",
        exampleSentence: "Cuando vi el precio, flipé.",
        exampleTranslation: "When I saw the price, I freaked out.",
        partOfSpeech: "verb",
      },
      {
        word: "currar",
        translation: "to work (Spain slang)",
        pronunciation: "koo-RRAHR",
        exampleSentence: "He estado currando todo el fin de semana.",
        exampleTranslation: "I've been working all weekend.",
        partOfSpeech: "verb",
      },
      {
        word: "chévere",
        translation: "cool / great (Latin America)",
        pronunciation: "CHEH-veh-reh",
        exampleSentence: "¡Qué chévere que viniste!",
        exampleTranslation: "How cool that you came!",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "Register Shifting in Practice",
        explanation: "Spanish has clear register levels. Colloquial speech uses contracted forms, slang, and dropped consonants. Formal speech uses usted, complete verb forms, and avoids slang entirely. C1 speakers must navigate both.",
        examples: [
          { correct: "Oye, tío, ¿quedamos o qué?", translation: "Hey dude, are we meeting up or what? (colloquial)", note: "Friends, casual" },
          { correct: "Disculpe, ¿sería posible concertar una cita?", translation: "Excuse me, would it be possible to arrange an appointment? (formal)", note: "Professional, usted form" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "register-switch",
        title: "The Register Switch",
        situation: "You're chatting casually with a friend at a café when your boss walks in. You must smoothly shift from colloquial to formal register.",
        agentRole: "You are first Paco (casual friend), then Señor Ramírez (the boss). Signal the switch clearly.",
        userGoal: "Demonstrate fluent register shifting between colloquial and formal Spanish.",
        targetPhrases: ["tío", "mola", "disculpe", "sería posible"],
        successCriteria: ["Uses colloquial register naturally", "Shifts to formal register seamlessly", "Maintains appropriate register for each interlocutor"],
      },
    ],
  },
  {
    id: "es-adv-l6",
    slug: "diminutives-augmentatives",
    title: "Diminutives, Augmentatives & Affective Suffixes",
    content: `# Diminutives, Augmentatives & Affective Suffixes

Spanish uses suffixes to express size, affection, contempt, and emphasis — a system far richer than English.

## Diminutives

- **-ito/-ita**: casita, perrito, momentito (affection, smallness)
- **-illo/-illa**: pueblecillo, ventanilla (slightly literary or regional)
- **-ico/-ica**: used in Aragón, Murcia, parts of Latin America (momentico)
- **-ín/-ina**: used in Asturias (pequeñín)

## Augmentatives

- **-ón/-ona**: casona (big house), solterón (confirmed bachelor)
- **-azo/-aza**: cochazo (fancy car), madraza (great mother)
- **-ote/-ota**: grandote (really big), amigote (close buddy)

## Pejorative Suffixes

- **-ucho/-ucha**: casucha (run-down house)
- **-ejo/-eja**: animalejo (wretched little animal)

## Key Insight

Suffixes carry emotional and social meaning beyond size. "Jefecito" can be affectionate OR sarcastic depending on tone.`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m2",
    moduleTitle: "Idiomatic & Colloquial Spanish",
    order: 6,
    topicId: "es-advanced-diminutives-augmentatives",
    vocabulary: [
      {
        word: "casita",
        translation: "little house (affectionate)",
        pronunciation: "kah-SEE-tah",
        exampleSentence: "Tienen una casita en la playa.",
        exampleTranslation: "They have a little house on the beach.",
        partOfSpeech: "noun",
      },
      {
        word: "cochazo",
        translation: "amazing/fancy car",
        pronunciation: "koh-CHAH-thoh",
        exampleSentence: "Se ha comprado un cochazo impresionante.",
        exampleTranslation: "He bought himself an amazing car.",
        partOfSpeech: "noun",
      },
      {
        word: "solterón",
        translation: "confirmed bachelor / old bachelor",
        pronunciation: "sohl-teh-ROHN",
        exampleSentence: "Mi tío es un solterón empedernido.",
        exampleTranslation: "My uncle is a confirmed bachelor.",
        partOfSpeech: "noun",
      },
      {
        word: "casucha",
        translation: "run-down house (pejorative)",
        pronunciation: "kah-SOO-chah",
        exampleSentence: "Vivían en una casucha sin calefacción.",
        exampleTranslation: "They lived in a run-down house without heating.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Suffix Selection Rules",
        explanation: "The choice of suffix depends on regional preference, emotional tone, and the base word's phonology. Words ending in -e or consonant often take -cito (pez → pececito). Words ending in -n or -r often take -cito too (amor → amorcito).",
        examples: [
          { correct: "un momentito", translation: "just a tiny moment (affectionate, polite delay)" },
          { correct: "un golazo", translation: "an amazing goal (augmentative, enthusiasm)", note: "-azo here means 'great' not 'big'" },
          { correct: "un pueblucho", translation: "a crappy little town (pejorative)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "suffix-nuance",
        title: "Expressing Nuance with Suffixes",
        situation: "You are describing your neighborhood to a new friend, using suffixes to convey your feelings about different places and things.",
        agentRole: "You are Valentina, new to the neighborhood. Ask about places, react to descriptions, and use your own suffixes.",
        userGoal: "Describe at least five things using different diminutive, augmentative, and pejorative suffixes.",
        targetPhrases: ["casita", "cochazo", "-ón", "-ucho"],
        successCriteria: ["Uses diminutives correctly", "Uses augmentatives correctly", "Demonstrates pejorative suffixes", "Tone matches suffix choice"],
      },
    ],
  },
];

// ============================================
// Module 3: Academic Spanish
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "es-adv-l7",
    slug: "formal-academic-writing",
    title: "Formal Academic Writing",
    content: `# Formal Academic Writing

Academic Spanish demands precision, objectivity, and a formal register. This lesson covers the conventions of scholarly writing.

## Impersonal Constructions

- **Se ha demostrado que...** — It has been demonstrated that...
- **Cabe destacar que...** — It is worth noting that...
- **Es preciso señalar que...** — It is necessary to point out that...
- **Conviene subrayar que...** — It is advisable to emphasize that...

## Hedging & Nuance

- **Parece indicar** — seems to indicate
- **Podría argumentarse que** — it could be argued that
- **No se descarta que** — it is not ruled out that
- **Los datos sugieren que** — the data suggest that

## Formal Connectors

- **No obstante** — nevertheless
- **Sin embargo** — however
- **Asimismo** — likewise
- **En lo que respecta a** — with regard to
- **A modo de conclusión** — by way of conclusion`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m3",
    moduleTitle: "Academic Spanish",
    order: 7,
    topicId: "es-advanced-formal-academic-writing",
    vocabulary: [
      {
        word: "cabe destacar",
        translation: "it is worth noting",
        pronunciation: "KAH-beh dehs-tah-KAHR",
        exampleSentence: "Cabe destacar que los resultados fueron significativos.",
        exampleTranslation: "It is worth noting that the results were significant.",
        partOfSpeech: "phrase",
      },
      {
        word: "no obstante",
        translation: "nevertheless",
        pronunciation: "noh ohb-STAHN-teh",
        exampleSentence: "Los datos son limitados; no obstante, la tendencia es clara.",
        exampleTranslation: "The data are limited; nevertheless, the trend is clear.",
        partOfSpeech: "connector",
      },
      {
        word: "asimismo",
        translation: "likewise / also",
        pronunciation: "ah-see-MEEZ-moh",
        exampleSentence: "Asimismo, se observó una mejora en el grupo control.",
        exampleTranslation: "Likewise, an improvement was observed in the control group.",
        partOfSpeech: "adverb",
      },
      {
        word: "en lo que respecta a",
        translation: "with regard to / as far as ... is concerned",
        pronunciation: "ehn loh keh rrehs-PEHK-tah ah",
        exampleSentence: "En lo que respecta a la metodología, se siguió un enfoque mixto.",
        exampleTranslation: "With regard to the methodology, a mixed approach was followed.",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Impersonal 'Se' in Academic Writing",
        explanation: "Academic Spanish heavily uses impersonal and passive 'se' to maintain objectivity and avoid first person. 'Se ha observado', 'se concluye', 'se puede afirmar' are standard formulas.",
        examples: [
          { correct: "Se ha demostrado que el efecto es significativo.", translation: "It has been demonstrated that the effect is significant." },
          { correct: "Se observa una tendencia al alza.", translation: "An upward trend is observed." },
        ],
        commonMistakes: [
          {
            incorrect: "Yo he demostrado que...",
            correction: "Se ha demostrado que...",
            explanation: "In academic Spanish, avoid first person singular. Use impersonal constructions or first person plural ('hemos demostrado') for collaborative work.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "conference-presentation",
        title: "Conference Presentation",
        situation: "You are presenting research findings at an academic conference and fielding questions.",
        agentRole: "You are Profesor Mendoza, a distinguished academic. Ask probing questions about the student's research methodology and findings.",
        userGoal: "Present findings using formal academic language and respond to challenging questions with hedging and precision.",
        targetPhrases: ["Cabe destacar que...", "Los datos sugieren...", "No obstante...", "Podría argumentarse que..."],
        successCriteria: ["Uses impersonal constructions", "Employs hedging language", "Uses formal connectors", "Maintains academic register throughout"],
      },
    ],
  },
  {
    id: "es-adv-l8",
    slug: "nominalizations",
    title: "Nominalizations & Abstract Expression",
    content: `# Nominalizations & Abstract Expression

Nominalization — turning verbs and adjectives into nouns — is a hallmark of academic and formal registers.

## Common Patterns

- **Verb → Noun**: investigar → la investigación, desarrollar → el desarrollo
- **Adjective → Noun**: posible → la posibilidad, eficaz → la eficacia
- **Verb → -miento**: conocer → el conocimiento, proceder → el procedimiento

## Why Nominalize?

Nominalization compresses information and creates a more formal, dense style:
- "Investigamos el problema" → "La investigación del problema reveló..."
- "Es posible que mejore" → "La posibilidad de mejora..."

## Common Suffixes

| Suffix | Example | Meaning |
|--------|---------|---------|
| -ción/-sión | la globalización | globalization |
| -miento | el crecimiento | growth |
| -dad/-tad | la diversidad | diversity |
| -ancia/-encia | la permanencia | permanence |
| -aje | el aprendizaje | learning |`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m3",
    moduleTitle: "Academic Spanish",
    order: 8,
    topicId: "es-advanced-nominalizations",
    vocabulary: [
      {
        word: "el planteamiento",
        translation: "the approach / the raising (of an issue)",
        pronunciation: "ehl plahn-teh-ah-MYEHN-toh",
        exampleSentence: "El planteamiento del problema es clave.",
        exampleTranslation: "The framing of the problem is key.",
        partOfSpeech: "noun",
      },
      {
        word: "la eficacia",
        translation: "effectiveness / efficacy",
        pronunciation: "lah eh-fee-KAH-thyah",
        exampleSentence: "La eficacia del tratamiento fue comprobada.",
        exampleTranslation: "The effectiveness of the treatment was verified.",
        partOfSpeech: "noun",
      },
      {
        word: "el aprendizaje",
        translation: "learning (process)",
        pronunciation: "ehl ah-prehn-dee-THAH-heh",
        exampleSentence: "El aprendizaje de una lengua requiere constancia.",
        exampleTranslation: "Learning a language requires consistency.",
        partOfSpeech: "noun",
      },
      {
        word: "el cumplimiento",
        translation: "compliance / fulfillment",
        pronunciation: "ehl koom-plee-MYEHN-toh",
        exampleSentence: "El cumplimiento de las normas es obligatorio.",
        exampleTranslation: "Compliance with the regulations is mandatory.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Converting Clauses to Nominal Phrases",
        explanation: "Transform subordinate clauses into nominal phrases for more concise, formal writing. This is essential for abstracts, thesis statements, and formal reports.",
        examples: [
          { correct: "La implementación de la nueva política generó debate.", translation: "The implementation of the new policy generated debate.", note: "Instead of: 'Cuando se implementó la nueva política, se generó debate.'" },
          { correct: "El desconocimiento de la normativa no exime de su cumplimiento.", translation: "Ignorance of the regulations does not exempt one from compliance." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "thesis-defense",
        title: "Thesis Defense",
        situation: "You are defending your master's thesis before a committee.",
        agentRole: "You are Doctora Ríos on the thesis committee. Ask the student to explain their research question, methodology, and conclusions using formal academic language.",
        userGoal: "Explain research using nominalizations and formal academic structures.",
        targetPhrases: ["el planteamiento", "la investigación", "el análisis", "a modo de conclusión"],
        successCriteria: ["Uses nominalizations naturally", "Maintains formal academic register", "Structures argument logically"],
      },
    ],
  },
  {
    id: "es-adv-l9",
    slug: "thesis-defense-vocabulary",
    title: "Thesis Defense & Research Vocabulary",
    content: `# Thesis Defense & Research Vocabulary

The oral defense (defensa de tesis) is a formal academic ritual. Master the specific vocabulary and phrases.

## Defense Structure Phrases

- **El objetivo de esta investigación es...** — The objective of this research is...
- **La hipótesis de partida fue...** — The starting hypothesis was...
- **En cuanto a la metodología...** — Regarding the methodology...
- **Los hallazgos principales son...** — The main findings are...
- **Las limitaciones del estudio incluyen...** — The study's limitations include...

## Responding to Committee Questions

- **Es una observación muy pertinente.** — That's a very pertinent observation.
- **Permítame matizar esa afirmación.** — Allow me to qualify that statement.
- **Quisiera ampliar ese punto.** — I would like to expand on that point.
- **Coincido parcialmente con su planteamiento.** — I partially agree with your approach.`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m3",
    moduleTitle: "Academic Spanish",
    order: 9,
    topicId: "es-advanced-thesis-defense-vocabulary",
    vocabulary: [
      {
        word: "los hallazgos",
        translation: "the findings",
        pronunciation: "lohs ah-YAHTH-gohs",
        exampleSentence: "Los hallazgos respaldan la hipótesis inicial.",
        exampleTranslation: "The findings support the initial hypothesis.",
        partOfSpeech: "noun",
      },
      {
        word: "matizar",
        translation: "to qualify / to nuance",
        pronunciation: "mah-tee-THAHR",
        exampleSentence: "Conviene matizar esa afirmación.",
        exampleTranslation: "It is advisable to qualify that statement.",
        partOfSpeech: "verb",
      },
      {
        word: "la hipótesis",
        translation: "the hypothesis",
        pronunciation: "lah ee-POH-teh-sees",
        exampleSentence: "La hipótesis fue corroborada por los datos.",
        exampleTranslation: "The hypothesis was corroborated by the data.",
        partOfSpeech: "noun",
      },
      {
        word: "el marco teórico",
        translation: "the theoretical framework",
        pronunciation: "ehl MAHR-koh teh-OH-ree-koh",
        exampleSentence: "El marco teórico se basa en tres autores fundamentales.",
        exampleTranslation: "The theoretical framework is based on three key authors.",
        partOfSpeech: "noun phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Conditional for Academic Politeness",
        explanation: "The conditional tense softens assertions and shows academic caution: 'sería', 'podría', 'convendría'. This is not about hypotheticals but about scholarly modesty and hedging.",
        examples: [
          { correct: "Sería necesario ampliar la muestra.", translation: "It would be necessary to expand the sample." },
          { correct: "Convendría considerar variables adicionales.", translation: "It would be advisable to consider additional variables." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "committee-grilling",
        title: "Committee Grilling",
        situation: "A thesis committee member challenges your methodology and you must defend your choices diplomatically.",
        agentRole: "You are Profesor Vargas, a tough but fair examiner. Challenge the student's research choices and push for deeper justification.",
        userGoal: "Defend your academic choices using formal hedging, qualifications, and evidence-based arguments.",
        targetPhrases: ["Permítame matizar...", "Los hallazgos indican...", "Coincido parcialmente...", "Quisiera ampliar..."],
        successCriteria: ["Responds diplomatically to challenges", "Uses hedging language", "Cites evidence to support claims", "Maintains composure and formality"],
      },
    ],
  },
];

// ============================================
// Module 4: Literature & Literary Analysis
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "es-adv-l10",
    slug: "cervantes-golden-age",
    title: "Cervantes & the Golden Age",
    content: `# Cervantes & the Spanish Golden Age

The *Siglo de Oro* (16th-17th centuries) produced Spain's greatest literary works. Miguel de Cervantes' *Don Quijote* (1605/1615) is considered the first modern novel.

## Key Vocabulary from Don Quijote

- **caballero andante** — knight-errant
- **molinos de viento** — windmills (and their metaphorical meaning)
- **la sin par Dulcinea** — the peerless Dulcinea
- **desfacer entuertos** — to right wrongs (archaic)

## Literary Terms

- **el narrador omnisciente** — omniscient narrator
- **la parodia** — parody
- **la metaficción** — metafiction
- **el recurso narrativo** — narrative device

## Famous Quote
> "En un lugar de la Mancha, de cuyo nombre no quiero acordarme..."
> (In a place in La Mancha, whose name I do not wish to remember...)`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m4",
    moduleTitle: "Literature & Literary Analysis",
    order: 10,
    topicId: "es-advanced-cervantes-golden-age",
    vocabulary: [
      {
        word: "el Siglo de Oro",
        translation: "the Golden Age (of Spanish literature)",
        pronunciation: "ehl SEE-gloh deh OH-roh",
        exampleSentence: "El Siglo de Oro produjo obras maestras de la literatura universal.",
        exampleTranslation: "The Golden Age produced masterpieces of world literature.",
        partOfSpeech: "noun phrase",
      },
      {
        word: "caballero andante",
        translation: "knight-errant",
        pronunciation: "kah-bah-YEH-roh ahn-DAHN-teh",
        exampleSentence: "Don Quijote se creía un caballero andante.",
        exampleTranslation: "Don Quijote believed himself a knight-errant.",
        partOfSpeech: "noun phrase",
      },
      {
        word: "metaficción",
        translation: "metafiction",
        pronunciation: "meh-tah-feek-THYOHN",
        exampleSentence: "El Quijote es una obra pionera de la metaficción.",
        exampleTranslation: "Don Quijote is a pioneering work of metafiction.",
        partOfSpeech: "noun",
      },
      {
        word: "parodia",
        translation: "parody",
        pronunciation: "pah-ROH-dyah",
        exampleSentence: "Cervantes escribió una parodia de las novelas de caballerías.",
        exampleTranslation: "Cervantes wrote a parody of chivalric novels.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Recognizing Archaic Spanish",
        explanation: "Golden Age texts use archaic forms: 'vos' instead of 'tú', 'vuestra merced' (origin of 'usted'), verb endings like '-ades' instead of '-áis'. Recognizing these forms is essential for reading classical literature.",
        examples: [
          { correct: "Vuestra merced debe saber...", translation: "Your Grace must know...", note: "Vuestra merced → usted (modern)" },
          { correct: "¿Qué fazéis aquí?", translation: "What are you doing here? (archaic)", note: "Fazéis → hacéis (modern)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "literary-discussion",
        title: "Book Club: Don Quijote",
        situation: "You are in a Spanish literature book club discussing the themes and significance of Don Quijote.",
        agentRole: "You are Carmen, a passionate literature teacher. Discuss themes of reality vs. illusion, idealism, and the novel's legacy. Ask the student to analyze specific passages.",
        userGoal: "Discuss literary themes using analytical vocabulary and express interpretations of the text.",
        targetPhrases: ["la parodia", "el narrador", "se podría interpretar como...", "simboliza"],
        successCriteria: ["Uses literary terms correctly", "Offers original interpretation", "Engages with themes analytically"],
      },
    ],
    culturalNotes: [
      {
        title: "Don Quijote's Cultural Impact",
        content: "The expression 'luchar contra molinos de viento' (to fight windmills) means to battle imaginary enemies. Don Quijote has given Spanish numerous expressions: 'quijotesco' means idealistic to the point of impracticality. The novel is the most translated work after the Bible.",
      },
    ],
  },
  {
    id: "es-adv-l11",
    slug: "garcia-marquez-magical-realism",
    title: "García Márquez & Magical Realism",
    content: `# García Márquez & Magical Realism

Gabriel García Márquez (1927-2014), Nobel Prize 1982, defined *realismo mágico* — where the extraordinary is presented as ordinary.

## Key Concepts

- **Realismo mágico** — Magical realism: supernatural elements woven into everyday reality
- **Macondo** — The fictional town in *Cien años de soledad*, representing Latin America
- **La soledad** — Solitude as a recurring theme
- **El tiempo cíclico** — Cyclical time: history repeating across generations

## Famous Opening
> "Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo."

## Analytical Vocabulary

- **la hipérbole** — hyperbole
- **el presagio** — omen / foreshadowing
- **la estirpe** — lineage / dynasty
- **el mito fundacional** — foundational myth`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m4",
    moduleTitle: "Literature & Literary Analysis",
    order: 11,
    topicId: "es-advanced-garcia-marquez-magical-realism",
    vocabulary: [
      {
        word: "realismo mágico",
        translation: "magical realism",
        pronunciation: "rreh-ah-LEEZ-moh MAH-hee-koh",
        exampleSentence: "El realismo mágico fusiona lo cotidiano con lo sobrenatural.",
        exampleTranslation: "Magical realism fuses the everyday with the supernatural.",
        partOfSpeech: "noun phrase",
      },
      {
        word: "la estirpe",
        translation: "lineage / dynasty",
        pronunciation: "lah ehs-TEER-peh",
        exampleSentence: "La novela narra la historia de una estirpe condenada a la soledad.",
        exampleTranslation: "The novel tells the story of a lineage condemned to solitude.",
        partOfSpeech: "noun",
      },
      {
        word: "el presagio",
        translation: "omen / foreshadowing",
        pronunciation: "ehl preh-SAH-hyoh",
        exampleSentence: "Los presagios de muerte recorren toda la obra.",
        exampleTranslation: "Omens of death run throughout the work.",
        partOfSpeech: "noun",
      },
      {
        word: "la hipérbole",
        translation: "hyperbole",
        pronunciation: "lah ee-PEHR-boh-leh",
        exampleSentence: "García Márquez usa la hipérbole como recurso constante.",
        exampleTranslation: "García Márquez uses hyperbole as a constant device.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Past Perfect (Pluperfect) in Literary Narrative",
        explanation: "García Márquez's famous opening uses 'había de recordar' — a literary form meaning 'was to remember.' The pluperfect and periphrastic future-in-the-past create the layered temporality characteristic of his prose.",
        examples: [
          { correct: "Había de recordar aquella tarde remota.", translation: "He was to remember that remote afternoon.", note: "'Haber de + infinitive' = destiny, inevitability" },
          { correct: "Ya lo habían advertido los presagios.", translation: "The omens had already warned of it." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "magical-realism-analysis",
        title: "Analyzing Magical Realism",
        situation: "A university seminar on Latin American literature. Discuss García Márquez's narrative techniques.",
        agentRole: "You are Profesora Echeverría, a Colombian literature specialist. Challenge the student to explain how magical realism works as a narrative strategy and its cultural roots.",
        userGoal: "Analyze magical realism techniques using literary vocabulary and connect them to Latin American identity.",
        targetPhrases: ["realismo mágico", "la hipérbole", "el tiempo cíclico", "se podría argumentar"],
        successCriteria: ["Explains magical realism with examples", "Uses literary analysis vocabulary", "Connects technique to cultural context"],
      },
    ],
  },
  {
    id: "es-adv-l12",
    slug: "neruda-poetry-analysis",
    title: "Neruda & Poetic Analysis",
    content: `# Pablo Neruda & Poetic Analysis

Pablo Neruda (1904-1973), Nobel Prize 1971, is one of the most important poets in any language. His work ranges from passionate love poetry to political engagement.

## Poetic Devices (Recursos poéticos)

- **la metáfora** — metaphor
- **el símil** — simile
- **la aliteración** — alliteration
- **el encabalgamiento** — enjambment
- **la anáfora** — anaphora (repetition at start of lines)
- **la sinestesia** — synesthesia (mixing senses)

## From "Poema 20"
> "Puedo escribir los versos más tristes esta noche."
> (I can write the saddest verses tonight.)

## Analytical Phrases

- **El poeta recurre a...** — The poet resorts to...
- **La voz poética expresa...** — The poetic voice expresses...
- **Se aprecia un tono de...** — A tone of... can be appreciated
- **La imagen evoca...** — The image evokes...`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m4",
    moduleTitle: "Literature & Literary Analysis",
    order: 12,
    topicId: "es-advanced-neruda-poetry-analysis",
    vocabulary: [
      {
        word: "el encabalgamiento",
        translation: "enjambment",
        pronunciation: "ehl ehn-kah-bahl-hah-MYEHN-toh",
        exampleSentence: "Neruda emplea el encabalgamiento para crear fluidez.",
        exampleTranslation: "Neruda uses enjambment to create fluidity.",
        partOfSpeech: "noun",
      },
      {
        word: "la anáfora",
        translation: "anaphora (rhetorical repetition)",
        pronunciation: "lah ah-NAH-foh-rah",
        exampleSentence: "La anáfora refuerza el sentimiento de insistencia.",
        exampleTranslation: "The anaphora reinforces the feeling of insistence.",
        partOfSpeech: "noun",
      },
      {
        word: "la voz poética",
        translation: "the poetic voice",
        pronunciation: "lah bohth poh-EH-tee-kah",
        exampleSentence: "La voz poética oscila entre la nostalgia y la resignación.",
        exampleTranslation: "The poetic voice oscillates between nostalgia and resignation.",
        partOfSpeech: "noun phrase",
      },
      {
        word: "la sinestesia",
        translation: "synesthesia (mixing of senses in poetry)",
        pronunciation: "lah see-nehs-TEH-syah",
        exampleSentence: "La sinestesia aparece en 'un silencio verde y húmedo'.",
        exampleTranslation: "Synesthesia appears in 'a green and humid silence'.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Subjunctive in Poetic Expression",
        explanation: "Poetry frequently uses the subjunctive for wishes, uncertainty, and emotional coloring. Recognizing subjunctive forms in verse is essential for close reading at C1.",
        examples: [
          { correct: "Que no se apague la llama.", translation: "May the flame not go out. (wish/exhortation)" },
          { correct: "Aunque llueva, saldré a buscarte.", translation: "Even if it rains, I'll go out to find you. (concessive)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "poetry-recitation-analysis",
        title: "Poetry Reading & Analysis",
        situation: "A literary salon where participants read poems aloud and offer analysis.",
        agentRole: "You are Don Rafael, host of a poetry salon. Read a few lines of Neruda and ask the student to identify poetic devices and interpret the emotional content.",
        userGoal: "Identify at least three poetic devices and explain their effect on meaning and emotion.",
        targetPhrases: ["la metáfora", "la voz poética expresa...", "se aprecia un tono de...", "el encabalgamiento"],
        successCriteria: ["Identifies poetic devices by name", "Explains their function in the poem", "Offers personal interpretation"],
      },
    ],
  },
];

// ============================================
// Module 5: Spanish Dialectology
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "es-adv-l13",
    slug: "voseo-tuteo",
    title: "Voseo vs. Tuteo",
    content: `# Voseo vs. Tuteo

One of the most important dialectal features in Spanish is the use of *vos* instead of *tú*.

## Where is Voseo Used?

- **Full voseo (pronoun + verb)**: Argentina, Uruguay, Paraguay, Central America
- **Verbal voseo only**: Parts of Colombia, Venezuela, Ecuador
- **Tuteo dominant**: Spain, Mexico, Peru, Caribbean

## Voseo Verb Conjugation (Present Tense)

| Tú form | Vos form | English |
|---------|---------|---------|
| tú hablas | vos hablás | you speak |
| tú comes | vos comés | you eat |
| tú vives | vos vivís | you live |
| tú tienes | vos tenés | you have |
| tú eres | vos sos | you are |

## Key Differences in Commands

- Tú: habla, come, vive
- Vos: hablá, comé, viví`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m5",
    moduleTitle: "Spanish Dialectology",
    order: 13,
    topicId: "es-advanced-voseo-tuteo",
    vocabulary: [
      {
        word: "vos",
        translation: "you (informal, used in River Plate Spanish)",
        pronunciation: "bohss",
        exampleSentence: "¿Vos de dónde sos?",
        exampleTranslation: "Where are you from? (Argentine Spanish)",
        partOfSpeech: "pronoun",
      },
      {
        word: "che",
        translation: "hey / buddy (Argentine interjection)",
        pronunciation: "cheh",
        exampleSentence: "Che, ¿vamos a tomar unos mates?",
        exampleTranslation: "Hey, shall we have some mate?",
        partOfSpeech: "interjection",
      },
      {
        word: "tenés",
        translation: "you have (voseo form of tienes)",
        pronunciation: "teh-NEHSS",
        exampleSentence: "¿Tenés tiempo para un café?",
        exampleTranslation: "Do you have time for a coffee?",
        partOfSpeech: "verb",
      },
      {
        word: "sos",
        translation: "you are (voseo form of eres)",
        pronunciation: "sohss",
        exampleSentence: "Vos sos mi mejor amigo.",
        exampleTranslation: "You are my best friend.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Voseo Conjugation Pattern",
        explanation: "Vos conjugations stress the last syllable and remove the diphthong: tienes → tenés, puedes → podés, quieres → querés. In the imperative, the stress shifts to the final syllable: habla → hablá, ven → vení.",
        examples: [
          { correct: "¿Querés venir conmigo?", translation: "Do you want to come with me? (voseo)" },
          { correct: "Decime la verdad.", translation: "Tell me the truth. (vos imperative)", note: "Tú form would be: Dime la verdad." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "argentine-conversation",
        title: "Chatting in Buenos Aires",
        situation: "You are at a Buenos Aires café and must use voseo to fit in naturally.",
        agentRole: "You are Facundo, a porteño (Buenos Aires local). Speak entirely in voseo and react if the student uses tuteo — gently correct them to use vos forms.",
        userGoal: "Sustain a 5-minute conversation using voseo forms throughout.",
        targetPhrases: ["vos", "sos", "tenés", "querés", "hablá"],
        successCriteria: ["Uses vos pronoun consistently", "Conjugates verbs in voseo form", "Uses vos imperatives"],
      },
    ],
    culturalNotes: [
      {
        title: "Voseo as Identity",
        content: "In Argentina and Uruguay, voseo is not 'informal dialect' — it IS the standard. Using tú in Buenos Aires would mark you as foreign or affected. However, in academic writing and formal contexts, some Argentines switch to tú. Understanding when each form is appropriate requires cultural sensitivity.",
      },
    ],
  },
  {
    id: "es-adv-l14",
    slug: "seseo-ceceo-distincion",
    title: "Seseo, Ceceo & Distinción",
    content: `# Seseo, Ceceo & Distinción

The pronunciation of *c* (before e/i), *z*, and *s* is one of the most prominent dialectal markers in Spanish.

## Three Systems

- **Distinción** (most of Spain): *z/ce/ci* → /θ/ (like English "th"), *s* → /s/
  - "caza" ≠ "casa" in pronunciation
- **Seseo** (Latin America, Canary Islands, parts of Andalusia): all → /s/
  - "caza" = "casa" in pronunciation
- **Ceceo** (parts of Andalusia): all → /θ/
  - Both "casa" and "caza" pronounced with "th"

## Other Major Phonological Variations

- **Yeísmo**: *ll* and *y* merged (almost universal now)
- **Aspirated /s/**: *s* at end of syllable → /h/ (Caribbean, Andalusia): "estos" → "ehtoh"
- **Rehilamiento**: *y/ll* → /ʒ/ or /ʃ/ (Argentina, Uruguay): "yo" sounds like "sho"`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m5",
    moduleTitle: "Spanish Dialectology",
    order: 14,
    topicId: "es-advanced-seseo-ceceo-distincion",
    vocabulary: [
      {
        word: "la distinción",
        translation: "distinction (phonological system differentiating s/z)",
        pronunciation: "lah dees-teen-THYOHN",
        exampleSentence: "En Madrid se mantiene la distinción entre 's' y 'z'.",
        exampleTranslation: "In Madrid, the distinction between 's' and 'z' is maintained.",
        partOfSpeech: "noun",
      },
      {
        word: "el seseo",
        translation: "seseo (merging s/z as /s/)",
        pronunciation: "ehl seh-SEH-oh",
        exampleSentence: "El seseo es la norma en toda Hispanoamérica.",
        exampleTranslation: "Seseo is the norm throughout Spanish America.",
        partOfSpeech: "noun",
      },
      {
        word: "el ceceo",
        translation: "ceceo (merging s/z as /th/)",
        pronunciation: "ehl theh-THEH-oh",
        exampleSentence: "El ceceo se escucha en partes de Andalucía.",
        exampleTranslation: "Ceceo is heard in parts of Andalusia.",
        partOfSpeech: "noun",
      },
      {
        word: "el yeísmo",
        translation: "yeísmo (merging ll and y sounds)",
        pronunciation: "ehl yeh-EEZ-moh",
        exampleSentence: "El yeísmo se ha generalizado en casi todo el mundo hispanohablante.",
        exampleTranslation: "Yeísmo has become widespread in nearly all the Spanish-speaking world.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Understanding Dialectal Variation Without Judgment",
        explanation: "No dialect is 'more correct' than another. Seseo is not 'lazy' and distinción is not 'pretentious'. A C1 speaker should recognize all systems and understand speakers from any region without difficulty.",
        examples: [
          { correct: "En Sevilla: 'Vamos a la plasa a casar mariposas.'", translation: "In Seville (with ceceo): 'Let's go to the plaza to hunt butterflies.'", note: "All sibilants realized as /θ/" },
          { correct: "En Buenos Aires: 'Sho me shamo Yolanda.'", translation: "In Buenos Aires (with rehilamiento): 'My name is Yolanda.'", note: "Y/LL → /ʃ/ (sh sound)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "dialect-identification",
        title: "Guess the Dialect",
        situation: "A linguistics class where you listen to different speakers and identify their region based on phonological features.",
        agentRole: "You are Profesora Luna, a sociolinguist. Describe speech patterns from different regions and ask the student to identify the dialectal features and probable origin.",
        userGoal: "Correctly identify at least three dialectal features and associate them with regions.",
        targetPhrases: ["seseo", "distinción", "yeísmo", "aspiración de la s"],
        successCriteria: ["Identifies phonological features by technical name", "Associates features with correct regions", "Discusses variation without value judgment"],
      },
    ],
  },
  {
    id: "es-adv-l15",
    slug: "regional-vocabulary",
    title: "Regional Vocabulary Across the Spanish World",
    content: `# Regional Vocabulary Across the Spanish World

The same object can have completely different names across the Spanish-speaking world.

## Transportation
| Concept | Spain | Mexico | Argentina | Colombia |
|---------|-------|--------|-----------|----------|
| Car | coche | carro | auto | carro |
| Bus | autobús | camión | colectivo | bus |
| Ticket | billete | boleto | boleto | tiquete |

## Food
| Concept | Spain | Mexico | Argentina | Colombia |
|---------|-------|--------|-----------|----------|
| Banana | plátano | plátano | banana | banano |
| Avocado | aguacate | aguacate | palta | aguacate |
| Popcorn | palomitas | palomitas | pochoclo | crispetas |

## Everyday Items
| Concept | Spain | Mexico | Argentina | Colombia |
|---------|-------|--------|-----------|----------|
| Computer | ordenador | computadora | computadora | computador |
| Cell phone | móvil | celular | celular | celular |
| Apartment | piso | departamento | departamento | apartamento |`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m5",
    moduleTitle: "Spanish Dialectology",
    order: 15,
    topicId: "es-advanced-regional-vocabulary",
    vocabulary: [
      {
        word: "coche / carro / auto",
        translation: "car (Spain / Mexico-Colombia / Argentina)",
        pronunciation: "KOH-cheh / KAH-rroh / OW-toh",
        exampleSentence: "Alquilamos un coche en Madrid y un auto en Buenos Aires.",
        exampleTranslation: "We rented a car in Madrid and a car in Buenos Aires.",
        partOfSpeech: "noun",
      },
      {
        word: "palta / aguacate",
        translation: "avocado (Southern Cone / rest of LatAm + Spain)",
        pronunciation: "PAHL-tah / ah-gwah-KAH-teh",
        exampleSentence: "En Chile piden palta; en México, aguacate.",
        exampleTranslation: "In Chile they ask for palta; in Mexico, aguacate.",
        partOfSpeech: "noun",
      },
      {
        word: "piso / departamento / apartamento",
        translation: "apartment (Spain / LatAm / Colombia)",
        pronunciation: "PEE-soh / deh-pahr-tah-MEHN-toh",
        exampleSentence: "Busco un piso en el centro de Barcelona.",
        exampleTranslation: "I'm looking for an apartment in downtown Barcelona.",
        partOfSpeech: "noun",
      },
      {
        word: "ordenador / computadora / computador",
        translation: "computer (Spain / most LatAm / Colombia)",
        pronunciation: "ohr-deh-nah-DOHR / kohm-poo-tah-DOH-rah",
        exampleSentence: "Mi ordenador se averió. / Mi computadora se descompuso.",
        exampleTranslation: "My computer broke down.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Navigating Lexical Variation",
        explanation: "At C1, you should be able to understand all regional variants even if you actively use only one. When writing for an international audience, prefer neutral terms or specify the variant.",
        examples: [
          { correct: "En España se dice 'coche'; en Argentina, 'auto'.", translation: "In Spain they say 'coche'; in Argentina, 'auto'." },
          { correct: "El término 'computadora' se entiende en todo el continente.", translation: "The term 'computadora' is understood across the continent.", note: "Neutral choice for pan-Hispanic audience" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "dialect-navigation",
        title: "Traveling Across Latin America",
        situation: "You are telling a friend about confusion caused by different vocabulary in different countries you visited.",
        agentRole: "You are Andrés, who has lived in Spain, Mexico, and Argentina. Share funny misunderstandings caused by vocabulary differences and quiz the student on regional terms.",
        userGoal: "Demonstrate knowledge of at least five regional vocabulary differences and tell an anecdote about a misunderstanding.",
        targetPhrases: ["En España se dice...", "En Argentina usan...", "coche/carro/auto"],
        successCriteria: ["Identifies regional variants correctly", "Explains at least one misunderstanding", "Shows awareness of pan-Hispanic variation"],
      },
    ],
  },
];

// ============================================
// Module 6: Business & Legal Spanish
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "es-adv-l16",
    slug: "business-negotiations",
    title: "Business Negotiations",
    content: `# Business Negotiations

Master the language of professional negotiations in Spanish.

## Opening a Negotiation

- **Nos gustaría plantear una propuesta.** — We'd like to put forward a proposal.
- **El objetivo de esta reunión es...** — The objective of this meeting is...
- **Partimos de la base de que...** — We start from the premise that...

## Making & Responding to Offers

- **Nuestra oferta inicial es...** — Our initial offer is...
- **Estaríamos dispuestos a considerar...** — We would be willing to consider...
- **Eso no se ajusta a nuestras expectativas.** — That doesn't meet our expectations.
- **¿Habría margen para negociar...?** — Would there be room to negotiate...?

## Closing & Committing

- **Hemos llegado a un acuerdo.** — We've reached an agreement.
- **Queda pendiente la firma del contrato.** — The contract signing is still pending.
- **Las condiciones pactadas son las siguientes...** — The agreed conditions are as follows...`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m6",
    moduleTitle: "Business & Legal Spanish",
    order: 16,
    topicId: "es-advanced-business-negotiations",
    vocabulary: [
      {
        word: "plantear una propuesta",
        translation: "to put forward a proposal",
        pronunciation: "plahn-teh-AHR OO-nah proh-PWEHS-tah",
        exampleSentence: "Permítanme plantear una propuesta alternativa.",
        exampleTranslation: "Allow me to put forward an alternative proposal.",
        partOfSpeech: "verb phrase",
      },
      {
        word: "el margen de negociación",
        translation: "room for negotiation / negotiating margin",
        pronunciation: "ehl MAHR-hehn deh neh-goh-thyah-THYOHN",
        exampleSentence: "Todavía hay margen de negociación en el precio.",
        exampleTranslation: "There is still room for negotiation on the price.",
        partOfSpeech: "noun phrase",
      },
      {
        word: "las condiciones pactadas",
        translation: "the agreed-upon conditions",
        pronunciation: "lahs kohn-dee-THYOH-nehs pahk-TAH-dahss",
        exampleSentence: "Las condiciones pactadas figuran en el anexo.",
        exampleTranslation: "The agreed-upon conditions are listed in the annex.",
        partOfSpeech: "noun phrase",
      },
      {
        word: "llegar a un acuerdo",
        translation: "to reach an agreement",
        pronunciation: "yeh-GAHR ah oon ah-KWEHR-doh",
        exampleSentence: "Tras horas de debate, llegamos a un acuerdo.",
        exampleTranslation: "After hours of debate, we reached an agreement.",
        partOfSpeech: "verb phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Conditional for Diplomatic Softening",
        explanation: "In business Spanish, the conditional is essential for making proposals sound less imposing: 'queremos' → 'quisiéramos', 'pueden' → 'podrían'. This creates diplomatic distance.",
        examples: [
          { correct: "Quisiéramos proponer un descuento del 10%.", translation: "We would like to propose a 10% discount." },
          { correct: "¿Podrían reconsiderar los plazos de entrega?", translation: "Could you reconsider the delivery deadlines?" },
        ],
        commonMistakes: [
          {
            incorrect: "Queremos un descuento.",
            correction: "Quisiéramos un descuento.",
            explanation: "In negotiations, direct demands ('queremos') can seem aggressive. The conditional ('quisiéramos') maintains professional courtesy.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "contract-negotiation",
        title: "Contract Negotiation",
        situation: "You are negotiating terms of a partnership agreement with a Spanish firm.",
        agentRole: "You are Directora Sánchez, a tough but fair negotiator for a Madrid-based company. Present an initial offer, push back on counteroffers, and work toward a compromise.",
        userGoal: "Negotiate effectively, making counteroffers and reaching a compromise using formal business language.",
        targetPhrases: ["Quisiéramos proponer...", "¿Habría margen para...?", "Estaríamos dispuestos a...", "Hemos llegado a un acuerdo"],
        successCriteria: ["Uses conditional for diplomacy", "Makes structured counteroffers", "Reaches a compromise", "Maintains professional register"],
      },
    ],
  },
  {
    id: "es-adv-l17",
    slug: "contracts-legal-language",
    title: "Contracts & Legal Language",
    content: `# Contracts & Legal Language

Legal Spanish (español jurídico) is a specialized register with its own vocabulary and syntax.

## Contract Structure

- **Las partes contratantes** — The contracting parties
- **La cláusula** — The clause
- **El objeto del contrato** — The purpose of the contract
- **La vigencia** — The term/validity period
- **La rescisión** — Termination/cancellation
- **El incumplimiento** — Breach/non-compliance

## Key Legal Phrases

- **En virtud de lo establecido en...** — By virtue of what is established in...
- **A los efectos del presente contrato...** — For the purposes of this contract...
- **Ambas partes se comprometen a...** — Both parties commit to...
- **En caso de litigio...** — In case of litigation...
- **Queda expresamente prohibido...** — It is expressly prohibited...`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m6",
    moduleTitle: "Business & Legal Spanish",
    order: 17,
    topicId: "es-advanced-contracts-legal-language",
    vocabulary: [
      {
        word: "la cláusula",
        translation: "the clause (legal)",
        pronunciation: "lah KLOW-soo-lah",
        exampleSentence: "La cláusula tercera establece las obligaciones del proveedor.",
        exampleTranslation: "The third clause establishes the supplier's obligations.",
        partOfSpeech: "noun",
      },
      {
        word: "la rescisión",
        translation: "termination / cancellation (of contract)",
        pronunciation: "lah rrehs-see-SYOHN",
        exampleSentence: "La rescisión del contrato requiere un preaviso de 30 días.",
        exampleTranslation: "Termination of the contract requires 30 days' notice.",
        partOfSpeech: "noun",
      },
      {
        word: "el incumplimiento",
        translation: "breach / non-compliance",
        pronunciation: "ehl een-koom-plee-MYEHN-toh",
        exampleSentence: "El incumplimiento de cualquier cláusula dará lugar a penalizaciones.",
        exampleTranslation: "Breach of any clause will result in penalties.",
        partOfSpeech: "noun",
      },
      {
        word: "en virtud de",
        translation: "by virtue of / pursuant to",
        pronunciation: "ehn beer-TOOD deh",
        exampleSentence: "En virtud de lo anterior, se acuerda lo siguiente.",
        exampleTranslation: "By virtue of the foregoing, the following is agreed.",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Future Subjunctive in Legal Texts",
        explanation: "The future subjunctive (hablare, tuviere) is virtually extinct in everyday Spanish but survives in legal and bureaucratic documents. Recognizing it is essential for reading contracts.",
        examples: [
          { correct: "Si el arrendatario no cumpliere con las obligaciones...", translation: "Should the tenant fail to fulfill the obligations...", note: "Future subjunctive 'cumpliere' — modern equivalent: 'cumpliera' or 'no cumple'" },
          { correct: "Lo que fuere necesario se determinará...", translation: "Whatever may be necessary shall be determined..." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "contract-review",
        title: "Reviewing a Contract",
        situation: "You are reviewing a contract with a lawyer and asking questions about specific clauses.",
        agentRole: "You are Licenciado Torres, a corporate lawyer. Explain contract terms in plain language when asked, but use legal vocabulary naturally.",
        userGoal: "Ask about specific clauses, request clarification on legal terms, and suggest modifications.",
        targetPhrases: ["la cláusula", "la rescisión", "en virtud de", "¿podría explicar...?"],
        successCriteria: ["Asks about specific legal terms", "Understands explanations", "Suggests modifications using formal language"],
      },
    ],
  },
  {
    id: "es-adv-l18",
    slug: "formal-correspondence",
    title: "Formal Correspondence",
    content: `# Formal Correspondence

Master the conventions of formal letters and emails in Spanish business and professional contexts.

## Opening Formulas

- **Estimado/a Sr./Sra. [Apellido]:** — Dear Mr./Mrs. [Last name]:
- **Muy señor/a mío/a:** — Dear Sir/Madam: (very formal)
- **A quien corresponda:** — To Whom It May Concern:
- **Me dirijo a usted con el fin de...** — I am writing to you in order to...

## Body Phrases

- **En relación con su consulta...** — Regarding your inquiry...
- **Le comunico que...** — I inform you that...
- **Adjunto encontrará...** — Enclosed/attached you will find...
- **Lamentamos informarle que...** — We regret to inform you that...
- **Quedamos a su disposición para...** — We remain at your disposal for...

## Closing Formulas

- **Atentamente** — Sincerely
- **Reciba un cordial saludo** — Receive warm regards
- **Sin otro particular, le saluda atentamente** — With nothing further, yours faithfully
- **Quedo a la espera de su respuesta** — I await your response`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m6",
    moduleTitle: "Business & Legal Spanish",
    order: 18,
    topicId: "es-advanced-formal-correspondence",
    vocabulary: [
      {
        word: "me dirijo a usted",
        translation: "I am writing to you (formal)",
        pronunciation: "meh dee-REE-hoh ah oos-TEHD",
        exampleSentence: "Me dirijo a usted para solicitar información sobre sus servicios.",
        exampleTranslation: "I am writing to you to request information about your services.",
        partOfSpeech: "phrase",
      },
      {
        word: "adjunto",
        translation: "attached / enclosed",
        pronunciation: "ahd-HOON-toh",
        exampleSentence: "Adjunto encontrará el presupuesto solicitado.",
        exampleTranslation: "Attached you will find the requested budget.",
        partOfSpeech: "adjective",
      },
      {
        word: "a la espera de",
        translation: "awaiting / in anticipation of",
        pronunciation: "ah lah ehs-PEH-rah deh",
        exampleSentence: "Quedo a la espera de su pronta respuesta.",
        exampleTranslation: "I await your prompt response.",
        partOfSpeech: "phrase",
      },
      {
        word: "sin otro particular",
        translation: "with nothing further to add",
        pronunciation: "seen OH-troh pahr-tee-koo-LAHR",
        exampleSentence: "Sin otro particular, le saluda atentamente, María López.",
        exampleTranslation: "With nothing further, yours faithfully, María López.",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Le/Les vs. Lo/Los in Formal Writing",
        explanation: "In formal correspondence, 'le' (indirect object) is preferred in Spain even where 'lo' (direct object) would be grammatically expected — a phenomenon called 'leísmo de cortesía'. In Latin America, 'lo/la' is standard.",
        examples: [
          { correct: "Le saluda atentamente. (Spain)", translation: "Yours faithfully. (lit: greets you respectfully)", note: "Leísmo de cortesía — accepted in formal contexts" },
          { correct: "Lo saluda atentamente. (Latin America)", translation: "Yours faithfully. (same meaning, LatAm standard)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "complaint-letter",
        title: "Drafting a Formal Complaint",
        situation: "You need to dictate a formal complaint letter about a defective product to your assistant.",
        agentRole: "You are Secretaria Gómez, the assistant. Type what the student dictates, ask for clarification on formal phrases, and suggest improvements.",
        userGoal: "Dictate a complete formal complaint letter using appropriate opening, body, and closing formulas.",
        targetPhrases: ["Me dirijo a usted...", "Lamentablemente...", "Adjunto encontrará...", "Quedo a la espera de..."],
        successCriteria: ["Uses correct opening formula", "States complaint formally", "Uses appropriate closing", "Maintains formal register throughout"],
      },
    ],
  },
];

// ============================================
// Module 7: Creative Writing & Oratory
// ============================================

const module7Lessons: LanguageLesson[] = [
  {
    id: "es-adv-l19",
    slug: "rhetorical-devices",
    title: "Rhetorical Devices",
    content: `# Rhetorical Devices (Figuras retóricas)

Master the tools of persuasion and eloquence used in speeches, essays, and debates.

## Key Devices

- **La antítesis** — Antithesis: contrasting ideas in parallel structure
  - "Un pequeño paso para el hombre, un gran salto para la humanidad."
- **La anáfora** — Anaphora: repetition at the beginning of successive clauses
  - "Que se levanten los pueblos. Que se levanten las voces. Que se levante la verdad."
- **La paradoja** — Paradox: seemingly contradictory truth
  - "Solo sé que no sé nada."
- **La ironía** — Irony: saying the opposite of what is meant
- **El clímax** — Climax: ascending order of importance
- **La pregunta retórica** — Rhetorical question: question that expects no answer

## In Speeches

- **Apelo a su sentido de justicia.** — I appeal to your sense of justice.
- **No podemos permanecer indiferentes ante...** — We cannot remain indifferent to...
- **Ha llegado el momento de...** — The time has come to...`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m7",
    moduleTitle: "Creative Writing & Oratory",
    order: 19,
    topicId: "es-advanced-rhetorical-devices",
    vocabulary: [
      {
        word: "la antítesis",
        translation: "antithesis",
        pronunciation: "lah ahn-TEE-teh-sees",
        exampleSentence: "El discurso utiliza la antítesis para resaltar el contraste.",
        exampleTranslation: "The speech uses antithesis to highlight the contrast.",
        partOfSpeech: "noun",
      },
      {
        word: "la pregunta retórica",
        translation: "rhetorical question",
        pronunciation: "lah preh-GOON-tah rreh-TOH-ree-kah",
        exampleSentence: "¿Acaso no merecemos un futuro mejor? — es una pregunta retórica.",
        exampleTranslation: "Don't we deserve a better future? — is a rhetorical question.",
        partOfSpeech: "noun phrase",
      },
      {
        word: "apelar a",
        translation: "to appeal to",
        pronunciation: "ah-peh-LAHR ah",
        exampleSentence: "El orador apeló a las emociones del público.",
        exampleTranslation: "The speaker appealed to the audience's emotions.",
        partOfSpeech: "verb",
      },
      {
        word: "el clímax",
        translation: "climax (rhetorical escalation)",
        pronunciation: "ehl KLEE-mahks",
        exampleSentence: "El discurso alcanza su clímax en el párrafo final.",
        exampleTranslation: "The speech reaches its climax in the final paragraph.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Subjunctive in Exhortative Speech",
        explanation: "Speeches and oratory use the subjunctive for exhortation: 'Que + present subjunctive' creates powerful calls to action without an explicit verb of command.",
        examples: [
          { correct: "¡Que se haga justicia!", translation: "Let justice be done!" },
          { correct: "Que nadie diga que no lo intentamos.", translation: "Let no one say we didn't try." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "persuasive-speech",
        title: "Persuasive Speech",
        situation: "You are delivering a short persuasive speech to a community group about an issue you care about.",
        agentRole: "You are the moderator of a community forum. Introduce the student, listen to their speech, and then ask challenging questions.",
        userGoal: "Deliver a 2-minute persuasive speech using at least three rhetorical devices.",
        targetPhrases: ["Ha llegado el momento de...", "¿Acaso no...?", "Que se levanten...", "No podemos permanecer indiferentes"],
        successCriteria: ["Uses anaphora or antithesis", "Includes a rhetorical question", "Builds to a climax", "Persuasive and coherent argument"],
      },
    ],
  },
  {
    id: "es-adv-l20",
    slug: "persuasive-writing",
    title: "Persuasive Writing & Opinion Essays",
    content: `# Persuasive Writing & Opinion Essays

At C1, you must construct well-argued opinion pieces with nuanced language.

## Essay Structure

1. **Tesis** — Thesis: Clear statement of position
2. **Argumentos a favor** — Supporting arguments with evidence
3. **Contraargumentos y refutación** — Counterarguments and rebuttal
4. **Conclusión** — Conclusion reinforcing the thesis

## Expressing Strong Opinions (with nuance)

- **Estoy firmemente convencido/a de que...** — I am firmly convinced that...
- **Resulta innegable que...** — It is undeniable that...
- **Si bien es cierto que..., no es menos cierto que...** — While it is true that..., it is no less true that...
- **Lejos de ser una solución, esto agrava...** — Far from being a solution, this worsens...

## Concession & Rebuttal

- **Admito que... Sin embargo...** — I admit that... However...
- **A pesar de las objeciones...** — Despite the objections...
- **Los detractores podrían argumentar que... No obstante...** — Critics might argue that... Nevertheless...`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m7",
    moduleTitle: "Creative Writing & Oratory",
    order: 20,
    topicId: "es-advanced-persuasive-writing",
    vocabulary: [
      {
        word: "resulta innegable",
        translation: "it is undeniable",
        pronunciation: "rreh-SOOL-tah ee-neh-GAH-bleh",
        exampleSentence: "Resulta innegable que el cambio climático es una amenaza real.",
        exampleTranslation: "It is undeniable that climate change is a real threat.",
        partOfSpeech: "phrase",
      },
      {
        word: "si bien es cierto que",
        translation: "while it is true that",
        pronunciation: "see byehn ehs THYEHR-toh keh",
        exampleSentence: "Si bien es cierto que hay avances, queda mucho por hacer.",
        exampleTranslation: "While it is true there is progress, much remains to be done.",
        partOfSpeech: "conjunction phrase",
      },
      {
        word: "los detractores",
        translation: "the critics / detractors",
        pronunciation: "lohs deh-trahk-TOH-rehs",
        exampleSentence: "Los detractores señalan la falta de evidencia empírica.",
        exampleTranslation: "The critics point to the lack of empirical evidence.",
        partOfSpeech: "noun",
      },
      {
        word: "refutar",
        translation: "to refute / to rebut",
        pronunciation: "rreh-foo-TAHR",
        exampleSentence: "Es fácil refutar ese argumento con datos recientes.",
        exampleTranslation: "It is easy to refute that argument with recent data.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Concessive Structures",
        explanation: "Advanced argumentation requires conceding points before rebutting them. Key patterns: 'Si bien...', 'Aun cuando...', 'Por más que...', 'A pesar de que...' — all followed by subjunctive when the concession is hypothetical.",
        examples: [
          { correct: "Aun cuando los resultados sean prometedores, se necesitan más estudios.", translation: "Even though the results may be promising, more studies are needed." },
          { correct: "Por más que se esfuercen, no lograrán silenciar la verdad.", translation: "No matter how hard they try, they won't manage to silence the truth." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "debate-stance",
        title: "Taking a Stance in a Debate",
        situation: "A formal debate on whether technology improves or hinders education.",
        agentRole: "You are the opposing debater, Licenciado Herrera. Present counterarguments to the student's position and challenge their evidence.",
        userGoal: "Argue your position, concede valid opposing points, and rebut counterarguments.",
        targetPhrases: ["Resulta innegable que...", "Si bien es cierto que...", "Los detractores podrían argumentar...", "Lejos de ser..."],
        successCriteria: ["States thesis clearly", "Provides supporting arguments", "Concedes and rebuts", "Uses advanced connectors"],
      },
    ],
  },
  {
    id: "es-adv-l21",
    slug: "stylistic-grammar",
    title: "Stylistic Grammar & Elegant Prose",
    content: `# Stylistic Grammar & Elegant Prose

Beyond correctness lies style. These advanced grammatical choices elevate your writing from competent to elegant.

## Fronting for Emphasis

- Normal: "El problema es grave." → Fronted: "Grave es el problema que enfrentamos."
- Normal: "Nunca lo esperaba." → Fronted: "Jamás, en toda mi vida, lo habría esperado."

## Absolute Constructions

- **Dicho esto, pasemos al siguiente punto.** — That said, let's move to the next point.
- **Terminada la reunión, todos se marcharon.** — The meeting over, everyone left.
- **Vista la situación, no hay alternativa.** — Given the situation, there is no alternative.

## Elegant Alternatives

| Common | Elegant |
|--------|---------|
| porque | dado que, puesto que, habida cuenta de que |
| pero | no obstante, ahora bien, si bien |
| también | asimismo, de igual modo, por añadidura |
| por eso | de ahí que (+ subjunctive), por consiguiente |`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m7",
    moduleTitle: "Creative Writing & Oratory",
    order: 21,
    topicId: "es-advanced-stylistic-grammar",
    vocabulary: [
      {
        word: "habida cuenta de que",
        translation: "given that / taking into account that",
        pronunciation: "ah-BEE-dah KWEHN-tah deh keh",
        exampleSentence: "Habida cuenta de que los recursos son limitados, debemos priorizar.",
        exampleTranslation: "Given that resources are limited, we must prioritize.",
        partOfSpeech: "conjunction phrase",
      },
      {
        word: "de ahí que",
        translation: "hence / that is why (+ subjunctive)",
        pronunciation: "deh ah-EE keh",
        exampleSentence: "Los datos son insuficientes; de ahí que se requiera más investigación.",
        exampleTranslation: "The data are insufficient; hence more research is required.",
        partOfSpeech: "conjunction",
      },
      {
        word: "por añadidura",
        translation: "moreover / in addition",
        pronunciation: "pohr ah-nyah-dee-DOO-rah",
        exampleSentence: "Es eficaz y, por añadidura, económico.",
        exampleTranslation: "It is effective and, moreover, economical.",
        partOfSpeech: "adverb phrase",
      },
      {
        word: "ahora bien",
        translation: "now then / however (transitional)",
        pronunciation: "ah-OH-rah byehn",
        exampleSentence: "La propuesta es interesante. Ahora bien, ¿es viable?",
        exampleTranslation: "The proposal is interesting. Now then, is it viable?",
        partOfSpeech: "connector",
      },
    ],
    grammarPoints: [
      {
        title: "Absolute Participial Clauses",
        explanation: "Absolute constructions use a past participle with its own subject, set off by commas. They compress what would otherwise be a full temporal or causal clause into an elegant, compact phrase.",
        examples: [
          { correct: "Terminado el plazo, se cerrarán las inscripciones.", translation: "Once the deadline is over, registration will close.", note: "The participle agrees with its subject: 'terminado' (masc. sing.) agrees with 'el plazo'" },
          { correct: "Hechas las presentaciones, comenzó la negociación.", translation: "Introductions made, the negotiation began." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "elegant-monologue",
        title: "The Elegant Monologue",
        situation: "You are recording a podcast episode on a topic of your choice, aiming for eloquent, polished prose.",
        agentRole: "You are the podcast producer, Elena. Listen to the student's monologue, suggest more elegant phrasing where possible, and compliment effective stylistic choices.",
        userGoal: "Deliver a 2-minute polished monologue using fronting, absolute constructions, and elegant connectors.",
        targetPhrases: ["Dicho esto...", "de ahí que...", "habida cuenta de que...", "por añadidura"],
        successCriteria: ["Uses at least one absolute construction", "Uses elegant connectors instead of common ones", "Employs fronting for emphasis", "Maintains coherent, flowing prose"],
      },
    ],
  },
];

// ============================================
// Module 8: Native-Level Fluency
// ============================================

const module8Lessons: LanguageLesson[] = [
  {
    id: "es-adv-l22",
    slug: "proverbs-refranes",
    title: "Proverbs & Refranes",
    content: `# Proverbs & Refranes

Spanish proverbs (refranes) are windows into cultural wisdom. Using them naturally marks native-level competence.

## Essential Refranes

- **Más vale tarde que nunca.** — Better late than never.
- **En boca cerrada no entran moscas.** — Silence is golden. (Lit: Flies don't enter a closed mouth.)
- **No hay mal que por bien no venga.** — Every cloud has a silver lining.
- **A caballo regalado no le mires el diente.** — Don't look a gift horse in the mouth.
- **El que mucho abarca, poco aprieta.** — Jack of all trades, master of none.
- **Dime con quién andas y te diré quién eres.** — Tell me who your friends are and I'll tell you who you are.
- **Más sabe el diablo por viejo que por diablo.** — Experience is the best teacher. (Lit: The devil knows more from being old than from being the devil.)
- **A quien madruga, Dios le ayuda.** — The early bird catches the worm.

## Using Refranes Naturally

Refranes work best when dropped into conversation as a conclusion or piece of advice, not as a lesson. Overusing them sounds stilted; the key is timing.`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m8",
    moduleTitle: "Native-Level Fluency",
    order: 22,
    topicId: "es-advanced-proverbs-refranes",
    vocabulary: [
      {
        word: "el refrán",
        translation: "proverb / saying",
        pronunciation: "ehl rreh-FRAHN",
        exampleSentence: "Como dice el refrán: más vale prevenir que curar.",
        exampleTranslation: "As the saying goes: prevention is better than cure.",
        partOfSpeech: "noun",
      },
      {
        word: "más vale",
        translation: "it is better / it's worth more",
        pronunciation: "mahss BAH-leh",
        exampleSentence: "Más vale pájaro en mano que ciento volando.",
        exampleTranslation: "A bird in the hand is worth two in the bush.",
        partOfSpeech: "phrase",
      },
      {
        word: "no hay mal que por bien no venga",
        translation: "every cloud has a silver lining",
        pronunciation: "noh eye mahl keh pohr byehn noh BEHN-gah",
        exampleSentence: "Perdí el trabajo pero encontré uno mejor. No hay mal que por bien no venga.",
        exampleTranslation: "I lost my job but found a better one. Every cloud has a silver lining.",
        partOfSpeech: "proverb",
      },
      {
        word: "el que mucho abarca, poco aprieta",
        translation: "jack of all trades, master of none",
        pronunciation: "ehl keh MOO-choh ah-BAHR-kah POH-koh ah-PRYEH-tah",
        exampleSentence: "Intenta hacer todo a la vez. Ya sabes, el que mucho abarca, poco aprieta.",
        exampleTranslation: "He tries to do everything at once. You know, jack of all trades, master of none.",
        partOfSpeech: "proverb",
      },
    ],
    grammarPoints: [
      {
        title: "Archaic Grammar Preserved in Proverbs",
        explanation: "Many refranes preserve archaic subjunctive forms and syntax. 'No hay mal que por bien no venga' uses a relative clause with subjunctive that modern grammar would structure differently. Recognizing these fossilized forms is part of understanding proverbs.",
        examples: [
          { correct: "A quien madruga, Dios le ayuda.", translation: "God helps those who rise early.", note: "'A quien' = 'al que' in modern usage; the structure is preserved for rhythm" },
          { correct: "Donde fueres, haz lo que vieres.", translation: "When in Rome, do as the Romans do.", note: "Uses future subjunctive (fueres, vieres) — extinct in modern speech but alive in proverbs" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "advice-with-proverbs",
        title: "Giving Advice with Refranes",
        situation: "A friend is telling you about various life problems. Respond with appropriate proverbs.",
        agentRole: "You are Abuela Rosa, a wise grandmother. Present various life dilemmas and see if the student can respond with an appropriate refrán.",
        userGoal: "Use at least five different refranes naturally in conversation as advice or commentary.",
        targetPhrases: ["Más vale...", "No hay mal que...", "Como dice el refrán...", "Dime con quién andas..."],
        successCriteria: ["Uses proverbs naturally, not forced", "Matches proverb to situation", "Uses at least 5 different refranes"],
      },
    ],
    culturalNotes: [
      {
        title: "Refranes as Cultural DNA",
        content: "Spanish proverbs often reflect Catholic morality ('A Dios rogando y con el mazo dando' — Pray to God but keep hammering), rural life ('En abril, aguas mil' — April showers), and communal values. They are oral tradition passed through generations. Knowing them connects you to centuries of Hispanic culture.",
      },
    ],
  },
  {
    id: "es-adv-l23",
    slug: "cultural-references",
    title: "Cultural References & Shared Knowledge",
    content: `# Cultural References & Shared Knowledge

Native fluency means understanding the cultural references that pepper everyday conversation.

## Historical & Political References

- **La Transición** — Spain's transition from dictatorship to democracy (1975-1982)
- **El Boom latinoamericano** — The Latin American literary boom (1960s-70s)
- **La Movida Madrileña** — Madrid's countercultural movement (1980s)

## Pop Culture Touchstones

- **El Chavo del Ocho** — Iconic Mexican sitcom known across all Latin America
- **Mafalda** — Argentine comic strip character, symbol of social critique
- **Almodóvar** — Spain's most famous film director

## Expressions from Shared Culture

- **Eso es bátman** — That's obvious (from Dominican slang, now widespread)
- **Hacer borrón y cuenta nueva** — To wipe the slate clean
- **Estar en el ajo** — To be in on it / in the know
- **Ser pan comido** — To be a piece of cake

## Catholic & Religious Expressions (secularized)

- **¡Dios mío!** — My God! (general exclamation)
- **Ir de Guatemala a Guatepeor** — To go from bad to worse (wordplay: mala → peor)
- **Estar en capilla** — To be on edge / waiting anxiously (lit: to be in the chapel)`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m8",
    moduleTitle: "Native-Level Fluency",
    order: 23,
    topicId: "es-advanced-cultural-references",
    vocabulary: [
      {
        word: "La Transición",
        translation: "The Transition (Spain's shift to democracy)",
        pronunciation: "lah trahn-see-THYOHN",
        exampleSentence: "La Transición es un periodo clave para entender la España actual.",
        exampleTranslation: "The Transition is a key period for understanding modern Spain.",
        partOfSpeech: "proper noun",
      },
      {
        word: "hacer borrón y cuenta nueva",
        translation: "to wipe the slate clean / start fresh",
        pronunciation: "ah-THEHR boh-RROHN ee KWEHN-tah NWEH-vah",
        exampleSentence: "Después de la crisis, hicieron borrón y cuenta nueva.",
        exampleTranslation: "After the crisis, they wiped the slate clean.",
        partOfSpeech: "idiom",
      },
      {
        word: "estar en el ajo",
        translation: "to be in the know / in on it",
        pronunciation: "ehs-TAHR ehn ehl AH-hoh",
        exampleSentence: "No te hagas el inocente, tú estabas en el ajo.",
        exampleTranslation: "Don't play innocent, you were in on it.",
        partOfSpeech: "idiom",
      },
      {
        word: "ser pan comido",
        translation: "to be a piece of cake",
        pronunciation: "sehr pahn koh-MEE-doh",
        exampleSentence: "Ese examen fue pan comido.",
        exampleTranslation: "That exam was a piece of cake.",
        partOfSpeech: "idiom",
      },
    ],
    grammarPoints: [
      {
        title: "Wordplay & Double Meaning in Expressions",
        explanation: "Many Spanish cultural expressions rely on wordplay. Understanding them requires recognizing the double meaning: 'De Guatemala a Guatepeor' splits 'Guatemala' into 'guate-mala' (bad) and replaces it with 'guate-peor' (worse). This playfulness is central to Hispanic humor.",
        examples: [
          { correct: "Fue de Guatemala a Guatepeor.", translation: "It went from bad to worse.", note: "Guatemala → mala (bad), Guatepeor → peor (worse)" },
          { correct: "No tiene ni pies ni cabeza.", translation: "It makes no sense. (Lit: It has neither feet nor head.)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "cultural-quiz",
        title: "Cultural References Quiz",
        situation: "A trivia night at a Spanish cultural center — questions about shared Hispanic cultural knowledge.",
        agentRole: "You are the quizmaster, Javier. Ask questions about Spanish and Latin American culture, history, and expressions. React enthusiastically to correct answers.",
        userGoal: "Demonstrate knowledge of cultural references, explain their significance, and use related expressions.",
        targetPhrases: ["La Transición", "El Boom", "ser pan comido", "hacer borrón y cuenta nueva"],
        successCriteria: ["Identifies cultural references", "Explains significance or context", "Uses cultural expressions naturally"],
      },
    ],
  },
  {
    id: "es-adv-l24",
    slug: "register-mastery",
    title: "Register Mastery & Code-Switching",
    content: `# Register Mastery & Code-Switching

The final marker of C1 proficiency: moving fluidly between registers — vulgar, colloquial, neutral, formal, literary — depending on context.

## The Five Registers

1. **Vulgar/taboo**: profanity, sexual slang (recognize, rarely produce)
2. **Colloquial**: tío, mola, ¡qué fuerte!, pues nada
3. **Neutral/standard**: everyday correct Spanish
4. **Formal**: usted, subjunctive, academic vocabulary
5. **Literary/archaic**: "vuestra merced", absolutive constructions, future subjunctive

## Mastery Indicators

- **Knowing what NOT to say**: Using 'coger' (to take/grab) in Spain is neutral; in Argentina/Mexico it's vulgar
- **Adjusting to your interlocutor**: matching their register within 2-3 exchanges
- **Humor across registers**: telling the same joke formally and colloquially
- **Detecting register violations**: recognizing when someone's register doesn't match the situation

## The Code-Switching Challenge

True fluency means switching registers mid-conversation when the social context shifts — a skill that takes years of immersion or deliberate practice.`,
    targetLanguage: "es",
    proficiencyLevel: "C1",
    moduleId: "es-adv-m8",
    moduleTitle: "Native-Level Fluency",
    order: 24,
    topicId: "es-advanced-register-mastery",
    vocabulary: [
      {
        word: "el registro lingüístico",
        translation: "linguistic register",
        pronunciation: "ehl rreh-HEES-troh leen-GWEES-tee-koh",
        exampleSentence: "Dominar varios registros lingüísticos es clave para la fluidez.",
        exampleTranslation: "Mastering various linguistic registers is key to fluency.",
        partOfSpeech: "noun phrase",
      },
      {
        word: "el interlocutor",
        translation: "the interlocutor / conversation partner",
        pronunciation: "ehl een-tehr-loh-koo-TOHR",
        exampleSentence: "Adapta tu registro al interlocutor.",
        exampleTranslation: "Adapt your register to your conversation partner.",
        partOfSpeech: "noun",
      },
      {
        word: "pues nada",
        translation: "well, anyway / so yeah (filler, colloquial)",
        pronunciation: "pwehs NAH-dah",
        exampleSentence: "Pues nada, eso es lo que pasó.",
        exampleTranslation: "Well, anyway, that's what happened.",
        partOfSpeech: "filler phrase",
      },
      {
        word: "¡qué fuerte!",
        translation: "wow! / that's wild! (colloquial exclamation)",
        pronunciation: "keh FWEHR-teh",
        exampleSentence: "¿En serio dijo eso? ¡Qué fuerte!",
        exampleTranslation: "He really said that? That's wild!",
        partOfSpeech: "exclamation",
      },
      {
        word: "adecuar el tono",
        translation: "to adjust one's tone",
        pronunciation: "ah-deh-KWAHR ehl TOH-noh",
        exampleSentence: "Es importante adecuar el tono a cada situación comunicativa.",
        exampleTranslation: "It's important to adjust your tone to each communicative situation.",
        partOfSpeech: "verb phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Register-Dependent Grammar Choices",
        explanation: "Grammar itself changes with register. Colloquial Spanish drops 's' sounds, uses 'queísmo' (que instead of de que), and simplifies tenses. Formal Spanish prefers subjunctive, passive voice, and complete clauses. Recognizing and producing both is the C1 standard.",
        examples: [
          { correct: "Colloquial: 'Tío, ¿tú crees que va a venir o qué?'", translation: "Dude, do you think he's gonna come or what?", note: "Simplified, direct, filler words" },
          { correct: "Formal: 'Estimado colega, ¿considera usted probable que asista a la reunión?'", translation: "Dear colleague, do you consider it likely that he will attend the meeting?", note: "Subjunctive, usted, full clauses" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "register-gauntlet",
        title: "The Register Gauntlet",
        situation: "You must navigate four rapid-fire social situations, each requiring a different register: chatting with friends, speaking to a professor, negotiating with a vendor, and giving a formal toast.",
        agentRole: "You are four different characters in sequence: (1) your buddy Paco, (2) Catedrático López, (3) a street vendor, (4) a wedding MC introducing the toast. Signal each transition clearly.",
        userGoal: "Switch registers appropriately for each of the four social contexts without mixing them.",
        targetPhrases: ["tío/mola", "estimado profesor", "¿cuánto me deja...?", "Quisiera proponer un brindis..."],
        successCriteria: ["Matches colloquial register with friends", "Matches formal register with professor", "Matches transactional register with vendor", "Matches ceremonial register for toast", "Transitions are smooth and natural"],
      },
    ],
    culturalNotes: [
      {
        title: "The 'Coger' Divide",
        content: "In Spain, 'coger' simply means 'to take' or 'to grab' — 'coger el autobús' (catch the bus) is entirely neutral. In most of Latin America, especially Mexico and Argentina, 'coger' is a vulgar term for sexual intercourse. This is perhaps the most famous register trap for Spanish learners. Spaniards in Latin America quickly learn to say 'tomar el autobús' instead.",
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  {
    id: "es-adv-m1",
    title: "Module 1: Advanced Subjunctive",
    description: "Pluperfect subjunctive, como si constructions, and complex hypotheticals",
    order: 1,
    lessons: module1Lessons,
  },
  {
    id: "es-adv-m2",
    title: "Module 2: Idiomatic & Colloquial Spanish",
    description: "Idioms, slang, register shifting, and affective suffixes",
    order: 2,
    lessons: module2Lessons,
  },
  {
    id: "es-adv-m3",
    title: "Module 3: Academic Spanish",
    description: "Formal writing, nominalizations, and thesis defense vocabulary",
    order: 3,
    lessons: module3Lessons,
  },
  {
    id: "es-adv-m4",
    title: "Module 4: Literature & Literary Analysis",
    description: "Cervantes, García Márquez, Neruda, and literary analysis",
    order: 4,
    lessons: module4Lessons,
  },
  {
    id: "es-adv-m5",
    title: "Module 5: Spanish Dialectology",
    description: "Voseo, seseo/ceceo/distinción, and regional vocabulary",
    order: 5,
    lessons: module5Lessons,
  },
  {
    id: "es-adv-m6",
    title: "Module 6: Business & Legal Spanish",
    description: "Negotiations, contracts, and formal correspondence",
    order: 6,
    lessons: module6Lessons,
  },
  {
    id: "es-adv-m7",
    title: "Module 7: Creative Writing & Oratory",
    description: "Rhetorical devices, persuasive writing, and stylistic grammar",
    order: 7,
    lessons: module7Lessons,
  },
  {
    id: "es-adv-m8",
    title: "Module 8: Native-Level Fluency",
    description: "Proverbs, cultural references, and register mastery",
    order: 8,
    lessons: module8Lessons,
  },
];

export const spanishAdvancedCourse: LanguageCourse = {
  ...courseInfo,
  modules,
};

// Helper function to get all lessons
export function getSpanishAdvancedLessons() {
  return modules.flatMap((m) => m.lessons);
}

// Helper function to find a lesson by slug
export function findSpanishAdvancedLesson(slug: string) {
  return getSpanishAdvancedLessons().find((l) => l.slug === slug);
}
