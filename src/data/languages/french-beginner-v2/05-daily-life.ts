import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────
// MODULE 5: Daily Life (3 lessons)
// ─────────────────────────────────────────────────────────

export const dailyLifeLessons: LanguageLesson[] = [
  // ── LESSON 16 ── Time, Days & Months ─────────────────────
  {
    id: "fr-l16",
    slug: "time-days-months",
    title: "Time, Days, Months & Reflexive Verbs — Your Daily Routine",
    content: `# Time, Days, Months & Daily Routine

To talk about your daily life, you need time expressions AND reflexive verbs. Reflexive verbs are how French describes actions you do to yourself — getting up, washing yourself, getting dressed.

\`\`\`concept
{ "title": "What Is a Reflexive Verb?", "variant": "info", "content": "A reflexive verb has a REFLEXIVE PRONOUN (me, te, se, nous, vous, se) that shows the subject is both doing and receiving the action:\\n\\n• se lever = to get (oneself) up\\n• se laver = to wash (oneself)\\n• s'habiller = to dress (oneself)\\n• se coucher = to go to bed (to lay oneself down)\\n• se réveiller = to wake (oneself) up\\n\\nIn English, we often drop the reflexive: 'I get up', 'I wash'. French makes it explicit." }
\`\`\`

## Key Reflexive Verbs — Conjugation Pattern

Using **se lever** (to get up) as model:

| Pronoun | Reflexive pronoun | Verb | Full form |
|---------|------------------|------|-----------|
| je | **me** | lève | **je me lève** |
| tu | **te** | lèves | **tu te lèves** |
| il/elle/on | **se** | lève | **il se lève** |
| nous | **nous** | levons | **nous nous levons** |
| vous | **vous** | levez | **vous vous levez** |
| ils/elles | **se** | lèvent | **ils se lèvent** |

Note: se lever has the è spelling change (accent grave) in all forms except nous/vous.

## A Typical French Morning

| Time | Activity | French |
|------|----------|--------|
| 6h30 | wake up | Je me réveille. |
| 6h35 | get up | Je me lève. |
| 6h40 | shower | Je me douche. |
| 7h00 | get dressed | Je m'habille. |
| 7h15 | breakfast | Je prends le petit-déjeuner. |
| 7h45 | brush teeth | Je me brosse les dents. |
| 8h00 | leave | Je pars. / Je quitte la maison. |

## Time Expressions

| French | English |
|--------|---------|
| le matin | in the morning |
| l'après-midi | in the afternoon |
| le soir | in the evening |
| la nuit | at night |
| tôt | early |
| tard | late |
| d'abord | first |
| ensuite / puis | then / next |
| enfin | finally |
| tous les jours | every day |
| le lundi / le mardi... | on Mondays / on Tuesdays... |

## Days & Months (No Capitals in French)

**Days:** lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche
**Months:** janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre

\`\`\`concept
{ "title": "French Week Starts on Monday", "variant": "analogy", "content": "The French week starts on LUNDI (Monday), not Sunday. So in a French calendar, Monday is the first column. This affects expressions: 'le weekend' = samedi + dimanche. Also: 'ce lundi' = this Monday (coming up), 'lundi dernier' = last Monday, 'lundi prochain' = next Monday. Adding 'le' makes it habitual: 'le lundi je vais à la gym' = on Mondays I go to the gym." }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'I get up every day at 7am' in French?", "options": ["Je lève tous les jours à sept heures.", "Je me lève tous les jours à sept heures.", "Je se lève tous les jours à sept heures.", "Me lève je tous les jours sept heures."], "answer": 1, "explanation": "Reflexive verb: 'je ME lève' — the reflexive pronoun 'me' must appear between the subject 'je' and the verb 'lève'. 'Je lève' without 'me' would mean 'I raise (something else)', not 'I get up'." }
\`\`\`

\`\`\`takeaways
{ "points": ["Reflexive verbs use reflexive pronouns (me/te/se/nous/vous/se) between subject and verb", "Daily routine: se réveiller, se lever, se doucher, s'habiller, se coucher", "Time sequencers: d'abord, ensuite/puis, enfin — first, then, finally", "French week starts Monday; days and months are always lowercase", "Habitual action: add 'le' before day name → 'le lundi' = on Mondays (every Monday)"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m5",
    moduleTitle: "Daily Life",
    order: 1,
    topicId: "fr-m5-l16-time-routine",
    vocabulary: [
      { word: "se réveiller", translation: "to wake up", pronunciation: "suh ray-veh-YAY", exampleSentence: "Je me réveille à sept heures.", exampleTranslation: "I wake up at seven o'clock.", partOfSpeech: "reflexive verb" },
      { word: "se lever", translation: "to get up", pronunciation: "suh luh-VAY", exampleSentence: "Il se lève tôt le matin.", exampleTranslation: "He gets up early in the morning.", partOfSpeech: "reflexive verb" },
      { word: "se coucher", translation: "to go to bed", pronunciation: "suh koo-SHAY", exampleSentence: "On se couche tard le vendredi.", exampleTranslation: "We go to bed late on Fridays.", partOfSpeech: "reflexive verb" },
      { word: "ensuite", translation: "then / next", pronunciation: "ahn-SWEET", exampleSentence: "D'abord je mange, ensuite je travaille.", exampleTranslation: "First I eat, then I work.", partOfSpeech: "adverb" },
      { word: "tous les jours", translation: "every day", pronunciation: "too lay ZHOOR", exampleSentence: "Je fais du sport tous les jours.", exampleTranslation: "I do sports every day.", partOfSpeech: "adverbial phrase" },
    ],
    grammarPoints: [
      {
        title: "Negation of Reflexive Verbs",
        explanation: "In negation, **ne** goes before the reflexive pronoun (and the verb), **pas** goes after the verb: *je **ne** me lève **pas** tôt* (I don't get up early). The reflexive pronoun stays between ne and the verb.",
        examples: [
          { correct: "Je ne me lève pas le weekend.", translation: "I don't get up (early) on weekends." },
          { correct: "Elle ne se couche pas avant minuit.", translation: "She doesn't go to bed before midnight." },
        ],
        commonMistakes: [
          { incorrect: "Je me ne lève pas.", correction: "Je ne me lève pas.", explanation: "'Ne' goes before the reflexive pronoun: ne + me + verb + pas. Not 'me ne'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m5-l16-voice",
        title: "Morning Radio Interview",
        situation: "A French morning radio show interviews you about your daily routine",
        agentRole: "You are the radio host Émilie. Ask enthusiastically about the guest's morning routine, what time they wake up, what they do, and how they start their day.",
        userGoal: "Describe your full morning routine using at least 4 reflexive verbs and time expressions",
        targetPhrases: ["je me réveille", "je me lève", "ensuite", "je prends le petit-déjeuner"],
        successCriteria: ["Uses at least 4 reflexive verbs", "Includes time expressions", "Uses sequence markers (d'abord, ensuite, enfin)"],
        hints: ["'Je me réveille à...' = I wake up at...", "'D'abord je me douche, ensuite je m'habille' = First I shower, then I get dressed"],
      },
    ],
    culturalNotes: [
      {
        title: "Le Petit-Déjeuner — The French Breakfast",
        content: "The French breakfast is traditionally simple: a tartine (bread with butter and jam) or a croissant, with coffee (café au lait or café crème). Cereal or a cooked breakfast is not typical. Children often have hot chocolate (chocolat chaud). The elaborate breakfast is considered British or American — in France, the main event is déjeuner (lunch). Many French adults eat standing at the kitchen counter in under 10 minutes, which is partly why the French concept of 'le petit-déjeuner' is literally 'the little lunch'.",
        region: "France",
      },
    ],
  },

  // ── LESSON 17 ── Home & Family ────────────────────────────
  {
    id: "fr-l17",
    slug: "home-family",
    title: "Home, Family & Describing People",
    content: `# Home, Family & Describing People

Two of the most common conversation topics — your home and your family. These are also excellent practice grounds for adjective agreement, possessives, and the verbs avoir and être.

## Family Vocabulary

| French | English | Gender note |
|--------|---------|-------------|
| **le père** | father | masc |
| **la mère** | mother | fem |
| **le frère** | brother | masc |
| **la sœur** | sister | fem |
| **le fils** | son | masc (silent 'l'!) |
| **la fille** | daughter / girl | fem |
| **le mari** | husband | masc |
| **la femme** | wife / woman | fem |
| **le grand-père** | grandfather | masc |
| **la grand-mère** | grandmother | fem |
| **l'oncle** | uncle | masc |
| **la tante** | aunt | fem |
| **le neveu** | nephew | masc |
| **la nièce** | niece | fem |
| **le cousin / la cousine** | cousin (m/f) | both forms |

\`\`\`concept
{ "title": "Talking About Family — Possessives in Action", "variant": "info", "content": "Family is the perfect practice ground for possessives. Remember: the possessive agrees with the PERSON/THING owned, not the owner:\\n\\n• Mon père (my father) — père = masc → mon\\n• Ma mère (my mother) — mère = fem → ma\\n• Mes parents (my parents) — parents = plural → mes\\n• Son frère (his/her brother) — frère = masc → son\\n• Sa sœur (his/her sister) — sœur = fem → sa" }
\`\`\`

## Rooms of the House

| French | English |
|--------|---------|
| **la cuisine** | kitchen |
| **le salon / le séjour** | living room |
| **la salle à manger** | dining room |
| **la chambre (à coucher)** | bedroom |
| **la salle de bains** | bathroom |
| **les toilettes / les WC** | toilet |
| **l'entrée** | hallway/entrance |
| **le couloir** | corridor |
| **le bureau** | office/study |
| **le jardin** | garden |
| **le balcon** | balcony |
| **la cave** | cellar |
| **le grenier** | attic |

## Describing People's Appearance

| Feature | Descriptions |
|---------|-------------|
| **Size** | grand(e) (tall), petit(e) (short), mince (slim), gros/grosse (fat), de taille moyenne (average height) |
| **Hair** | les cheveux blonds/bruns/noirs/roux/gris/blancs; longs/courts; frisés (curly)/raides (straight) |
| **Eyes** | les yeux bleus/verts/marron/noirs (marron = invariable!) |
| **Age** | jeune, vieux/vieille, d'âge moyen (middle-aged) |
| **Character** | sympa (nice), gentil/gentille (kind), drôle (funny), sérieux/sérieuse (serious), bavard/bavarde (chatty) |

\`\`\`concept
{ "title": "Marron — The Invariable Adjective", "variant": "warning", "content": "'Marron' (brown, chestnut) is invariable — it NEVER changes for gender or number. This is because it was originally a noun (chestnut) used as a colour descriptor, like 'orange' in English.\\n\\n• Il a les yeux marron. (He has brown eyes.)\\n• Elle a les yeux marron. (She has brown eyes.) ← same form\\n• Compare: Il a les yeux bleus. / Elle a les yeux bleues. (bleu DOES agree)\\n\\nOther colour nouns that are invariable: orange, crème, bordeaux, marine." }
\`\`\`

## Describing Appearance — Full Example

\`\`\`
Ma mère est grande et mince.           My mother is tall and slim.
Elle a les cheveux bruns et courts.    She has short brown hair.
Elle a les yeux verts.                 She has green eyes.
Elle est très sympa et un peu sérieuse. She's very nice and a bit serious.
Elle a quarante-huit ans.              She's 48 years old.
\`\`\`

\`\`\`quiz
{ "question": "How do you describe 'brown eyes' in French? (the noun 'yeux' is masculine plural)", "options": ["les yeux marrons", "les yeux marron", "les yeux bruns", "les yeux brun"], "answer": 1, "explanation": "'Marron' is invariable — it never adds -s for plural or -e for feminine. Always: 'les yeux marron'. 'Brun(s)' is also brown but refers more to dark skin tone or hair. For eyes, 'marron' is standard and stays unchanged." }
\`\`\`

\`\`\`takeaways
{ "points": ["Family vocab: père/mère, frère/sœur, fils/fille, mari/femme, grand-père/grand-mère", "'Le fils' — the L is silent: 'le FIS'", "Describing appearance: avoir les cheveux + colour/length, avoir les yeux + colour", "Marron is invariable: les yeux marron (never marrons)", "Character adjectives after être: il est sympa, elle est gentille, ils sont sérieux"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m5",
    moduleTitle: "Daily Life",
    order: 2,
    topicId: "fr-m5-l17-home-family",
    vocabulary: [
      { word: "les parents", translation: "parents / relatives", pronunciation: "lay pah-RAHN", exampleSentence: "Mes parents habitent à Bordeaux.", exampleTranslation: "My parents live in Bordeaux.", partOfSpeech: "noun (plural)" },
      { word: "la sœur", translation: "sister", pronunciation: "lah SUHR", exampleSentence: "Ma sœur est médecin.", exampleTranslation: "My sister is a doctor.", partOfSpeech: "noun" },
      { word: "les cheveux", translation: "hair (always plural in French)", pronunciation: "lay shuh-VUH", exampleSentence: "Elle a les cheveux longs et blonds.", exampleTranslation: "She has long blonde hair.", partOfSpeech: "noun (plural)" },
      { word: "sympa", translation: "nice / friendly (invariable)", pronunciation: "SAN-pah", exampleSentence: "Ton frère est très sympa.", exampleTranslation: "Your brother is very nice.", partOfSpeech: "adjective" },
      { word: "habiter avec", translation: "to live with", pronunciation: "ah-bee-TAY ah-VEK", exampleSentence: "J'habite avec ma famille.", exampleTranslation: "I live with my family.", partOfSpeech: "verb phrase" },
    ],
    grammarPoints: [
      {
        title: "Avoir + Body Part for Descriptions",
        explanation: "To describe physical features, French uses **avoir** (to have) + definite article + body part + adjective. The adjective agrees with the body part, not with the person. Notice: English would say 'she has blue eyes' — French does the same structure: *elle a les yeux bleus*.",
        examples: [
          { correct: "Il a les cheveux courts et noirs.", translation: "He has short black hair. (cheveux = masc plural → courts/noirs)" },
          { correct: "Elle a les yeux verts.", translation: "She has green eyes. (yeux = masc plural → verts)" },
          { correct: "Elle a le nez long.", translation: "She has a long nose. (nez = masc singular → long)" },
        ],
        commonMistakes: [
          { incorrect: "Elle a les cheveux courtes.", correction: "Elle a les cheveux courts.", explanation: "'Cheveux' (hair) is MASCULINE plural — adjectives must agree: 'courts' (masc plural), not 'courtes' (fem plural). Even for a woman!" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m5-l17-voice",
        title: "Looking at Family Photos Together",
        situation: "You are showing a French friend your family photos on your phone",
        agentRole: "You are Camille, curious and warm. Ask about each family member in the photos — who they are, what they look like, their age, and what they do.",
        userGoal: "Describe at least 3 family members with appearance and character adjectives",
        targetPhrases: ["c'est mon/ma", "il/elle a ... ans", "il/elle a les cheveux", "il/elle est"],
        successCriteria: ["Correctly uses possessives", "Describes physical appearance", "Uses correct adjective agreement", "Mentions age with avoir"],
        hints: ["'C'est ma mère, elle a...' = This is my mother, she has...", "'Elle est grande et mince' = She is tall and slim"],
      },
    ],
    culturalNotes: [
      {
        title: "French Family Structure — Modern Reality",
        content: "The traditional French family (père, mère, 2-3 enfants) remains common, but France also has a high rate of unmarried couples (en concubinage or PACS — pacte civil de solidarité, a legal partnership short of marriage). 'Ma compagne' (my partner, fem) and 'mon compagnon' (my partner, masc) are standard terms. Blended families ('famille recomposée') are widespread. When a French person says 'ma famille', they typically mean their immediate nuclear family; extended family would be 'la famille élargie'. Family Sunday lunches ('le déjeuner du dimanche') are still a cultural institution for many.",
        region: "France",
      },
    ],
  },

  // ── LESSON 18 ── Food, Meals & Partitive Articles ─────────
  {
    id: "fr-l18",
    slug: "food-meals-partitives",
    title: "Food, Meals & Partitive Articles — Du, De la, De l', Des",
    content: `# Food, Meals & Partitive Articles

The partitive article is one of the most distinctly French grammatical features — it has no direct parallel in English. It expresses **an unspecified quantity of an uncountable substance**: some bread, some water, some courage.

\`\`\`concept
{ "title": "What Is a Partitive Article?", "variant": "info", "content": "English often uses no article for uncountable quantities: 'I eat bread', 'she drinks water', 'he needs courage'.\\n\\nFrench cannot leave the noun bare — it needs an article. For unspecified amounts of substance, French uses the PARTITIVE article:\\n• du = de + le (masculine): du pain, du vin, du fromage\\n• de la (feminine): de la soupe, de la salade, de la patience\\n• de l' (before vowel/H): de l'eau, de l'huile, de l'argent\\n• des (plural): des légumes, des fruits, des amis (= some)\\n\\nThink of the partitive as 'some' made mandatory." }
\`\`\`

## The Three Article Types — Side by Side

| Article | Use | Example |
|---------|-----|---------|
| **le/la/les** (definite) | Specific thing OR general category | J'aime **le** pain. (I like bread in general.) |
| **un/une/des** (indefinite) | One countable thing | Je veux **un** croissant. (one croissant, any one) |
| **du/de la/de l'/des** (partitive) | Some amount of uncountable | Je mange **du** pain. (I eat some bread.) |

\`\`\`compare
{ "title": "Definite vs Partitive — A Critical Distinction", "left": { "label": "Definite article (general/specific)", "items": ["J'aime LE fromage. (I like cheese — in general)", "Elle déteste LA viande. (She hates meat — in general)", "Le café est cher ici. (Coffee is expensive here — coffee as a category)"] }, "right": { "label": "Partitive (eating/drinking/using some)", "items": ["Je mange DU fromage. (I'm eating some cheese)", "Il boit DE LA bière. (He's drinking some beer)", "Je veux DU café. (I want some coffee — a portion of it)"] } }
\`\`\`

## Essential Food Vocabulary

| Food | French | Article |
|------|--------|---------|
| bread | le pain | du pain |
| cheese | le fromage | du fromage |
| meat | la viande | de la viande |
| fish | le poisson | du poisson |
| chicken | le poulet | du poulet |
| wine | le vin | du vin |
| water | l'eau (fem) | de l'eau |
| coffee | le café | du café |
| milk | le lait | du lait |
| salad | la salade | de la salade |
| soup | la soupe | de la soupe |
| rice | le riz | du riz |
| vegetables | les légumes | des légumes |
| fruit | les fruits | des fruits |

## Meals in France

| Meal | French | Typical time |
|------|--------|-------------|
| Breakfast | le petit-déjeuner | 7h–9h |
| Lunch | le déjeuner | 12h–14h |
| Snack (children) | le goûter | 16h–17h |
| Dinner | le dîner | 19h30–21h |

## At the Table — Key Phrases

| French | English |
|--------|---------|
| Bon appétit ! | Enjoy your meal! (said before eating) |
| C'est délicieux ! | It's delicious! |
| Je voudrais... | I'd like... (ordering) |
| L'addition, s'il vous plaît. | The bill, please. |
| Je suis végétarien(ne). | I'm vegetarian. |
| Sans gluten, s'il vous plaît. | Without gluten, please. |

\`\`\`quiz
{ "question": "Fill in the blank: 'Je bois ___ eau minérale.' (I drink mineral water.)", "options": ["du", "de la", "de l'", "une"], "answer": 2, "explanation": "'Eau' (water) is feminine and starts with a vowel, so the partitive is 'de l'': 'je bois DE L'EAU minérale'. 'De la' would normally apply to feminine nouns, but when the noun starts with a vowel or silent H, use 'de l'' instead." }
\`\`\`

\`\`\`quiz
{ "question": "After negation, which is correct? 'Je ne mange ___ viande.' (I don't eat meat.)", "options": ["pas du viande", "pas de la viande", "pas de viande", "pas viande"], "answer": 2, "explanation": "After negation (ne...pas), ALL partitive and indefinite articles become simply 'de' (or 'd'' before vowel): 'Je ne mange PAS DE viande.' Never 'de la', 'du', 'un', 'une', 'des' after negation — always 'de'." }
\`\`\`

\`\`\`takeaways
{ "points": ["Partitive article: du (masc), de la (fem), de l' (before vowel/H), des (plural) — meaning 'some'", "Use partitive when eating/drinking/using an unspecified amount: je mange du pain", "Use definite article for general preferences: j'aime le fromage (cheese in general)", "After negation: ALL partitives + indefinites → de/d': je ne mange pas de viande", "Bon appétit is said before eating — responding 'merci, vous aussi' is polite"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m5",
    moduleTitle: "Daily Life",
    order: 3,
    topicId: "fr-m5-l18-food-partitive",
    vocabulary: [
      { word: "du pain", translation: "some bread (partitive)", pronunciation: "dü PAN", exampleSentence: "Je voudrais du pain avec du beurre.", exampleTranslation: "I'd like some bread with butter.", partOfSpeech: "noun phrase" },
      { word: "de l'eau", translation: "some water (partitive, before vowel)", pronunciation: "duh LOH", exampleSentence: "Avez-vous de l'eau plate ou gazeuse ?", exampleTranslation: "Do you have still or sparkling water?", partOfSpeech: "noun phrase" },
      { word: "je voudrais", translation: "I would like", pronunciation: "zhuh voo-DREH", exampleSentence: "Je voudrais du poulet et des légumes.", exampleTranslation: "I'd like some chicken and vegetables.", partOfSpeech: "verb phrase" },
      { word: "l'addition", translation: "the bill (restaurant)", pronunciation: "lah-dee-SYON", exampleSentence: "L'addition, s'il vous plaît.", exampleTranslation: "The bill, please.", partOfSpeech: "noun" },
      { word: "végétarien(ne)", translation: "vegetarian", pronunciation: "vay-zhay-tah-RYAN/RYEHN", exampleSentence: "Je suis végétarienne depuis cinq ans.", exampleTranslation: "I've been vegetarian for five years.", partOfSpeech: "adjective/noun" },
    ],
    grammarPoints: [
      {
        title: "Expressing Hunger and Food Preferences",
        explanation: "Combine avoir (for hunger/thirst) with partitives and aimer (general likes) vs manger/boire (current action). Notice the article distinction: **J'aime le café** (I like coffee in general — definite) vs **Je bois du café** (I'm drinking coffee now — partitive).",
        examples: [
          { correct: "J'ai faim. Je mange du riz et des légumes.", translation: "I'm hungry. I'm eating some rice and vegetables." },
          { correct: "Tu aimes la soupe ? — Oui, mais je ne mange pas de soupe ce soir.", translation: "Do you like soup? — Yes, but I'm not eating soup tonight." },
          { correct: "Il boit du vin rouge avec de la viande.", translation: "He drinks red wine with meat." },
        ],
        commonMistakes: [
          { incorrect: "Je mange le pain.", correction: "Je mange du pain. (partitive for eating)", explanation: "'Je mange le pain' would mean 'I'm eating THE bread' — a specific bread. For unspecified eating, use partitive: 'je mange du pain'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m5-l18-voice",
        title: "Ordering Lunch at a Brasserie",
        situation: "You are ordering lunch at a classic Parisian brasserie",
        agentRole: "You are the waiter Pascal. Take the customer's order for a starter, main course, and drink. Make recommendations and ask about dietary restrictions.",
        userGoal: "Order a complete meal using partitive articles and polite ordering language",
        targetPhrases: ["je voudrais", "comme entrée", "comme plat principal", "je prends", "sans"],
        successCriteria: ["Orders starter, main, and drink", "Uses partitive articles correctly", "Asks or responds to a dietary question", "Uses polite register (je voudrais, s'il vous plaît)"],
        hints: ["'Comme entrée, je voudrais de la soupe' = As a starter, I'd like some soup", "'Je suis allergique aux noix' = I'm allergic to nuts"],
      },
    ],
    culturalNotes: [
      {
        title: "French Cheese — A Nation of 1,000 Varieties",
        content: "Charles de Gaulle famously asked: 'How can you govern a country that has 246 varieties of cheese?' (Modern counts exceed 1,000). Cheese is not a side dish in France — it's a course. After the main and before dessert, 'le plateau de fromages' is served. Common A1-level cheeses to know: le brie (soft, mild), le camembert (soft, pungent), le roquefort (blue, strong), le comté (hard, nutty), le chèvre (goat cheese). Saying 'je n'aime pas le fromage' to a French host is culturally significant — be prepared for gentle persuasion.",
        region: "France",
      },
    ],
  },
];
