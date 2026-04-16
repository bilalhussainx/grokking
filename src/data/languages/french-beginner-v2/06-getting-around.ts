import type { LanguageLesson } from "@/data/language-types";

export const gettingAroundLessons: LanguageLesson[] = [
  {
    id: "fr-l19",
    slug: "directions-city",
    title: "Directions & City Places — Navigating France",
    content: `# Directions & City Places

Being able to ask for and understand directions is one of the most practical A1 skills. In France, asking a stranger for directions is common and usually met with detailed help — but you need to understand the answer!

\`\`\`concept
{ "title": "Asking for Directions — The Magic Formula", "variant": "info", "content": "The most useful phrase in France:\\n\\n'Excusez-moi, où se trouve [place] ?'\\n(Excuse me, where is [place]?)\\n\\nAlternatives:\\n• 'Pardon, c'est loin d'ici, [place] ?' (Is [place] far from here?)\\n• 'Pour aller à [place], s'il vous plaît ?' (How do I get to [place], please?)\\n• 'Est-ce qu'il y a [place] près d'ici ?' (Is there a [place] nearby?)" }
\`\`\`

## Giving Directions

| French | English |
|--------|---------|
| **Allez tout droit.** | Go straight ahead. |
| **Tournez à gauche.** | Turn left. |
| **Tournez à droite.** | Turn right. |
| **Prenez la première rue à gauche.** | Take the first street on the left. |
| **C'est au bout de la rue.** | It's at the end of the street. |
| **C'est à côté de...** | It's next to... |
| **C'est en face de...** | It's opposite... |
| **C'est entre ... et ...** | It's between ... and ... |
| **C'est à 5 minutes à pied.** | It's a 5-minute walk. |
| **Traversez la place.** | Cross the square. |

## Places in the City

| French | English |
|--------|---------|
| la mairie | town hall |
| la gare | train station |
| l'aéroport | airport |
| le métro | metro/subway |
| la pharmacie | pharmacy |
| l'hôpital | hospital |
| la boulangerie | bakery |
| la boucherie | butcher's |
| la poste | post office |
| la bibliothèque | library |
| le musée | museum |
| l'église | church |
| la cathédrale | cathedral |
| le supermarché | supermarket |
| le marché | market |
| le cinéma | cinema |

## Prepositions of Place

| French | English | Example |
|--------|---------|---------|
| **à** | at / in | à la gare, au musée |
| **dans** | inside / in | dans la rue, dans le métro |
| **sur** | on / on top of | sur la table, sur la carte |
| **sous** | under | sous le pont |
| **devant** | in front of | devant la cathédrale |
| **derrière** | behind | derrière le bâtiment |
| **à côté de** | next to | à côté de la pharmacie |
| **en face de** | opposite | en face de la mairie |
| **près de** | near | près d'ici |
| **loin de** | far from | loin du centre |

\`\`\`steps
{ "title": "Understanding Directions When Spoken Fast", "steps": [ { "title": "Listen for the verb first", "description": "Allez (go), tournez (turn), prenez (take), traversez (cross) — these tell you the action." }, { "title": "Listen for gauche/droite/droit", "description": "Left/right/straight — the most critical direction words." }, { "title": "Listen for ordinal numbers", "description": "La première rue (first street), la deuxième à droite (second on right)." }, { "title": "Ask for repetition or written form", "description": "'Pouvez-vous répéter plus lentement ?' (Can you repeat more slowly?) or 'Pouvez-vous écrire l'adresse ?' (Can you write the address?)" } ] }
\`\`\`

\`\`\`quiz
{ "question": "Someone tells you 'Prenez la deuxième rue à gauche'. What do you do?", "options": ["Take the first street on the right", "Take the second street on the left", "Go straight until the second set of traffic lights", "Turn left at the first intersection"], "answer": 1, "explanation": "'Prenez' = take, 'la deuxième rue' = the second street, 'à gauche' = on the left. So: take the second street on the left. 'Première/deuxième/troisième' = first/second/third." }
\`\`\`

\`\`\`takeaways
{ "points": ["Key phrase: 'Excusez-moi, où se trouve [place] ?' — polite and universally understood", "Direction verbs (imperative): allez, tournez, prenez, traversez, continuez", "Gauche = left, droite = right, tout droit = straight ahead — the three essential words", "Prepositions: à côté de (next to), en face de (opposite), près de (near), devant (in front of)", "If you don't understand: 'Pouvez-vous répéter plus lentement ?' or 'Pouvez-vous écrire ça ?'"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m6",
    moduleTitle: "Getting Around",
    order: 1,
    topicId: "fr-m6-l19-directions",
    vocabulary: [
      { word: "à gauche", translation: "on the left / to the left", pronunciation: "ah GOHSH", exampleSentence: "Tournez à gauche après le feu.", exampleTranslation: "Turn left after the traffic light.", partOfSpeech: "adverbial phrase" },
      { word: "à droite", translation: "on the right / to the right", pronunciation: "ah DRWAHT", exampleSentence: "La pharmacie est à droite.", exampleTranslation: "The pharmacy is on the right.", partOfSpeech: "adverbial phrase" },
      { word: "tout droit", translation: "straight ahead", pronunciation: "too DRWAH", exampleSentence: "Allez tout droit jusqu'au carrefour.", exampleTranslation: "Go straight ahead until the crossroads.", partOfSpeech: "adverbial phrase" },
      { word: "près d'ici", translation: "nearby / close by", pronunciation: "preh DEE-see", exampleSentence: "Est-ce qu'il y a une pharmacie près d'ici ?", exampleTranslation: "Is there a pharmacy nearby?", partOfSpeech: "adverbial phrase" },
      { word: "la rue", translation: "the street", pronunciation: "lah RÜ", exampleSentence: "Prenez la première rue à droite.", exampleTranslation: "Take the first street on the right.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "The Imperative — Giving Commands & Directions",
        explanation: "Directions use the **imperative mood** — giving commands. For regular -ER verbs: drop tu/vous, drop -er/-ez endings, use the verb stem + special endings. Tu form loses the -s. Vous form = same as present.",
        examples: [
          { correct: "Allez tout droit ! (vous-form of aller)", translation: "Go straight ahead!" },
          { correct: "Tournez à gauche. (vous-form of tourner)", translation: "Turn left." },
          { correct: "Prenez le métro. (vous-form of prendre)", translation: "Take the metro." },
          { correct: "Continue tout droit. (tu-form — no S on -er verbs)", translation: "Keep going straight. (informal)" },
        ],
        commonMistakes: [
          { incorrect: "Tu allez tout droit.", correction: "Allez tout droit. (drop subject in imperative)", explanation: "The imperative doesn't use a subject pronoun. Just the verb form alone." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m6-l19-voice",
        title: "Lost in the Marais, Paris",
        situation: "You are lost in the Marais neighbourhood and need to find the Place des Vosges",
        agentRole: "You are a helpful Parisian local. When asked for directions, give clear route guidance using left/right/straight and landmarks. Ask if they understood.",
        userGoal: "Ask for directions and confirm you understand the route",
        targetPhrases: ["excusez-moi", "où se trouve", "c'est loin ?", "je dois tourner", "d'accord, merci"],
        successCriteria: ["Uses polite opening (Excusez-moi)", "Asks for directions clearly", "Confirms understanding or asks for clarification"],
        hints: ["'C'est à combien de temps à pied ?' = How long on foot?", "'Je ne comprends pas — pouvez-vous répéter ?' = I don't understand — can you repeat?"],
      },
    ],
    culturalNotes: [
      {
        title: "Le Plan — French Cities and Their Logical Grid",
        content: "Many French cities (especially those redesigned by Baron Haussmann in the 19th century) have a logical grid of grands boulevards and smaller rues. Paris is organised into 20 arrondissements (districts) spiralling clockwise from the centre. Addresses often include the arrondissement: '14 rue de Rivoli, 1er' (1st arrondissement). The Île de la Cité (where Notre-Dame sits) is considered the geographic and historical zero-point of France — all distances from Paris are measured from there.",
        region: "France",
      },
    ],
  },

  {
    id: "fr-l20",
    slug: "transport-travel",
    title: "Transport & Travel — Getting Across France",
    content: `# Transport & Travel

France has one of the world's best public transport systems. At the train station, airport, or bus stop, you'll need specific vocabulary. This lesson also introduces **prepositions for transport** — which follow a different rule from places.

\`\`\`concept
{ "title": "Transport Prepositions — En vs Par vs À vs Dans", "variant": "warning", "content": "French uses different prepositions for different types of transport:\\n\\n• EN: enclosed vehicles (car, bus, train, plane, boat) → en voiture, en bus, en train, en avion, en bateau\\n• À: non-enclosed / small vehicles → à pied (on foot), à vélo (by bike), à moto\\n• PAR: rarely used, more formal → par le train, par avion (on tickets)\\n• DANS: inside a specific vehicle → je suis dans le train (I'm on the train)\\n\\nKey rule: 'en' = method of transport; 'dans' = physically inside the vehicle." }
\`\`\`

## Transport Vocabulary

| French | English |
|--------|---------|
| le train | train |
| le TGV | high-speed train (Train à Grande Vitesse) |
| le métro | metro/subway |
| le bus / l'autobus | bus |
| le tramway | tram |
| le taxi | taxi |
| l'avion | plane |
| le bateau | boat/ferry |
| le vélo / le vélib' | bicycle / bike-share |
| la voiture | car |
| la moto | motorbike |
| à pied | on foot |

## At the Train Station (À la Gare)

| French | English |
|--------|---------|
| un aller simple | a one-way ticket |
| un aller-retour | a return ticket |
| le quai | platform |
| le guichet | ticket window |
| le billet | ticket |
| la voie | track |
| le départ | departure |
| l'arrivée | arrival |
| en retard | late/delayed |
| à l'heure | on time |
| la correspondance | connection/transfer |
| valider son billet | to validate your ticket (mandatory in France!) |

\`\`\`concept
{ "title": "IMPORTANT: Validate Your Ticket!", "variant": "warning", "content": "On French regional trains and older bus systems, you MUST 'composter' (validate) your ticket in the yellow machine on the platform BEFORE boarding. Failure to do so risks a fine even if you have a valid ticket. This doesn't apply to TGV tickets (printed with seat reservation) or metro tickets (validated at the barrier), but always check signage. The verb: 'Je dois composter mon billet.' (I must validate my ticket.)" }
\`\`\`

## Buying a Ticket — Key Dialogue

| Situation | French |
|-----------|--------|
| Ask for a ticket | Je voudrais un billet pour Lyon, s'il vous plaît. |
| One-way or return? | Un aller simple ou un aller-retour ? |
| First or second class? | En première ou en deuxième classe ? |
| When do you want to travel? | Pour quand ? / Pour quel jour ? |
| What time? | À quelle heure ? |
| Which platform? | C'est quel quai ? |
| Is the train late? | Est-ce que le train est en retard ? |

\`\`\`quiz
{ "question": "You're telling someone you got to Paris BY PLANE. Which sentence is correct?", "options": ["Je suis arrivé dans l'avion.", "Je suis arrivé en avion.", "Je suis arrivé à l'avion.", "Je suis arrivé par avion."], "answer": 1, "explanation": "For means of transport: use 'EN' for enclosed vehicles: 'Je suis arrivé EN avion.' 'Dans l'avion' means physically inside the plane (I was inside the plane), not 'by plane'. 'Par avion' is formal/postal usage (seen on airmail)." }
\`\`\`

\`\`\`takeaways
{ "points": ["EN for enclosed transport methods: en voiture, en bus, en train, en avion, en bateau", "À for non-enclosed: à pied, à vélo, à moto", "Essential station vocab: billet (ticket), quai (platform), aller simple (one-way), aller-retour (return)", "Must validate ticket (composter) before boarding regional trains", "Key questions at ticket office: 'Je voudrais un billet pour...' and 'C'est quel quai ?'"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m6",
    moduleTitle: "Getting Around",
    order: 2,
    topicId: "fr-m6-l20-transport",
    vocabulary: [
      { word: "en train", translation: "by train", pronunciation: "ahn TRAN", exampleSentence: "Je voyage souvent en train.", exampleTranslation: "I often travel by train.", partOfSpeech: "prepositional phrase" },
      { word: "un billet", translation: "a ticket", pronunciation: "uh bee-YEH", exampleSentence: "Je voudrais un billet pour Marseille.", exampleTranslation: "I'd like a ticket to Marseille.", partOfSpeech: "noun" },
      { word: "un aller-retour", translation: "a return ticket", pronunciation: "uh-nah-lay-ruh-TOOR", exampleSentence: "Un aller-retour Paris–Lyon, s'il vous plaît.", exampleTranslation: "A return ticket Paris–Lyon, please.", partOfSpeech: "noun phrase" },
      { word: "le quai", translation: "the platform", pronunciation: "luh KAY", exampleSentence: "Le TGV part du quai numéro cinq.", exampleTranslation: "The TGV departs from platform five.", partOfSpeech: "noun" },
      { word: "en retard", translation: "late / delayed", pronunciation: "ahn ruh-TAHR", exampleSentence: "Le train est en retard de vingt minutes.", exampleTranslation: "The train is twenty minutes late.", partOfSpeech: "adjectival phrase" },
    ],
    grammarPoints: [
      {
        title: "Pour + Destination vs À + Location",
        explanation: "When buying tickets, use **pour** + destination (where you're going TO): *un billet pour Lyon*. When stating where something IS, use **à** or **en**: *je suis à Lyon* (I'm in Lyon), *j'habite en France* (I live in France).",
        examples: [
          { correct: "Je voudrais un billet pour Nice.", translation: "I'd like a ticket to Nice. (destination → pour)" },
          { correct: "Je suis à Nice.", translation: "I'm in Nice. (location → à)" },
          { correct: "Le train pour Paris part à 14h.", translation: "The train TO Paris departs at 2pm. (destination → pour)" },
        ],
        commonMistakes: [
          { incorrect: "Un billet à Paris.", correction: "Un billet pour Paris.", explanation: "For ticket destinations, always use 'pour': 'un billet POUR Paris', not 'à Paris'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m6-l20-voice",
        title: "At the SNCF Ticket Counter",
        situation: "You are at a SNCF (French national railway) ticket window in Paris-Gare de Lyon",
        agentRole: "You are the SNCF ticket agent François. Help the traveller buy a ticket to Nice, ask about date, time preference, class, and whether they want a return.",
        userGoal: "Buy a train ticket to Nice for tomorrow morning, second class, return",
        targetPhrases: ["je voudrais", "pour Nice", "un aller-retour", "deuxième classe", "à quelle heure"],
        successCriteria: ["Specifies destination with pour", "Requests return ticket", "Specifies class and time", "Asks about platform"],
        hints: ["'Je voudrais un aller-retour pour Nice, s'il vous plaît' = I'd like a return to Nice please", "'Pour demain matin' = for tomorrow morning"],
      },
    ],
    culturalNotes: [
      {
        title: "The TGV — French Pride in Speed",
        content: "The TGV (Train à Grande Vitesse — High Speed Train) is one of France's greatest engineering achievements and a source of national pride. Launched in 1981 between Paris and Lyon, it holds multiple speed records (574.8 km/h in tests). Today, TGV routes connect Paris to most major French cities and several European capitals (London via Eurostar, Brussels, Amsterdam, Frankfurt). Paris to Lyon = 2h. Paris to Marseille = 3h15. Booking in advance (SNCF Connect app or website) offers significant discounts. The French say: 'Voyager autrement' — travelling differently.",
        region: "France",
      },
    ],
  },

  {
    id: "fr-l21",
    slug: "near-future-plans",
    title: "Making Plans — The Near Future & Talking About What's Next",
    content: `# Making Plans — Le Futur Proche

You've already seen the futur proche briefly. This lesson makes it fully explicit, contrasts it with the present tense, and gives you all the vocabulary you need to discuss plans, intentions, and the immediate future.

\`\`\`concept
{ "title": "Futur Proche — The Near Future", "variant": "info", "content": "The futur proche (near future) is formed with:\\n\\nALLER (conjugated) + INFINITIVE\\n\\n• Je vais manger. (I'm going to eat.)\\n• Tu vas voyager. (You're going to travel.)\\n• Il va partir. (He's going to leave.)\\n• Nous allons travailler. (We're going to work.)\\n• Vous allez comprendre. (You're going to understand.)\\n• Ils vont arriver. (They're going to arrive.)\\n\\nIt expresses: imminent future, intentions, plans already decided." }
\`\`\`

## Futur Proche vs Present Tense vs English

| Meaning | French | English |
|---------|--------|---------|
| Habitual action | Je mange à midi. | I eat at noon. |
| Happening now | Je mange (maintenant). | I'm eating (now). |
| Going to (near future) | Je vais manger. | I'm going to eat. / I'll eat. |

French present tense covers both English 'I eat' and 'I am eating'. The futur proche adds future intention.

## Expressing Plans — Useful Phrases

| French | English |
|--------|---------|
| Qu'est-ce que tu vas faire ce weekend ? | What are you going to do this weekend? |
| Je vais + infinitive | I'm going to... |
| On va + infinitive | We're going to... |
| Tu veux + infinitive ? | Do you want to...? |
| On pourrait + infinitive | We could... (conditional) |
| Ça te dit de + infinitive ? | Do you feel like...? |
| C'est une bonne idée ! | That's a good idea! |
| Avec plaisir ! | With pleasure! (accepting) |
| Je suis désolé(e), je ne peux pas. | I'm sorry, I can't. |

## Negation of Futur Proche

Wrap ne...pas around the conjugated ALLER (not the infinitive):

| Affirmative | Negative |
|-------------|----------|
| Je vais voyager. | Je **ne** vais **pas** voyager. |
| Elle va partir. | Elle **ne** va **pas** partir. |
| Ils vont travailler. | Ils **ne** vont **pas** travailler. |

## Time Expressions for Future Plans

| French | English |
|--------|---------|
| ce soir | tonight |
| demain | tomorrow |
| demain matin / soir | tomorrow morning/evening |
| après-demain | the day after tomorrow |
| ce weekend | this weekend |
| la semaine prochaine | next week |
| le mois prochain | next month |
| l'année prochaine | next year |
| bientôt | soon |
| dans deux jours / semaines | in two days / weeks |

\`\`\`quiz
{ "question": "Your French friend says 'On va au cinéma ce soir ?' What are they suggesting?", "options": ["Did we go to the cinema last night?", "Do we usually go to the cinema in the evening?", "Shall we go to the cinema tonight? / Are we going to the cinema tonight?", "Are you going to the cinema alone this evening?"], "answer": 2, "explanation": "'On va au cinéma ce soir ?' = 'Are we going to the cinema tonight?' / 'Shall we go to the cinema tonight?' — using futur proche (or present tense with future time expression) as an invitation/suggestion. 'On' = we." }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'She's not going to come tomorrow' in French?", "options": ["Elle ne va pas venir demain.", "Elle va ne pas venir demain.", "Elle ne vient pas aller demain.", "Elle ne va venir pas demain."], "answer": 0, "explanation": "Negation wraps around the conjugated ALLER: 'Elle NE va PAS venir demain.' 'Venir' (to come) is the infinitive — it stays unchanged. The ne...pas sandwich goes around 'va', not around 'venir'." }
\`\`\`

\`\`\`takeaways
{ "points": ["Futur proche = aller (conjugated) + infinitive → je vais manger, tu vas partir, ils vont arriver", "Negation of futur proche: NE wraps around ALLER — je NE vais PAS manger", "Key invitation phrases: 'Tu veux venir ?' / 'On pourrait...' / 'Ça te dit de... ?'", "Time expressions: ce soir, demain, la semaine prochaine, dans deux jours", "Futur proche covers English 'going to' AND often 'will' for near/planned futures"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m6",
    moduleTitle: "Getting Around",
    order: 3,
    topicId: "fr-m6-l21-near-future",
    vocabulary: [
      { word: "je vais + infinitif", translation: "I'm going to...", pronunciation: "zhuh VAY", exampleSentence: "Je vais visiter le Louvre demain.", exampleTranslation: "I'm going to visit the Louvre tomorrow.", partOfSpeech: "structure" },
      { word: "la semaine prochaine", translation: "next week", pronunciation: "lah suh-MEHN proh-SHEHN", exampleSentence: "La semaine prochaine, on va à Lyon.", exampleTranslation: "Next week, we're going to Lyon.", partOfSpeech: "noun phrase" },
      { word: "bientôt", translation: "soon", pronunciation: "BYAN-toh", exampleSentence: "On va se voir bientôt.", exampleTranslation: "We'll see each other soon.", partOfSpeech: "adverb" },
      { word: "ça te dit ?", translation: "does that appeal to you? / fancy it?", pronunciation: "sah tuh DEE", exampleSentence: "On va au restaurant ce soir — ça te dit ?", exampleTranslation: "We're going to the restaurant tonight — does that sound good to you?", partOfSpeech: "phrase" },
      { word: "avec plaisir", translation: "with pleasure / I'd love to", pronunciation: "ah-VEK pleh-ZEER", exampleSentence: "Tu veux venir ? — Avec plaisir !", exampleTranslation: "Do you want to come? — I'd love to!", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Quand + Present Tense for Future Events",
        explanation: "Unlike English, French does NOT use the future tense after 'quand' (when) in a future context — it uses the PRESENT tense. 'When I arrive' in the context of a future plan = 'quand j'arrive' (not 'quand je vais arriver').",
        examples: [
          { correct: "Quand j'arrive à Paris, je vais appeler.", translation: "When I arrive in Paris (future), I'm going to call. (present after quand)" },
          { correct: "Quand il fait beau, nous allons à la plage.", translation: "When the weather is nice, we go to the beach." },
        ],
        commonMistakes: [
          { incorrect: "Quand je vais arriver, je téléphone.", correction: "Quand j'arrive, je vais téléphoner.", explanation: "After 'quand' for future events, use the present tense. Reserve futur proche for the MAIN clause." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m6-l21-voice",
        title: "Planning a Weekend Trip with a Friend",
        situation: "You and your French friend are planning a weekend trip to Bordeaux",
        agentRole: "You are Julien, an enthusiastic planner. Suggest activities, ask about preferences, discuss what you'll both do using futur proche. React to suggestions positively or propose alternatives.",
        userGoal: "Plan a 2-day trip using futur proche, time expressions, and expressing agreement/preferences",
        targetPhrases: ["on va", "je vais", "ça te dit de", "la semaine prochaine", "avec plaisir"],
        successCriteria: ["Uses futur proche at least 4 times", "Proposes or accepts an activity", "Uses at least 2 time expressions", "Uses negation once"],
        hints: ["'On va visiter les vignobles ?' = Shall we visit the vineyards?", "'Je ne vais pas pouvoir conduire' = I won't be able to drive"],
      },
    ],
    culturalNotes: [
      {
        title: "Les Vacances — The Sacred French Holiday",
        content: "French workers are guaranteed 5 weeks of paid vacation annually by law. The grandes vacances (the big holidays) in July–August see a near-mass migration: Paris empties, factories close, and entire towns seem to relocate to the coast or mountains. The concept of 'les vacances' is so deeply embedded that planning future activities in French inevitably involves vacation planning. Common destinations: la Bretagne (Brittany, coast), la Provence, la Côte d'Azur, the Alps (les Alpes), and increasingly abroad. 'Où tu vas en vacances ?' (Where are you going on holiday?) is one of the most common French questions in spring.",
        region: "France",
      },
    ],
  },
];
