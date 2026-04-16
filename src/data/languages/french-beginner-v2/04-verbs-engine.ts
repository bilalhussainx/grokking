import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────
// MODULE 4: Verbs — The Engine (4 lessons)
// After gender, verbs are the second great challenge.
// English has ~2 forms per verb; French has 6. We build up
// systematically: être/avoir → -ER regulars → key irregulars
// → negation and questions.
// ─────────────────────────────────────────────────────────

export const verbsEngineLessons: LanguageLesson[] = [
  // ── LESSON 12 ── Être & Avoir (recap + deeper) ───────────
  {
    id: "fr-l12",
    slug: "etre-avoir-deep",
    title: "Être & Avoir — Mastering the Two Essential Verbs",
    content: `# Être & Avoir — Mastering the Two Essential Verbs

You met être and avoir in Module 2. Now we go deeper — because these two verbs don't just mean 'to be' and 'to have'. They're also the **building blocks** for compound tenses, passive constructions, and dozens of fixed expressions. Every French verb you'll ever learn connects back to one of these two.

\`\`\`concept
{ "title": "Why Être and Avoir Are Everywhere", "variant": "info", "content": "Être and avoir are called AUXILIARY verbs because they assist other verbs. Examples:\\n• Passé composé (past tense): j'ai mangé (I ate — avoir + past participle), je suis allé (I went — être + past participle)\\n• Passive voice: le livre est écrit (the book is written — être + past participle)\\n• Fixed expressions: j'ai besoin (I need), j'ai envie (I feel like), c'est à moi (it's mine)\\n\\nWithout solid mastery of être/avoir, everything above is inaccessible." }
\`\`\`

## Être — All 6 Forms + Key Uses

| Pronoun | Form | Pronunciation |
|---------|------|--------------|
| je | **suis** | SWEE |
| tu | **es** | EH |
| il/elle/on | **est** | EH |
| nous | **sommes** | SOM |
| vous | **êtes** | EHT |
| ils/elles | **sont** | SON |

**Key uses of être:**
1. Describing identity: *Je suis médecin.* (I'm a doctor.)
2. Nationality/origin: *Elle est canadienne.* / *Il est de Paris.*
3. Describing states: *Je suis fatigué.* (I'm tired.) *Il est prêt.* (He's ready.)
4. Location: *La clé est sur la table.* (The key is on the table.)
5. Time/date: *Il est huit heures.* / *Nous sommes lundi.*

**Note:** In French, you say 'je suis médecin' without any article — unlike English ('I am **a** doctor').

## Avoir — All 6 Forms + Key Uses

| Pronoun | Form | Pronunciation |
|---------|------|--------------|
| je | **ai** | EH |
| tu | **as** | AH |
| il/elle/on | **a** | AH |
| nous | **avons** | ah-VON |
| vous | **avez** | ah-VAY |
| ils/elles | **ont** | ON |

**Key uses of avoir:**
1. Possession: *J'ai une voiture.* (I have a car.)
2. Age: *J'ai trente ans.* (I am 30 years old.)
3. Physical states: *J'ai faim / soif / chaud / froid.* (I'm hungry/thirsty/hot/cold.)
4. Mental states: *J'ai peur / honte / raison / tort.* (I'm scared/ashamed/right/wrong.)
5. *Il y a* = there is/there are: *Il y a un problème.* / *Il y a des étudiants.*

\`\`\`compare
{ "title": "Être vs Avoir — Which One?", "left": { "label": "Use ÊTRE for:", "items": ["Identity: Je suis professeur.", "Nationality: Il est japonais.", "Location: Nous sommes à Paris.", "Permanent states: Elle est grande.", "Time: Il est midi.", "Profession (no article!): Tu es médecin."] }, "right": { "label": "Use AVOIR for:", "items": ["Possession: J'ai un chat.", "Age: Elle a 25 ans.", "Hunger/thirst: J'ai faim. J'ai soif.", "Temperature: Il a chaud.", "Fear: J'ai peur.", "Need: J'ai besoin de café."] } }
\`\`\`

## Il y a — There Is / There Are

**Il y a** is one of the most useful phrases in French. It uses **avoir** (a) and is invariable:

| | French | English |
|-|--------|---------|
| Affirmative | Il y a un café ici. | There is a café here. |
| Negative | Il n'y a pas de café ici. | There is no café here. |
| Question | Est-ce qu'il y a un café ? | Is there a café? |
| Duration | Il y a deux ans. | Two years ago. / For two years. |

\`\`\`quiz
{ "question": "Which sentence is grammatically correct in French?", "options": ["Je suis trente ans.", "J'ai trente ans.", "Je suis avoir trente ans.", "Il y a trente ans que j'ai."], "answer": 1, "explanation": "Age uses AVOIR in French: 'j'ai trente ans' (I have thirty years). 'Je suis trente ans' would mean 'I am thirty years' — grammatically nonsensical. This être/avoir confusion for age is the most common beginner mistake." }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'There are no problems' in French?", "options": ["Il n'y a pas des problèmes.", "Il n'y a pas de problèmes.", "Il y a non des problèmes.", "Il n'est pas de problèmes."], "answer": 1, "explanation": "After negation (ne...pas), the article changes to 'de': 'Il n'y a pas DE problèmes.' Not 'des problèmes' — in negative sentences, un/une/des → de/d'." }
\`\`\`

\`\`\`takeaways
{ "points": ["Être: suis/es/est/sommes/êtes/sont — identity, nationality, location, time, profession", "Avoir: ai/as/a/avons/avez/ont — possession, age, physical states, il y a", "Profession uses être WITHOUT article: 'je suis médecin' not 'je suis un médecin'", "Physical/emotional states use avoir: faim, soif, chaud, froid, peur, honte, raison, tort", "'Il y a' = there is/there are — uses avoir, invariable, becomes 'il n'y a pas de' in negation"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m4",
    moduleTitle: "Verbs — The Engine",
    order: 1,
    topicId: "fr-m4-l12-etre-avoir",
    vocabulary: [
      { word: "il y a", translation: "there is / there are", pronunciation: "eel-ee-AH", exampleSentence: "Il y a beaucoup de touristes à Paris.", exampleTranslation: "There are a lot of tourists in Paris.", partOfSpeech: "phrase" },
      { word: "j'ai besoin de", translation: "I need (lit. I have need of)", pronunciation: "zhay buh-ZWAN duh", exampleSentence: "J'ai besoin d'un café.", exampleTranslation: "I need a coffee.", partOfSpeech: "phrase" },
      { word: "j'ai envie de", translation: "I feel like / I want to", pronunciation: "zhay ahn-VEE duh", exampleSentence: "J'ai envie de dormir.", exampleTranslation: "I feel like sleeping.", partOfSpeech: "phrase" },
      { word: "je suis fatigué(e)", translation: "I am tired", pronunciation: "zhuh swee fah-tee-GAY", exampleSentence: "Je suis très fatigué après le voyage.", exampleTranslation: "I am very tired after the journey.", partOfSpeech: "phrase" },
      { word: "c'est", translation: "it is / this is / that is", pronunciation: "SEH", exampleSentence: "C'est magnifique !", exampleTranslation: "It's magnificent!", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "C'est vs Il est / Elle est",
        explanation: "Both can translate 'it is/he is/she is' but follow different rules: **C'est** is used before a noun (with or without article), a proper name, or an emphatic pronoun. **Il est / Elle est** is used before an adjective alone or before a profession (no article).",
        examples: [
          { correct: "C'est un médecin. / Il est médecin.", translation: "He's a doctor. — 'c'est + article + noun' OR 'il est + profession (no article)'" },
          { correct: "C'est Marie.", translation: "It's Marie. — always c'est before a proper name" },
          { correct: "Il est fatigué. / C'est fatigant.", translation: "He's tired (adj). / It's tiring (adj after c'est — different meaning)" },
        ],
        commonMistakes: [
          { incorrect: "Il est un étudiant.", correction: "C'est un étudiant. OR Il est étudiant.", explanation: "You can't say 'il est + article + noun'. Either use 'c'est' (with article) or drop the article after 'il est'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m4-l12-voice",
        title: "Medical Check-In",
        situation: "You are at a French doctor's office for a routine check-in",
        agentRole: "You are Dr. Moreau. Ask the patient about their name, age, profession, how they feel today, and if they have any pain.",
        userGoal: "Answer medical questions using être and avoir correctly",
        targetPhrases: ["J'ai ... ans", "je suis", "j'ai mal à", "je suis fatigué(e)"],
        successCriteria: ["Uses avoir for age", "Uses être for profession", "Uses avoir for physical symptoms"],
        hints: ["'J'ai mal à la tête' = I have a headache (lit. I have hurt to the head)", "'Je me sens...' = I feel..."],
      },
    ],
    culturalNotes: [
      {
        title: "The French Work-Life Balance Philosophy",
        content: "France has a 35-hour legal working week (introduced in 2000) and 5 weeks of paid vacation minimum. While the reality for many is longer hours, the legal framework reflects a cultural philosophy that life (*la vie*) is not synonymous with work (*le travail*). 'C'est la vie' — it's life — expresses a certain acceptance of circumstances. 'Je suis fatigué' from overwork is understood, but social life, food, family, and leisure are considered non-negotiable pillars of a good life.",
        region: "France",
      },
    ],
  },

  // ── LESSON 13 ── Regular -ER Verbs ───────────────────────
  {
    id: "fr-l13",
    slug: "regular-er-verbs",
    title: "Regular -ER Verbs — The 90% Rule",
    content: `# Regular -ER Verbs — The 90% Rule

About **90% of French verbs** end in **-er** and follow the same conjugation pattern. Master this one pattern and you can conjugate thousands of verbs. This is the biggest return-on-investment in French grammar.

\`\`\`concept
{ "title": "The -ER Verb System", "variant": "info", "content": "French verbs in the infinitive end in -er, -ir, or -re. The -ER group is by far the largest (over 10,000 verbs) and the most regular. Once you know the endings, you can conjugate any regular -ER verb you encounter. The pattern: drop the -er, add the ending." }
\`\`\`

## The -ER Conjugation Pattern

Using **parler** (to speak) as the model:

| Pronoun | Ending | Result | Pronunciation |
|---------|--------|--------|--------------|
| je | **-e** | parl**e** | PAHRL (silent e) |
| tu | **-es** | parl**es** | PAHRL (silent es) |
| il/elle/on | **-e** | parl**e** | PAHRL (same as je) |
| nous | **-ons** | parl**ons** | pahr-LON |
| vous | **-ez** | parl**ez** | pahr-LAY |
| ils/elles | **-ent** | parl**ent** | PAHRL (silent ent!) |

\`\`\`concept
{ "title": "The Great Silence: 4 Forms Sound Identical", "variant": "warning", "content": "For most -ER verbs, 4 out of 6 forms sound EXACTLY the same in spoken French:\\n• je parle, tu parles, il parle, ils parlent → all sound like 'PAHRL'\\n\\nOnly nous (-ons) and vous (-ez) sound different. This means context and subject pronouns are CRUCIAL in speech. In writing, you must still spell all 6 forms correctly. But in listening, focus on pronouns and context — not on hearing different verb endings." }
\`\`\`

## 20 Essential -ER Verbs to Know

| Infinitive | English | Key Sentence |
|------------|---------|-------------|
| **parler** | to speak | Je parle français. |
| **manger** | to eat | Nous mangeons une pizza. |
| **aimer** | to like / to love | J'aime le chocolat. |
| **habiter** | to live (in) | Il habite à Paris. |
| **travailler** | to work | Elle travaille dans un hôpital. |
| **acheter** | to buy | Tu achètes des légumes. |
| **regarder** | to watch | Vous regardez la télévision. |
| **écouter** | to listen | Il écoute de la musique. |
| **chercher** | to look for | Je cherche mon téléphone. |
| **penser** | to think | Qu'est-ce que vous pensez ? |
| **voyager** | to travel | Ils voyagent en Italie. |
| **arriver** | to arrive | Le train arrive à midi. |
| **commencer** | to start | Le film commence à 20h. |
| **danser** | to dance | On danse toute la nuit. |
| **chanter** | to sing | Elle chante très bien. |
| **jouer** | to play | Les enfants jouent dans le jardin. |
| **étudier** | to study | Nous étudions le français. |
| **marcher** | to walk | Je marche 30 minutes par jour. |
| **téléphoner** | to call | Elle téléphone à sa mère. |
| **visiter** | to visit (a place) | Ils visitent le Louvre. |

## Spelling-Change Verbs (Mostly Regular)

Some -ER verbs have minor spelling changes to preserve pronunciation:

**Manger / voyager** (verbs ending in -ger): add **e** before -ons to keep the G soft:
- nous mang**e**ons (not mangons — that would be hard G)

**Commencer / lancer** (verbs ending in -cer): add **cedilla** before -ons:
- nous commen**ç**ons (to keep the C soft)

**Acheter / lever** (verbs with e before last consonant): grave accent in je/tu/il/ils forms:
- j'ach**è**te, tu ach**è**tes, il ach**è**te, ils ach**è**tent

\`\`\`quiz
{ "question": "What is the correct conjugation of 'travailler' (to work) for 'nous'?", "options": ["nous travaillent", "nous travaillez", "nous travaillons", "nous travaille"], "answer": 2, "explanation": "Regular -ER verbs take -ons for the 'nous' form: travaill + ons = travaillons. The double-L in 'travailler' stays in all forms. Note: -ent is for ils/elles, -ez is for vous, -e is for je/tu/il/elle." }
\`\`\`

\`\`\`quiz
{ "question": "Why is 'nous mangeons' spelled with an E after the G, unlike other verbs?", "options": ["It's an exception with no logical reason", "To keep the G pronounced as a soft sound before -ons", "Because 'manger' is irregular", "To match the feminine form of the verb"], "answer": 1, "explanation": "In French, G before 'o' or 'a' makes a hard sound (as in 'go'). To keep the soft G sound (like in 'measure'), you insert an E: nous mang-E-ons. Without the E, 'nous mangons' would sound like 'mang-GOHN' (hard G). Same applies to voyager, ranger, etc." }
\`\`\`

\`\`\`takeaways
{ "points": ["90% of French verbs end in -er and follow this pattern: drop -er, add -e/-es/-e/-ons/-ez/-ent", "4 forms (je/tu/il/ils) sound identical for most -ER verbs — distinguishable only by context and pronoun", "Only nous (-ons) and vous (-ez) have distinct sounds", "Manger/voyager insert E before -ons: nous mangeons (to keep G soft)", "Commencer inserts cedilla before -ons: nous commençons (to keep C soft)"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m4",
    moduleTitle: "Verbs — The Engine",
    order: 2,
    topicId: "fr-m4-l13-er-verbs",
    vocabulary: [
      { word: "aimer", translation: "to like / to love", pronunciation: "eh-MAY", exampleSentence: "J'aime beaucoup la cuisine française.", exampleTranslation: "I really like French cuisine.", partOfSpeech: "verb" },
      { word: "habiter", translation: "to live (somewhere)", pronunciation: "ah-bee-TAY", exampleSentence: "Où habitez-vous ?", exampleTranslation: "Where do you live?", partOfSpeech: "verb" },
      { word: "travailler", translation: "to work", pronunciation: "trah-vah-YAY", exampleSentence: "Elle travaille dans une banque.", exampleTranslation: "She works in a bank.", partOfSpeech: "verb" },
      { word: "chercher", translation: "to look for / to search", pronunciation: "shehr-SHAY", exampleSentence: "Je cherche la rue Montmartre.", exampleTranslation: "I'm looking for Montmartre Street.", partOfSpeech: "verb" },
      { word: "voyager", translation: "to travel", pronunciation: "vwah-yah-ZHAY", exampleSentence: "Nous voyageons souvent en Europe.", exampleTranslation: "We often travel in Europe.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Adverbs of Frequency — Adding Rhythm to Verbs",
        explanation: "Common adverbs of frequency are placed **after the conjugated verb** in French: *toujours* (always), *souvent* (often), *parfois* (sometimes), *rarement* (rarely), *jamais* (never — with ne...pas structure: ne...jamais), *déjà* (already), *encore* (still/again).",
        examples: [
          { correct: "Je mange toujours à midi.", translation: "I always eat at noon. (after verb)" },
          { correct: "Il voyage souvent en Asie.", translation: "He often travels to Asia." },
          { correct: "Elle ne mange jamais de viande.", translation: "She never eats meat. (ne...jamais)" },
        ],
        commonMistakes: [
          { incorrect: "Je toujours mange à midi.", correction: "Je mange toujours à midi.", explanation: "In French, frequency adverbs go AFTER the conjugated verb, not between subject and verb like in English ('I always eat')." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m4-l13-voice",
        title: "Daily Routine on the Radio",
        situation: "A French radio show is interviewing people about their daily routines",
        agentRole: "You are radio host Isabelle. Ask the student about their morning routine, work, hobbies, and evening activities using -ER verbs.",
        userGoal: "Describe your daily routine using at least 5 different -ER verbs",
        targetPhrases: ["je me réveille", "je travaille", "j'écoute", "je mange", "je regarde"],
        successCriteria: ["Uses at least 5 -ER verbs correctly", "Includes time references", "Describes morning, work/study, and evening"],
        hints: ["'Je me réveille à...' = I wake up at...", "'Le soir, je regarde...' = In the evening, I watch..."],
      },
    ],
    culturalNotes: [
      {
        title: "Le Déjeuner — Lunch as a Sacred Institution",
        content: "In France, lunch (le déjeuner) is not eaten at a desk. The traditional French lunch break is 2 hours — a real sit-down meal with starter, main course, and dessert. While this has shortened in many workplaces (especially in Paris), the principle remains: food deserves time and attention. Many companies still have a subsidised canteen (la cantine) and the concept of 'eating on the go' is still considered unfortunate. 'Manger' in France implies a social, seated, multi-course experience.",
        region: "France",
      },
    ],
  },

  // ── LESSON 14 ── Essential Irregular Verbs ───────────────
  {
    id: "fr-l14",
    slug: "essential-irregular-verbs",
    title: "Essential Irregular Verbs — Aller, Faire, Prendre, Pouvoir, Vouloir",
    content: `# Essential Irregular Verbs

French has a small set of high-frequency irregular verbs that don't follow the -ER pattern. You'll use these every single day — they're worth the effort of memorising individually. The five below cover the vast majority of what you need at A1 level.

\`\`\`concept
{ "title": "Why These 5 Are Non-Negotiable", "variant": "info", "content": "• ALLER (to go): used for futur proche (going to do), directions, health ('ça va ?')\\n• FAIRE (to do/make): used for weather, sports, household activities, cooking\\n• PRENDRE (to take): used for transport, food orders, time expressions\\n• POUVOIR (can/be able): essential for polite requests\\n• VOULOIR (to want): essential for expressing desires and ordering\\n\\nThese 5 verbs plus être and avoir give you the scaffolding for almost any conversation." }
\`\`\`

## Aller — To Go

| je | tu | il/elle | nous | vous | ils/elles |
|----|----|---------|----|------|-----------|
| **vais** | **vas** | **va** | **allons** | **allez** | **vont** |

Key expressions:
- *Comment allez-vous ?* (How are you? — formal)
- *Je vais bien.* (I'm fine.)
- *On y va ?* (Shall we go? — casual)
- **Futur proche:** *Je vais manger.* (I'm going to eat.) → aller + infinitive

## Faire — To Do / To Make

| je | tu | il/elle | nous | vous | ils/elles |
|----|----|---------|----|------|-----------|
| **fais** | **fais** | **fait** | **faisons** | **faites** | **font** |

Key expressions:
- *Il fait beau / chaud / froid.* (The weather is nice / hot / cold.)
- *Je fais du sport / de la natation / du vélo.* (I do sports / swimming / cycling.)
- *Qu'est-ce que tu fais ?* (What are you doing?)
- *Je fais la cuisine / le ménage.* (I cook / do housework.)

## Prendre — To Take

| je | tu | il/elle | nous | vous | ils/elles |
|----|----|---------|----|------|-----------|
| **prends** | **prends** | **prend** | **prenons** | **prenez** | **prennent** |

Key uses:
- Transport: *Je prends le métro / le bus / le train.*
- Ordering: *Je prends un café.* (I'll have a coffee.)
- Learning: *prendre des cours* (to take classes)
- Time: *ça prend du temps* (it takes time)

## Pouvoir — Can / To Be Able To

| je | tu | il/elle | nous | vous | ils/elles |
|----|----|---------|----|------|-----------|
| **peux** | **peux** | **peut** | **pouvons** | **pouvez** | **peuvent** |

Used with infinitive: *Je peux t'aider.* (I can help you.)
Polite requests: *Pouvez-vous m'aider ?* (Can you help me? — formal)
*Est-ce que tu peux répéter ?* (Can you repeat that?)

## Vouloir — To Want

| je | tu | il/elle | nous | vous | ils/elles |
|----|----|---------|----|------|-----------|
| **veux** | **veux** | **veut** | **voulons** | **voulez** | **veulent** |

*Je voudrais* (I would like) = the conditional form — more polite than *je veux* (I want). Always prefer *je voudrais* when ordering or requesting:
- *Je voudrais un café, s'il vous plaît.* ✓ (polite)
- *Je veux un café.* — grammatically correct but sounds blunt

\`\`\`compare
{ "title": "Futur Proche — Aller + Infinitive vs English 'Going to'", "left": { "label": "English 'going to'", "items": ["I'm going to eat.", "She's going to study.", "We're going to travel.", "Are you going to work?"] }, "right": { "label": "French aller + infinitif", "items": ["Je vais manger.", "Elle va étudier.", "Nous allons voyager.", "Tu vas travailler ?"] } }
\`\`\`

\`\`\`quiz
{ "question": "You want to politely order a glass of water in a French restaurant. Which is best?", "options": ["Je veux de l'eau.", "Je voudrais de l'eau, s'il vous plaît.", "Je peux de l'eau ?", "Donnez-moi de l'eau."], "answer": 1, "explanation": "'Je voudrais de l'eau, s'il vous plaît' is the polite standard. 'Je veux' (I want) is grammatically fine but sounds demanding in French culture. 'Je peux de l'eau ?' doesn't work — pouvoir must be followed by an infinitive verb, not a noun." }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'It's cold today' in French (using faire for weather)?", "options": ["Il est froid aujourd'hui.", "Il fait froid aujourd'hui.", "Il est le froid.", "Aujourd'hui il y a froid."], "answer": 1, "explanation": "Weather in French uses FAIRE: 'Il fait froid' (it's cold), 'Il fait chaud' (it's hot), 'Il fait beau' (the weather is nice). 'Il est froid' is wrong — être is not used for weather. 'Il y a du soleil' (it's sunny) uses avoir, but temperature uses faire." }
\`\`\`

\`\`\`takeaways
{ "points": ["ALLER: vais/vas/va/allons/allez/vont — used for going + futur proche (aller + infinitive = going to)", "FAIRE: fais/fais/fait/faisons/faites/font — weather (il fait), sports (faire du/de la), activities", "PRENDRE: prends/prends/prend/prenons/prenez/prennent — transport, ordering food", "POUVOIR: peux/peux/peut/pouvons/pouvez/peuvent — can, always + infinitive", "VOULOIR: veux/veux/veut/voulons/voulez/veulent — use 'je voudrais' (I would like) in polite contexts"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m4",
    moduleTitle: "Verbs — The Engine",
    order: 3,
    topicId: "fr-m4-l14-irregular-verbs",
    vocabulary: [
      { word: "je vais", translation: "I go / I am going", pronunciation: "zhuh VAY", exampleSentence: "Je vais au supermarché.", exampleTranslation: "I'm going to the supermarket.", partOfSpeech: "verb" },
      { word: "il fait beau", translation: "the weather is nice", pronunciation: "eel FEH BOH", exampleSentence: "Il fait beau aujourd'hui — allons nous promener !", exampleTranslation: "The weather is nice today — let's go for a walk!", partOfSpeech: "phrase" },
      { word: "je prends", translation: "I take / I'll have", pronunciation: "zhuh PRAHN", exampleSentence: "Je prends le métro pour aller au travail.", exampleTranslation: "I take the metro to get to work.", partOfSpeech: "verb" },
      { word: "je voudrais", translation: "I would like (polite form)", pronunciation: "zhuh voo-DREH", exampleSentence: "Je voudrais un café crème, s'il vous plaît.", exampleTranslation: "I would like a café crème, please.", partOfSpeech: "verb" },
      { word: "on va + infinitif", translation: "we're going to (do something)", pronunciation: "on VAH", exampleSentence: "On va manger au restaurant ce soir.", exampleTranslation: "We're going to eat at the restaurant tonight.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Faire du / de la / de l' / des + Activity",
        explanation: "To say you do a sport or activity, use **faire + du/de la/de l'/des**. The article matches the gender of the activity. This is called the 'partitive article' — you'll learn it fully in Module 5. For now: masculine activities take 'du', feminine take 'de la', vowel-starting take 'de l'.",
        examples: [
          { correct: "Je fais du sport. (sport = masc)", translation: "I do sports." },
          { correct: "Elle fait de la natation. (natation = fem)", translation: "She does swimming." },
          { correct: "Il fait de l'équitation. (équitation = fem, starts with vowel)", translation: "He does horse riding." },
          { correct: "Nous faisons des randonnées. (randonnées = fem plural)", translation: "We go hiking." },
        ],
        commonMistakes: [
          { incorrect: "Je fais du natation.", correction: "Je fais de la natation.", explanation: "'Natation' is feminine, so use 'de la'. 'Du' is for masculine nouns only." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m4-l14-voice",
        title: "Weekend Plans Over Coffee",
        situation: "You and a French friend are discussing your weekend plans",
        agentRole: "You are Arnaud, an enthusiastic French friend. Ask what the student is going to do this weekend, discuss weather, and suggest activities using aller, faire, pouvoir, vouloir.",
        userGoal: "Discuss weekend plans using futur proche (aller + infinitive) and key irregular verbs",
        targetPhrases: ["je vais", "il va faire", "on peut", "je voudrais", "tu veux"],
        successCriteria: ["Uses futur proche (aller + infinitif) at least twice", "Uses faire for weather or activity", "Uses vouloir or pouvoir once"],
        hints: ["'Je vais aller à...' = I'm going to go to...", "'Il va faire beau ce weekend' = The weather will be nice this weekend"],
      },
    ],
    culturalNotes: [
      {
        title: "Le Sport — The French Relationship with Physical Activity",
        content: "France has a strong sport culture: football (soccer) is the most popular, followed by rugby, tennis, cycling (le Tour de France), and pétanque. 'Faire du sport' is valued not just for health but as a social activity. The French also have a distinctive walking culture — 'se promener' (to stroll) is a legitimate leisure activity, particularly on Sunday afternoons. The concept of a 'promenade' (casual walk with no destination goal) reflects the French appreciation for the journey over the destination.",
        region: "France",
      },
    ],
  },

  // ── LESSON 15 ── Negation & Questions ────────────────────
  {
    id: "fr-l15",
    slug: "negation-questions",
    title: "Negation & Questions — The Grammar of Asking and Refusing",
    content: `# Negation & Questions in French

Two skills that transform your French from passive to active: saying NO and asking WHY. French has three question-formation methods (from formal to casual) and a two-part negation structure that wraps around the verb.

## Negation: Ne … Pas

French negation is a two-part sandwich around the conjugated verb:

\`\`\`
Subject + NE + VERB + PAS + rest of sentence
\`\`\`

| Affirmative | Negative |
|-------------|----------|
| Je parle français. | Je **ne** parle **pas** français. |
| Elle mange. | Elle **ne** mange **pas**. |
| Nous avons un chat. | Nous **n'**avons **pas** de chat. |
| Il est content. | Il **n'**est **pas** content. |

**Elision:** 'ne' becomes 'n'' before a vowel or silent H.

In **spoken French**, the 'ne' is commonly dropped: *"Je parle pas français."* — you'll hear this constantly. But in writing, always include both parts.

\`\`\`concept
{ "title": "Other Negation Pairs — Beyond Ne...Pas", "variant": "info", "content": "• Ne...jamais = never: 'Je ne mange jamais de viande.'\\n• Ne...plus = no longer/anymore: 'Je ne fume plus.' (I no longer smoke.)\\n• Ne...rien = nothing: 'Je ne comprends rien.' (I understand nothing.)\\n• Ne...personne = nobody: 'Il n'y a personne.' (There's nobody.)\\n• Ne...que = only: 'Il ne parle que français.' (He speaks only French.)\\nAll follow the same sandwich structure: ne + verb + negation word." }
\`\`\`

## Asking Questions — 3 Methods

French has three ways to ask yes/no questions, from most to least formal:

### Method 1: Inversion (Formal/Written)
Put the verb BEFORE the subject, connected with a hyphen:
- *Parlez-vous anglais ?* (Do you speak English?)
- *Est-il médecin ?* (Is he a doctor?)
- *Avez-vous une réservation ?* (Do you have a reservation?)

Note: When a 3rd person verb ends in a vowel, add '-t-' for pronunciation:
- *Parle-**t**-il français ?* (Does he speak French? — t added for liaison)

### Method 2: Est-ce que (Neutral/Standard)
Add *est-ce que* before any statement — no reordering needed:
- *Est-ce que vous parlez anglais ?*
- *Est-ce qu'il est médecin ?*
- *Est-ce qu'il y a une pharmacie près d'ici ?*

### Method 3: Intonation (Informal/Spoken)
Just raise your voice at the end of a statement:
- *Tu parles anglais ?*
- *Il est médecin ?*
- *Il y a une pharmacie ici ?*

\`\`\`compare
{ "title": "The Three Question Methods — Same Meaning, Different Register", "left": { "label": "Same question, 3 formality levels", "items": ["Formal (inversion): Êtes-vous français ?", "Standard (est-ce que): Est-ce que vous êtes français ?", "Informal (intonation): Vous êtes français ?"] }, "right": { "label": "When to use each", "items": ["Inversion: written French, official contexts, interviews", "Est-ce que: everyday speech — the safest default", "Intonation: friends, casual conversation, texts"] } }
\`\`\`

## Question Words (Mots Interrogatifs)

| French | English | Example |
|--------|---------|---------|
| **Qui** | Who | Qui est là ? |
| **Que / Qu'** | What | Qu'est-ce que tu fais ? |
| **Où** | Where | Où habitez-vous ? |
| **Quand** | When | Quand arrive le train ? |
| **Comment** | How | Comment allez-vous ? |
| **Pourquoi** | Why | Pourquoi apprenez-vous le français ? |
| **Combien** | How much/many | C'est combien ? |
| **Quel(le)** | Which/What | Quel jour sommes-nous ? |

\`\`\`quiz
{ "question": "How do you ask 'Do you have a table for two?' formally using inversion?", "options": ["Vous avez une table pour deux ?", "Est-ce que vous avez une table pour deux ?", "Avez-vous une table pour deux ?", "Avez vous une table pour deux ?"], "answer": 2, "explanation": "Inversion: verb before subject, connected by hyphen. 'Avez-vous une table pour deux ?' — 'avez' (verb) + hyphen + 'vous' (subject). Don't forget the hyphen! Both 'est-ce que vous avez' and 'avez-vous' are correct, but option 3 is the inversion form specifically." }
\`\`\`

\`\`\`quiz
{ "question": "Transform to negative: 'Ils voyagent souvent.' (They often travel.)", "options": ["Ils ne voyagent souvent pas.", "Ils ne voyagent pas souvent.", "Ils voyagent ne pas souvent.", "Ils ne pas voyagent souvent."], "answer": 1, "explanation": "'Ne' goes immediately before the conjugated verb, 'pas' goes immediately after: 'Ils NE voyagent PAS souvent.' Adverbs like 'souvent' go after 'pas' in negation." }
\`\`\`

\`\`\`takeaways
{ "points": ["Negation is a two-part sandwich: NE + VERB + PAS — with elision to n' before vowels", "In spoken French, 'ne' is often dropped — but always write both parts in formal French", "Other negations: ne...jamais (never), ne...plus (no longer), ne...rien (nothing)", "Three question methods: inversion (formal), est-ce que (standard), intonation (informal)", "Add -t- in inversion when 3rd person verb ends in vowel: Parle-t-il ?"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m4",
    moduleTitle: "Verbs — The Engine",
    order: 4,
    topicId: "fr-m4-l15-negation-questions",
    vocabulary: [
      { word: "ne ... pas", translation: "not (negation)", pronunciation: "nuh...PAH", exampleSentence: "Je ne comprends pas.", exampleTranslation: "I don't understand.", partOfSpeech: "grammatical structure" },
      { word: "pourquoi", translation: "why", pronunciation: "poor-KWAH", exampleSentence: "Pourquoi apprenez-vous le français ?", exampleTranslation: "Why are you learning French?", partOfSpeech: "adverb" },
      { word: "est-ce que", translation: "question marker (is it that...?)", pronunciation: "EH-skuh", exampleSentence: "Est-ce qu'il y a un médecin ?", exampleTranslation: "Is there a doctor?", partOfSpeech: "question marker" },
      { word: "comment", translation: "how", pronunciation: "koh-MAHN", exampleSentence: "Comment dit-on 'thank you' en français ?", exampleTranslation: "How do you say 'thank you' in French?", partOfSpeech: "adverb" },
      { word: "parce que", translation: "because", pronunciation: "pars-kuh", exampleSentence: "J'apprends le français parce que j'aime la culture.", exampleTranslation: "I'm learning French because I love the culture.", partOfSpeech: "conjunction" },
    ],
    grammarPoints: [
      {
        title: "N'est-ce pas? — The Tag Question",
        explanation: "French uses **n'est-ce pas ?** (lit. 'is it not?') as a universal tag question, equivalent to English 'isn't it?', 'aren't you?', 'don't they?', 'right?'. It doesn't change form. Alternatively, in very informal speech, **non ?** is used.",
        examples: [
          { correct: "C'est beau, n'est-ce pas ?", translation: "It's beautiful, isn't it?" },
          { correct: "Vous parlez français, n'est-ce pas ?", translation: "You speak French, don't you?" },
          { correct: "Il fait froid aujourd'hui, non ?", translation: "It's cold today, right? (informal)" },
        ],
        commonMistakes: [
          { incorrect: "Tu aimes le café, isn't it ?", correction: "Tu aimes le café, non ? / n'est-ce pas ?", explanation: "Use French tag questions in French sentences. 'N'est-ce pas' works for any subject/verb — it never changes." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m4-l15-voice",
        title: "Tourist Information Office",
        situation: "You arrive at the Strasbourg tourist office and have many questions",
        agentRole: "You are the tourist office agent Margaux. Answer questions about attractions, transport, opening hours, and prices. Ask what the tourist has already seen.",
        userGoal: "Ask at least 5 questions using different question words and methods",
        targetPhrases: ["est-ce qu'il y a", "où se trouve", "c'est combien", "quand est-ce que", "pouvez-vous"],
        successCriteria: ["Uses at least 3 different question words", "Uses est-ce que at least once", "Asks about price, location, and time"],
        hints: ["'Est-ce qu'il y a une visite guidée ?' = Is there a guided tour?", "'Où se trouve la cathédrale ?' = Where is the cathedral?"],
      },
    ],
    culturalNotes: [
      {
        title: "The French Art of Disagreement — Polite Refusal",
        content: "The French have a cultural tradition of intellectual debate and constructive disagreement. Saying 'non' directly is not considered rude — it's honest. However, the WAY you say no matters. 'Non, ce n'est pas comme ça' (No, that's not how it is) said with reasoning is respected; a blunt 'no' with no explanation is not. The French love using 'mais' (but) to introduce a counterpoint — 'Oui, mais...' (Yes, but...) is practically a national sport. Debate, nuance, and the ability to defend your position are culturally valued.",
        region: "France",
      },
    ],
  },
];
