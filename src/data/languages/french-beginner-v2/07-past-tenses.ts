import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────
// MODULE 7: Looking Back — The Past (4 lessons)
// The most conceptually demanding module. English speakers
// struggle most with the imparfait vs passé composé distinction.
// We build up carefully: avoir auxiliary → être auxiliary →
// imparfait alone → then the critical contrast.
// ─────────────────────────────────────────────────────────

export const pastTensesLessons: LanguageLesson[] = [
  {
    id: "fr-l22",
    slug: "passe-compose-avoir",
    title: "Passé Composé with Avoir — The Main Past Tense",
    content: `# Passé Composé with Avoir — I Did, I Have Done

The **passé composé** is the primary past tense in spoken and written French for completed actions. It's composed of two parts: the auxiliary verb + the past participle. Most verbs use **avoir** as the auxiliary.

\`\`\`concept
{ "title": "Passé Composé = Auxiliary + Past Participle", "variant": "info", "content": "Structure: AVOIR (present tense) + PAST PARTICIPLE\\n\\n• J'ai mangé. (I ate / I have eaten.)\\n• Tu as travaillé. (You worked.)\\n• Il a fini. (He finished.)\\n• Nous avons pris le train. (We took the train.)\\n• Vous avez vu le film ? (Did you see the film?)\\n• Ils ont fait du sport. (They did sport.)\\n\\nThe auxiliary AVOIR conjugates; the past participle stays fixed (for avoir verbs)." }
\`\`\`

## Forming Past Participles

| Infinitive ending | Past participle ending | Example |
|------------------|----------------------|---------|
| **-er** | **-é** | parler → parlé, manger → mangé |
| **-ir** (regular) | **-i** | finir → fini, choisir → choisi |
| **-re** (regular) | **-u** | attendre → attendu, vendre → vendu |

## Irregular Past Participles — Learn These by Heart

| Infinitive | Past participle | Example |
|------------|----------------|---------|
| avoir | **eu** | J'ai eu. (I had.) |
| être | **été** | J'ai été. (I was / I have been.) |
| faire | **fait** | Il a fait. (He did/made.) |
| prendre | **pris** | Tu as pris. (You took.) |
| voir | **vu** | Nous avons vu. (We saw.) |
| boire | **bu** | Elle a bu. (She drank.) |
| lire | **lu** | J'ai lu. (I read.) |
| écrire | **écrit** | Il a écrit. (He wrote.) |
| vouloir | **voulu** | Tu as voulu. (You wanted.) |
| pouvoir | **pu** | Vous avez pu. (You were able to.) |
| savoir | **su** | J'ai su. (I knew/found out.) |
| mettre | **mis** | Elle a mis. (She put.) |
| dire | **dit** | Il a dit. (He said.) |

## Negation in Passé Composé

Ne...pas wraps around the AUXILIARY (avoir), not the past participle:

| Affirmative | Negative |
|-------------|----------|
| J'ai mangé. | Je **n'**ai **pas** mangé. |
| Il a vu le film. | Il **n'**a **pas** vu le film. |
| Nous avons fini. | Nous **n'**avons **pas** fini. |

\`\`\`concept
{ "title": "Passé Composé Covers Multiple English Past Forms", "variant": "analogy", "content": "The French passé composé covers three English past tenses in ONE form:\\n\\n• 'J'ai mangé' = I ate (simple past)\\n• 'J'ai mangé' = I have eaten (present perfect)\\n• 'J'ai mangé' = I did eat (emphatic past)\\n\\nFrench doesn't distinguish between these — context makes the meaning clear. This actually makes passé composé EASIER to use than English, despite looking more complex." }
\`\`\`

\`\`\`quiz
{ "question": "What is the passé composé of 'faire' (to do/make) for 'nous'?", "options": ["Nous avons faisé.", "Nous avons fait.", "Nous sommes faits.", "Nous faisions."], "answer": 1, "explanation": "'Faire' uses avoir as auxiliary. Past participle of faire = 'fait' (irregular). So: nous avons FAIT. 'Faisé' doesn't exist — faire is irregular. 'Sommes faits' would use être, which faire doesn't (except in passive voice). 'Faisions' is the imparfait, not passé composé." }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'She didn't drink any wine last night'?", "options": ["Elle n'a pas bu du vin hier soir.", "Elle a pas bu du vin hier soir.", "Elle n'a pas bu de vin hier soir.", "Elle n'a bu pas de vin hier soir."], "answer": 2, "explanation": "Two rules apply: (1) Negation in passé composé = ne + auxiliary + pas: 'elle N'a PAS bu'. (2) After negation, partitive 'du' becomes 'de': 'pas DE vin' (not 'du vin'). So: 'Elle n'a pas bu DE vin hier soir.'" }
\`\`\`

\`\`\`takeaways
{ "points": ["Passé composé = avoir (present) + past participle — the main past tense for completed actions", "-er verbs → -é (parlé), -ir verbs → -i (fini), -re verbs → -u (vendu)", "Key irregulars to memorise: fait, pris, vu, bu, lu, écrit, dit, mis, eu, été", "Negation: ne wraps around AVOIR → je n'ai PAS mangé (not the participle)", "Passé composé covers English simple past (ate), present perfect (have eaten), and emphatic past (did eat)"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m7",
    moduleTitle: "Looking Back",
    order: 1,
    topicId: "fr-m7-l22-passe-compose-avoir",
    vocabulary: [
      { word: "hier", translation: "yesterday", pronunciation: "ee-EHR", exampleSentence: "Hier, j'ai mangé dans un bon restaurant.", exampleTranslation: "Yesterday, I ate in a good restaurant.", partOfSpeech: "adverb" },
      { word: "j'ai vu", translation: "I saw / I have seen", pronunciation: "zhay VÜ", exampleSentence: "J'ai vu un film fantastique.", exampleTranslation: "I saw a fantastic film.", partOfSpeech: "verb (passé composé)" },
      { word: "nous avons fait", translation: "we did / we made", pronunciation: "noo-zah-VON FEH", exampleSentence: "Nous avons fait une longue promenade.", exampleTranslation: "We went for a long walk.", partOfSpeech: "verb (passé composé)" },
      { word: "il y a + time", translation: "... ago", pronunciation: "eel-ee-AH", exampleSentence: "Je suis arrivé il y a deux jours.", exampleTranslation: "I arrived two days ago.", partOfSpeech: "time expression" },
      { word: "la semaine dernière", translation: "last week", pronunciation: "lah suh-MEHN dehr-NYEHR", exampleSentence: "La semaine dernière, j'ai visité le Musée d'Orsay.", exampleTranslation: "Last week, I visited the Musée d'Orsay.", partOfSpeech: "time expression" },
    ],
    grammarPoints: [
      {
        title: "Time Expressions for the Past",
        explanation: "Past time expressions are placed at the beginning or end of the sentence: **hier** (yesterday), **avant-hier** (day before yesterday), **la semaine dernière** (last week), **le mois dernier** (last month), **l'année dernière** (last year), **il y a + time** (ago: *il y a trois jours* = three days ago), **ce matin** (this morning), **tout à l'heure** (a little while ago).",
        examples: [
          { correct: "Hier matin, j'ai pris le métro.", translation: "Yesterday morning, I took the metro." },
          { correct: "Il y a deux ans, nous avons visité Paris.", translation: "Two years ago, we visited Paris." },
          { correct: "J'ai téléphoné ce matin.", translation: "I phoned this morning." },
        ],
        commonMistakes: [
          { incorrect: "Il y a deux ans, je visitais Paris.", correction: "Il y a deux ans, j'ai visité Paris.", explanation: "'Il y a + time' with a completed action uses PASSÉ COMPOSÉ, not imparfait. 'J'ai visité' = I visited (completed). The imparfait would describe an ongoing background state." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m7-l22-voice",
        title: "Monday Morning at the Office",
        situation: "It's Monday morning and your French colleague asks about your weekend",
        agentRole: "You are Sophie, a friendly colleague. Ask what the student did this weekend, where they went, what they ate, and whether they enjoyed it.",
        userGoal: "Recount your weekend activities using passé composé",
        targetPhrases: ["j'ai fait", "je suis allé(e)", "j'ai mangé", "j'ai vu", "c'était bien"],
        successCriteria: ["Uses passé composé with at least 4 different verbs", "Uses at least one irregular past participle", "Includes a time expression (samedi, dimanche, hier)"],
        hints: ["'Ce weekend, j'ai...' = This weekend, I...", "'C'était super !' = It was great! (imparfait of être — a sneak peek)"],
      },
    ],
    culturalNotes: [
      {
        title: "Le Weekend en France",
        content: "The French weekend typically runs Saturday–Sunday. Saturday morning is for shopping (le marché, le supermarché — many close early Sunday). Sunday is traditionally la journée de repos (rest day) — many shops close, families gather for the long Sunday lunch (le déjeuner du dimanche), which can last 3–4 hours. Paris has more Sunday openings now (especially tourist areas), but in smaller towns, Sunday is genuinely quiet. Monday morning conversation about 'le weekend' (borrowed from English) is a French ritual — 'Tu as passé un bon weekend ?' is the universal Monday greeting.",
        region: "France",
      },
    ],
  },

  {
    id: "fr-l23",
    slug: "passe-compose-etre",
    title: "Passé Composé with Être — DR & MRS VANDERTRAMP",
    content: `# Passé Composé with Être — The 16 Verbs That Use Être

A specific group of verbs uses **être** (not avoir) as their auxiliary in the passé composé. These are almost always verbs of motion or change of state. The mnemonic **DR & MRS VANDERTRAMP** lists them all.

\`\`\`concept
{ "title": "DR & MRS VANDERTRAMP — The 16 Être Verbs", "variant": "info", "content": "Devenir (to become)\\nRevenir (to come back)\\n\\nMonter (to go up)\\nRester (to stay)\\nSortir (to go out)\\n\\nVenir (to come)\\nAller (to go)\\nNaître (to be born)\\nDescendre (to go down)\\nEntrer (to enter)\\nRetourner (to return)\\nTomber (to fall)\\nRentrer (to go home)\\nArriver (to arrive)\\nMourir (to die)\\nPartir (to leave)\\n\\nAlso: all REFLEXIVE verbs use être." }
\`\`\`

## The Key Difference — Past Participle Must Agree

When using **être** as auxiliary, the past participle **agrees in gender and number with the SUBJECT**:

| Subject | Agreement | Example |
|---------|-----------|---------|
| je (male) | base form | Je suis **allé**. |
| je (female) | add -e | Je suis **allée**. |
| nous (mixed/male) | add -s | Nous sommes **allés**. |
| nous (all female) | add -es | Nous sommes **allées**. |
| elle | add -e | Elle est **arrivée**. |
| ils | add -s | Ils sont **partis**. |
| elles | add -es | Elles sont **venues**. |

\`\`\`compare
{ "title": "Avoir vs Être in Passé Composé", "left": { "label": "AVOIR — past participle fixed", "items": ["J'ai mangé. (I ate)", "Elle a mangé. (She ate)", "Ils ont mangé. (They ate)", "→ 'mangé' never changes with avoir"] }, "right": { "label": "ÊTRE — past participle agrees with subject", "items": ["Il est allé. (He went)", "Elle est allée. (She went — add -e)", "Ils sont allés. (They went — add -s)", "Elles sont allées. (They went, all-f — add -es)"] } }
\`\`\`

## Reflexive Verbs — Always Use Être

All reflexive verbs (se lever, se laver, se coucher, etc.) use **être** in the passé composé. The past participle agrees with the subject:

- Je **me** suis levé(e). (I got up.)
- Elle **s'**est levée. (She got up. — add -e for feminine)
- Nous **nous** sommes levé(e)s. (We got up. — add -s)

\`\`\`concept
{ "title": "Why These Verbs Use Être", "variant": "analogy", "content": "The verbs that use être in passé composé are mostly verbs of MOTION and CHANGE OF STATE — things that move a person from one place or state to another: arriving, leaving, going, coming, entering, exiting, being born, dying, falling, staying.\\n\\nThink of it this way: if the verb describes a journey or transformation of the PERSON, it likely uses être. If the verb describes an action the person performs on something/someone else, it uses avoir.\\n\\nEasy test: does the verb have a direct object? If yes, avoir. If no (just subject + intransitive verb), probably être." }
\`\`\`

\`\`\`quiz
{ "question": "A female student wants to say 'I came from England'. Which is correct?", "options": ["J'ai venue d'Angleterre.", "Je suis venue d'Angleterre.", "Je suis venu d'Angleterre.", "J'ai venu d'Angleterre."], "answer": 1, "explanation": "'Venir' uses ÊTRE. The speaker is female, so the past participle 'venu' adds -e: 'venue'. Auxiliary is 'suis' (je suis). Full answer: 'Je suis VENUE d'Angleterre.' 'J'ai venue' is wrong (venir doesn't use avoir). 'Je suis venu' is masculine form." }
\`\`\`

\`\`\`takeaways
{ "points": ["16 verbs + all reflexives use ÊTRE (not avoir) in passé composé", "Mnemonic: DR & MRS VANDERTRAMP — Devenir, Revenir, Monter, Rester, Sortir, Venir, Aller, Naître, Descendre, Entrer, Retourner, Tomber, Rentrer, Arriver, Mourir, Partir", "With être: past participle agrees with subject — add -e (fem), -s (masc pl), -es (fem pl)", "Reflexive verbs (se lever, se laver) ALWAYS use être", "Quick test: does the verb have a direct object? If yes → avoir. If intransitive → probably être"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m7",
    moduleTitle: "Looking Back",
    order: 2,
    topicId: "fr-m7-l23-passe-compose-etre",
    vocabulary: [
      { word: "je suis allé(e)", translation: "I went (masc/fem)", pronunciation: "zhuh swee zah-LAY", exampleSentence: "Je suis allée au marché ce matin.", exampleTranslation: "I went to the market this morning. (speaker is female)", partOfSpeech: "verb (passé composé)" },
      { word: "elle est arrivée", translation: "she arrived", pronunciation: "ehl eh tah-ree-VAY", exampleSentence: "Elle est arrivée en retard.", exampleTranslation: "She arrived late.", partOfSpeech: "verb (passé composé)" },
      { word: "ils sont partis", translation: "they left (masc/mixed)", pronunciation: "eel son par-TEE", exampleSentence: "Ils sont partis à l'aube.", exampleTranslation: "They left at dawn.", partOfSpeech: "verb (passé composé)" },
      { word: "je me suis levé(e)", translation: "I got up", pronunciation: "zhuh muh swee luh-VAY", exampleSentence: "Je me suis levée à six heures.", exampleTranslation: "I got up at six o'clock. (speaker is female)", partOfSpeech: "verb (passé composé, reflexive)" },
      { word: "naître / né(e)", translation: "to be born / born", pronunciation: "NEH-truh / NAY", exampleSentence: "Je suis né à Londres.", exampleTranslation: "I was born in London.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Monter, Descendre, Sortir — Can Be Both Avoir and Être",
        explanation: "Some verbs on the DR & MRS VANDERTRAMP list can also take a direct object, in which case they use **avoir** (and the meaning changes slightly). **Monter les bagages** (to bring up the luggage — avoir, transitive) vs **Il est monté** (He went up — être, intransitive). Same for descendre, sortir, rentrer, retourner, passer.",
        examples: [
          { correct: "Elle est montée. (être — she went up, no object)", translation: "She went up." },
          { correct: "Elle a monté les valises. (avoir — she carried the suitcases up, direct object)", translation: "She brought the suitcases up." },
          { correct: "Il est sorti. (être — he went out)", translation: "He went out." },
          { correct: "Il a sorti le chien. (avoir — he took the dog out)", translation: "He took the dog out." },
        ],
        commonMistakes: [
          { incorrect: "Elle a montée.", correction: "Elle est montée. (intransitive → être)", explanation: "Without a direct object, 'monter' uses être. The past participle then agrees with the subject." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m7-l23-voice",
        title: "Describing a Trip to Paris",
        situation: "You've just returned from a week in Paris and your French friend wants to hear all about it",
        agentRole: "You are Audrey, excited to hear about the Paris trip. Ask where the student stayed, arrived, went, saw, and what they did each day.",
        userGoal: "Describe your Paris trip using both avoir and être passé composé verbs",
        targetPhrases: ["je suis arrivé(e)", "je suis allé(e)", "j'ai visité", "je suis sorti(e)", "j'ai mangé"],
        successCriteria: ["Uses être correctly with at least 2 movement verbs", "Uses avoir for at least 2 action verbs", "Makes past participle agree with subject gender at least once"],
        hints: ["'Je suis arrivé à Paris par le train' = I arrived in Paris by train", "'Ensuite, je suis allé(e) au Louvre' = Then I went to the Louvre"],
      },
    ],
    culturalNotes: [
      {
        title: "Le Grand Tour — Travel as Education",
        content: "The tradition of young Europeans travelling to France as part of their education goes back to the 17th-18th century 'Grand Tour'. France — and Paris especially — was considered essential cultural preparation for educated people. Today, France remains the world's most visited country (90 million tourists annually). French culture exports itself globally through cinema (le cinéma), fashion (la mode), gastronomy (la gastronomie), and wine (le vin). Understanding this cultural pride helps decode why the French take language seriously — it's the medium of their cultural heritage.",
        region: "France",
      },
    ],
  },

  {
    id: "fr-l24",
    slug: "imparfait",
    title: "L'Imparfait — Setting the Scene in the Past",
    content: `# L'Imparfait — The Other Past Tense

French has two main past tenses: the passé composé (completed actions) and the **imparfait** (ongoing states, habitual actions, background descriptions). Mastering both and knowing which to use is the hallmark of intermediate French.

\`\`\`concept
{ "title": "What the Imparfait Expresses", "variant": "info", "content": "The imparfait is used for:\\n\\n1. ONGOING STATES in the past: 'Il faisait beau.' (The weather was nice.)\\n2. HABITUAL/REPEATED actions in the past: 'Quand j'étais petit, je mangeais des crêpes tous les dimanches.' (When I was small, I used to eat crêpes every Sunday.)\\n3. BACKGROUND DESCRIPTION: 'Il pleuvait. Les rues étaient mouillées.' (It was raining. The streets were wet.)\\n4. INTERRUPTED action (interrupted BY passé composé): 'Je dormais quand le téléphone a sonné.' (I was sleeping when the phone rang.)\\n5. AGE, TIME, WEATHER in past narratives: 'Il avait 20 ans. Il était neuf heures du soir.'" }
\`\`\`

## Forming the Imparfait

Take the **nous present tense form**, drop **-ons**, add imparfait endings:

| Ending | Example (parler — nous parlons → parl-) |
|--------|------------------------------------------|
| je **-ais** | je parlais |
| tu **-ais** | tu parlais |
| il/elle **-ait** | il parlait |
| nous **-ions** | nous parlions |
| vous **-iez** | vous parliez |
| ils/elles **-aient** | ils parlaient |

**The only irregular stem:** être → **ét-** (not the nous form!)
- j'étais, tu étais, il était, nous étions, vous étiez, ils étaient

\`\`\`concept
{ "title": "The Pronunciation Shortcut", "variant": "analogy", "content": "In spoken French, 4 of the 6 imparfait endings sound IDENTICAL:\\n\\n• -ais (je), -ais (tu), -ait (il), -aient (ils) — all sound like 'EH'\\n\\nSo 'je parlais', 'tu parlais', 'il parlait', 'ils parlaient' all sound like 'parl-EH'. Only nous (-ions, 'YOHN') and vous (-iez, 'YAY') sound different.\\n\\nThis makes the imparfait actually easier to pronounce than to spell." }
\`\`\`

## Common Imparfait Expressions

| French | English |
|--------|---------|
| **quand j'étais petit(e)** | when I was young/small |
| **avant** | before / previously |
| **autrefois / jadis** | in the old days / once upon a time |
| **tous les jours / tous les soirs** | every day / every evening |
| **chaque semaine** | every week |
| **souvent / parfois** | often / sometimes |
| **habituellement** | usually / habitually |
| **à l'époque** | at the time / in those days |
| **pendant que** | while |
| **quand** (+ imparfait for background) | when (background state) |

\`\`\`quiz
{ "question": "Which sentence uses the imparfait correctly for a childhood habit?", "options": ["Quand j'étais enfant, j'ai joué au football tous les jours.", "Quand j'étais enfant, je jouais au football tous les jours.", "Quand j'ai été enfant, je jouais au football tous les jours.", "Quand j'étais enfant, j'ai joué au football."], "answer": 1, "explanation": "Habitual past actions use IMPARFAIT: 'je jouais' (I used to play/I was playing regularly). 'Tous les jours' (every day) signals habit → imparfait. Also note: 'quand j'étais enfant' is correct — 'étais' is imparfait of être for a past state." }
\`\`\`

\`\`\`takeaways
{ "points": ["Imparfait stem = nous present minus -ons; endings: -ais/-ais/-ait/-ions/-iez/-aient", "Only irregular stem: être → ét- (j'étais, tu étais, etc.)", "Use imparfait for: ongoing past states, habitual/repeated past actions, background description", "Trigger words: quand j'étais..., autrefois, tous les jours, souvent, pendant que, à l'époque", "4 of 6 forms sound like 'EH' — easier to pronounce than to spell"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m7",
    moduleTitle: "Looking Back",
    order: 3,
    topicId: "fr-m7-l24-imparfait",
    vocabulary: [
      { word: "quand j'étais petit(e)", translation: "when I was young / as a child", pronunciation: "kahn zheh-TEH puh-TEE", exampleSentence: "Quand j'étais petit, j'habitais à la campagne.", exampleTranslation: "When I was young, I lived in the countryside.", partOfSpeech: "phrase" },
      { word: "autrefois", translation: "in the old days / once upon a time", pronunciation: "oh-truh-FWAH", exampleSentence: "Autrefois, les gens n'avaient pas de téléphone.", exampleTranslation: "In the old days, people didn't have phones.", partOfSpeech: "adverb" },
      { word: "il faisait beau", translation: "the weather was nice", pronunciation: "eel fuh-ZEH BOH", exampleSentence: "Il faisait beau et nous étions contents.", exampleTranslation: "The weather was nice and we were happy.", partOfSpeech: "phrase (imparfait)" },
      { word: "pendant que", translation: "while / whilst", pronunciation: "pahn-DAHN kuh", exampleSentence: "Pendant que je dormais, il a plu.", exampleTranslation: "While I was sleeping, it rained.", partOfSpeech: "conjunction" },
      { word: "chaque", translation: "each / every", pronunciation: "SHAHK", exampleSentence: "Chaque soir, ils regardaient la télévision.", exampleTranslation: "Every evening, they would watch television.", partOfSpeech: "determiner" },
    ],
    grammarPoints: [
      {
        title: "-cer and -ger Verbs in Imparfait",
        explanation: "Verbs ending in -cer (commencer) and -ger (manger) keep their spelling change in all forms EXCEPT nous (-ions) and vous (-iez). Commencer: je commençais, tu commençais, il commençait — but nous commencions (regular!). Manger: je mangeais, tu mangeais, il mangeait — but nous mangions (regular!).",
        examples: [
          { correct: "Je mangeais de la soupe. (je form — add e after g)", translation: "I was eating soup. / I used to eat soup." },
          { correct: "Nous mangions ensemble. (nous form — no e needed, -ions already soft)", translation: "We used to eat together." },
        ],
        commonMistakes: [
          { incorrect: "Il commencait.", correction: "Il commençait.", explanation: "The cedilla on commençait is needed in je/tu/il/ils forms to keep the C soft before 'ait' (which starts with a vowel sound)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m7-l24-voice",
        title: "Childhood Memories with Your French Pen Pal",
        situation: "Your long-time French pen pal is asking about your childhood",
        agentRole: "You are Chloé, nostalgic about childhood. Share your own childhood memories and ask about the student's: where they lived, what they did for fun, what they liked to eat, what school was like.",
        userGoal: "Describe childhood habits and states using the imparfait",
        targetPhrases: ["quand j'étais petit(e)", "j'habitais", "je jouais", "j'aimais", "c'était"],
        successCriteria: ["Uses imparfait for at least 5 different verbs", "Describes habitual actions (tous les jours, souvent)", "Uses 'quand j'étais...' correctly", "Describes a past state (weather, feelings, appearance)"],
        hints: ["'Quand j'étais enfant, j'habitais à...' = When I was a child, I lived in...", "'C'était formidable !' = It was wonderful!"],
      },
    ],
    culturalNotes: [
      {
        title: "La France d'Autrefois — Nostalgia in French Culture",
        content: "The French have a particular cultural attachment to 'la France d'autrefois' (the France of the old days) — an idealised past of small boulangeries, les PTT (post offices), the corner épicerie, the village café, and a slower pace of life. This nostalgia permeates French literature (Proust's 'Recherche du temps perdu'), film (Amélie, Midnight in Paris), and even advertising. The imparfait grammatically embodies this wistfulness — its soft, continuous endings convey duration and habitual states rather than sharp events.",
        region: "France",
      },
    ],
  },

  {
    id: "fr-l25",
    slug: "passe-compose-vs-imparfait",
    title: "Passé Composé vs Imparfait — The Critical Distinction",
    content: `# Passé Composé vs Imparfait — The Key Distinction

This is the hardest conceptual point in A1-A2 French. Native English speakers often misuse both tenses because English doesn't have the same clear split. But once you grasp the logic, it becomes intuitive.

\`\`\`concept
{ "title": "The Film Metaphor", "variant": "analogy", "content": "Think of a past narrative as a FILM:\\n\\n• IMPARFAIT = the BACKGROUND SCENERY — what was already happening, the setting, the atmosphere. These are things in motion or ongoing when the story begins.\\n\\n• PASSÉ COMPOSÉ = the EVENTS that happen — specific, completed, bounded moments that move the plot forward.\\n\\nIn a sentence: 'Il pleuvait (IMP — background) quand je suis arrivé (PC — event).'\\nIt was raining (scene is set) when I arrived (event happens)." }
\`\`\`

## The Decision Framework

| Ask yourself... | If YES → | Tense |
|-----------------|---------|-------|
| Is this a COMPLETED, specific event? | Use | **Passé Composé** |
| Is this an ONGOING state or background? | Use | **Imparfait** |
| Is this a HABIT or repeated action in the past? | Use | **Imparfait** |
| Is this a SINGLE, specific occurrence? | Use | **Passé Composé** |
| Does this INTERRUPT another action? | Use | **Passé Composé** (the interruption) |
| Is this the action being INTERRUPTED? | Use | **Imparfait** (the ongoing action) |

## Side-by-Side Contrasts

| Passé Composé (specific event) | Imparfait (ongoing/habitual) |
|-------------------------------|------------------------------|
| **J'ai mangé** une pizza. (I ate a pizza — one time, completed.) | **Je mangeais** souvent des pizzas. (I used to eat pizzas often.) |
| **Il a plu** toute la journée. (It rained all day — one bounded day.) | **Il pleuvait** quand je suis sorti. (It was raining when I went out.) |
| **Elle a eu** 20 ans. (She turned 20 — the specific birthday.) | **Elle avait** les cheveux longs. (She had long hair — ongoing state.) |
| **J'ai décidé** de partir. (I decided to leave — the moment of decision.) | **Je voulais** partir. (I wanted to leave — the feeling, not a specific event.) |

## Trigger Words — Which Tense They Signal

| Passé composé triggers | Imparfait triggers |
|-----------------------|--------------------|
| soudain (suddenly) | quand j'étais jeune |
| tout à coup (all of a sudden) | autrefois |
| un jour (one day) | souvent, parfois, toujours |
| d'abord... puis... enfin | chaque jour / semaine |
| une fois (once) | pendant que (while) |
| hier, la semaine dernière | normalement, habituellement |
| il y a + time | à l'époque |

\`\`\`quiz
{ "question": "Soudain, le téléphone ___ (sonner). What tense?", "options": ["sonnait", "a sonné", "sonnait pas", "sonnera"], "answer": 1, "explanation": "'Soudain' (suddenly) signals a sudden, completed event — PASSÉ COMPOSÉ: 'a sonné'. Compare: 'Le téléphone sonnait' (the phone was ringing — imparfait, ongoing) vs 'Soudain, le téléphone a sonné' (suddenly the phone rang — specific moment that ended the silence)." }
\`\`\`

\`\`\`quiz
{ "question": "Quand j'___ (être) enfant, je ___ (jouer) au football tous les jours. Fill both blanks.", "options": ["ai été / ai joué", "étais / jouais", "étais / ai joué", "ai été / jouais"], "answer": 1, "explanation": "Both blanks need IMPARFAIT: 'Quand j'ÉTAIS enfant' = when I was a child (ongoing past state). 'Je JOUAIS au football tous les jours' = I used to play football every day (habitual action). Neither is a specific, completed event — they're both background/habitual." }
\`\`\`

\`\`\`compare
{ "title": "A Complete Past Narrative — Both Tenses Together", "left": { "label": "Imparfait (background, state, habit)", "items": ["Il faisait froid. (It was cold.)", "Il y avait beaucoup de neige. (There was a lot of snow.)", "Je portais mon manteau. (I was wearing my coat.)", "Je cherchais mon bus. (I was looking for my bus.)"] }, "right": { "label": "Passé Composé (events, plot)", "items": ["Soudain, j'ai glissé. (Suddenly I slipped.)", "Je suis tombé par terre. (I fell to the ground.)", "Un passant m'a aidé. (A passerby helped me.)", "Je l'ai remercié. (I thanked him.)"] } }
\`\`\`

\`\`\`takeaways
{ "points": ["Passé composé = completed, specific events (the 'plot') — single occurrence, with clear start and end", "Imparfait = ongoing states, habitual actions, background description (the 'scene setting')", "Interrupted action: imparfait (what was ongoing) + passé composé (what interrupted it)", "Trigger words: 'soudain/tout à coup/un jour' → PC; 'souvent/autrefois/chaque jour' → imparfait", "Film metaphor: imparfait = background scenery; passé composé = events that happen in the foreground"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m7",
    moduleTitle: "Looking Back",
    order: 4,
    topicId: "fr-m7-l25-pc-vs-imparfait",
    vocabulary: [
      { word: "soudain / tout à coup", translation: "suddenly / all of a sudden", pronunciation: "soo-DAN / too-tah-KOO", exampleSentence: "Soudain, il a commencé à pleuvoir.", exampleTranslation: "Suddenly, it started to rain.", partOfSpeech: "adverb" },
      { word: "pendant que", translation: "while / whilst", pronunciation: "pahn-DAHN kuh", exampleSentence: "Pendant qu'il lisait, je cuisinais.", exampleTranslation: "While he was reading, I was cooking.", partOfSpeech: "conjunction" },
      { word: "habituellement", translation: "usually / habitually", pronunciation: "ah-bee-tü-EHL-mahn", exampleSentence: "Habituellement, il prenait le bus.", exampleTranslation: "He usually took the bus.", partOfSpeech: "adverb" },
      { word: "un jour", translation: "one day / someday", pronunciation: "uh ZHOOR", exampleSentence: "Un jour, j'ai rencontré quelqu'un d'extraordinaire.", exampleTranslation: "One day, I met someone extraordinary.", partOfSpeech: "adverbial phrase" },
      { word: "glisser / tomber", translation: "to slip / to fall", pronunciation: "glee-SAY / toh-BAY", exampleSentence: "J'ai glissé et je suis tombé.", exampleTranslation: "I slipped and fell.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "State Verbs Almost Always Take Imparfait",
        explanation: "Verbs describing mental or physical STATES (not actions) typically use imparfait for past narration, because states are inherently ongoing rather than completed events: *savoir* (to know), *croire* (to believe), *penser* (to think), *vouloir* (to want), *pouvoir* (to be able), *être* (to be), *avoir* (to have), *aimer* (to like). Exception: when the state CHANGES (begins or ends), use passé composé: *J'ai su la vérité* (I found out the truth — the moment of learning).",
        examples: [
          { correct: "Il ne savait pas que j'étais là. (imparfait — ongoing state of not knowing)", translation: "He didn't know I was there." },
          { correct: "Quand j'ai su la vérité, j'ai pleuré. (PC — the moment of finding out)", translation: "When I found out the truth, I cried." },
          { correct: "Elle voulait partir mais elle est restée. (imp — the wanting; PC — the staying)", translation: "She wanted to leave but she stayed." },
        ],
        commonMistakes: [
          { incorrect: "Hier, j'étais allé au cinéma.", correction: "Hier, je suis allé au cinéma.", explanation: "A specific completed event yesterday → passé composé, not imparfait. 'Hier' (yesterday) + specific action = passé composé." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m7-l25-voice",
        title: "Telling a Story — What Happened to You",
        situation: "You're telling your French host family about a memorable or funny incident from your life",
        agentRole: "You are the curious host mother Véronique. Ask questions, react with surprise, ask for details. Encourage the storytelling.",
        userGoal: "Tell a complete story using both passé composé (events) and imparfait (background/states)",
        targetPhrases: ["c'était", "il y avait", "soudain", "j'ai décidé de", "j'étais en train de"],
        successCriteria: ["Uses imparfait for at least 3 background/state descriptions", "Uses passé composé for at least 4 events", "Uses a contrast between the two tenses (interrupted action or background + event)"],
        hints: ["Set the scene first in imparfait: 'C'était un samedi matin, il faisait beau...'", "Then events in PC: 'Soudain, j'ai vu...'"],
      },
    ],
    culturalNotes: [
      {
        title: "Storytelling in French Culture — L'Art de Raconter",
        content: "The French have a strong tradition of oral storytelling — 'raconter une histoire' (to tell a story) is a valued social skill. French dinner conversations often involve elaborate recounting of anecdotes, with careful use of both past tenses to build atmosphere. The imparfait sets the mood; the passé composé delivers the punchline. Stand-up comedy (le stand-up), café conversations, and French literature all rely on this tense combination. Understanding it doesn't just help your grammar — it helps you participate in French social life.",
        region: "France",
      },
    ],
  },
];
