// French Advanced Course Data
// CEFR C1 Level - Near-Native Proficiency, Nuance & Mastery

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "french-advanced",
  slug: "french-advanced",
  title: "French Advanced - Mastery",
  language: "fr",
  languageName: "French",
  proficiencyLevel: "C1" as const,
  description: "Achieve near-native command of French. Master nuance, register shifts, literary analysis, academic writing, and spontaneous argumentation across formal and informal contexts.",
  targetAudience: "Upper-intermediate learners ready to bridge the gap to near-native fluency",
  estimatedHours: 100,
  icon: "\u{1F1EB}\u{1F1F7}",
  prerequisiteCourseSlug: "french-intermediate",
};

// ============================================
// Module 1: Mastering Nuance
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "fr-adv-l1",
    slug: "registers-formality",
    title: "Formal vs. Informal Registers",
    content: `# Les registres de langue

At C1 level, you must navigate freely between **le registre soutenu** (formal), **le registre courant** (standard), and **le registre familier** (informal/colloquial).

## The Three Registers

### Soutenu (Formal/Literary)
Used in literature, official speeches, academic writing.
- **Nous nous en irons** - We shall depart
- **Il ne saurait en etre question** - There can be no question of it
- **Auriez-vous l'obligeance de...** - Would you be so kind as to...

### Courant (Standard)
Everyday polite French in professional and neutral contexts.
- **Nous allons partir** - We're going to leave
- **Ce n'est pas possible** - It's not possible
- **Pourriez-vous...** - Could you...

### Familier (Informal/Colloquial)
Among friends, casual settings, social media.
- **On se casse** - We're outta here
- **C'est pas possible** - No way (dropped 'ne')
- **Tu pourrais... ?** - Could you... ?

## Recognising and Switching Registers

The key markers are: **vocabulary choice**, **sentence structure** (inversion vs. est-ce que vs. intonation), and **negation** (presence or absence of 'ne').`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m1",
    moduleTitle: "Mastering Nuance",
    order: 1,
    topicId: "fr-advanced-registers-formality",
    vocabulary: [
      { word: "soutenu", translation: "formal/elevated (register)", pronunciation: "soo-tuh-NOO", exampleSentence: "Son discours etait dans un registre tres soutenu.", exampleTranslation: "His speech was in a very formal register.", partOfSpeech: "adjective" },
      { word: "familier", translation: "colloquial/informal", pronunciation: "fah-mee-LYAY", exampleSentence: "Evitez le langage familier dans votre dissertation.", exampleTranslation: "Avoid colloquial language in your essay.", partOfSpeech: "adjective" },
      { word: "auriez-vous l'obligeance de", translation: "would you be so kind as to", pronunciation: "oh-ree-AY voo loh-blee-ZHAHNS duh", exampleSentence: "Auriez-vous l'obligeance de fermer la porte ?", exampleTranslation: "Would you be so kind as to close the door?", partOfSpeech: "phrase" },
      { word: "se casser", translation: "to leave/get out (slang)", pronunciation: "suh kah-SAY", exampleSentence: "Allez, on se casse, c'est nul ici.", exampleTranslation: "Come on, let's bail, it's rubbish here.", partOfSpeech: "verb" },
      { word: "il ne saurait", translation: "it cannot possibly (literary)", pronunciation: "eel nuh soh-REH", exampleSentence: "Il ne saurait y avoir de doute.", exampleTranslation: "There can be no doubt.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Negation Across Registers",
        explanation: "In formal French, negation always uses **ne...pas** (and literary forms like **ne...point**, **ne...guere**). In spoken/informal French, the **ne** is routinely dropped: *je sais pas*, *c'est pas vrai*. At C1, you must master both and switch depending on context.",
        examples: [
          { correct: "Je ne comprends pas.", translation: "I don't understand. (standard/formal)", note: "Full negation with ne...pas" },
          { correct: "Je comprends pas.", translation: "I don't understand. (informal)", note: "Dropped ne — normal in speech" },
          { correct: "Il n'en est nullement question.", translation: "There is absolutely no question of it. (literary)", note: "ne...nullement — elevated register" },
        ],
        commonMistakes: [
          { incorrect: "Dropping ne in a formal essay", correction: "Always retain ne in written/formal French", explanation: "Omitting ne is a spoken register feature. In academic or professional writing, it reads as an error." },
        ],
      },
      {
        title: "Question Formation by Register",
        explanation: "French offers three ways to ask questions, each tied to register: **inversion** (formal), **est-ce que** (standard), **intonation only** (informal).",
        examples: [
          { correct: "Viendrez-vous demain ?", translation: "Will you come tomorrow? (formal — inversion)" },
          { correct: "Est-ce que vous viendrez demain ?", translation: "Will you come tomorrow? (standard)" },
          { correct: "Tu viens demain ?", translation: "You're coming tomorrow? (informal — rising intonation)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-register-switch",
        title: "The Register Switch",
        situation: "You are at a formal networking event, then step outside to chat with a close friend on the phone",
        agentRole: "You play two roles: first a senior diplomat at a reception who speaks in registre soutenu, then the student's best friend calling on the phone using registre familier. Switch mid-conversation.",
        userGoal: "Respond appropriately in each register — formal with the diplomat, casual with the friend",
        targetPhrases: ["Auriez-vous l'obligeance de...", "Enchante de faire votre connaissance", "On se casse", "T'inquiete"],
        successCriteria: ["Uses formal structures with diplomat", "Switches to informal with friend", "Drops ne naturally in casual speech", "Uses inversion or subjunctive in formal context"],
      },
    ],
    culturalNotes: [
      {
        title: "Tutoiement vs. Vouvoiement: The Unspoken Rules",
        content: "Choosing **tu** or **vous** is a social minefield even for advanced speakers. In corporate France, many workplaces now *tutoient* by default, but switching without invitation can offend. The offer to *tutoyer* ('On peut se tutoyer ?') is a social ritual — always let the senior or older person initiate it.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-adv-l2",
    slug: "idiomatic-expressions",
    title: "Idiomatic Expressions & Figurative Language",
    content: `# Expressions idiomatiques et langage figure

Idiomatic mastery separates fluent speakers from truly advanced ones. These expressions rarely translate literally.

## Body-Based Idioms
- **Avoir le cafard** - To feel depressed (lit. to have the cockroach)
- **Couter les yeux de la tete** - To cost an arm and a leg (lit. to cost the eyes of the head)
- **Avoir la chair de poule** - To have goosebumps (lit. chicken flesh)
- **Donner sa langue au chat** - To give up guessing (lit. give one's tongue to the cat)

## Everyday Figurative Expressions
- **Poser un lapin a quelqu'un** - To stand someone up
- **En faire tout un fromage** - To make a big deal of nothing (lit. make a whole cheese of it)
- **Avoir d'autres chats a fouetter** - To have bigger fish to fry (lit. other cats to whip)
- **Ce n'est pas la mer a boire** - It's not that hard (lit. it's not the sea to drink)

## Verlan and Contemporary Slang
- **meuf** (verlan of femme) - woman/girl
- **ouf** (verlan of fou) - crazy/amazing
- **relou** (verlan of lourd) - annoying
- **chelou** (verlan of louche) - shady/weird`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m1",
    moduleTitle: "Mastering Nuance",
    order: 2,
    topicId: "fr-advanced-idiomatic-expressions",
    vocabulary: [
      { word: "avoir le cafard", translation: "to feel depressed/blue", pronunciation: "ah-VWAHR luh kah-FAHR", exampleSentence: "Depuis son depart, j'ai le cafard.", exampleTranslation: "Since she left, I've been feeling blue.", partOfSpeech: "phrase" },
      { word: "poser un lapin", translation: "to stand someone up", pronunciation: "poh-ZAY uhn lah-PAN", exampleSentence: "Il m'a pose un lapin hier soir.", exampleTranslation: "He stood me up last night.", partOfSpeech: "phrase" },
      { word: "en faire tout un fromage", translation: "to make a big deal of nothing", pronunciation: "ahn fehr too tuhn froh-MAHZH", exampleSentence: "Arrete d'en faire tout un fromage !", exampleTranslation: "Stop making such a big deal of it!", partOfSpeech: "phrase" },
      { word: "chelou", translation: "weird/shady (verlan)", pronunciation: "shuh-LOO", exampleSentence: "Ce type est chelou, tu trouves pas ?", exampleTranslation: "That guy's shady, don't you think?", partOfSpeech: "adjective" },
      { word: "ce n'est pas la mer a boire", translation: "it's not that hard/not a big deal", pronunciation: "suh neh pah lah mehr ah BWAHR", exampleSentence: "Allez, fais-le, ce n'est pas la mer a boire.", exampleTranslation: "Come on, do it, it's not that hard.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Pronominal (Reflexive) Idioms",
        explanation: "Many French idioms use pronominal verbs that don't translate reflexively into English. At C1, you need to handle these naturally: *s'en faire* (to worry), *s'y prendre* (to go about it), *s'en prendre a* (to blame/attack).",
        examples: [
          { correct: "Ne t'en fais pas.", translation: "Don't worry about it." },
          { correct: "Il s'y est mal pris.", translation: "He went about it the wrong way." },
          { correct: "Elle s'en est prise a moi.", translation: "She took it out on me." },
        ],
        commonMistakes: [
          { incorrect: "Ne fais pas de soucis", correction: "Ne t'en fais pas / Ne te fais pas de soucis", explanation: "The reflexive pronoun is essential. Without it, the meaning changes or the sentence is ungrammatical." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-idioms-convo",
        title: "Gossip Over Coffee",
        situation: "You and a French friend are catching up at a cafe, sharing stories about mutual friends",
        agentRole: "You are Nathalie, a witty Parisienne who peppers her speech with idioms. Use at least 3 idiomatic expressions naturally and react to the student's attempts to use them.",
        userGoal: "Use at least 3 French idioms naturally in conversation and respond to Nathalie's figurative language",
        targetPhrases: ["avoir le cafard", "poser un lapin", "en faire tout un fromage", "ce n'est pas la mer a boire"],
        successCriteria: ["Uses idioms in appropriate context", "Understands partner's figurative language", "Maintains natural conversational flow"],
      },
    ],
  },
  {
    id: "fr-adv-l3",
    slug: "irony-understatement",
    title: "Irony, Understatement & Advanced Tone",
    content: `# L'ironie, la litote et les nuances de ton

French communication relies heavily on implied meaning. Mastering irony and understatement is essential for C1.

## La Litote (Understatement)
The classic French rhetorical device — saying less to mean more.
- **Ce n'est pas mal** - It's not bad (meaning: it's very good)
- **Il n'est pas bete** - He's not stupid (meaning: he's quite clever)
- **Ce n'est pas pour me deplaire** - It doesn't displease me (meaning: I'm delighted)
- **On ne peut pas dire que ce soit facile** - One can't say it's easy (meaning: it's extremely hard)

## L'Ironie (Irony)
French irony is often dry and deadpan, relying on context and intonation.
- **C'est du joli !** - How lovely! (meaning: what a mess)
- **Charmant...** - Charming... (meaning: awful)
- **Quelle surprise...** - What a surprise... (meaning: entirely predictable)
- **Bravo, c'est du beau travail** - Well done, great work (meaning: you've made a mess)

## Detecting Tone in Writing
Look for: conditional mood where indicative is expected, excessive politeness, rhetorical questions, and the telltale ellipsis (...).`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m1",
    moduleTitle: "Mastering Nuance",
    order: 3,
    topicId: "fr-advanced-irony-understatement",
    vocabulary: [
      { word: "litote", translation: "understatement (rhetorical device)", pronunciation: "lee-TOHT", exampleSentence: "Dire 'ce n'est pas mal' est une litote.", exampleTranslation: "Saying 'it's not bad' is an understatement.", partOfSpeech: "noun" },
      { word: "c'est du joli", translation: "how lovely (ironic: what a mess)", pronunciation: "seh doo zhoh-LEE", exampleSentence: "Tu as casse le vase ? C'est du joli !", exampleTranslation: "You broke the vase? How lovely!", partOfSpeech: "phrase" },
      { word: "ce n'est pas pour me deplaire", translation: "it doesn't displease me (= I love it)", pronunciation: "suh neh pah poor muh day-PLEHR", exampleSentence: "Cette promotion ? Ce n'est pas pour me deplaire.", exampleTranslation: "This promotion? I'm hardly complaining.", partOfSpeech: "phrase" },
      { word: "un euphemisme", translation: "a euphemism", pronunciation: "uhn uh-fay-MEEZM", exampleSentence: "Dire qu'il est 'un peu en retard' est un euphemisme.", exampleTranslation: "Saying he's 'a bit late' is a euphemism.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "The Conditional for Diplomatic Hedging",
        explanation: "French uses the conditional mood (**conditionnel**) not just for hypotheticals, but to soften assertions, express doubt, or distance oneself politely. This is central to ironic and diplomatic French: *il semblerait que...* (it would seem that...), *on dirait que...* (one would say that...).",
        examples: [
          { correct: "Il semblerait que le projet ait echoue.", translation: "It would appear that the project has failed.", note: "Hedging — avoids direct accusation" },
          { correct: "On dirait que quelqu'un n'a pas fait ses devoirs.", translation: "One might say someone hasn't done their homework.", note: "Ironic understatement" },
          { correct: "Ce serait peut-etre une bonne idee d'en parler.", translation: "It might perhaps be a good idea to discuss it.", note: "Triple hedging: conditional + peut-etre + suggestion" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-irony-meeting",
        title: "The Diplomatic Meeting",
        situation: "A colleague has just presented a flawed project proposal. You need to express reservations without being confrontational.",
        agentRole: "You are Monsieur Dupont, a senior manager who uses litote and ironic understatement. React to the student's feedback and model diplomatic French.",
        userGoal: "Express criticism diplomatically using understatement, hedging, and conditional mood",
        targetPhrases: ["Il semblerait que...", "Ce n'est pas sans poser quelques questions", "On pourrait peut-etre envisager...", "Ce n'est pas pour critiquer, mais..."],
        successCriteria: ["Uses conditional for hedging", "Employs litote or understatement", "Avoids direct confrontation while making point clear", "Detects irony in partner's responses"],
      },
    ],
  },
];

// ============================================
// Module 2: Academic & Professional French
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "fr-adv-l4",
    slug: "dissertation-writing",
    title: "The French Dissertation",
    content: `# La dissertation francaise

The **dissertation** is the backbone of French academic writing. Unlike an Anglo-Saxon essay, it follows a rigid three-part structure: **these, antithese, synthese**.

## Structure

### Introduction
1. **L'amorce** (hook) — A quote, fact, or observation
2. **La problematique** — The guiding question
3. **L'annonce du plan** — Outline of your argument

### Developpement (Body)
1. **These** — First position, argued with evidence
2. **Antithese** — Counterargument, equally well-argued
3. **Synthese** — Resolution or transcendence of the opposition

### Conclusion
1. Summary of the dialectical movement
2. **L'ouverture** — A broader question to leave the reader thinking

## Key Connector Words
- **En premier lieu / En second lieu** - First / Second
- **Neanmoins / Toutefois** - Nevertheless / However
- **Force est de constater que...** - One must acknowledge that...
- **Il n'en demeure pas moins que...** - It remains no less true that...
- **En definitive** - Ultimately / In the final analysis`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m2",
    moduleTitle: "Academic & Professional French",
    order: 4,
    topicId: "fr-advanced-dissertation-writing",
    vocabulary: [
      { word: "la problematique", translation: "the guiding question/thesis question", pronunciation: "lah proh-blay-mah-TEEK", exampleSentence: "Quelle est la problematique de votre dissertation ?", exampleTranslation: "What is the guiding question of your essay?", partOfSpeech: "noun" },
      { word: "neanmoins", translation: "nevertheless", pronunciation: "nay-ahn-MWAHN", exampleSentence: "Ce point est valable ; neanmoins, il merite d'etre nuance.", exampleTranslation: "This point is valid; nevertheless, it deserves nuance.", partOfSpeech: "adverb" },
      { word: "force est de constater", translation: "one must acknowledge/recognize", pronunciation: "fohrs eh duh kohn-stah-TAY", exampleSentence: "Force est de constater que les resultats sont decevants.", exampleTranslation: "One must acknowledge that the results are disappointing.", partOfSpeech: "phrase" },
      { word: "en definitive", translation: "ultimately / in the final analysis", pronunciation: "ahn day-fee-nee-TEEV", exampleSentence: "En definitive, les deux positions se rejoignent.", exampleTranslation: "Ultimately, both positions converge.", partOfSpeech: "phrase" },
      { word: "l'ouverture", translation: "the opening (broader concluding question)", pronunciation: "loo-vehr-TOOR", exampleSentence: "L'ouverture doit elargir la reflexion.", exampleTranslation: "The closing thought should broaden the reflection.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Impersonal Constructions for Academic Distance",
        explanation: "French academic writing avoids 'je' in favour of impersonal constructions: **il convient de** (it is appropriate to), **il s'avere que** (it turns out that), **on peut affirmer que** (one can assert that). This creates objectivity and authority.",
        examples: [
          { correct: "Il convient de souligner que cette these est controversee.", translation: "It is appropriate to emphasise that this thesis is controversial." },
          { correct: "Il s'avere que les donnees contredisent l'hypothese.", translation: "It turns out that the data contradicts the hypothesis." },
          { correct: "On ne saurait ignorer l'apport de Foucault.", translation: "One cannot overlook Foucault's contribution." },
        ],
        commonMistakes: [
          { incorrect: "Je pense que cette these est fausse.", correction: "Il semble que cette these soit discutable.", explanation: "Avoid 'je pense' in formal academic French. Use impersonal constructions + subjunctive for nuanced distance." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-dissertation-defense",
        title: "Defending Your Dissertation Orally",
        situation: "You are presenting the argument of your dissertation to a panel at a French university",
        agentRole: "You are Professeur Morel, a rigorous but fair examiner at Sciences Po. Ask probing questions about the student's argument structure and push back on weak points.",
        userGoal: "Present a three-part argument clearly using academic register and defend it against objections",
        targetPhrases: ["Force est de constater que...", "Il n'en demeure pas moins que...", "En definitive...", "Il convient de nuancer..."],
        successCriteria: ["Uses these-antithese-synthese structure", "Employs academic connectors", "Responds to objections with hedged counter-arguments", "Maintains soutenu register throughout"],
      },
    ],
  },
  {
    id: "fr-adv-l5",
    slug: "professional-presentations",
    title: "Professional Presentations & Meetings",
    content: `# Presentations et reunions professionnelles

Master the language of French corporate and professional communication.

## Structuring a Presentation
- **Je vous remercie d'etre venus** - Thank you for coming
- **L'objectif de cette presentation est de...** - The goal of this presentation is to...
- **Permettez-moi de vous exposer...** - Allow me to present to you...
- **Passons maintenant a...** - Let's move on to...
- **En guise de conclusion...** - By way of conclusion...

## Meeting Vocabulary
- **L'ordre du jour** - The agenda
- **Prendre la parole** - To take the floor/speak
- **Couper la parole** - To interrupt
- **Faire le point sur...** - To review the status of...
- **On est d'accord la-dessus ?** - Are we agreed on this?

## Agreeing and Disagreeing Professionally
- **Tout a fait** - Absolutely / Exactly
- **Effectivement** - Indeed
- **Permettez-moi de nuancer** - Allow me to qualify that
- **Je ne partage pas tout a fait ce point de vue** - I don't entirely share that viewpoint
- **Avec tout le respect que je vous dois** - With all due respect`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m2",
    moduleTitle: "Academic & Professional French",
    order: 5,
    topicId: "fr-advanced-professional-presentations",
    vocabulary: [
      { word: "l'ordre du jour", translation: "the agenda", pronunciation: "lohr-druh doo ZHOOR", exampleSentence: "Le premier point a l'ordre du jour est le budget.", exampleTranslation: "The first item on the agenda is the budget.", partOfSpeech: "noun" },
      { word: "prendre la parole", translation: "to take the floor / to speak", pronunciation: "PRAHN-druh lah pah-ROHL", exampleSentence: "Puis-je prendre la parole ?", exampleTranslation: "May I take the floor?", partOfSpeech: "phrase" },
      { word: "faire le point sur", translation: "to review the status of", pronunciation: "fehr luh PWAHN soor", exampleSentence: "Faisons le point sur l'avancement du projet.", exampleTranslation: "Let's review the status of the project's progress.", partOfSpeech: "phrase" },
      { word: "permettez-moi de nuancer", translation: "allow me to qualify that", pronunciation: "pehr-meh-TAY mwah duh noo-ahn-SAY", exampleSentence: "Permettez-moi de nuancer : les chiffres sont encourageants mais incomplets.", exampleTranslation: "Allow me to qualify that: the figures are encouraging but incomplete.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "The Subjunctive in Professional Nuance",
        explanation: "At C1, the subjunctive is no longer just a grammar rule — it's a tool for expressing doubt, wish, necessity, and judgment in professional settings. Key triggers: **bien que** (although), **afin que** (so that), **il est essentiel que** (it is essential that), **je doute que** (I doubt that).",
        examples: [
          { correct: "Bien que les resultats soient prometteurs, il faut rester prudent.", translation: "Although the results are promising, we must remain cautious." },
          { correct: "Il est essentiel que l'equipe soit informee avant vendredi.", translation: "It is essential that the team be informed before Friday." },
          { correct: "Je doute que cette strategie puisse aboutir.", translation: "I doubt this strategy can succeed." },
        ],
        commonMistakes: [
          { incorrect: "Bien que les resultats sont prometteurs...", correction: "Bien que les resultats soient prometteurs...", explanation: "Bien que always triggers the subjunctive. Using indicative here is a common error even among advanced speakers." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-board-meeting",
        title: "The Quarterly Review",
        situation: "You are presenting quarterly results to the board and must handle tough questions",
        agentRole: "You are Madame Lefevre, CFO of a French company. You present the numbers and challenge the student's analysis with pointed but professional questions.",
        userGoal: "Present a professional summary, handle objections diplomatically, and propose next steps",
        targetPhrases: ["Permettez-moi de vous exposer...", "Faire le point sur...", "Je ne partage pas tout a fait ce point de vue", "En guise de conclusion..."],
        successCriteria: ["Structures presentation clearly", "Uses meeting vocabulary naturally", "Disagrees professionally without confrontation", "Uses subjunctive after trigger phrases"],
      },
    ],
  },
  {
    id: "fr-adv-l6",
    slug: "scientific-legal-french",
    title: "Scientific & Legal French",
    content: `# Francais scientifique et juridique

Specialised registers used in research, law, and institutional contexts.

## Scientific French
- **Les donnees attestent que...** - The data demonstrates that...
- **Il ressort de cette etude que...** - This study shows that...
- **L'echantillon** - The sample
- **Le protocole experimental** - The experimental protocol
- **Mettre en evidence** - To highlight / demonstrate
- **Corroborer une hypothese** - To corroborate a hypothesis

## Legal French
- **En vertu de l'article...** - By virtue of article...
- **Le justiciable** - The person subject to trial
- **La jurisprudence** - Case law
- **Ester en justice** - To bring a lawsuit
- **Attendu que...** - Whereas... (in legal rulings)
- **Nonobstant** - Notwithstanding

## Reading Formal/Institutional Documents
Government decrees, contracts, academic papers — all require familiarity with:
- Passive constructions: **il est stipule que...**
- Nominalisation: **la mise en oeuvre** (implementation), **la prise en charge** (management/coverage)
- Archaic legal forms: **ledit** (the said), **susmentionne** (above-mentioned)`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m2",
    moduleTitle: "Academic & Professional French",
    order: 6,
    topicId: "fr-advanced-scientific-legal-french",
    vocabulary: [
      { word: "mettre en evidence", translation: "to highlight / to demonstrate", pronunciation: "meh-truh ahn ay-vee-DAHNS", exampleSentence: "Cette etude met en evidence un lien causal.", exampleTranslation: "This study demonstrates a causal link.", partOfSpeech: "phrase" },
      { word: "la jurisprudence", translation: "case law / legal precedent", pronunciation: "lah zhoo-rees-proo-DAHNS", exampleSentence: "La jurisprudence a evolue sur ce point.", exampleTranslation: "Case law has evolved on this point.", partOfSpeech: "noun" },
      { word: "nonobstant", translation: "notwithstanding", pronunciation: "nohn-ohb-STAHN", exampleSentence: "Nonobstant les difficultes, le projet continue.", exampleTranslation: "Notwithstanding the difficulties, the project continues.", partOfSpeech: "preposition" },
      { word: "la mise en oeuvre", translation: "the implementation", pronunciation: "lah meez ahn OOVR", exampleSentence: "La mise en oeuvre de cette reforme prendra deux ans.", exampleTranslation: "The implementation of this reform will take two years.", partOfSpeech: "noun" },
      { word: "corroborer", translation: "to corroborate", pronunciation: "koh-roh-boh-RAY", exampleSentence: "Les resultats corroborent l'hypothese initiale.", exampleTranslation: "The results corroborate the initial hypothesis.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Nominalisation for Formal Writing",
        explanation: "French formal writing heavily favours nouns over verbs — a process called **nominalisation**. Instead of *on a decide de mettre en oeuvre le plan* (we decided to implement the plan), formal French prefers *la decision de mise en oeuvre du plan* (the decision to implement the plan). This creates density and authority.",
        examples: [
          { correct: "La prise en compte de ces facteurs est essentielle.", translation: "Taking these factors into account is essential.", note: "Nominalised from: prendre en compte" },
          { correct: "L'amelioration des conditions de travail reste prioritaire.", translation: "The improvement of working conditions remains a priority.", note: "Nominalised from: ameliorer" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-research-discussion",
        title: "Discussing a Research Paper",
        situation: "You are at an academic conference discussing a recently published study with a fellow researcher",
        agentRole: "You are Dr. Benoit, a researcher at CNRS. Discuss the methodology and findings of a hypothetical climate study using precise scientific French.",
        userGoal: "Discuss research findings using scientific register, question methodology, and propose alternative interpretations",
        targetPhrases: ["Il ressort de cette etude que...", "Mettre en evidence", "Corroborer une hypothese", "L'echantillon"],
        successCriteria: ["Uses scientific vocabulary accurately", "Questions methodology politely", "Proposes alternative readings of data", "Maintains academic register"],
      },
    ],
  },
];

// ============================================
// Module 3: French Culture & Literature
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "fr-adv-l7",
    slug: "literary-movements",
    title: "Major Literary Movements",
    content: `# Les grands mouvements litteraires

Understanding French literary movements is essential for cultural fluency.

## Key Movements

### Le Classicisme (17th century)
Order, reason, and harmony. Rules of the three unities in theatre.
- Key figures: **Moliere**, **Racine**, **Corneille**, **La Fontaine**
- Values: bienseance (propriety), vraisemblance (verisimilitude)

### Les Lumieres (18th century / Enlightenment)
Reason over superstition. Critique of authority.
- Key figures: **Voltaire**, **Rousseau**, **Diderot**, **Montesquieu**
- Key work: *L'Encyclopedie*

### Le Romantisme (19th century)
Emotion, nature, the individual, rebellion against classical rules.
- Key figures: **Victor Hugo**, **Lamartine**, **Musset**
- Key work: *Les Miserables*, *Hernani*

### L'Existentialisme (20th century)
Freedom, absurdity, individual responsibility.
- Key figures: **Jean-Paul Sartre**, **Simone de Beauvoir**, **Albert Camus**
- Key works: *L'Etranger*, *Le Deuxieme Sexe*, *La Nausee*

## Discussing Literature
- **L'oeuvre** - The work (literary)
- **Un chef-d'oeuvre** - A masterpiece
- **La portee (d'un texte)** - The significance/reach
- **Une mise en abyme** - A story within a story`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m3",
    moduleTitle: "French Culture & Literature",
    order: 7,
    topicId: "fr-advanced-literary-movements",
    vocabulary: [
      { word: "un chef-d'oeuvre", translation: "a masterpiece", pronunciation: "uhn sheh-DUHVR", exampleSentence: "Les Miserables est un chef-d'oeuvre de la litterature francaise.", exampleTranslation: "Les Miserables is a masterpiece of French literature.", partOfSpeech: "noun" },
      { word: "les Lumieres", translation: "the Enlightenment", pronunciation: "lay loo-MYEHR", exampleSentence: "Voltaire est l'un des penseurs majeurs des Lumieres.", exampleTranslation: "Voltaire is one of the major thinkers of the Enlightenment.", partOfSpeech: "noun" },
      { word: "la portee", translation: "the significance / scope / reach", pronunciation: "lah pohr-TAY", exampleSentence: "La portee de cette oeuvre depasse son epoque.", exampleTranslation: "The significance of this work transcends its era.", partOfSpeech: "noun" },
      { word: "une mise en abyme", translation: "a story within a story / self-referential device", pronunciation: "oon meez ahn ah-BEEM", exampleSentence: "Gide utilise une mise en abyme dans Les Faux-Monnayeurs.", exampleTranslation: "Gide uses a story within a story in The Counterfeiters.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "The Passe Simple (Literary Past Tense)",
        explanation: "The **passe simple** is the narrative past tense used in literature, journalism, and historical writing. It replaces the passe compose in formal written narration. You must recognise it fluently, even if you rarely produce it in speech.",
        examples: [
          { correct: "Il entra dans la piece et s'assit.", translation: "He entered the room and sat down.", note: "Passe simple of entrer (entra) and s'asseoir (s'assit)" },
          { correct: "Ils furent surpris par la nouvelle.", translation: "They were surprised by the news.", note: "Passe simple of etre (furent)" },
          { correct: "Elle eut un moment d'hesitation.", translation: "She had a moment of hesitation.", note: "Passe simple of avoir (eut)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-literary-debate",
        title: "Literature Salon",
        situation: "You are at a literary discussion group debating whether Camus was truly an existentialist",
        agentRole: "You are Claire, a passionate literature professor who argues that Camus rejected the existentialist label. Challenge the student's interpretations and cite specific works.",
        userGoal: "Argue a literary position with evidence from texts, using appropriate cultural and analytical vocabulary",
        targetPhrases: ["La portee de cette oeuvre...", "Il me semble que l'auteur...", "Contrairement a Sartre, Camus...", "On pourrait arguer que..."],
        successCriteria: ["References specific works or movements", "Builds a coherent literary argument", "Uses analytical vocabulary", "Engages with counterarguments"],
      },
    ],
    culturalNotes: [
      {
        title: "The French Relationship with Literature",
        content: "In France, literature is not just an academic subject — it is a pillar of national identity. The **baccalaureat de francais** (taken at age 17) requires students to write dissertations on literary works. Authors like Hugo, Zola, and Camus are referenced in everyday political discourse. Saying 'je n'ai pas lu Proust' at a dinner party can raise eyebrows.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-adv-l8",
    slug: "major-authors",
    title: "Moliere, Hugo & Camus: Close Readings",
    content: `# Moliere, Hugo et Camus : lectures approfondies

Three authors who define three centuries of French thought.

## Moliere (1622-1673) — The Mirror of Society
Master of comedy, satirist of hypocrisy and social pretension.
- *Le Misanthrope* — The impossibility of honesty in a hypocritical society
- *Tartuffe* — Religious hypocrisy unmasked
- *Le Bourgeois gentilhomme* — Social climbing satirised

**Key quote:** *"Le devoir de la comedie etant de corriger les hommes en les divertissant."*
(The duty of comedy is to correct men by entertaining them.)

## Victor Hugo (1802-1885) — The Voice of the People
Romantic giant, political exile, champion of the poor.
- *Les Miserables* — Redemption, justice, and the plight of the underclass
- *Notre-Dame de Paris* — Gothic architecture as symbol of collective memory
- *Les Contemplations* — Grief, exile, and the sublime

**Key quote:** *"Ceux qui vivent, ce sont ceux qui luttent."*
(Those who live are those who struggle.)

## Albert Camus (1913-1960) — The Absurd and Revolt
Philosopher of the absurd, Nobel laureate, moralist.
- *L'Etranger* — Indifference as resistance to social convention
- *La Peste* — Solidarity in the face of catastrophe
- *Le Mythe de Sisyphe* — "Il faut imaginer Sisyphe heureux"

**Key quote:** *"Au milieu de l'hiver, j'ai decouvert en moi un invincible ete."*
(In the depths of winter, I discovered within me an invincible summer.)`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m3",
    moduleTitle: "French Culture & Literature",
    order: 8,
    topicId: "fr-advanced-major-authors",
    vocabulary: [
      { word: "l'absurde", translation: "the absurd (philosophical concept)", pronunciation: "lahb-SOORD", exampleSentence: "Camus explore le theme de l'absurde dans L'Etranger.", exampleTranslation: "Camus explores the theme of the absurd in The Stranger.", partOfSpeech: "noun" },
      { word: "la satire", translation: "satire", pronunciation: "lah sah-TEER", exampleSentence: "Moliere excelle dans la satire sociale.", exampleTranslation: "Moliere excels at social satire.", partOfSpeech: "noun" },
      { word: "la redemption", translation: "redemption", pronunciation: "lah ray-dahmp-SYOHN", exampleSentence: "Jean Valjean incarne le theme de la redemption.", exampleTranslation: "Jean Valjean embodies the theme of redemption.", partOfSpeech: "noun" },
      { word: "un alexandrin", translation: "an alexandrine (12-syllable verse)", pronunciation: "uhn ah-lehk-sahn-DRAHN", exampleSentence: "Hugo maitrisait parfaitement l'alexandrin.", exampleTranslation: "Hugo had perfect mastery of the alexandrine.", partOfSpeech: "noun" },
      { word: "denouement", translation: "resolution/ending (of a plot)", pronunciation: "day-noo-MAHN", exampleSentence: "Le denouement de Tartuffe est une intervention royale.", exampleTranslation: "The resolution of Tartuffe is a royal intervention.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Reported Speech in Literary Analysis (Discours indirect)",
        explanation: "When analysing literature, you constantly paraphrase what authors or characters say. French indirect speech requires careful tense shifting: present becomes imperfect, passe compose becomes plus-que-parfait, future becomes conditional.",
        examples: [
          { correct: "Camus affirmait que la vie n'avait pas de sens inherent.", translation: "Camus affirmed that life had no inherent meaning.", note: "Present (a) shifts to imperfect (avait)" },
          { correct: "Meursault a declare qu'il n'avait pas pleure a l'enterrement de sa mere.", translation: "Meursault stated that he had not cried at his mother's funeral.", note: "Passe compose shifts to plus-que-parfait" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-author-analysis",
        title: "Comparing Authors Across Centuries",
        situation: "A French friend asks you which of Moliere, Hugo, or Camus speaks most to the modern world",
        agentRole: "You are Antoine, a well-read French literature enthusiast who plays devil's advocate. Whatever author the student picks, argue for a different one.",
        userGoal: "Defend your choice of author with references to their works and ideas, while engaging respectfully with the counterargument",
        targetPhrases: ["Il me semble que...", "La portee de son oeuvre...", "Contrairement a...", "Ce qui fait la force de..."],
        successCriteria: ["References at least two specific works", "Uses literary vocabulary", "Builds a structured argument", "Engages with counterargument rather than dismissing it"],
      },
    ],
  },
  {
    id: "fr-adv-l9",
    slug: "french-cinema",
    title: "French Cinema: Nouvelle Vague & Beyond",
    content: `# Le cinema francais : de la Nouvelle Vague a aujourd'hui

France is the birthplace of cinema (the Lumiere brothers, 1895) and home to some of the world's most influential film movements.

## La Nouvelle Vague (Late 1950s-1960s)
A revolution in filmmaking — personal vision, low budgets, location shooting, breaking the fourth wall.
- **Jean-Luc Godard** — *A bout de souffle* (Breathless, 1960)
- **Francois Truffaut** — *Les 400 Coups* (The 400 Blows, 1959)
- **Agnes Varda** — *Cleo de 5 a 7* (1962)
- **Cahiers du Cinema** — The influential film journal where many directors started as critics

## Le Cinema d'auteur
- The director as **auteur** (author) — personal vision over commercial formula
- French cinema prizes artistic ambition: **le Festival de Cannes**, **les Cesars**

## Discussing Film
- **Le long-metrage / le court-metrage** — Feature film / Short film
- **La mise en scene** — Direction / staging
- **Le cadrage** — Framing (of a shot)
- **Un plan-sequence** — A long take / single-shot sequence
- **Le hors-champ** — Off-screen space
- **Ca m'a bouleverse(e)** — It deeply moved me

## Contemporary French Cinema
- **Jacques Audiard** — *Un prophete*, *Dheepan*
- **Celine Sciamma** — *Portrait de la jeune fille en feu*
- **Julia Ducournau** — *Titane* (Palme d'Or, 2021)`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m3",
    moduleTitle: "French Culture & Literature",
    order: 9,
    topicId: "fr-advanced-french-cinema",
    vocabulary: [
      { word: "la mise en scene", translation: "direction / staging", pronunciation: "lah meez ahn SEHN", exampleSentence: "La mise en scene de Godard a revolutionne le cinema.", exampleTranslation: "Godard's direction revolutionised cinema.", partOfSpeech: "noun" },
      { word: "un plan-sequence", translation: "a long take / single-shot sequence", pronunciation: "uhn plahn say-KAHNS", exampleSentence: "Ce plan-sequence de huit minutes est remarquable.", exampleTranslation: "This eight-minute long take is remarkable.", partOfSpeech: "noun" },
      { word: "bouleverser", translation: "to deeply move / to shake up", pronunciation: "bool-vehr-SAY", exampleSentence: "Ce film m'a profondement bouleverse.", exampleTranslation: "This film deeply moved me.", partOfSpeech: "verb" },
      { word: "le hors-champ", translation: "off-screen space", pronunciation: "luh ohr-SHAHN", exampleSentence: "Le hors-champ cree une tension permanente.", exampleTranslation: "The off-screen space creates permanent tension.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Expressing Aesthetic Judgment at C1",
        explanation: "Going beyond 'j'aime' and 'c'est bien'. At C1, express film opinions with precision: **saisissant** (gripping), **poignant** (poignant), **deroutant** (disconcerting), **d'une beaute saisissante** (of striking beauty). Pair adjectives with nuanced structures: **ce qui frappe, c'est...** (what strikes you is...), **on est saisi par...** (one is gripped by...).",
        examples: [
          { correct: "Ce qui frappe dans ce film, c'est l'intensite du jeu des acteurs.", translation: "What strikes you in this film is the intensity of the acting." },
          { correct: "On est saisi par la beaute austere du cadrage.", translation: "One is gripped by the austere beauty of the framing." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-cinema-debate",
        title: "After the Screening",
        situation: "You have just watched a Nouvelle Vague film at a cine-club and are discussing it over wine",
        agentRole: "You are Sylvie, a passionate cinephile. Share your analysis of the film and ask the student what moved or puzzled them. Use film vocabulary naturally.",
        userGoal: "Discuss a film using technical vocabulary, express nuanced aesthetic judgments, and engage with a different interpretation",
        targetPhrases: ["La mise en scene...", "Ce qui m'a frappe, c'est...", "Un plan-sequence saisissant", "On pourrait interpreter cela comme..."],
        successCriteria: ["Uses at least 3 film terms correctly", "Expresses nuanced opinion beyond like/dislike", "Engages with partner's interpretation", "Maintains natural conversational flow"],
      },
    ],
  },
];

// ============================================
// Module 4: Contemporary France & Francophonie
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "fr-adv-l10",
    slug: "current-debates",
    title: "Current Debates in French Society",
    content: `# Les grands debats de la societe francaise

Understanding contemporary France requires engaging with its ongoing cultural and political debates.

## Key Themes

### La Laicite
The strict separation of church and state — a foundational French value.
- **La loi de 1905** — The law establishing separation of church and state
- Ongoing debates about religious symbols in public spaces
- **La laicite** vs. **la liberte de conscience** — secularism vs. freedom of belief

### L'Identite nationale
- **Le modele republicain** — Universalist assimilation (vs. Anglo-Saxon multiculturalism)
- Debates on immigration, integration, **le communautarisme** (communalism)
- **La francophonie** as soft power and cultural identity

### La Transition ecologique
- **Le nucleaire** — France generates ~70% of electricity from nuclear power
- **Les gilets jaunes** — the Yellow Vest movement (2018-2019): social justice vs. green taxes
- **La sobriete energetique** — Energy sobriety

## Expressing Opinions on Sensitive Topics
- **Il est indeniable que...** - It is undeniable that...
- **La question merite d'etre posee** - The question deserves to be asked
- **Il y a lieu de s'interroger sur...** - There is reason to question...
- **C'est un sujet qui divise** - It's a divisive topic`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m4",
    moduleTitle: "Contemporary France & Francophonie",
    order: 10,
    topicId: "fr-advanced-current-debates",
    vocabulary: [
      { word: "la laicite", translation: "secularism (French model)", pronunciation: "lah lah-ee-see-TAY", exampleSentence: "La laicite est un pilier de la Republique francaise.", exampleTranslation: "Secularism is a pillar of the French Republic.", partOfSpeech: "noun" },
      { word: "le communautarisme", translation: "communalism / identity-based separatism", pronunciation: "luh koh-moo-noh-tah-REEZM", exampleSentence: "Le debat sur le communautarisme reste vif en France.", exampleTranslation: "The debate on communalism remains heated in France.", partOfSpeech: "noun" },
      { word: "la sobriete energetique", translation: "energy sobriety / restraint", pronunciation: "lah soh-bree-ay-TAY ay-nehr-zhay-TEEK", exampleSentence: "Le gouvernement promeut la sobriete energetique.", exampleTranslation: "The government promotes energy sobriety.", partOfSpeech: "noun" },
      { word: "il y a lieu de s'interroger", translation: "there is reason to question", pronunciation: "eel ee ah LYUH duh sahn-teh-roh-ZHAY", exampleSentence: "Il y a lieu de s'interroger sur l'efficacite de cette politique.", exampleTranslation: "There is reason to question the effectiveness of this policy.", partOfSpeech: "phrase" },
      { word: "indeniable", translation: "undeniable", pronunciation: "ahn-day-nyAHBL", exampleSentence: "L'impact du changement climatique est indeniable.", exampleTranslation: "The impact of climate change is undeniable.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Concession and Opposition Structures",
        explanation: "Nuanced debate requires mastering concession: acknowledging a point before arguing against it. Key structures: **certes... mais** (certainly... but), **s'il est vrai que... il n'en reste pas moins que** (while it is true that... it remains no less true that), **quoique + subjunctive** (although).",
        examples: [
          { correct: "Certes, la laicite protege les libertes individuelles, mais son application fait debat.", translation: "Certainly, secularism protects individual freedoms, but its application is debated." },
          { correct: "S'il est vrai que le nucleaire est bas-carbone, il n'en reste pas moins que la question des dechets demeure.", translation: "While it's true that nuclear is low-carbon, the question of waste remains." },
          { correct: "Quoiqu'on en dise, le modele francais a ses merites.", translation: "Whatever people say, the French model has its merits." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-dinner-debate",
        title: "The Dinner Party Debate",
        situation: "At a Parisian dinner party, the conversation turns to laicite and whether France's model is outdated",
        agentRole: "You are Philippe, a French intellectual with strong opinions on the republican model. Present your views passionately but respectfully, and push back when the student offers a different perspective.",
        userGoal: "Engage in a nuanced debate on a sensitive topic, using concession structures and expressing a balanced opinion",
        targetPhrases: ["Certes... mais...", "Il y a lieu de s'interroger...", "La question merite d'etre posee", "Il est indeniable que..."],
        successCriteria: ["Expresses a nuanced position (not black and white)", "Uses concession structures", "Acknowledges opposing viewpoint before countering", "Avoids oversimplification of French cultural issues"],
      },
    ],
    culturalNotes: [
      {
        title: "Dinner Party Politics",
        content: "In France, discussing politics, religion, and social issues at dinner is not only acceptable — it is expected and enjoyed. Unlike in some Anglophone cultures, debate is seen as a sign of intellectual engagement, not rudeness. However, the expectation is that you argue with nuance, acknowledge complexity, and never resort to personal attacks. The phrase **'on peut ne pas etre d'accord et se respecter'** (we can disagree and still respect each other) captures the ideal.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-adv-l11",
    slug: "francophone-world",
    title: "The Francophone World",
    content: `# La Francophonie : le francais au-dela de la France

French is spoken by over 300 million people across five continents. C1 fluency means understanding this diversity.

## Major Francophone Regions

### L'Afrique francophone
- The largest concentration of French speakers in the world
- West Africa: **le Senegal**, **la Cote d'Ivoire**, **le Mali**
- Central Africa: **la RDC** (Congo), **le Cameroun**
- Maghreb: **l'Algerie**, **le Maroc**, **la Tunisie**
- Rich literary tradition: **Leopold Sedar Senghor** (Negritude), **Assia Djebar**, **Ahmadou Kourouma**

### Le Quebec
- Distinct accent, vocabulary, and cultural identity
- **Sacrer** — Quebec profanity (religious terms as swear words)
- **Joual** — Working-class Montreal dialect
- Key phrases: **C'est correct** (it's fine), **J'en reviens pas** (I can't believe it)

### La Belgique francophone & la Suisse romande
- **Septante** (70), **nonante** (90) — Belgian/Swiss counting
- **Une fois** — Belgian verbal tic (like 'you know')
- Shared literary figures: **Georges Simenon**, **Amelie Nothomb**

## The Politics of Francophonie
- **L'Organisation internationale de la Francophonie (OIF)** — 88 member states
- Debates on linguistic imperialism vs. cultural partnership
- **Le francais, langue d'avenir ?** — French as a language of the future (African demographic growth)`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m4",
    moduleTitle: "Contemporary France & Francophonie",
    order: 11,
    topicId: "fr-advanced-francophone-world",
    vocabulary: [
      { word: "la negritude", translation: "Negritude (literary/philosophical movement)", pronunciation: "lah nay-gree-TOOD", exampleSentence: "Senghor a cofonde le mouvement de la negritude.", exampleTranslation: "Senghor co-founded the Negritude movement.", partOfSpeech: "noun" },
      { word: "septante", translation: "seventy (Belgian/Swiss French)", pronunciation: "sep-TAHNT", exampleSentence: "En Belgique, on dit septante, pas soixante-dix.", exampleTranslation: "In Belgium, they say septante, not soixante-dix.", partOfSpeech: "number" },
      { word: "le joual", translation: "Joual (Quebec working-class dialect)", pronunciation: "luh ZHWAL", exampleSentence: "Michel Tremblay ecrit en joual pour donner une voix au peuple.", exampleTranslation: "Michel Tremblay writes in Joual to give a voice to the people.", partOfSpeech: "noun" },
      { word: "la francophonie", translation: "the French-speaking world / community", pronunciation: "lah frahn-koh-foh-NEE", exampleSentence: "La francophonie s'etend sur cinq continents.", exampleTranslation: "The Francophone world spans five continents.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Regional Variations in Grammar",
        explanation: "Francophone regions differ not just in accent and vocabulary but in grammar. Quebec preserves older French forms (**icitte** for ici, **asteure** for maintenant), and uses **-tu** as a question particle: *Tu veux-tu ?* (Do you want to?). African French often uses **on** where Metropolitan French would use **nous**, and sometimes innovates with verb constructions not found in European French.",
        examples: [
          { correct: "Tu veux-tu un cafe ? (Quebec)", translation: "Do you want a coffee?", note: "-tu as question marker — unique to Quebec French" },
          { correct: "On va se voir tantot. (Quebec)", translation: "We'll see each other this afternoon.", note: "Tantot = this afternoon (Quebec) vs. earlier/later (France)" },
          { correct: "Il a voyage sur Dakar. (West African French)", translation: "He travelled to Dakar.", note: "Sur instead of a for destination — common in West African French" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-francophone-exchange",
        title: "A Francophone Gathering",
        situation: "You are at an international Francophone festival, speaking with people from Quebec, Senegal, and Belgium",
        agentRole: "You play three characters in sequence: a Quebecois musician, a Senegalese journalist, and a Belgian diplomat. Each uses regional vocabulary and expressions. Switch between them naturally.",
        userGoal: "Understand and adapt to different varieties of French, using some regional expressions and asking about cultural differences",
        targetPhrases: ["C'est correct (Quebec)", "Septante (Belgian)", "La francophonie", "D'ou vient cette expression ?"],
        successCriteria: ["Adapts to different accents/registers", "Shows curiosity about regional differences", "Uses at least one regional expression", "Discusses Francophonie as a concept"],
      },
    ],
  },
  {
    id: "fr-adv-l12",
    slug: "media-analysis",
    title: "Media Analysis & Critical Reading",
    content: `# Analyse des medias et lecture critique

At C1, you must read French media critically — identifying bias, rhetorical strategies, and editorial positioning.

## The French Media Landscape
- **La presse ecrite** — Print press: *Le Monde* (centre-left), *Le Figaro* (centre-right), *Liberation* (left), *L'Express*, *Le Point*
- **Les chaines d'information** — News channels: France 24, BFM TV, LCI
- **Les medias alternatifs** — Mediapart (investigative), Brut (video), Les Jours

## Analysing a News Article
- **L'angle** — The angle/framing of the story
- **Le parti pris** — The editorial bias
- **La source** — The source
- **Un edito / un editorial** — An opinion editorial
- **Une tribune** — An opinion piece (by an outside contributor)
- **Les faits vs. les opinions** — Facts vs. opinions
- **Selon une source proche du dossier** — According to a source close to the matter

## Critical Vocabulary
- **Mettre en perspective** — To put in perspective
- **Remettre en question** — To call into question
- **Nuancer un propos** — To qualify a statement
- **Instrumentaliser** — To instrumentalise / use for ulterior motives
- **Faire l'amalgame entre** — To conflate / lump together`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m4",
    moduleTitle: "Contemporary France & Francophonie",
    order: 12,
    topicId: "fr-advanced-media-analysis",
    vocabulary: [
      { word: "le parti pris", translation: "editorial bias / preconceived position", pronunciation: "luh pahr-TEE PREE", exampleSentence: "Cet article trahit un parti pris evident.", exampleTranslation: "This article reveals an obvious bias.", partOfSpeech: "noun" },
      { word: "instrumentaliser", translation: "to instrumentalise / exploit for ulterior motives", pronunciation: "ahn-stroo-mahn-tah-lee-ZAY", exampleSentence: "Il ne faut pas instrumentaliser cette tragedie.", exampleTranslation: "We must not exploit this tragedy for political ends.", partOfSpeech: "verb" },
      { word: "faire l'amalgame", translation: "to conflate / lump together", pronunciation: "fehr lah-mahl-GAHM", exampleSentence: "Il est dangereux de faire l'amalgame entre immigration et insecurite.", exampleTranslation: "It is dangerous to conflate immigration and insecurity.", partOfSpeech: "phrase" },
      { word: "nuancer un propos", translation: "to qualify a statement", pronunciation: "noo-ahn-SAY uhn proh-POH", exampleSentence: "Il faut nuancer ce propos : la realite est plus complexe.", exampleTranslation: "We need to qualify that statement: the reality is more complex.", partOfSpeech: "phrase" },
      { word: "une tribune", translation: "an opinion piece (by outside contributor)", pronunciation: "oon tree-BOON", exampleSentence: "Il a publie une tribune dans Le Monde.", exampleTranslation: "He published an opinion piece in Le Monde.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "The Conditionnel de Precaution (Journalistic Conditional)",
        explanation: "French journalism uses the **conditionnel** to report unverified information — a grammatical hedge meaning 'allegedly' or 'reportedly'. This is a distinctive feature of French media language: *Le suspect aurait fui le pays* (The suspect reportedly fled the country). Recognising this is essential for critical reading.",
        examples: [
          { correct: "Le president envisagerait un remaniement ministeriel.", translation: "The president is reportedly considering a cabinet reshuffle.", note: "Conditionnel signals unverified/reported information" },
          { correct: "L'accident aurait fait trois victimes.", translation: "The accident is said to have caused three casualties.", note: "Aurait fait — reported, not yet confirmed" },
        ],
        commonMistakes: [
          { incorrect: "Reading 'le suspect aurait fui' as confirmed fact", correction: "Recognise the conditional as marking unverified claims", explanation: "The conditionnel de precaution is the journalist's way of saying 'we haven't verified this yet'. Treating it as fact is a reading comprehension error." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-media-critique",
        title: "Deconstructing the Headlines",
        situation: "You are discussing how different French newspapers covered the same event with a journalism student",
        agentRole: "You are Marc, a journalism professor at the Sorbonne. Present two contrasting headlines about the same event and ask the student to analyse the framing, bias, and language choices.",
        userGoal: "Identify editorial bias, analyse framing choices, and distinguish fact from opinion in French media",
        targetPhrases: ["Le parti pris de cet article...", "On peut noter que le choix de vocabulaire...", "Faire l'amalgame entre...", "Il convient de mettre en perspective..."],
        successCriteria: ["Identifies bias in at least one headline", "Uses media analysis vocabulary", "Distinguishes fact from editorial framing", "Proposes a more neutral alternative phrasing"],
      },
    ],
  },
];

// ============================================
// Module 5: Near-Native Mastery
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "fr-adv-l13",
    slug: "abstracting-ideas",
    title: "Abstracting Complex Ideas",
    content: `# Abstraire et conceptualiser

At C1-C2, you must discuss abstract concepts with precision — philosophy, ethics, epistemology, social theory.

## Philosophical Vocabulary
- **La conscience** — Consciousness / awareness
- **L'alterite** — Otherness
- **Le libre arbitre** — Free will
- **L'alienation** — Alienation
- **La contingence** — Contingency (philosophical)
- **L'etre et le neant** — Being and nothingness (Sartre)

## Structuring Abstract Arguments
- **Si l'on admet que...** — If one accepts that...
- **Il s'ensuit que...** — It follows that...
- **En poussant le raisonnement a son terme...** — Taking the reasoning to its conclusion...
- **Cela presuppose que...** — This presupposes that...
- **A fortiori...** — All the more so...
- **En d'autres termes** — In other words

## Moving Between Concrete and Abstract
The C1 skill is moving fluidly between concrete examples and abstract principles:
- *Prenons l'exemple de...* (Let's take the example of...)
- *Cela illustre un phenomene plus large...* (This illustrates a broader phenomenon...)
- *Au-dela du cas particulier, on peut voir que...* (Beyond this specific case, one can see that...)`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m5",
    moduleTitle: "Near-Native Mastery",
    order: 13,
    topicId: "fr-advanced-abstracting-ideas",
    vocabulary: [
      { word: "l'alterite", translation: "otherness", pronunciation: "lahl-tay-ree-TAY", exampleSentence: "La question de l'alterite est au coeur de la philosophie de Levinas.", exampleTranslation: "The question of otherness is at the heart of Levinas's philosophy.", partOfSpeech: "noun" },
      { word: "le libre arbitre", translation: "free will", pronunciation: "luh LEE-bruh ahr-BEETR", exampleSentence: "Le debat sur le libre arbitre remonte a l'Antiquite.", exampleTranslation: "The debate on free will dates back to antiquity.", partOfSpeech: "noun" },
      { word: "il s'ensuit que", translation: "it follows that", pronunciation: "eel sahn-SWEE kuh", exampleSentence: "Si toute connaissance est subjective, il s'ensuit que la verite absolue n'existe pas.", exampleTranslation: "If all knowledge is subjective, it follows that absolute truth does not exist.", partOfSpeech: "phrase" },
      { word: "a fortiori", translation: "all the more so / even more so", pronunciation: "ah fohr-tee-oh-REE", exampleSentence: "Si c'est vrai pour les adultes, a fortiori pour les enfants.", exampleTranslation: "If it's true for adults, all the more so for children.", partOfSpeech: "adverb" },
      { word: "la contingence", translation: "contingency (that things could be otherwise)", pronunciation: "lah kohn-tahn-ZHAHNS", exampleSentence: "Sartre insiste sur la contingence de l'existence humaine.", exampleTranslation: "Sartre insists on the contingency of human existence.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Complex Hypothesis Chains (Si + Plus-que-parfait / Conditionnel passe)",
        explanation: "For abstract reasoning, you need the full hypothesis toolkit. **Si + plus-que-parfait... conditionnel passe** expresses unreal past conditions: *Si Descartes n'avait pas ecrit le Cogito, la philosophie moderne aurait pris un autre chemin* (If Descartes hadn't written the Cogito, modern philosophy would have taken another path).",
        examples: [
          { correct: "Si l'on avait pris en compte ces donnees, la conclusion aurait ete differente.", translation: "If this data had been taken into account, the conclusion would have been different." },
          { correct: "Quand bien meme il aurait raison, cela ne justifierait pas sa methode.", translation: "Even if he were right, that would not justify his method.", note: "Quand bien meme + conditionnel — an elevated concessive structure" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-philosophy-cafe",
        title: "The Philosophy Cafe",
        situation: "You are at a 'cafe philo' — a uniquely French tradition where strangers discuss philosophical questions over coffee",
        agentRole: "You are the moderator of the cafe philo. Pose the question 'La liberte est-elle une illusion ?' and guide the discussion, pushing the student to go deeper and more abstract.",
        userGoal: "Construct a philosophical argument in French, moving between concrete examples and abstract principles",
        targetPhrases: ["Si l'on admet que...", "Il s'ensuit que...", "A fortiori...", "Cela presuppose que..."],
        successCriteria: ["Engages with abstract concepts", "Uses logical connectors", "Moves between example and principle", "Responds to challenges with reasoned counter-arguments"],
      },
    ],
    culturalNotes: [
      {
        title: "Le Cafe Philo",
        content: "The **cafe philosophique** is a uniquely French institution born in 1992 at Cafe des Phares in Paris. Every Sunday, strangers gather to debate a philosophical question chosen by vote. No academic credentials required — a taxi driver's insight is valued as much as a professor's. This tradition embodies the French belief that philosophy belongs to everyone, not just the academy. Cafes philos now exist worldwide, but France remains their spiritual home.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-adv-l14",
    slug: "creative-writing",
    title: "Creative Writing in French",
    content: `# L'ecriture creative en francais

Writing creatively in a foreign language is the ultimate test of mastery. At C1, you should be able to craft prose with voice, rhythm, and style.

## Narrative Techniques
- **Le point de vue** — Point of view (1st, 3rd, omniscient)
- **Le monologue interieur** — Interior monologue / stream of consciousness
- **Le discours indirect libre** — Free indirect speech (narrator blends with character's thoughts)
- **L'incipit** — The opening of a novel

## Stylistic Tools
- **L'anaphore** — Repetition of a word/phrase at the start of successive clauses
- **La metaphore filee** — Extended metaphor
- **L'enjambement** — Run-on between verses/sentences for momentum
- **Le rythme ternaire** — Three-part rhythm (common in French prose)

## Writing Exercises
1. Write an **incipit** that hooks the reader in 3 sentences
2. Describe a scene using **discours indirect libre**
3. Craft a paragraph using **rythme ternaire** (three-part structures)

## Key Verbs for Narration
- **Surgir** — To appear suddenly
- **S'evanouir** — To faint / to vanish
- **Effleurer** — To graze / to brush lightly
- **Dechirer** — To tear / to rend
- **Hanter** — To haunt`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m5",
    moduleTitle: "Near-Native Mastery",
    order: 14,
    topicId: "fr-advanced-creative-writing",
    vocabulary: [
      { word: "le discours indirect libre", translation: "free indirect speech", pronunciation: "luh dees-KOOR ahn-dee-REKT LEE-bruh", exampleSentence: "Flaubert a popularise le discours indirect libre dans Madame Bovary.", exampleTranslation: "Flaubert popularised free indirect speech in Madame Bovary.", partOfSpeech: "noun" },
      { word: "surgir", translation: "to appear suddenly / to surge up", pronunciation: "soor-ZHEER", exampleSentence: "Une silhouette surgit de l'ombre.", exampleTranslation: "A figure surged from the shadows.", partOfSpeech: "verb" },
      { word: "effleurer", translation: "to graze / to brush lightly / to touch on", pronunciation: "eh-fluh-RAY", exampleSentence: "Ses doigts effleurerent la surface de l'eau.", exampleTranslation: "Her fingers grazed the surface of the water.", partOfSpeech: "verb" },
      { word: "hanter", translation: "to haunt", pronunciation: "ahn-TAY", exampleSentence: "Ce souvenir me hante depuis des annees.", exampleTranslation: "This memory has haunted me for years.", partOfSpeech: "verb" },
      { word: "l'incipit", translation: "the opening (of a novel)", pronunciation: "lahn-see-PEET", exampleSentence: "L'incipit de L'Etranger est l'un des plus celebres de la litterature.", exampleTranslation: "The opening of The Stranger is one of the most famous in literature.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Free Indirect Speech (Le discours indirect libre)",
        explanation: "This technique blends the narrator's voice with a character's thoughts without explicit markers like 'il pensa que'. The tense stays in the third person past, but the vocabulary and tone shift to the character's perspective. Mastering this is a hallmark of advanced literary French.",
        examples: [
          { correct: "Elle regarda par la fenetre. Le ciel etait gris. Encore une journee sans espoir.", translation: "She looked out the window. The sky was grey. Another hopeless day.", note: "The last sentence is free indirect speech — it's her thought, presented as narration" },
          { correct: "Il se leva brusquement. Non, il n'irait pas. Qu'ils se debrouillent sans lui.", translation: "He got up abruptly. No, he wouldn't go. Let them manage without him.", note: "His inner resolve rendered in the narrator's tense" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-writing-workshop",
        title: "The Writing Workshop",
        situation: "You are in a creative writing atelier, workshopping a short text you've written",
        agentRole: "You are Isabelle, an experienced writing instructor. Ask the student to describe a scene orally using specific literary techniques, then offer constructive feedback on their word choices and rhythm.",
        userGoal: "Describe a scene using evocative verbs, varied sentence rhythm, and at least one literary technique (metaphor, anaphora, or free indirect speech)",
        targetPhrases: ["Il/Elle surgit...", "effleurer", "Un silence... puis...", "Ce qui frappait, c'etait..."],
        successCriteria: ["Uses evocative/precise vocabulary", "Varies sentence length and rhythm", "Attempts at least one literary technique", "Responds to feedback constructively"],
      },
    ],
  },
  {
    id: "fr-adv-l15",
    slug: "spontaneous-argumentation",
    title: "Spontaneous Argumentation & Debate",
    content: `# L'argumentation spontanee et le debat

The ultimate C1 challenge: constructing coherent, persuasive arguments on the fly — the skill the French prize most.

## The Art of French Debate
French argumentation follows a dialectical tradition inherited from philosophy class. Even casual arguments tend toward:
1. **Position claire** — State your thesis
2. **Justification** — Support with reasons
3. **Concession** — Acknowledge the other side
4. **Relance** — Push back or raise the stakes

## Debate Toolkit
### Introducing Your Position
- **A mon sens...** — In my view...
- **J'ai la conviction que...** — I am convinced that...
- **Il me parait evident que...** — It seems obvious to me that...

### Challenging Your Opponent
- **Encore faudrait-il prouver que...** — One would still need to prove that...
- **Votre raisonnement repose sur un presuppose discutable** — Your reasoning rests on a questionable assumption
- **C'est un argument a double tranchant** — That's a double-edged argument

### Redirecting
- **La n'est pas la question** — That's not the point
- **Vous deplacez le debat** — You're shifting the debate
- **Revenons a l'essentiel** — Let's return to the essential point

### Conceding and Pivoting
- **Je vous l'accorde, mais...** — I'll grant you that, but...
- **C'est un point valable ; cependant...** — That's a valid point; however...
- **Soit, mais encore faut-il considerer...** — Fine, but one must still consider...`,
    targetLanguage: "fr",
    proficiencyLevel: "C1",
    moduleId: "fr-adv-m5",
    moduleTitle: "Near-Native Mastery",
    order: 15,
    topicId: "fr-advanced-spontaneous-argumentation",
    vocabulary: [
      { word: "encore faudrait-il", translation: "one would still need to / but then again", pronunciation: "ahn-KOHR foh-DREH-teel", exampleSentence: "C'est une belle idee, encore faudrait-il la financer.", exampleTranslation: "It's a nice idea, but one would still need to finance it.", partOfSpeech: "phrase" },
      { word: "un argument a double tranchant", translation: "a double-edged argument", pronunciation: "uhn ahr-goo-MAHN ah DOO-bluh trahn-SHAHN", exampleSentence: "Attention, c'est un argument a double tranchant.", exampleTranslation: "Careful, that's a double-edged argument.", partOfSpeech: "phrase" },
      { word: "je vous l'accorde", translation: "I'll grant you that", pronunciation: "zhuh voo lah-KOHRD", exampleSentence: "Je vous l'accorde, la situation est complexe.", exampleTranslation: "I'll grant you that, the situation is complex.", partOfSpeech: "phrase" },
      { word: "soit", translation: "fine / so be it / granted", pronunciation: "swah", exampleSentence: "Soit. Mais cela ne change rien au probleme de fond.", exampleTranslation: "Fine. But that doesn't change the underlying problem.", partOfSpeech: "interjection" },
      { word: "un presuppose", translation: "a presupposition / assumption", pronunciation: "uhn pray-soo-poh-ZAY", exampleSentence: "Votre argument repose sur un presuppose non demontre.", exampleTranslation: "Your argument rests on an unproven assumption.", partOfSpeech: "noun" },
      { word: "revenons a l'essentiel", translation: "let's return to the essential point", pronunciation: "ruh-vuh-NOHN ah leh-sahn-SYEL", exampleSentence: "On s'egare. Revenons a l'essentiel.", exampleTranslation: "We're getting sidetracked. Let's return to the essential point.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Inversion for Rhetorical Effect",
        explanation: "Beyond question formation, French uses subject-verb inversion for rhetorical emphasis and literary flair. **Encore faut-il...** (yet one must still...), **Toujours est-il que...** (the fact remains that...), **Peut-etre faudrait-il...** (perhaps one should...). These structures signal intellectual sophistication and are expected in formal debate.",
        examples: [
          { correct: "Encore faut-il que cette proposition soit realisable.", translation: "One must still ensure this proposal is feasible." },
          { correct: "Toujours est-il que le probleme demeure.", translation: "The fact remains that the problem persists." },
          { correct: "Peut-etre aurions-nous du anticiper cette crise.", translation: "Perhaps we should have anticipated this crisis." },
        ],
        commonMistakes: [
          { incorrect: "Peut-etre nous aurions du anticiper...", correction: "Peut-etre aurions-nous du anticiper...", explanation: "After adverbs like peut-etre, sans doute, encore at the start of a clause, inversion is required in formal/literary French." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-adv-live-debate",
        title: "The Impromptu Debate",
        situation: "You are on a French talk show panel debating: 'L'intelligence artificielle menace-t-elle la creativite humaine ?'",
        agentRole: "You are the debate moderator and also play a panellist who argues the opposing position. Push the student to defend their view, concede points, and redirect when challenged.",
        userGoal: "Build and defend an argument spontaneously, concede where appropriate, challenge weak points in the opposing view, and maintain composure under pressure",
        targetPhrases: ["A mon sens...", "Encore faudrait-il...", "Je vous l'accorde, mais...", "Revenons a l'essentiel", "C'est un argument a double tranchant"],
        successCriteria: ["States a clear thesis", "Supports with at least 2 reasons", "Concedes a point gracefully", "Challenges opponent's reasoning", "Uses rhetorical inversion at least once", "Stays on topic or redirects effectively"],
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  { id: "fr-adv-m1", title: "Module 1: Mastering Nuance", description: "Registers, idioms, irony, and advanced tone", order: 1, lessons: module1Lessons },
  { id: "fr-adv-m2", title: "Module 2: Academic & Professional French", description: "Dissertation writing, presentations, scientific and legal French", order: 2, lessons: module2Lessons },
  { id: "fr-adv-m3", title: "Module 3: French Culture & Literature", description: "Literary movements, major authors, and cinema", order: 3, lessons: module3Lessons },
  { id: "fr-adv-m4", title: "Module 4: Contemporary France & Francophonie", description: "Current debates, the Francophone world, and media analysis", order: 4, lessons: module4Lessons },
  { id: "fr-adv-m5", title: "Module 5: Near-Native Mastery", description: "Abstract reasoning, creative writing, and spontaneous argumentation", order: 5, lessons: module5Lessons },
];

export const frenchAdvancedCourse: LanguageCourse = { ...courseInfo, modules };

export function getFrenchAdvancedLessons() {
  return modules.flatMap((m) => m.lessons);
}

export function findFrenchAdvancedLesson(slug: string) {
  return getFrenchAdvancedLessons().find((l) => l.slug === slug);
}
