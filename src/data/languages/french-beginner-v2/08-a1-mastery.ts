import type { LanguageLesson } from "@/data/language-types";

export const a1MasteryLessons: LanguageLesson[] = [
  {
    id: "fr-l26",
    slug: "shopping-clothing",
    title: "Shopping, Prices & Clothing — Real-World French",
    content: `# Shopping, Prices & Clothing

Practical French for shops, markets, and boutiques — combining numbers, adjectives, partitives, and polite request structures you've mastered so far.

## Clothing Vocabulary

| French | English | Gender |
|--------|---------|--------|
| un manteau | coat | masc |
| une veste | jacket | fem |
| un pantalon | trousers (always singular in French!) | masc |
| une jupe | skirt | fem |
| une robe | dress | fem |
| un pull / un pullover | jumper / sweater | masc |
| une chemise | shirt (button-up) | fem |
| un t-shirt | t-shirt | masc |
| des chaussures (f) | shoes (always plural) | fem |
| des chaussettes (f) | socks | fem |
| un chapeau | hat | masc |
| une écharpe | scarf | fem |

## Colours — With Agreement

| French (m/f) | English |
|-------------|---------|
| rouge / rouge | red (invariable) |
| bleu / bleue | blue |
| vert / verte | green |
| noir / noire | black |
| blanc / blanche | white (irregular!) |
| gris / grise | grey |
| jaune / jaune | yellow (invariable) |
| rose / rose | pink (invariable) |
| marron / marron | brown (invariable) |
| violet / violette | purple (double t!) |

**Note:** 'Blanc' → 'blanche' (fem): the C changes to CH. 'Violet' → 'violette' (doubles T).

## In the Shop — Key Dialogue

| Situation | French |
|-----------|--------|
| Can I help you? | Je peux vous aider ? / Vous cherchez quelque chose ? |
| I'm just looking. | Je regarde, merci. |
| I'm looking for... | Je cherche... |
| Do you have this in a different colour? | Avez-vous ceci dans une autre couleur ? |
| What size do you take? | Quelle est votre taille ? |
| Can I try this on? | Est-ce que je peux l'essayer ? |
| The fitting room | La cabine d'essayage |
| It fits / suits me. | Ça me va. |
| It's too big/small/tight/loose. | C'est trop grand/petit/serré/large. |
| How much is it? | C'est combien ? / Quel est le prix ? |
| I'll take it. | Je le/la prends. |
| Do you accept credit cards? | Vous acceptez les cartes bancaires ? |

## Prices and Numbers Review

In shops, prices use the euro (€) and cent:
- 3,50 € = "trois euros cinquante"
- 12,99 € = "douze euros quatre-vingt-dix-neuf"
- 200 € = "deux cents euros" (note the S on cents when it stands alone)

\`\`\`concept
{ "title": "Le Solde — Sales and Bargains", "variant": "info", "content": "France has regulated sale periods: les soldes d'hiver (winter sales, January) and les soldes d'été (summer sales, June-July). Outside these official periods, discounts are called 'promotions' not 'soldes'. Key vocabulary:\\n• une réduction / une remise = a discount\\n• à moitié prix = at half price\\n• en solde = on sale\\n• gratuit = free\\n• la TVA = VAT (already included in French prices by law)" }
\`\`\`

\`\`\`quiz
{ "question": "A shop assistant says 'Ça vous va très bien !' What do they mean?", "options": ["It's very expensive.", "It suits you very well / It fits you very well.", "The colour goes well with the shop display.", "You've made a very good choice."], "answer": 1, "explanation": "'Ça vous va' = 'it goes for you' = 'it suits you / it fits you'. A very common phrase in clothes shopping. 'Vous' = formal you. 'Ça me va' = it suits me / it fits me." }
\`\`\`

\`\`\`takeaways
{ "points": ["'Un pantalon' is always singular in French (unlike English 'trousers' which is plural)", "Colours after nouns, agree in gender: une robe verte (fem), un pull vert (masc)", "Invariable colours (don't change form): rouge, rose, jaune, marron, orange", "Irregular: blanc → blanche (fem); violet → violette (fem)", "'Ça me va' = it fits/suits me; 'Je le/la prends' = I'll take it (le = masc item, la = fem item)"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m8",
    moduleTitle: "A1 Mastery",
    order: 1,
    topicId: "fr-m8-l26-shopping",
    vocabulary: [
      { word: "je cherche", translation: "I'm looking for", pronunciation: "zhuh SHEHRSH", exampleSentence: "Je cherche une veste noire.", exampleTranslation: "I'm looking for a black jacket.", partOfSpeech: "verb phrase" },
      { word: "ça me va", translation: "it suits me / it fits me", pronunciation: "sah muh VAH", exampleSentence: "Cette robe me va très bien.", exampleTranslation: "This dress suits me very well.", partOfSpeech: "phrase" },
      { word: "c'est combien ?", translation: "how much is it?", pronunciation: "seh komb-YAN", exampleSentence: "C'est combien, cette écharpe ?", exampleTranslation: "How much is this scarf?", partOfSpeech: "question" },
      { word: "je le / la prends", translation: "I'll take it (masc/fem)", pronunciation: "zhuh luh/lah PRAHN", exampleSentence: "Il me va bien — je le prends.", exampleTranslation: "It fits me well — I'll take it.", partOfSpeech: "phrase" },
      { word: "trop", translation: "too (much) / too (adjective)", pronunciation: "TROH", exampleSentence: "C'est trop cher pour moi.", exampleTranslation: "It's too expensive for me.", partOfSpeech: "adverb" },
    ],
    grammarPoints: [
      {
        title: "Object Pronouns le/la/les — Replacing the Item",
        explanation: "To avoid repeating the noun, use direct object pronouns: **le** (him/it, masc), **la** (her/it, fem), **les** (them, m+f). These go BEFORE the verb in French (unlike English). 'Je prends le manteau' → 'Je **le** prends.' 'J'achète les chaussures' → 'Je **les** achète.'",
        examples: [
          { correct: "— Tu aimes cette robe ? — Oui, je la prends.", translation: "— Do you like this dress? — Yes, I'll take it. (la = la robe, feminine)" },
          { correct: "— Tu veux ce manteau ? — Non, je ne le veux pas.", translation: "— Do you want this coat? — No, I don't want it. (le = le manteau, masculine)" },
        ],
        commonMistakes: [
          { incorrect: "Je prends le.", correction: "Je le prends.", explanation: "Object pronouns go BEFORE the verb in French. 'Je le prends', not 'je prends le'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m8-l26-voice",
        title: "Boutique Shopping in the Marais",
        situation: "You are shopping for a gift in a boutique in le Marais, Paris",
        agentRole: "You are the boutique assistant Élise. Welcome the customer, ask what they're looking for, show options, discuss colours and sizes, handle the transaction.",
        userGoal: "Browse, ask about options, try something on, negotiate, and make a purchase",
        targetPhrases: ["je cherche", "avez-vous", "quelle taille", "c'est trop", "je le/la prends"],
        successCriteria: ["States what they're looking for", "Asks about colours or sizes", "Uses a comparison (trop grand/petit)", "Completes the purchase"],
        hints: ["'Je cherche un cadeau pour ma mère' = I'm looking for a gift for my mother", "'Est-ce que je peux l'essayer ?' = Can I try it on?"],
      },
    ],
    culturalNotes: [
      {
        title: "Fashion and the French Identity",
        content: "Paris is one of the world's four fashion capitals (alongside Milan, New York, London). French fashion (la mode française) is a €150 billion industry and a major cultural export. But everyday French style is less about high fashion and more about understated elegance: quality over quantity, neutral colours, and a few key pieces worn well. The concept of *effortless chic* (le style décontracté-élégant) — looking put-together without appearing to try — is distinctly French. Shopping vintage (la fripe) is also culturally valued, especially among younger Parisians.",
        region: "France",
      },
    ],
  },

  {
    id: "fr-l27",
    slug: "health-body-doctor",
    title: "Health, Body & At the Doctor — Useful Survival French",
    content: `# Health, Body & At the Doctor

Being able to communicate health issues in French is essential survival vocabulary. This lesson also introduces a new pattern: **avoir mal à** (to have pain at/in) + body part with article.

## Body Parts

| French | English | Article |
|--------|---------|---------|
| la tête | head | fem |
| le visage | face | masc |
| les yeux (m) | eyes | masc plural |
| l'oreille | ear | fem |
| le nez | nose | masc |
| la bouche | mouth | fem |
| les dents (f) | teeth | fem plural |
| la gorge | throat | fem |
| le cou | neck | masc |
| l'épaule | shoulder | fem |
| le bras | arm | masc |
| la main | hand | fem |
| le dos | back | masc |
| le ventre | stomach/belly | masc |
| la jambe | leg | fem |
| le pied | foot | masc |
| le genou | knee | masc |

## Avoir Mal À — The Pain Expression

| French | English |
|--------|---------|
| **J'ai mal à la tête.** | I have a headache. (lit. I have pain at the head) |
| **J'ai mal au dos.** | My back hurts. (à + le = au) |
| **J'ai mal aux dents.** | I have toothache. (à + les = aux) |
| **J'ai mal à la gorge.** | I have a sore throat. |
| **J'ai mal à l'oreille.** | My ear hurts. |
| **J'ai mal partout.** | I hurt all over. |

\`\`\`concept
{ "title": "The Construction: Avoir Mal À + Article", "variant": "info", "content": "The structure is FIXED: avoir mal + à + definite article + body part.\\n\\nThe article MUST agree with the body part:\\n• à + le = AU: j'ai mal AU dos (dos = masc)\\n• à + la = À LA: j'ai mal À LA tête (tête = fem)\\n• à + les = AUX: j'ai mal AUX yeux (yeux = masc plural)\\n• à + l' = À L': j'ai mal À L'oreille (oreille = fem, starts with vowel)\\n\\nNever omit the article: NOT 'j'ai mal dos' — always 'j'ai mal AU dos'." }
\`\`\`

## At the Doctor — Key Phrases

| French | English |
|--------|---------|
| J'ai de la fièvre. | I have a fever. |
| Je tousse. | I have a cough. / I'm coughing. |
| J'ai le rhume. / J'ai un rhume. | I have a cold. |
| Je suis enrhumé(e). | I have a cold (I'm stuffed up). |
| Je me sens mal. | I feel unwell. |
| Je suis fatigué(e) / épuisé(e). | I'm tired / exhausted. |
| J'ai des nausées. | I have nausea. / I feel sick. |
| Je suis allergique à... | I'm allergic to... |
| Depuis combien de temps ? | How long have you had this? |
| Depuis hier / deux jours. | Since yesterday / for two days. |
| Je prends des médicaments. | I take medication. |
| Une ordonnance | A prescription |
| Une pharmacie | A pharmacy |

## Depuis — For How Long

**Depuis** expresses duration from the past to now. Used with **present tense** (unlike English which uses 'have been' + past):

| French | English |
|--------|---------|
| J'ai mal à la gorge **depuis** deux jours. | My throat has been sore **for** two days. |
| Il tousse **depuis** ce matin. | He has been coughing **since** this morning. |
| Je suis à Paris **depuis** une semaine. | I've been in Paris **for** a week. |

\`\`\`quiz
{ "question": "How do you say 'I have a stomachache' in French?", "options": ["J'ai mal ventre.", "J'ai mal au ventre.", "J'ai mal à ventre.", "J'ai un mal de ventre."], "answer": 1, "explanation": "'J'ai mal AU ventre' — 'ventre' (stomach) is masculine, so à + le = au. Never drop the article: not 'j'ai mal ventre'. 'Un mal de ventre' is also used colloquially but 'j'ai mal au ventre' is the standard form." }
\`\`\`

\`\`\`takeaways
{ "points": ["J'ai mal à + definite article + body part: j'ai mal AU dos, À LA tête, AUX dents, À L'oreille", "Contractions: à + le = au, à + les = aux; don't contract à + la or à + l'", "Depuis + present tense = for/since (how long something has been going on)", "J'ai de la fièvre (fever), je tousse (cough), je suis enrhumé(e) (cold)", "Chez le médecin: bring ordonnance (prescription) to the pharmacie for médicaments"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m8",
    moduleTitle: "A1 Mastery",
    order: 2,
    topicId: "fr-m8-l27-health",
    vocabulary: [
      { word: "j'ai mal à la tête", translation: "I have a headache", pronunciation: "zhay MAL ah lah TET", exampleSentence: "J'ai mal à la tête depuis ce matin.", exampleTranslation: "I've had a headache since this morning.", partOfSpeech: "phrase" },
      { word: "depuis", translation: "for / since (duration to present)", pronunciation: "duh-PWEE", exampleSentence: "Je suis malade depuis trois jours.", exampleTranslation: "I've been ill for three days.", partOfSpeech: "preposition" },
      { word: "j'ai de la fièvre", translation: "I have a fever", pronunciation: "zhay duh lah FYEHVR", exampleSentence: "J'ai de la fièvre — 38,5 degrés.", exampleTranslation: "I have a fever — 38.5 degrees.", partOfSpeech: "phrase" },
      { word: "je me sens", translation: "I feel", pronunciation: "zhuh muh SAHN", exampleSentence: "Je me sens mieux aujourd'hui.", exampleTranslation: "I feel better today.", partOfSpeech: "reflexive verb phrase" },
      { word: "une ordonnance", translation: "a prescription", pronunciation: "ün or-doh-NAHNS", exampleSentence: "Le médecin m'a donné une ordonnance.", exampleTranslation: "The doctor gave me a prescription.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Depuis vs Il y a — Duration vs Point in the Past",
        explanation: "**Depuis + present tense** = an action/state that STARTED in the past and is STILL ONGOING: *Je suis à Paris depuis lundi* (I've been in Paris since Monday — I'm still here). **Il y a + time + passé composé** = a completed action a certain time ago: *Je suis arrivé à Paris il y a trois jours* (I arrived in Paris 3 days ago — specific moment, now complete).",
        examples: [
          { correct: "Je travaille ici depuis six mois. (still working here)", translation: "I've been working here for six months." },
          { correct: "J'ai commencé à travailler ici il y a six mois. (that moment of starting)", translation: "I started working here six months ago." },
        ],
        commonMistakes: [
          { incorrect: "J'ai travaillé ici depuis six mois.", correction: "Je travaille ici depuis six mois.", explanation: "With 'depuis' for ongoing duration, use PRESENT TENSE not passé composé. The passé composé would mean the working is finished." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m8-l27-voice",
        title: "At the Médecin Généraliste",
        situation: "You are at a French general practitioner's office with symptoms",
        agentRole: "You are Dr. Fontaine, a calm and professional GP. Ask about symptoms, how long they've had them, medical history, allergies. Suggest a diagnosis and give advice.",
        userGoal: "Describe your symptoms using avoir mal à + body parts and depuis for duration",
        targetPhrases: ["j'ai mal à", "depuis", "j'ai de la fièvre", "je me sens", "je suis allergique à"],
        successCriteria: ["Uses avoir mal à with correct article at least twice", "Uses depuis for duration", "Describes at least 3 symptoms", "Answers questions about allergies or medical history"],
        hints: ["'J'ai mal à la gorge et à la tête depuis deux jours' = My throat and head have hurt for two days", "'Je ne prends pas de médicaments habituellement' = I don't usually take medication"],
      },
    ],
    culturalNotes: [
      {
        title: "La Sécu — French Healthcare System",
        content: "France has one of the world's best healthcare systems, known as la Sécurité Sociale (la Sécu). Most residents are covered by this public health insurance, which reimburses 70-100% of basic medical costs. A visit to a médecin généraliste (GP) costs around €25, of which about €17.50 is reimbursed. The pharmacist (le pharmacien) plays a much bigger advisory role in France than in the UK/US — many minor health issues are handled at the pharmacie without a GP visit. Look for the green cross (croix verte) outside pharmacies.",
        region: "France",
      },
    ],
  },

  {
    id: "fr-l28",
    slug: "a1-capstone",
    title: "A1 Capstone — Review, Conversation Marathon & What's Next",
    content: `# A1 Capstone — You've Come a Long Way

You've covered the complete A1 syllabus. Before moving to A2, this lesson reviews what you've achieved, identifies your remaining gaps, and prepares you for what comes next.

\`\`\`concept
{ "title": "What You Can Do at A1", "variant": "info", "content": "At A1 (CEFR), you can:\\n\\n• Introduce yourself and others\\n• Ask and answer simple questions about personal details\\n• Interact in a simple way when the other person speaks slowly\\n• Understand familiar words and very basic phrases\\n• Make yourself understood in familiar routine situations\\n• Describe where you live and people you know\\n• Handle very basic transactions (shop, café, transport)\\n\\nWhat A1 does NOT mean: fluency, fast comprehension, or complex topics — those come at B1-B2." }
\`\`\`

## Complete Grammar Reference — A1 Checklist

| Topic | Status | Key Point |
|-------|--------|-----------|
| Pronunciation (sounds, nasals, liaison) | ✓ | French R, nasal vowels, silent letters |
| Greetings and politeness | ✓ | Bonjour mandatory, vous vs tu |
| Être and avoir | ✓ | Both conjugations + key expressions |
| Grammatical gender | ✓ | Every noun has gender; articles agree |
| Articles (definite, indefinite, partitive) | ✓ | le/la/les, un/une/des, du/de la/de l' |
| Adjective agreement | ✓ | Gender + number + BAGS position |
| Possessives and demonstratives | ✓ | mon/ma/mes; ce/cette/cet/ces |
| Regular -ER verbs | ✓ | Drop -er, add -e/-es/-e/-ons/-ez/-ent |
| Key irregular verbs | ✓ | Aller, faire, prendre, pouvoir, vouloir |
| Negation (ne...pas, jamais, plus, rien) | ✓ | Sandwich around conjugated verb |
| Questions (inversion, est-ce que, intonation) | ✓ | 3 methods, question words |
| Numbers 0-100, dates, time | ✓ | 70-99 base-20 traps |
| Reflexive verbs (se lever, se coucher...) | ✓ | me/te/se/nous/vous/se before verb |
| Partitive articles (du/de la/de l') | ✓ | Substance + de after negation |
| Futur proche (aller + infinitive) | ✓ | Intention, plans, near future |
| Passé composé with avoir | ✓ | Past participles (-é/-i/-u + irregulars) |
| Passé composé with être | ✓ | DR & MRS VANDERTRAMP + agreement |
| Imparfait | ✓ | States, habits, background |
| PC vs imparfait | ✓ | Events vs background — the key distinction |

## What's Next — A2 Preview

At A2 you'll learn:
- **More verb tenses**: futur simple (I will...), conditionnel présent (I would...)
- **Comparative and superlative**: plus grand que (bigger than), le plus grand (the biggest)
- **Object pronouns**: me, te, lui, leur, y, en — the six you'll need constantly
- **More irregular verbs**: venir, tenir, partir, dormir, devoir, savoir
- **Subjunctive** (just the basics): il faut que + subjunctive
- **More complex negation**: ne...ni...ni (neither...nor)
- **Richer vocabulary**: emotions, politics, media, culture

\`\`\`steps
{ "title": "How to Consolidate Your A1 French Now", "steps": [ { "title": "Speak daily — even for 5 minutes", "description": "Use the voice scenarios in this course. Talk to yourself in French while commuting. Even thinking in French counts." }, { "title": "Watch French content with French subtitles", "description": "Try: Lupin (Netflix), Le Bureau des Légendes, Intouchables (film), Astérix. Start with subtitles in French, not English." }, { "title": "Read simple French texts", "description": "Children's books in French, the simple Le Monde en français newsletter, or 1jour1actu (daily news in simple French)." }, { "title": "Use the 3 strategies for new vocabulary", "description": "1) Learn nouns WITH their article. 2) Learn verbs in a sentence. 3) Learn adjectives in their full m/f forms." }, { "title": "Find a French conversation partner", "description": "Apps: Tandem, HelloTalk, italki. Aim for 30 minutes/week minimum of real conversation — no substitutes for this." } ] }
\`\`\`

\`\`\`quiz
{ "question": "Which of these is a correct A1-level French sentence?", "options": ["Je suis allé au marché hier et j'ai acheté des légumes frais.", "J'ai été allé hier au le marché et achetais des légumes.", "Je suis allé hier marché et des légumes ai acheté frais.", "Je allais marché hier et j'acheté des légumes frais."], "answer": 0, "explanation": "'Je suis allé au marché hier et j'ai acheté des légumes frais.' — aller uses être (je suis allé), marché is reached via à+le=au, hier signals passé composé, acheter uses avoir (j'ai acheté), légumes takes des (plural indefinite), frais agrees with légumes (masc pl → frais). All rules applied correctly." }
\`\`\`

\`\`\`quiz
{ "question": "Which sentence correctly uses the imparfait AND passé composé?", "options": ["Il pleuvait quand je sortais.", "Il pleuvait quand je suis sorti.", "Il a plu quand je suis sorti.", "Il pleuvait quand j'ai pleuré."], "answer": 1, "explanation": "'Il pleuvait' (IMP — ongoing background weather) 'quand je suis sorti' (PC — the specific event of going out). The interrupted action pattern: imparfait (ongoing) + quand + passé composé (the interrupting event). Option C ('il a plu quand je suis sorti') would suggest two simultaneous completed events, which changes the meaning." }
\`\`\`

\`\`\`compare
{ "title": "A1 Achieved vs A2 Goals", "left": { "label": "A1 — What you can do NOW", "items": ["Introduce yourself and have a basic conversation", "Navigate transport, shopping, restaurants", "Describe your family, home, daily routine", "Talk about past events and childhood", "Make plans using futur proche", "Survive a visit to the doctor"] }, "right": { "label": "A2 — What you'll be able to do next", "items": ["Hold a conversation on familiar topics without preparation", "Understand main points of clear standard speech", "Write simple personal letters and emails", "Describe experiences, plans, and dreams", "Discuss likes, dislikes, and opinions fluently", "Navigate most travel situations independently"] } }
\`\`\`

\`\`\`takeaways
{ "points": ["You've mastered all 19 core A1 grammar topics — from phonetics to past tenses", "A1 means you can handle familiar situations slowly — A2 is where real conversation starts", "Daily speaking practice (even 5 minutes) is worth more than hours of passive reading", "Watch French content with FRENCH subtitles — not English — to build reading + listening simultaneously", "Your next milestones: object pronouns (me/te/lui/y/en), futur simple, comparatives — all A2 targets"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m8",
    moduleTitle: "A1 Mastery",
    order: 3,
    topicId: "fr-m8-l28-capstone",
    vocabulary: [
      { word: "félicitations !", translation: "congratulations!", pronunciation: "fay-lee-see-tah-SYOHN", exampleSentence: "Félicitations pour avoir terminé le cours !", exampleTranslation: "Congratulations on finishing the course!", partOfSpeech: "interjection" },
      { word: "je me débrouille", translation: "I manage / I get by", pronunciation: "zhuh muh day-BROOY", exampleSentence: "Je ne parle pas parfaitement mais je me débrouille.", exampleTranslation: "I don't speak perfectly but I get by.", partOfSpeech: "reflexive verb phrase" },
      { word: "continuer à + infinitif", translation: "to continue doing", pronunciation: "kohn-tee-nü-AY ah", exampleSentence: "Continuez à pratiquer chaque jour !", exampleTranslation: "Keep practising every day!", partOfSpeech: "verb phrase" },
      { word: "progresser", translation: "to make progress", pronunciation: "proh-greh-SAY", exampleSentence: "Vous avez beaucoup progressé.", exampleTranslation: "You have made a lot of progress.", partOfSpeech: "verb" },
      { word: "la prochaine étape", translation: "the next step", pronunciation: "lah proh-SHEHN ay-TAHP", exampleSentence: "La prochaine étape : le niveau A2.", exampleTranslation: "The next step: A2 level.", partOfSpeech: "noun phrase" },
    ],
    grammarPoints: [
      {
        title: "The Verb Manquer — An English Trap",
        explanation: "'**Manquer**' means 'to miss' but works backwards from English. In French, the thing missed is the SUBJECT and the person missing it is the INDIRECT OBJECT: *Tu me manques* (lit. You are missing to me = I miss you). This is a notorious false-friend trap.",
        examples: [
          { correct: "Tu me manques.", translation: "I miss you. (lit. You are missing to me)" },
          { correct: "Paris me manque.", translation: "I miss Paris. (lit. Paris is missing to me)" },
          { correct: "Mes amis me manquent.", translation: "I miss my friends. (manquent = plural because amis is subject)" },
        ],
        commonMistakes: [
          { incorrect: "Je vous manque. (trying to say 'I miss you')", correction: "Vous me manquez. (you are missing to me = I miss you)", explanation: "'Je vous manque' means 'You miss me' (I am missing TO you). Completely reversed from English intention." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m8-l28-voice",
        title: "Final Conversation Marathon — A Full Scenario",
        situation: "You have just arrived in Lyon for a week-long visit and you meet your host, Madame Dupont, for the first time",
        agentRole: "You are Madame Dupont, a warm and curious retired teacher in Lyon. Welcome the student, ask about their journey, their life, their reasons for coming to France, and plans for the week. Speak at a natural but clear pace.",
        userGoal: "Sustain a 10+ turn conversation covering: introduction, travel, background, plans, and preferences",
        targetPhrases: ["je suis arrivé(e)", "je viens de", "j'ai l'intention de", "j'aimerais", "c'est la première fois que"],
        successCriteria: ["Introduces themselves fully", "Recounts journey using passé composé", "States origin and background", "Describes plans using futur proche or j'aimerais", "Asks at least 2 questions in return", "Sustains conversation for 10+ turns without code-switching"],
        hints: ["'C'est la première fois que je viens en France' = It's my first time in France", "'J'aimerais visiter les Traboules et la Presqu'île' = I'd love to visit the Traboules and the Presqu'île"],
      },
    ],
    culturalNotes: [
      {
        title: "Lyon — France's Gastronomic Capital",
        content: "If Paris is the cultural heart of France, Lyon is its gastronomic soul. Chef Paul Bocuse elevated Lyon's cuisine to world fame; the city has more Michelin stars per capita than anywhere in France. The traditional Lyon restaurant is called a 'bouchon' — a cosy, rustic spot serving classic dishes: quenelles de brochet (pike dumplings), tablier de sapeur (breaded tripe), salade lyonnaise (with poached egg and lardons). Lyon is also where Lumière brothers invented cinema (1895) and where Interpol is headquartered. A city full of surprises — and an excellent place to use your new French.",
        region: "Lyon, Auvergne-Rhône-Alpes",
      },
    ],
  },
];
