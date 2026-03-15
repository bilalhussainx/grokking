// English Advanced (C1) Course Data
// CEFR Advanced Level - ESL for Non-Native Speakers

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "english-advanced",
  slug: "english-advanced",
  title: "English Advanced - C1",
  language: "en",
  languageName: "English",
  proficiencyLevel: "C1" as const,
  description: "Master advanced English for academic, professional, and social contexts. Tackle nuanced grammar, rhetorical analysis, and register switching at the C1-C2 boundary.",
  targetAudience: "Upper-intermediate ESL learners ready to reach near-native fluency",
  estimatedHours: 100,
  icon: "🇬🇧",
  prerequisiteCourseSlug: "english-intermediate",
};

// ============================================
// Module 1: Language & Identity
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "en-adv-l1",
    slug: "english-varieties",
    title: "World Englishes: British, American & Beyond",
    content: `# World Englishes: British, American & Beyond

English is not a single language — it is a family of varieties, each shaped by history, geography, and culture.

## Key Differences

### Spelling
- **British:** colour, favourite, centre, realise
- **American:** color, favorite, center, realize
- **Australian:** follows British spelling but with its own slang layer

### Vocabulary
- **British:** lift, boot, flat, queue, rubbish
- **American:** elevator, trunk, apartment, line, garbage
- **Australian:** arvo (afternoon), brekkie (breakfast), servo (petrol station)

### Pronunciation
- **Rhoticity:** Americans pronounce the /r/ in "car"; most British speakers do not
- **T-flapping:** Americans say "wader" for "water"; Brits keep a crisp /t/
- **Australian rising intonation:** Declarative sentences can sound like questions

## Why It Matters

At C1 level, you should recognise — and be comfortable with — multiple varieties. You do not need to imitate them all, but you should understand speakers from different backgrounds.`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m1",
    moduleTitle: "Language & Identity",
    order: 1,
    topicId: "en-advanced-english-varieties",
    vocabulary: [
      { word: "rhoticity", translation: "the pronunciation of /r/ after vowels", pronunciation: "/roʊˈtɪsɪti/", exampleSentence: "Rhoticity is one of the clearest markers separating American and British English.", exampleTranslation: "(same — target language is English)", partOfSpeech: "noun" },
      { word: "dialect", translation: "a regional or social variety of a language", pronunciation: "/ˈdaɪəlɛkt/", exampleSentence: "Scouse is the dialect spoken in Liverpool.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "colloquialism", translation: "an informal word or phrase used in everyday speech", pronunciation: "/kəˈloʊkwiəlɪzəm/", exampleSentence: "The word 'gonna' is a colloquialism for 'going to'.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "vernacular", translation: "the everyday language spoken by ordinary people in a region", pronunciation: "/vərˈnækjʊlər/", exampleSentence: "Hip-hop lyrics often draw on African-American Vernacular English.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "idiolect", translation: "an individual person's unique way of speaking", pronunciation: "/ˈɪdiəlɛkt/", exampleSentence: "Your idiolect includes your favourite filler words and sentence patterns.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Cleft Sentences for Emphasis",
        explanation: "Cleft sentences split a simple sentence into two clauses to emphasise one part. Use 'It is/was ... that/who ...' or 'What ... is/was ...'.",
        examples: [
          { correct: "It was the accent that confused me, not the vocabulary.", translation: "Emphasis on 'the accent'." },
          { correct: "What I find fascinating is how English changes from country to country.", translation: "Emphasis on the whole idea." },
        ],
        commonMistakes: [
          { incorrect: "What I find fascinating it is how English changes.", correction: "What I find fascinating is how English changes.", explanation: "Do not add an extra 'it' inside a wh-cleft." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-varieties-debate",
        title: "Which English Should We Teach?",
        situation: "You are in a language-teacher training seminar debating which variety of English should be the classroom standard.",
        agentRole: "You are Dr. Okafor, a Nigerian-British linguist who argues that no single variety should be privileged. Challenge the student's views respectfully.",
        userGoal: "Argue your position on whether schools should teach one standard or expose students to multiple varieties. Use cleft sentences for emphasis.",
        targetPhrases: ["It is ... that", "What I believe is", "On the one hand ... on the other hand"],
        successCriteria: ["Uses at least one cleft sentence", "Presents a clear argument", "Responds to counter-arguments"],
      },
    ],
    culturalNotes: [
      {
        title: "Language and Power",
        content: "Historically, 'Received Pronunciation' (RP) was considered the prestige accent in Britain. Today, attitudes are shifting: regional accents are heard on the BBC, and many linguists argue that all varieties are equally valid. Being aware of these social dynamics will help you navigate professional and social settings.",
        region: "United Kingdom",
      },
    ],
  },
  {
    id: "en-adv-l2",
    slug: "cleft-sentences-inversion",
    title: "Cleft Sentences & Inversion for Impact",
    content: `# Cleft Sentences & Inversion for Impact

At C1 level, you can move beyond simple SVO word order. Using cleft structures and inversion lets you control what your listener pays attention to.

## Cleft Sentence Patterns

| Pattern | Example |
|---------|---------|
| It-cleft | *It was Darwin who proposed natural selection.* |
| Wh-cleft | *What we need is a complete overhaul.* |
| Reverse wh-cleft | *A complete overhaul is what we need.* |
| All-cleft | *All I'm asking for is honesty.* |

## Inversion After Negative Adverbials

When a negative or restrictive adverb begins a sentence, the subject and auxiliary verb invert:

- **Never have I seen** such dedication.
- **Rarely does one encounter** this level of skill.
- **Not only did she win**, but she also broke the record.
- **Under no circumstances should you** share this information.`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m1",
    moduleTitle: "Language & Identity",
    order: 2,
    topicId: "en-advanced-cleft-sentences-inversion",
    vocabulary: [
      { word: "inversion", translation: "reversing the normal subject-verb order", pronunciation: "/ɪnˈvɜːrʒən/", exampleSentence: "Inversion after 'never' is a hallmark of formal English.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "emphasis", translation: "special importance or stress given to something", pronunciation: "/ˈɛmfəsɪs/", exampleSentence: "The cleft sentence places emphasis on the agent.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "adverbial", translation: "a word or phrase functioning as an adverb", pronunciation: "/ædˈvɜːrbiəl/", exampleSentence: "Fronted adverbials can trigger subject-auxiliary inversion.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "auxiliary", translation: "a helping verb (be, have, do, modals)", pronunciation: "/ɔːɡˈzɪljəri/", exampleSentence: "In 'Never have I seen this', 'have' is the auxiliary.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Inversion After Negative/Restrictive Adverbials",
        explanation: "When sentences begin with negative adverbials (never, rarely, seldom, hardly, not only, under no circumstances, at no point), the subject and auxiliary invert — just like a question.",
        examples: [
          { correct: "Seldom do we see such talent.", translation: "Normal: We seldom see such talent." },
          { correct: "Not until midnight did the results arrive.", translation: "Normal: The results did not arrive until midnight." },
          { correct: "Only after reading it twice did I understand the subtext.", translation: "Normal: I understood the subtext only after reading it twice." },
        ],
        commonMistakes: [
          { incorrect: "Never I have seen such a view.", correction: "Never have I seen such a view.", explanation: "After a fronted negative adverbial, invert subject and auxiliary." },
        ],
      },
      {
        title: "All-Cleft and Thing-Cleft",
        explanation: "Use 'All + subject + verb + is/was ...' or 'The thing/reason/place ... is/was ...' for strong focus.",
        examples: [
          { correct: "All they wanted was a fair chance.", translation: "Focus: 'a fair chance'." },
          { correct: "The reason I called is that the contract has changed.", translation: "Focus: 'the contract has changed'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-formal-speech",
        title: "Formal Award Speech",
        situation: "You are presenting a lifetime achievement award at a gala dinner.",
        agentRole: "You are the event host. Introduce the student as the award presenter. React to their speech with follow-up questions.",
        userGoal: "Deliver a short speech using at least two inversions and one cleft sentence.",
        targetPhrases: ["Never have I", "It is ... who", "Not only ... but also"],
        successCriteria: ["Uses inversion correctly", "Uses a cleft sentence", "Maintains formal register throughout"],
      },
    ],
  },
  {
    id: "en-adv-l3",
    slug: "identity-language-code-switching",
    title: "Code-Switching & Multilingual Identity",
    content: `# Code-Switching & Multilingual Identity

Code-switching — moving between two or more languages or registers within a conversation — is a sophisticated skill, not a sign of confusion.

## Types of Code-Switching

1. **Inter-sentential:** Switching at sentence boundaries. *"I'll handle the report. Después hablamos."*
2. **Intra-sentential:** Switching mid-sentence. *"She's so entêtée about this deadline."*
3. **Tag-switching:** Inserting a tag from another language. *"That was brilliant, na?"*

## Register Switching (Within English)

Even monolingual speakers code-switch between registers:
- **Formal:** "I should like to draw your attention to clause 7."
- **Neutral:** "Let me point out clause 7."
- **Informal:** "Check out clause 7."

## Why It Matters for C1 Learners

Understanding code-switching helps you:
- Navigate multicultural workplaces
- Read literature that uses mixed language
- Build rapport by matching your interlocutor's register`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m1",
    moduleTitle: "Language & Identity",
    order: 3,
    topicId: "en-advanced-identity-language-code-switching",
    vocabulary: [
      { word: "code-switching", translation: "alternating between languages or registers in conversation", pronunciation: "/ˈkoʊd swɪtʃɪŋ/", exampleSentence: "Code-switching between formal and casual English is a valuable workplace skill.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "register", translation: "a level of formality in language use", pronunciation: "/ˈrɛdʒɪstər/", exampleSentence: "Academic writing requires a formal register.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "interlocutor", translation: "the person you are speaking with", pronunciation: "/ˌɪntərˈlɑːkjʊtər/", exampleSentence: "Adjusting your register to match your interlocutor builds rapport.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "rapport", translation: "a close and harmonious relationship built through communication", pronunciation: "/ræˈpɔːr/", exampleSentence: "Good interviewers establish rapport within the first few minutes.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "lingua franca", translation: "a shared language used between speakers of different native tongues", pronunciation: "/ˌlɪŋɡwə ˈfræŋkə/", exampleSentence: "English serves as the lingua franca of international business.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Fronting for Emphasis (Without Inversion)",
        explanation: "You can front an object or complement for emphasis without inverting. The fronted element gains focus simply by being first.",
        examples: [
          { correct: "This kind of behaviour I will not tolerate.", translation: "Normal: I will not tolerate this kind of behaviour." },
          { correct: "Brilliant, she certainly is.", translation: "Normal: She is certainly brilliant." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-code-switch-workplace",
        title: "Multicultural Team Meeting",
        situation: "You are in a team meeting with colleagues from different countries. The discussion moves between casual banter and formal decision-making.",
        agentRole: "You are Priya, the team lead. Start casually, then shift to formal mode when discussing the budget. See if the student matches your register shifts.",
        userGoal: "Participate naturally, matching the register of each phase of the meeting — casual for small talk, formal for decisions.",
        targetPhrases: ["If I may suggest", "Sounds good to me", "I'd like to propose that we"],
        successCriteria: ["Demonstrates casual register", "Shifts to formal register when appropriate", "Transitions smoothly between registers"],
      },
    ],
    culturalNotes: [
      {
        title: "Code-Switching and Belonging",
        content: "For many multilingual speakers, code-switching is tied to identity. Switching into a heritage language can signal closeness or in-group membership, while switching to English may signal professionalism. Neither is 'better' — both serve social functions. Respecting this helps you communicate sensitively in diverse environments.",
      },
    ],
  },
];

// ============================================
// Module 2: Academic English
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "en-adv-l4",
    slug: "academic-writing-structure",
    title: "Academic Writing: Structure & Conventions",
    content: `# Academic Writing: Structure & Conventions

Academic writing follows strict conventions that signal credibility and rigour.

## The Standard Essay Structure

1. **Introduction** — Hook, context, thesis statement
2. **Body paragraphs** — Each with a topic sentence, evidence, analysis, link
3. **Conclusion** — Restate thesis, summarise key points, broader implications

## Key Conventions

- **Hedging:** Avoid absolute claims. *"This suggests..." rather than "This proves..."*
- **Nominalisation:** Use noun forms for density. *"The government's failure to act" rather than "The government failed to act"*
- **Passive voice:** Used when the agent is unknown or unimportant. *"The samples were analysed" rather than "I analysed the samples"*
- **Formal register:** Avoid contractions, slang, and first person (where required by style guide)

## Citation Signals

- **X argues/claims/suggests/contends that...**
- **According to X (2024),...**
- **As X has demonstrated,...**
- **X's findings indicate that...**`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m2",
    moduleTitle: "Academic English",
    order: 4,
    topicId: "en-advanced-academic-writing-structure",
    vocabulary: [
      { word: "thesis statement", translation: "the main argument or claim of an essay", pronunciation: "/ˈθiːsɪs ˈsteɪtmənt/", exampleSentence: "A strong thesis statement makes a debatable claim, not a statement of fact.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "rigour", translation: "thoroughness and accuracy in research or argument (BrE spelling)", pronunciation: "/ˈrɪɡər/", exampleSentence: "The study was praised for its methodological rigour.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "cohesion", translation: "the way ideas link together logically within a text", pronunciation: "/koʊˈhiːʒən/", exampleSentence: "Transition words improve the cohesion of your writing.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "substantiate", translation: "to provide evidence to support a claim", pronunciation: "/səbˈstænʃieɪt/", exampleSentence: "You must substantiate every claim with peer-reviewed evidence.", exampleTranslation: "(same)", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Hedging Language",
        explanation: "Hedging softens claims to show academic caution. Use modal verbs (may, might, could), hedging verbs (tend to, appear to, seem to), and adverbs (arguably, potentially, somewhat).",
        examples: [
          { correct: "This could suggest a correlation between the two variables.", translation: "Cautious claim using modal + hedging verb." },
          { correct: "The data appear to indicate a downward trend.", translation: "'Appear to' hedges the claim." },
          { correct: "It is arguably the most significant finding of the decade.", translation: "'Arguably' signals that not everyone agrees." },
        ],
        commonMistakes: [
          { incorrect: "This proves that social media causes depression.", correction: "This suggests that social media may contribute to depression.", explanation: "Avoid absolute language unless the evidence truly warrants it." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-academic-presentation",
        title: "Presenting Research Findings",
        situation: "You are presenting the results of your research at a university seminar.",
        agentRole: "You are Professor Chen, chairing the seminar. Ask probing questions about methodology and conclusions. Expect hedged, evidence-based answers.",
        userGoal: "Present your findings using hedging language and respond to critical questions without over-claiming.",
        targetPhrases: ["The findings suggest", "It appears that", "Further research is needed"],
        successCriteria: ["Uses hedging appropriately", "Cites evidence", "Handles critical questions calmly"],
      },
    ],
  },
  {
    id: "en-adv-l5",
    slug: "nominalisation-density",
    title: "Nominalisation & Information Density",
    content: `# Nominalisation & Information Density

Nominalisation converts verbs and adjectives into nouns, packing more information into fewer words. It is a hallmark of academic and professional writing.

## Verb → Noun Conversions

| Verb | Nominalised Form | Example |
|------|-----------------|---------|
| investigate | investigation | *The investigation revealed new data.* |
| develop | development | *Economic development requires investment.* |
| fail | failure | *The failure of the policy was predictable.* |
| decide | decision | *The decision to expand was unanimous.* |
| assume | assumption | *This assumption is questionable.* |

## Why Use Nominalisation?

1. **Conciseness:** "The company decided to restructure" → "The company's restructuring decision"
2. **Objectivity:** Removes human agents, making text feel impersonal
3. **Cohesion:** Noun phrases can be referred back to more easily

## When NOT to Use It

Over-nominalisation creates dense, unreadable prose. Balance is key — vary sentence structure to maintain readability.`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m2",
    moduleTitle: "Academic English",
    order: 5,
    topicId: "en-advanced-nominalisation-density",
    vocabulary: [
      { word: "nominalisation", translation: "turning a verb or adjective into a noun form", pronunciation: "/ˌnɒmɪnəlaɪˈzeɪʃən/", exampleSentence: "Excessive nominalisation can make writing impenetrable.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "conciseness", translation: "the quality of expressing much in few words", pronunciation: "/kənˈsaɪsnəs/", exampleSentence: "Conciseness is valued in academic abstracts.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "impersonal", translation: "not influenced by personal feelings; objective", pronunciation: "/ɪmˈpɜːrsənəl/", exampleSentence: "Scientific writing aims for an impersonal tone.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "prose", translation: "ordinary written language, as opposed to verse", pronunciation: "/proʊz/", exampleSentence: "Her academic prose is clear yet sophisticated.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Nominalisation Patterns",
        explanation: "Learn common suffixes: -tion/-sion (investigate → investigation), -ment (develop → development), -ity (complex → complexity), -ness (aware → awareness), -ance/-ence (rely → reliance).",
        examples: [
          { correct: "The investigation of the incident is ongoing.", translation: "From: They are investigating the incident." },
          { correct: "Her reliance on outdated data weakened the argument.", translation: "From: She relied on outdated data, which weakened the argument." },
        ],
        commonMistakes: [
          { incorrect: "The performancement of the team improved.", correction: "The performance of the team improved.", explanation: "Not all nouns use -ment. Learn each form individually." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-rewrite-exercise",
        title: "Editorial Meeting: Tighten the Draft",
        situation: "You and an editor are revising a wordy report. The editor reads a verbose sentence and you propose a nominalised, tighter version.",
        agentRole: "You are Sam, a senior editor. Read aloud wordy sentences and ask the student to propose concise rewrites using nominalisation.",
        userGoal: "Rewrite at least three sentences using nominalisation while keeping the meaning clear.",
        targetPhrases: ["The development of", "a failure to", "The assumption that"],
        successCriteria: ["Produces correct nominalisations", "Maintains original meaning", "Does not over-nominalise"],
      },
    ],
  },
  {
    id: "en-adv-l6",
    slug: "citations-paraphrasing",
    title: "Citations, Paraphrasing & Avoiding Plagiarism",
    content: `# Citations, Paraphrasing & Avoiding Plagiarism

Using other people's ideas is essential in academic work — but you must credit them properly.

## Three Ways to Use Sources

1. **Direct quote:** Use the author's exact words in quotation marks.
   - *Smith (2023) states that "remote work increases productivity by 13%."*

2. **Paraphrase:** Rewrite the idea in your own words, keeping the meaning.
   - *According to Smith (2023), employees working from home tend to be more productive.*

3. **Summary:** Condense a longer passage into a brief overview.
   - *Smith (2023) found a positive link between remote work and output.*

## Reporting Verbs (By Strength)

| Neutral | Tentative | Strong |
|---------|-----------|--------|
| states, notes, observes | suggests, implies, indicates | argues, contends, asserts, insists |

## Paraphrasing Strategies

- Change the sentence structure (active → passive, or vice versa)
- Use synonyms — but only where they genuinely fit
- Change the order of information
- Combine or split sentences
- Always cite, even when paraphrasing`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m2",
    moduleTitle: "Academic English",
    order: 6,
    topicId: "en-advanced-citations-paraphrasing",
    vocabulary: [
      { word: "paraphrase", translation: "to restate someone's idea in your own words", pronunciation: "/ˈpærəfreɪz/", exampleSentence: "A good paraphrase changes structure and vocabulary while preserving meaning.", exampleTranslation: "(same)", partOfSpeech: "verb" },
      { word: "plagiarism", translation: "presenting someone else's work or ideas as your own", pronunciation: "/ˈpleɪdʒərɪzəm/", exampleSentence: "Universities impose severe penalties for plagiarism.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "attribution", translation: "crediting the source of an idea or quotation", pronunciation: "/ˌætrɪˈbjuːʃən/", exampleSentence: "Proper attribution strengthens your academic credibility.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "contend", translation: "to assert or argue a position", pronunciation: "/kənˈtɛnd/", exampleSentence: "Several researchers contend that the methodology is flawed.", exampleTranslation: "(same)", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Reporting Verb Tense Patterns",
        explanation: "Use present tense for current/general claims ('Smith argues that...'), past tense for specific past studies ('Smith found that...'), and present perfect for ongoing relevance ('Studies have shown that...').",
        examples: [
          { correct: "Lee (2022) found that bilingual children outperformed their peers.", translation: "Past — a specific study." },
          { correct: "Researchers have demonstrated a strong correlation.", translation: "Present perfect — ongoing relevance." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-paraphrase-challenge",
        title: "Paraphrase Workshop",
        situation: "Your tutor reads out original passages and you practise paraphrasing them aloud.",
        agentRole: "You are Dr. Amara, an academic writing tutor. Read short passages and evaluate the student's paraphrases for accuracy and originality.",
        userGoal: "Paraphrase three passages correctly, using different reporting verbs each time.",
        targetPhrases: ["According to", "suggests that", "contends that", "It has been argued"],
        successCriteria: ["Paraphrases accurately", "Varies reporting verbs", "Maintains academic register"],
      },
    ],
  },
];

// ============================================
// Module 3: Advanced Grammar
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "en-adv-l7",
    slug: "mixed-conditionals",
    title: "Mixed Conditionals & Hypothetical Reasoning",
    content: `# Mixed Conditionals & Hypothetical Reasoning

Standard conditionals follow predictable patterns. Mixed conditionals break those patterns — and that is what makes them powerful.

## Review: Standard Conditionals

| Type | Structure | Example |
|------|-----------|---------|
| 2nd (unreal present) | If + past simple, would + base | *If I spoke Mandarin, I would apply for the job.* |
| 3rd (unreal past) | If + past perfect, would have + pp | *If I had studied harder, I would have passed.* |

## Mixed Conditionals

| Mix | Structure | Example |
|-----|-----------|---------|
| Past → Present | If + past perfect, would + base | *If I had taken that job, I would be in Tokyo now.* |
| Present → Past | If + past simple, would have + pp | *If she were more careful, she would have noticed the error.* |

## When to Use Mixed Conditionals

- Connecting a past cause to a present result (or vice versa)
- Speculating about alternative life paths
- Expressing regret with present consequences`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m3",
    moduleTitle: "Advanced Grammar",
    order: 7,
    topicId: "en-advanced-mixed-conditionals",
    vocabulary: [
      { word: "hypothetical", translation: "based on an imagined situation, not reality", pronunciation: "/ˌhaɪpəˈθɛtɪkəl/", exampleSentence: "Let me pose a hypothetical: what if you had never left your hometown?", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "counterfactual", translation: "describing what did not happen but could have", pronunciation: "/ˌkaʊntərˈfæktʃuəl/", exampleSentence: "Counterfactual reasoning is central to historical analysis.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "consequence", translation: "a result or effect of an action", pronunciation: "/ˈkɒnsɪkwəns/", exampleSentence: "Every decision has consequences, both intended and unintended.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "speculation", translation: "forming opinions without firm evidence", pronunciation: "/ˌspɛkjʊˈleɪʃən/", exampleSentence: "This is pure speculation — we need data.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Mixed Conditional: Past Condition → Present Result",
        explanation: "Use 'If + past perfect, ... would + base verb' when a past event has a continuing present effect.",
        examples: [
          { correct: "If I had accepted the scholarship, I would be a doctor now.", translation: "Past decision → present situation." },
          { correct: "If they had invested earlier, they would own the building.", translation: "Past action → present state." },
        ],
        commonMistakes: [
          { incorrect: "If I would have accepted the scholarship, I would be a doctor.", correction: "If I had accepted the scholarship, I would be a doctor.", explanation: "Never use 'would have' in the if-clause of a conditional." },
        ],
      },
      {
        title: "Mixed Conditional: Present Condition → Past Result",
        explanation: "Use 'If + past simple, ... would have + past participle' when a permanent trait affected a past outcome.",
        examples: [
          { correct: "If she were more observant, she would have spotted the mistake.", translation: "General trait → specific past event." },
          { correct: "If I weren't so stubborn, I would have apologised immediately.", translation: "Personality → past action." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-life-paths",
        title: "The Road Not Taken",
        situation: "You are catching up with an old friend, reflecting on life decisions and what might have been.",
        agentRole: "You are Alex, a former university classmate. Share your own 'what-ifs' and ask the student about theirs. Use mixed conditionals naturally.",
        userGoal: "Discuss at least two alternative life paths using mixed conditionals correctly.",
        targetPhrases: ["If I had", "I would be", "If I weren't", "I would have"],
        successCriteria: ["Uses past→present mixed conditional", "Uses present→past mixed conditional", "Conversation flows naturally"],
      },
    ],
  },
  {
    id: "en-adv-l8",
    slug: "subjunctive-formal-mandative",
    title: "The Subjunctive & Formal Mandative Structures",
    content: `# The Subjunctive & Formal Mandative Structures

The English subjunctive is rare in everyday speech but essential in formal, legal, and academic contexts.

## The Mandative Subjunctive

After verbs of demand, suggestion, or recommendation, the subjunctive uses the **base form** of the verb — no -s, no past marking:

- *The board **recommends** that she **take** the position.* (NOT "takes")
- *It is essential that every student **submit** the form.* (NOT "submits")
- *They demanded that he **resign** immediately.* (NOT "resigned")

## Trigger Verbs & Adjectives

**Verbs:** recommend, suggest, insist, demand, require, propose, request
**Adjectives:** essential, vital, crucial, important, necessary, imperative

## The Formulaic Subjunctive

Fixed expressions that survive from older English:
- *If need **be***, we can reschedule.
- *Come **what** may, we will proceed.*
- ***Be** that as it may, the deadline stands.*
- *God **save** the King.*`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m3",
    moduleTitle: "Advanced Grammar",
    order: 8,
    topicId: "en-advanced-subjunctive-formal-mandative",
    vocabulary: [
      { word: "subjunctive", translation: "a verb mood expressing wishes, demands, or hypotheticals", pronunciation: "/səbˈdʒʌŋktɪv/", exampleSentence: "The subjunctive is more common in American formal English than in British.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "mandative", translation: "relating to commands, demands, or strong recommendations", pronunciation: "/ˈmændətɪv/", exampleSentence: "Mandative subjunctive follows verbs like 'insist' and 'demand'.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "imperative", translation: "of vital importance; or a grammatical mood for commands", pronunciation: "/ɪmˈpɛrətɪv/", exampleSentence: "It is imperative that the team be informed immediately.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "formulaic", translation: "consisting of fixed, conventional expressions", pronunciation: "/ˌfɔːrmjʊˈleɪɪk/", exampleSentence: "Formulaic subjunctives like 'if need be' are idiomatic set phrases.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Mandative Subjunctive",
        explanation: "After certain verbs and adjectives of demand/suggestion, use the bare infinitive (base form) regardless of subject. British English sometimes uses 'should + base' as an alternative.",
        examples: [
          { correct: "The committee insists that he attend the hearing.", translation: "Subjunctive: 'attend', not 'attends'." },
          { correct: "It is vital that the report be submitted by Friday.", translation: "Subjunctive: 'be', not 'is'." },
          { correct: "She suggested that we leave early.", translation: "Subjunctive: 'leave', not 'left'." },
        ],
        commonMistakes: [
          { incorrect: "The doctor recommended that she takes the medication.", correction: "The doctor recommended that she take the medication.", explanation: "After 'recommend', use the base form (subjunctive), not the indicative." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-board-meeting",
        title: "Board Meeting Recommendations",
        situation: "You are at a corporate board meeting proposing policy changes.",
        agentRole: "You are the board chair. Ask the student to present their recommendations formally. Push back on any that lack the subjunctive form.",
        userGoal: "Make three formal recommendations using the mandative subjunctive correctly.",
        targetPhrases: ["I recommend that", "It is essential that", "I propose that"],
        successCriteria: ["Uses mandative subjunctive correctly", "Maintains formal register", "Responds to pushback logically"],
      },
    ],
  },
  {
    id: "en-adv-l9",
    slug: "advanced-passives-causatives",
    title: "Advanced Passives & Causative Structures",
    content: `# Advanced Passives & Causative Structures

Beyond basic passive voice, C1 learners need passive constructions that appear in journalism, academia, and formal speech.

## Advanced Passive Forms

### Reporting Passives (Impersonal)
- *It is said that he owns three companies.*
- *She is believed to be the leading candidate.*
- *The policy is thought to have caused the recession.*

### Double Passives
- *The building is expected to be completed by June.*

### Get-Passive (Informal)
- *He got fired last week.* (= He was fired)
- *We got invited to the gala.* (= We were invited)

## Causative Structures

| Structure | Meaning | Example |
|-----------|---------|---------|
| have + object + past participle | arrange for someone to do something | *I had my car serviced.* |
| get + object + past participle | same as above (more informal) | *I got my hair cut.* |
| have + object + base verb | cause/instruct someone | *She had her assistant book the flight.* |
| get + object + to-infinitive | persuade someone | *I got him to agree.* |`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m3",
    moduleTitle: "Advanced Grammar",
    order: 9,
    topicId: "en-advanced-advanced-passives-causatives",
    vocabulary: [
      { word: "causative", translation: "a construction showing that someone arranges for an action to be done", pronunciation: "/ˈkɔːzətɪv/", exampleSentence: "The causative 'have something done' is essential for everyday English.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "impersonal", translation: "not referring to any particular person; used for objectivity", pronunciation: "/ɪmˈpɜːrsənəl/", exampleSentence: "Impersonal passives like 'It is believed that...' are common in news reports.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "allegedly", translation: "said to be the case but not yet proven", pronunciation: "/əˈlɛdʒɪdli/", exampleSentence: "He allegedly misused company funds.", exampleTranslation: "(same)", partOfSpeech: "adverb" },
      { word: "delegate", translation: "to assign responsibility or tasks to someone else", pronunciation: "/ˈdɛlɪɡeɪt/", exampleSentence: "Good managers delegate effectively — they have tasks completed by others.", exampleTranslation: "(same)", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Impersonal Reporting Passives",
        explanation: "Two patterns: (1) 'It + passive reporting verb + that-clause': It is said that... (2) 'Subject + passive reporting verb + to-infinitive': He is said to...",
        examples: [
          { correct: "It is believed that the economy will recover.", translation: "Pattern 1: It + is believed + that-clause." },
          { correct: "The CEO is reported to have resigned.", translation: "Pattern 2: Subject + is reported + to have + pp." },
        ],
        commonMistakes: [
          { incorrect: "It is believed the economy will to recover.", correction: "It is believed that the economy will recover.", explanation: "In Pattern 1, use a normal that-clause — no 'to' before the verb." },
        ],
      },
      {
        title: "Have/Get Something Done",
        explanation: "Use 'have/get + object + past participle' when you arrange for a service. Use 'have + object + base verb' or 'get + object + to-infinitive' when you cause or persuade someone to act.",
        examples: [
          { correct: "I had my passport renewed.", translation: "I arranged for someone to renew it." },
          { correct: "She got her team to finish the report.", translation: "She persuaded her team to finish it." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-news-report",
        title: "Breaking News Broadcast",
        situation: "You are a news anchor delivering a live report using impersonal passives and causatives.",
        agentRole: "You are a co-anchor. Feed the student breaking news details and expect them to deliver the report using appropriate passive constructions.",
        userGoal: "Report three news items using impersonal reporting passives and at least one causative structure.",
        targetPhrases: ["It is reported that", "is believed to", "had the documents released"],
        successCriteria: ["Uses reporting passives", "Uses a causative", "Maintains journalistic register"],
      },
    ],
  },
];

// ============================================
// Module 4: Business Communication
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "en-adv-l10",
    slug: "negotiation-diplomacy",
    title: "Negotiation & Diplomatic Language",
    content: `# Negotiation & Diplomatic Language

Successful negotiation requires precise language control — softening demands, making concessions, and holding firm without creating conflict.

## Softening Language

| Direct | Diplomatic |
|--------|-----------|
| We can't accept that. | I'm afraid that would be difficult for us to accept. |
| You're wrong. | I see your point, but I'd like to offer an alternative perspective. |
| Give us a discount. | We were wondering if there might be some flexibility on pricing. |

## Key Negotiation Phrases

### Opening Positions
- *We'd like to propose...*
- *Our initial position is...*
- *We've come to the table with...*

### Making Concessions
- *We'd be willing to... provided that...*
- *We could consider... on the condition that...*
- *As a gesture of goodwill, we could...*

### Holding Firm
- *I understand your position, but this is a non-negotiable point for us.*
- *With respect, we're unable to move on this.*
- *That falls outside the scope of what we can offer.*`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m4",
    moduleTitle: "Business Communication",
    order: 10,
    topicId: "en-advanced-negotiation-diplomacy",
    vocabulary: [
      { word: "concession", translation: "something given up in a negotiation to reach agreement", pronunciation: "/kənˈsɛʃən/", exampleSentence: "We're prepared to make a concession on the delivery timeline.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "leverage", translation: "power or advantage used to influence an outcome", pronunciation: "/ˈlɛvərɪdʒ/", exampleSentence: "Having three competing offers gives us significant leverage.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "stakeholder", translation: "a person with an interest or concern in a project", pronunciation: "/ˈsteɪkhoʊldər/", exampleSentence: "All stakeholders must approve before the deal is signed.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "non-negotiable", translation: "not open to discussion or compromise", pronunciation: "/nɒn nɪˈɡoʊʃiəbəl/", exampleSentence: "Data security is non-negotiable for our company.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "goodwill", translation: "friendly, cooperative, and trusting attitude in business", pronunciation: "/ˌɡʊdˈwɪl/", exampleSentence: "As a gesture of goodwill, we waived the late fee.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Distancing with Past Tense and Continuous",
        explanation: "Using past tense or continuous forms for present situations creates social distance and politeness: 'I was wondering...' is softer than 'I wonder...'; 'We were hoping...' is softer than 'We hope...'.",
        examples: [
          { correct: "We were hoping you might reconsider the timeline.", translation: "Very soft request — four layers of distancing." },
          { correct: "I was wondering whether there was any room for negotiation.", translation: "Past continuous + 'whether' = maximum diplomacy." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-salary-negotiation",
        title: "Salary Negotiation",
        situation: "You have received a job offer but want to negotiate a higher salary and better benefits.",
        agentRole: "You are the HR director. Be firm but fair. Test whether the student can negotiate diplomatically without being aggressive or too passive.",
        userGoal: "Negotiate a higher salary and at least one additional benefit using diplomatic language.",
        targetPhrases: ["I was hoping", "Would it be possible", "I'd be willing to... provided that"],
        successCriteria: ["Uses softening language", "Makes a clear ask", "Responds to pushback diplomatically"],
      },
    ],
  },
  {
    id: "en-adv-l11",
    slug: "cross-cultural-business",
    title: "Cross-Cultural Business Communication",
    content: `# Cross-Cultural Business Communication

Global business means navigating different communication norms. What is polite in one culture may be confusing — or offensive — in another.

## High-Context vs. Low-Context Cultures

- **High-context** (Japan, Arab countries, much of Asia): Meaning is implied. Silence, tone, and context matter more than explicit words.
- **Low-context** (US, Germany, Scandinavia): Meaning is stated explicitly. Direct communication is valued.

## Common Cross-Cultural Pitfalls

1. **"Yes" doesn't always mean agreement** — in many Asian cultures, "yes" can mean "I hear you" or "I understand," not "I agree."
2. **Small talk duration varies** — Americans get to business quickly; in the Middle East, relationship-building comes first.
3. **Email tone** — British English uses more hedging and indirectness; American English is more direct.
4. **Hierarchy and titles** — Some cultures expect formal titles; others prefer first names from the start.

## Useful Phrases for Cross-Cultural Clarity

- *Could I just clarify what you meant by...?*
- *I want to make sure we're on the same page.*
- *In my culture, we tend to... — how does it work here?*
- *I don't want to assume — could you walk me through your process?*`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m4",
    moduleTitle: "Business Communication",
    order: 11,
    topicId: "en-advanced-cross-cultural-business",
    vocabulary: [
      { word: "high-context", translation: "communication style relying on shared knowledge and implication", pronunciation: "/haɪ ˈkɒntɛkst/", exampleSentence: "In high-context cultures, what is left unsaid can be as important as what is spoken.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "low-context", translation: "communication style relying on explicit, direct statements", pronunciation: "/loʊ ˈkɒntɛkst/", exampleSentence: "German business culture is famously low-context.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "protocol", translation: "the accepted code of behaviour in a particular situation", pronunciation: "/ˈproʊtəkɒl/", exampleSentence: "Business card exchange follows a specific protocol in Japan.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "etiquette", translation: "the customary rules of polite behaviour", pronunciation: "/ˈɛtɪkɛt/", exampleSentence: "Email etiquette varies significantly across cultures.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Indirect Questions for Politeness",
        explanation: "Embed a question inside a statement to soften it: 'Could you tell me...' or 'I was wondering if...' Use statement word order (no inversion) inside the embedded clause.",
        examples: [
          { correct: "Could you tell me what the deadline is?", translation: "NOT: 'Could you tell me what is the deadline?'" },
          { correct: "I wonder whether you could clarify that point.", translation: "'Whether' is more formal than 'if'." },
        ],
        commonMistakes: [
          { incorrect: "Could you tell me where is the meeting room?", correction: "Could you tell me where the meeting room is?", explanation: "In indirect questions, use statement word order after the question word." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-international-call",
        title: "First Call with a New International Client",
        situation: "You are on a video call with a new client from a high-context culture. You need to discuss project scope without being too blunt.",
        agentRole: "You are Kenji, a Japanese project manager. Be polite and indirect. If the student is too direct, show subtle discomfort.",
        userGoal: "Build rapport, discuss the project timeline, and confirm next steps — all while being culturally sensitive.",
        targetPhrases: ["I was wondering if", "Would it be convenient", "I appreciate your perspective"],
        successCriteria: ["Builds rapport before business", "Uses indirect questions", "Confirms understanding without being pushy"],
      },
    ],
    culturalNotes: [
      {
        title: "The Concept of 'Face'",
        content: "In many East Asian and Middle Eastern cultures, 'saving face' — avoiding public embarrassment — is paramount. Criticising someone openly, even with good intent, can damage the relationship permanently. Frame feedback privately and constructively. In English, phrases like 'You might want to consider...' or 'One possible improvement could be...' help preserve face.",
      },
    ],
  },
  {
    id: "en-adv-l12",
    slug: "reports-proposals",
    title: "Writing Reports & Proposals",
    content: `# Writing Reports & Proposals

Clear, structured business writing persuades, informs, and drives action.

## Report Structure

1. **Executive Summary** — Key findings in 2-3 sentences
2. **Introduction** — Background, scope, objectives
3. **Methodology** — How data was gathered
4. **Findings** — What was discovered (factual, no opinion)
5. **Analysis** — Interpretation of findings
6. **Recommendations** — Proposed actions
7. **Appendices** — Supporting data, charts, references

## Proposal Language

### Stating the Problem
- *The current system fails to meet demand.*
- *There is a growing need for...*

### Proposing a Solution
- *We propose implementing...*
- *It is recommended that the company adopt...*

### Justifying the Cost
- *The initial investment would be offset by...*
- *The projected ROI over three years is...*
- *Failure to act could result in...*

## Transition Signals for Reports

| Purpose | Signals |
|---------|---------|
| Addition | furthermore, moreover, in addition |
| Contrast | however, nevertheless, on the other hand |
| Cause/Effect | consequently, as a result, therefore |
| Concession | although, despite, notwithstanding |`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m4",
    moduleTitle: "Business Communication",
    order: 12,
    topicId: "en-advanced-reports-proposals",
    vocabulary: [
      { word: "executive summary", translation: "a brief overview of a report's key points for decision-makers", pronunciation: "/ɪɡˈzɛkjʊtɪv ˈsʌməri/", exampleSentence: "Most senior managers only read the executive summary.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "feasibility", translation: "whether something is practical and achievable", pronunciation: "/ˌfiːzəˈbɪləti/", exampleSentence: "We conducted a feasibility study before committing resources.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "ROI", translation: "return on investment — the profit relative to cost", pronunciation: "/ˌɑːr oʊ ˈaɪ/", exampleSentence: "The projected ROI is 150% over five years.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "notwithstanding", translation: "in spite of; despite", pronunciation: "/ˌnɒtwɪθˈstændɪŋ/", exampleSentence: "Notwithstanding the risks, the board approved the merger.", exampleTranslation: "(same)", partOfSpeech: "adverb" },
    ],
    grammarPoints: [
      {
        title: "Concessive Clauses",
        explanation: "Use concessive structures to acknowledge a counter-argument before making your point: 'Although/Even though/Despite the fact that + clause, main clause.' Also: 'Notwithstanding + noun, main clause.'",
        examples: [
          { correct: "Although the initial costs are high, the long-term savings justify the investment.", translation: "Concession + main argument." },
          { correct: "Despite having limited resources, the team exceeded targets.", translation: "'Despite + -ing' for conciseness." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-proposal-pitch",
        title: "Pitching a Proposal to the Board",
        situation: "You are presenting a proposal for a new company initiative to the executive board.",
        agentRole: "You are the CFO. Ask tough questions about costs, timelines, and risks. Expect structured, persuasive answers.",
        userGoal: "Present a proposal clearly, justify the cost, and handle objections using formal business English.",
        targetPhrases: ["We propose", "The projected ROI", "Notwithstanding", "It is recommended that"],
        successCriteria: ["Presents structured argument", "Handles objections professionally", "Uses formal transition signals"],
      },
    ],
  },
];

// ============================================
// Module 5: Media & Rhetoric
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "en-adv-l13",
    slug: "analysing-media-bias",
    title: "Analysing Bias in Media",
    content: `# Analysing Bias in Media

Critical reading of news and media is essential at C1 level. Every text has a perspective — your job is to identify it.

## Types of Media Bias

1. **Selection bias** — What stories are covered (and what is omitted)?
2. **Framing bias** — How is the story presented? ("Protesters" vs. "rioters")
3. **Confirmation bias** — Favouring information that supports existing beliefs
4. **Loaded language** — Emotionally charged words that influence perception
5. **False balance** — Giving equal time to unequal positions (e.g., 97% scientific consensus vs. 3% fringe)

## Critical Reading Questions

- *Who published this and what is their funding model?*
- *What sources are cited — and who is missing?*
- *What adjectives and verbs are used? Are they neutral or loaded?*
- *What is the headline implying that the article doesn't say?*

## Neutral vs. Loaded Language

| Neutral | Loaded |
|---------|--------|
| said | claimed, admitted, boasted |
| group | mob, gang, community |
| plan | scheme, plot, strategy |
| young person | youth, juvenile, kid |`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m5",
    moduleTitle: "Media & Rhetoric",
    order: 13,
    topicId: "en-advanced-analysing-media-bias",
    vocabulary: [
      { word: "framing", translation: "presenting information in a way that influences interpretation", pronunciation: "/ˈfreɪmɪŋ/", exampleSentence: "The framing of the headline made the policy sound more radical than it was.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "rhetoric", translation: "the art of persuasive speaking or writing", pronunciation: "/ˈrɛtərɪk/", exampleSentence: "Political rhetoric often relies on emotional appeal over logic.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "propaganda", translation: "biased information used to promote a cause or viewpoint", pronunciation: "/ˌprɒpəˈɡændə/", exampleSentence: "State-controlled media is often a vehicle for propaganda.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "spin", translation: "presenting facts in a favourable or misleading way", pronunciation: "/spɪn/", exampleSentence: "The press release put a positive spin on the declining sales figures.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Participle Clauses for Conciseness",
        explanation: "Participle clauses replace longer relative or adverbial clauses: 'Having analysed the data, we concluded...' instead of 'After we had analysed the data, we concluded...'.",
        examples: [
          { correct: "Having read both articles, I noticed clear framing differences.", translation: "Perfect participle = completed action before main clause." },
          { correct: "Written by an anonymous source, the report lacks accountability.", translation: "Past participle clause = passive meaning." },
        ],
        commonMistakes: [
          { incorrect: "Having read the article, the bias was obvious.", correction: "Having read the article, I found the bias obvious.", explanation: "The subject of the participle clause must match the subject of the main clause (dangling participle)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-media-analysis",
        title: "Comparing Two News Reports",
        situation: "You and a colleague are comparing how two different outlets reported the same event.",
        agentRole: "You are Jordan, a media studies graduate. Describe one article and ask the student to analyse the bias, framing, and language choices.",
        userGoal: "Identify at least two types of bias and explain how specific word choices reveal the outlet's perspective.",
        targetPhrases: ["The framing suggests", "This is an example of", "The use of the word... implies"],
        successCriteria: ["Identifies bias types", "Cites specific language examples", "Provides balanced analysis"],
      },
    ],
  },
  {
    id: "en-adv-l14",
    slug: "rhetorical-devices",
    title: "Rhetorical Devices & Persuasive Techniques",
    content: `# Rhetorical Devices & Persuasive Techniques

Great speakers and writers use specific techniques to persuade. Recognising these — and using them yourself — is a C1 skill.

## Classical Rhetorical Appeals

- **Ethos** — Credibility. *"As a doctor with 20 years' experience, I can tell you..."*
- **Pathos** — Emotion. *"Imagine a child going to bed hungry every night."*
- **Logos** — Logic. *"Studies show that countries with universal healthcare spend 30% less per capita."*

## Key Rhetorical Devices

| Device | Definition | Example |
|--------|-----------|---------|
| Anaphora | Repeating the opening word/phrase | *"We shall fight on the beaches, we shall fight on the landing grounds..."* |
| Tricolon | Groups of three | *"Government of the people, by the people, for the people."* |
| Antithesis | Contrasting ideas in parallel | *"One small step for man, one giant leap for mankind."* |
| Rhetorical question | A question that expects no answer | *"If not now, when?"* |
| Hyperbole | Deliberate exaggeration | *"I've told you a million times."* |
| Litotes | Understatement via double negative | *"She's not unintelligent." (= She's quite smart)* |`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m5",
    moduleTitle: "Media & Rhetoric",
    order: 14,
    topicId: "en-advanced-rhetorical-devices",
    vocabulary: [
      { word: "anaphora", translation: "repetition of a word or phrase at the start of successive clauses", pronunciation: "/əˈnæfərə/", exampleSentence: "Martin Luther King's 'I have a dream' speech uses anaphora powerfully.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "antithesis", translation: "placing contrasting ideas in parallel structure", pronunciation: "/ænˈtɪθəsɪs/", exampleSentence: "The antithesis in 'to err is human, to forgive divine' creates memorable rhythm.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "litotes", translation: "understatement achieved by negating the opposite", pronunciation: "/laɪˈtoʊtiːz/", exampleSentence: "'Not bad' is a classic litotes meaning 'quite good'.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "tricolon", translation: "a series of three parallel words, phrases, or clauses", pronunciation: "/traɪˈkoʊlɒn/", exampleSentence: "'Veni, vidi, vici' is perhaps the most famous tricolon.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Parallel Structure in Rhetoric",
        explanation: "Items in a list, comparison, or contrast should share the same grammatical form. This creates rhythm and clarity.",
        examples: [
          { correct: "She likes reading, writing, and debating.", translation: "Three gerunds — parallel." },
          { correct: "The plan was bold, the execution flawless, and the result transformative.", translation: "Three parallel noun + adjective phrases." },
        ],
        commonMistakes: [
          { incorrect: "She likes reading, to write, and debates.", correction: "She likes reading, writing, and debating.", explanation: "Mixing gerunds, infinitives, and bare nouns breaks parallelism." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-persuasive-speech",
        title: "Delivering a Persuasive Speech",
        situation: "You are giving a two-minute speech to persuade your audience on a topic of your choice.",
        agentRole: "You are an audience member. After the speech, identify which rhetorical devices the student used and ask follow-up questions.",
        userGoal: "Deliver a short persuasive speech using at least three different rhetorical devices.",
        targetPhrases: ["If not now, when?", "Not only... but also", "Imagine a world where"],
        successCriteria: ["Uses ethos, pathos, or logos", "Employs at least two named devices", "Maintains persuasive tone"],
      },
    ],
  },
  {
    id: "en-adv-l15",
    slug: "satire-irony",
    title: "Satire, Irony & Persuasive Writing",
    content: `# Satire, Irony & Persuasive Writing

Understanding and producing irony is one of the most challenging — and rewarding — aspects of advanced English.

## Types of Irony

1. **Verbal irony:** Saying the opposite of what you mean. *"Oh, wonderful — another meeting."*
2. **Situational irony:** When the outcome is the opposite of what was expected. *A fire station burns down.*
3. **Dramatic irony:** When the audience knows something a character does not.

## Satire

Satire uses humour, irony, and exaggeration to criticise society or individuals. Think of publications like *The Onion* or *Private Eye*.

### Satirical Techniques
- **Parody:** Imitating a style for comic effect
- **Caricature:** Exaggerating features to mock
- **Juxtaposition:** Placing contradictory ideas side by side
- **Understatement:** Describing something serious in mild terms

## Detecting Tone in Writing

At C1, you should recognise when a writer is being:
- Sincere vs. sarcastic
- Earnest vs. tongue-in-cheek
- Straightforward vs. satirical

**Key signals:** incongruity, exaggeration, formal tone applied to trivial matters, praise that seems too strong.`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m5",
    moduleTitle: "Media & Rhetoric",
    order: 15,
    topicId: "en-advanced-satire-irony",
    vocabulary: [
      { word: "satire", translation: "the use of humour and irony to criticise", pronunciation: "/ˈsætaɪər/", exampleSentence: "Jonathan Swift's 'A Modest Proposal' is a masterpiece of satire.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "tongue-in-cheek", translation: "said in an ironic or insincere way, meant as a joke", pronunciation: "/ˌtʌŋ ɪn ˈtʃiːk/", exampleSentence: "His recommendation to 'work 25 hours a day' was clearly tongue-in-cheek.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "incongruity", translation: "something that does not fit or seems out of place", pronunciation: "/ˌɪnkɒŋˈɡruːɪti/", exampleSentence: "The incongruity between the formal tone and the absurd content signals satire.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "parody", translation: "an imitation of a style for humorous effect", pronunciation: "/ˈpærədi/", exampleSentence: "The sketch was a pitch-perfect parody of a TED talk.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Understatement and Litotes in Practice",
        explanation: "British English in particular uses understatement for ironic effect. Recognising this is crucial for comprehension.",
        examples: [
          { correct: "The economy isn't exactly booming.", translation: "Understatement meaning: the economy is doing very badly." },
          { correct: "He's not the most punctual person.", translation: "Litotes meaning: he is always late." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-satire-workshop",
        title: "Writing a Satirical Headline",
        situation: "You are brainstorming satirical news headlines with a comedy writer.",
        agentRole: "You are Mo, a writer for a satirical news site. Pitch topics and help the student craft ironic headlines. Explain why some attempts work better than others.",
        userGoal: "Create three satirical headlines that use irony, exaggeration, or juxtaposition.",
        targetPhrases: ["In a shocking turn", "Experts baffled", "Despite all evidence"],
        successCriteria: ["Demonstrates understanding of irony", "Headlines are humorous and biting", "Explains the satirical technique used"],
      },
    ],
    culturalNotes: [
      {
        title: "British Understatement vs. American Directness",
        content: "British English is famous for understatement: 'It's a bit tricky' might mean 'It's nearly impossible.' American English tends to be more direct and enthusiastic. At C1 level, recognising these tendencies prevents costly misunderstandings — especially in business.",
        region: "United Kingdom / United States",
      },
    ],
  },
];

// ============================================
// Module 6: Law & Ethics
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "en-adv-l16",
    slug: "legal-english-basics",
    title: "Legal English: Contracts, Rights & Obligations",
    content: `# Legal English: Contracts, Rights & Obligations

Legal English has its own vocabulary, structures, and conventions. Even if you never practise law, understanding legal language helps you read contracts, leases, and policies.

## Key Legal Vocabulary

| Term | Meaning |
|------|---------|
| party | a person or organisation involved in an agreement |
| clause | a specific section of a contract |
| liable | legally responsible |
| binding | legally enforceable |
| breach | violation of a contract term |
| indemnify | to compensate for loss or damage |
| hereinafter | from this point on in the document |
| notwithstanding | in spite of |

## Common Contract Structures

- *The Seller **shall** deliver the goods within 30 days.* ("shall" = obligation)
- *The Buyer **may** request an extension.* ("may" = permission)
- *Neither party **shall be liable** for force majeure events.*
- *This agreement is **binding upon** all successors and assigns.*

## Complex Relative Clauses in Legal Texts

Legal English uses long, embedded relative clauses:
- *The party **whose obligations under this agreement have not been fulfilled** shall be deemed in breach.*`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m6",
    moduleTitle: "Law & Ethics",
    order: 16,
    topicId: "en-advanced-legal-english-basics",
    vocabulary: [
      { word: "liable", translation: "legally responsible for something", pronunciation: "/ˈlaɪəbəl/", exampleSentence: "The manufacturer is liable for any defects in the product.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "breach", translation: "a violation of a law, rule, or contract", pronunciation: "/briːtʃ/", exampleSentence: "Failure to deliver on time constitutes a breach of contract.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "indemnify", translation: "to compensate someone for harm or loss", pronunciation: "/ɪnˈdɛmnɪfaɪ/", exampleSentence: "The insurer shall indemnify the policyholder against all claims.", exampleTranslation: "(same)", partOfSpeech: "verb" },
      { word: "clause", translation: "a distinct section of a legal document", pronunciation: "/klɔːz/", exampleSentence: "Clause 7 stipulates the termination conditions.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "binding", translation: "creating a legal obligation that must be followed", pronunciation: "/ˈbaɪndɪŋ/", exampleSentence: "The agreement is legally binding once both parties sign.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Shall vs. Will vs. May in Legal English",
        explanation: "In legal contexts: 'shall' = obligation/duty, 'will' = future fact (less common in contracts), 'may' = permission/option. This differs from everyday English where 'shall' and 'will' are near-synonyms.",
        examples: [
          { correct: "The tenant shall pay rent on the first of each month.", translation: "'Shall' = the tenant is obligated." },
          { correct: "The landlord may terminate the lease with 30 days' notice.", translation: "'May' = the landlord has the option." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-lease-review",
        title: "Reviewing a Lease Agreement",
        situation: "You are reviewing a rental lease with a friend who is not a native speaker, explaining key clauses in plain English.",
        agentRole: "You are Fatima, about to sign a lease for a flat. Ask the student to explain confusing legal clauses in simple terms.",
        userGoal: "Explain at least three legal terms or clauses in clear, everyday English.",
        targetPhrases: ["This means that", "In plain English", "You are required to"],
        successCriteria: ["Accurately explains legal terms", "Uses plain language", "Identifies key obligations and rights"],
      },
    ],
  },
  {
    id: "en-adv-l17",
    slug: "ethical-dilemmas-argumentation",
    title: "Ethical Dilemmas & Formal Argumentation",
    content: `# Ethical Dilemmas & Formal Argumentation

Discussing ethics requires precise language, logical structure, and the ability to consider multiple viewpoints.

## Argumentation Structure

1. **Claim:** State your position clearly
2. **Warrant:** Explain the reasoning behind the claim
3. **Evidence:** Provide facts, data, or examples
4. **Counter-argument:** Acknowledge the opposing view
5. **Rebuttal:** Explain why your position holds despite the counter-argument

## Language for Ethical Discussion

### Stating a Position
- *I would argue that...*
- *From an ethical standpoint,...*
- *On balance, I believe...*

### Acknowledging Counter-Arguments
- *Admittedly,...*
- *One could argue that...*
- *While there is merit in the view that...*

### Rebutting
- *However, this overlooks the fact that...*
- *That said, the weight of evidence suggests...*
- *Compelling as this may seem, it fails to account for...*

## Classic Ethical Dilemmas for Discussion

- The trolley problem (utilitarian vs. deontological ethics)
- Whistleblowing (loyalty vs. public interest)
- AI and employment (progress vs. displacement)
- Data privacy (security vs. freedom)`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m6",
    moduleTitle: "Law & Ethics",
    order: 17,
    topicId: "en-advanced-ethical-dilemmas-argumentation",
    vocabulary: [
      { word: "utilitarian", translation: "based on maximising overall happiness or benefit", pronunciation: "/ˌjuːtɪlɪˈtɛəriən/", exampleSentence: "A utilitarian would sacrifice one life to save five.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "deontological", translation: "based on rules and duties, regardless of outcome", pronunciation: "/ˌdiːɒntəˈlɒdʒɪkəl/", exampleSentence: "A deontological view holds that lying is wrong even if it saves lives.", exampleTranslation: "(same)", partOfSpeech: "adjective" },
      { word: "whistleblower", translation: "a person who exposes wrongdoing within an organisation", pronunciation: "/ˈwɪsəlˌbloʊər/", exampleSentence: "Whistleblowers often face retaliation despite legal protections.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "rebuttal", translation: "a counter-argument that refutes the opposing view", pronunciation: "/rɪˈbʌtəl/", exampleSentence: "Her rebuttal addressed every point the opposition had raised.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Complex Relative Clauses (Reduced & Non-Reduced)",
        explanation: "At C1 level, use and understand: non-defining relative clauses with 'which' for comments, reduced relatives (dropping who/which + be), and preposition + which/whom for formal style.",
        examples: [
          { correct: "The policy, which many consider outdated, remains in force.", translation: "Non-defining relative clause (with commas)." },
          { correct: "The evidence presented at trial was inconclusive.", translation: "Reduced relative: 'which was presented' → 'presented'." },
          { correct: "The principle on which the argument rests is flawed.", translation: "Preposition + which — formal style." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-ethics-debate",
        title: "AI Ethics Panel Discussion",
        situation: "You are on a panel debating whether AI should be used to make judicial sentencing decisions.",
        agentRole: "You are Dr. Rivera, a legal scholar who supports AI sentencing. Challenge the student to present a structured counter-argument.",
        userGoal: "Argue against AI sentencing using the claim-warrant-evidence-rebuttal structure.",
        targetPhrases: ["I would argue that", "While there is merit in", "However, this overlooks"],
        successCriteria: ["Presents a clear claim", "Addresses the counter-argument", "Provides evidence or reasoning"],
      },
    ],
  },
  {
    id: "en-adv-l18",
    slug: "complex-relatives-formal-linking",
    title: "Complex Relative Clauses & Formal Linking",
    content: `# Complex Relative Clauses & Formal Linking

Master the relative clause patterns that distinguish competent writers from advanced ones.

## Relative Clause Patterns

### 1. Preposition + Which/Whom (Formal)
- *The criteria **by which** candidates are assessed are published annually.*
- *The colleague **with whom** I collaborated has since retired.*

### 2. Quantifiers + Of Which/Whom
- *She interviewed 50 applicants, **most of whom** had graduate degrees.*
- *The report contained 300 pages, **many of which** were appendices.*

### 3. Where / When / Why (Adverbial Relatives)
- *The decade **during which** the reforms took place was turbulent.*
- *There are situations **in which** silence is more powerful than words.*

### 4. Reduced Relative Clauses
- Full: *The candidates **who were shortlisted** will attend.*
- Reduced: *The candidates **shortlisted** will attend.*

## Formal Linking Devices

| Function | Linking Phrase |
|----------|---------------|
| Reformulation | in other words, that is to say, to put it another way |
| Exemplification | for instance, to illustrate, a case in point |
| Generalisation | on the whole, by and large, broadly speaking |
| Digression & return | incidentally, to digress briefly, returning to the main point |`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m6",
    moduleTitle: "Law & Ethics",
    order: 18,
    topicId: "en-advanced-complex-relatives-formal-linking",
    vocabulary: [
      { word: "criterion (pl. criteria)", translation: "a standard by which something is judged", pronunciation: "/kraɪˈtɪəriən/", exampleSentence: "The main criterion for selection is relevant experience.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "reformulation", translation: "expressing the same idea in different words", pronunciation: "/ˌriːfɔːrmjʊˈleɪʃən/", exampleSentence: "Reformulation helps ensure your audience has understood the key point.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "digression", translation: "a temporary departure from the main topic", pronunciation: "/daɪˈɡrɛʃən/", exampleSentence: "Pardon the digression, but this anecdote illustrates my point.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "exemplification", translation: "the act of illustrating with examples", pronunciation: "/ɪɡˌzɛmplɪfɪˈkeɪʃən/", exampleSentence: "Good exemplification makes abstract arguments concrete.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Preposition + Relative Pronoun",
        explanation: "In formal English, place the preposition before 'which' or 'whom' rather than stranding it at the end. This is especially expected in academic and legal writing.",
        examples: [
          { correct: "The matter to which I am referring is confidential.", translation: "Formal: preposition fronted." },
          { correct: "The people with whom we negotiated were reasonable.", translation: "Formal: 'whom' after preposition." },
        ],
        commonMistakes: [
          { incorrect: "The matter which I am referring to is confidential.", correction: "The matter to which I am referring is confidential.", explanation: "In formal registers, front the preposition. The stranded version is acceptable in informal speech." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-formal-lecture",
        title: "Guest Lecture Q&A",
        situation: "You have just given a guest lecture and are now fielding questions from the audience.",
        agentRole: "You are a philosophy professor in the audience. Ask nuanced questions that require the student to use complex relative clauses and formal linking in their answers.",
        userGoal: "Answer three questions using preposition + which/whom structures and formal linking devices.",
        targetPhrases: ["the principle on which", "most of whom", "to put it another way"],
        successCriteria: ["Uses formal relative clauses", "Employs linking devices", "Maintains coherent argument"],
      },
    ],
  },
];

// ============================================
// Module 7: Science & Technology
// ============================================

const module7Lessons: LanguageLesson[] = [
  {
    id: "en-adv-l19",
    slug: "explaining-complex-ideas",
    title: "Explaining Complex Ideas Simply",
    content: `# Explaining Complex Ideas Simply

The ability to explain a complex concept to a non-expert audience is one of the most valuable communication skills.

## Strategies for Simplification

### 1. Analogy
- *Encryption is like a lockbox — only someone with the right key can open it.*
- *DNA is like a recipe book for building a human body.*

### 2. Layered Explanation
Start with the simplest version, then add detail:
- Layer 1: "Machine learning lets computers learn from examples."
- Layer 2: "It uses algorithms that find patterns in data."
- Layer 3: "Specifically, neural networks adjust weighted connections based on training data to minimise error."

### 3. Concrete Before Abstract
Always give a specific example before the general principle.

### 4. Signposting
- *Let me break this down...*
- *In simple terms,...*
- *The key takeaway is...*
- *Think of it this way...*

## Common Pitfalls

- **Jargon overload:** Define technical terms or avoid them entirely
- **Curse of knowledge:** Assuming the listener knows what you know
- **Information dump:** Giving too much detail at once`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m7",
    moduleTitle: "Science & Technology",
    order: 19,
    topicId: "en-advanced-explaining-complex-ideas",
    vocabulary: [
      { word: "analogy", translation: "a comparison between two things to explain an idea", pronunciation: "/əˈnælədʒi/", exampleSentence: "The immune system analogy helped patients understand how vaccines work.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "jargon", translation: "specialised vocabulary used by a particular profession", pronunciation: "/ˈdʒɑːrɡən/", exampleSentence: "Avoid medical jargon when speaking with patients.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "layperson", translation: "someone without specialist knowledge in a field", pronunciation: "/ˈleɪpɜːrsən/", exampleSentence: "A good science communicator can make quantum physics accessible to a layperson.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "signposting", translation: "language that tells the listener what is coming next", pronunciation: "/ˈsaɪnpoʊstɪŋ/", exampleSentence: "Signposting like 'Let me explain' helps your audience follow your logic.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Defining Relative Clauses Without 'That' or 'Which'",
        explanation: "In spoken English, defining relative clauses often drop 'that/which' when the pronoun is the object. This makes speech sound natural and fluid.",
        examples: [
          { correct: "The concept I was explaining is called recursion.", translation: "Dropped 'that': 'The concept (that) I was explaining...'" },
          { correct: "The example you gave really helped.", translation: "Dropped 'that': 'The example (that) you gave...'" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-explain-tech",
        title: "Explain It to My Grandmother",
        situation: "Your colleague asks you to explain a technical concept in a way that a non-technical person would understand.",
        agentRole: "You are Pat, a marketing manager with no technical background. Ask the student to explain a complex concept (e.g., blockchain, CRISPR, machine learning). Ask follow-up questions if you don't understand.",
        userGoal: "Explain a complex concept using at least one analogy and layered explanation, without jargon.",
        targetPhrases: ["Think of it like", "In simple terms", "The key thing to understand is"],
        successCriteria: ["Uses analogy effectively", "Avoids unexplained jargon", "Adjusts explanation based on follow-up questions"],
      },
    ],
  },
  {
    id: "en-adv-l20",
    slug: "ai-debates-ethics",
    title: "Debating AI: Ethics, Risks & Opportunities",
    content: `# Debating AI: Ethics, Risks & Opportunities

AI is reshaping every industry. Discussing it intelligently requires both technical literacy and ethical reasoning.

## Key Debate Topics

### 1. AI and Employment
- Will AI create more jobs than it destroys?
- Who bears responsibility for displaced workers?

### 2. AI Bias and Fairness
- How do training data biases become algorithmic biases?
- Can AI ever be truly fair?

### 3. AI Autonomy
- Should AI systems make life-and-death decisions (autonomous vehicles, military)?
- Who is liable when an AI causes harm?

### 4. AI and Creativity
- Is AI-generated art "real" art?
- How should intellectual property law adapt?

## Debate Language at C1 Level

### Introducing Evidence
- *Research from MIT suggests that...*
- *A compelling case study is...*

### Qualifying Claims
- *To a certain extent, this is true, but...*
- *This holds in theory, but in practice...*

### Challenging Assumptions
- *That assumes... which may not be the case.*
- *The premise here is flawed because...*`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m7",
    moduleTitle: "Science & Technology",
    order: 20,
    topicId: "en-advanced-ai-debates-ethics",
    vocabulary: [
      { word: "algorithmic bias", translation: "systematic unfairness in an algorithm's outputs", pronunciation: "/ˌælɡəˈrɪðmɪk ˈbaɪəs/", exampleSentence: "Algorithmic bias in hiring tools can perpetuate racial discrimination.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "displacement", translation: "the forced movement of people from jobs or homes", pronunciation: "/dɪsˈpleɪsmənt/", exampleSentence: "Automation-driven displacement is a major concern for factory workers.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "autonomy", translation: "the ability to act independently, without human control", pronunciation: "/ɔːˈtɒnəmi/", exampleSentence: "Full autonomy for military drones raises profound ethical questions.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "intellectual property", translation: "creations of the mind protected by law (patents, copyright)", pronunciation: "/ˌɪntəˈlɛktʃuəl ˈprɒpərti/", exampleSentence: "Who owns the intellectual property when an AI writes a novel?", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Concessive Conditionals: Even if / Whether or not",
        explanation: "Use 'even if' to concede a hypothetical condition: the main clause holds regardless. 'Whether or not' presents two alternatives that do not affect the outcome.",
        examples: [
          { correct: "Even if AI surpasses human intelligence, ethical oversight remains essential.", translation: "The condition does not change the conclusion." },
          { correct: "Whether or not the technology is perfected, regulation must keep pace.", translation: "Both possibilities lead to the same conclusion." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-ai-panel",
        title: "AI Ethics Panel",
        situation: "You are on a panel debating whether governments should impose a moratorium on AI development.",
        agentRole: "You are Dr. Singh, a computer scientist who opposes the moratorium. Present strong counter-arguments and expect the student to respond with evidence-based reasoning.",
        userGoal: "Argue for or against an AI moratorium using structured argumentation, evidence, and concessive language.",
        targetPhrases: ["Even if", "The premise is flawed", "To a certain extent"],
        successCriteria: ["Presents a structured argument", "Uses concessive language", "Responds to counter-arguments with evidence"],
      },
    ],
  },
  {
    id: "en-adv-l21",
    slug: "scientific-methodology-language",
    title: "Scientific Methodology & Precision Language",
    content: `# Scientific Methodology & Precision Language

Scientific English demands extreme precision. Every word matters — especially verbs, quantifiers, and hedges.

## The Language of Methodology

| Phase | Key Verbs |
|-------|-----------|
| Design | hypothesise, operationalise, control for, randomise |
| Data collection | administer, distribute, record, sample |
| Analysis | correlate, regress, stratify, aggregate |
| Reporting | demonstrate, indicate, reveal, confirm, refute |

## Precision in Scientific Claims

### Correlation vs. Causation
- *X is **correlated with** Y.* (NOT: X causes Y — unless proven)
- *X **was found to predict** Y.* (statistical relationship)
- *X **resulted in** Y.* (causal — use only for controlled experiments)

### Quantifiers
- **Significant** has a specific meaning in science (p < 0.05) — do not use it casually
- **Most** (> 50%), **the majority** (> 50%), **almost all** (> 90%), **a substantial proportion** (25-50%)

## Describing Graphs and Trends

- *The data **show** a sharp increase between 2020 and 2023.*
- *There was a **gradual decline** in...*
- *X **peaked** at 45% before **levelling off**.*
- *The results **fluctuated** between 30 and 40 throughout the period.*`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m7",
    moduleTitle: "Science & Technology",
    order: 21,
    topicId: "en-advanced-scientific-methodology-language",
    vocabulary: [
      { word: "hypothesis", translation: "a testable prediction based on theory", pronunciation: "/haɪˈpɒθəsɪs/", exampleSentence: "The hypothesis was that sleep deprivation impairs decision-making.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "operationalise", translation: "to define a concept in measurable terms", pronunciation: "/ˌɒpəˈreɪʃənəlaɪz/", exampleSentence: "We operationalised 'wellbeing' as a score on a validated questionnaire.", exampleTranslation: "(same)", partOfSpeech: "verb" },
      { word: "confounding variable", translation: "an unmeasured factor that distorts the relationship between variables", pronunciation: "/kənˈfaʊndɪŋ ˈvɛəriəbəl/", exampleSentence: "Income is a confounding variable in studies linking education to health.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "replicate", translation: "to repeat an experiment to verify results", pronunciation: "/ˈrɛplɪkeɪt/", exampleSentence: "The findings have yet to be replicated by an independent team.", exampleTranslation: "(same)", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "The Passive in Scientific Writing",
        explanation: "Scientific writing traditionally uses the passive to foreground the process over the researcher. Modern style guides increasingly allow 'we' in methods sections, but passive remains dominant in results and discussion.",
        examples: [
          { correct: "The samples were incubated at 37°C for 24 hours.", translation: "Passive — focuses on the process." },
          { correct: "A significant correlation was found between X and Y (r = 0.72, p < 0.01).", translation: "Passive with statistical detail." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-describe-experiment",
        title: "Explaining Your Research",
        situation: "You are at a conference poster session. A fellow researcher asks about your methodology.",
        agentRole: "You are Dr. Park, a researcher in a related field. Ask detailed methodology questions and challenge any imprecise language.",
        userGoal: "Describe an experiment's methodology, results, and limitations using precise scientific language.",
        targetPhrases: ["was correlated with", "a significant increase", "the data suggest", "a confounding variable"],
        successCriteria: ["Distinguishes correlation from causation", "Uses quantifiers precisely", "Acknowledges limitations"],
      },
    ],
  },
];

// ============================================
// Module 8: Mastery & Fluency
// ============================================

const module8Lessons: LanguageLesson[] = [
  {
    id: "en-adv-l22",
    slug: "register-switching-pragmatics",
    title: "Register Switching & Pragmatics",
    content: `# Register Switching & Pragmatics

Pragmatics is the study of how context shapes meaning. At C1, you need to decode and deploy implicature, indirectness, and register shifts.

## Pragmatic Competence

### Implicature (What Is Meant vs. What Is Said)
- *"I see you're wearing your new shirt."* — Could be a compliment or a criticism, depending on tone.
- *"That's an interesting suggestion."* — In British English, often means "I disagree."
- *"We should do lunch sometime."* — Often a polite closing, not a real invitation.

### Speech Acts
| Type | Function | Example |
|------|----------|---------|
| Directive | Request/command | "Could you possibly...?" |
| Commissive | Promise/threat | "I'll make sure it's done." |
| Expressive | Feeling/attitude | "I really appreciate that." |
| Declarative | Making something so | "You're fired." / "I pronounce you..." |

## Register Continuum

**Frozen** → **Formal** → **Consultative** → **Casual** → **Intimate**

- Frozen: *"We the People of the United States..."*
- Formal: *"Ladies and gentlemen, I am delighted to welcome you."*
- Consultative: *"So, the plan is to launch in Q3."*
- Casual: *"Hey, what's the deal with the launch?"*
- Intimate: *"So Q3, yeah? Sorted."*`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m8",
    moduleTitle: "Mastery & Fluency",
    order: 22,
    topicId: "en-advanced-register-switching-pragmatics",
    vocabulary: [
      { word: "pragmatics", translation: "the study of how context affects meaning in communication", pronunciation: "/præɡˈmætɪks/", exampleSentence: "Pragmatics explains why 'Can you pass the salt?' is a request, not a question about ability.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "implicature", translation: "meaning that is implied rather than explicitly stated", pronunciation: "/ˈɪmplɪkətʃər/", exampleSentence: "The implicature of 'It's getting late' is often 'I want to leave.'", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "indirectness", translation: "expressing meaning in a roundabout way", pronunciation: "/ˌɪndɪˈrɛktnəs/", exampleSentence: "British indirectness can be baffling to speakers from more direct cultures.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "speech act", translation: "an utterance that performs a function (request, promise, apology)", pronunciation: "/spiːtʃ ækt/", exampleSentence: "Saying 'I promise' is a commissive speech act.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Pragmatic Softeners and Intensifiers",
        explanation: "Softeners reduce the force of an utterance (kind of, sort of, a bit, rather, somewhat). Intensifiers increase it (absolutely, utterly, downright, thoroughly). Choosing the right level signals your register.",
        examples: [
          { correct: "That's a rather bold claim.", translation: "'Rather' softens the criticism — formal/polite." },
          { correct: "That's an absolutely ridiculous claim.", translation: "'Absolutely' intensifies — could be casual or confrontational." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-register-shift",
        title: "From Boardroom to Bar",
        situation: "You start in a formal meeting, then the same group moves to an after-work drink. Shift your register accordingly.",
        agentRole: "You are Taylor, a colleague. In the meeting, maintain formal register. At the bar, switch to casual. See if the student matches each shift.",
        userGoal: "Communicate the same ideas in formal, consultative, and casual registers across the conversation.",
        targetPhrases: ["I'd like to propose", "So basically", "To be honest"],
        successCriteria: ["Demonstrates formal register", "Shifts to casual naturally", "Content remains consistent across registers"],
      },
    ],
  },
  {
    id: "en-adv-l23",
    slug: "idioms-collocations-fluency",
    title: "Idioms, Collocations & Natural Fluency",
    content: `# Idioms, Collocations & Natural Fluency

Fluency is not just speed — it is about using the combinations that native speakers expect.

## High-Frequency Collocations

| Correct | Incorrect |
|---------|-----------|
| make a decision | ~~do a decision~~ |
| heavy rain | ~~strong rain~~ |
| raise a concern | ~~lift a concern~~ |
| deeply concerned | ~~very concerned~~ (acceptable but less natural) |
| painfully obvious | ~~very obvious~~ (acceptable but less vivid) |
| commit a crime | ~~do a crime~~ |
| bitterly disappointed | ~~very disappointed~~ |

## Idioms for Professional & Academic Contexts

| Idiom | Meaning |
|-------|---------|
| the elephant in the room | an obvious problem nobody mentions |
| back to square one | starting over from the beginning |
| move the goalposts | change the rules or criteria after the fact |
| a double-edged sword | something with both advantages and disadvantages |
| cut corners | do something cheaply or inadequately |
| on the same page | in agreement, sharing understanding |
| the bottom line | the most important fact or conclusion |

## Binomials (Fixed Pairs)

- *pros and cons* (NOT cons and pros)
- *trial and error*
- *give and take*
- *sooner or later*
- *by and large*
- *null and void*`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m8",
    moduleTitle: "Mastery & Fluency",
    order: 23,
    topicId: "en-advanced-idioms-collocations-fluency",
    vocabulary: [
      { word: "collocation", translation: "a habitual pairing of words (e.g., 'make a decision', not 'do a decision')", pronunciation: "/ˌkɒləˈkeɪʃən/", exampleSentence: "Learning collocations is more effective than memorising isolated words.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "double-edged sword", translation: "something that has both positive and negative effects", pronunciation: "/ˌdʌbəl ɛdʒd ˈsɔːrd/", exampleSentence: "Social media is a double-edged sword — it connects people but also spreads misinformation.", exampleTranslation: "(same)", partOfSpeech: "idiom" },
      { word: "move the goalposts", translation: "to unfairly change the rules or conditions after something has begun", pronunciation: "/muːv ðə ˈɡoʊlpoʊsts/", exampleSentence: "Every time we meet a target, management moves the goalposts.", exampleTranslation: "(same)", partOfSpeech: "idiom" },
      { word: "the bottom line", translation: "the most important fact or the final conclusion", pronunciation: "/ðə ˈbɒtəm laɪn/", exampleSentence: "The bottom line is that we cannot afford another delay.", exampleTranslation: "(same)", partOfSpeech: "idiom" },
      { word: "cut corners", translation: "to do something in the cheapest or easiest way, sacrificing quality", pronunciation: "/kʌt ˈkɔːrnərz/", exampleSentence: "If we cut corners on testing, we risk a product recall.", exampleTranslation: "(same)", partOfSpeech: "idiom" },
    ],
    grammarPoints: [
      {
        title: "Intensifying Collocations (Adverb + Adjective)",
        explanation: "Certain adverbs pair with certain adjectives in fixed patterns. Using the right intensifier sounds natural; using the wrong one sounds 'off'.",
        examples: [
          { correct: "bitterly disappointed", translation: "NOT: 'deeply disappointed' (less common but acceptable)." },
          { correct: "painfully aware", translation: "NOT: 'very aware' (weaker)." },
          { correct: "highly unlikely", translation: "NOT: 'very unlikely' (acceptable but less C1)." },
        ],
        commonMistakes: [
          { incorrect: "I was strongly disappointed.", correction: "I was bitterly disappointed.", explanation: "'Strongly' does not collocate with 'disappointed'. Learn adverb-adjective pairings as chunks." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-idiom-conversation",
        title: "Water-Cooler Chat",
        situation: "You are chatting with colleagues about a frustrating project. Use idioms naturally.",
        agentRole: "You are Jamie, a colleague venting about the project. Use idioms freely and see if the student reciprocates with their own idiomatic responses.",
        userGoal: "Use at least four idioms or collocations naturally in conversation.",
        targetPhrases: ["back to square one", "the elephant in the room", "cut corners", "the bottom line"],
        successCriteria: ["Uses idioms in context", "Idioms are used correctly", "Conversation sounds natural, not forced"],
      },
    ],
  },
  {
    id: "en-adv-l24",
    slug: "spontaneous-debate-fluency",
    title: "Spontaneous Debate & Real-Time Fluency",
    content: `# Spontaneous Debate & Real-Time Fluency

The ultimate test of C1 proficiency: thinking on your feet in real time.

## Debate Skills

### Buying Thinking Time (Without Awkward Silence)
- *That's an interesting point — let me think about that for a moment.*
- *Well, off the top of my head, I'd say...*
- *That raises an important question, which is...*
- *I think there are several angles to this...*

### Agreeing Partially
- *I take your point, but...*
- *To some extent, yes, but I'd push back on...*
- *That's fair, although I'd add that...*

### Disagreeing Diplomatically
- *I see where you're coming from, but I'd argue that...*
- *With respect, I think there's another way to look at this.*
- *I'm not entirely convinced that...*

### Summarising & Concluding
- *So, to sum up,...*
- *I think the crux of the matter is...*
- *If I had to come down on one side, I'd say...*

## Fillers vs. Fluency Markers

**Avoid overusing:** um, uh, like, you know, basically
**Use instead:** well, I mean, actually, in fact, as a matter of fact, the thing is

These are not fillers — they are **discourse markers** that signal what kind of information is coming next.`,
    targetLanguage: "en",
    proficiencyLevel: "C1",
    moduleId: "en-adv-m8",
    moduleTitle: "Mastery & Fluency",
    order: 24,
    topicId: "en-advanced-spontaneous-debate-fluency",
    vocabulary: [
      { word: "discourse marker", translation: "a word or phrase that organises speech (well, so, I mean, actually)", pronunciation: "/ˈdɪskɔːrs ˈmɑːrkər/", exampleSentence: "Skilled speakers use discourse markers like 'well' and 'so' to structure their turns.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "off the top of my head", translation: "from immediate thought, without careful consideration", pronunciation: "/ɒf ðə tɒp əv maɪ hɛd/", exampleSentence: "Off the top of my head, I'd say there are about 20 countries in the EU.", exampleTranslation: "(same)", partOfSpeech: "idiom" },
      { word: "crux", translation: "the decisive or most important point", pronunciation: "/krʌks/", exampleSentence: "The crux of the issue is funding, not willpower.", exampleTranslation: "(same)", partOfSpeech: "noun" },
      { word: "push back", translation: "to resist or challenge an argument", pronunciation: "/pʊʃ bæk/", exampleSentence: "I'd push back on the assumption that more data always means better decisions.", exampleTranslation: "(same)", partOfSpeech: "phrasal verb" },
      { word: "nuance", translation: "a subtle but important distinction in meaning", pronunciation: "/ˈnjuːɑːns/", exampleSentence: "This debate requires more nuance than a simple yes-or-no answer.", exampleTranslation: "(same)", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Ellipsis in Spoken English",
        explanation: "In fast speech, English speakers regularly drop words that can be inferred from context. This is not 'bad grammar' — it is natural spoken grammar.",
        examples: [
          { correct: "Sounds good to me.", translation: "Full: 'That sounds good to me.'" },
          { correct: "Want to grab a coffee?", translation: "Full: 'Do you want to grab a coffee?'" },
          { correct: "Not sure I agree with that.", translation: "Full: 'I'm not sure I agree with that.'" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vs-spontaneous-debate",
        title: "Impromptu Debate: You Have 30 Seconds to Prepare",
        situation: "You are given a controversial statement and must argue for or against it with minimal preparation time.",
        agentRole: "You are the debate moderator. Present a motion (e.g., 'Social media does more harm than good'), give the student 30 seconds, then moderate a back-and-forth exchange. Play devil's advocate.",
        userGoal: "Construct a coherent argument on the spot, using discourse markers, hedging, and structured reasoning.",
        targetPhrases: ["Off the top of my head", "The crux of the matter", "I take your point, but", "To sum up"],
        successCriteria: ["Responds coherently under time pressure", "Uses discourse markers instead of fillers", "Builds a structured argument in real time", "Handles counter-arguments gracefully"],
      },
    ],
    culturalNotes: [
      {
        title: "The Art of Disagreeing in English",
        content: "Across English-speaking cultures, direct disagreement ('You're wrong') is generally considered rude in professional settings. Instead, speakers soften disagreement with phrases like 'I see your point, but...' or 'I'm not entirely sure about that.' The level of indirectness varies: British English is the most indirect, Australian English is relatively blunt, and American English falls in between. At C1, mastering this spectrum is essential for effective cross-cultural communication.",
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  {
    id: "en-adv-m1",
    title: "Module 1: Language & Identity",
    description: "English varieties, cleft sentences, inversion, and code-switching",
    order: 1,
    lessons: module1Lessons,
  },
  {
    id: "en-adv-m2",
    title: "Module 2: Academic English",
    description: "Academic writing, hedging, nominalisation, and citations",
    order: 2,
    lessons: module2Lessons,
  },
  {
    id: "en-adv-m3",
    title: "Module 3: Advanced Grammar",
    description: "Mixed conditionals, subjunctive, advanced passives and causatives",
    order: 3,
    lessons: module3Lessons,
  },
  {
    id: "en-adv-m4",
    title: "Module 4: Business Communication",
    description: "Negotiation, cross-cultural business, and reports",
    order: 4,
    lessons: module4Lessons,
  },
  {
    id: "en-adv-m5",
    title: "Module 5: Media & Rhetoric",
    description: "Media bias, rhetorical devices, satire, and persuasive writing",
    order: 5,
    lessons: module5Lessons,
  },
  {
    id: "en-adv-m6",
    title: "Module 6: Law & Ethics",
    description: "Legal English, ethical dilemmas, formal argumentation, and complex relatives",
    order: 6,
    lessons: module6Lessons,
  },
  {
    id: "en-adv-m7",
    title: "Module 7: Science & Technology",
    description: "Explaining complex ideas, AI debates, and scientific methodology",
    order: 7,
    lessons: module7Lessons,
  },
  {
    id: "en-adv-m8",
    title: "Module 8: Mastery & Fluency",
    description: "Register switching, pragmatics, idioms, collocations, and spontaneous debate",
    order: 8,
    lessons: module8Lessons,
  },
];

export const englishAdvancedCourse: LanguageCourse = {
  ...courseInfo,
  modules,
};

// Helper function to get all lessons
export function getEnglishAdvancedLessons() {
  return modules.flatMap((m) => m.lessons);
}

// Helper function to find a lesson by slug
export function findEnglishAdvancedLesson(slug: string) {
  return getEnglishAdvancedLessons().find((l) => l.slug === slug);
}
