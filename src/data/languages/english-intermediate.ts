// English Intermediate (B1) Course Data
// CEFR B1 Level - ESL for Non-Native Speakers

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "english-intermediate",
  slug: "english-intermediate",
  title: "English Intermediate - B1",
  language: "en",
  languageName: "English",
  proficiencyLevel: "B1" as const,
  description: "Build confidence in everyday English. Master present perfect, conditionals, passive voice, and phrasal verbs. Handle work, travel, media, and social situations with ease.",
  targetAudience: "Non-native English speakers with elementary (A2) proficiency looking to reach intermediate level",
  estimatedHours: 80,
  icon: "\u{1F1EC}\u{1F1E7}",
  prerequisiteCourseSlug: "english-beginner",
  nextCourseSlug: "english-advanced",
};

// ============================================
// Module 1: Life Stories
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "en-int-l1",
    slug: "present-perfect-experiences",
    title: "Talking About Experiences",
    content: `# Talking About Experiences

The present perfect tense lets you talk about life experiences without specifying exactly when they happened.

## Structure

**have/has + past participle**

- I **have visited** Paris three times.
- She **has never tried** sushi.
- **Have** you ever **ridden** a horse?

## Key Words

- **ever** — used in questions: *Have you ever...?*
- **never** — negative experience: *I have never...*
- **already** — sooner than expected: *I have already finished.*
- **yet** — in negatives/questions: *I haven't finished yet.*

## Present Perfect vs. Past Simple

Use present perfect for *unspecified* time. Use past simple when the time *is* stated.

- I **have been** to London. *(when doesn't matter)*
- I **went** to London **last year**. *(specific time)*`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m1",
    moduleTitle: "Life Stories",
    order: 1,
    topicId: "en-intermediate-present-perfect-experiences",
    vocabulary: [
      {
        word: "experience",
        translation: "an event or occurrence that affects you",
        pronunciation: "/\u026Ak\u02C8sp\u026A\u0259r.i.\u0259ns/",
        exampleSentence: "Travelling alone was an amazing experience.",
        exampleTranslation: "Travelling alone was an amazing experience.",
        partOfSpeech: "noun",
      },
      {
        word: "achieve",
        translation: "to succeed in reaching a goal",
        pronunciation: "/\u0259\u02C8t\u0283i\u02D0v/",
        exampleSentence: "She has achieved all of her goals this year.",
        exampleTranslation: "She has achieved all of her goals this year.",
        partOfSpeech: "verb",
      },
      {
        word: "abroad",
        translation: "in or to a foreign country",
        pronunciation: "/\u0259\u02C8br\u0254\u02D0d/",
        exampleSentence: "Have you ever lived abroad?",
        exampleTranslation: "Have you ever lived abroad?",
        partOfSpeech: "adverb",
      },
      {
        word: "opportunity",
        translation: "a favourable time or situation",
        pronunciation: "/\u02CC\u0252p.\u0259\u02C8tju\u02D0.n\u0259.ti/",
        exampleSentence: "I haven't had the opportunity to visit Japan yet.",
        exampleTranslation: "I haven't had the opportunity to visit Japan yet.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Present Perfect with Ever / Never",
        explanation: "Use **have/has + past participle** to talk about life experiences up to now. Use *ever* in questions and *never* for things you have not done.",
        examples: [
          { correct: "Have you ever eaten snails?", translation: "Have you ever eaten snails?", note: "'Ever' goes between 'have/has' and the past participle." },
          { correct: "I have never broken a bone.", translation: "I have never broken a bone.", note: "'Never' replaces 'not ever'." },
        ],
        commonMistakes: [
          {
            incorrect: "Did you ever eat snails?",
            correction: "Have you ever eaten snails?",
            explanation: "For life experiences (no specific time), use present perfect, not past simple.",
          },
          {
            incorrect: "I have went to Paris.",
            correction: "I have gone to Paris.",
            explanation: "'Went' is the past simple form. The past participle is 'gone'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "life-experiences-chat",
        title: "Sharing Life Experiences",
        situation: "You meet someone at an international meetup and swap travel and life stories.",
        agentRole: "You are Priya, an enthusiastic traveller from India. Ask the student about their life experiences using 'Have you ever...?' questions and share yours.",
        userGoal: "Talk about at least three life experiences using the present perfect",
        targetPhrases: ["I have visited...", "I have never...", "Have you ever...?", "I haven't... yet"],
        successCriteria: ["Uses present perfect correctly", "Uses ever/never/yet", "Maintains natural conversation flow"],
        hints: ["Try starting with 'Have you ever travelled to...?'", "Use 'I have never...' to talk about things on your bucket list"],
      },
    ],
  },
  {
    id: "en-int-l2",
    slug: "present-perfect-for-since",
    title: "For & Since — Duration",
    content: `# For & Since — Duration

Use the present perfect with **for** and **since** to talk about situations that started in the past and continue now.

## For vs. Since

| Word | Used with | Example |
|------|-----------|---------|
| **for** | a *period* of time | for three years, for a long time |
| **since** | a *point* in time | since 2019, since Monday, since I was a child |

## Examples

- I **have lived** here **for** five years.
- She **has worked** at the company **since** 2020.
- We **have been** friends **since** primary school.
- He **has studied** English **for** six months.

## Common Question Forms

- **How long have you lived here?**
- **How long has she worked there?**`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m1",
    moduleTitle: "Life Stories",
    order: 2,
    topicId: "en-intermediate-present-perfect-for-since",
    vocabulary: [
      {
        word: "duration",
        translation: "the length of time something lasts",
        pronunciation: "/dj\u028A\u02C8re\u026A.\u0283\u0259n/",
        exampleSentence: "What is the duration of the course?",
        exampleTranslation: "What is the duration of the course?",
        partOfSpeech: "noun",
      },
      {
        word: "decade",
        translation: "a period of ten years",
        pronunciation: "/\u02C8dek.e\u026Ad/",
        exampleSentence: "They have been married for over a decade.",
        exampleTranslation: "They have been married for over a decade.",
        partOfSpeech: "noun",
      },
      {
        word: "recently",
        translation: "not long ago",
        pronunciation: "/\u02C8ri\u02D0.s\u0259nt.li/",
        exampleSentence: "I have recently started a new job.",
        exampleTranslation: "I have recently started a new job.",
        partOfSpeech: "adverb",
      },
      {
        word: "currently",
        translation: "at the present time",
        pronunciation: "/\u02C8k\u028C.r\u0259nt.li/",
        exampleSentence: "She is currently living in Berlin.",
        exampleTranslation: "She is currently living in Berlin.",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "For vs. Since",
        explanation: "Use **for** with a *duration* (a period of time). Use **since** with a *starting point* (a specific moment).",
        examples: [
          { correct: "I have known her for ten years.", translation: "I have known her for ten years.", note: "'Ten years' is a duration." },
          { correct: "I have known her since 2015.", translation: "I have known her since 2015.", note: "'2015' is a specific point in time." },
        ],
        commonMistakes: [
          {
            incorrect: "I have lived here since three years.",
            correction: "I have lived here for three years.",
            explanation: "'Three years' is a duration, so use 'for', not 'since'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "catching-up-old-friend",
        title: "Catching Up with a Friend",
        situation: "You run into a friend you haven't seen in years and talk about what has changed.",
        agentRole: "You are Sam, an old school friend. Ask how long the student has been doing various things (living somewhere, working, studying).",
        userGoal: "Describe your current life situation using 'for' and 'since' correctly",
        targetPhrases: ["I have lived... for...", "I have worked... since...", "How long have you...?"],
        successCriteria: ["Distinguishes for/since correctly", "Answers 'How long' questions", "Asks follow-up questions"],
      },
    ],
  },
  {
    id: "en-int-l3",
    slug: "past-continuous-life-events",
    title: "Life Events & Past Continuous",
    content: `# Life Events & Past Continuous

Use the past continuous to set the scene for important life events.

## Structure

**was/were + verb-ing**

- I **was walking** home when I met my future wife.
- They **were living** in Tokyo when the earthquake happened.

## Past Continuous + Past Simple

Use past continuous for the *background action* and past simple for the *interrupting event*.

- I **was studying** when my phone **rang**.
- She **was cooking** dinner when the guests **arrived**.

## Life Milestones Vocabulary

- graduate, get married, move abroad, get promoted, retire, have a baby`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m1",
    moduleTitle: "Life Stories",
    order: 3,
    topicId: "en-intermediate-past-continuous-life-events",
    vocabulary: [
      {
        word: "graduate",
        translation: "to complete a degree or course of study",
        pronunciation: "/\u02C8\u0261r\u00E6d\u0292.u.e\u026At/",
        exampleSentence: "I graduated from university in 2018.",
        exampleTranslation: "I graduated from university in 2018.",
        partOfSpeech: "verb",
      },
      {
        word: "milestone",
        translation: "an important event in a person's life",
        pronunciation: "/\u02C8ma\u026Al.st\u0259\u028An/",
        exampleSentence: "Getting my first job was a real milestone.",
        exampleTranslation: "Getting my first job was a real milestone.",
        partOfSpeech: "noun",
      },
      {
        word: "promoted",
        translation: "given a higher position at work",
        pronunciation: "/pr\u0259\u02C8m\u0259\u028A.t\u026Ad/",
        exampleSentence: "She was promoted to manager last month.",
        exampleTranslation: "She was promoted to manager last month.",
        partOfSpeech: "adjective",
      },
      {
        word: "retire",
        translation: "to stop working, usually because of age",
        pronunciation: "/r\u026A\u02C8ta\u026A.\u0259r/",
        exampleSentence: "My father retired when he was sixty-five.",
        exampleTranslation: "My father retired when he was sixty-five.",
        partOfSpeech: "verb",
      },
      {
        word: "meanwhile",
        translation: "at the same time",
        pronunciation: "/\u02C8mi\u02D0n.wa\u026Al/",
        exampleSentence: "I was working in London. Meanwhile, my brother was travelling the world.",
        exampleTranslation: "I was working in London. Meanwhile, my brother was travelling the world.",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "Past Continuous for Background Actions",
        explanation: "Use **was/were + -ing** for a longer action in progress. Use **past simple** for the shorter action that interrupted it.",
        examples: [
          { correct: "I was living in Spain when I met my wife.", translation: "I was living in Spain when I met my wife.", note: "Living = long background. Met = short interrupting event." },
          { correct: "While they were travelling, they lost their passports.", translation: "While they were travelling, they lost their passports." },
        ],
        commonMistakes: [
          {
            incorrect: "I was meeting my wife when I lived in Spain.",
            correction: "I was living in Spain when I met my wife.",
            explanation: "'Meeting' was the short event, 'living' was the ongoing background — don't swap them.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "telling-life-story",
        title: "My Life Story",
        situation: "You are being interviewed for a podcast about interesting life stories.",
        agentRole: "You are Alex, a podcast host. Ask the student about key moments in their life — what were they doing when important things happened?",
        userGoal: "Tell the story of at least two life events using past continuous and past simple together",
        targetPhrases: ["I was ...ing when...", "While I was...", "At that time I was..."],
        successCriteria: ["Uses past continuous for background", "Uses past simple for events", "Tells a coherent story"],
      },
    ],
    culturalNotes: [
      {
        title: "Small Talk About Life Events",
        content: "In English-speaking cultures, it is common to ask about someone's job, family, or where they live as small talk. However, asking about salary, age, or weight is generally considered rude unless you know the person well.",
      },
    ],
  },
];

// ============================================
// Module 2: Work & Career
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "en-int-l4",
    slug: "workplace-vocabulary",
    title: "Workplace Vocabulary & Small Talk",
    content: `# Workplace Vocabulary & Small Talk

Navigate the modern workplace in English with confidence.

## Key Workplace Words

- **colleague** — someone you work with
- **deadline** — the latest time something must be finished
- **meeting** — a scheduled discussion with coworkers
- **salary** — the money you earn from your job
- **shift** — a set period of working time
- **overtime** — extra hours beyond normal working time

## Office Small Talk

- *How was your weekend?*
- *Have you been busy lately?*
- *Did you see the game last night?*
- *Any plans for the holidays?*

## Talking About Your Job

- I **work for** (a company)...
- I **work in** (a field/department)...
- I **work as** (a job title)...
- I'm **in charge of** (responsibility)...`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m2",
    moduleTitle: "Work & Career",
    order: 4,
    topicId: "en-intermediate-workplace-vocabulary",
    vocabulary: [
      {
        word: "colleague",
        translation: "a person you work with",
        pronunciation: "/\u02C8k\u0252l.i\u02D0\u0261/",
        exampleSentence: "My colleague helped me finish the report.",
        exampleTranslation: "My colleague helped me finish the report.",
        partOfSpeech: "noun",
      },
      {
        word: "deadline",
        translation: "the latest time by which something must be completed",
        pronunciation: "/\u02C8ded.la\u026An/",
        exampleSentence: "The deadline for the project is next Friday.",
        exampleTranslation: "The deadline for the project is next Friday.",
        partOfSpeech: "noun",
      },
      {
        word: "in charge of",
        translation: "responsible for",
        pronunciation: "/\u026An t\u0283\u0251\u02D0rd\u0292 \u0252v/",
        exampleSentence: "She is in charge of the marketing department.",
        exampleTranslation: "She is in charge of the marketing department.",
        partOfSpeech: "phrase",
      },
      {
        word: "overtime",
        translation: "time worked beyond normal hours",
        pronunciation: "/\u02C8\u0259\u028A.v\u0259.ta\u026Am/",
        exampleSentence: "I have been working overtime this week.",
        exampleTranslation: "I have been working overtime this week.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Work for / Work in / Work as",
        explanation: "Use **work for** + company, **work in** + field or department, **work as** + job title.",
        examples: [
          { correct: "I work for Google.", translation: "I work for Google." },
          { correct: "I work in finance.", translation: "I work in finance." },
          { correct: "I work as a software engineer.", translation: "I work as a software engineer." },
        ],
        commonMistakes: [
          {
            incorrect: "I work like a teacher.",
            correction: "I work as a teacher.",
            explanation: "Use 'as' (not 'like') before job titles.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "first-day-office",
        title: "First Day at the Office",
        situation: "It is your first day at a new company and you are meeting colleagues.",
        agentRole: "You are Jordan, a friendly team lead. Welcome the new employee, show them around, and make small talk about their background.",
        userGoal: "Introduce yourself, describe your previous work, and ask about the team",
        targetPhrases: ["I work as...", "I used to work for...", "I'm in charge of...", "How long have you worked here?"],
        successCriteria: ["Introduces professional background", "Uses work vocabulary correctly", "Engages in small talk"],
      },
    ],
  },
  {
    id: "en-int-l5",
    slug: "job-interviews",
    title: "Job Interviews",
    content: `# Job Interviews

Prepare for common interview questions and learn how to answer them well.

## Common Interview Questions

1. **Tell me about yourself.**
2. **What are your strengths and weaknesses?**
3. **Why do you want to work here?**
4. **Where do you see yourself in five years?**
5. **Can you give an example of a challenge you overcame?**

## Useful Structures

- I'm **passionate about**...
- I have **experience in**...
- One of my **strengths** is...
- I'm looking for **an opportunity to**...

## Tips

- Use the **STAR method**: Situation, Task, Action, Result
- Keep answers to 1-2 minutes
- Ask questions at the end`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m2",
    moduleTitle: "Work & Career",
    order: 5,
    topicId: "en-intermediate-job-interviews",
    vocabulary: [
      {
        word: "strength",
        translation: "a good quality or ability",
        pronunciation: "/stre\u014B\u03B8/",
        exampleSentence: "My greatest strength is problem-solving.",
        exampleTranslation: "My greatest strength is problem-solving.",
        partOfSpeech: "noun",
      },
      {
        word: "weakness",
        translation: "an area where you are not strong",
        pronunciation: "/\u02C8wi\u02D0k.n\u0259s/",
        exampleSentence: "I sometimes struggle with public speaking, but I'm working on it.",
        exampleTranslation: "I sometimes struggle with public speaking, but I'm working on it.",
        partOfSpeech: "noun",
      },
      {
        word: "passionate",
        translation: "having strong feelings or enthusiasm",
        pronunciation: "/\u02C8p\u00E6\u0283.\u0259n.\u0259t/",
        exampleSentence: "I am passionate about sustainable design.",
        exampleTranslation: "I am passionate about sustainable design.",
        partOfSpeech: "adjective",
      },
      {
        word: "challenge",
        translation: "a difficult task or situation",
        pronunciation: "/\u02C8t\u0283\u00E6l.\u026And\u0292/",
        exampleSentence: "Describe a challenge you faced at work.",
        exampleTranslation: "Describe a challenge you faced at work.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Gerunds vs. Infinitives After Verbs",
        explanation: "Some verbs are followed by **-ing** (gerund), others by **to + verb** (infinitive). Some accept both.",
        examples: [
          { correct: "I enjoy working in a team.", translation: "I enjoy working in a team.", note: "'Enjoy' is always followed by -ing." },
          { correct: "I want to improve my skills.", translation: "I want to improve my skills.", note: "'Want' is always followed by 'to + verb'." },
          { correct: "I like working / I like to work in tech.", translation: "I like working / I like to work in tech.", note: "'Like' can take either form." },
        ],
        commonMistakes: [
          {
            incorrect: "I enjoy to work in a team.",
            correction: "I enjoy working in a team.",
            explanation: "'Enjoy' must be followed by the -ing form, not the infinitive.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "mock-interview",
        title: "Mock Job Interview",
        situation: "You are practising for an upcoming job interview.",
        agentRole: "You are Ms. Chen, a hiring manager at a technology company. Conduct a professional but friendly interview. Ask about the candidate's experience, strengths, and why they want the role.",
        userGoal: "Answer interview questions confidently using professional English",
        targetPhrases: ["I have experience in...", "One of my strengths is...", "I'm looking for an opportunity to...", "For example, in my previous role..."],
        successCriteria: ["Answers questions with specific examples", "Uses professional register", "Asks a question at the end"],
      },
    ],
  },
  {
    id: "en-int-l6",
    slug: "formal-emails",
    title: "Writing Formal Emails",
    content: `# Writing Formal Emails

Professional email communication is essential in the modern workplace.

## Email Structure

1. **Greeting**: Dear Mr/Ms [surname], / Dear [First name],
2. **Opening**: I am writing to inquire about... / Thank you for your email.
3. **Body**: The main message.
4. **Closing**: I look forward to hearing from you. / Please let me know if you have any questions.
5. **Sign-off**: Best regards, / Kind regards, / Yours sincerely,

## Useful Phrases

- I would like to **request**...
- Could you please **confirm**...?
- Please find **attached**...
- I **apologise** for the delay.
- I am writing **with regard to**...

## Formal vs. Informal

| Informal | Formal |
|----------|--------|
| Hi / Hey | Dear Mr/Ms... |
| Thanks | Thank you for your assistance |
| Can you...? | Could you possibly...? |
| Sorry about... | I apologise for... |
| See you | I look forward to meeting you |`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m2",
    moduleTitle: "Work & Career",
    order: 6,
    topicId: "en-intermediate-formal-emails",
    vocabulary: [
      {
        word: "inquire",
        translation: "to ask for information formally",
        pronunciation: "/\u026An\u02C8kwa\u026A.\u0259r/",
        exampleSentence: "I am writing to inquire about the job opening.",
        exampleTranslation: "I am writing to inquire about the job opening.",
        partOfSpeech: "verb",
      },
      {
        word: "attached",
        translation: "joined to an email as a separate file",
        pronunciation: "/\u0259\u02C8t\u00E6t\u0283t/",
        exampleSentence: "Please find attached my CV.",
        exampleTranslation: "Please find attached my CV.",
        partOfSpeech: "adjective",
      },
      {
        word: "regards",
        translation: "good wishes (used in sign-offs)",
        pronunciation: "/r\u026A\u02C8\u0261\u0251\u02D0dz/",
        exampleSentence: "Best regards, Maria",
        exampleTranslation: "Best regards, Maria",
        partOfSpeech: "noun",
      },
      {
        word: "confirm",
        translation: "to verify or make certain",
        pronunciation: "/k\u0259n\u02C8f\u025C\u02D0m/",
        exampleSentence: "Could you confirm the meeting time?",
        exampleTranslation: "Could you confirm the meeting time?",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Polite Request Forms",
        explanation: "In formal English, use **could/would** instead of **can/will** for politeness. Add **please** or **possibly** for extra formality.",
        examples: [
          { correct: "Could you please send me the report?", translation: "Could you please send me the report?" },
          { correct: "Would it be possible to reschedule the meeting?", translation: "Would it be possible to reschedule the meeting?" },
          { correct: "I would appreciate it if you could reply by Friday.", translation: "I would appreciate it if you could reply by Friday." },
        ],
        commonMistakes: [
          {
            incorrect: "Send me the report.",
            correction: "Could you please send me the report?",
            explanation: "Direct imperatives sound rude in formal emails. Always soften with 'could/would'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "dictate-email",
        title: "Dictating a Professional Email",
        situation: "You need to write an email to a client explaining a delay in a project.",
        agentRole: "You are an English writing coach. Listen to the student's email draft, suggest more formal alternatives where needed, and check the structure.",
        userGoal: "Compose a formal email explaining a project delay and proposing a new timeline",
        targetPhrases: ["I am writing to inform you...", "I apologise for...", "Could you please...", "I look forward to..."],
        successCriteria: ["Uses formal greeting and sign-off", "Uses polite language", "Communicates the key information clearly"],
      },
    ],
    culturalNotes: [
      {
        title: "Email Etiquette Across Cultures",
        content: "In British English, 'Kind regards' and 'Best regards' are the most common sign-offs. American English also uses 'Best,' or 'Thanks,'. In both cultures, replying within 24 hours is expected in a professional context. Avoid using ALL CAPS as it reads as shouting.",
      },
    ],
  },
];

// ============================================
// Module 3: Travel & Tourism
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "en-int-l7",
    slug: "comparatives-superlatives",
    title: "Comparing Places",
    content: `# Comparing Places

Use comparatives and superlatives to describe and compare travel destinations.

## Comparatives (comparing two things)

- Short adjectives: add **-er** → *cheaper, bigger, safer*
- Long adjectives: use **more** → *more expensive, more interesting*
- Irregular: *better, worse, farther/further*

**Structure:** A is **[comparative] than** B.
- Paris is **more expensive than** Prague.
- The beach is **quieter than** the city.

## Superlatives (the most/least of a group)

- Short adjectives: add **-est** → *the cheapest, the biggest*
- Long adjectives: use **the most** → *the most beautiful*

**Structure:** It is **the [superlative]** (place/thing).
- It's **the tallest** building in the city.
- It was **the most amazing** trip I've ever taken.`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m3",
    moduleTitle: "Travel & Tourism",
    order: 7,
    topicId: "en-intermediate-comparatives-superlatives",
    vocabulary: [
      {
        word: "destination",
        translation: "the place someone is going to",
        pronunciation: "/\u02CCdest.\u026A\u02C8ne\u026A.\u0283\u0259n/",
        exampleSentence: "What is your dream travel destination?",
        exampleTranslation: "What is your dream travel destination?",
        partOfSpeech: "noun",
      },
      {
        word: "breathtaking",
        translation: "extremely impressive or beautiful",
        pronunciation: "/\u02C8bre\u03B8\u02CCte\u026A.k\u026A\u014B/",
        exampleSentence: "The view from the mountain was breathtaking.",
        exampleTranslation: "The view from the mountain was breathtaking.",
        partOfSpeech: "adjective",
      },
      {
        word: "affordable",
        translation: "not too expensive; reasonably priced",
        pronunciation: "/\u0259\u02C8f\u0254\u02D0.d\u0259.b\u0259l/",
        exampleSentence: "Thailand is one of the most affordable destinations in Asia.",
        exampleTranslation: "Thailand is one of the most affordable destinations in Asia.",
        partOfSpeech: "adjective",
      },
      {
        word: "crowded",
        translation: "full of people",
        pronunciation: "/\u02C8kra\u028A.d\u026Ad/",
        exampleSentence: "The beach was less crowded in the morning.",
        exampleTranslation: "The beach was less crowded in the morning.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "Comparatives and Superlatives",
        explanation: "One-syllable adjectives take **-er / -est**. Adjectives with two or more syllables use **more / the most**. Some are irregular (good \u2192 better \u2192 the best).",
        examples: [
          { correct: "Italy is warmer than England.", translation: "Italy is warmer than England." },
          { correct: "This hotel is more comfortable than the last one.", translation: "This hotel is more comfortable than the last one." },
          { correct: "It's the best holiday I've ever had.", translation: "It's the best holiday I've ever had." },
        ],
        commonMistakes: [
          {
            incorrect: "Paris is more cheap than London.",
            correction: "Paris is cheaper than London.",
            explanation: "'Cheap' is a short adjective, so add -er instead of using 'more'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "travel-recommendations",
        title: "Recommending Holiday Destinations",
        situation: "A friend asks you for travel advice. Compare different places you have visited.",
        agentRole: "You are Kenji, planning a two-week holiday. Ask the student to compare destinations and help you decide.",
        userGoal: "Compare at least three destinations using comparatives and superlatives",
        targetPhrases: ["...is more... than...", "...is the most...", "...is cheaper/better/worse than...", "The best place I've been to is..."],
        successCriteria: ["Uses comparatives correctly", "Uses superlatives correctly", "Gives reasons for recommendations"],
      },
    ],
  },
  {
    id: "en-int-l8",
    slug: "used-to",
    title: "Used To — Past Habits",
    content: `# Used To — Past Habits

Talk about things that were true in the past but are no longer true.

## Structure

**used to + base verb**

- I **used to** travel every summer, but now I'm too busy.
- She **used to** live in a small town.
- We **didn't use to** have smartphones.
- **Did** you **use to** play sports?

## Used To vs. Present

| Past (used to) | Now |
|----------------|-----|
| I used to walk to school. | Now I drive. |
| He used to smoke. | He quit two years ago. |
| They used to live in a flat. | They bought a house. |

## Be Used To (different meaning!)

**be used to + noun/-ing** = be accustomed to something
- I **am used to** getting up early. *(It's normal for me now.)*`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m3",
    moduleTitle: "Travel & Tourism",
    order: 8,
    topicId: "en-intermediate-used-to",
    vocabulary: [
      {
        word: "habit",
        translation: "something you do regularly",
        pronunciation: "/\u02C8h\u00E6b.\u026At/",
        exampleSentence: "Exercising every morning is a good habit.",
        exampleTranslation: "Exercising every morning is a good habit.",
        partOfSpeech: "noun",
      },
      {
        word: "routine",
        translation: "a regular way of doing things",
        pronunciation: "/ru\u02D0\u02C8ti\u02D0n/",
        exampleSentence: "My morning routine has changed a lot since I moved abroad.",
        exampleTranslation: "My morning routine has changed a lot since I moved abroad.",
        partOfSpeech: "noun",
      },
      {
        word: "accustomed",
        translation: "familiar with; used to",
        pronunciation: "/\u0259\u02C8k\u028Cs.t\u0259md/",
        exampleSentence: "I am accustomed to the cold weather now.",
        exampleTranslation: "I am accustomed to the cold weather now.",
        partOfSpeech: "adjective",
      },
      {
        word: "nowadays",
        translation: "at the present time, in contrast to the past",
        pronunciation: "/\u02C8na\u028A.\u0259.de\u026Az/",
        exampleSentence: "Nowadays, most people book flights online.",
        exampleTranslation: "Nowadays, most people book flights online.",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "Used To vs. Be Used To",
        explanation: "**Used to + verb** describes past habits/states that are no longer true. **Be used to + noun/-ing** means you are accustomed to something.",
        examples: [
          { correct: "I used to take the bus.", translation: "I used to take the bus.", note: "Past habit, no longer true." },
          { correct: "I am used to taking the bus.", translation: "I am used to taking the bus.", note: "I'm accustomed to it; it's normal for me." },
        ],
        commonMistakes: [
          {
            incorrect: "I used to getting up early.",
            correction: "I am used to getting up early. / I used to get up early.",
            explanation: "Don't mix the two structures. 'Used to + base verb' = past habit. 'Be used to + -ing' = accustomed to.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "travel-then-now",
        title: "Travel Then and Now",
        situation: "You are discussing how travel has changed compared to when you were younger.",
        agentRole: "You are Rosa, a retired travel writer. Compare how travel used to be with how it is today. Ask the student about their past and present travel habits.",
        userGoal: "Describe how your travel habits have changed using 'used to' and contrast with the present",
        targetPhrases: ["I used to...", "I didn't use to...", "Nowadays I...", "I'm used to..."],
        successCriteria: ["Uses 'used to' for past habits", "Contrasts with present", "Distinguishes 'used to' from 'be used to'"],
      },
    ],
  },
  {
    id: "en-int-l9",
    slug: "hotel-airport-problems",
    title: "Dealing with Travel Problems",
    content: `# Dealing with Travel Problems

Handle common travel problems at hotels, airports, and transit with confidence.

## At the Hotel

- My room **hasn't been cleaned**.
- The air conditioning **isn't working**.
- I'd like to **make a complaint**.
- Could I **speak to the manager**, please?
- Is it possible to **change rooms**?

## At the Airport

- My flight **has been delayed/cancelled**.
- I've **missed my connection**.
- Where is the **baggage claim**?
- I'd like to **rebook** my flight.

## Useful Problem-Solving Phrases

- I'm afraid there's **a problem with**...
- Could you **help me** with...?
- What are **my options**?
- I'd **appreciate** it if you could...`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m3",
    moduleTitle: "Travel & Tourism",
    order: 9,
    topicId: "en-intermediate-hotel-airport-problems",
    vocabulary: [
      {
        word: "delayed",
        translation: "made late; not on time",
        pronunciation: "/d\u026A\u02C8le\u026Ad/",
        exampleSentence: "Our flight has been delayed by three hours.",
        exampleTranslation: "Our flight has been delayed by three hours.",
        partOfSpeech: "adjective",
      },
      {
        word: "complaint",
        translation: "a formal expression of dissatisfaction",
        pronunciation: "/k\u0259m\u02C8ple\u026Ant/",
        exampleSentence: "I'd like to make a complaint about the service.",
        exampleTranslation: "I'd like to make a complaint about the service.",
        partOfSpeech: "noun",
      },
      {
        word: "refund",
        translation: "money returned after a purchase or cancellation",
        pronunciation: "/\u02C8ri\u02D0.f\u028And/",
        exampleSentence: "Can I get a refund for the cancelled tour?",
        exampleTranslation: "Can I get a refund for the cancelled tour?",
        partOfSpeech: "noun",
      },
      {
        word: "baggage claim",
        translation: "the area in an airport where you collect your luggage",
        pronunciation: "/\u02C8b\u00E6\u0261.\u026Ad\u0292 kle\u026Am/",
        exampleSentence: "The baggage claim is on the ground floor.",
        exampleTranslation: "The baggage claim is on the ground floor.",
        partOfSpeech: "noun",
      },
      {
        word: "inconvenience",
        translation: "trouble or difficulty caused to someone",
        pronunciation: "/\u02CC\u026An.k\u0259n\u02C8vi\u02D0.ni.\u0259ns/",
        exampleSentence: "We apologise for any inconvenience.",
        exampleTranslation: "We apologise for any inconvenience.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Polite Complaints with 'I'd like to...'",
        explanation: "Use **I'd like to** (= I would like to) to make polite requests or complaints. It is softer than 'I want to'.",
        examples: [
          { correct: "I'd like to make a complaint.", translation: "I'd like to make a complaint." },
          { correct: "I'd like to speak to someone in charge.", translation: "I'd like to speak to someone in charge." },
        ],
        commonMistakes: [
          {
            incorrect: "I want to complain about my room.",
            correction: "I'd like to make a complaint about my room.",
            explanation: "'I want to complain' is grammatically fine but sounds blunt. 'I'd like to make a complaint' is much more polite.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "hotel-complaint",
        title: "Hotel Room Problem",
        situation: "You arrive at your hotel and find several problems with your room.",
        agentRole: "You are the hotel receptionist. Listen to the guest's complaints politely and offer solutions (room change, discount, maintenance visit).",
        userGoal: "Explain the problems with your room and negotiate a solution",
        targetPhrases: ["I'd like to...", "There's a problem with...", "Could you...?", "Is it possible to...?"],
        successCriteria: ["Explains problems clearly", "Uses polite language", "Negotiates a solution"],
      },
    ],
    culturalNotes: [
      {
        title: "Complaining Politely in English",
        content: "In British culture especially, complaints are often softened with phrases like 'I'm sorry to bother you, but...' or 'I'm afraid there seems to be a problem.' Being direct without these softeners can come across as aggressive. Americans tend to be slightly more direct but still value polite phrasing.",
      },
    ],
  },
];

// ============================================
// Module 4: Media & Technology
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "en-int-l10",
    slug: "passive-voice",
    title: "Passive Voice — News & Reports",
    content: `# Passive Voice — News & Reports

The passive voice is common in news, reports, and formal writing when the action matters more than who did it.

## Structure

**be + past participle**

| Tense | Active | Passive |
|-------|--------|---------|
| Present simple | They make iPhones in China. | iPhones **are made** in China. |
| Past simple | Someone stole my phone. | My phone **was stolen**. |
| Present perfect | They have released a new update. | A new update **has been released**. |
| Future (will) | They will announce the results. | The results **will be announced**. |

## When to Use Passive

- The doer is **unknown**: *My bike was stolen.*
- The doer is **obvious**: *He was arrested.* (by the police)
- In **news/reports**: *The building was destroyed by fire.*
- In **formal/scientific writing**: *The experiment was conducted in 2023.*`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m4",
    moduleTitle: "Media & Technology",
    order: 10,
    topicId: "en-intermediate-passive-voice",
    vocabulary: [
      {
        word: "announce",
        translation: "to make a public statement about something",
        pronunciation: "/\u0259\u02C8na\u028Ans/",
        exampleSentence: "The winner was announced live on television.",
        exampleTranslation: "The winner was announced live on television.",
        partOfSpeech: "verb",
      },
      {
        word: "launch",
        translation: "to introduce a new product or service",
        pronunciation: "/l\u0254\u02D0nt\u0283/",
        exampleSentence: "The new app was launched last week.",
        exampleTranslation: "The new app was launched last week.",
        partOfSpeech: "verb",
      },
      {
        word: "investigate",
        translation: "to examine something carefully to find the truth",
        pronunciation: "/\u026An\u02C8vest.\u026A.\u0261e\u026At/",
        exampleSentence: "The incident is being investigated by police.",
        exampleTranslation: "The incident is being investigated by police.",
        partOfSpeech: "verb",
      },
      {
        word: "broadcast",
        translation: "to send out a programme on TV or radio",
        pronunciation: "/\u02C8br\u0254\u02D0d.k\u0251\u02D0st/",
        exampleSentence: "The match will be broadcast live.",
        exampleTranslation: "The match will be broadcast live.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Forming the Passive Voice",
        explanation: "Change the object of an active sentence into the subject. Use **be** (in the correct tense) + **past participle**. The original subject becomes optional (by + agent).",
        examples: [
          { correct: "The report was written by the team.", translation: "The report was written by the team." },
          { correct: "A new law has been passed.", translation: "A new law has been passed.", note: "No 'by' agent — we don't need to say who passed it." },
        ],
        commonMistakes: [
          {
            incorrect: "The window was break.",
            correction: "The window was broken.",
            explanation: "You must use the past participle, not the base form. 'Break' \u2192 'broken'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "news-report",
        title: "Reporting the News",
        situation: "You are a news anchor reading today's top stories.",
        agentRole: "You are a co-anchor on a morning news programme. Take turns reading headlines and discussing them. Prompt the student to use passive voice when describing events.",
        userGoal: "Report at least three news stories using the passive voice",
        targetPhrases: ["...was discovered...", "...has been announced...", "...will be held...", "...is being investigated..."],
        successCriteria: ["Uses passive voice in multiple tenses", "Reports news clearly", "Sounds natural and professional"],
      },
    ],
  },
  {
    id: "en-int-l11",
    slug: "relative-clauses",
    title: "Relative Clauses — Describing Things",
    content: `# Relative Clauses — Describing Things

Use relative clauses to give more information about a noun without starting a new sentence.

## Relative Pronouns

| Pronoun | Used for | Example |
|---------|----------|---------|
| **who** | people | The journalist **who** wrote the article... |
| **which** | things | The app **which** was released... |
| **that** | people or things | The podcast **that** I listen to... |
| **where** | places | The café **where** we met... |
| **whose** | possession | The woman **whose** phone was stolen... |

## Defining vs. Non-Defining

- **Defining** (no commas): essential information — *The man **who called** is my boss.*
- **Non-defining** (with commas): extra information — *My boss, **who is very tall**, called me.*

Note: You cannot use **that** in non-defining clauses.`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m4",
    moduleTitle: "Media & Technology",
    order: 11,
    topicId: "en-intermediate-relative-clauses",
    vocabulary: [
      {
        word: "subscribe",
        translation: "to sign up to receive something regularly",
        pronunciation: "/s\u0259b\u02C8skra\u026Ab/",
        exampleSentence: "I subscribe to a podcast that discusses technology.",
        exampleTranslation: "I subscribe to a podcast that discusses technology.",
        partOfSpeech: "verb",
      },
      {
        word: "algorithm",
        translation: "a set of rules a computer follows to solve a problem",
        pronunciation: "/\u02C8\u00E6l.\u0261\u0259.r\u026A.\u00F0\u0259m/",
        exampleSentence: "The algorithm, which recommends videos, is very powerful.",
        exampleTranslation: "The algorithm, which recommends videos, is very powerful.",
        partOfSpeech: "noun",
      },
      {
        word: "influencer",
        translation: "a person who affects others' opinions, especially online",
        pronunciation: "/\u02C8\u026An.flu.\u0259n.s\u0259r/",
        exampleSentence: "The influencer who promoted the product has millions of followers.",
        exampleTranslation: "The influencer who promoted the product has millions of followers.",
        partOfSpeech: "noun",
      },
      {
        word: "platform",
        translation: "a website or app where people interact",
        pronunciation: "/\u02C8pl\u00E6t.f\u0254\u02D0m/",
        exampleSentence: "Instagram is a platform where people share photos.",
        exampleTranslation: "Instagram is a platform where people share photos.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Defining Relative Clauses",
        explanation: "A defining relative clause tells us **which** person or thing we mean. Without it, the sentence is incomplete or unclear. No commas are used.",
        examples: [
          { correct: "The app that I downloaded is free.", translation: "The app that I downloaded is free.", note: "Which app? The one I downloaded." },
          { correct: "People who spend too much time online often feel anxious.", translation: "People who spend too much time online often feel anxious." },
        ],
        commonMistakes: [
          {
            incorrect: "The man which called me was my boss.",
            correction: "The man who called me was my boss.",
            explanation: "Use 'who' (not 'which') for people.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "tech-debate",
        title: "Social Media Debate",
        situation: "You and a friend are debating whether social media is good or bad for society.",
        agentRole: "You are Liam, a tech enthusiast who believes social media connects people. Challenge the student's points and ask them to explain their opinions with examples.",
        userGoal: "Express your opinion on social media using relative clauses to add detail",
        targetPhrases: ["People who...", "Apps that...", "The platform where...", "Companies whose..."],
        successCriteria: ["Uses at least three relative clauses", "Expresses opinion clearly", "Responds to counterarguments"],
      },
    ],
  },
  {
    id: "en-int-l12",
    slug: "news-social-media-vocab",
    title: "News & Social Media Language",
    content: `# News & Social Media Language

Understand and discuss news articles, headlines, and social media content.

## News Headline Language

Headlines often drop articles and use short forms:
- **PM to visit France** = The Prime Minister is going to visit France
- **Stocks rise amid trade deal** = Stocks are rising because of a trade deal
- **Man held over robbery** = A man has been arrested for a robbery

## Social Media Vocabulary

- **trending** — popular right now
- **go viral** — spread rapidly online
- **fake news** — false information presented as real
- **click-bait** — misleading titles designed to get clicks
- **content creator** — someone who makes online content
- **follower / subscriber** — someone who follows an account

## Discussion Phrases

- **In my opinion**, ...
- **I agree/disagree with** the idea that...
- **On the one hand** ... **On the other hand** ...
- **The article claims that**...`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m4",
    moduleTitle: "Media & Technology",
    order: 12,
    topicId: "en-intermediate-news-social-media-vocab",
    vocabulary: [
      {
        word: "go viral",
        translation: "to spread very quickly on the internet",
        pronunciation: "/\u0261\u0259\u028A \u02C8va\u026A.r\u0259l/",
        exampleSentence: "The video went viral and got ten million views in a day.",
        exampleTranslation: "The video went viral and got ten million views in a day.",
        partOfSpeech: "phrase",
      },
      {
        word: "fake news",
        translation: "false stories that look like real journalism",
        pronunciation: "/fe\u026Ak nju\u02D0z/",
        exampleSentence: "It can be difficult to tell real news from fake news.",
        exampleTranslation: "It can be difficult to tell real news from fake news.",
        partOfSpeech: "noun",
      },
      {
        word: "headline",
        translation: "the title at the top of a news article",
        pronunciation: "/\u02C8hed.la\u026An/",
        exampleSentence: "Did you see today's headline about the election?",
        exampleTranslation: "Did you see today's headline about the election?",
        partOfSpeech: "noun",
      },
      {
        word: "bias",
        translation: "unfair preference for or against something",
        pronunciation: "/\u02C8ba\u026A.\u0259s/",
        exampleSentence: "Every news source has some kind of bias.",
        exampleTranslation: "Every news source has some kind of bias.",
        partOfSpeech: "noun",
      },
      {
        word: "source",
        translation: "the origin of information",
        pronunciation: "/s\u0254\u02D0s/",
        exampleSentence: "Always check the source before sharing an article.",
        exampleTranslation: "Always check the source before sharing an article.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Expressing Opinions: Agree & Disagree",
        explanation: "Use structured phrases to present your opinion in discussions and debates.",
        examples: [
          { correct: "In my opinion, social media does more harm than good.", translation: "In my opinion, social media does more harm than good." },
          { correct: "I disagree with the idea that all news is biased.", translation: "I disagree with the idea that all news is biased." },
          { correct: "On the one hand, it connects people. On the other hand, it spreads misinformation.", translation: "On the one hand, it connects people. On the other hand, it spreads misinformation." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "discussing-news",
        title: "Discussing a News Story",
        situation: "You read a news article about a technology company and discuss it with a classmate.",
        agentRole: "You are Fatima, an ESL classmate. Discuss a recent news story about a tech company banning children from its platform. Share opinions and ask the student to support theirs.",
        userGoal: "Summarise a news story and give your opinion on it",
        targetPhrases: ["The article says that...", "In my opinion...", "I agree/disagree because...", "On the one hand..."],
        successCriteria: ["Summarises a story", "Gives a clear opinion", "Supports opinion with reasons"],
      },
    ],
  },
];

// ============================================
// Module 5: Education & Environment
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "en-int-l13",
    slug: "conditionals-first-second",
    title: "First & Second Conditionals",
    content: `# First & Second Conditionals

Conditionals let you talk about possible and imaginary situations.

## First Conditional (real/possible future)

**If + present simple, will + base verb**

- If it **rains**, I **will stay** home.
- If you **study** hard, you **will pass** the exam.
- I **will call** you if I **finish** early.

*Use for things that are likely or possible in the future.*

## Second Conditional (unreal/imaginary present)

**If + past simple, would + base verb**

- If I **had** more money, I **would travel** the world.
- If she **spoke** French, she **would apply** for the job.
- I **would buy** a house if I **won** the lottery.

*Use for things that are unlikely or imaginary right now.*

## Quick Comparison

| | First Conditional | Second Conditional |
|---|---|---|
| Likelihood | Possible | Unlikely / Imaginary |
| If clause | present simple | past simple |
| Main clause | will + verb | would + verb |`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m5",
    moduleTitle: "Education & Environment",
    order: 13,
    topicId: "en-intermediate-conditionals-first-second",
    vocabulary: [
      {
        word: "sustainable",
        translation: "able to continue without damaging the environment",
        pronunciation: "/s\u0259\u02C8ste\u026A.n\u0259.b\u0259l/",
        exampleSentence: "If we use sustainable energy, we will reduce pollution.",
        exampleTranslation: "If we use sustainable energy, we will reduce pollution.",
        partOfSpeech: "adjective",
      },
      {
        word: "pollution",
        translation: "harmful substances released into the environment",
        pronunciation: "/p\u0259\u02C8lu\u02D0.\u0283\u0259n/",
        exampleSentence: "If pollution continues, the oceans will suffer.",
        exampleTranslation: "If pollution continues, the oceans will suffer.",
        partOfSpeech: "noun",
      },
      {
        word: "recycle",
        translation: "to convert waste into reusable material",
        pronunciation: "/ri\u02D0\u02C8sa\u026A.k\u0259l/",
        exampleSentence: "If everyone recycled, there would be less waste.",
        exampleTranslation: "If everyone recycled, there would be less waste.",
        partOfSpeech: "verb",
      },
      {
        word: "consequence",
        translation: "a result or effect of an action",
        pronunciation: "/\u02C8k\u0252n.s\u026A.kw\u0259ns/",
        exampleSentence: "What would be the consequences if we did nothing?",
        exampleTranslation: "What would be the consequences if we did nothing?",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "First Conditional vs. Second Conditional",
        explanation: "The **first conditional** is for real, possible situations. The **second conditional** is for unreal, hypothetical, or unlikely situations.",
        examples: [
          { correct: "If it rains tomorrow, I will take an umbrella.", translation: "If it rains tomorrow, I will take an umbrella.", note: "First conditional: rain is possible." },
          { correct: "If I were president, I would ban plastic bags.", translation: "If I were president, I would ban plastic bags.", note: "Second conditional: I'm not president (imaginary)." },
        ],
        commonMistakes: [
          {
            incorrect: "If I would have more money, I would travel.",
            correction: "If I had more money, I would travel.",
            explanation: "In the 'if' clause of a second conditional, use past simple, not 'would'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "environment-discussion",
        title: "What If We Changed?",
        situation: "You are in a classroom debate about environmental issues.",
        agentRole: "You are Mr. Torres, an environmental science teacher. Ask students to discuss real consequences (first conditional) and imaginary solutions (second conditional).",
        userGoal: "Discuss environmental problems using both first and second conditionals",
        targetPhrases: ["If we don't act, ...", "If everyone recycled, ...", "If I were in charge, I would...", "If pollution continues, ..."],
        successCriteria: ["Uses first conditional for real scenarios", "Uses second conditional for imaginary ones", "Provides clear reasoning"],
      },
    ],
  },
  {
    id: "en-int-l14",
    slug: "third-conditional-wish",
    title: "Third Conditional & Wish",
    content: `# Third Conditional & Wish

Talk about regrets and imagine how the past could have been different.

## Third Conditional (unreal past)

**If + past perfect, would have + past participle**

- If I **had studied** harder, I **would have passed** the exam.
- If she **hadn't missed** the bus, she **would have arrived** on time.
- We **would have gone** to the beach if the weather **had been** better.

*Use for imaginary changes to past events — things that did NOT happen.*

## Wish + Past Simple (present regrets)

- I **wish** I **spoke** better English.
- She **wishes** she **had** more free time.
- I **wish** I **didn't have to** work tomorrow.

## Wish + Past Perfect (past regrets)

- I **wish** I **had studied** medicine.
- He **wishes** he **hadn't sold** his car.`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m5",
    moduleTitle: "Education & Environment",
    order: 14,
    topicId: "en-intermediate-third-conditional-wish",
    vocabulary: [
      {
        word: "regret",
        translation: "a feeling of sadness about something you did or didn't do",
        pronunciation: "/r\u026A\u02C8\u0261ret/",
        exampleSentence: "My biggest regret is not learning English sooner.",
        exampleTranslation: "My biggest regret is not learning English sooner.",
        partOfSpeech: "noun",
      },
      {
        word: "opportunity",
        translation: "a chance to do something",
        pronunciation: "/\u02CC\u0252p.\u0259\u02C8tju\u02D0.n\u0259.ti/",
        exampleSentence: "If I had taken that opportunity, my life would be different.",
        exampleTranslation: "If I had taken that opportunity, my life would be different.",
        partOfSpeech: "noun",
      },
      {
        word: "outcome",
        translation: "the final result of a situation",
        pronunciation: "/\u02C8a\u028At.k\u028Am/",
        exampleSentence: "The outcome would have been better if we had planned more carefully.",
        exampleTranslation: "The outcome would have been better if we had planned more carefully.",
        partOfSpeech: "noun",
      },
      {
        word: "hindsight",
        translation: "understanding of a situation only after it has happened",
        pronunciation: "/\u02C8ha\u026And.sa\u026At/",
        exampleSentence: "In hindsight, I wish I had accepted the job offer.",
        exampleTranslation: "In hindsight, I wish I had accepted the job offer.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Third Conditional",
        explanation: "Use **if + past perfect, would have + past participle** to imagine a different past. The situation did NOT happen.",
        examples: [
          { correct: "If I had known about the sale, I would have bought the laptop.", translation: "If I had known about the sale, I would have bought the laptop.", note: "I didn't know, so I didn't buy it." },
          { correct: "If they had left earlier, they wouldn't have missed the train.", translation: "If they had left earlier, they wouldn't have missed the train." },
        ],
        commonMistakes: [
          {
            incorrect: "If I would have known, I would have come.",
            correction: "If I had known, I would have come.",
            explanation: "Don't use 'would' in the 'if' clause. Use 'had + past participle'.",
          },
        ],
      },
      {
        title: "Wish + Past Tenses",
        explanation: "Use **wish + past simple** for present regrets. Use **wish + past perfect** for past regrets.",
        examples: [
          { correct: "I wish I lived near the sea.", translation: "I wish I lived near the sea.", note: "Present regret: I don't live near the sea." },
          { correct: "I wish I had learned to drive when I was younger.", translation: "I wish I had learned to drive when I was younger.", note: "Past regret: I didn't learn." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "regrets-discussion",
        title: "Talking About Regrets",
        situation: "You and a friend reflect on past decisions and what you would have done differently.",
        agentRole: "You are Mia, a thoughtful friend. Share some of your own regrets and ask the student about theirs. Use 'I wish...' and 'If I had...'.",
        userGoal: "Discuss at least two past regrets using the third conditional and 'wish'",
        targetPhrases: ["If I had..., I would have...", "I wish I had...", "I wish I hadn't...", "In hindsight..."],
        successCriteria: ["Uses third conditional correctly", "Uses wish + past perfect", "Talks about regrets naturally"],
      },
    ],
  },
  {
    id: "en-int-l15",
    slug: "sustainability-education",
    title: "Talking About Education & Sustainability",
    content: `# Talking About Education & Sustainability

Discuss important global topics with the right vocabulary and structures.

## Education Vocabulary

- **degree** — a university qualification
- **scholarship** — money given to a student to pay for their studies
- **curriculum** — the subjects and content taught in a school
- **tuition fees** — the cost of attending university
- **dropout** — a person who leaves school before finishing
- **graduate** — to complete a degree (verb); a person who has finished (noun)

## Sustainability Vocabulary

- **carbon footprint** — the amount of CO2 produced by a person or activity
- **renewable energy** — energy from sources that do not run out (solar, wind)
- **climate change** — long-term changes in global temperature and weather
- **biodiversity** — the variety of plant and animal life
- **emissions** — gases released into the atmosphere

## Expressing Cause & Effect

- **If** we invest in education, poverty **will** decrease.
- Deforestation **leads to** loss of biodiversity.
- **Because of** climate change, sea levels are rising.
- The school closed **due to** a lack of funding.`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m5",
    moduleTitle: "Education & Environment",
    order: 15,
    topicId: "en-intermediate-sustainability-education",
    vocabulary: [
      {
        word: "scholarship",
        translation: "financial support given to a student for their studies",
        pronunciation: "/\u02C8sk\u0252l.\u0259.\u0283\u026Ap/",
        exampleSentence: "She won a scholarship to study in the UK.",
        exampleTranslation: "She won a scholarship to study in the UK.",
        partOfSpeech: "noun",
      },
      {
        word: "carbon footprint",
        translation: "the total amount of greenhouse gases produced by a person or activity",
        pronunciation: "/\u02C8k\u0251\u02D0.b\u0259n \u02C8f\u028At.pr\u026Ant/",
        exampleSentence: "Flying has a very large carbon footprint.",
        exampleTranslation: "Flying has a very large carbon footprint.",
        partOfSpeech: "noun",
      },
      {
        word: "renewable",
        translation: "able to be replaced naturally and not used up",
        pronunciation: "/r\u026A\u02C8nju\u02D0.\u0259.b\u0259l/",
        exampleSentence: "Solar power is a renewable source of energy.",
        exampleTranslation: "Solar power is a renewable source of energy.",
        partOfSpeech: "adjective",
      },
      {
        word: "curriculum",
        translation: "the subjects and content taught at a school",
        pronunciation: "/k\u0259\u02C8r\u026Ak.j\u0259.l\u0259m/",
        exampleSentence: "The school added coding to the curriculum.",
        exampleTranslation: "The school added coding to the curriculum.",
        partOfSpeech: "noun",
      },
      {
        word: "emissions",
        translation: "gases (especially CO2) released into the air",
        pronunciation: "/\u026A\u02C8m\u026A\u0283.\u0259nz/",
        exampleSentence: "The government wants to cut emissions by fifty per cent.",
        exampleTranslation: "The government wants to cut emissions by fifty per cent.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Cause and Effect Linkers",
        explanation: "Use linking phrases to connect causes and effects in academic and formal discussions.",
        examples: [
          { correct: "Deforestation leads to flooding.", translation: "Deforestation leads to flooding.", note: "'Leads to' + noun/gerund" },
          { correct: "Due to climate change, many species are at risk.", translation: "Due to climate change, many species are at risk.", note: "'Due to' + noun" },
          { correct: "Because of the scholarship, I was able to study abroad.", translation: "Because of the scholarship, I was able to study abroad." },
        ],
        commonMistakes: [
          {
            incorrect: "Due to it rained, the match was cancelled.",
            correction: "Due to the rain, the match was cancelled.",
            explanation: "'Due to' must be followed by a noun, not a clause. Use 'Because' before a clause.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "classroom-debate",
        title: "Should University Be Free?",
        situation: "You are in an English class debating whether university education should be free for everyone.",
        agentRole: "You are the debate moderator, Ms. Park. Ask each student to present their argument for or against free university education. Push them to use cause-and-effect language.",
        userGoal: "Present a clear argument about free university education using cause-and-effect language",
        targetPhrases: ["If tuition were free...", "This leads to...", "Due to...", "As a result..."],
        successCriteria: ["Presents a clear position", "Uses cause-and-effect linkers", "Supports argument with examples"],
      },
    ],
    culturalNotes: [
      {
        title: "University Systems Around the World",
        content: "In the UK, university degrees take three years (four in Scotland). In the US, a bachelor's degree takes four years. Some European countries, like Germany and Norway, offer free or very low-cost university education. Understanding these differences helps when discussing education in English.",
      },
    ],
  },
];

// ============================================
// Module 6: Culture & Society
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "en-int-l16",
    slug: "reported-speech",
    title: "Reported Speech",
    content: `# Reported Speech

Report what other people said without quoting them directly.

## Direct vs. Reported Speech

| Direct | Reported |
|--------|----------|
| "I **am** tired." | She said she **was** tired. |
| "I **will** help you." | He said he **would** help me. |
| "I **have finished**." | She said she **had finished**. |
| "I **can** swim." | He said he **could** swim. |

## Rules for Reporting

1. **Shift tenses back one step** (present \u2192 past, will \u2192 would, etc.)
2. **Change pronouns** to match the new perspective.
3. **Change time references**: today \u2192 that day, tomorrow \u2192 the next day, yesterday \u2192 the day before.

## Reporting Verbs

- said, told, explained, mentioned, claimed, promised, warned, suggested`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m6",
    moduleTitle: "Culture & Society",
    order: 16,
    topicId: "en-intermediate-reported-speech",
    vocabulary: [
      {
        word: "claim",
        translation: "to state something is true, sometimes without proof",
        pronunciation: "/kle\u026Am/",
        exampleSentence: "He claimed that the restaurant was the best in the city.",
        exampleTranslation: "He claimed that the restaurant was the best in the city.",
        partOfSpeech: "verb",
      },
      {
        word: "mention",
        translation: "to refer to something briefly",
        pronunciation: "/\u02C8men.\u0283\u0259n/",
        exampleSentence: "She mentioned that the museum was closed on Mondays.",
        exampleTranslation: "She mentioned that the museum was closed on Mondays.",
        partOfSpeech: "verb",
      },
      {
        word: "deny",
        translation: "to say that something is not true",
        pronunciation: "/d\u026A\u02C8na\u026A/",
        exampleSentence: "He denied that he had broken the vase.",
        exampleTranslation: "He denied that he had broken the vase.",
        partOfSpeech: "verb",
      },
      {
        word: "admit",
        translation: "to accept that something is true, often reluctantly",
        pronunciation: "/\u0259d\u02C8m\u026At/",
        exampleSentence: "She admitted that she had made a mistake.",
        exampleTranslation: "She admitted that she had made a mistake.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Tense Backshift in Reported Speech",
        explanation: "When reporting what someone said, shift the tense one step into the past. Present \u2192 past, past \u2192 past perfect, will \u2192 would, can \u2192 could.",
        examples: [
          { correct: "She said, 'I love this city.' \u2192 She said she loved that city.", translation: "She said she loved that city." },
          { correct: "He said, 'I will call you tomorrow.' \u2192 He said he would call me the next day.", translation: "He said he would call me the next day." },
        ],
        commonMistakes: [
          {
            incorrect: "She said that she is tired.",
            correction: "She said that she was tired.",
            explanation: "When reporting past statements, shift 'is' to 'was'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "gossip-game",
        title: "The Gossip Game",
        situation: "You and a friend are sharing what other people told you today.",
        agentRole: "You are Nadia, a chatty friend. Tell the student things that other people said, and ask the student to report back what they heard from others.",
        userGoal: "Report at least four statements using reported speech correctly",
        targetPhrases: ["She said that...", "He told me that...", "They mentioned that...", "She claimed that..."],
        successCriteria: ["Uses tense backshift correctly", "Changes pronouns and time words", "Uses varied reporting verbs"],
      },
    ],
  },
  {
    id: "en-int-l17",
    slug: "cultural-comparisons",
    title: "Cultural Comparisons & Customs",
    content: `# Cultural Comparisons & Customs

Compare customs, traditions, and social norms across different cultures.

## Useful Structures for Comparing Cultures

- In **my country**, people usually...
- **Unlike** in the UK, we...
- **Both** cultures value...
- One **difference** between... and... is...
- A common **tradition** in... is...

## Topics for Cultural Comparison

- Greetings (handshake, bow, kiss, hug)
- Mealtimes and food etiquette
- Attitudes to punctuality
- Family structures and respect for elders
- Gift-giving customs
- Workplace culture (hierarchy, meetings, dress code)

## Hedging Language (being sensitive)

- **It seems that**...
- **Apparently**,...
- **I've heard that**...
- **In general** / **Typically**...
- **That's not always the case**, but...`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m6",
    moduleTitle: "Culture & Society",
    order: 17,
    topicId: "en-intermediate-cultural-comparisons",
    vocabulary: [
      {
        word: "custom",
        translation: "a traditional way of behaving in a society",
        pronunciation: "/\u02C8k\u028Cs.t\u0259m/",
        exampleSentence: "Removing your shoes at the door is a custom in many Asian countries.",
        exampleTranslation: "Removing your shoes at the door is a custom in many Asian countries.",
        partOfSpeech: "noun",
      },
      {
        word: "etiquette",
        translation: "the rules of polite behaviour in a society",
        pronunciation: "/\u02C8et.\u026A.ket/",
        exampleSentence: "Table etiquette varies from country to country.",
        exampleTranslation: "Table etiquette varies from country to country.",
        partOfSpeech: "noun",
      },
      {
        word: "stereotype",
        translation: "a fixed, oversimplified idea about a group of people",
        pronunciation: "/\u02C8ster.i.\u0259.ta\u026Ap/",
        exampleSentence: "We should avoid stereotypes when talking about other cultures.",
        exampleTranslation: "We should avoid stereotypes when talking about other cultures.",
        partOfSpeech: "noun",
      },
      {
        word: "diverse",
        translation: "having great variety; made up of different types",
        pronunciation: "/da\u026A\u02C8v\u025C\u02D0s/",
        exampleSentence: "London is one of the most diverse cities in the world.",
        exampleTranslation: "London is one of the most diverse cities in the world.",
        partOfSpeech: "adjective",
      },
      {
        word: "punctuality",
        translation: "the habit of being on time",
        pronunciation: "/\u02CCp\u028C\u014Bk.t\u0283u\u02C8\u00E6l.\u0259.ti/",
        exampleSentence: "Punctuality is very important in German business culture.",
        exampleTranslation: "Punctuality is very important in German business culture.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Hedging and Softening Generalisations",
        explanation: "When comparing cultures, avoid absolute statements. Use hedging language to show that your observation may not apply to everyone.",
        examples: [
          { correct: "In general, people in Japan tend to be very punctual.", translation: "In general, people in Japan tend to be very punctual.", note: "'In general' and 'tend to' soften the statement." },
          { correct: "Apparently, tipping isn't common in many European countries.", translation: "Apparently, tipping isn't common in many European countries." },
        ],
        commonMistakes: [
          {
            incorrect: "All British people drink tea.",
            correction: "Many British people enjoy tea, but that's not always the case.",
            explanation: "Avoid 'all' or 'every' when talking about cultural habits. Use 'many', 'some', or 'tend to'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "cultural-exchange",
        title: "Cultural Exchange Evening",
        situation: "You are at an international cultural exchange event comparing customs from different countries.",
        agentRole: "You are Yuki from Japan. Share Japanese customs and ask the student about theirs. Be curious and respectful.",
        userGoal: "Compare customs between your culture and another, using hedging language",
        targetPhrases: ["In my country, people tend to...", "Unlike in..., we...", "It seems that...", "Both cultures..."],
        successCriteria: ["Compares at least two cultural differences", "Uses hedging language", "Avoids stereotypes"],
      },
    ],
    culturalNotes: [
      {
        title: "Avoiding Cultural Generalisations",
        content: "When speaking English about other cultures, it is important to hedge your statements. Saying 'All French people...' sounds like a stereotype. Instead, use phrases like 'Many people in France tend to...' or 'From what I've observed...' This shows cultural sensitivity and is expected in academic and professional English.",
      },
    ],
  },
  {
    id: "en-int-l18",
    slug: "entertainment-reviews",
    title: "Entertainment & Reviews",
    content: `# Entertainment & Reviews

Talk about films, books, music, and TV shows and give your opinion.

## Types of Entertainment

- **film/movie** — a motion picture
- **TV series** — a show with multiple episodes
- **documentary** — a non-fiction film
- **novel** — a long fictional book
- **podcast** — an audio programme
- **exhibition** — a public display of art or objects

## Giving Reviews and Recommendations

- I **really enjoyed** it because...
- I **wouldn't recommend** it because...
- The **plot** was gripping / predictable / confusing.
- The **acting** was brilliant / disappointing.
- It's **worth watching/reading** if you like...
- I'd **give it** 8 out of 10.

## Describing Stories

- It's **set in**... (place/time)
- It's **about**... (topic)
- It's **based on**... (a true story / a book)
- The **main character** is...
- It has a **twist ending**.`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m6",
    moduleTitle: "Culture & Society",
    order: 18,
    topicId: "en-intermediate-entertainment-reviews",
    vocabulary: [
      {
        word: "plot",
        translation: "the main story of a book, film, or play",
        pronunciation: "/pl\u0252t/",
        exampleSentence: "The plot was exciting but hard to follow.",
        exampleTranslation: "The plot was exciting but hard to follow.",
        partOfSpeech: "noun",
      },
      {
        word: "gripping",
        translation: "so exciting that it holds your attention completely",
        pronunciation: "/\u02C8\u0261r\u026Ap.\u026A\u014B/",
        exampleSentence: "The documentary was absolutely gripping.",
        exampleTranslation: "The documentary was absolutely gripping.",
        partOfSpeech: "adjective",
      },
      {
        word: "predictable",
        translation: "easy to guess what will happen",
        pronunciation: "/pr\u026A\u02C8d\u026Ak.t\u0259.b\u0259l/",
        exampleSentence: "The ending was too predictable.",
        exampleTranslation: "The ending was too predictable.",
        partOfSpeech: "adjective",
      },
      {
        word: "recommend",
        translation: "to suggest something as good or suitable",
        pronunciation: "/\u02CCrek.\u0259\u02C8mend/",
        exampleSentence: "I would highly recommend this series.",
        exampleTranslation: "I would highly recommend this series.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Adjective Order for Reviews",
        explanation: "When stacking adjectives, follow this general order: opinion \u2192 size \u2192 age \u2192 shape \u2192 colour \u2192 origin \u2192 material \u2192 purpose.",
        examples: [
          { correct: "It's a brilliant new British comedy.", translation: "It's a brilliant new British comedy.", note: "Opinion (brilliant) \u2192 age (new) \u2192 origin (British) \u2192 noun (comedy)." },
          { correct: "It's a long, boring documentary.", translation: "It's a long, boring documentary." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "film-recommendation",
        title: "What Should We Watch?",
        situation: "You and a friend are choosing what to watch tonight.",
        agentRole: "You are Daniel, who is indecisive about what to watch. Ask the student for recommendations and challenge their opinions.",
        userGoal: "Recommend a film or series and explain why it's worth watching",
        targetPhrases: ["It's set in...", "It's about...", "I'd recommend it because...", "The acting was..."],
        successCriteria: ["Describes the plot briefly", "Gives an opinion with reasons", "Uses review vocabulary"],
      },
    ],
  },
];

// ============================================
// Module 7: Money & Business
// ============================================

const module7Lessons: LanguageLesson[] = [
  {
    id: "en-int-l19",
    slug: "quantifiers",
    title: "Quantifiers — How Much, How Many",
    content: `# Quantifiers — How Much, How Many

Use the right quantifiers with countable and uncountable nouns.

## Countable vs. Uncountable

| Countable | Uncountable |
|-----------|-------------|
| coins, bills, products | money, information, advice |
| employees, companies | work, traffic, furniture |

## Quantifier Chart

| | Countable | Uncountable | Both |
|---|---|---|---|
| Large amount | many, a few, several | much, a little, a bit of | a lot of, plenty of, some |
| Small amount | few (= not many) | little (= not much) | not enough, hardly any |
| Zero | no, none | no, none | any (in questions/negatives) |

## Examples

- There are **a few** things I need to buy.
- We don't have **much** time.
- She has **plenty of** experience.
- There is **hardly any** milk left.
- **How many** meetings do you have today?`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m7",
    moduleTitle: "Money & Business",
    order: 19,
    topicId: "en-intermediate-quantifiers",
    vocabulary: [
      {
        word: "budget",
        translation: "the amount of money available to spend",
        pronunciation: "/\u02C8b\u028Cd\u0292.\u026At/",
        exampleSentence: "We don't have much budget left for marketing.",
        exampleTranslation: "We don't have much budget left for marketing.",
        partOfSpeech: "noun",
      },
      {
        word: "profit",
        translation: "money gained after expenses are paid",
        pronunciation: "/\u02C8pr\u0252f.\u026At/",
        exampleSentence: "The company made a lot of profit this year.",
        exampleTranslation: "The company made a lot of profit this year.",
        partOfSpeech: "noun",
      },
      {
        word: "investment",
        translation: "money put into something to make more money",
        pronunciation: "/\u026An\u02C8vest.m\u0259nt/",
        exampleSentence: "Several investments have performed well.",
        exampleTranslation: "Several investments have performed well.",
        partOfSpeech: "noun",
      },
      {
        word: "expense",
        translation: "money spent on something; a cost",
        pronunciation: "/\u026Ak\u02C8spens/",
        exampleSentence: "Our biggest expense is rent.",
        exampleTranslation: "Our biggest expense is rent.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Few vs. A Few / Little vs. A Little",
        explanation: "**A few** and **a little** are positive (= some, enough). **Few** and **little** (without 'a') are negative (= not many, not much).",
        examples: [
          { correct: "I have a few ideas. (positive — some ideas)", translation: "I have a few ideas.", note: "Positive: I have some ideas." },
          { correct: "I have few ideas. (negative — not many)", translation: "I have few ideas.", note: "Negative: I don't have many ideas." },
          { correct: "There is a little time left. (positive — some time)", translation: "There is a little time left." },
          { correct: "There is little time left. (negative — almost none)", translation: "There is little time left." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "budget-meeting",
        title: "The Budget Meeting",
        situation: "You are in a team meeting discussing the department budget for the next quarter.",
        agentRole: "You are the finance director, Ms. Hall. Ask the student about their department's needs and challenge them to justify expenses using quantifiers.",
        userGoal: "Discuss budget needs using a variety of quantifiers correctly",
        targetPhrases: ["We need a lot of...", "We don't have much...", "There are several...", "We have hardly any..."],
        successCriteria: ["Uses quantifiers with countable and uncountable nouns", "Distinguishes few/a few, little/a little", "Justifies budget requests"],
      },
    ],
  },
  {
    id: "en-int-l20",
    slug: "linkers-contrast",
    title: "Linking Ideas — Contrast & Concession",
    content: `# Linking Ideas — Contrast & Concession

Connect ideas smoothly in writing and speaking, especially when presenting two sides.

## Contrast Linkers

| Linker | Use | Example |
|--------|-----|---------|
| **However,** | Starts a new contrasting sentence | The plan is expensive. However, it could work. |
| **Although** | Starts a clause (+ subject + verb) | Although it's risky, I think we should try. |
| **Despite / In spite of** | Followed by a noun or -ing | Despite the risks, the company expanded. |
| **On the other hand** | Presents an alternative viewpoint | It's cheaper. On the other hand, quality may suffer. |
| **While / Whereas** | Shows direct contrast | While I prefer working alone, my colleague prefers teamwork. |

## Addition & Result Linkers

- **Furthermore** / **Moreover** / **In addition** — adding a point
- **Therefore** / **As a result** / **Consequently** — showing a result
- **For example** / **For instance** — giving examples`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m7",
    moduleTitle: "Money & Business",
    order: 20,
    topicId: "en-intermediate-linkers-contrast",
    vocabulary: [
      {
        word: "however",
        translation: "used to introduce a contrasting statement",
        pronunciation: "/ha\u028A\u02C8ev.\u0259r/",
        exampleSentence: "The product is popular. However, it is also very expensive.",
        exampleTranslation: "The product is popular. However, it is also very expensive.",
        partOfSpeech: "adverb",
      },
      {
        word: "despite",
        translation: "without being affected by; in spite of",
        pronunciation: "/d\u026A\u02C8spa\u026At/",
        exampleSentence: "Despite the recession, the startup grew rapidly.",
        exampleTranslation: "Despite the recession, the startup grew rapidly.",
        partOfSpeech: "preposition",
      },
      {
        word: "moreover",
        translation: "in addition; what is more",
        pronunciation: "/m\u0254\u02D0r\u02C8\u0259\u028A.v\u0259r/",
        exampleSentence: "The plan is affordable. Moreover, it can be implemented quickly.",
        exampleTranslation: "The plan is affordable. Moreover, it can be implemented quickly.",
        partOfSpeech: "adverb",
      },
      {
        word: "consequently",
        translation: "as a result",
        pronunciation: "/\u02C8k\u0252n.s\u026A.kw\u0259nt.li/",
        exampleSentence: "Sales dropped. Consequently, several staff were let go.",
        exampleTranslation: "Sales dropped. Consequently, several staff were let go.",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "Although vs. Despite",
        explanation: "**Although** is followed by a clause (subject + verb). **Despite** is followed by a noun or -ing form.",
        examples: [
          { correct: "Although it was raining, we went out.", translation: "Although it was raining, we went out.", note: "Although + subject + verb." },
          { correct: "Despite the rain, we went out.", translation: "Despite the rain, we went out.", note: "Despite + noun." },
          { correct: "Despite being tired, she finished the report.", translation: "Despite being tired, she finished the report.", note: "Despite + -ing." },
        ],
        commonMistakes: [
          {
            incorrect: "Despite it was raining, we went out.",
            correction: "Despite the rain, we went out. / Although it was raining, we went out.",
            explanation: "'Despite' cannot be followed by a clause. Use a noun or -ing form after 'despite'.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "business-proposal",
        title: "Presenting a Business Proposal",
        situation: "You are presenting a business idea to potential investors and addressing pros and cons.",
        agentRole: "You are an investor, Mr. Okafor. Listen to the business pitch, ask tough questions, and push the student to address both advantages and disadvantages.",
        userGoal: "Present a business idea, acknowledging both strengths and weaknesses using linking words",
        targetPhrases: ["Although..., ...", "However,...", "Despite..., ...", "Furthermore,...", "On the other hand,..."],
        successCriteria: ["Uses at least three different linkers", "Addresses pros and cons", "Maintains a professional tone"],
      },
    ],
  },
  {
    id: "en-int-l21",
    slug: "finance-vocab-negotiations",
    title: "Finance Vocabulary & Negotiations",
    content: `# Finance Vocabulary & Negotiations

Handle money conversations with the right vocabulary and negotiation skills.

## Personal Finance

- **savings** — money kept for the future
- **debt** — money that you owe
- **mortgage** — a loan to buy a property
- **interest rate** — the percentage charged on a loan or earned on savings
- **tax** — money paid to the government
- **insurance** — protection against financial loss

## Business Finance

- **revenue** — total income before expenses
- **turnover** — the total sales of a company
- **shares/stock** — parts of ownership in a company
- **invoice** — a bill for goods or services
- **cash flow** — the movement of money in and out

## Negotiation Phrases

- I'd be willing to **offer**...
- Could we **agree on**...?
- That's a bit **higher than** we expected.
- Would you **consider**...?
- Let's **meet halfway**.
- I'm afraid that **doesn't work for us**.`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m7",
    moduleTitle: "Money & Business",
    order: 21,
    topicId: "en-intermediate-finance-vocab-negotiations",
    vocabulary: [
      {
        word: "mortgage",
        translation: "a bank loan used to buy property",
        pronunciation: "/\u02C8m\u0254\u02D0.\u0261\u026Ad\u0292/",
        exampleSentence: "They took out a mortgage to buy their first house.",
        exampleTranslation: "They took out a mortgage to buy their first house.",
        partOfSpeech: "noun",
      },
      {
        word: "interest rate",
        translation: "the percentage charged for borrowing money",
        pronunciation: "/\u02C8\u026An.tr\u0259st re\u026At/",
        exampleSentence: "The interest rate on savings accounts is very low.",
        exampleTranslation: "The interest rate on savings accounts is very low.",
        partOfSpeech: "noun",
      },
      {
        word: "revenue",
        translation: "the total income of a business",
        pronunciation: "/\u02C8rev.\u0259.nju\u02D0/",
        exampleSentence: "The company's revenue increased by twenty per cent.",
        exampleTranslation: "The company's revenue increased by twenty per cent.",
        partOfSpeech: "noun",
      },
      {
        word: "negotiate",
        translation: "to discuss in order to reach an agreement",
        pronunciation: "/n\u026A\u02C8\u0261\u0259\u028A.\u0283i.e\u026At/",
        exampleSentence: "We need to negotiate a better price with the supplier.",
        exampleTranslation: "We need to negotiate a better price with the supplier.",
        partOfSpeech: "verb",
      },
      {
        word: "invoice",
        translation: "a document requesting payment for goods or services",
        pronunciation: "/\u02C8\u026An.v\u0254\u026As/",
        exampleSentence: "Please send the invoice by the end of the month.",
        exampleTranslation: "Please send the invoice by the end of the month.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Polite Negotiation Language",
        explanation: "In negotiations, use **would**, **could**, and **conditional** forms to sound professional and avoid sounding demanding.",
        examples: [
          { correct: "Would you be willing to lower the price?", translation: "Would you be willing to lower the price?" },
          { correct: "I'm afraid that doesn't work for us.", translation: "I'm afraid that doesn't work for us.", note: "'I'm afraid' softens the refusal." },
          { correct: "Could we agree on a ten per cent discount?", translation: "Could we agree on a ten per cent discount?" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "price-negotiation",
        title: "Negotiating a Deal",
        situation: "You are negotiating the price of a service contract with a vendor.",
        agentRole: "You are the vendor, Ms. Rivera. You want to keep the price high but are willing to negotiate on terms. Push back politely on the student's requests.",
        userGoal: "Negotiate a better price or terms using polite negotiation language",
        targetPhrases: ["Would you consider...?", "Could we agree on...?", "That's higher than we expected.", "Let's meet halfway."],
        successCriteria: ["Uses polite language", "Makes a counteroffer", "Reaches a compromise"],
      },
    ],
    culturalNotes: [
      {
        title: "Negotiation Styles",
        content: "In British and American business, direct refusals are softened: 'I'm afraid that won't be possible' rather than just 'No.' In many Asian business cultures, silence is a negotiation tool and does not mean agreement. Understanding these differences is key to successful international negotiation in English.",
      },
    ],
  },
];

// ============================================
// Module 8: Communication
// ============================================

const module8Lessons: LanguageLesson[] = [
  {
    id: "en-int-l22",
    slug: "phrasal-verbs",
    title: "Essential Phrasal Verbs",
    content: `# Essential Phrasal Verbs

Phrasal verbs combine a verb with a particle (preposition/adverb) to create a new meaning.

## High-Frequency Phrasal Verbs

| Phrasal Verb | Meaning | Example |
|-------------|---------|---------|
| **look forward to** | anticipate with pleasure | I look forward to meeting you. |
| **come up with** | think of (an idea) | She came up with a great solution. |
| **get along with** | have a good relationship | I get along with my colleagues. |
| **put off** | postpone | Don't put off studying until the last minute. |
| **turn down** | reject/refuse | He turned down the job offer. |
| **give up** | stop trying | Never give up! |
| **find out** | discover | I need to find out the truth. |
| **bring up** | mention/raise a topic | She brought up an interesting point. |
| **carry on** | continue | Carry on with your work. |
| **run out of** | have no more left | We've run out of time. |

## Separable vs. Inseparable

- **Separable**: *Turn **the offer** down.* or *Turn down **the offer**.*
- **Inseparable**: *I look forward to **it**.* (NOT: ~~I look it forward to.~~)`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m8",
    moduleTitle: "Communication",
    order: 22,
    topicId: "en-intermediate-phrasal-verbs",
    vocabulary: [
      {
        word: "put off",
        translation: "to postpone; to delay",
        pronunciation: "/p\u028At \u0252f/",
        exampleSentence: "We had to put off the meeting until next week.",
        exampleTranslation: "We had to put off the meeting until next week.",
        partOfSpeech: "phrasal verb",
      },
      {
        word: "come up with",
        translation: "to think of; to produce (an idea or plan)",
        pronunciation: "/k\u028Cm \u028Cp w\u026A\u00F0/",
        exampleSentence: "Can you come up with a better plan?",
        exampleTranslation: "Can you come up with a better plan?",
        partOfSpeech: "phrasal verb",
      },
      {
        word: "turn down",
        translation: "to refuse or reject",
        pronunciation: "/t\u025C\u02D0n da\u028An/",
        exampleSentence: "She turned down the invitation.",
        exampleTranslation: "She turned down the invitation.",
        partOfSpeech: "phrasal verb",
      },
      {
        word: "bring up",
        translation: "to mention or introduce a topic",
        pronunciation: "/br\u026A\u014B \u028Cp/",
        exampleSentence: "He brought up the issue of overtime pay.",
        exampleTranslation: "He brought up the issue of overtime pay.",
        partOfSpeech: "phrasal verb",
      },
      {
        word: "look forward to",
        translation: "to feel excited about something in the future",
        pronunciation: "/l\u028Ak \u02C8f\u0254\u02D0.w\u0259d tu\u02D0/",
        exampleSentence: "I look forward to hearing from you.",
        exampleTranslation: "I look forward to hearing from you.",
        partOfSpeech: "phrasal verb",
      },
    ],
    grammarPoints: [
      {
        title: "Separable and Inseparable Phrasal Verbs",
        explanation: "With **separable** phrasal verbs, the object can go between the verb and particle or after. With **inseparable** verbs, the object must go after the full phrasal verb. If the object is a pronoun (it, them, her), it MUST go in the middle of a separable phrasal verb.",
        examples: [
          { correct: "Turn down the offer. / Turn the offer down.", translation: "Turn down the offer.", note: "Separable: both positions work." },
          { correct: "Turn it down.", translation: "Turn it down.", note: "Pronoun must go in the middle." },
          { correct: "I look forward to the trip.", translation: "I look forward to the trip.", note: "Inseparable: object stays after." },
        ],
        commonMistakes: [
          {
            incorrect: "I look it forward to.",
            correction: "I look forward to it.",
            explanation: "'Look forward to' is inseparable. The object always comes after the complete phrasal verb.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "phrasal-verb-story",
        title: "A Bad Day at Work",
        situation: "You are telling a friend about a terrible day at work, using as many phrasal verbs as possible.",
        agentRole: "You are Tom, a sympathetic friend. Listen to the story and ask follow-up questions that prompt the student to use more phrasal verbs.",
        userGoal: "Tell a story about a bad day using at least six different phrasal verbs",
        targetPhrases: ["I found out...", "We ran out of...", "I had to put off...", "My boss brought up...", "I almost gave up..."],
        successCriteria: ["Uses at least six phrasal verbs", "Uses them in natural context", "Tells a coherent story"],
      },
    ],
  },
  {
    id: "en-int-l23",
    slug: "formal-informal-register",
    title: "Formal vs. Informal Register",
    content: `# Formal vs. Informal Register

Knowing when to switch between formal and informal English is a key communication skill.

## When to Use Each Register

| Formal | Informal |
|--------|----------|
| Business emails & letters | Texts & social media |
| Job interviews | Conversations with friends |
| Academic writing | Casual spoken English |
| Speaking to authority | Speaking to peers |

## Key Differences

| Informal | Formal |
|----------|--------|
| Hi / Hey | Dear Sir/Madam |
| Thanks a lot | Thank you for your assistance |
| gonna, wanna | going to, want to |
| kids | children |
| get | obtain / receive |
| buy | purchase |
| help | assist |
| ask for | request |
| about | regarding / concerning |
| a lot of | numerous / a significant number of |

## Contractions

- Informal: *I'm, don't, can't, we'll*
- Formal: *I am, do not, cannot, we will*

## Slang & Idioms (Informal)

- **No worries** — It's not a problem.
- **Hang on** — Wait a moment.
- **That's a rip-off** — That's too expensive.
- **I'm knackered** — I'm very tired (British).`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m8",
    moduleTitle: "Communication",
    order: 23,
    topicId: "en-intermediate-formal-informal-register",
    vocabulary: [
      {
        word: "register",
        translation: "the level of formality in language",
        pronunciation: "/\u02C8red\u0292.\u026A.st\u0259r/",
        exampleSentence: "You need to adjust your register depending on the situation.",
        exampleTranslation: "You need to adjust your register depending on the situation.",
        partOfSpeech: "noun",
      },
      {
        word: "appropriate",
        translation: "suitable for a particular situation",
        pronunciation: "/\u0259\u02C8pr\u0259\u028A.pri.\u0259t/",
        exampleSentence: "Using slang in a job interview is not appropriate.",
        exampleTranslation: "Using slang in a job interview is not appropriate.",
        partOfSpeech: "adjective",
      },
      {
        word: "request",
        translation: "to ask for something formally",
        pronunciation: "/r\u026A\u02C8kwest/",
        exampleSentence: "I would like to request a meeting with the director.",
        exampleTranslation: "I would like to request a meeting with the director.",
        partOfSpeech: "verb",
      },
      {
        word: "regarding",
        translation: "about; concerning (formal)",
        pronunciation: "/r\u026A\u02C8\u0261\u0251\u02D0.d\u026A\u014B/",
        exampleSentence: "I am writing regarding your recent complaint.",
        exampleTranslation: "I am writing regarding your recent complaint.",
        partOfSpeech: "preposition",
      },
    ],
    grammarPoints: [
      {
        title: "Choosing the Right Register",
        explanation: "Match your language to the situation. In formal contexts, avoid contractions, slang, and phrasal verbs where a single-word equivalent exists.",
        examples: [
          { correct: "Formal: I would like to request further information regarding the position.", translation: "I would like to request further information regarding the position." },
          { correct: "Informal: Can you tell me more about the job?", translation: "Can you tell me more about the job?" },
          { correct: "Formal: The meeting has been postponed.", translation: "The meeting has been postponed." },
          { correct: "Informal: The meeting's been put off.", translation: "The meeting's been put off." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "register-switching",
        title: "Same Message, Different Register",
        situation: "Your coach gives you a scenario and you must say the same thing in both formal and informal English.",
        agentRole: "You are an English coach. Give the student situations (e.g., 'Ask someone to wait', 'Say no to an invitation') and ask them to respond in both formal and informal register.",
        userGoal: "Express the same ideas in both formal and informal English",
        targetPhrases: ["Could you possibly...?", "Hang on a sec", "I regret to inform you...", "Sorry, I can't make it"],
        successCriteria: ["Demonstrates clear formal register", "Demonstrates clear informal register", "Switches appropriately between them"],
      },
    ],
    culturalNotes: [
      {
        title: "Register in British vs. American English",
        content: "British English tends to use more formal hedging in professional contexts: 'I was wondering if you might...' vs. American 'Could you...?' British speakers also use understatement ('That's not ideal' = 'That's terrible'). Being aware of these differences helps you adapt to different English-speaking environments.",
      },
    ],
  },
  {
    id: "en-int-l24",
    slug: "presentations-conflict",
    title: "Presentations & Conflict Resolution",
    content: `# Presentations & Conflict Resolution

Deliver clear presentations and handle disagreements constructively.

## Presentation Structure

1. **Opening**: Good morning, everyone. Today I'd like to talk about...
2. **Outline**: I'll cover three main points. First... Second... Finally...
3. **Body**: Let me start with... / Moving on to... / Now let's look at...
4. **Visuals**: As you can see from this graph/chart...
5. **Summary**: To sum up... / In conclusion...
6. **Questions**: Does anyone have any questions?

## Signposting Language

- **First of all,...**
- **Another important point is...**
- **Turning to the next topic,...**
- **As I mentioned earlier,...**
- **In other words,...**

## Conflict Resolution Phrases

- I **understand your point**, but...
- Could you **explain what you mean** by...?
- I think there's been a **misunderstanding**.
- Let's **find a compromise**.
- I **didn't mean to** offend you.
- We need to **agree to disagree** on this.
- How can we **resolve** this?`,
    targetLanguage: "en",
    proficiencyLevel: "B1",
    moduleId: "en-int-m8",
    moduleTitle: "Communication",
    order: 24,
    topicId: "en-intermediate-presentations-conflict",
    vocabulary: [
      {
        word: "compromise",
        translation: "an agreement where both sides give up something",
        pronunciation: "/\u02C8k\u0252m.pr\u0259.ma\u026Az/",
        exampleSentence: "We need to find a compromise that works for everyone.",
        exampleTranslation: "We need to find a compromise that works for everyone.",
        partOfSpeech: "noun",
      },
      {
        word: "misunderstanding",
        translation: "a failure to understand correctly",
        pronunciation: "/\u02CCm\u026As.\u028An.d\u0259\u02C8st\u00E6n.d\u026A\u014B/",
        exampleSentence: "I think there's been a misunderstanding about the deadline.",
        exampleTranslation: "I think there's been a misunderstanding about the deadline.",
        partOfSpeech: "noun",
      },
      {
        word: "resolve",
        translation: "to find a solution to a problem",
        pronunciation: "/r\u026A\u02C8z\u0252lv/",
        exampleSentence: "Let's try to resolve this issue quickly.",
        exampleTranslation: "Let's try to resolve this issue quickly.",
        partOfSpeech: "verb",
      },
      {
        word: "constructive",
        translation: "helpful and intended to improve",
        pronunciation: "/k\u0259n\u02C8str\u028Ck.t\u026Av/",
        exampleSentence: "Please give constructive feedback, not just criticism.",
        exampleTranslation: "Please give constructive feedback, not just criticism.",
        partOfSpeech: "adjective",
      },
      {
        word: "perspective",
        translation: "a particular way of looking at something",
        pronunciation: "/p\u0259\u02C8spek.t\u026Av/",
        exampleSentence: "I'd like to hear your perspective on this.",
        exampleTranslation: "I'd like to hear your perspective on this.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Signposting in Presentations",
        explanation: "Use signposting phrases to guide your audience through a talk. They make your presentation easier to follow.",
        examples: [
          { correct: "First of all, I'd like to give you some background.", translation: "First of all, I'd like to give you some background." },
          { correct: "Moving on to the second point...", translation: "Moving on to the second point..." },
          { correct: "To sum up, there are three key takeaways.", translation: "To sum up, there are three key takeaways." },
        ],
      },
      {
        title: "Acknowledging Others' Views in Disagreements",
        explanation: "Before disagreeing, acknowledge the other person's point. This keeps the conversation constructive.",
        examples: [
          { correct: "I see what you mean, but I think there's another way to look at it.", translation: "I see what you mean, but I think there's another way to look at it." },
          { correct: "That's a valid point. However, in my experience...", translation: "That's a valid point. However, in my experience..." },
        ],
        commonMistakes: [
          {
            incorrect: "You're wrong. The data shows...",
            correction: "I understand your point, but the data suggests...",
            explanation: "Saying 'You're wrong' directly is confrontational. Soften with acknowledgement first.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "mini-presentation",
        title: "Give a Short Presentation",
        situation: "You are giving a three-minute presentation to your English class on a topic of your choice.",
        agentRole: "You are the teacher, Mrs. Kim. Listen to the presentation, then ask two questions. Give feedback on structure and signposting.",
        userGoal: "Deliver a structured mini-presentation with clear signposting language",
        targetPhrases: ["Today I'd like to talk about...", "First of all...", "Moving on to...", "To sum up...", "Does anyone have any questions?"],
        successCriteria: ["Uses clear opening", "Uses signposting phrases", "Delivers a structured conclusion", "Handles questions"],
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  {
    id: "en-int-m1",
    title: "Module 1: Life Stories",
    description: "Present perfect, past continuous, and talking about life events",
    order: 1,
    lessons: module1Lessons,
  },
  {
    id: "en-int-m2",
    title: "Module 2: Work & Career",
    description: "Workplace vocabulary, job interviews, gerunds vs infinitives, formal emails",
    order: 2,
    lessons: module2Lessons,
  },
  {
    id: "en-int-m3",
    title: "Module 3: Travel & Tourism",
    description: "Comparatives, superlatives, 'used to', and handling travel problems",
    order: 3,
    lessons: module3Lessons,
  },
  {
    id: "en-int-m4",
    title: "Module 4: Media & Technology",
    description: "Passive voice, relative clauses, news vocabulary, and social media debates",
    order: 4,
    lessons: module4Lessons,
  },
  {
    id: "en-int-m5",
    title: "Module 5: Education & Environment",
    description: "First, second, and third conditionals, wish + past, sustainability topics",
    order: 5,
    lessons: module5Lessons,
  },
  {
    id: "en-int-m6",
    title: "Module 6: Culture & Society",
    description: "Reported speech, cultural comparisons, customs, and entertainment reviews",
    order: 6,
    lessons: module6Lessons,
  },
  {
    id: "en-int-m7",
    title: "Module 7: Money & Business",
    description: "Quantifiers, contrast linkers, finance vocabulary, and negotiations",
    order: 7,
    lessons: module7Lessons,
  },
  {
    id: "en-int-m8",
    title: "Module 8: Communication",
    description: "Phrasal verbs, formal vs informal register, presentations, and conflict resolution",
    order: 8,
    lessons: module8Lessons,
  },
];

export const englishIntermediateCourse: LanguageCourse = {
  ...courseInfo,
  modules,
};

// Helper function to get all lessons
export function getEnglishIntermediateLessons() {
  return modules.flatMap((m) => m.lessons);
}

// Helper function to find a lesson by slug
export function findEnglishIntermediateLesson(slug: string) {
  return getEnglishIntermediateLessons().find((l) => l.slug === slug);
}
