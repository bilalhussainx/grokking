// French Intermediate (B1) Course Data
// CEFR B1 Level - Expressing Opinions, Work, Media, Society, Argumentation, Complex Situations

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "french-intermediate",
  slug: "french-intermediate",
  title: "French Intermediate - B1",
  language: "fr",
  languageName: "French",
  proficiencyLevel: "B1" as const,
  description: "Express opinions, discuss current events, navigate professional settings, and handle complex real-life situations in French. Build toward fluency with subjunctive, conditional, and advanced argumentation.",
  targetAudience: "Learners who have completed French A1-A2 and can handle basic conversations",
  estimatedHours: 80,
  icon: "\u{1F1EB}\u{1F1F7}",
  prerequisiteCourseSlug: "french-beginner",
  nextCourseSlug: "french-advanced",
};

// ============================================
// Module 1: Expressing Yourself
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "fr-int-l1",
    slug: "opinions-and-beliefs",
    title: "Opinions & Beliefs",
    content: `# Donner Son Avis

Learn to share your opinions and beliefs confidently in French.

## Expressing Opinions

- **Je pense que...** - I think that...
- **Je crois que...** - I believe that...
- **A mon avis...** - In my opinion...
- **Il me semble que...** - It seems to me that...
- **Je trouve que...** - I find that...
- **Selon moi...** - According to me...

## Nuancing Your Opinion

- **Je suis convaincu(e) que...** - I'm convinced that...
- **Je ne suis pas sur(e) que...** - I'm not sure that...
- **J'ai l'impression que...** - I have the feeling that...

## Example Dialogue

> **A:** Qu'est-ce que tu penses de ce film ?
> **B:** Je trouve que c'est un chef-d'oeuvre. A mon avis, le realisateur est brillant.
> **A:** Je ne suis pas d'accord. Je pense que l'histoire est trop lente.`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m1",
    moduleTitle: "Expressing Yourself",
    order: 1,
    topicId: "fr-intermediate-opinions-and-beliefs",
    vocabulary: [
      { word: "je pense que", translation: "I think that", pronunciation: "zhuh pahns kuh", exampleSentence: "Je pense que c'est une bonne idee.", exampleTranslation: "I think it's a good idea.", partOfSpeech: "phrase" },
      { word: "a mon avis", translation: "in my opinion", pronunciation: "ah mohn ah-VEE", exampleSentence: "A mon avis, il faut agir vite.", exampleTranslation: "In my opinion, we need to act quickly.", partOfSpeech: "phrase" },
      { word: "convaincu", translation: "convinced", pronunciation: "kohn-van-KOO", exampleSentence: "Je suis convaincu que c'est vrai.", exampleTranslation: "I'm convinced it's true.", partOfSpeech: "adjective" },
      { word: "il me semble", translation: "it seems to me", pronunciation: "eel muh SAHM-bluh", exampleSentence: "Il me semble que tu as raison.", exampleTranslation: "It seems to me that you're right.", partOfSpeech: "phrase" },
      { word: "selon", translation: "according to", pronunciation: "suh-LOHN", exampleSentence: "Selon les experts, c'est normal.", exampleTranslation: "According to the experts, it's normal.", partOfSpeech: "preposition" },
    ],
    grammarPoints: [
      {
        title: "Indicative After Opinion Verbs (Affirmative)",
        explanation: "When 'je pense que', 'je crois que', 'je trouve que' are used in the **affirmative**, the verb that follows is in the **indicative** mood (normal conjugation). The subjunctive is NOT used here.",
        examples: [
          { correct: "Je pense qu'il a raison.", translation: "I think he is right." },
          { correct: "Je crois que nous pouvons reussir.", translation: "I believe we can succeed." },
        ],
        commonMistakes: [
          { incorrect: "Je pense qu'il ait raison.", correction: "Je pense qu'il a raison.", explanation: "After 'je pense que' in the affirmative, use indicative (a), not subjunctive (ait)." },
        ],
      },
      {
        title: "The Conditional for Polite Opinions",
        explanation: "Use the conditional tense to soften an opinion: **je dirais que** (I would say that), **je penserais que** (I would think that). Form: infinitive stem + -ais, -ais, -ait, -ions, -iez, -aient.",
        examples: [
          { correct: "Je dirais que c'est un bon choix.", translation: "I would say it's a good choice." },
          { correct: "On pourrait dire que...", translation: "One could say that..." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-opinion-debate",
        title: "Friendly Debate at Dinner",
        situation: "You're at a dinner party in Bordeaux. Your host asks your opinion about French cinema versus Hollywood.",
        agentRole: "You are Mathieu, a passionate cinephile from Bordeaux. Ask the student about their movie preferences and politely challenge their opinions.",
        userGoal: "Express your opinions about films, agree and disagree politely, and justify your views",
        targetPhrases: ["Je pense que...", "A mon avis...", "Je ne suis pas d'accord parce que..."],
        successCriteria: ["Expresses at least two opinions", "Uses opinion phrases", "Provides reasoning for views"],
        hints: ["Start with 'A mon avis...' to share your view", "Use 'parce que' to give reasons"],
      },
    ],
    culturalNotes: [
      {
        title: "The French Art of Debate",
        content: "In France, intellectual debate is a social pastime, not confrontation. Disagreeing is not rude — it's expected and enjoyed. The French value well-reasoned arguments. Phrases like 'Je ne suis pas d'accord' are perfectly polite when followed by a thoughtful explanation.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-int-l2",
    slug: "agreeing-and-disagreeing",
    title: "Agreeing & Disagreeing",
    content: `# Etre d'Accord ou Pas

Master the art of agreeing and disagreeing gracefully in French.

## Agreeing

- **Je suis d'accord (avec toi/vous)** - I agree (with you)
- **Tout a fait !** - Absolutely!
- **Exactement !** - Exactly!
- **Tu as / Vous avez raison** - You're right
- **C'est vrai** - That's true
- **Effectivement** - Indeed

## Disagreeing Politely

- **Je ne suis pas d'accord** - I disagree
- **Ce n'est pas tout a fait vrai** - That's not entirely true
- **Je vois les choses differemment** - I see things differently
- **Peut-etre, mais...** - Maybe, but...
- **Je comprends ton point de vue, mais...** - I understand your point of view, but...

## Partial Agreement

- **Tu as raison sur un point, mais...** - You're right on one point, but...
- **C'est vrai en partie** - It's partly true
- **Oui et non** - Yes and no`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m1",
    moduleTitle: "Expressing Yourself",
    order: 2,
    topicId: "fr-intermediate-agreeing-and-disagreeing",
    vocabulary: [
      { word: "d'accord", translation: "in agreement", pronunciation: "dah-KOHR", exampleSentence: "Je suis tout a fait d'accord.", exampleTranslation: "I completely agree.", partOfSpeech: "adjective" },
      { word: "effectivement", translation: "indeed / actually", pronunciation: "eh-fek-teev-MAHN", exampleSentence: "Effectivement, c'est un probleme serieux.", exampleTranslation: "Indeed, it's a serious problem.", partOfSpeech: "adverb" },
      { word: "peut-etre", translation: "maybe / perhaps", pronunciation: "puh-TEH-truh", exampleSentence: "Peut-etre, mais je reste sceptique.", exampleTranslation: "Maybe, but I remain skeptical.", partOfSpeech: "adverb" },
      { word: "point de vue", translation: "point of view", pronunciation: "pwan duh VOO", exampleSentence: "Je respecte ton point de vue.", exampleTranslation: "I respect your point of view.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Contrasting with 'Mais', 'Cependant', 'Pourtant'",
        explanation: "French has several words for 'but/however': **mais** (but — most common), **cependant** (however — formal), **pourtant** (yet/nevertheless), **en revanche** (on the other hand).",
        examples: [
          { correct: "C'est interessant, mais je ne suis pas convaincu.", translation: "It's interesting, but I'm not convinced." },
          { correct: "Il fait beau. Cependant, il fait froid.", translation: "The weather is nice. However, it's cold." },
          { correct: "Elle est jeune, pourtant elle est tres mature.", translation: "She's young, yet she's very mature." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-agree-disagree",
        title: "Discussing Travel Plans",
        situation: "You and a French colleague are planning a team outing. You need to agree on a destination.",
        agentRole: "You are Sandrine, a colleague who strongly prefers a mountain trip. Present your case and react to the student's preferences.",
        userGoal: "Agree with some points, disagree with others, and suggest a compromise",
        targetPhrases: ["Je suis d'accord sur...", "Peut-etre, mais...", "Je vois les choses differemment"],
        successCriteria: ["Uses agreement phrases", "Disagrees politely at least once", "Proposes a compromise"],
      },
    ],
  },
  {
    id: "fr-int-l3",
    slug: "storytelling-and-narration",
    title: "Storytelling & Narration",
    content: `# Raconter une Histoire

Learn to tell stories and narrate past events in a compelling way.

## Story Structure

- **Il etait une fois...** - Once upon a time...
- **D'abord... ensuite... puis... enfin...** - First... then... next... finally...
- **Tout a coup...** - Suddenly...
- **A ce moment-la...** - At that moment...
- **En fin de compte...** - In the end...

## Connecting Your Narrative

- **Pendant que...** - While...
- **Apres avoir / etre + past participle** - After having...
- **Avant de + infinitive** - Before (doing)...
- **Grace a...** - Thanks to...
- **A cause de...** - Because of...

## Expressing Reactions

- **J'etais surpris(e) de voir...** - I was surprised to see...
- **Ce qui m'a frappe, c'est...** - What struck me was...
- **Je n'en revenais pas !** - I couldn't believe it!`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m1",
    moduleTitle: "Expressing Yourself",
    order: 3,
    topicId: "fr-intermediate-storytelling-and-narration",
    vocabulary: [
      { word: "tout a coup", translation: "suddenly", pronunciation: "too tah KOO", exampleSentence: "Tout a coup, il a commence a pleuvoir.", exampleTranslation: "Suddenly, it started to rain.", partOfSpeech: "adverb" },
      { word: "ensuite", translation: "then / next", pronunciation: "ahn-SWEET", exampleSentence: "Ensuite, nous sommes alles au musee.", exampleTranslation: "Then, we went to the museum.", partOfSpeech: "adverb" },
      { word: "grace a", translation: "thanks to", pronunciation: "grahs ah", exampleSentence: "Grace a toi, j'ai reussi l'examen.", exampleTranslation: "Thanks to you, I passed the exam.", partOfSpeech: "preposition" },
      { word: "a cause de", translation: "because of", pronunciation: "ah kohz duh", exampleSentence: "A cause de la pluie, le match est annule.", exampleTranslation: "Because of the rain, the match is canceled.", partOfSpeech: "preposition" },
      { word: "en fin de compte", translation: "in the end", pronunciation: "ahn fan duh KOHNT", exampleSentence: "En fin de compte, tout s'est bien passe.", exampleTranslation: "In the end, everything went well.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Imparfait vs. Passe Compose in Narration",
        explanation: "When telling stories, use the **imparfait** for background/descriptions (what was happening, how things were) and **passe compose** for completed actions (what happened). The imparfait sets the scene; the passe compose moves the plot forward.",
        examples: [
          { correct: "Il faisait beau quand nous sommes arrives.", translation: "The weather was nice when we arrived.", note: "Imparfait (faisait) = background; Passe compose (sommes arrives) = event" },
          { correct: "Je dormais quand le telephone a sonne.", translation: "I was sleeping when the phone rang." },
        ],
        commonMistakes: [
          { incorrect: "Il a fait beau quand nous sommes arrives.", correction: "Il faisait beau quand nous sommes arrives.", explanation: "Weather/background descriptions use imparfait, not passe compose." },
        ],
      },
      {
        title: "'Apres avoir/etre + Past Participle' for Sequencing",
        explanation: "To say 'after doing something', use **apres avoir + past participle** (most verbs) or **apres etre + past participle** (movement/reflexive verbs).",
        examples: [
          { correct: "Apres avoir mange, nous sommes sortis.", translation: "After eating, we went out." },
          { correct: "Apres etre arrivee, elle a telephone.", translation: "After arriving, she called." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-storytelling",
        title: "A Weekend Adventure",
        situation: "You're telling a French friend about an eventful weekend trip you took.",
        agentRole: "You are Julien, a curious friend. Ask follow-up questions about the story: what happened next, how did you feel, what did you do then?",
        userGoal: "Tell a coherent story about a past event using time markers and both past tenses",
        targetPhrases: ["D'abord...", "Tout a coup...", "Apres avoir...", "En fin de compte..."],
        successCriteria: ["Uses narrative time markers", "Alternates imparfait and passe compose", "Tells a coherent story with beginning, middle, and end"],
        hints: ["Set the scene with imparfait: 'Il faisait beau, j'etais content...'", "Move the plot with passe compose: 'Tout a coup, j'ai vu...'"],
      },
    ],
  },
];

// ============================================
// Module 2: Work & Education
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "fr-int-l4",
    slug: "jobs-and-professions",
    title: "Jobs & Professions",
    content: `# Les Metiers et les Professions

Discuss work and careers with confidence.

## Common Professions

- **un(e) avocat(e)** - a lawyer
- **un(e) ingenieur(e)** - an engineer
- **un(e) informaticien(ne)** - a computer scientist / IT professional
- **un(e) comptable** - an accountant
- **un(e) medecin** - a doctor
- **un(e) enseignant(e)** - a teacher

## Talking About Work

- **Je travaille dans le domaine de...** - I work in the field of...
- **Je suis en charge de...** - I'm in charge of...
- **Mon travail consiste a...** - My job consists of...
- **Je m'occupe de...** - I take care of / deal with...

## Career Aspirations

- **Je voudrais devenir...** - I would like to become...
- **Mon objectif professionnel est de...** - My career goal is to...
- **J'envisage de changer de metier** - I'm considering changing careers`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m2",
    moduleTitle: "Work & Education",
    order: 4,
    topicId: "fr-intermediate-jobs-and-professions",
    vocabulary: [
      { word: "un metier", translation: "a profession / trade", pronunciation: "uhn may-TYAY", exampleSentence: "Quel metier voulez-vous exercer ?", exampleTranslation: "What profession do you want to practice?", partOfSpeech: "noun" },
      { word: "une entreprise", translation: "a company / business", pronunciation: "oon ahn-truh-PREEZ", exampleSentence: "Je travaille dans une grande entreprise.", exampleTranslation: "I work in a large company.", partOfSpeech: "noun" },
      { word: "un emploi", translation: "a job / employment", pronunciation: "uhn ahm-PLWAH", exampleSentence: "Elle cherche un emploi a temps plein.", exampleTranslation: "She's looking for a full-time job.", partOfSpeech: "noun" },
      { word: "le salaire", translation: "salary", pronunciation: "luh sah-LEHR", exampleSentence: "Le salaire est negocie lors de l'entretien.", exampleTranslation: "The salary is negotiated during the interview.", partOfSpeech: "noun" },
      { word: "une reunion", translation: "a meeting", pronunciation: "oon ray-oo-NYOHN", exampleSentence: "J'ai une reunion a quatorze heures.", exampleTranslation: "I have a meeting at 2 PM.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Future Simple (Le Futur Simple)",
        explanation: "The future simple is formed with the infinitive + endings: **-ai, -as, -a, -ons, -ez, -ont**. For -re verbs, drop the final 'e' before adding endings. Used for plans, predictions, and formal promises.",
        examples: [
          { correct: "Je travaillerai dans la finance.", translation: "I will work in finance." },
          { correct: "Nous embaucherons trois personnes.", translation: "We will hire three people." },
          { correct: "Il deviendra directeur.", translation: "He will become director.", note: "Devenir has an irregular stem: deviendr-" },
        ],
        commonMistakes: [
          { incorrect: "Je travaillerai a la finance.", correction: "Je travaillerai dans la finance.", explanation: "Use 'dans' (not 'a') with fields/domains." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-job-networking",
        title: "Professional Networking Event",
        situation: "You're at a networking event in Paris and meet a French professional.",
        agentRole: "You are Claire, a marketing director at a tech startup. Ask about the student's job, their career path, and professional goals.",
        userGoal: "Describe your job, explain your responsibilities, and discuss career aspirations",
        targetPhrases: ["Je travaille dans...", "Mon travail consiste a...", "Je voudrais devenir..."],
        successCriteria: ["Describes current role", "Explains responsibilities", "Mentions future goals"],
      },
    ],
  },
  {
    id: "fr-int-l5",
    slug: "formal-writing",
    title: "Formal Letters & CVs",
    content: `# La Correspondance Formelle

Write professional French emails, letters, and CVs.

## Formal Letter Structure

- **Madame, Monsieur,** - Dear Sir/Madam (opening)
- **Suite a votre annonce...** - Following your advertisement...
- **Je me permets de vous ecrire pour...** - I am writing to you to...
- **Veuillez agreer, Madame, Monsieur, l'expression de mes salutations distinguees.** - Yours faithfully

## CV Key Sections

- **Formation** - Education
- **Experience professionnelle** - Work experience
- **Competences** - Skills
- **Langues** - Languages
- **Centres d'interet** - Interests/Hobbies

## Useful Phrases

- **Diplome en...** - Degree in...
- **Maitrise de...** - Proficiency in...
- **Capacite a travailler en equipe** - Ability to work in a team
- **Autonome et organise(e)** - Independent and organized`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m2",
    moduleTitle: "Work & Education",
    order: 5,
    topicId: "fr-intermediate-formal-writing",
    vocabulary: [
      { word: "une candidature", translation: "an application", pronunciation: "oon kahn-dee-dah-TOOR", exampleSentence: "J'ai envoye ma candidature hier.", exampleTranslation: "I sent my application yesterday.", partOfSpeech: "noun" },
      { word: "un entretien", translation: "an interview", pronunciation: "uhn ahn-truh-TYEHN", exampleSentence: "J'ai un entretien d'embauche lundi.", exampleTranslation: "I have a job interview on Monday.", partOfSpeech: "noun" },
      { word: "une lettre de motivation", translation: "a cover letter", pronunciation: "oon LEH-truh duh moh-tee-vah-SYOHN", exampleSentence: "Votre lettre de motivation doit etre concise.", exampleTranslation: "Your cover letter should be concise.", partOfSpeech: "noun" },
      { word: "les competences", translation: "skills", pronunciation: "lay kohm-pay-TAHNSS", exampleSentence: "Quelles sont vos competences principales ?", exampleTranslation: "What are your main skills?", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Relative Pronouns: Qui, Que, Dont, Ou",
        explanation: "Relative pronouns connect clauses: **qui** (who/which — subject), **que** (whom/which — object), **dont** (of which/whose), **ou** (where/when).",
        examples: [
          { correct: "C'est l'entreprise qui recrute.", translation: "That's the company that is hiring.", note: "Qui = subject of the relative clause" },
          { correct: "Le poste que j'ai obtenu est interessant.", translation: "The position (that) I got is interesting.", note: "Que = object of the relative clause" },
          { correct: "C'est le domaine dont je parlais.", translation: "That's the field I was talking about.", note: "Dont replaces 'de + noun'" },
          { correct: "La ville ou je travaille est grande.", translation: "The city where I work is big." },
        ],
        commonMistakes: [
          { incorrect: "Le poste qui j'ai obtenu", correction: "Le poste que j'ai obtenu", explanation: "'J'ai obtenu le poste' — 'le poste' is the object, so use 'que', not 'qui'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-job-interview",
        title: "Job Interview Preparation",
        situation: "You're rehearsing for a job interview at a French company.",
        agentRole: "You are Monsieur Dupont, an HR manager at a prestigious French firm. Conduct a formal job interview, asking about qualifications, experience, and motivation.",
        userGoal: "Present your qualifications formally, explain your motivation, and ask about the position",
        targetPhrases: ["Je me permets de...", "Mon experience m'a permis de...", "Je suis motive(e) par..."],
        successCriteria: ["Uses formal register", "Describes qualifications", "Asks a relevant question about the role"],
      },
    ],
    culturalNotes: [
      {
        title: "The French CV Photo",
        content: "Unlike many English-speaking countries, French CVs traditionally include a professional photo. While this is becoming less mandatory, many employers still expect one. French CVs also commonly include date of birth, nationality, and marital status — information that would be unusual on an American resume.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-int-l6",
    slug: "education-and-training",
    title: "Education & Training",
    content: `# L'Education et la Formation

Discuss education, studies, and professional development.

## The French Education System

- **l'ecole maternelle** - preschool
- **l'ecole primaire** - primary school
- **le college** - middle school (not university!)
- **le lycee** - high school
- **l'universite / la fac** - university
- **une grande ecole** - elite institution

## Talking About Studies

- **Je fais des etudes de...** - I'm studying...
- **Je suis en premiere / deuxieme annee** - I'm in first / second year
- **J'ai obtenu mon diplome en...** - I got my degree in...
- **Je suis en formation professionnelle** - I'm in vocational training

## Useful Expressions

- **Passer un examen** - To take an exam (NOT to pass!)
- **Reussir un examen** - To pass an exam
- **Echouer / Rater un examen** - To fail an exam
- **Obtenir une bourse** - To get a scholarship`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m2",
    moduleTitle: "Work & Education",
    order: 6,
    topicId: "fr-intermediate-education-and-training",
    vocabulary: [
      { word: "les etudes", translation: "studies", pronunciation: "lay zay-TOOD", exampleSentence: "Je fais des etudes de droit.", exampleTranslation: "I'm studying law.", partOfSpeech: "noun" },
      { word: "un diplome", translation: "a degree / diploma", pronunciation: "uhn dee-PLOHM", exampleSentence: "Il a un diplome d'ingenieur.", exampleTranslation: "He has an engineering degree.", partOfSpeech: "noun" },
      { word: "une formation", translation: "training / education", pronunciation: "oon fohr-mah-SYOHN", exampleSentence: "Cette formation dure six mois.", exampleTranslation: "This training lasts six months.", partOfSpeech: "noun" },
      { word: "reussir", translation: "to succeed / to pass", pronunciation: "ray-oo-SEER", exampleSentence: "J'ai reussi tous mes examens.", exampleTranslation: "I passed all my exams.", partOfSpeech: "verb" },
      { word: "une bourse", translation: "a scholarship / grant", pronunciation: "oon BOORSS", exampleSentence: "Elle a obtenu une bourse d'etudes.", exampleTranslation: "She obtained a study grant.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Future Simple: Irregular Stems",
        explanation: "Several common verbs have irregular stems in the future tense. The endings remain the same (-ai, -as, -a, -ons, -ez, -ont). Key irregular stems: **etre** → ser-, **avoir** → aur-, **faire** → fer-, **aller** → ir-, **savoir** → saur-, **pouvoir** → pourr-, **vouloir** → voudr-.",
        examples: [
          { correct: "Je serai diplome en juin.", translation: "I will be graduated in June." },
          { correct: "Nous aurons les resultats demain.", translation: "We will have the results tomorrow." },
          { correct: "Ils feront un stage cet ete.", translation: "They will do an internship this summer." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-education-chat",
        title: "Comparing Education Systems",
        situation: "You meet a French university student at an international conference.",
        agentRole: "You are Leila, a French student at Sciences Po. Talk about your studies, the French system, and ask the student about their educational background.",
        userGoal: "Describe your educational background, ask about the French system, and discuss future academic plans",
        targetPhrases: ["Je fais des etudes de...", "J'ai obtenu mon diplome en...", "Je voudrais faire une formation en..."],
        successCriteria: ["Describes their education", "Asks about the French system", "Uses future tense for plans"],
      },
    ],
  },
];

// ============================================
// Module 3: Media & Current Events
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "fr-int-l7",
    slug: "news-and-media",
    title: "News & Media",
    content: `# Les Medias et l'Actualite

Understand and discuss news topics in French.

## News Vocabulary

- **un journal / un quotidien** - a newspaper / a daily
- **un article** - an article
- **un reportage** - a report / feature story
- **les informations / les infos** - the news
- **un(e) journaliste** - a journalist
- **une enquete** - an investigation

## Discussing Current Events

- **Vous avez entendu parler de... ?** - Have you heard about...?
- **Selon les medias...** - According to the media...
- **D'apres cet article...** - According to this article...
- **Il parait que...** - It appears that... / Apparently...
- **On dit que...** - They say that...

## Expressing Reactions to News

- **C'est inquietant / rassurant** - It's worrying / reassuring
- **Je trouve ca scandaleux** - I find that outrageous
- **Ca me surprend** - That surprises me
- **C'est encourageant** - It's encouraging`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m3",
    moduleTitle: "Media & Current Events",
    order: 7,
    topicId: "fr-intermediate-news-and-media",
    vocabulary: [
      { word: "l'actualite", translation: "current events / news", pronunciation: "lak-too-ah-lee-TAY", exampleSentence: "Je suis l'actualite tous les jours.", exampleTranslation: "I follow the news every day.", partOfSpeech: "noun" },
      { word: "un reportage", translation: "a report / feature story", pronunciation: "uhn ruh-pohr-TAHZH", exampleSentence: "J'ai vu un reportage sur le rechauffement climatique.", exampleTranslation: "I saw a report on global warming.", partOfSpeech: "noun" },
      { word: "inquietant", translation: "worrying / concerning", pronunciation: "ahn-kyay-TAHN", exampleSentence: "La situation est inquietante.", exampleTranslation: "The situation is worrying.", partOfSpeech: "adjective" },
      { word: "une enquete", translation: "an investigation / survey", pronunciation: "oon ahn-KET", exampleSentence: "La police a ouvert une enquete.", exampleTranslation: "The police opened an investigation.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Introduction to the Subjunctive: 'Il faut que'",
        explanation: "The subjunctive mood is used after expressions of necessity, emotion, doubt, and desire. The most common trigger is **il faut que** (it is necessary that). Formation: take the 'ils' form of the present tense, drop '-ent', and add: -e, -es, -e, -ions, -iez, -ent.",
        examples: [
          { correct: "Il faut que je lise les informations.", translation: "I need to read the news." },
          { correct: "Il faut que nous soyons informes.", translation: "We need to be informed.", note: "Etre is irregular in the subjunctive: sois, sois, soit, soyons, soyez, soient" },
        ],
        commonMistakes: [
          { incorrect: "Il faut que je lis le journal.", correction: "Il faut que je lise le journal.", explanation: "After 'il faut que', use the subjunctive (lise), not the indicative (lis)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-news-discussion",
        title: "Morning News Discussion",
        situation: "You're having breakfast with your French host family and they ask about a news story.",
        agentRole: "You are Philippe, a retired journalist. Discuss the morning headlines and ask the student for their reactions and opinions on current events.",
        userGoal: "Discuss a news topic, express your reaction, and ask follow-up questions",
        targetPhrases: ["Vous avez entendu parler de... ?", "Je trouve ca...", "Il faut que..."],
        successCriteria: ["References a news topic", "Expresses a reaction", "Uses at least one subjunctive construction"],
      },
    ],
  },
  {
    id: "fr-int-l8",
    slug: "arts-and-culture",
    title: "Arts & Culture",
    content: `# Les Arts et la Culture

Discuss art, literature, music, and cultural events.

## Art Forms

- **la peinture** - painting
- **la sculpture** - sculpture
- **le cinema** - cinema
- **le theatre** - theater
- **la litterature** - literature
- **la musique** - music
- **la danse** - dance

## Describing Art

- **C'est une oeuvre...** - It's a work that is...
- **Ca evoque...** - It evokes...
- **L'artiste cherche a exprimer...** - The artist seeks to express...
- **Ce tableau me fait penser a...** - This painting makes me think of...
- **Je suis touche(e) par...** - I'm moved by...

## Cultural Activities

- **Aller voir une exposition** - To go see an exhibition
- **Assister a un concert** - To attend a concert
- **Lire un roman** - To read a novel
- **Voir une piece de theatre** - To see a play`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m3",
    moduleTitle: "Media & Current Events",
    order: 8,
    topicId: "fr-intermediate-arts-and-culture",
    vocabulary: [
      { word: "une oeuvre", translation: "a work (of art)", pronunciation: "oon UH-vruh", exampleSentence: "C'est une oeuvre magistrale.", exampleTranslation: "It's a masterful work.", partOfSpeech: "noun" },
      { word: "un spectacle", translation: "a show / performance", pronunciation: "uhn spek-TAH-kluh", exampleSentence: "Le spectacle commence a vingt heures.", exampleTranslation: "The show starts at 8 PM.", partOfSpeech: "noun" },
      { word: "un chef-d'oeuvre", translation: "a masterpiece", pronunciation: "uhn sheh-DUH-vruh", exampleSentence: "Ce film est un chef-d'oeuvre du cinema francais.", exampleTranslation: "This film is a masterpiece of French cinema.", partOfSpeech: "noun" },
      { word: "emouvant", translation: "moving / touching", pronunciation: "ay-moo-VAHN", exampleSentence: "Le concert etait tres emouvant.", exampleTranslation: "The concert was very moving.", partOfSpeech: "adjective" },
      { word: "une exposition", translation: "an exhibition", pronunciation: "oon eks-poh-zee-SYOHN", exampleSentence: "Il y a une exposition de Monet au Grand Palais.", exampleTranslation: "There's a Monet exhibition at the Grand Palais.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Subjunctive After Emotion Verbs",
        explanation: "The subjunctive is required after verbs and expressions of emotion: **je suis content(e) que**, **je regrette que**, **c'est dommage que**, **j'ai peur que**, **je suis surpris(e) que**.",
        examples: [
          { correct: "Je suis content que tu aimes cette exposition.", translation: "I'm happy that you like this exhibition." },
          { correct: "C'est dommage qu'il ne puisse pas venir.", translation: "It's a shame he can't come.", note: "Pouvoir subjunctive: puisse" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-museum-visit",
        title: "At an Art Museum",
        situation: "You're visiting the Musee d'Orsay in Paris with a French friend.",
        agentRole: "You are Amelie, an art history student. Walk through the museum with the student, describe paintings, and ask what they think and feel about the art.",
        userGoal: "Describe your reactions to artwork, express what you like and dislike, and discuss art",
        targetPhrases: ["Ce tableau me fait penser a...", "Je suis touche(e) par...", "Je trouve que c'est..."],
        successCriteria: ["Describes reaction to at least one artwork", "Uses descriptive vocabulary", "Expresses personal taste"],
      },
    ],
    culturalNotes: [
      {
        title: "La Fete de la Musique",
        content: "Every June 21st, France celebrates the Fete de la Musique — a nationwide music festival where amateur and professional musicians perform free concerts in streets, parks, and squares. Created in 1982, it has spread to over 120 countries. It coincides with the summer solstice and is a beloved tradition.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-int-l9",
    slug: "technology-and-innovation",
    title: "Technology & Innovation",
    content: `# La Technologie et l'Innovation

Navigate the digital world in French.

## Technology Vocabulary

- **un ordinateur** - a computer
- **un logiciel** - software
- **un reseau social** - a social network
- **l'intelligence artificielle (IA)** - artificial intelligence (AI)
- **les donnees** - data
- **une application / une appli** - an app
- **un moteur de recherche** - a search engine

## Discussing Technology

- **La technologie a transforme...** - Technology has transformed...
- **Grace aux nouvelles technologies...** - Thanks to new technologies...
- **Les avantages / les inconvenients de...** - The advantages / disadvantages of...
- **L'impact de... sur la societe** - The impact of... on society

## Digital Life

- **Se connecter / Se deconnecter** - To log in / log out
- **Telecharger** - To download
- **Partager** - To share
- **Mettre a jour** - To update
- **Sauvegarder** - To save / back up`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m3",
    moduleTitle: "Media & Current Events",
    order: 9,
    topicId: "fr-intermediate-technology-and-innovation",
    vocabulary: [
      { word: "un logiciel", translation: "software", pronunciation: "uhn loh-zhee-SYEL", exampleSentence: "Ce logiciel est gratuit.", exampleTranslation: "This software is free.", partOfSpeech: "noun" },
      { word: "les donnees", translation: "data", pronunciation: "lay doh-NAY", exampleSentence: "Il faut proteger ses donnees personnelles.", exampleTranslation: "One must protect one's personal data.", partOfSpeech: "noun" },
      { word: "telecharger", translation: "to download", pronunciation: "tay-lay-shar-ZHAY", exampleSentence: "J'ai telecharge la nouvelle application.", exampleTranslation: "I downloaded the new app.", partOfSpeech: "verb" },
      { word: "un reseau", translation: "a network", pronunciation: "uhn ray-ZOH", exampleSentence: "Les reseaux sociaux influencent l'opinion publique.", exampleTranslation: "Social networks influence public opinion.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "The Passive Voice (La Voix Passive)",
        explanation: "The passive voice is formed with **etre + past participle**. The past participle agrees with the subject. Use **par** to indicate the agent (who/what performs the action).",
        examples: [
          { correct: "Le logiciel a ete developpe par une equipe francaise.", translation: "The software was developed by a French team." },
          { correct: "Les donnees sont protegees par un mot de passe.", translation: "The data is protected by a password." },
        ],
        commonMistakes: [
          { incorrect: "Le logiciel a ete developpe par une equipe francais.", correction: "Le logiciel a ete developpe par une equipe francaise.", explanation: "Equipe is feminine, so the adjective must be 'francaise'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-tech-debate",
        title: "Technology Debate",
        situation: "You're in a French language class discussing the impact of social media on society.",
        agentRole: "You are Professeur Martin, leading a classroom discussion. Ask students to present advantages and disadvantages of social media and AI, and challenge their reasoning.",
        userGoal: "Present a balanced view of technology's impact, using advantages and disadvantages",
        targetPhrases: ["Les avantages de...", "En revanche, les inconvenients...", "La technologie a transforme..."],
        successCriteria: ["Presents at least one advantage", "Presents at least one disadvantage", "Uses appropriate technology vocabulary"],
      },
    ],
  },
];

// ============================================
// Module 4: Society & Relationships
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "fr-int-l10",
    slug: "social-issues",
    title: "Social Issues",
    content: `# Les Questions de Societe

Discuss important social topics in French.

## Key Topics

- **l'egalite des chances** - equal opportunities
- **le chomage** - unemployment
- **la pauvrete** - poverty
- **l'immigration** - immigration
- **le logement** - housing
- **la sante publique** - public health

## Expressing Concern

- **Je suis preoccupe(e) par...** - I'm concerned about...
- **C'est un probleme majeur** - It's a major problem
- **Il faudrait que le gouvernement...** - The government should...
- **La situation s'aggrave / s'ameliore** - The situation is getting worse / better

## Proposing Solutions

- **On devrait...** - We should...
- **Il serait necessaire de...** - It would be necessary to...
- **Une solution possible serait de...** - A possible solution would be to...
- **Il faut prendre des mesures pour...** - We need to take measures to...`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m4",
    moduleTitle: "Society & Relationships",
    order: 10,
    topicId: "fr-intermediate-social-issues",
    vocabulary: [
      { word: "le chomage", translation: "unemployment", pronunciation: "luh shoh-MAHZH", exampleSentence: "Le taux de chomage a augmente.", exampleTranslation: "The unemployment rate has increased.", partOfSpeech: "noun" },
      { word: "l'egalite", translation: "equality", pronunciation: "lay-gah-lee-TAY", exampleSentence: "L'egalite entre hommes et femmes est essentielle.", exampleTranslation: "Equality between men and women is essential.", partOfSpeech: "noun" },
      { word: "une mesure", translation: "a measure / step", pronunciation: "oon muh-ZOOR", exampleSentence: "Le gouvernement a pris des mesures urgentes.", exampleTranslation: "The government took urgent measures.", partOfSpeech: "noun" },
      { word: "s'aggraver", translation: "to worsen", pronunciation: "sah-grah-VAY", exampleSentence: "La crise risque de s'aggraver.", exampleTranslation: "The crisis may worsen.", partOfSpeech: "verb" },
      { word: "preoccupe", translation: "concerned / worried", pronunciation: "pray-oh-koo-PAY", exampleSentence: "Les citoyens sont preoccupes par le chomage.", exampleTranslation: "Citizens are concerned about unemployment.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "The Past Conditional (Le Conditionnel Passe)",
        explanation: "The past conditional expresses what would have happened. Formed with **avoir/etre in conditional + past participle**. Used for regrets, hypothetical past situations, and polite suggestions.",
        examples: [
          { correct: "J'aurais du etudier davantage.", translation: "I should have studied more." },
          { correct: "Nous aurions pu eviter ce probleme.", translation: "We could have avoided this problem." },
          { correct: "Il serait venu s'il avait su.", translation: "He would have come if he had known." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-social-debate",
        title: "Discussing Social Challenges",
        situation: "You're discussing social issues with a French acquaintance at a community meeting.",
        agentRole: "You are Hassan, a social worker in Marseille. Discuss the social challenges facing France today and ask the student about similar issues in their country.",
        userGoal: "Identify social problems, express concern, and propose solutions",
        targetPhrases: ["Je suis preoccupe(e) par...", "Il faudrait que...", "Une solution serait de..."],
        successCriteria: ["Identifies at least one social issue", "Expresses concern appropriately", "Proposes at least one solution"],
      },
    ],
  },
  {
    id: "fr-int-l11",
    slug: "environment-and-ecology",
    title: "Environment & Ecology",
    content: `# L'Environnement et l'Ecologie

Discuss environmental issues and sustainability in French.

## Environmental Vocabulary

- **le rechauffement climatique** - global warming
- **la pollution** - pollution
- **les energies renouvelables** - renewable energy
- **le developpement durable** - sustainable development
- **le recyclage** - recycling
- **la biodiversite** - biodiversity

## Talking About the Environment

- **Il est urgent de proteger...** - It's urgent to protect...
- **Les emissions de CO2 ont augmente** - CO2 emissions have increased
- **Il faut reduire notre empreinte carbone** - We must reduce our carbon footprint
- **Le tri selectif est obligatoire** - Sorting waste is mandatory

## Expressing Doubt & Certainty

- **Je doute que ce soit suffisant** - I doubt it's sufficient
- **Il n'est pas certain que...** - It's not certain that...
- **Je suis certain(e) que...** - I'm certain that...
- **Il est evident que...** - It's obvious that...`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m4",
    moduleTitle: "Society & Relationships",
    order: 11,
    topicId: "fr-intermediate-environment-and-ecology",
    vocabulary: [
      { word: "le rechauffement climatique", translation: "global warming", pronunciation: "luh ray-shohf-MAHN klee-mah-TEEK", exampleSentence: "Le rechauffement climatique menace notre planete.", exampleTranslation: "Global warming threatens our planet.", partOfSpeech: "noun" },
      { word: "les energies renouvelables", translation: "renewable energy", pronunciation: "lay zay-nehr-ZHEE ruh-noov-LAH-bluh", exampleSentence: "La France investit dans les energies renouvelables.", exampleTranslation: "France is investing in renewable energy.", partOfSpeech: "noun" },
      { word: "l'empreinte carbone", translation: "carbon footprint", pronunciation: "lahm-PRAHNT kahr-BUHN", exampleSentence: "Comment reduire son empreinte carbone ?", exampleTranslation: "How to reduce one's carbon footprint?", partOfSpeech: "noun" },
      { word: "le tri selectif", translation: "waste sorting / recycling", pronunciation: "luh tree say-lek-TEEF", exampleSentence: "Le tri selectif est un geste quotidien en France.", exampleTranslation: "Waste sorting is a daily practice in France.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Subjunctive After Doubt and Uncertainty",
        explanation: "The subjunctive is required after expressions of doubt: **je doute que**, **il n'est pas certain que**, **il est possible que**, **il se peut que**. But NOT after certainty: 'je suis certain que' takes the indicative.",
        examples: [
          { correct: "Je doute que ce soit suffisant.", translation: "I doubt it's sufficient.", note: "Douter → subjunctive (soit)" },
          { correct: "Il est possible que nous trouvions une solution.", translation: "It's possible we'll find a solution." },
          { correct: "Je suis certain que c'est vrai.", translation: "I'm certain it's true.", note: "Certainty → indicative (c'est)" },
        ],
        commonMistakes: [
          { incorrect: "Je doute que c'est suffisant.", correction: "Je doute que ce soit suffisant.", explanation: "After 'douter que', use the subjunctive (soit), not the indicative (est)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-environment",
        title: "Environmental Action Meeting",
        situation: "You're at a local environmental group meeting in Lyon discussing climate action.",
        agentRole: "You are Nathalie, an environmental activist. Discuss what needs to be done about climate change and ask the student what actions they take personally.",
        userGoal: "Discuss environmental problems, express doubt or certainty, and describe personal eco-friendly actions",
        targetPhrases: ["Il est urgent de...", "Je doute que...", "Il faut reduire..."],
        successCriteria: ["Discusses at least one environmental issue", "Uses subjunctive after doubt", "Describes personal actions"],
      },
    ],
    culturalNotes: [
      {
        title: "Le Tri Selectif in France",
        content: "France takes recycling seriously. Most households have separate bins: yellow for recyclables, green for glass, and grey/black for general waste. Many cities also have composting programs. The phrase 'le tri selectif' (selective sorting) is part of daily life, and public bins are color-coded throughout the country.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-int-l12",
    slug: "relationships-and-emotions",
    title: "Relationships & Emotions",
    content: `# Les Relations et les Emotions

Express feelings and navigate relationships in French.

## Relationships

- **un(e) ami(e) proche** - a close friend
- **un(e) collegue** - a colleague
- **un(e) voisin(e)** - a neighbor
- **un(e) conjoint(e)** - a partner / spouse
- **une connaissance** - an acquaintance

## Expressing Emotions

- **Je suis ravi(e) de...** - I'm delighted to...
- **Je suis decu(e) par...** - I'm disappointed by...
- **Ca m'enerve que...** - It annoys me that...
- **J'en ai marre de...** - I'm fed up with...
- **Je m'inquiete pour...** - I worry about...
- **Je tiens a toi / a vous** - I care about you

## Navigating Conflict

- **On devrait en discuter calmement** - We should discuss this calmly
- **Je comprends ce que tu ressens** - I understand how you feel
- **Excusez-moi, j'ai eu tort** - I'm sorry, I was wrong
- **Faisons la paix** - Let's make peace`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m4",
    moduleTitle: "Society & Relationships",
    order: 12,
    topicId: "fr-intermediate-relationships-and-emotions",
    vocabulary: [
      { word: "decu", translation: "disappointed", pronunciation: "day-SOO", exampleSentence: "Je suis decu par sa reaction.", exampleTranslation: "I'm disappointed by his reaction.", partOfSpeech: "adjective" },
      { word: "ravi", translation: "delighted", pronunciation: "rah-VEE", exampleSentence: "Je suis ravi de vous rencontrer.", exampleTranslation: "I'm delighted to meet you.", partOfSpeech: "adjective" },
      { word: "s'inquieter", translation: "to worry", pronunciation: "sahn-kyay-TAY", exampleSentence: "Ne t'inquiete pas, tout ira bien.", exampleTranslation: "Don't worry, everything will be fine.", partOfSpeech: "verb" },
      { word: "en avoir marre", translation: "to be fed up", pronunciation: "ahn ah-VWAHR mahr", exampleSentence: "J'en ai marre de cette situation.", exampleTranslation: "I'm fed up with this situation.", partOfSpeech: "phrase" },
      { word: "se disputer", translation: "to argue / quarrel", pronunciation: "suh dees-poo-TAY", exampleSentence: "Ils se disputent souvent.", exampleTranslation: "They argue often.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Subjunctive After Emotion Expressions (Expanded)",
        explanation: "The subjunctive is triggered by expressions of emotion: **je suis content(e) que**, **je suis triste que**, **ca m'enerve que**, **j'ai peur que**, **je regrette que**, **c'est dommage que**. The key signal: emotion + que = subjunctive.",
        examples: [
          { correct: "Ca m'enerve qu'il soit toujours en retard.", translation: "It annoys me that he's always late." },
          { correct: "Je suis triste que tu partes.", translation: "I'm sad that you're leaving." },
          { correct: "J'ai peur qu'il ne comprenne pas.", translation: "I'm afraid he won't understand." },
        ],
        commonMistakes: [
          { incorrect: "Ca m'enerve qu'il est en retard.", correction: "Ca m'enerve qu'il soit en retard.", explanation: "After emotion + que, use the subjunctive (soit), not the indicative (est)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-relationship-advice",
        title: "Giving Relationship Advice",
        situation: "A French friend confides in you about a conflict with their roommate.",
        agentRole: "You are Sophie, upset about a conflict with your roommate who never cleans. Express your frustration and ask the student for advice.",
        userGoal: "Listen empathetically, express understanding, and offer practical advice",
        targetPhrases: ["Je comprends ce que tu ressens", "A ta place, je...", "Il faudrait que vous..."],
        successCriteria: ["Shows empathy", "Offers advice using conditional or subjunctive", "Uses emotion vocabulary"],
      },
    ],
  },
];

// ============================================
// Module 5: Argumentation
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "fr-int-l13",
    slug: "structured-arguments",
    title: "Structured Arguments",
    content: `# L'Argumentation Structuree

Build a thesis-antithesis-synthesis argument the French way.

## The French Essay Structure

The **dissertation** is a cornerstone of French education. It follows a strict three-part structure:

1. **These (Thesis)** - Present the main argument
2. **Antithese (Antithesis)** - Present the opposing view
3. **Synthese (Synthesis)** - Reconcile both views or offer a nuanced conclusion

## Introducing Arguments

- **D'une part... d'autre part...** - On one hand... on the other hand...
- **Premierement... deuxiemement... troisiemement...** - Firstly... secondly... thirdly...
- **En premier lieu... en second lieu...** - In the first place... in the second place...

## Developing Arguments

- **En effet...** - Indeed... / In fact...
- **Par exemple...** - For example...
- **C'est pourquoi...** - That's why...
- **De plus / En outre / Par ailleurs** - Moreover / Furthermore / Besides

## Concluding

- **En conclusion...** - In conclusion...
- **Pour conclure...** - To conclude...
- **En somme...** - In sum...
- **Tout compte fait...** - All things considered...`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m5",
    moduleTitle: "Argumentation",
    order: 13,
    topicId: "fr-intermediate-structured-arguments",
    vocabulary: [
      { word: "d'une part", translation: "on one hand", pronunciation: "doon pahr", exampleSentence: "D'une part, c'est pratique. D'autre part, c'est cher.", exampleTranslation: "On one hand, it's practical. On the other hand, it's expensive.", partOfSpeech: "phrase" },
      { word: "en effet", translation: "indeed / in fact", pronunciation: "ahn eh-FEH", exampleSentence: "En effet, les statistiques confirment cette tendance.", exampleTranslation: "Indeed, the statistics confirm this trend.", partOfSpeech: "adverb" },
      { word: "en revanche", translation: "on the other hand / however", pronunciation: "ahn ruh-VAHNSH", exampleSentence: "Le prix est eleve. En revanche, la qualite est excellente.", exampleTranslation: "The price is high. On the other hand, the quality is excellent.", partOfSpeech: "adverb" },
      { word: "par consequent", translation: "consequently / therefore", pronunciation: "pahr kohn-say-KAHN", exampleSentence: "Il a plu toute la semaine. Par consequent, le match est annule.", exampleTranslation: "It rained all week. Consequently, the match is canceled.", partOfSpeech: "adverb" },
      { word: "en somme", translation: "in sum / all in all", pronunciation: "ahn SUHM", exampleSentence: "En somme, c'est une bonne initiative.", exampleTranslation: "All in all, it's a good initiative.", partOfSpeech: "adverb" },
    ],
    grammarPoints: [
      {
        title: "Logical Connectors for Argumentation",
        explanation: "French argumentation relies heavily on logical connectors. **Cause**: car, parce que, puisque, en raison de. **Consequence**: donc, par consequent, c'est pourquoi. **Opposition**: mais, cependant, neanmoins, en revanche. **Addition**: de plus, en outre, par ailleurs.",
        examples: [
          { correct: "Puisque le taux de chomage augmente, il faut agir.", translation: "Since the unemployment rate is rising, we must act.", note: "Puisque = since (cause already known)" },
          { correct: "Les prix augmentent. Par consequent, les familles souffrent.", translation: "Prices are rising. Consequently, families are suffering." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-debate-structure",
        title: "Class Debate: Remote Work",
        situation: "You're participating in a structured debate in a French language class about remote work.",
        agentRole: "You are Professeur Moreau, moderating a class debate on whether remote work is better than office work. Guide the student through thesis, antithesis, and synthesis.",
        userGoal: "Present a structured argument with thesis, antithesis, and synthesis about remote work",
        targetPhrases: ["D'une part...", "En revanche...", "En somme...", "Par consequent..."],
        successCriteria: ["Presents a clear thesis", "Acknowledges the opposing view", "Reaches a synthesis or nuanced conclusion"],
        hints: ["Start with 'D'une part, le teletravail permet...'", "Then contrast: 'En revanche, on peut aussi dire que...'"],
      },
    ],
    culturalNotes: [
      {
        title: "La Dissertation Francaise",
        content: "The French 'dissertation' is a highly structured essay format taught from lycee (high school) onward. Unlike the Anglo-Saxon essay style, it strictly follows thesis-antithesis-synthesis. Every French student must master this format for the Baccalaureat exam. This training shapes how French people argue and discuss — always seeking nuance and balance rather than one-sided persuasion.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-int-l14",
    slug: "politics-and-citizenship",
    title: "Politics & Citizenship",
    content: `# La Politique et la Citoyennete

Understand and discuss the French political landscape.

## Political Vocabulary

- **un(e) president(e)** - a president
- **un(e) ministre** - a minister
- **le gouvernement** - the government
- **l'Assemblee nationale** - the National Assembly
- **le Senat** - the Senate
- **une loi** - a law
- **un parti politique** - a political party

## Discussing Politics

- **Le gouvernement a decide de...** - The government decided to...
- **Cette reforme vise a...** - This reform aims to...
- **Les citoyens ont le droit de...** - Citizens have the right to...
- **Le debat porte sur...** - The debate is about...

## Civic Actions

- **Voter** - To vote
- **Manifester** - To protest / demonstrate
- **Faire une petition** - To start a petition
- **S'engager** - To get involved / commit
- **Militer pour / contre** - To campaign for / against`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m5",
    moduleTitle: "Argumentation",
    order: 14,
    topicId: "fr-intermediate-politics-and-citizenship",
    vocabulary: [
      { word: "une loi", translation: "a law", pronunciation: "oon lwah", exampleSentence: "Une nouvelle loi a ete votee.", exampleTranslation: "A new law was voted.", partOfSpeech: "noun" },
      { word: "un droit", translation: "a right", pronunciation: "uhn drwah", exampleSentence: "Chaque citoyen a des droits et des devoirs.", exampleTranslation: "Every citizen has rights and duties.", partOfSpeech: "noun" },
      { word: "manifester", translation: "to protest / demonstrate", pronunciation: "mah-nee-fes-TAY", exampleSentence: "Des milliers de personnes ont manifeste dans la rue.", exampleTranslation: "Thousands of people demonstrated in the street.", partOfSpeech: "verb" },
      { word: "une reforme", translation: "a reform", pronunciation: "oon ray-FOHRM", exampleSentence: "La reforme des retraites fait debat.", exampleTranslation: "The pension reform is debated.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Advanced Subjunctive: Wishing and Wanting",
        explanation: "The subjunctive is required after verbs of wanting and wishing directed at someone else: **je veux que**, **je souhaite que**, **j'aimerais que**, **je demande que**. Note: when the subject is the same, use the infinitive instead.",
        examples: [
          { correct: "Je souhaite que le gouvernement agisse.", translation: "I wish the government would act." },
          { correct: "Les citoyens veulent que la loi change.", translation: "Citizens want the law to change." },
          { correct: "Je veux partir.", translation: "I want to leave.", note: "Same subject → infinitive, not subjunctive" },
        ],
        commonMistakes: [
          { incorrect: "Je veux que je parte.", correction: "Je veux partir.", explanation: "When the subject of both verbs is the same, use the infinitive, not the subjunctive." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-politics-chat",
        title: "Political Discussion Over Coffee",
        situation: "You're having coffee with a French friend who brings up a recent political development.",
        agentRole: "You are Thomas, a politically engaged student. Bring up a social reform and ask the student what they think about civic participation and protest culture.",
        userGoal: "Discuss a political topic, express wishes for change, and discuss civic participation",
        targetPhrases: ["Je souhaite que...", "Les citoyens ont le droit de...", "Cette reforme vise a..."],
        successCriteria: ["Discusses a political topic", "Expresses a wish using subjunctive", "Uses political vocabulary correctly"],
      },
    ],
  },
  {
    id: "fr-int-l15",
    slug: "ethics-and-values",
    title: "Ethics & Values",
    content: `# L'Ethique et les Valeurs

Discuss moral questions and ethical dilemmas in French.

## Values Vocabulary

- **la justice** - justice
- **la liberte** - freedom
- **la solidarite** - solidarity
- **le respect** - respect
- **l'honnetete** - honesty
- **la tolerance** - tolerance
- **la responsabilite** - responsibility

## Expressing Moral Judgment

- **Il est juste / injuste de...** - It is fair / unfair to...
- **C'est moralement acceptable / inacceptable** - It's morally acceptable / unacceptable
- **On a le devoir de...** - We have the duty to...
- **C'est une question de principe** - It's a matter of principle

## Debating Ethics

- **Il faut se mettre a la place de l'autre** - You have to put yourself in the other's shoes
- **Les deux points de vue se defendent** - Both points of view are defensible
- **C'est un dilemme moral** - It's a moral dilemma
- **Il n'y a pas de reponse simple** - There's no simple answer`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m5",
    moduleTitle: "Argumentation",
    order: 15,
    topicId: "fr-intermediate-ethics-and-values",
    vocabulary: [
      { word: "la justice", translation: "justice", pronunciation: "lah zhoos-TEESS", exampleSentence: "La justice doit etre egale pour tous.", exampleTranslation: "Justice must be equal for all.", partOfSpeech: "noun" },
      { word: "la solidarite", translation: "solidarity", pronunciation: "lah soh-lee-dah-ree-TAY", exampleSentence: "La solidarite est une valeur fondamentale.", exampleTranslation: "Solidarity is a fundamental value.", partOfSpeech: "noun" },
      { word: "un dilemme", translation: "a dilemma", pronunciation: "uhn dee-LEM", exampleSentence: "C'est un vrai dilemme moral.", exampleTranslation: "It's a real moral dilemma.", partOfSpeech: "noun" },
      { word: "le devoir", translation: "duty / obligation", pronunciation: "luh duh-VWAHR", exampleSentence: "Nous avons le devoir d'aider les plus vulnerables.", exampleTranslation: "We have the duty to help the most vulnerable.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Subjunctive: 'Bien que' and 'Quoique'",
        explanation: "The subjunctive is always used after **bien que** (although) and **quoique** (although/even though). These are concessive conjunctions that introduce a contrast.",
        examples: [
          { correct: "Bien qu'il soit jeune, il a beaucoup d'experience.", translation: "Although he's young, he has a lot of experience." },
          { correct: "Quoique ce soit difficile, je refuse d'abandonner.", translation: "Even though it's difficult, I refuse to give up." },
        ],
        commonMistakes: [
          { incorrect: "Bien qu'il est jeune...", correction: "Bien qu'il soit jeune...", explanation: "After 'bien que', always use the subjunctive (soit), not the indicative (est)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-ethics-debate",
        title: "Ethical Dilemma Discussion",
        situation: "Your French philosophy class is discussing whether it's ethical to use AI to write essays.",
        agentRole: "You are Professeur Lefebvre, a philosophy teacher. Present an ethical dilemma and guide students to consider multiple perspectives, challenging their reasoning at each turn.",
        userGoal: "Discuss an ethical dilemma from multiple angles, using concessive language and moral vocabulary",
        targetPhrases: ["Bien que...", "Il est juste de...", "D'un cote... de l'autre...", "C'est une question de principe"],
        successCriteria: ["Considers multiple perspectives", "Uses 'bien que' with subjunctive", "Expresses a moral judgment with reasoning"],
      },
    ],
  },
];

// ============================================
// Module 6: Complex Situations
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "fr-int-l16",
    slug: "medical-emergencies",
    title: "Medical Emergencies",
    content: `# Les Urgences Medicales

Handle health situations and medical visits in French.

## Emergency Vocabulary

- **Appelez le 15 / le SAMU !** - Call 15 / emergency medical services!
- **J'ai besoin d'un medecin** - I need a doctor
- **C'est une urgence** - It's an emergency
- **Je suis blesse(e)** - I'm injured
- **Au secours !** - Help!

## Describing Symptoms

- **J'ai mal a la tete / au ventre / au dos** - I have a headache / stomachache / backache
- **J'ai de la fievre** - I have a fever
- **Je tousse** - I'm coughing
- **J'ai des vertiges** - I'm dizzy
- **Je suis allergique a...** - I'm allergic to...
- **J'ai du mal a respirer** - I'm having trouble breathing

## At the Doctor's

- **Depuis quand avez-vous ces symptomes ?** - Since when have you had these symptoms?
- **Prenez ce medicament trois fois par jour** - Take this medicine three times a day
- **Il faut faire une prise de sang** - You need a blood test
- **Je vous prescris...** - I'm prescribing you...`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m6",
    moduleTitle: "Complex Situations",
    order: 16,
    topicId: "fr-intermediate-medical-emergencies",
    vocabulary: [
      { word: "une urgence", translation: "an emergency", pronunciation: "oon oor-ZHAHNSS", exampleSentence: "Rendez-vous aux urgences immediatement.", exampleTranslation: "Go to the emergency room immediately.", partOfSpeech: "noun" },
      { word: "un medicament", translation: "a medicine / medication", pronunciation: "uhn may-dee-kah-MAHN", exampleSentence: "Prenez ce medicament avec de l'eau.", exampleTranslation: "Take this medicine with water.", partOfSpeech: "noun" },
      { word: "une ordonnance", translation: "a prescription", pronunciation: "oon ohr-doh-NAHNSS", exampleSentence: "Vous avez besoin d'une ordonnance.", exampleTranslation: "You need a prescription.", partOfSpeech: "noun" },
      { word: "allergique", translation: "allergic", pronunciation: "ah-lehr-ZHEEK", exampleSentence: "Je suis allergique aux arachides.", exampleTranslation: "I'm allergic to peanuts.", partOfSpeech: "adjective" },
      { word: "les symptomes", translation: "symptoms", pronunciation: "lay samp-TOHM", exampleSentence: "Quels sont vos symptomes ?", exampleTranslation: "What are your symptoms?", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "The Pluperfect (Le Plus-que-parfait)",
        explanation: "The pluperfect describes an action completed before another past action. Formed with **avoir/etre in imparfait + past participle**. Think of it as 'had done' in English.",
        examples: [
          { correct: "J'avais deja pris un medicament quand le medecin est arrive.", translation: "I had already taken medicine when the doctor arrived." },
          { correct: "Elle etait tombee avant que nous arrivions.", translation: "She had fallen before we arrived." },
        ],
        commonMistakes: [
          { incorrect: "J'ai deja pris un medicament quand le medecin est arrive.", correction: "J'avais deja pris un medicament quand le medecin est arrive.", explanation: "Use the pluperfect (avais pris), not the passe compose (ai pris), for an action completed before another past event." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-doctor-visit",
        title: "At the Doctor's Office",
        situation: "You're visiting a doctor in France because you've been feeling unwell for several days.",
        agentRole: "You are Docteur Girard, a general practitioner. Ask about symptoms, their duration, medical history, and allergies. Give a diagnosis and prescription.",
        userGoal: "Describe your symptoms in detail, answer the doctor's questions, and understand the prescription",
        targetPhrases: ["J'ai mal a...", "Depuis... jours", "Je suis allergique a...", "J'avais deja..."],
        successCriteria: ["Describes symptoms clearly", "Indicates duration", "Mentions any allergies", "Understands the prescription"],
      },
    ],
    culturalNotes: [
      {
        title: "The French Healthcare System",
        content: "France has a universal healthcare system (la Securite sociale) consistently ranked among the world's best. Most visits to a general practitioner (medecin generaliste) cost around 25 euros, of which roughly 70% is reimbursed. A 'carte Vitale' (health insurance card) is essential. The SAMU (emergency number 15) provides rapid medical response. Pharmacies, marked by green neon crosses, are everywhere and pharmacists can give basic medical advice.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-int-l17",
    slug: "legal-and-administrative",
    title: "Legal & Administrative French",
    content: `# Le Francais Juridique et Administratif

Navigate French bureaucracy and legal language.

## Administrative Vocabulary

- **la mairie** - city hall
- **la prefecture** - prefecture (regional government)
- **un formulaire** - a form
- **un justificatif de domicile** - proof of address
- **une piece d'identite** - an ID document
- **un titre de sejour** - a residence permit

## Common Administrative Tasks

- **Je voudrais faire une demande de...** - I would like to apply for...
- **Quels documents sont necessaires ?** - What documents are needed?
- **Il faut remplir ce formulaire** - You need to fill out this form
- **Mon dossier est complet** - My file is complete
- **Le delai de traitement est de...** - The processing time is...

## Legal Basics

- **porter plainte** - to file a complaint
- **un contrat** - a contract
- **les droits et obligations** - rights and obligations
- **un avocat** - a lawyer
- **une assurance** - insurance`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m6",
    moduleTitle: "Complex Situations",
    order: 17,
    topicId: "fr-intermediate-legal-and-administrative",
    vocabulary: [
      { word: "un formulaire", translation: "a form", pronunciation: "uhn fohr-moo-LEHR", exampleSentence: "Veuillez remplir ce formulaire en majuscules.", exampleTranslation: "Please fill out this form in capital letters.", partOfSpeech: "noun" },
      { word: "un justificatif", translation: "a supporting document / proof", pronunciation: "uhn zhoos-tee-fee-kah-TEEF", exampleSentence: "Apportez un justificatif de domicile.", exampleTranslation: "Bring a proof of address.", partOfSpeech: "noun" },
      { word: "une demarche", translation: "a procedure / step", pronunciation: "oon day-MARSH", exampleSentence: "Les demarches administratives prennent du temps.", exampleTranslation: "Administrative procedures take time.", partOfSpeech: "noun" },
      { word: "un delai", translation: "a deadline / time frame", pronunciation: "uhn day-LAY", exampleSentence: "Le delai est de deux semaines.", exampleTranslation: "The time frame is two weeks.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Formal Register and Administrative Phrases",
        explanation: "French administrative language uses a very formal register. Key patterns: **Veuillez + infinitive** (Please...), **Il est porte a votre connaissance que...** (Please be advised that...), **Nous vous prions de bien vouloir...** (We kindly ask you to...). These are essential for dealing with French bureaucracy.",
        examples: [
          { correct: "Veuillez trouver ci-joint les documents demandes.", translation: "Please find attached the requested documents." },
          { correct: "Nous vous prions de bien vouloir nous transmettre...", translation: "We kindly ask you to send us..." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-prefecture",
        title: "At the Prefecture",
        situation: "You're at the prefecture trying to renew your residence permit.",
        agentRole: "You are a civil servant at the prefecture. Ask for the student's documents, explain what's missing, and describe the next steps in the process.",
        userGoal: "Explain your situation, ask what documents are needed, and understand the procedure",
        targetPhrases: ["Je voudrais faire une demande de...", "Quels documents...", "Quel est le delai ?"],
        successCriteria: ["Explains their administrative need", "Asks about required documents", "Understands the procedure described"],
      },
    ],
    culturalNotes: [
      {
        title: "French Bureaucracy: La Paperasse",
        content: "The French have a word for excessive paperwork: 'la paperasse.' Navigating French administration requires patience. Many procedures still require physical documents, stamps, and in-person visits. Always bring originals AND copies of everything. The phrase 'Je n'ai pas le bon formulaire' (I don't have the right form) is a universal French experience. Online services (like service-public.fr) are slowly modernizing the process.",
        region: "France",
      },
    ],
  },
  {
    id: "fr-int-l18",
    slug: "negotiation-and-compromise",
    title: "Negotiation & Compromise",
    content: `# La Negociation et le Compromis

Learn to negotiate and find compromises in French.

## Negotiation Vocabulary

- **negocier** - to negotiate
- **un compromis** - a compromise
- **une concession** - a concession
- **un accord** - an agreement
- **les conditions** - conditions / terms
- **une proposition** - a proposal

## Making Proposals

- **Je vous propose de...** - I propose to you that we...
- **Et si on... ?** - What if we...?
- **Seriez-vous d'accord pour... ?** - Would you agree to...?
- **Que diriez-vous de... ?** - What would you say to...?

## Reaching Agreement

- **Je suis pret(e) a faire un effort si...** - I'm willing to make an effort if...
- **A condition que... (+ subjunctive)** - On the condition that...
- **Nous pourrions trouver un terrain d'entente** - We could find common ground
- **C'est acceptable / inacceptable** - That's acceptable / unacceptable

## Standing Your Ground

- **Je maintiens que...** - I maintain that...
- **C'est non negociable** - That's non-negotiable
- **Je ne peux pas accepter cette condition** - I can't accept this condition
- **Il faut que nous trouvions un juste milieu** - We need to find a middle ground`,
    targetLanguage: "fr",
    proficiencyLevel: "B1",
    moduleId: "fr-int-m6",
    moduleTitle: "Complex Situations",
    order: 18,
    topicId: "fr-intermediate-negotiation-and-compromise",
    vocabulary: [
      { word: "un compromis", translation: "a compromise", pronunciation: "uhn kohm-proh-MEE", exampleSentence: "Il faut trouver un compromis.", exampleTranslation: "We need to find a compromise.", partOfSpeech: "noun" },
      { word: "negocier", translation: "to negotiate", pronunciation: "nay-goh-SYAY", exampleSentence: "Nous devons negocier les termes du contrat.", exampleTranslation: "We must negotiate the terms of the contract.", partOfSpeech: "verb" },
      { word: "un accord", translation: "an agreement", pronunciation: "uhn ah-KOHR", exampleSentence: "Nous avons trouve un accord.", exampleTranslation: "We found an agreement.", partOfSpeech: "noun" },
      { word: "une concession", translation: "a concession", pronunciation: "oon kohn-seh-SYOHN", exampleSentence: "Chaque partie doit faire des concessions.", exampleTranslation: "Each party must make concessions.", partOfSpeech: "noun" },
      { word: "un terrain d'entente", translation: "common ground", pronunciation: "uhn teh-RAN dahn-TAHNT", exampleSentence: "Nous avons enfin trouve un terrain d'entente.", exampleTranslation: "We finally found common ground.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "'A condition que' + Subjunctive",
        explanation: "The expression **a condition que** (on the condition that) always requires the subjunctive. Similarly: **pourvu que** (provided that), **a moins que** (unless), **avant que** (before). These are conjunctions of condition/time that trigger the subjunctive.",
        examples: [
          { correct: "J'accepte a condition que vous fassiez un effort.", translation: "I accept on the condition that you make an effort." },
          { correct: "Pourvu qu'il soit d'accord.", translation: "Provided that he agrees." },
          { correct: "Nous partirons a moins qu'il ne pleuve.", translation: "We'll leave unless it rains." },
        ],
        commonMistakes: [
          { incorrect: "A condition que vous faites un effort.", correction: "A condition que vous fassiez un effort.", explanation: "After 'a condition que', use the subjunctive (fassiez), not the indicative (faites)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-int-negotiation",
        title: "Negotiating a Lease",
        situation: "You're negotiating the terms of an apartment lease with a French landlord.",
        agentRole: "You are Monsieur Bertrand, a landlord in Paris renting out an apartment. Discuss the rent, deposit, lease duration, and conditions. Be firm but open to reasonable proposals.",
        userGoal: "Negotiate lease terms, make counterproposals, and reach a compromise",
        targetPhrases: ["Je vous propose de...", "A condition que...", "Seriez-vous d'accord pour... ?", "C'est non negociable"],
        successCriteria: ["Makes at least one proposal", "Uses conditional constructions", "Reaches or moves toward a compromise"],
        hints: ["Start by asking about the terms: 'Quelles sont les conditions ?'", "Make a counterproposal: 'Et si on...'"],
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  { id: "fr-int-m1", title: "Module 1: Expressing Yourself", description: "Opinions, agreeing/disagreeing, storytelling, and the conditional", order: 1, lessons: module1Lessons },
  { id: "fr-int-m2", title: "Module 2: Work & Education", description: "Jobs, formal letters, CVs, job interviews, future simple, relative pronouns", order: 2, lessons: module2Lessons },
  { id: "fr-int-m3", title: "Module 3: Media & Current Events", description: "News vocab, subjunctive introduction, arts, and technology", order: 3, lessons: module3Lessons },
  { id: "fr-int-m4", title: "Module 4: Society & Relationships", description: "Social issues, environment, past conditional, subjunctive with doubt", order: 4, lessons: module4Lessons },
  { id: "fr-int-m5", title: "Module 5: Argumentation", description: "Thesis-antithesis-synthesis, politics, ethics, advanced subjunctive", order: 5, lessons: module5Lessons },
  { id: "fr-int-m6", title: "Module 6: Complex Situations", description: "Medical emergencies, legal/admin French, negotiation, pluperfect", order: 6, lessons: module6Lessons },
];

export const frenchIntermediateCourse: LanguageCourse = { ...courseInfo, modules };

export function getFrenchIntermediateLessons() {
  return modules.flatMap((m) => m.lessons);
}

export function findFrenchIntermediateLesson(slug: string) {
  return getFrenchIntermediateLessons().find((l) => l.slug === slug);
}
