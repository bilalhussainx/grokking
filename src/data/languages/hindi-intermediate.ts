// Hindi Intermediate Course Data
// CEFR B1 Level - Compound Verbs, Complex Sentences, Professional Communication

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "hindi-intermediate",
  slug: "hindi-intermediate",
  title: "Hindi Intermediate - B1",
  language: "hi",
  languageName: "Hindi",
  proficiencyLevel: "B1" as const,
  description: "Build fluency with compound verbs, complex sentence structures, and professional Hindi. Master the subjunctive, relative-correlative constructions, and navigate real-world situations with confidence.",
  targetAudience: "Learners who have completed Hindi Beginner or have A2-level Hindi",
  estimatedHours: 100,
  icon: "🇮🇳",
  prerequisiteCourseSlug: "hindi-beginner",
  nextCourseSlug: "hindi-advanced",
};

// ============================================
// Module 1: Compound & Perfect Verbs
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "hi-int-l1",
    slug: "compound-verbs",
    title: "Compound Verbs (संयुक्त क्रिया)",
    content: `# Compound Verbs — संयुक्त क्रिया

Compound verbs are what make Hindi sound natural. They combine a main verb stem with an auxiliary verb to add nuance.

## Common Patterns
- **खा लेना** (khaa lenaa) — to eat up (for yourself)
- **कर देना** (kar denaa) — to do (for someone else)
- **चल पड़ना** (chal padnaa) — to start walking (suddenly)
- **सो जाना** (so jaanaa) — to fall asleep (completely)

## Key Auxiliaries
- **लेना** — action benefits the doer
- **देना** — action benefits someone else
- **जाना** — completeness, finality
- **पड़ना** — suddenness, involuntary action`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m1",
    moduleTitle: "Compound & Perfect Verbs",
    order: 1,
    topicId: "hi-intermediate-compound-verbs",
    vocabulary: [
      {
        word: "खा लेना",
        translation: "to eat up (for oneself)",
        pronunciation: "khaa LAY-naa",
        exampleSentence: "जल्दी से खाना खा लो।",
        exampleTranslation: "Eat the food quickly.",
        partOfSpeech: "compound verb",
      },
      {
        word: "कर देना",
        translation: "to do (for someone else)",
        pronunciation: "kar DAY-naa",
        exampleSentence: "मैं यह काम कर दूँगा।",
        exampleTranslation: "I will do this work (for you).",
        partOfSpeech: "compound verb",
      },
      {
        word: "सो जाना",
        translation: "to fall asleep",
        pronunciation: "so JAA-naa",
        exampleSentence: "बच्चा सो गया।",
        exampleTranslation: "The child fell asleep.",
        partOfSpeech: "compound verb",
      },
      {
        word: "चल पड़ना",
        translation: "to start walking suddenly",
        pronunciation: "chal PAD-naa",
        exampleSentence: "वह अचानक चल पड़ा।",
        exampleTranslation: "He suddenly started walking.",
        partOfSpeech: "compound verb",
      },
    ],
    grammarPoints: [
      {
        title: "Compound Verb Formation",
        explanation: "Take the verb stem (remove -ना) and add an auxiliary verb. The auxiliary conjugates for tense, gender, and number. The main verb stem stays unchanged.",
        examples: [
          { correct: "उसने खाना खा लिया।", translation: "He/She ate the food (up).", note: "लिया agrees with खाना (masculine)" },
          { correct: "मैंने बात कह दी।", translation: "I said it (for their benefit).", note: "दी agrees with बात (feminine)" },
        ],
        commonMistakes: [
          { incorrect: "उसने खाना खा लिई।", correction: "उसने खाना खा लिया।", explanation: "लेना agrees with the object (खाना = masculine), not the subject." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "compound-practice",
        title: "Using Compound Verbs Naturally",
        situation: "You are talking to a friend about your morning routine",
        agentRole: "You are Priya, a Hindi-speaking friend who uses compound verbs naturally in every sentence. Ask about their morning routine and correct them if they use simple verbs where compound verbs sound more natural.",
        userGoal: "Describe your morning routine using compound verbs (उठ जाना, खा लेना, निकल पड़ना)",
        targetPhrases: ["उठ जाना", "खा लेना", "निकल पड़ना", "तैयार हो जाना"],
        successCriteria: ["Uses at least 2 compound verbs correctly", "Maintains natural conversation flow"],
      },
    ],
  },
  {
    id: "hi-int-l2",
    slug: "perfect-tenses",
    title: "Perfect Tenses",
    content: `# Perfect Tenses

## Present Perfect
- मैंने खाना खाया है। (I have eaten food.)
- Structure: Subject + ने + verb (past) + है/हैं

## Past Perfect
- मैंने खाना खाया था। (I had eaten food.)
- Structure: Subject + ने + verb (past) + था/थी/थे`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m1",
    moduleTitle: "Compound & Perfect Verbs",
    order: 2,
    topicId: "hi-intermediate-perfect-tenses",
    vocabulary: [
      {
        word: "पहले",
        translation: "before / earlier",
        pronunciation: "PAH-lay",
        exampleSentence: "मैं पहले यहाँ आया था।",
        exampleTranslation: "I had come here before.",
        partOfSpeech: "adverb",
      },
      {
        word: "अभी तक",
        translation: "until now / so far",
        pronunciation: "ab-HEE tak",
        exampleSentence: "अभी तक काम नहीं हुआ है।",
        exampleTranslation: "The work hasn't been done yet.",
        partOfSpeech: "adverb",
      },
      {
        word: "पूरा करना",
        translation: "to complete",
        pronunciation: "POO-raa KAR-naa",
        exampleSentence: "मैंने काम पूरा कर लिया है।",
        exampleTranslation: "I have completed the work.",
        partOfSpeech: "verb",
      },
      {
        word: "शुरू करना",
        translation: "to begin",
        pronunciation: "shoo-ROO KAR-naa",
        exampleSentence: "हमने पढ़ाई शुरू कर दी है।",
        exampleTranslation: "We have started studying.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Present Perfect vs Past Perfect",
        explanation: "Present perfect uses है/हैं (has/have done), past perfect uses था/थी/थे (had done). Both use the ने construction with transitive verbs.",
        examples: [
          { correct: "मैंने फ़िल्म देखी है।", translation: "I have watched the film.", note: "Present perfect — relevance to now" },
          { correct: "मैंने फ़िल्म देखी थी।", translation: "I had watched the film.", note: "Past perfect — before another past event" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "perfect-tense-chat",
        title: "Talking About Experiences",
        situation: "Discussing travel experiences with a colleague",
        agentRole: "You are Rahul, a well-traveled colleague. Ask the student about places they have visited and things they had done before coming to India.",
        userGoal: "Talk about your experiences using present and past perfect tenses",
        targetPhrases: ["मैंने...देखा है", "मैं...गया/गई हूँ", "पहले...था/थी"],
        successCriteria: ["Correctly distinguishes present and past perfect", "Uses ने with transitive verbs"],
      },
    ],
  },
  {
    id: "hi-int-l3",
    slug: "subjunctive-mood",
    title: "Subjunctive Mood (संभावना)",
    content: `# Subjunctive Mood — संभावना

The subjunctive expresses possibility, wishes, conditions, and polite requests.

## Formation
Remove -ना, add subjunctive endings: -ऊँ, -ए, -ए, -एँ, -ओ, -एँ

## Usage
- **अगर...तो** (if...then): अगर बारिश हो तो मत जाओ।
- **शायद** (perhaps): शायद वह आए।
- **काश** (I wish): काश मैं उड़ सकता!`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m1",
    moduleTitle: "Compound & Perfect Verbs",
    order: 3,
    topicId: "hi-intermediate-subjunctive",
    vocabulary: [
      {
        word: "अगर",
        translation: "if",
        pronunciation: "AH-gar",
        exampleSentence: "अगर तुम चाहो तो चलो।",
        exampleTranslation: "If you want, let's go.",
        partOfSpeech: "conjunction",
      },
      {
        word: "शायद",
        translation: "perhaps / maybe",
        pronunciation: "SHAA-yad",
        exampleSentence: "शायद कल बारिश हो।",
        exampleTranslation: "Maybe it will rain tomorrow.",
        partOfSpeech: "adverb",
      },
      {
        word: "काश",
        translation: "I wish / if only",
        pronunciation: "kaash",
        exampleSentence: "काश मेरे पास समय होता।",
        exampleTranslation: "If only I had time.",
        partOfSpeech: "interjection",
      },
      {
        word: "चाहे",
        translation: "even if / whether",
        pronunciation: "CHAA-hay",
        exampleSentence: "चाहे कुछ भी हो, मैं जाऊँगा।",
        exampleTranslation: "No matter what happens, I will go.",
        partOfSpeech: "conjunction",
      },
    ],
    grammarPoints: [
      {
        title: "Subjunctive Conjugation",
        explanation: "The subjunctive removes -ना and adds: मैं -ऊँ, तू -ए, तुम -ओ, आप -एँ, वह -ए, वे -एँ. It does not change for gender.",
        examples: [
          { correct: "अगर वह आए तो बताना।", translation: "If he/she comes, let me know." },
          { correct: "शायद हम कल मिलें।", translation: "Perhaps we'll meet tomorrow." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "subjunctive-hypotheticals",
        title: "Hypothetical Situations",
        situation: "Discussing what you would do in different scenarios",
        agentRole: "You are a friend posing hypothetical questions: What if you won the lottery? What if you could live anywhere? Use अगर...तो constructions.",
        userGoal: "Answer hypothetical questions using the subjunctive mood",
        targetPhrases: ["अगर मैं...तो", "काश", "शायद"],
        successCriteria: ["Uses subjunctive verb forms correctly", "Responds to hypotheticals naturally"],
      },
    ],
  },
];

// ============================================
// Module 2: Complex Sentences
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "hi-int-l4",
    slug: "relative-correlative",
    title: "Relative-Correlative Constructions",
    content: `# Relative-Correlative — जो...वो Pattern

Hindi uses paired words where English uses relative clauses:
- **जो...वो** (the one who...that one)
- **जब...तब** (when...then)
- **जहाँ...वहाँ** (where...there)
- **जैसा...वैसा** (as...so)`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m2",
    moduleTitle: "Complex Sentences",
    order: 1,
    topicId: "hi-intermediate-relative-correlative",
    vocabulary: [
      { word: "जो", translation: "who / which (relative)", pronunciation: "jo", exampleSentence: "जो लड़का वहाँ है, वो मेरा भाई है।", exampleTranslation: "The boy who is there is my brother.", partOfSpeech: "pronoun" },
      { word: "जब", translation: "when (relative)", pronunciation: "jab", exampleSentence: "जब मैं आया, तब वह गया।", exampleTranslation: "When I came, then he left.", partOfSpeech: "conjunction" },
      { word: "जहाँ", translation: "where (relative)", pronunciation: "ja-HAAN", exampleSentence: "जहाँ तुम जाओ, वहाँ मैं भी आऊँगा।", exampleTranslation: "Wherever you go, I will also come.", partOfSpeech: "adverb" },
      { word: "जैसा", translation: "as / like (relative)", pronunciation: "JAI-saa", exampleSentence: "जैसा तुम कहो, वैसा करूँगा।", exampleTranslation: "As you say, so I will do.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Relative-Correlative Pairs",
        explanation: "Hindi doesn't use English-style relative clauses. Instead, it uses paired words: the relative word (ज-) starts the dependent clause, and the correlative word (व-/त-) starts the main clause.",
        examples: [
          { correct: "जो मेहनत करता है, वो सफल होता है।", translation: "He who works hard succeeds." },
          { correct: "जब बारिश होती है, तब मुझे अच्छा लगता है।", translation: "When it rains, I feel good." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "relative-practice",
        title: "Describing People and Situations",
        situation: "Describing people at a family gathering",
        agentRole: "You are at a family event asking the student to identify and describe different relatives using जो...वो constructions.",
        userGoal: "Use relative-correlative constructions to describe people",
        targetPhrases: ["जो...वो", "जब...तब", "जहाँ...वहाँ"],
        successCriteria: ["Uses at least 2 relative-correlative pairs", "Clause order is correct (relative before correlative)"],
      },
    ],
  },
  {
    id: "hi-int-l5",
    slug: "passive-voice",
    title: "Passive Voice & Impersonal Constructions",
    content: `# Passive Voice — कर्मवाच्य

## Formation
Verb root + -आ/-ई/-ए + जाना (conjugated for tense)

## Examples
- खाना खाया जाता है। (Food is eaten.)
- यहाँ हिंदी बोली जाती है। (Hindi is spoken here.)
- ऐसा नहीं किया जा सकता। (This cannot be done.)`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m2",
    moduleTitle: "Complex Sentences",
    order: 2,
    topicId: "hi-intermediate-passive-voice",
    vocabulary: [
      { word: "बनाया जाना", translation: "to be made", pronunciation: "ba-NAA-yaa JAA-naa", exampleSentence: "यह मिठाई घर पर बनाई जाती है।", exampleTranslation: "This sweet is made at home.", partOfSpeech: "verb" },
      { word: "बोला जाना", translation: "to be spoken", pronunciation: "BO-laa JAA-naa", exampleSentence: "यहाँ अंग्रेज़ी बोली जाती है।", exampleTranslation: "English is spoken here.", partOfSpeech: "verb" },
      { word: "किया जाना", translation: "to be done", pronunciation: "KEE-yaa JAA-naa", exampleSentence: "यह काम कल किया जाएगा।", exampleTranslation: "This work will be done tomorrow.", partOfSpeech: "verb" },
      { word: "माना जाना", translation: "to be considered", pronunciation: "MAA-naa JAA-naa", exampleSentence: "वह अच्छा गायक माना जाता है।", exampleTranslation: "He is considered a good singer.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Passive with जाना",
        explanation: "Form the past participle of the main verb, then conjugate जाना for tense. The participle agrees with the subject in gender and number.",
        examples: [
          { correct: "चिट्ठी लिखी गई।", translation: "The letter was written.", note: "लिखी agrees with चिट्ठी (feminine)" },
          { correct: "खिड़कियाँ खोली गईं।", translation: "The windows were opened.", note: "खोली + गईं = feminine plural" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "passive-signs",
        title: "Reading Signs and Rules",
        situation: "Walking around a city and reading signs written in passive voice",
        agentRole: "You are a local guide showing the student around. Point out signs (यहाँ धूम्रपान नहीं किया जाता, हिंदी बोली जाती है) and ask them to explain what each means.",
        userGoal: "Understand and produce passive voice sentences about rules and customs",
        targetPhrases: ["किया जाता है", "बोली जाती है", "नहीं...जा सकता"],
        successCriteria: ["Understands passive meaning", "Produces at least 1 passive sentence"],
      },
    ],
  },
  {
    id: "hi-int-l6",
    slug: "causative-verbs",
    title: "Causative Verbs (प्रेरणार्थक क्रिया)",
    content: `# Causative Verbs — Double Causative System

Hindi has a unique double causative system:
- **करना** (to do) → **कराना** (to make someone do) → **करवाना** (to get something done through someone)
- **पढ़ना** (to read) → **पढ़ाना** (to teach) → **पढ़वाना** (to get someone taught)`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m2",
    moduleTitle: "Complex Sentences",
    order: 3,
    topicId: "hi-intermediate-causative",
    vocabulary: [
      { word: "कराना", translation: "to make someone do", pronunciation: "ka-RAA-naa", exampleSentence: "माँ ने बच्चे से काम कराया।", exampleTranslation: "Mother made the child do work.", partOfSpeech: "verb" },
      { word: "करवाना", translation: "to get something done (through someone)", pronunciation: "kar-VAA-naa", exampleSentence: "मैंने मकान बनवाया।", exampleTranslation: "I got a house built.", partOfSpeech: "verb" },
      { word: "पढ़ाना", translation: "to teach (make someone read)", pronunciation: "pa-DHAA-naa", exampleSentence: "वह बच्चों को पढ़ाती है।", exampleTranslation: "She teaches children.", partOfSpeech: "verb" },
      { word: "सुनाना", translation: "to narrate / make someone listen", pronunciation: "su-NAA-naa", exampleSentence: "दादी ने कहानी सुनाई।", exampleTranslation: "Grandmother narrated a story.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "First vs Second Causative",
        explanation: "First causative (-आना): you directly make someone do it. Second causative (-वाना): you get it done through an intermediary. Both take से for the person made to act.",
        examples: [
          { correct: "मैंने राम से काम कराया।", translation: "I made Ram do the work.", note: "First causative — direct" },
          { correct: "मैंने राम से काम करवाया।", translation: "I got the work done through Ram.", note: "Second causative — indirect" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "causative-errands",
        title: "Getting Things Done",
        situation: "Talking about household tasks and delegating work",
        agentRole: "You are a busy homeowner discussing how you get things done — repairs, cleaning, cooking. Use causative verbs naturally and ask the student how they handle household tasks.",
        userGoal: "Use causative verbs to describe delegating tasks",
        targetPhrases: ["बनवाना", "कराना", "करवाना", "से...कराया"],
        successCriteria: ["Uses at least 1 causative form correctly", "Understands the difference between first and second causative"],
      },
    ],
  },
];

// ============================================
// Module 3: Health & Emotions
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "hi-int-l7",
    slug: "health-body",
    title: "Health & Body Parts",
    content: `# Health — स्वास्थ्य

## Describing Pain
- मेरा सिर दर्द कर रहा है। (My head is hurting.)
- मुझे बुखार है। (I have a fever.) — Note: बुखार uses को/मुझे construction

## At the Doctor
- डॉक्टर साहब, मुझे दो दिन से बुखार है।
- कब से तकलीफ़ है?`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m3",
    moduleTitle: "Health & Emotions",
    order: 1,
    topicId: "hi-intermediate-health",
    vocabulary: [
      { word: "सिरदर्द", translation: "headache", pronunciation: "sir-DARD", exampleSentence: "मुझे सिरदर्द है।", exampleTranslation: "I have a headache.", partOfSpeech: "noun" },
      { word: "बुखार", translation: "fever", pronunciation: "bu-KHAAR", exampleSentence: "बच्चे को बुखार है।", exampleTranslation: "The child has a fever.", partOfSpeech: "noun" },
      { word: "दवाई", translation: "medicine", pronunciation: "da-VAA-ee", exampleSentence: "दवाई खाना मत भूलना।", exampleTranslation: "Don't forget to take your medicine.", partOfSpeech: "noun" },
      { word: "तकलीफ़", translation: "discomfort / trouble", pronunciation: "tak-LEEF", exampleSentence: "आपको क्या तकलीफ़ है?", exampleTranslation: "What is your complaint?", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Experiential को Constructions",
        explanation: "Hindi uses को (dative) for experiences like illness, hunger, and emotions. The experiencer takes को, not the subject position: मुझे भूख है (To-me hunger is = I am hungry).",
        examples: [
          { correct: "मुझे ठंड लग रही है।", translation: "I am feeling cold.", note: "Literally: To me cold is attaching" },
          { correct: "उसे बुखार था।", translation: "He/She had a fever." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "doctor-visit",
        title: "Visiting the Doctor",
        situation: "You are at a doctor's clinic describing your symptoms",
        agentRole: "You are Dr. Sharma. Ask the patient about their symptoms using formal Hindi (आप). Ask follow-up questions about duration and severity.",
        userGoal: "Describe your symptoms and answer the doctor's questions",
        targetPhrases: ["मुझे...है", "दर्द कर रहा है", "कब से", "दवाई"],
        successCriteria: ["Uses को construction for symptoms", "Communicates symptoms clearly"],
      },
    ],
  },
  {
    id: "hi-int-l8",
    slug: "emotions-opinions",
    title: "Emotions & Expressing Opinions",
    content: `# Emotions & Opinions

## Expressing Feelings
- मुझे अच्छा लगता है। (I like it / I feel good.)
- मुझे बुरा लगा। (I felt bad.)

## Giving Opinions
- मेरे ख़्याल से... (In my opinion...)
- मुझे लगता है कि... (I think that...)`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m3",
    moduleTitle: "Health & Emotions",
    order: 2,
    topicId: "hi-intermediate-emotions",
    vocabulary: [
      { word: "ख़ुशी", translation: "happiness", pronunciation: "KHU-shee", exampleSentence: "मुझे बहुत ख़ुशी हुई।", exampleTranslation: "I was very happy.", partOfSpeech: "noun" },
      { word: "ग़ुस्सा", translation: "anger", pronunciation: "GUS-saa", exampleSentence: "उसे ग़ुस्सा आ गया।", exampleTranslation: "He got angry.", partOfSpeech: "noun" },
      { word: "ख़्याल", translation: "thought / opinion", pronunciation: "KHYAAL", exampleSentence: "मेरे ख़्याल से यह सही है।", exampleTranslation: "In my opinion, this is correct.", partOfSpeech: "noun" },
      { word: "लगना", translation: "to feel / to seem", pronunciation: "LAG-naa", exampleSentence: "मुझे लगता है कि बारिश होगी।", exampleTranslation: "I think it will rain.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Complex Sentences with कि (that)",
        explanation: "कि introduces a subordinate clause, similar to English 'that'. The main clause comes first: मुझे लगता है कि... (I think that...).",
        examples: [
          { correct: "मुझे लगता है कि वह आएगा।", translation: "I think that he will come." },
          { correct: "उसने कहा कि वह नहीं जाएगी।", translation: "She said that she won't go." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "opinion-discussion",
        title: "Sharing Opinions",
        situation: "Discussing a movie with a friend",
        agentRole: "You just watched a Bollywood film with the student. Share your opinions and ask about theirs. Agree and disagree politely.",
        userGoal: "Express opinions about a movie using मुझे लगता है कि and मेरे ख़्याल से",
        targetPhrases: ["मुझे लगता है कि", "मेरे ख़्याल से", "मुझे अच्छा लगा", "मुझे बुरा लगा"],
        successCriteria: ["Expresses at least 2 opinions with कि clauses", "Uses emotion vocabulary naturally"],
      },
    ],
  },
  {
    id: "hi-int-l9",
    slug: "formal-communication",
    title: "Formal & Professional Communication",
    content: `# Formal Hindi — औपचारिक हिंदी

## Formal Expressions
- कृपया बैठिए। (Please sit down.)
- क्या मैं अंदर आ सकता/सकती हूँ? (May I come in?)
- आपसे एक निवेदन है। (I have a request for you.)

## Professional Vocabulary
- बैठक (meeting), दफ़्तर (office), तनख़्वाह (salary)`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m3",
    moduleTitle: "Health & Emotions",
    order: 3,
    topicId: "hi-intermediate-formal-communication",
    vocabulary: [
      { word: "निवेदन", translation: "request (formal)", pronunciation: "ni-VAY-dan", exampleSentence: "आपसे एक निवेदन है।", exampleTranslation: "I have a request for you.", partOfSpeech: "noun" },
      { word: "बैठक", translation: "meeting", pronunciation: "BAITH-ak", exampleSentence: "बैठक तीन बजे है।", exampleTranslation: "The meeting is at 3 o'clock.", partOfSpeech: "noun" },
      { word: "दफ़्तर", translation: "office", pronunciation: "DAF-tar", exampleSentence: "मैं दफ़्तर जा रहा हूँ।", exampleTranslation: "I am going to the office.", partOfSpeech: "noun" },
      { word: "तनख़्वाह", translation: "salary", pronunciation: "tan-KHWAH", exampleSentence: "तनख़्वाह महीने में एक बार आती है।", exampleTranslation: "Salary comes once a month.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Formal Hindi Register",
        explanation: "Formal Hindi uses आप form consistently, Sanskritic vocabulary over Urdu-origin words, and specific polite constructions like कृपया + imperative and -इए endings.",
        examples: [
          { correct: "कृपया यहाँ हस्ताक्षर कीजिए।", translation: "Please sign here." },
          { correct: "क्या आप मेरी सहायता कर सकते हैं?", translation: "Can you help me?" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "job-interview",
        title: "Job Interview",
        situation: "You are interviewing for a position at a Hindi-medium company",
        agentRole: "You are the interviewer at a company. Ask professional questions in formal Hindi: qualifications, experience, strengths. Use आप consistently.",
        userGoal: "Answer interview questions using formal Hindi register",
        targetPhrases: ["जी हाँ", "मेरा अनुभव", "कृपया", "आपसे निवेदन"],
        successCriteria: ["Uses आप register consistently", "Employs formal vocabulary"],
      },
    ],
  },
];

// ============================================
// Module 4: Work & Media
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "hi-int-l10",
    slug: "news-media",
    title: "News & Media Hindi",
    content: `# News Hindi — समाचार हिंदी

News Hindi uses a more Sanskritized register than everyday speech. Headlines often drop verbs.

## Common News Vocabulary
- समाचार (news), चुनाव (election), सरकार (government)
- प्रधानमंत्री (Prime Minister), विपक्ष (opposition)`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m4",
    moduleTitle: "Work & Media",
    order: 1,
    topicId: "hi-intermediate-news-media",
    vocabulary: [
      { word: "समाचार", translation: "news", pronunciation: "sa-maa-CHAAR", exampleSentence: "आज के समाचार क्या हैं?", exampleTranslation: "What is today's news?", partOfSpeech: "noun" },
      { word: "चुनाव", translation: "election", pronunciation: "chu-NAAV", exampleSentence: "अगले महीने चुनाव होंगे।", exampleTranslation: "Elections will happen next month.", partOfSpeech: "noun" },
      { word: "सरकार", translation: "government", pronunciation: "sar-KAAR", exampleSentence: "सरकार ने नई योजना शुरू की।", exampleTranslation: "The government started a new scheme.", partOfSpeech: "noun" },
      { word: "अर्थव्यवस्था", translation: "economy", pronunciation: "arth-vya-VAS-thaa", exampleSentence: "भारत की अर्थव्यवस्था बढ़ रही है।", exampleTranslation: "India's economy is growing.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Sanskritized vs Colloquial Hindi",
        explanation: "Formal/news Hindi uses Sanskrit-derived (Tatsama) words while everyday Hindi often uses Persian/Arabic-derived words. Example: सहायता (Sanskrit) vs मदद (Persian) both mean 'help'.",
        examples: [
          { correct: "प्रधानमंत्री ने भाषण दिया।", translation: "The Prime Minister gave a speech.", note: "News register" },
          { correct: "PM ने स्पीच दी।", translation: "The PM gave a speech.", note: "Colloquial/Hinglish" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "discuss-news",
        title: "Discussing Current Events",
        situation: "Discussing today's news headlines with a friend",
        agentRole: "You are a news-savvy friend who reads Hindi newspapers daily. Discuss recent events and ask the student their opinion on current affairs.",
        userGoal: "Discuss news topics using formal news vocabulary",
        targetPhrases: ["समाचार", "सरकार", "चुनाव", "मेरे ख़्याल से"],
        successCriteria: ["Uses news vocabulary", "Expresses opinions about current events"],
      },
    ],
  },
  {
    id: "hi-int-l11",
    slug: "social-media",
    title: "Social Media & Hinglish",
    content: `# Social Media Hindi & Hinglish

Modern Hindi speakers freely mix Hindi and English (Hinglish), especially online.

## Common Hinglish
- पोस्ट करना (to post), शेयर करना (to share)
- ट्रेंडिंग (trending), फ़ॉलो करना (to follow)`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m4",
    moduleTitle: "Work & Media",
    order: 2,
    topicId: "hi-intermediate-social-media",
    vocabulary: [
      { word: "पोस्ट करना", translation: "to post", pronunciation: "POST kar-naa", exampleSentence: "मैंने फ़ोटो पोस्ट की।", exampleTranslation: "I posted a photo.", partOfSpeech: "verb" },
      { word: "शेयर करना", translation: "to share", pronunciation: "SHARE kar-naa", exampleSentence: "यह वीडियो शेयर करो।", exampleTranslation: "Share this video.", partOfSpeech: "verb" },
      { word: "ट्रेंडिंग", translation: "trending", pronunciation: "TREN-ding", exampleSentence: "यह हैशटैग ट्रेंडिंग में है।", exampleTranslation: "This hashtag is trending.", partOfSpeech: "adjective" },
      { word: "ऑनलाइन", translation: "online", pronunciation: "ON-line", exampleSentence: "क्या तुम ऑनलाइन हो?", exampleTranslation: "Are you online?", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Code-Switching in Hinglish",
        explanation: "Hindi speakers often use English verbs with करना: post करना, like करना, share करना. The English word stays unchanged; करना conjugates normally for tense and agreement.",
        examples: [
          { correct: "मैंने उसे फ़ॉलो किया।", translation: "I followed him/her.", note: "किया agrees with implicit 'account' (masculine)" },
          { correct: "वह डिलीट कर दो।", translation: "Delete that.", note: "कर दो = compound imperative" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "social-media-chat",
        title: "Talking About Social Media",
        situation: "Chatting about social media habits",
        agentRole: "You are a young Hindi speaker who uses lots of Hinglish. Ask about the student's social media usage and discuss trending topics.",
        userGoal: "Have a natural conversation using Hinglish social media vocabulary",
        targetPhrases: ["पोस्ट करना", "शेयर करना", "ट्रेंडिंग", "फ़ॉलो"],
        successCriteria: ["Uses Hinglish terms naturally", "Maintains conversational flow"],
      },
    ],
  },
  {
    id: "hi-int-l12",
    slug: "travel-india",
    title: "Travel & Navigation in India",
    content: `# Traveling in India — भारत में यात्रा

## At the Train Station
- मुझे दिल्ली की टिकट चाहिए। (I need a ticket to Delhi.)
- ट्रेन कितने बजे है? (What time is the train?)

## Auto-Rickshaw Negotiation
- भाई, स्टेशन चलोगे? (Brother, will you go to the station?)
- कितना लोगे? (How much will you charge?)`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m4",
    moduleTitle: "Work & Media",
    order: 3,
    topicId: "hi-intermediate-travel",
    vocabulary: [
      { word: "टिकट", translation: "ticket", pronunciation: "TIK-at", exampleSentence: "दो टिकट दीजिए।", exampleTranslation: "Please give two tickets.", partOfSpeech: "noun" },
      { word: "प्लेटफ़ॉर्म", translation: "platform", pronunciation: "PLAT-form", exampleSentence: "ट्रेन प्लेटफ़ॉर्म नंबर तीन पर है।", exampleTranslation: "The train is on platform number 3.", partOfSpeech: "noun" },
      { word: "ऑटो", translation: "auto-rickshaw", pronunciation: "AU-to", exampleSentence: "ऑटो से चलते हैं।", exampleTranslation: "Let's go by auto.", partOfSpeech: "noun" },
      { word: "किराया", translation: "fare / rent", pronunciation: "ki-RAA-yaa", exampleSentence: "किराया कितना है?", exampleTranslation: "What is the fare?", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Negotiation Hindi",
        explanation: "Informal negotiation uses तुम/तू forms and direct speech. Use भाई (brother) or दीदी (sister) as casual address. The future tense is often used as a question: चलोगे? (Will you go? = Will you take me?)",
        examples: [
          { correct: "भाई, मॉल चलोगे?", translation: "Brother, will you go to the mall?" },
          { correct: "सौ रुपये बहुत ज़्यादा है, पचास में चलो।", translation: "100 rupees is too much, let's go for 50." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "auto-negotiation",
        title: "Negotiating with an Auto Driver",
        situation: "You need to get to a market and are negotiating with an auto-rickshaw driver",
        agentRole: "You are an auto-rickshaw driver in Delhi. Quote high prices initially, then negotiate. Use informal Hindi with भाई/बहनजी.",
        userGoal: "Negotiate a fair fare using informal Hindi",
        targetPhrases: ["कितना लोगे", "बहुत ज़्यादा है", "चलो ना", "ठीक है"],
        successCriteria: ["Negotiates effectively", "Uses informal register appropriately"],
      },
    ],
  },
];

// ============================================
// Module 5: Travel & Navigation
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "hi-int-l13",
    slug: "hotel-stay",
    title: "At the Hotel",
    content: `# Hotel Stay — होटल में ठहरना

## Check-in
- मेरा रिज़र्वेशन है। (I have a reservation.)
- एक कमरा चाहिए। (I need a room.)
- AC कमरा कितने का है? (How much is an AC room?)`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m5",
    moduleTitle: "Travel & Navigation",
    order: 1,
    topicId: "hi-intermediate-hotel",
    vocabulary: [
      { word: "कमरा", translation: "room", pronunciation: "KAM-raa", exampleSentence: "एक कमरा दिखाइए।", exampleTranslation: "Please show me a room.", partOfSpeech: "noun" },
      { word: "रिज़र्वेशन", translation: "reservation", pronunciation: "ri-zar-VAY-shun", exampleSentence: "मेरा रिज़र्वेशन है।", exampleTranslation: "I have a reservation.", partOfSpeech: "noun" },
      { word: "चेक-आउट", translation: "check-out", pronunciation: "CHECK-out", exampleSentence: "चेक-आउट कितने बजे है?", exampleTranslation: "What time is check-out?", partOfSpeech: "noun" },
      { word: "सामान", translation: "luggage / belongings", pronunciation: "saa-MAAN", exampleSentence: "मेरा सामान कमरे में रख दीजिए।", exampleTranslation: "Please put my luggage in the room.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Polite Requests with -इए",
        explanation: "The -इए ending creates formal imperative: दिखाइए (please show), बताइए (please tell), लाइए (please bring). More polite than -ो (तुम) or plain stem (तू).",
        examples: [
          { correct: "कृपया बिल बनाइए।", translation: "Please prepare the bill." },
          { correct: "एक गिलास पानी लाइए।", translation: "Please bring a glass of water." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "hotel-checkin",
        title: "Hotel Check-in",
        situation: "Checking into a hotel in Jaipur",
        agentRole: "You are the hotel receptionist. Ask for the guest's name, show room options, discuss amenities and prices. Use formal Hindi.",
        userGoal: "Complete a hotel check-in conversation in Hindi",
        targetPhrases: ["कमरा चाहिए", "कितने का है", "रिज़र्वेशन", "चेक-आउट"],
        successCriteria: ["Completes check-in successfully", "Uses polite request forms"],
      },
    ],
  },
  {
    id: "hi-int-l14",
    slug: "regional-awareness",
    title: "Regional Hindi Awareness",
    content: `# Regional Variation in Hindi

Hindi varies significantly across regions:
- **दिल्ली Hindi**: Standard, mixes with Punjabi influence
- **मुंबई Hindi**: Bombay Hindi / Bambaiya, influenced by Marathi
- **लखनऊ Hindi**: More Urdu-influenced, considered very polite
- **बिहार/UP Hindi**: Bhojpuri and Awadhi influence`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m5",
    moduleTitle: "Travel & Navigation",
    order: 2,
    topicId: "hi-intermediate-regional",
    vocabulary: [
      { word: "बोली", translation: "dialect / speech", pronunciation: "BO-lee", exampleSentence: "हर जगह की बोली अलग है।", exampleTranslation: "Every place's dialect is different.", partOfSpeech: "noun" },
      { word: "लहजा", translation: "accent / tone", pronunciation: "LAH-jaa", exampleSentence: "उसका लहजा लखनऊ का है।", exampleTranslation: "His accent is from Lucknow.", partOfSpeech: "noun" },
      { word: "मतलब", translation: "meaning", pronunciation: "MAT-lab", exampleSentence: "इसका क्या मतलब है?", exampleTranslation: "What does this mean?", partOfSpeech: "noun" },
      { word: "समझना", translation: "to understand", pronunciation: "SAMAJH-naa", exampleSentence: "क्या तुम समझ रहे हो?", exampleTranslation: "Are you understanding?", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "Understanding Regional Variations",
        explanation: "Mumbai Hindi often uses 'apun' instead of 'main', adds 'na/re/be' as filler words. Lucknow Hindi is known for elaborate politeness using 'janab', 'huzoor'. Being aware of these helps comprehension across India.",
        examples: [
          { correct: "अपुन को जाना है, भिडू।", translation: "I have to go, bro. (Mumbai Hindi)" },
          { correct: "जनाब, तशरीफ़ रखिए।", translation: "Sir, please have a seat. (Lucknow Hindi)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "dialect-exposure",
        title: "Understanding Different Hindi Speakers",
        situation: "Meeting people from different parts of India",
        agentRole: "You are from Mumbai and naturally use some Bambaiya Hindi. Introduce yourself and chat, occasionally using Mumbai-style expressions. Help the student understand regional differences.",
        userGoal: "Understand regional Hindi variations and ask for clarification when needed",
        targetPhrases: ["मतलब क्या है", "समझ नहीं आया", "फिर से बोलिए"],
        successCriteria: ["Asks for clarification politely", "Shows awareness of regional variation"],
      },
    ],
  },
  {
    id: "hi-int-l15",
    slug: "festivals-culture",
    title: "Indian Festivals & Celebrations",
    content: `# Festivals — त्योहार

India's festivals reflect its diversity:
- **दीवाली** — Festival of lights (October/November)
- **होली** — Festival of colors (March)
- **ईद** — Celebrated by Muslims
- **दशहरा** — Victory of good over evil`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m5",
    moduleTitle: "Travel & Navigation",
    order: 3,
    topicId: "hi-intermediate-festivals",
    vocabulary: [
      { word: "त्योहार", translation: "festival", pronunciation: "tyo-HAAR", exampleSentence: "भारत में बहुत त्योहार हैं।", exampleTranslation: "There are many festivals in India.", partOfSpeech: "noun" },
      { word: "दीवाली", translation: "Diwali (festival of lights)", pronunciation: "dee-VAA-lee", exampleSentence: "दीवाली पर हम दीये जलाते हैं।", exampleTranslation: "On Diwali we light lamps.", partOfSpeech: "noun" },
      { word: "मिठाई", translation: "sweets", pronunciation: "mi-THAA-ee", exampleSentence: "त्योहार पर मिठाई बाँटते हैं।", exampleTranslation: "We distribute sweets on festivals.", partOfSpeech: "noun" },
      { word: "शुभकामनाएँ", translation: "best wishes / congratulations", pronunciation: "shubh-kaa-ma-NAA-en", exampleSentence: "दीवाली की शुभकामनाएँ!", exampleTranslation: "Happy Diwali wishes!", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Habitual Actions with Festivals",
        explanation: "When describing festival traditions, use the habitual present: हम दीवाली पर दीये जलाते हैं (We light lamps on Diwali). Use पर for 'on' with festivals.",
        examples: [
          { correct: "होली पर लोग रंग खेलते हैं।", translation: "People play with colors on Holi." },
          { correct: "ईद पर हम सेवइयाँ खाते हैं।", translation: "We eat vermicelli on Eid." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "festival-chat",
        title: "Talking About Festivals",
        situation: "Your Indian friend is inviting you to celebrate Diwali",
        agentRole: "You are Meera, inviting the student to your Diwali celebration. Explain the traditions, food, and customs. Ask about festivals in their culture.",
        userGoal: "Discuss Indian festivals and compare with your own cultural celebrations",
        targetPhrases: ["त्योहार", "शुभकामनाएँ", "मनाना", "परंपरा"],
        successCriteria: ["Shows understanding of festival customs", "Shares about own cultural festivals"],
      },
    ],
  },
];

// ============================================
// Module 6: Culture & Festivals
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "hi-int-l16",
    slug: "bollywood-entertainment",
    title: "Bollywood & Entertainment",
    content: `# Bollywood — बॉलीवुड

Bollywood is the world's largest film industry by number of films produced.

## Vocabulary
- फ़िल्म (film), गाना (song), नाचना (to dance)
- अभिनेता (actor), अभिनेत्री (actress), निर्देशक (director)`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m6",
    moduleTitle: "Culture & Festivals",
    order: 1,
    topicId: "hi-intermediate-bollywood",
    vocabulary: [
      { word: "फ़िल्म", translation: "film / movie", pronunciation: "FILM", exampleSentence: "यह फ़िल्म बहुत अच्छी है।", exampleTranslation: "This movie is very good.", partOfSpeech: "noun" },
      { word: "गाना", translation: "song / to sing", pronunciation: "GAA-naa", exampleSentence: "इस फ़िल्म के गाने मशहूर हैं।", exampleTranslation: "The songs of this film are famous.", partOfSpeech: "noun/verb" },
      { word: "अभिनेता", translation: "actor (male)", pronunciation: "abhi-NAY-taa", exampleSentence: "शाहरुख़ ख़ान एक मशहूर अभिनेता हैं।", exampleTranslation: "Shah Rukh Khan is a famous actor.", partOfSpeech: "noun" },
      { word: "पसंद आना", translation: "to like (something appeals to you)", pronunciation: "pa-SAND AA-naa", exampleSentence: "मुझे यह फ़िल्म बहुत पसंद आई।", exampleTranslation: "I liked this movie very much.", partOfSpeech: "verb" },
    ],
    grammarPoints: [
      {
        title: "पसंद आना vs अच्छा लगना",
        explanation: "Both mean 'to like' but पसंद आना is stronger (you approve/choose it) while अच्छा लगना is lighter (it pleases you). Both use को/मुझे pattern.",
        examples: [
          { correct: "मुझे यह गाना पसंद आया।", translation: "I liked this song. (actively)" },
          { correct: "मुझे यह गाना अच्छा लगा।", translation: "I liked this song. (it pleased me)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "movie-recommendation",
        title: "Recommending Movies",
        situation: "Recommending Bollywood films to each other",
        agentRole: "You are a Bollywood fan. Recommend your favorite films and ask the student about theirs. Discuss actors, songs, and storylines.",
        userGoal: "Discuss Bollywood films and express preferences",
        targetPhrases: ["पसंद आना", "मशहूर", "गाना", "फ़िल्म"],
        successCriteria: ["Expresses film preferences", "Uses entertainment vocabulary"],
      },
    ],
  },
  {
    id: "hi-int-l17",
    slug: "indian-food-culture",
    title: "Indian Food Culture",
    content: `# Indian Food — भारतीय खाना

## Regional Cuisines
- **उत्तर भारत**: रोटी, दाल, पनीर, बिरयानी
- **दक्षिण भारत**: डोसा, इडली, सांभर, रसम
- **पश्चिम भारत**: ढोकला, वड़ा पाव, थेपला
- **पूर्व भारत**: मछली, रसगुल्ला, मोमो`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m6",
    moduleTitle: "Culture & Festivals",
    order: 2,
    topicId: "hi-intermediate-food-culture",
    vocabulary: [
      { word: "शाकाहारी", translation: "vegetarian", pronunciation: "shaa-kaa-HAA-ree", exampleSentence: "मैं शाकाहारी हूँ।", exampleTranslation: "I am vegetarian.", partOfSpeech: "adjective" },
      { word: "मसालेदार", translation: "spicy", pronunciation: "ma-saa-lay-DAAR", exampleSentence: "यह सब्ज़ी बहुत मसालेदार है।", exampleTranslation: "This vegetable dish is very spicy.", partOfSpeech: "adjective" },
      { word: "बनाना", translation: "to make / to cook", pronunciation: "ba-NAA-naa", exampleSentence: "माँ ने बिरयानी बनाई।", exampleTranslation: "Mom made biryani.", partOfSpeech: "verb" },
      { word: "स्वाद", translation: "taste / flavor", pronunciation: "swaad", exampleSentence: "इसका स्वाद बहुत अच्छा है।", exampleTranslation: "Its taste is very good.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Food-Related Expressions",
        explanation: "Hindi uses specific verbs for eating/drinking: रोटी खाना (eat bread), चाय पीना (drink tea), दवाई खाना (eat/take medicine — not drink). भूख लगना (hunger strikes = to be hungry) uses को pattern.",
        examples: [
          { correct: "मुझे बहुत भूख लगी है।", translation: "I am very hungry. (Hunger has struck me)" },
          { correct: "खाना बहुत स्वादिष्ट बना है।", translation: "The food has turned out very delicious." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "food-discussion",
        title: "Talking About Indian Food",
        situation: "Discussing favorite Indian dishes and regional cuisines",
        agentRole: "You are a food enthusiast from India. Talk about your favorite regional dishes, ask the student what Indian food they've tried, and recommend dishes.",
        userGoal: "Discuss Indian food and express taste preferences",
        targetPhrases: ["स्वाद", "मसालेदार", "शाकाहारी", "बनाना"],
        successCriteria: ["Uses food vocabulary", "Expresses preferences about Indian food"],
      },
    ],
  },
  {
    id: "hi-int-l18",
    slug: "wedding-customs",
    title: "Indian Weddings & Customs",
    content: `# Indian Weddings — भारतीय शादी

Indian weddings are elaborate multi-day celebrations:
- **मेहंदी** — Henna ceremony
- **संगीत** — Music and dance night
- **बारात** — Groom's procession
- **फेरे** — Circling the sacred fire (7 rounds)
- **विदाई** — Bride's farewell`,
    targetLanguage: "hi",
    proficiencyLevel: "B1",
    moduleId: "hi-int-m6",
    moduleTitle: "Culture & Festivals",
    order: 3,
    topicId: "hi-intermediate-weddings",
    vocabulary: [
      { word: "शादी", translation: "wedding / marriage", pronunciation: "SHAA-dee", exampleSentence: "मेरे भाई की शादी है।", exampleTranslation: "It's my brother's wedding.", partOfSpeech: "noun" },
      { word: "दुल्हन", translation: "bride", pronunciation: "DUL-han", exampleSentence: "दुल्हन बहुत सुंदर लग रही है।", exampleTranslation: "The bride is looking very beautiful.", partOfSpeech: "noun" },
      { word: "बधाई", translation: "congratulations", pronunciation: "ba-DHAA-ee", exampleSentence: "शादी की बधाई हो!", exampleTranslation: "Congratulations on the wedding!", partOfSpeech: "noun" },
      { word: "रस्म", translation: "ritual / ceremony", pronunciation: "RASM", exampleSentence: "सब रस्में पूरी हो गईं।", exampleTranslation: "All the rituals are completed.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Describing Events and Sequences",
        explanation: "Use पहले...फिर...उसके बाद (first...then...after that) for narrating sequences. For ongoing events use रहा/रही + है: शादी की तैयारियाँ चल रही हैं (Wedding preparations are ongoing).",
        examples: [
          { correct: "पहले मेहंदी होती है, फिर संगीत, उसके बाद शादी।", translation: "First henna, then music night, after that the wedding." },
          { correct: "शादी में बहुत मज़ा आया।", translation: "The wedding was a lot of fun." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "wedding-invitation",
        title: "Invited to an Indian Wedding",
        situation: "Your Indian friend is inviting you to their sibling's wedding",
        agentRole: "You are Ananya, excitedly inviting the student to your sister's wedding. Explain each ceremony, what to wear, and what gifts to bring.",
        userGoal: "Ask questions about wedding customs and respond to the invitation",
        targetPhrases: ["शादी", "बधाई", "रस्म", "कब है"],
        successCriteria: ["Asks relevant questions about customs", "Responds appropriately to invitation"],
      },
    ],
  },
];

// ============================================
// Assemble Course
// ============================================

const modules: LanguageModule[] = [
  {
    id: "hi-int-m1",
    title: "Compound & Perfect Verbs",
    description: "Master compound verbs, perfect tenses, and the subjunctive mood",
    order: 1,
    lessons: module1Lessons,
  },
  {
    id: "hi-int-m2",
    title: "Complex Sentences",
    description: "Build complex sentences with relative-correlative constructions, passive voice, and causative verbs",
    order: 2,
    lessons: module2Lessons,
  },
  {
    id: "hi-int-m3",
    title: "Health & Emotions",
    description: "Discuss health, emotions, and professional communication",
    order: 3,
    lessons: module3Lessons,
  },
  {
    id: "hi-int-m4",
    title: "Work & Media",
    description: "Navigate news media, social media, and travel in India",
    order: 4,
    lessons: module4Lessons,
  },
  {
    id: "hi-int-m5",
    title: "Travel & Navigation",
    description: "Handle hotels, regional dialects, and festival celebrations",
    order: 5,
    lessons: module5Lessons,
  },
  {
    id: "hi-int-m6",
    title: "Culture & Festivals",
    description: "Explore Bollywood, Indian food culture, and wedding customs",
    order: 6,
    lessons: module6Lessons,
  },
];

export const hindiIntermediateCourse: LanguageCourse = {
  ...courseInfo,
  modules,
};

export function getHindiIntermediateLessons() {
  return modules.flatMap((m) => m.lessons);
}

export function findHindiIntermediateLesson(slug: string) {
  return getHindiIntermediateLessons().find((l) => l.slug === slug);
}
